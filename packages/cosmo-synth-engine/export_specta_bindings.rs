//! Generates Specta bindings for synth wire/domain contracts.
//!
//! Run with:
//!   cargo run --features specta-bindings --bin export-specta-bindings
//!
//! Optional env vars:
//! - SPECTA_TS_EXPORT_PATH: absolute/relative path to generated TypeScript file

use cosmo_synth_engine::fx::{
    FxControlKindV1, FxControlOptionV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1,
    fx_definitions_v1,
};
use cosmo_synth_engine::generators::{
    AlgoControlAssignmentV1, AlgoControlKindV1, AlgoControlOptionV1, AlgoControlPresentationV1,
    AlgoControlV1, AlgoDefinitionV1, AlgoUiEntryV1, CzPresetV1,
};
use cosmo_synth_engine::module_presets::{
    LfoPresetV1, ModEnvPresetV1, ModulePresetGroupV1, lfo_preset_data, mod_env_preset_data,
    module_preset_catalog_v1,
};
use cosmo_synth_engine::params::engine_param_default_v1;
use cosmo_synth_engine::params::{
    Algo, AlgoControlValueV1, BaseWaveform, BitcrusherParams, ChorusParams, CompressorParams,
    CzAlgo, CzWaveform, DelayParams, DistortionParams, EnvStep, EqParams, FxSlotConfig, FxSlotType,
    GrainDelayParams, JunoChorusParams, LfoParams, LfoRateMode, LfoSyncDivision, LfoWaveform,
    LineParams, LineSelect, LoFiParams, ModDestination, ModEnvParams, ModMatrix, ModMode, ModRoute,
    ModSource, PhaseModParams, PhaserParams, PolyMode, PortamentoMode, PortamentoParams,
    RandomParams, ReverbParams, RingModParams, ShimmerVerbParams, StepEnvData, SynthParams,
    TremoloParams, VibratoParams, WavefolderParams, WindowType, default_synth_params_v1,
    engine_param_ranges_v1, engine_param_ui_meta_v1, midi_mapping_param_ranges_v1,
};
use cosmo_synth_engine::preset_wire::{
    SynthPresetV1, algo_definitions_v1, algo_ui_catalog_v1, cz_presets,
};
use specta::Types;
use specta_typescript::Typescript;

// Per-module preset entry types (fx_preset_entry! macro generates these)
use cosmo_synth_engine::fx::bitcrusher::{BitcrusherPresetV1, bitcrusher_preset_data};
use cosmo_synth_engine::fx::chorus::{ChorusPresetV1, chorus_preset_data};
use cosmo_synth_engine::fx::compressor::{CompressorPresetV1, compressor_preset_data};
use cosmo_synth_engine::fx::delay::{DelayPresetV1, delay_preset_data};
use cosmo_synth_engine::fx::distortion::{DistortionPresetV1, distortion_preset_data};
use cosmo_synth_engine::fx::eq::{EqPresetV1, eq_preset_data};
use cosmo_synth_engine::fx::flanger::{FlangerPresetV1, flanger_preset_data};
use cosmo_synth_engine::fx::grain_delay::{GrainDelayPresetV1, grain_delay_preset_data};
use cosmo_synth_engine::fx::juno_chorus::{JunoChorusPresetV1, juno_chorus_preset_data};
use cosmo_synth_engine::fx::lofi::{LoFiPresetV1, lofi_preset_data};
use cosmo_synth_engine::fx::multimode_filter::{
    MultimodeFilterPresetV1, multimode_filter_preset_data,
};
use cosmo_synth_engine::fx::phase_mod::{PhaseModPresetV1, phase_mod_preset_data};
use cosmo_synth_engine::fx::phaser::{PhaserPresetV1, phaser_preset_data};
use cosmo_synth_engine::fx::reverb::{ReverbPresetV1, reverb_preset_data};
use cosmo_synth_engine::fx::ring_mod::{RingModPresetV1, ring_mod_preset_data};
use cosmo_synth_engine::fx::shimmer_verb::{ShimmerVerbPresetV1, shimmer_verb_preset_data};
use cosmo_synth_engine::fx::tremolo::{TremoloPresetV1, tremolo_preset_data};
use cosmo_synth_engine::fx::vibrato::{VibratoPresetV1, vibrato_preset_data};
use cosmo_synth_engine::fx::wavefolder::{WavefolderPresetV1, wavefolder_preset_data};

