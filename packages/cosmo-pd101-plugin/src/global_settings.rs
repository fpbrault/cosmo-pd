use std::fs;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use crate::session_state::{MidiLearnBinding, default_midi_bindings};

const GLOBAL_SETTINGS_FILE_NAME: &str = "global_settings.json";

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Default)]
#[serde(rename_all = "lowercase")]
pub enum PluginLogLevel {
    Error,
    Warn,
    #[default]
    Info,
    Debug,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PluginGlobalSettings {
    #[serde(default = "default_midi_bindings")]
    pub midi_learn_bindings: Vec<MidiLearnBinding>,
    #[serde(default)]
    pub log_level: PluginLogLevel,
}

impl Default for PluginGlobalSettings {
    fn default() -> Self {
        Self {
            midi_learn_bindings: default_midi_bindings(),
            log_level: PluginLogLevel::Error,
        }
    }
}

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

pub fn save_global_settings(settings: &PluginGlobalSettings) -> Result<(), String> {
    let path = get_global_settings_path();
    ensure_parent_dir(&path)?;
    let json = serde_json::to_vec_pretty(settings).map_err(|error| error.to_string())?;
    fs::write(path, json).map_err(|error| error.to_string())
}

pub fn load_or_init_global_settings() -> Result<PluginGlobalSettings, String> {
    let path = get_global_settings_path();
    if path.exists() {
        let bytes = fs::read(&path).map_err(|error| error.to_string())?;
        return serde_json::from_slice(&bytes).map_err(|error| error.to_string());
    }

    let settings = PluginGlobalSettings::default();
    save_global_settings(&settings)?;
    Ok(settings)
}

pub fn save_midi_learn_bindings(bindings: Vec<MidiLearnBinding>) -> Result<(), String> {
    let mut settings = load_or_init_global_settings()?;
    settings.midi_learn_bindings = bindings;
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
        let unique = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|duration| duration.as_nanos())
            .unwrap_or_default();
        let path = std::env::temp_dir().join(format!("cosmo-pd101-global-settings-{}", unique));
        fs::create_dir_all(&path).unwrap();
        unsafe {
            std::env::set_var("COSMO_PD101_DATA_DIR", &path);
        }
        let result = test_fn(path.clone());
        unsafe {
            std::env::remove_var("COSMO_PD101_DATA_DIR");
        }
        let _ = fs::remove_dir_all(path);
        result
    }

    #[test]
    fn default_global_settings_use_info_log_level() {
        let settings = PluginGlobalSettings::default();
        assert_eq!(settings.log_level, PluginLogLevel::Info);
    }

    #[test]
    fn deserializing_without_log_level_uses_default() {
        let settings: PluginGlobalSettings = serde_json::from_str(
            r#"{"midiLearnBindings":[{"paramKey":"macro1","channel":-1,"cc":1}]}"#,
        )
        .unwrap();

        assert_eq!(settings.log_level, PluginLogLevel::Info);
    }

    #[test]
    fn save_midi_learn_bindings_preserves_existing_log_level() {
        with_test_data_dir(|_| {
            save_global_settings(&PluginGlobalSettings {
                midi_learn_bindings: default_midi_bindings(),
                log_level: PluginLogLevel::Debug,
            })
            .unwrap();

            save_midi_learn_bindings(vec![]).unwrap();

            let settings = load_or_init_global_settings().unwrap();
            assert_eq!(settings.log_level, PluginLogLevel::Debug);
            assert!(settings.midi_learn_bindings.is_empty());
        });
    }
}
