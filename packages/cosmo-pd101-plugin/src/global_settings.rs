use std::fs;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use crate::session_state::{MidiLearnBinding, default_midi_bindings};

const GLOBAL_SETTINGS_FILE_NAME: &str = "global_settings.json";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PluginGlobalSettings {
    #[serde(default = "default_midi_bindings")]
    pub midi_learn_bindings: Vec<MidiLearnBinding>,
}

impl Default for PluginGlobalSettings {
    fn default() -> Self {
        Self {
            midi_learn_bindings: default_midi_bindings(),
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
    save_global_settings(&PluginGlobalSettings {
        midi_learn_bindings: bindings,
    })
}
