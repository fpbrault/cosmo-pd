//! Synth parameter types and UI metadata.

mod cache;
mod envelopes;
mod fx_params;
mod lfo;
mod line;
mod mapping;
mod modulation;
mod portamento;
mod synth_params;
mod synthesis;
mod ui_meta;
mod waveforms;

// Re-exports for backward compatibility
pub(crate) use cache::ModMatrixCache;
pub use envelopes::{EnvStep, NUM_ENV_STEPS, StepEnvData};
pub use fx_params::{
    BitcrusherParams, ChorusParams, CompressorParams, DelayParams, DistortionParams, EqParams,
    FlangerParams, FxSlotConfig, FxSlotType, GrainDelayParams, JunoChorusParams, LoFiParams,
    MultimodeFilterParams, PhaseModParams, PhaserParams, ReverbParams, RingModParams,
    ShimmerVerbParams, TremoloParams, VibratoParams, WavefolderParams,
};
pub use lfo::{LfoParams, LfoRateMode, LfoSyncDivision, LfoWaveform};
pub use line::{
    AlgoControlId, AlgoControlSlots, AlgoControlValueV1, LineParams, LineSelect, MAX_ALGO_CONTROLS,
    ModMode, PolyMode,
};
pub use mapping::{
    AppliedMidiAlgoControlSection, AppliedMidiParamChange, AppliedMidiParamTarget,
    MidiMappingBinding, apply_midi_mapping, apply_midi_mapping_binding, is_algo_control_slot_key,
    midi_mapping_param_ranges_v1, parameter_range_for_key, set_parameter_value_by_key,
};
pub use modulation::{
    ENV_STEP_DEST_FIRST, ENV_STEP_DEST_LAST, ModDestination, ModMatrix, ModMatrixLayout,
    ModMatrixPage, ModRoute, ModSource, NUM_MOD_DESTINATIONS,
};
pub use portamento::{PortamentoMode, PortamentoParams};
pub use synth_params::{
    DEFAULT_VOICE_LIMIT, MAX_VOICE_LIMIT, MAX_VOICES, MIN_VOICE_LIMIT, ModEnvMode, ModEnvParams,
    ModEnvRetrigMode, NUM_OPERATORS, RandomParams, SynthParams, default_synth_params_v1,
};
pub use synthesis::{KarpunkParams, SynthesisMethod};
pub use ui_meta::{
    EngineEnumValueLabelV1, EngineParamRangeV1, EngineParamReadoutFormatV1, EngineParamUiMetaV1,
    engine_param_default_v1, engine_param_ranges_v1, engine_param_ui_meta_v1,
};
pub use waveforms::{Algo, BaseWaveform, CzAlgo, CzWaveform, WindowType};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn step_env_deserialize_uses_fallback_count_and_pads_steps() {
        let json = r#"{
            "steps": [
                { "level": 0.5, "rate": 12.6 },
                { "level": 1.0, "rate": 120.0 }
            ],
            "sustainStep": 1,
            "loop": true
        }"#;

        let env: StepEnvData = serde_json::from_str(json).expect("valid step env json");

        assert_eq!(env.step_count, 2);
        assert_eq!(env.sustain_step, 1);
        assert!(env.loop_);
        assert_eq!(env.steps[0].rate, 13);
        assert_eq!(env.steps[1].rate, 120);
        assert_eq!(env.steps[2].level, 0);
        assert_eq!(env.steps[2].rate, 0);
    }

    #[test]
    fn step_env_deserialize_treats_values_as_raw_7bit() {
        let json = r#"{
            "steps": [
                { "level": 66, "rate": 99 },
                { "level": 127, "rate": 127 }
            ],
            "sustainStep": 0,
            "stepCount": 2,
            "loop": false
        }"#;

        let env: StepEnvData = serde_json::from_str(json).expect("valid step env json");
        assert_eq!(env.steps[0].level, 66);
        assert_eq!(env.steps[0].rate, 99);
        assert_eq!(env.steps[1].level, 127);
        assert_eq!(env.steps[1].rate, 127);
    }

    #[test]
    fn algo_cz_waveform_roundtrip_and_non_cz_detection() {
        let from_square = Algo::from_cz_waveform(CzWaveform::Square);
        assert_eq!(from_square, Algo::Square);
        assert_eq!(from_square.as_cz_waveform(), Some(CzWaveform::Square));
        assert!(from_square.is_cz_waveform());

        assert_eq!(Algo::Bend.as_cz_waveform(), None);
        assert!(!Algo::Bend.is_cz_waveform());
    }

    #[test]
    fn synth_params_fx_fields_default_when_missing() {
        let mut value = serde_json::to_value(SynthParams::default())
            .expect("default synth params should serialize");

        let params = value
            .as_object_mut()
            .expect("synth params should serialize as an object");

        for key in ["chorus", "delay", "reverb", "phaser"] {
            params.remove(key);
        }
    }

    #[test]
    fn legacy_lines_without_synthesis_method_default_to_pd() {
        let mut value = serde_json::to_value(SynthParams::default())
            .expect("default synth params should serialize");
        let root = value
            .as_object_mut()
            .expect("synth params should serialize as an object");

        for line_key in ["line1", "line2"] {
            root.get_mut(line_key)
                .and_then(serde_json::Value::as_object_mut)
                .expect("line params should serialize as an object")
                .remove("synthesisMethod");
        }

        let restored: SynthParams =
            serde_json::from_value(value).expect("legacy synth params should deserialize");
        assert_eq!(restored.line1.synthesis_method, SynthesisMethod::Pd);
        assert_eq!(restored.line2.synthesis_method, SynthesisMethod::Pd);
    }

    #[test]
    fn synthesis_method_roundtrips_without_schema_change() {
        let params = SynthParams::default();
        let serialized = serde_json::to_value(params).expect("synth params should serialize");
        assert_eq!(serialized["line1"]["synthesisMethod"], "pd");
        assert_eq!(serialized["line2"]["synthesisMethod"], "pd");

        let restored: SynthParams =
            serde_json::from_value(serialized).expect("synth params should deserialize");
        assert_eq!(restored.line1.synthesis_method, SynthesisMethod::Pd);
        assert_eq!(restored.line2.synthesis_method, SynthesisMethod::Pd);
        assert_eq!(crate::preset_wire::SYNTH_SCHEMA_VERSION_V1, 1);
    }

    #[test]
    fn legacy_primary_karpunk_migrates_to_engine_params() {
        let mut value = serde_json::to_value(LineParams::default()).expect("serialize line");
        let line = value.as_object_mut().expect("line object");
        line.remove("synthesisMethod");
        line.remove("karpunk");
        line.insert("algo".into(), serde_json::json!("karpunk"));
        line.insert(
            "algoControlsA".into(),
            serde_json::json!([
                { "id": "karpunkDamp", "value": 0.2 },
                { "id": "karpunkBright", "value": 0.3 },
                { "id": "karpunkDecay", "value": 0.8 },
                { "id": "karpunkExcite", "value": 0.4 }
            ]),
        );

        let restored: LineParams = serde_json::from_value(value).expect("deserialize line");
        assert_eq!(restored.synthesis_method, SynthesisMethod::Karpunk);
        assert_eq!(restored.algo, Algo::Saw);
        assert_eq!(restored.algo2, None);
        assert_eq!(restored.karpunk.damping, 0.2);
        assert_eq!(restored.karpunk.brightness, 0.3);
        assert_eq!(restored.karpunk.decay, 0.8);
        assert_eq!(restored.karpunk.excitation, 0.4);
    }

    #[test]
    fn legacy_blended_karpunk_preserves_the_pd_algorithm() {
        let mut value = serde_json::to_value(LineParams::default()).expect("serialize line");
        let line = value.as_object_mut().expect("line object");
        line.insert("synthesisMethod".into(), serde_json::json!("pd"));
        line.remove("karpunk");
        line.insert("algo".into(), serde_json::json!("karpunk"));
        line.insert("algo2".into(), serde_json::json!("fold"));
        line.insert("algoBlend".into(), serde_json::json!(0.6));

        let restored: LineParams = serde_json::from_value(value).expect("deserialize line");
        let serialized = serde_json::to_value(restored).expect("serialize migrated line");
        assert_eq!(restored.synthesis_method, SynthesisMethod::Karpunk);
        assert_eq!(restored.algo, Algo::Fold);
        assert_eq!(restored.algo2, None);
        assert_eq!(serialized["algo"], "fold");
        assert_eq!(serialized["algo2"], serde_json::Value::Null);
    }

    #[test]
    fn fx_slots_default_to_all_empty() {
        let params = SynthParams::default();
        let empty_count = params
            .fx_slots
            .iter()
            .filter(|s| matches!(s, FxSlotConfig::Empty))
            .count();
        assert_eq!(empty_count, 4, "expected 4 empty slots in default config");
    }

    #[test]
    fn fx_slot_config_roundtrip_serialization() {
        let config = FxSlotConfig::Chorus(ChorusParams {
            enabled: true,
            rate: 1.2,
            depth: 0.01,
            mix: 0.5,
        });
        let json = serde_json::to_string(&config).expect("serialize FxSlotConfig");
        let back: FxSlotConfig = serde_json::from_str(&json).expect("deserialize FxSlotConfig");
        assert!(
            matches!(back, FxSlotConfig::Chorus(p) if p.enabled && (p.rate - 1.2).abs() < 1e-5)
        );
    }

    #[test]
    fn fx_slot_config_empty_roundtrip() {
        let config = FxSlotConfig::Empty;
        let json = serde_json::to_string(&config).expect("serialize empty slot");
        assert!(json.contains("\"type\":\"empty\""));
        let back: FxSlotConfig = serde_json::from_str(&json).expect("deserialize empty slot");
        assert!(matches!(back, FxSlotConfig::Empty));
    }

    #[test]
    fn fx_slot_config_default_for_type_sets_enabled() {
        let chorus = FxSlotConfig::default_for_type(FxSlotType::Chorus);
        assert!(chorus.is_enabled());
        assert!(matches!(chorus.slot_type(), FxSlotType::Chorus));

        let empty = FxSlotConfig::default_for_type(FxSlotType::Empty);
        assert!(!empty.is_enabled());

        let reverb = FxSlotConfig::default_for_type(FxSlotType::Reverb);
        assert!(reverb.is_enabled());
    }

    #[test]
    fn fx_slots_missing_from_json_defaults_to_empty() {
        let mut value =
            serde_json::to_value(SynthParams::default()).expect("serialize default params");
        value.as_object_mut().unwrap().remove("fxSlots");
        let decoded: SynthParams =
            serde_json::from_value(value).expect("fxSlots field should default");
        let empty_count = decoded
            .fx_slots
            .iter()
            .filter(|s| matches!(s, FxSlotConfig::Empty))
            .count();
        assert_eq!(empty_count, 4, "expected 4 empty slots in default config");
    }

    #[test]
    fn engine_param_ui_meta_v1_keys_are_unique_and_non_empty() {
        let meta = engine_param_ui_meta_v1();
        let mut seen_keys = std::collections::HashSet::new();
        for entry in meta {
            assert!(!entry.key.is_empty(), "param key must not be empty");
            assert!(
                seen_keys.insert(entry.key),
                "duplicate param key: {}",
                entry.key
            );
        }
    }

    #[test]
    fn engine_param_ui_meta_v1_readout_formats_are_present() {
        for entry in engine_param_ui_meta_v1() {
            let _ = &entry.readout_format;
        }
    }

    #[test]
    fn engine_param_ui_meta_v1_enum_map_values_are_unique() {
        for entry in engine_param_ui_meta_v1() {
            if let EngineParamReadoutFormatV1::EnumMap { values } = &entry.readout_format {
                let mut seen = std::collections::HashSet::new();
                for ev in *values {
                    assert!(
                        !ev.value.is_empty(),
                        "enum value must not be empty for key: {}",
                        entry.key
                    );
                    assert!(
                        !ev.label.is_empty(),
                        "enum label must not be empty for key: {}, value: {}",
                        entry.key,
                        ev.value
                    );
                    assert!(
                        seen.insert(ev.value),
                        "duplicate enum value '{}' for key: {}",
                        ev.value,
                        entry.key
                    );
                }
            }
        }
    }
}
