use std::fs;
use std::path::{Path, PathBuf};
#[cfg(test)]
use std::sync::Mutex;
use std::sync::RwLock;

use serde::{Deserialize, Serialize};

use crate::session_state::{MidiLearnBinding, default_midi_bindings};

static GLOBAL_SETTINGS_CACHE: RwLock<Option<PluginGlobalSettings>> = RwLock::new(None);

const GLOBAL_SETTINGS_FILE_NAME: &str = "global_settings.json";

pub const DEFAULT_VOICE_LIMIT: u8 = 8;
pub const MIN_VOICE_LIMIT: u8 = 1;
pub const MAX_VOICE_LIMIT: u8 = 16;

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Default)]
#[serde(rename_all = "lowercase")]
pub enum PluginLogLevel {
    #[default]
    Error,
    Warn,
    Info,
    Debug,
}

fn default_voice_limit() -> u8 {
    DEFAULT_VOICE_LIMIT
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PluginGlobalSettings {
    #[serde(default = "default_midi_bindings")]
    pub midi_learn_bindings: Vec<MidiLearnBinding>,
    #[serde(default)]
    pub log_level: PluginLogLevel,
    #[serde(default = "default_voice_limit")]
    pub voice_limit: u8,
}

impl PluginGlobalSettings {
    pub fn clamped_voice_limit(&self) -> u8 {
        self.voice_limit.clamp(MIN_VOICE_LIMIT, MAX_VOICE_LIMIT)
    }
}

impl Default for PluginGlobalSettings {
    fn default() -> Self {
        Self {
            midi_learn_bindings: default_midi_bindings(),
            log_level: PluginLogLevel::Error,
            voice_limit: DEFAULT_VOICE_LIMIT,
        }
    }
}

#[cfg(test)]
pub(crate) fn reset_global_settings_cache() {
    *GLOBAL_SETTINGS_CACHE.write().unwrap() = None;
}

#[cfg(test)]
pub(crate) static TEST_DATA_DIR_LOCK: Mutex<()> = Mutex::new(());

pub fn get_global_settings_path() -> PathBuf {
    if let Ok(path) = std::env::var("COSMO_PD101_DATA_DIR") {
        return PathBuf::from(path).join(GLOBAL_SETTINGS_FILE_NAME);
    }

    #[cfg(test)]
    if std::env::var("COSMO_PD101_DATA_DIR").is_err() {
        return std::env::temp_dir()
            .join("cosmo-pd101-plugin-tests")
            .join(GLOBAL_SETTINGS_FILE_NAME);
    }

    cfg_if::cfg_if! {
        if #[cfg(target_os = "macos")] {
            macos_fallback_path()
        } else if #[cfg(target_os = "linux")] {
            linux_fallback_path()
        } else if #[cfg(target_os = "windows")] {
            windows_fallback_path()
        } else {
            PathBuf::from(GLOBAL_SETTINGS_FILE_NAME)
        }
    }
}

#[cfg(target_os = "macos")]
fn macos_fallback_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_default();
    PathBuf::from(home).join(format!(
        "Library/Application Support/com.cosmo-pd101/{GLOBAL_SETTINGS_FILE_NAME}"
    ))
}

#[cfg(target_os = "linux")]
fn linux_fallback_path() -> PathBuf {
    if let Ok(xdg) = std::env::var("XDG_DATA_HOME") {
        PathBuf::from(xdg)
            .join("cosmo-pd101")
            .join(GLOBAL_SETTINGS_FILE_NAME)
    } else if let Some(data_dir) = dirs::data_dir() {
        data_dir.join("cosmo-pd101").join(GLOBAL_SETTINGS_FILE_NAME)
    } else {
        let home = std::env::var("HOME").unwrap_or_default();
        PathBuf::from(home)
            .join(".local/share/cosmo-pd101")
            .join(GLOBAL_SETTINGS_FILE_NAME)
    }
}

#[cfg(target_os = "windows")]
fn windows_fallback_path() -> PathBuf {
    if let Some(data_dir) = dirs::data_dir() {
        data_dir.join("Cosmo PD101").join(GLOBAL_SETTINGS_FILE_NAME)
    } else {
        PathBuf::from(GLOBAL_SETTINGS_FILE_NAME)
    }
}

fn ensure_parent_dir(path: &Path) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    }
    Ok(())
}

fn atomic_write(path: &Path, data: &[u8]) -> Result<(), String> {
    ensure_parent_dir(path)?;
    let tmp_path = path.with_extension("tmp");
    std::fs::write(&tmp_path, data).map_err(|error| error.to_string())?;
    std::fs::rename(&tmp_path, path).map_err(|error| error.to_string())?;
    Ok(())
}

pub fn save_global_settings(settings: &PluginGlobalSettings) -> Result<(), String> {
    let path = get_global_settings_path();
    let json = serde_json::to_vec_pretty(settings).map_err(|error| error.to_string())?;
    atomic_write(&path, &json)
}

pub fn load_or_init_global_settings() -> Result<PluginGlobalSettings, String> {
    {
        let cache = GLOBAL_SETTINGS_CACHE.read().unwrap();
        if let Some(ref settings) = *cache {
            return Ok(settings.clone());
        }
    }

    let path = get_global_settings_path();
    let settings = if path.exists() {
        let bytes = fs::read(&path).map_err(|error| error.to_string())?;
        serde_json::from_slice(&bytes).map_err(|error| error.to_string())?
    } else {
        let settings = PluginGlobalSettings::default();
        save_global_settings(&settings)?;
        settings
    };

    *GLOBAL_SETTINGS_CACHE.write().unwrap() = Some(settings.clone());
    Ok(settings)
}

