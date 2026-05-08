//! Shared utilities for xtask.

use std::fs;
use std::io::IsTerminal;
use std::path::{Path, PathBuf};

use serde::Deserialize;

/// Simplified plugin config from Config.toml for xtask use.
#[derive(Deserialize)]
struct ConfigFile {
    bundle_identifier_prefix: Option<String>,
}

/// Print an error message, with red color if stderr is a terminal.
pub fn print_error(msg: &str) {
    if std::io::stderr().is_terminal() {
        eprintln!("\x1b[1;31mError:\x1b[0m {}", msg);
    } else {
        eprintln!("Error: {}", msg);
    }
}

/// Print status message (always shown)
#[macro_export]
macro_rules! status {
    ($($arg:tt)*) => {
        println!($($arg)*)
    };
}

/// Print verbose message (only in verbose mode)
#[macro_export]
macro_rules! verbose {
    ($verbose:expr, $($arg:tt)*) => {
        if $verbose {
            println!($($arg)*)
        }
    };
}

/// Shorten home directory in path for display
#[must_use]
pub fn shorten_path(path: &Path) -> String {
    if let Some(home) = std::env::var_os("HOME") {
        let home_path = PathBuf::from(home);
        if let Ok(stripped) = path.strip_prefix(&home_path) {
            return format!("~/{}", stripped.display());
        }
    }
    path.display().to_string()
}

/// Architecture configuration for builds
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Arch {
    /// Build for current machine's architecture only
    Native,
    /// Build universal binary (x86_64 + arm64)
    Universal,
    /// Build for arm64 only
    Arm64,
    /// Build for x86_64 only
    X86_64,
}

impl Arch {
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "native" => Some(Arch::Native),
            "universal" => Some(Arch::Universal),
            "arm64" | "aarch64" => Some(Arch::Arm64),
            "x86_64" | "x86-64" | "intel" => Some(Arch::X86_64),
            _ => None,
        }
    }
}

/// Returns Cargo's effective target directory, honoring CARGO_TARGET_DIR.
///
/// Relative CARGO_TARGET_DIR values are resolved from the workspace root,
/// matching how xtask invokes cargo commands.
#[must_use]
pub fn cargo_target_dir(workspace_root: &Path) -> PathBuf {
    if let Some(target_dir) = std::env::var_os("CARGO_TARGET_DIR") {
        let path = PathBuf::from(target_dir);
        if path.is_absolute() {
            path
        } else {
            workspace_root.join(path)
        }
    } else {
        workspace_root.join("target")
    }
}

/// Returns Cargo's effective target directory for a specific package.
///
/// If CARGO_TARGET_DIR is set, that value is honored.
/// Otherwise this defaults to the package-local target directory.
#[must_use]
pub fn cargo_target_dir_for_package(workspace_root: &Path, package: &str) -> PathBuf {
    if std::env::var_os("CARGO_TARGET_DIR").is_some() {
        cargo_target_dir(workspace_root)
    } else {
        package_target_dir(workspace_root, package)
    }
}

/// Returns the package-local Cargo target directory.
///
/// Example: <workspace>/packages/cosmo-pd101-plugin/target
#[must_use]
pub fn package_target_dir(workspace_root: &Path, package: &str) -> PathBuf {
    workspace_root.join("packages").join(package).join("target")
}

/// Returns the package-local Cargo profile output directory.
///
/// Example: <workspace>/packages/cosmo-pd101-plugin/target/release
#[must_use]
pub fn _package_profile_target_dir(workspace_root: &Path, package: &str, profile: &str) -> PathBuf {
    package_target_dir(workspace_root, package).join(profile)
}

/// Convert plugin name to PascalCase for class names.
/// "midi-transform" → "MidiTransform"
#[must_use]
pub fn to_pascal_case(name: &str) -> String {
    name.split(['-', '_'])
        .map(|word| {
            let mut chars = word.chars();
            match chars.next() {
                None => String::new(),
                Some(first) => first.to_uppercase().chain(chars).collect(),
            }
        })
        .collect()
}

/// Convert package name to VST3 bundle name.
/// "cosmo-pd101" -> "CzSynthVst.vst3"
#[must_use]
pub fn to_vst3_bundle_name(package: &str) -> String {
    format!("{}.vst3", to_pascal_case(package))
}

