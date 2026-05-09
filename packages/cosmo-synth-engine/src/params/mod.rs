//! Synth parameter types and UI metadata.

mod envelopes;
mod filter;
mod fx_params;
mod line;
mod lfo;
mod modulation;
mod portamento;
mod synth_params;
mod ui_meta;
mod waveforms;

// Re-exports for backward compatibility
pub use envelopes::{EnvStep, StepEnvData, NUM_ENV_STEPS};
pub use filter::{FilterParams, FilterType};
pub use fx_params::{
    BitcrusherParams, ChorusParams, CompressorParams, DelayParams, DistortionParams, EqParams,
    FxSlotConfig, FxSlotType, GrainDelayParams, JunoChorusParams, LoFiParams, PhaseModParams,
    PhaserParams, ReverbParams, RingModParams, ShimmerVerbParams, TremoloParams, VibratoParams,
    WavefolderParams,
};
pub use line::{AlgoControlValueV1, LineParams, LineSelect, ModMode, PolyMode};
pub use lfo::{LfoParams, LfoWaveform};
pub use modulation::{ModDestination, ModMatrix, ModRoute, ModSource};
pub use portamento::{PortamentoMode, PortamentoParams};
pub use synth_params::{ModEnvParams, RandomParams, SynthParams, NUM_VOICES};
pub use ui_meta::{
    EngineEnumValueLabelV1, EngineEnumValueTooltipV1, EngineParamRangeV1,
    EngineParamReadoutFormatV1, EngineParamUiMetaV1, engine_enum_value_tooltips_v1,
    engine_param_default_v1, engine_param_ranges_v1, engine_param_ui_meta_v1,
};
pub use waveforms::{Algo, BaseWaveform, CzAlgo, CzWaveform, WindowType};

#[cfg(test)]
mod tests {
    use super::*;
    use crate::default_envelopes::{default_dca_env, default_dco_env, default_dcw_env};

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
    fn engine_param_ui_meta_v1_labels_and_tooltips_non_empty() {
        for entry in engine_param_ui_meta_v1() {
            assert!(
                !entry.tooltip.is_empty(),
                "tooltip must not be empty for key: {}",
                entry.key
            );
            assert!(
                !entry.readout_label.is_empty(),
                "readout_label must not be empty for key: {}",
                entry.key
            );
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

    #[test]
    fn engine_enum_value_tooltips_v1_are_unique_and_non_empty() {
        let tooltips = engine_enum_value_tooltips_v1();
        let mut seen = std::collections::HashSet::new();
        for entry in tooltips {
            assert!(!entry.key.is_empty(), "enum tooltip key must not be empty");
            assert!(
                !entry.value.is_empty(),
                "enum tooltip value must not be empty for key: {}",
                entry.key
            );
            assert!(
                !entry.tooltip.is_empty(),
                "tooltip must not be empty for key: {}, value: {}",
                entry.key,
                entry.value
            );
            assert!(
                seen.insert((entry.key, entry.value)),
                "duplicate (key, value) pair: ({}, {})",
                entry.key,
                entry.value
            );
        }
    }
}