fn main() {
    let manifest_dir = env!("CARGO_MANIFEST_DIR");

    let ts_path = std::env::var("SPECTA_TS_EXPORT_PATH").unwrap_or_else(|_| {
        format!("{manifest_dir}/../cosmo-pd101/src/lib/synth/bindings/synth.ts")
    });

    if let Some(ts_parent) = std::path::Path::new(&ts_path).parent() {
        std::fs::create_dir_all(ts_parent)
            .unwrap_or_else(|e| panic!("Failed to create TS output dir '{ts_parent:?}': {e}"));
    }

    let mut types = Types::default();
    types.register_mut::<EnvStep>();
    types.register_mut::<StepEnvData>();
    types.register_mut::<CzAlgo>();
    types.register_mut::<CzWaveform>();
    types.register_mut::<BaseWaveform>();
    types.register_mut::<Algo>();
    types.register_mut::<WindowType>();
    types.register_mut::<LineSelect>();
    types.register_mut::<ModMode>();
    types.register_mut::<PolyMode>();
    types.register_mut::<LfoWaveform>();
    types.register_mut::<LfoRateMode>();
    types.register_mut::<LfoSyncDivision>();
    types.register_mut::<PortamentoMode>();
    types.register_mut::<ChorusParams>();
    types.register_mut::<DelayParams>();
    types.register_mut::<ReverbParams>();
    types.register_mut::<PhaserParams>();
    types.register_mut::<VibratoParams>();
    types.register_mut::<PhaseModParams>();
    types.register_mut::<RandomParams>();
    types.register_mut::<ModEnvParams>();
    types.register_mut::<PortamentoParams>();
    types.register_mut::<LfoParams>();
    types.register_mut::<AlgoControlValueV1>();
    types.register_mut::<LineParams>();
    types.register_mut::<AlgoControlKindV1>();
    types.register_mut::<AlgoControlPresentationV1>();
    types.register_mut::<AlgoControlAssignmentV1>();
    types.register_mut::<AlgoControlOptionV1>();
    types.register_mut::<AlgoControlV1>();
    types.register_mut::<AlgoDefinitionV1>();
    types.register_mut::<AlgoUiEntryV1>();
    types.register_mut::<ModSource>();
    types.register_mut::<ModDestination>();
    types.register_mut::<ModRoute>();
    types.register_mut::<ModMatrix>();
    types.register_mut::<FxSlotType>();
    types.register_mut::<CompressorParams>();
    types.register_mut::<EqParams>();
    types.register_mut::<GrainDelayParams>();
    types.register_mut::<BitcrusherParams>();
    types.register_mut::<ShimmerVerbParams>();
    types.register_mut::<DistortionParams>();
    types.register_mut::<JunoChorusParams>();
    types.register_mut::<RingModParams>();
    types.register_mut::<TremoloParams>();
    types.register_mut::<WavefolderParams>();
    types.register_mut::<LoFiParams>();
    types.register_mut::<FxSlotConfig>();
    types.register_mut::<SynthParams>();
    types.register_mut::<SynthPresetV1>();
    types.register_mut::<CzPresetV1>();
    types.register_mut::<FxPresetOptionV1>();
    types.register_mut::<FxControlKindV1>();
    types.register_mut::<FxControlOptionV1>();
    types.register_mut::<FxControlV1>();
    types.register_mut::<FxDefinitionV1>();
    types.register_mut::<ModulePresetGroupV1>();

    // Per-module preset entry types
    types.register_mut::<ChorusPresetV1>();
    types.register_mut::<DelayPresetV1>();
    types.register_mut::<ReverbPresetV1>();
    types.register_mut::<PhaserPresetV1>();
    types.register_mut::<VibratoPresetV1>();
    types.register_mut::<PhaseModPresetV1>();
    types.register_mut::<CompressorPresetV1>();
    types.register_mut::<EqPresetV1>();
    types.register_mut::<GrainDelayPresetV1>();
    types.register_mut::<BitcrusherPresetV1>();
    types.register_mut::<ShimmerVerbPresetV1>();
    types.register_mut::<DistortionPresetV1>();
    types.register_mut::<JunoChorusPresetV1>();
    types.register_mut::<RingModPresetV1>();
    types.register_mut::<TremoloPresetV1>();
    types.register_mut::<WavefolderPresetV1>();
    types.register_mut::<LoFiPresetV1>();
    types.register_mut::<MultimodeFilterPresetV1>();
    types.register_mut::<FlangerPresetV1>();
    types.register_mut::<LfoPresetV1>();
    types.register_mut::<ModEnvPresetV1>();

    let config = Typescript::default();
    let mut out = String::new();
    out.push_str("// Generated by Specta. Do not edit manually.\n\n");
    out.push_str(
        &config
            .export(&types, specta_serde::Format)
            .expect("Failed to export types"),
    );

    out.push_str("\n\n");
    let catalog_json = serde_json::to_string_pretty(algo_ui_catalog_v1())
        .expect("Failed to serialize ALGO_UI_CATALOG_V1");
    let definitions_json = serde_json::to_string_pretty(algo_definitions_v1())
        .expect("Failed to serialize ALGO_DEFINITIONS_V1");
    out.push_str("\n\n");
    out.push_str("/** Rust-owned algorithm UI catalog. */\n");
    out.push_str("export const ALGO_UI_CATALOG_V1: AlgoUiEntryV1[] = ");
    out.push_str(&catalog_json);
    out.push_str(";\n");
    out.push_str("\n");
    out.push_str("/** Rust-owned algorithm definitions and control defaults. */\n");
    out.push_str("export const ALGO_DEFINITIONS_V1 = ");
    out.push_str(&definitions_json);
    out.push_str(";\n");
    out.push_str("\n");
    let cz_presets_json =
        serde_json::to_string_pretty(cz_presets()).expect("Failed to serialize CZ_PRESETS");
    out.push_str("/** Rust-owned CZ waveform combination presets. */\n");
    out.push_str("export const CZ_PRESETS: CzPresetV1[] = ");
    out.push_str(&cz_presets_json);
    out.push_str(";\n");
    out.push_str("\n");
    let fx_definitions_json = serde_json::to_string_pretty(fx_definitions_v1())
        .expect("Failed to serialize FX_DEFINITIONS_V1");
    out.push_str("/** Rust-owned FX module definitions and control defaults. */\n");
    out.push_str("export const FX_DEFINITIONS_V1: FxDefinitionV1[] = ");
    out.push_str(&fx_definitions_json);
    out.push_str(";\n");
    out.push_str("\n");
    let module_preset_catalog_json = serde_json::to_string_pretty(module_preset_catalog_v1())
        .expect("Failed to serialize MODULE_PRESET_CATALOG_V1");
    out.push_str("/** Rust-owned module preset labels and ordering. */\n");
    out.push_str("export const MODULE_PRESET_CATALOG_V1: ModulePresetGroupV1[] = ");
    out.push_str(&module_preset_catalog_json);
    out.push_str(";\n");
    out.push_str("\n");

    // Per-module typed preset data exports
    macro_rules! export_preset_const {
        ($out:expr, $name:expr, $type:ty, $data_fn:expr) => {{
            let json = serde_json::to_string_pretty($data_fn)
                .expect(concat!("Failed to serialize ", $name));
            $out.push_str(concat!(
                "/** Rust-owned ",
                $name,
                " with typed parameter values. */\n"
            ));
            $out.push_str(concat!(
                "export const ",
                $name,
                ": ",
                stringify!($type),
                "[] = "
            ));
            $out.push_str(&json);
            $out.push_str(";\n\n");
        }};
    }

    export_preset_const!(
        out,
        "CHORUS_PRESET_DATA",
        ChorusPresetV1,
        chorus_preset_data()
    );
    export_preset_const!(out, "DELAY_PRESET_DATA", DelayPresetV1, delay_preset_data());
    export_preset_const!(
        out,
        "REVERB_PRESET_DATA",
        ReverbPresetV1,
        reverb_preset_data()
    );
    export_preset_const!(
        out,
        "PHASER_PRESET_DATA",
        PhaserPresetV1,
        phaser_preset_data()
    );
    export_preset_const!(
        out,
        "VIBRATO_PRESET_DATA",
        VibratoPresetV1,
        vibrato_preset_data()
    );
    export_preset_const!(
        out,
        "PHASE_MOD_PRESET_DATA",
        PhaseModPresetV1,
        phase_mod_preset_data()
    );
    export_preset_const!(
        out,
        "COMPRESSOR_PRESET_DATA",
        CompressorPresetV1,
        compressor_preset_data()
    );
    export_preset_const!(out, "EQ_PRESET_DATA", EqPresetV1, eq_preset_data());
    export_preset_const!(
        out,
        "GRAIN_DELAY_PRESET_DATA",
        GrainDelayPresetV1,
        grain_delay_preset_data()
    );
    export_preset_const!(
        out,
        "BITCRUSHER_PRESET_DATA",
        BitcrusherPresetV1,
        bitcrusher_preset_data()
    );
    export_preset_const!(
        out,
        "SHIMMER_VERB_PRESET_DATA",
        ShimmerVerbPresetV1,
        shimmer_verb_preset_data()
    );
    export_preset_const!(
        out,
        "DISTORTION_PRESET_DATA",
        DistortionPresetV1,
        distortion_preset_data()
    );
    export_preset_const!(
        out,
        "JUNO_CHORUS_PRESET_DATA",
        JunoChorusPresetV1,
        juno_chorus_preset_data()
    );
    export_preset_const!(
        out,
        "RING_MOD_PRESET_DATA",
        RingModPresetV1,
        ring_mod_preset_data()
    );
    export_preset_const!(
        out,
        "TREMOLO_PRESET_DATA",
        TremoloPresetV1,
        tremolo_preset_data()
    );
    export_preset_const!(
        out,
        "WAVEFOLDER_PRESET_DATA",
        WavefolderPresetV1,
        wavefolder_preset_data()
    );
    export_preset_const!(out, "LOFI_PRESET_DATA", LoFiPresetV1, lofi_preset_data());
    export_preset_const!(
        out,
        "MULTIMODE_FILTER_PRESET_DATA",
        MultimodeFilterPresetV1,
        multimode_filter_preset_data()
    );
    export_preset_const!(
        out,
        "FLANGER_PRESET_DATA",
        FlangerPresetV1,
        flanger_preset_data()
    );
    export_preset_const!(out, "LFO_PRESET_DATA", LfoPresetV1, lfo_preset_data());
    export_preset_const!(
        out,
        "MOD_ENV_PRESET_DATA",
        ModEnvPresetV1,
        mod_env_preset_data()
    );

    let mut engine_param_ui_meta_value = serde_json::to_value(engine_param_ui_meta_v1())
        .expect("Failed to serialize ENGINE_PARAM_UI_META_V1");
    if let Some(items) = engine_param_ui_meta_value.as_array_mut() {
        for item in items {
            if let Some(obj) = item.as_object_mut() {
                let key = obj.get("key").and_then(|v| v.as_str()).unwrap_or_default();
                match engine_param_default_v1(key) {
                    Some(default) => {
                        let rounded = (default * 1_000_000.0).round() / 1_000_000.0;
                        obj.insert(
                            "paramDefault".to_string(),
                            serde_json::Value::from(rounded as f64),
                        );
                    }
                    None => {
                        obj.insert("paramDefault".to_string(), serde_json::Value::Null);
                    }
                }
            }
        }
    }
    let engine_param_ui_meta_json = serde_json::to_string_pretty(&engine_param_ui_meta_value)
        .expect("Failed to serialize ENGINE_PARAM_UI_META_V1");
    let engine_param_ranges_json = serde_json::to_string_pretty(engine_param_ranges_v1())
        .expect("Failed to serialize ENGINE_PARAM_RANGES_V1");
    let midi_param_ranges_json = serde_json::to_string_pretty(&midi_mapping_param_ranges_v1())
        .expect("Failed to serialize ENGINE_MIDI_PARAM_RANGES_V1");

    out.push_str("export type EngineParamUiMetaV1 = { key: string; readoutFormat: EngineParamReadoutFormatV1; paramDefault: number | null };\n");
    out.push_str("export type EngineParamRangeV1 = { key: string; min: number; max: number; step?: number };\n");
    out.push_str("/** Rust-owned engine parameter tooltip and readout metadata. */\n");
    out.push_str("export const ENGINE_PARAM_UI_META_V1: EngineParamUiMetaV1[] = ");
    out.push_str(&engine_param_ui_meta_json);
    out.push_str(";\n\n");
    out.push_str("/** Rust-owned numeric range metadata for engine parameters. */\n");
    out.push_str("export const ENGINE_PARAM_RANGES_V1: EngineParamRangeV1[] = ");
    out.push_str(&engine_param_ranges_json);
    out.push_str(";\n\n");
    out.push_str("/** Rust-owned numeric ranges for native MIDI mapping targets. */\n");
    out.push_str("export const ENGINE_MIDI_PARAM_RANGES_V1: EngineParamRangeV1[] = ");
    out.push_str(&midi_param_ranges_json);
    out.push_str(";\n\n");
    let default_synth_params_json = serde_json::to_string_pretty(&default_synth_params_v1())
        .expect("Failed to serialize DEFAULT_SYNTH_PARAMS_V1");
    out.push_str("/** Rust-owned default synth parameters. */\n");
    out.push_str("export const DEFAULT_SYNTH_PARAMS_V1: SynthParams = ");
    out.push_str(&default_synth_params_json);
    out.push_str(";\n\n");
    std::fs::write(&ts_path, out)
        .unwrap_or_else(|e| panic!("Failed to write TypeScript bindings to '{ts_path}': {e}"));

    println!("[specta-bindings] Exported TypeScript bindings to: {ts_path}");
}
