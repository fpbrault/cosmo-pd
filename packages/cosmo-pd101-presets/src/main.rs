use std::path::Path;

mod factory_preset_codegen;

fn main() {
    let manifest_dir = Path::new(env!("CARGO_MANIFEST_DIR"));
    let workspace_root = manifest_dir.join("../..");
    if let Err(error) = factory_preset_codegen::generate_factory_presets(&workspace_root) {
        eprintln!("{error}");
        std::process::exit(1);
    }
}
