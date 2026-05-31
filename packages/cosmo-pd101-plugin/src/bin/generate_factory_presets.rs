use std::path::Path;

#[path = "../factory_preset_codegen.rs"]
mod factory_preset_codegen;

fn main() {
    let manifest_dir = Path::new(env!("CARGO_MANIFEST_DIR"));
    if let Err(error) = factory_preset_codegen::generate_factory_presets(manifest_dir) {
        eprintln!("{error}");
        std::process::exit(1);
    }
}
