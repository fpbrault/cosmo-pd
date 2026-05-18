//! Build tooling for Cosmo plugins.
//!
//! Usage: cargo xtask bundle <package> [--vst3] [--arch <arch>] [--release] [--install] [--clean]

mod build;
mod util;
mod vst3;

use std::path::PathBuf;
use std::process::Command;

use util::{Arch, cargo_target_dir_for_package, print_error};

/// Configuration for the bundle command
struct BundleConfig {
    package: String,
    release: bool,
    install: bool,
    clean: bool,
    build_vst3: bool,
    arch: Arch,
    verbose: bool,
}

// =============================================================================
// UUID Generation
// =============================================================================

/// Generate a new UUID for plugin identification.
///
/// Outputs a UUID in the standard format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
/// This can be used directly with `Vst3Config::new()` in VST3 configs.
fn generate_uuid() {
    let uuid = uuid::Uuid::new_v4();
    // Format as uppercase without braces, matching uuidgen output
    println!("{}", uuid.as_hyphenated().to_string().to_uppercase());
}

// =============================================================================
// Entry Point
// =============================================================================

fn main() {
    let args: Vec<String> = std::env::args().collect();

    if args.len() < 2 {
        print_usage();
        std::process::exit(1);
    }

    let command = &args[1];

    match command.as_str() {
        "generate-uuid" => {
            generate_uuid();
            return;
        }
        "bundle" => {
            if args.len() < 3 {
                print_error("bundle command requires a package name");
                print_usage();
                std::process::exit(1);
            }
        }
        _ => {
            print_error(&format!("unknown command '{}'", command));
            print_usage();
            std::process::exit(1);
        }
    }

    let package = &args[2];
    let release = args.iter().any(|a| a == "--release");
    let install = args.iter().any(|a| a == "--install");
    let clean = args.iter().any(|a| a == "--clean");
    let verbose = args.iter().any(|a| a == "--verbose" || a == "-v");
    let build_vst3 = args.iter().any(|a| a == "--vst3");

    // Parse --arch flag
    let arch = args
        .windows(2)
        .find(|w| w[0] == "--arch")
        .map(|w| {
            Arch::from_str(&w[1]).unwrap_or_else(|| {
                eprintln!("Warning: unrecognized arch '{}', using native", w[1]);
                Arch::Native
            })
        })
        .unwrap_or(Arch::Native);

    // Check for unknown flags
    let known_flags = [
        "--release",
        "--install",
        "--clean",
        "--verbose",
        "-v",
        "--vst3",
        "--arch",
    ];
    let arch_values = ["native", "universal", "arm64", "x86_64"];
    for arg in args.iter().skip(3) {
        if arg.starts_with('-') && !known_flags.contains(&arg.as_str()) {
            print_error(&format!("unknown flag '{}'", arg));
            eprintln!("Known flags: {}", known_flags.join(", "));
            std::process::exit(1);
        } else if !arg.starts_with("--") && !arch_values.contains(&arg.as_str()) {
            print_error(&format!("unexpected argument '{}'", arg));
            print_usage();
            std::process::exit(1);
        }
    }

    // Require at least one format flag
    if !build_vst3 {
        print_error("at least one format flag is required (--vst3)");
        print_usage();
        std::process::exit(1);
    }

    let config = BundleConfig {
        package: package.to_string(),
        release,
        install,
        clean,
        verbose,
        build_vst3,
        arch,
    };

    if let Err(e) = bundle(&config) {
        print_error(&e);
        std::process::exit(1);
    }
}

fn print_usage() {
    eprintln!("Usage: cargo xtask <command> [options]");
    eprintln!();
    eprintln!("Commands:");
    eprintln!("  generate-uuid              Generate a new UUID for plugin identification");
    eprintln!("  bundle <package> [options] Build and bundle a plugin");
    eprintln!();
    eprintln!("Formats (at least one required):");
    eprintln!("  --vst3    Build VST3 bundle");
    eprintln!();
    eprintln!("Architecture:");
    eprintln!("  --arch <arch>  Target architecture (default: native)");
    eprintln!("                 native    - Current machine's architecture only (fastest builds)");
    eprintln!("                 universal - x86_64 + arm64 (for distribution)");
    eprintln!("                 arm64     - Apple Silicon only");
    eprintln!("                 x86_64    - Intel only");
    eprintln!();
    eprintln!("Options:");
    eprintln!("  --release    Build in release mode");
    eprintln!("  --install    Install to system plugin directories");
    eprintln!("               VST3: ~/Library/Audio/Plug-Ins/VST3/");
    eprintln!("  --clean      Clean build caches before building (forces full rebuild)");
    eprintln!("               Removes previous VST3 bundles.");
    eprintln!("  --verbose    Show detailed build output (default: quiet)");
    eprintln!();
    eprintln!("Examples:");
    eprintln!("  cargo xtask bundle gain --vst3 --release --install");
    eprintln!("  cargo xtask bundle gain --vst3 --arch universal");
}

// =============================================================================
// Bundle Orchestration
// =============================================================================

fn bundle(config: &BundleConfig) -> Result<(), String> {
    let arch_str = match config.arch {
        Arch::Native => "native",
        Arch::Universal => "universal",
        Arch::Arm64 => "arm64",
        Arch::X86_64 => "x86_64",
    };
    let profile_str = if config.release { "release" } else { "debug" };
    status!(
        "Bundling {} ({}, {})...",
        config.package,
        profile_str,
        arch_str
    );

    // Get workspace root
    let workspace_root = get_workspace_root()?;

    // Clean build caches if requested
    if config.clean {
        build::clean_build_caches(
            &workspace_root,
            &config.package,
            config.release,
            config.verbose,
            config.build_vst3,
        )?;
    }

    // Build webview assets (must happen before cargo build so dist/ exists for proc macro)
    let package_dir = workspace_root.join("packages").join(&config.package);
    build::build_webview(&package_dir, config.verbose)?;

    // Determine paths
    let target_dir =
        cargo_target_dir_for_package(&workspace_root, &config.package).join(profile_str);

    // Build and bundle VST3
    if config.build_vst3 {
        let dylib_path = if config.arch == Arch::Universal {
            build::build_universal(
                &config.package,
                config.release,
                &workspace_root,
                "vst3",
                config.verbose,
            )?
        } else {
            build::build_native(
                &config.package,
                config.release,
                &workspace_root,
                "vst3",
                config.arch,
                config.verbose,
            )?
        };
        vst3::bundle_vst3(
            &config.package,
            &target_dir,
            &dylib_path,
            config.install,
            &workspace_root,
            config.verbose,
        )?;
    }

    Ok(())
}

fn get_workspace_root() -> Result<PathBuf, String> {
    let output = Command::new("cargo")
        .args(["locate-project", "--workspace", "--message-format=plain"])
        .output()
        .map_err(|e| format!("Failed to locate workspace: {}", e))?;

    if !output.status.success() {
        return Err("Failed to locate workspace".to_string());
    }

    let cargo_toml = String::from_utf8_lossy(&output.stdout);
    let path = PathBuf::from(cargo_toml.trim());
    path.parent()
        .map(|p| p.to_path_buf())
        .ok_or_else(|| "Invalid workspace path".to_string())
}
