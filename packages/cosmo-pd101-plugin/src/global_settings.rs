use std::fs;
use std::path::{Path, PathBuf};
#[cfg(test)]
use std::sync::Mutex;
use std::sync::RwLock;
use std::sync::atomic::{AtomicU64, Ordering};

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
    static WRITE_COUNTER: AtomicU64 = AtomicU64::new(0);
    let pid = std::process::id() as u64;
    let seq = WRITE_COUNTER.fetch_add(1, Ordering::Relaxed);
    let tmp_path = path.with_extension(format!("tmp_{pid}_{seq}"));
    std::fs::write(&tmp_path, data).map_err(|error| error.to_string())?;
    std::fs::rename(&tmp_path, path).map_err(|error| error.to_string())?;
    Ok(())
}

fn write_global_settings_to_disk(settings: &PluginGlobalSettings) -> Result<(), String> {
    let path = get_global_settings_path();
    let json = serde_json::to_vec_pretty(settings).map_err(|error| error.to_string())?;
    atomic_write(&path, &json)
}

fn read_global_settings_from_disk() -> Result<PluginGlobalSettings, String> {
    let path = get_global_settings_path();
    if path.exists() {
        let bytes = fs::read(&path).map_err(|error| error.to_string())?;
        serde_json::from_slice(&bytes).map_err(|error| error.to_string())
    } else {
        Ok(PluginGlobalSettings::default())
    }
}

/// Serializes the full read/modify/write cycle under a single write lock.
/// Cache is only updated after a successful disk write, eliminating lost-update races.
fn update_global_settings(
    update: impl FnOnce(&mut PluginGlobalSettings),
) -> Result<PluginGlobalSettings, String> {
    let mut cache_guard = GLOBAL_SETTINGS_CACHE.write().unwrap();

    let mut settings: PluginGlobalSettings = match cache_guard.as_ref() {
        Some(s) => s.clone(),
        None => {
            let s = read_global_settings_from_disk()?;
            *cache_guard = Some(s.clone());
            s
        }
    };

    update(&mut settings);

    write_global_settings_to_disk(&settings)?;
    *cache_guard = Some(settings.clone());

    Ok(settings)
}

pub fn save_global_settings(settings: &PluginGlobalSettings) -> Result<(), String> {
    update_global_settings(|s| {
        *s = settings.clone();
    })?;
    Ok(())
}

pub fn load_or_init_global_settings() -> Result<PluginGlobalSettings, String> {
    // Fast path: cache hit under read lock.
    {
        let cache = GLOBAL_SETTINGS_CACHE.read().unwrap();
        if let Some(settings) = cache.as_ref() {
            return Ok(settings.clone());
        }
    }

    // Slow path: acquire write lock and double-check before disk I/O.
    // This prevents a concurrent update_global_settings from being clobbered.
    let mut cache = GLOBAL_SETTINGS_CACHE.write().unwrap();

    if let Some(settings) = cache.as_ref() {
        return Ok(settings.clone());
    }

    let settings = read_global_settings_from_disk()?;

    if !get_global_settings_path().exists() {
        write_global_settings_to_disk(&settings)?;
    }

    *cache = Some(settings.clone());
    Ok(settings)
}

pub fn save_voice_limit(limit: u8) -> Result<(), String> {
    let clamped = limit.clamp(MIN_VOICE_LIMIT, MAX_VOICE_LIMIT);
    update_global_settings(|settings| {
        settings.voice_limit = clamped;
    })?;
    Ok(())
}