pub fn save_voice_limit(limit: u8) -> Result<(), String> {
    let clamped = limit.clamp(MIN_VOICE_LIMIT, MAX_VOICE_LIMIT);

    let cache_empty = GLOBAL_SETTINGS_CACHE.read().unwrap().is_none();
    if cache_empty {
        load_or_init_global_settings()?;
    }

    let settings = {
        let mut cache = GLOBAL_SETTINGS_CACHE.write().unwrap();
        let cached = cache.as_mut().expect("cache populated above");
        cached.voice_limit = clamped;
        cached.clone()
    };

    save_global_settings(&settings)
}

pub fn save_midi_learn_bindings(bindings: Vec<MidiLearnBinding>) -> Result<(), String> {
    let cache_empty = GLOBAL_SETTINGS_CACHE.read().unwrap().is_none();
    if cache_empty {
        load_or_init_global_settings()?;
    }

    let settings = {
        let mut cache = GLOBAL_SETTINGS_CACHE.write().unwrap();
        let cached = cache.as_mut().expect("cache populated above");
        cached.midi_learn_bindings = bindings;
        cached.clone()
    };

    save_global_settings(&settings)
}

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;
    use crate::session_state::default_midi_bindings;

    fn with_test_data_dir<T>(test_fn: impl FnOnce(PathBuf) -> T) -> T {
        let _guard = TEST_DATA_DIR_LOCK
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        let unique = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|duration| duration.as_nanos())
            .unwrap_or_default();
        let path = std::env::temp_dir().join(format!("cosmo-pd101-global-settings-{}", unique));
        fs::create_dir_all(&path).unwrap();
        unsafe {
            std::env::set_var("COSMO_PD101_DATA_DIR", &path);
        }
        reset_global_settings_cache();
        let result = test_fn(path.clone());
        unsafe {
            std::env::remove_var("COSMO_PD101_DATA_DIR");
        }
        reset_global_settings_cache();
        let _ = fs::remove_dir_all(path);
        result
    }

    #[test]
    fn default_global_settings_use_error_log_level() {
        let settings = PluginGlobalSettings::default();
        assert_eq!(settings.log_level, PluginLogLevel::Error);
    }

    #[test]
    fn deserializing_without_log_level_uses_default() {
        let settings: PluginGlobalSettings = serde_json::from_str(
            r#"{"midiLearnBindings":[{"paramKey":"macro1","channel":-1,"cc":1}]}"#,
        )
        .unwrap();

        assert_eq!(settings.log_level, PluginLogLevel::Error);
    }

    #[test]
    fn save_midi_learn_bindings_preserves_existing_log_level() {
        with_test_data_dir(|_| {
            save_global_settings(&PluginGlobalSettings {
                midi_learn_bindings: default_midi_bindings(),
                log_level: PluginLogLevel::Debug,
                voice_limit: DEFAULT_VOICE_LIMIT,
            })
            .unwrap();

            save_midi_learn_bindings(vec![]).unwrap();

            let settings = load_or_init_global_settings().unwrap();
            assert_eq!(settings.log_level, PluginLogLevel::Debug);
            assert!(settings.midi_learn_bindings.is_empty());
        });
    }

    #[test]
    fn default_voice_limit_is_eight() {
        let settings = PluginGlobalSettings::default();
        assert_eq!(settings.voice_limit, DEFAULT_VOICE_LIMIT);
    }

    #[test]
    fn deserializing_without_voice_limit_defaults_to_eight() {
        let settings: PluginGlobalSettings =
            serde_json::from_str(r#"{"midiLearnBindings":[],"logLevel":"error"}"#).unwrap();
        assert_eq!(settings.voice_limit, DEFAULT_VOICE_LIMIT);
    }

    #[test]
    fn deserializing_with_voice_limit_preserves_value() {
        let settings: PluginGlobalSettings =
            serde_json::from_str(r#"{"midiLearnBindings":[],"logLevel":"error","voiceLimit":12}"#)
                .unwrap();
        assert_eq!(settings.voice_limit, 12);
    }

    #[test]
    fn clamped_voice_limit_bounds() {
        let low = PluginGlobalSettings {
            voice_limit: 0,
            ..Default::default()
        };
        assert_eq!(low.clamped_voice_limit(), MIN_VOICE_LIMIT);

        let high = PluginGlobalSettings {
            voice_limit: 17,
            ..Default::default()
        };
        assert_eq!(high.clamped_voice_limit(), MAX_VOICE_LIMIT);

        let normal = PluginGlobalSettings {
            voice_limit: 8,
            ..Default::default()
        };
        assert_eq!(normal.clamped_voice_limit(), 8);
    }

    #[test]
    fn voice_limit_round_trips_through_save_load() {
        with_test_data_dir(|_| {
            let settings = PluginGlobalSettings {
                voice_limit: 4,
                ..Default::default()
            };
            save_global_settings(&settings).unwrap();
            let loaded = load_or_init_global_settings().unwrap();
            assert_eq!(loaded.voice_limit, 4);
        });
    }
}
