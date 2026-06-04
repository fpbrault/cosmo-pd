use std::path::PathBuf;

const SQLITE_FILE_NAME: &str = "preset_library.sqlite3";
const LEGACY_JSON_FILE_NAME: &str = "preset_library.json";

/// Resolve the platform-appropriate path for `preset_library.sqlite3`.
///
/// Resolution order:
/// 1. `COSMO_PD101_DATA_DIR` env var (set by AUv3 host for sandbox‑aware path)
/// 2. Platform‑specific fallback (see table below)
///
/// | Platform | Fallback path |
/// |----------|---------------|
/// | macOS (VST3/CLAP) | `~/Library/Application Support/com.cosmo-pd101/` |
/// | macOS (AUv3) | `$COSMO_PD101_DATA_DIR/preset_library.sqlite3` (env var) |
/// | Linux | `$XDG_DATA_HOME/cosmo-pd101/` → `~/.local/share/cosmo-pd101/` |
/// | Windows | `{FOLDERID_RoamingAppData}\Cosmo PD101\` |
pub fn get_preset_library_path() -> PathBuf {
    if let Ok(path) = std::env::var("COSMO_PD101_DATA_DIR") {
        return PathBuf::from(path).join(SQLITE_FILE_NAME);
    }

    cfg_if::cfg_if! {
        if #[cfg(target_os = "macos")] {
            macos_fallback_path()
        } else if #[cfg(target_os = "linux")] {
            linux_fallback_path()
        } else if #[cfg(target_os = "windows")] {
            windows_fallback_path()
        } else {
            PathBuf::from("preset_library.json")
        }
    }
}

pub fn get_legacy_preset_library_path() -> PathBuf {
    let sqlite_path = get_preset_library_path();
    sqlite_path.with_file_name(LEGACY_JSON_FILE_NAME)
}

// --- Platform-specific fallbacks ---

/// macOS: `~/Library/Application Support/com.cosmo-pd101/preset_library.sqlite3`
///
/// Does NOT use `dirs` (it is not a dep on macOS).  Relies on `$HOME`
/// which is correct for VST3/CLAP outside the AUv3 sandbox.
/// AUv3 must set `COSMO_PD101_DATA_DIR` before the Rust plugin is loaded.
#[cfg(target_os = "macos")]
fn macos_fallback_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_default();
    PathBuf::from(home).join(format!(
        "Library/Application Support/com.cosmo-pd101/{SQLITE_FILE_NAME}"
    ))
}

/// Linux: `$XDG_DATA_HOME/cosmo-pd101/preset_library.sqlite3`
/// Falls back to `~/.local/share/cosmo-pd101/preset_library.sqlite3`.
#[cfg(target_os = "linux")]
fn linux_fallback_path() -> PathBuf {
    if let Ok(xdg) = std::env::var("XDG_DATA_HOME") {
        PathBuf::from(xdg)
            .join("cosmo-pd101")
            .join(SQLITE_FILE_NAME)
    } else if let Some(data_dir) = dirs::data_dir() {
        data_dir.join("cosmo-pd101").join(SQLITE_FILE_NAME)
    } else {
        let home = std::env::var("HOME").unwrap_or_default();
        PathBuf::from(home)
            .join(".local/share/cosmo-pd101")
            .join(SQLITE_FILE_NAME)
    }
}

/// Windows: `{FOLDERID_RoamingAppData}\Cosmo PD101\preset_library.sqlite3`
#[cfg(target_os = "windows")]
fn windows_fallback_path() -> PathBuf {
    if let Some(data_dir) = dirs::data_dir() {
        data_dir.join("Cosmo PD101").join(SQLITE_FILE_NAME)
    } else {
        PathBuf::from(SQLITE_FILE_NAME)
    }
}
