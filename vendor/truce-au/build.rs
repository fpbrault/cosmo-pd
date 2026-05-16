fn main() {
    if std::env::var("CARGO_CFG_TARGET_OS").unwrap_or_default() != "macos" {
        return;
    }

    let out_dir = std::env::var("OUT_DIR").unwrap();

    println!("cargo:rerun-if-changed=shim/au_v2_shim.c");
    println!("cargo:rerun-if-changed=shim/au_v2_view.m");
    println!("cargo:rerun-if-changed=shim/au_shim_common.c");
    println!("cargo:rerun-if-env-changed=TRUCE_AU_PLUGIN_ID");
    let shim_include = truce_shim_types::include_dir();
    println!(
        "cargo:rerun-if-changed={}",
        shim_include.join("au_shim_types.h").display()
    );

    // - AU v2 (.component): plain-C `AudioComponentPlugInInterface`
    //   dispatch + a per-plugin ObjC class compiled into the dylib so
    //   it appears in `__objc_classlist` (required by REAPER's
    //   `[NSBundle classNamed:]` lookup). The class name must be
    //   unique per plugin: hosts load every installed `.component`
    //   into one process, and libobjc dedupes by name — the loser's
    //   bundle then returns nil from `classNamed:` and the host
    //   thinks it has no GUI. Uniqueness comes from the
    //   `TRUCE_AU_PLUGIN_ID` env var (cargo-truce sets it from
    //   truce.toml); sanitised into an alphanumeric suffix and
    //   handed to the .m via `-DTRUCE_AU_VIEW_FACTORY_NAME=...`.
    //   Plain `cargo build` (no env) uses a default name — fine for
    //   unit tests, not for multi-plugin hosting.
    //
    // - AU v3 (.appex): the AUAudioUnit subclass + factory are
    //   compiled in Swift (templates/au3/AudioUnitFactory.swift) into
    //   the appex binary by xcodebuild during install. They read the
    //   exported `g_callbacks` / `g_descriptor` / `g_param_descriptors`
    //   / `g_num_params` symbols out of the framework dylib, so this
    //   shim's only job for v3 is to populate those globals at load
    //   time.

    let plugin_id = std::env::var("TRUCE_AU_PLUGIN_ID").unwrap_or_default();
    let sanitized: String = if plugin_id.is_empty() {
        "default".to_string()
    } else {
        plugin_id
            .chars()
            .map(|c| if c.is_ascii_alphanumeric() { c } else { '_' })
            .collect()
    };
    let view_factory_name = format!("TruceAUCocoaViewProxy_{sanitized}");

    let mut build = cc::Build::new();
    build.file("shim/au_shim_common.c");
    build.file("shim/au_v2_shim.c");
    build.file("shim/au_v2_view.m");

    build
        .include(&shim_include)
        .flag("-fobjc-arc")
        .flag("-fmodules")
        .flag("-fvisibility=default")
        .flag("-mmacosx-version-min=11.0")
        .define("TRUCE_AU_VIEW_FACTORY_NAME", view_factory_name.as_str());

    build.compile("au_shim");

    // `rustc-link-arg-cdylib` propagates to the downstream cdylib that
    // consumes us (per cargo issue 9562) so the C shim gets force-loaded
    // and AU entry symbols (g_descriptor / TruceAUFactory / etc.)
    // survive dead-stripping in the consumer's plugin dylib. We can't
    // host our own cdylib target here because the exported symbols are
    // defined by the `export_au!` macro in the consuming crate.
    println!("cargo:rustc-link-arg-cdylib=-Wl,-force_load,{out_dir}/libau_shim.a");

    // Export shim globals so the v3 appex binary (compiled separately
    // by xcodebuild) can read them out of the framework dylib at
    // runtime via dynamic symbol lookup.
    println!("cargo:rustc-link-arg-cdylib=-Wl,-exported_symbol,_g_descriptor");
    println!("cargo:rustc-link-arg-cdylib=-Wl,-exported_symbol,_g_callbacks");
    println!("cargo:rustc-link-arg-cdylib=-Wl,-exported_symbol,_g_param_descriptors");
    println!("cargo:rustc-link-arg-cdylib=-Wl,-exported_symbol,_g_num_params");

    // Always export the v2 factory symbol — hosts use the v2 API to
    // instantiate, including the v3→v2 bridge that GarageBand /
    // AULab use during scanning.
    println!("cargo:rustc-link-arg-cdylib=-Wl,-exported_symbol,_TruceAUFactory");

    // The cocoa view class-name lookup function lives in au_v2_view.m;
    // force its symbol to be exported so `au_v2_shim.c`'s extern call links.
    println!("cargo:rustc-link-arg-cdylib=-Wl,-exported_symbol,_truce_au_view_factory_class_name");

    println!("cargo:rustc-link-lib=framework=AudioToolbox");
    println!("cargo:rustc-link-lib=framework=AVFAudio");
    println!("cargo:rustc-link-lib=framework=CoreAudio");
    println!("cargo:rustc-link-lib=framework=CoreMIDI");
    println!("cargo:rustc-link-lib=framework=Foundation");
    println!("cargo:rustc-link-lib=framework=AppKit");
}