/// Combines multiple architecture-specific binaries into a universal binary using lipo,
/// or renames a single binary to the output path.
///
/// This consolidates the common pattern used across AUv2, AUv3 and build modules:
/// - If only one binary: rename it to the output path
/// - If multiple binaries: combine with `lipo -create`
///
/// Set `cleanup` to true to delete intermediate binaries after combining (useful for
/// temporary build artifacts). Set to false when the source binaries are in standard
/// cargo output directories and should be preserved.
pub fn combine_or_rename_binaries(
    built_paths: &[PathBuf],
    output_path: &Path,
    cleanup: bool,
) -> Result<(), String> {
    use std::process::Command;

    if built_paths.len() == 1 {
        // Single architecture - just rename
        fs::rename(&built_paths[0], output_path)
            .map_err(|e| format!("Failed to rename binary: {}", e))?;
    } else {
        // Multiple architectures - combine with lipo
        let mut lipo_cmd = Command::new("lipo");
        lipo_cmd.arg("-create");
        for path in built_paths {
            lipo_cmd.arg(path);
        }
        lipo_cmd.arg("-output").arg(output_path);

        let lipo_status = lipo_cmd
            .status()
            .map_err(|e| format!("Failed to run lipo: {}", e))?;

        if !lipo_status.success() {
            return Err("Failed to create universal binary with lipo".to_string());
        }

        // Clean up intermediate binaries if requested
        if cleanup {
            for path in built_paths {
                let _ = fs::remove_file(path);
            }
        }
    }

    Ok(())
}

/// Install a plugin bundle to a directory under the user's home directory.
///
/// Handles the common install pattern:
/// 1. Get HOME environment variable
/// 2. Build destination directory from path components
/// 3. Create directory if needed
/// 4. Remove existing installation if present
/// 5. Copy bundle to destination
///
/// Returns the destination path on success for post-install hooks.
pub fn install_bundle(
    bundle_dir: &Path,
    bundle_name: &str,
    install_subdir: &[&str],
    verbose: bool,
) -> Result<PathBuf, String> {
    let home = std::env::var("HOME").map_err(|_| "HOME not set")?;

    let mut dest_dir = PathBuf::from(&home);
    for part in install_subdir {
        dest_dir = dest_dir.join(part);
    }

    // Create directory if needed
    fs::create_dir_all(&dest_dir)
        .map_err(|e| format!("Failed to create install directory: {}", e))?;

    let dest = dest_dir.join(bundle_name);

    // Remove existing installation
    if dest.exists() {
        fs::remove_dir_all(&dest)
            .map_err(|e| format!("Failed to remove old installation: {}", e))?;
    }

    // Copy bundle
    copy_dir_all(bundle_dir, &dest)?;

    crate::verbose!(verbose, "    Installed to: {}", dest.display());

    Ok(dest)
}

/// Detect bundle identifier prefix for generated plugin bundles.
///
/// Reads `bundle_identifier_prefix` from `Config.toml` and falls back to
/// `com.cosmo` if the field is not present.
#[must_use]
pub fn detect_bundle_identifier_prefix(package: &str, workspace_root: &Path) -> String {
    let config_path = workspace_root
        .join("packages")
        .join(package)
        .join("Config.toml");

    if let Ok(toml_str) = fs::read_to_string(&config_path) {
        if let Ok(config) = toml::from_str::<ConfigFile>(&toml_str) {
            if let Some(prefix) = config.bundle_identifier_prefix {
                let trimmed = prefix.trim();
                if !trimmed.is_empty() {
                    return trimmed.to_string();
                }
            }
        }
    }

    "com.cosmo".to_string()
}

/// Recursively copy a directory, preserving symlinks.
pub fn copy_dir_all(src: &Path, dst: &Path) -> Result<(), String> {
    fs::create_dir_all(dst).map_err(|e| format!("Failed to create dir: {}", e))?;

    for entry in fs::read_dir(src).map_err(|e| format!("Failed to read dir: {}", e))? {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let ty = entry
            .file_type()
            .map_err(|e| format!("Failed to get file type: {}", e))?;

        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());

        if ty.is_dir() {
            copy_dir_all(&src_path, &dst_path)?;
        } else if ty.is_symlink() {
            // Preserve symlinks (important for AUv3 container app binary)
            #[cfg(unix)]
            {
                let target = fs::read_link(&src_path)
                    .map_err(|e| format!("Failed to read symlink: {}", e))?;
                std::os::unix::fs::symlink(&target, &dst_path)
                    .map_err(|e| format!("Failed to create symlink: {}", e))?;
            }
            #[cfg(not(unix))]
            {
                fs::copy(&src_path, &dst_path)
                    .map_err(|e| format!("Failed to copy file: {}", e))?;
            }
        } else {
            fs::copy(&src_path, &dst_path).map_err(|e| format!("Failed to copy file: {}", e))?;
        }
    }

    Ok(())
}
