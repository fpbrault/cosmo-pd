use std::fs;
use std::io;
use std::path::Path;

fn copy_dir_recursive(src: &Path, dst: &Path) -> io::Result<()> {
    fs::create_dir_all(dst)?;

    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let from = entry.path();
        let to = dst.join(entry.file_name());

        if file_type.is_dir() {
            copy_dir_recursive(&from, &to)?;
        } else if file_type.is_file() {
            if let Some(parent) = to.parent() {
                fs::create_dir_all(parent)?;
            }
            fs::copy(&from, &to)?;
        }
    }

    Ok(())
}

fn main() -> io::Result<()> {
    let out_dir = std::env::var("OUT_DIR").expect("OUT_DIR is set by Cargo");
    let manifest_dir = Path::new(env!("CARGO_MANIFEST_DIR"));
    let dist_dir = manifest_dir.join("webview").join("dist");
    let embedded_dir = Path::new(&out_dir).join("embedded-webview");

    println!("cargo:rerun-if-changed=webview/dist");

    if embedded_dir.exists() {
        fs::remove_dir_all(&embedded_dir)?;
    }

    if dist_dir.is_dir() {
        copy_dir_recursive(&dist_dir, &embedded_dir)?;
    } else {
        fs::create_dir_all(&embedded_dir)?;
        fs::write(
            embedded_dir.join("index.html"),
            "<!doctype html><html><body>Missing webview/dist. Run `bun run build:web` before building the plugin.</body></html>",
        )?;
    }

    // Minify factory_presets.json from the shared location into OUT_DIR.
    let json_path = "../cosmo-pd101/src/lib/synth/factory_presets.json";
    let shared_json = manifest_dir.join(json_path);
    if shared_json.is_file() {
        let pretty = std::fs::read_to_string(&shared_json)?;
        let value: serde_json::Value = serde_json::from_str(&pretty)?;
        let minified = serde_json::to_string(&value)?;
        let out_path = Path::new(&out_dir).join("minified_presets.json");
        std::fs::write(&out_path, &minified)?;
        println!("cargo::rerun-if-changed=../cosmo-pd101/src/lib/synth/factory_presets.json");
        println!("cargo::rerun-if-changed=../cosmo-pd101-presets/factory-presets");
    }

    Ok(())
}