pub fn save_midi_learn_bindings(bindings: Vec<MidiLearnBinding>) -> Result<(), String> {
    update_global_settings(|settings| {
        settings.midi_learn_bindings = bindings;
    })?;
    Ok(())
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
    fn global_settings_json_excludes_preset_voice_fields() {
        let json = serde_json::to_value(PluginGlobalSettings::default()).unwrap();
        assert!(json.get("portamento").is_none());
        assert!(json.get("pitchBendRange").is_none());
        assert!(json.get("velocityCurve").is_none());
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

    #[test]
    fn save_global_settings_after_cache_init_updates_cache() {
        with_test_data_dir(|_| {
            load_or_init_global_settings().unwrap();

            let new_settings = PluginGlobalSettings {
                voice_limit: 12,
                ..Default::default()
            };
            save_global_settings(&new_settings).unwrap();

            let loaded = load_or_init_global_settings().unwrap();
            assert_eq!(loaded.voice_limit, 12);
        });
    }

    #[test]
    fn save_voice_limit_and_midi_learn_preserve_each_other_sequential() {
        with_test_data_dir(|_| {
            save_voice_limit(4).unwrap();
            save_midi_learn_bindings(vec![]).unwrap();

            let settings = load_or_init_global_settings().unwrap();
            assert_eq!(settings.voice_limit, 4);
            assert!(settings.midi_learn_bindings.is_empty());
        });
    }

    #[test]
    fn write_failure_does_not_update_cache() {
        let _guard = TEST_DATA_DIR_LOCK
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        let path = std::env::temp_dir().join("cosmo-pd101-global-settings-readonly");
        fs::create_dir_all(&path).unwrap();
        unsafe {
            std::env::set_var("COSMO_PD101_DATA_DIR", &path);
        }
        reset_global_settings_cache();

        let original = load_or_init_global_settings().unwrap();

        let mut perms = fs::metadata(&path).unwrap().permissions();
        perms.set_readonly(true);
        fs::set_permissions(&path, perms).unwrap();

        assert!(save_voice_limit(12).is_err());

        let cache = GLOBAL_SETTINGS_CACHE.read().unwrap();
        assert_eq!(cache.as_ref().unwrap().voice_limit, original.voice_limit);
        drop(cache);

        reset_global_settings_cache();
        let mut perms = fs::metadata(&path).unwrap().permissions();
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            perms.set_mode(0o755);
        }
        #[cfg(not(unix))]
        perms.set_readonly(false);
        fs::set_permissions(&path, perms).unwrap();
        unsafe {
            std::env::remove_var("COSMO_PD101_DATA_DIR");
        }
        let _ = fs::remove_dir_all(path);
    }

    #[test]
    fn concurrent_load_and_save_does_not_lose_updates() {
        with_test_data_dir(|_| {
            use std::sync::{Arc, Barrier};
            use std::thread;

            save_global_settings(&PluginGlobalSettings {
                voice_limit: 8,
                ..Default::default()
            })
            .unwrap();
            reset_global_settings_cache();

            let barrier = Arc::new(Barrier::new(2));

            let t1 = {
                let b = Arc::clone(&barrier);
                thread::spawn(move || {
                    b.wait();
                    load_or_init_global_settings().unwrap()
                })
            };

            let t2 = {
                let b = Arc::clone(&barrier);
                thread::spawn(move || {
                    b.wait();
                    save_voice_limit(4).unwrap()
                })
            };

            t1.join().unwrap();
            t2.join().unwrap();

            let cache = GLOBAL_SETTINGS_CACHE.read().unwrap();
            assert_eq!(cache.as_ref().unwrap().voice_limit, 4);
        });
    }

    #[test]
    fn save_global_settings_preserves_across_fields_sequential() {
        with_test_data_dir(|_| {
            save_voice_limit(4).unwrap();

            let midi_bindings = vec![crate::session_state::MidiLearnBinding {
                param_key: "macro1".to_string(),
                channel: 0,
                cc: 1,
            }];
            save_midi_learn_bindings(midi_bindings.clone()).unwrap();

            let settings = load_or_init_global_settings().unwrap();
            assert_eq!(settings.voice_limit, 4);
            assert_eq!(settings.midi_learn_bindings, midi_bindings);

            save_voice_limit(8).unwrap();
            let settings = load_or_init_global_settings().unwrap();
            assert_eq!(settings.voice_limit, 8);
            assert_eq!(settings.midi_learn_bindings, midi_bindings);
        });
    }
}
