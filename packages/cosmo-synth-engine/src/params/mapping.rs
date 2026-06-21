use super::{EngineParamRangeV1, SynthParams, engine_param_ranges_v1};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct MidiMappingBinding<'a> {
    pub param_key: &'a str,
    pub channel: i32,
    pub cc: i32,
}

#[derive(Clone, Copy)]
struct AutomatableParamSpec {
    key: &'static str,
    min: f32,
    max: f32,
    step: Option<f32>,
}

const AUTOMATABLE_PARAMS: &[AutomatableParamSpec] = &[
    AutomatableParamSpec {
        key: "volume",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "warpAAmount",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "warpBAmount",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "algoBlendA",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "algoBlendB",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "line1Level",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "line2Level",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "line1Octave",
        min: -2.0,
        max: 2.0,
        step: Some(1.0),
    },
    AutomatableParamSpec {
        key: "line2Octave",
        min: -2.0,
        max: 2.0,
        step: Some(1.0),
    },
    AutomatableParamSpec {
        key: "line2DetuneNote",
        min: -11.0,
        max: 11.0,
        step: Some(1.0),
    },
    AutomatableParamSpec {
        key: "line2DetuneFine",
        min: -60.0,
        max: 60.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "velocityCurve",
        min: -1.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "pitchBendRange",
        min: 1.0,
        max: 24.0,
        step: Some(1.0),
    },
    AutomatableParamSpec {
        key: "portamentoRate",
        min: 0.0,
        max: 127.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "portamentoTime",
        min: 0.0,
        max: 5.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "lfoRate",
        min: 0.01,
        max: 30.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "lfoDepth",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "lfoOffset",
        min: -1.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "lfo2Rate",
        min: 0.01,
        max: 30.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "lfo2Depth",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "lfo2Offset",
        min: -1.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "randomRate",
        min: 0.01,
        max: 30.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "modEnvAttack",
        min: 0.0,
        max: 10.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "modEnvDecay",
        min: 0.0,
        max: 10.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "modEnvSustain",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    AutomatableParamSpec {
        key: "modEnvRelease",
        min: 0.0,
        max: 10.0,
        step: None,
    },
];

const MIDI_MAPPING_EXTRA_RANGES_V1: &[EngineParamRangeV1] = &[
    EngineParamRangeV1 {
        key: "lineOctave",
        min: -2.0,
        max: 2.0,
        step: Some(1.0),
    },
    EngineParamRangeV1 {
        key: "line2DetuneOctave",
        min: -3.0,
        max: 3.0,
        step: Some(1.0),
    },
    EngineParamRangeV1 {
        key: "lfoSymmetry",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    EngineParamRangeV1 {
        key: "lfo2Symmetry",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    EngineParamRangeV1 {
        key: "macro1",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    EngineParamRangeV1 {
        key: "macro2",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    EngineParamRangeV1 {
        key: "macro3",
        min: 0.0,
        max: 1.0,
        step: None,
    },
    EngineParamRangeV1 {
        key: "macro4",
        min: 0.0,
        max: 1.0,
        step: None,
    },
];

pub fn set_parameter_value_by_key(params: &mut SynthParams, key: &str, value: f32) -> bool {
    match key {
        "volume" => params.volume = value,
        "warpAAmount" => params.line1.dcw_base = value,
        "warpBAmount" => params.line2.dcw_base = value,
        "algoBlendA" => params.line1.algo_blend = value,
        "algoBlendB" => params.line2.algo_blend = value,
        "line1Level" => params.line1.dca_base = value,
        "line2Level" => params.line2.dca_base = value,
        "line1Octave" => params.line1.octave = value,
        "line2Octave" => params.line2.octave = value,
        "line2DetuneNote" => params.line2.detune_note = value,
        "line2DetuneFine" => params.line2.detune_fine = value,
        "velocityCurve" => params.velocity_curve = value,
        "pitchBendRange" => params.pitch_bend_range = value,
        "portamentoRate" => params.portamento.rate = value,
        "portamentoTime" => params.portamento.time = value,
        "lfoRate" => params.lfo.rate = value,
        "lfoDepth" => params.lfo.depth = value,
        "lfoSymmetry" => params.lfo.symmetry = value,
        "lfoOffset" => params.lfo.offset = value,
        "lfo2Rate" => params.lfo2.rate = value,
        "lfo2Depth" => params.lfo2.depth = value,
        "lfo2Symmetry" => params.lfo2.symmetry = value,
        "lfo2Offset" => params.lfo2.offset = value,
        "randomRate" => params.random.rate = value,
        "modEnvAttack" => params.mod_env.attack = value,
        "modEnvDecay" => params.mod_env.decay = value,
        "modEnvSustain" => params.mod_env.sustain = value,
        "modEnvRelease" => params.mod_env.release = value,
        "tempoBpm" => params.tempo_bpm = value,
        "lineOctave" => {
            let detune_octave = params.line2.octave - params.line1.octave;
            params.line1.octave = value;
            params.line2.octave = value + detune_octave;
        }
        "line2DetuneOctave" => params.line2.octave = params.line1.octave + value,
        "macro1" => params.macro1 = value,
        "macro2" => params.macro2 = value,
        "macro3" => params.macro3 = value,
        "macro4" => params.macro4 = value,
        _ => return false,
    }
    true
}

pub fn parameter_range_for_key(key: &str) -> Option<(f32, f32)> {
    parameter_range_v1_for_key(key).map(|r| (r.min, r.max))
}

pub fn parameter_step_for_key(key: &str) -> Option<f32> {
    parameter_range_v1_for_key(key).and_then(|r| r.step)
}

fn parameter_range_v1_for_key(key: &str) -> Option<EngineParamRangeV1> {
    if let Some(spec) = AUTOMATABLE_PARAMS.iter().find(|spec| spec.key == key) {
        return Some(EngineParamRangeV1 {
            key: spec.key,
            min: spec.min,
            max: spec.max,
            step: spec.step,
        });
    }

    if let Some(range) = engine_param_ranges_v1()
        .iter()
        .find(|range| range.key == key)
    {
        return Some(*range);
    }

    if let Some(range) = MIDI_MAPPING_EXTRA_RANGES_V1
        .iter()
        .find(|range| range.key == key)
    {
        return Some(*range);
    }

    None
}

fn quantize_midi_mapped_value(value: f32, step: Option<f32>, _min: f32) -> f32 {
    match step {
        Some(s) if s > 0.0 => (value / s).round() * s,
        _ => value,
    }
}

pub fn midi_mapping_param_ranges_v1() -> Vec<EngineParamRangeV1> {
    AUTOMATABLE_PARAMS
        .iter()
        .map(|spec| EngineParamRangeV1 {
            key: spec.key,
            min: spec.min,
            max: spec.max,
            step: spec.step,
        })
        .chain(engine_param_ranges_v1().iter().copied())
        .chain(MIDI_MAPPING_EXTRA_RANGES_V1.iter().copied())
        .fold(Vec::new(), |mut ranges, range| {
            if !ranges.iter().any(|existing| existing.key == range.key) {
                ranges.push(range);
            }
            ranges
        })
}

pub fn apply_midi_mapping(
    params: &mut SynthParams,
    bindings: &[MidiMappingBinding<'_>],
    channel: u8,
    cc: u8,
    value: u8,
) -> bool {
    let normalized = f32::from(value) / 127.0;
    let mut applied = false;

    for binding in bindings {
        if apply_midi_mapping_binding(
            params,
            binding.param_key,
            binding.channel,
            binding.cc,
            channel,
            cc,
            normalized,
        ) {
            applied = true;
        }
    }

    applied
}

pub fn apply_midi_mapping_binding(
    params: &mut SynthParams,
    param_key: &str,
    binding_channel: i32,
    binding_cc: i32,
    channel: u8,
    cc: u8,
    normalized_value: f32,
) -> bool {
    if binding_cc != i32::from(cc)
        || (binding_channel != -1 && binding_channel != i32::from(channel))
    {
        return false;
    }
    let Some((min, max)) = parameter_range_for_key(param_key) else {
        return false;
    };
    let mapped = min + normalized_value.clamp(0.0, 1.0) * (max - min);
    let step = parameter_step_for_key(param_key);
    let quantized = quantize_midi_mapped_value(mapped, step, min);
    set_parameter_value_by_key(params, param_key, quantized)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn midi_mapping_applies_matching_binding() {
        let mut params = SynthParams::default();
        let applied = apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "macro1",
                channel: -1,
                cc: 74,
            }],
            0,
            74,
            127,
        );

        assert!(applied);
        assert_eq!(params.macro1, 1.0);
    }

    #[test]
    fn midi_mapping_ignores_non_matching_channel() {
        let mut params = SynthParams::default();
        let applied = apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "macro1",
                channel: 3,
                cc: 74,
            }],
            2,
            74,
            127,
        );

        assert!(!applied);
        assert_eq!(params.macro1, 0.0);
    }

    #[test]
    fn midi_mapping_ranges_cover_bipolar_and_integer_targets() {
        assert_eq!(parameter_range_for_key("lineOctave"), Some((-2.0, 2.0)));
        assert_eq!(
            parameter_range_for_key("line2DetuneFine"),
            Some((-60.0, 60.0))
        );
        assert_eq!(parameter_range_for_key("missing"), None);
    }

    #[test]
    fn shared_line_octave_preserves_line_two_detune_offset() {
        let mut params = SynthParams::default();
        params.line1.octave = 0.0;
        params.line2.octave = 2.0;
        params.octave = 1.0;

        assert!(set_parameter_value_by_key(&mut params, "lineOctave", -2.0));
        assert_eq!(params.line1.octave, -2.0);
        assert_eq!(params.line2.octave, 0.0);
        assert_eq!(params.octave, 1.0);
    }

    #[test]
    fn line_two_detune_octave_is_relative_to_line_one() {
        let mut params = SynthParams::default();
        params.line1.octave = -1.0;

        assert!(set_parameter_value_by_key(
            &mut params,
            "line2DetuneOctave",
            3.0,
        ));
        assert_eq!(params.line2.octave, 2.0);
    }

    #[test]
    fn midi_mapping_applies_every_binding_for_the_same_cc() {
        let mut params = SynthParams::default();
        let bindings = [
            MidiMappingBinding {
                param_key: "lineOctave",
                channel: -1,
                cc: 12,
            },
            MidiMappingBinding {
                param_key: "line2DetuneFine",
                channel: -1,
                cc: 12,
            },
        ];

        assert!(apply_midi_mapping(&mut params, &bindings, 0, 12, 0));
        assert_eq!(params.line1.octave, -2.0);
        assert_eq!(params.line2.detune_fine, -60.0);
    }

    #[test]
    fn midi_mapping_quantizes_octave_control_to_integer() {
        let mut params = SynthParams::default();
        // CC 15, value 76 → normalized ~0.598 → lineOctave = -2 + 0.598*4 ≈ 0.394 → quantized to 0
        assert!(apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "lineOctave",
                channel: -1,
                cc: 15,
            }],
            0,
            15,
            76,
        ));
        assert_eq!(params.line1.octave, 0.0);
        assert_eq!(params.line2.octave, 0.0);
    }

    #[test]
    fn midi_mapping_quantizes_octave_cc_127_to_max() {
        let mut params = SynthParams::default();
        // CC 16, value 127 → normalized 1.0 → lineOctave = -2 + 1.0*4 = 2.0 → quantized to 2.0
        assert!(apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "lineOctave",
                channel: -1,
                cc: 16,
            }],
            0,
            16,
            127,
        ));
        assert_eq!(params.line1.octave, 2.0);
    }

    #[test]
    fn midi_mapping_quantizes_octave_cc_0_to_min() {
        let mut params = SynthParams::default();
        // CC 17, value 0 → normalized 0.0 → lineOctave = -2.0 → quantized to -2.0
        assert!(apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "lineOctave",
                channel: -1,
                cc: 17,
            }],
            0,
            17,
            0,
        ));
        assert_eq!(params.line1.octave, -2.0);
    }

    #[test]
    fn midi_mapping_does_not_quantize_continuous_param() {
        let mut params = SynthParams::default();
        // volume has no step → must remain continuous
        assert!(apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "volume",
                channel: -1,
                cc: 18,
            }],
            0,
            18,
            64,
        ));
        // volume range 0..1, value 64 = normalized 64/127 ≈ 0.5039
        let expected = 64.0_f32 / 127.0;
        assert!((params.volume - expected).abs() < 0.001);
    }

    #[test]
    fn parameter_step_for_key_returns_correct_steps() {
        assert_eq!(parameter_step_for_key("lineOctave"), Some(1.0));
        assert_eq!(parameter_step_for_key("line1Octave"), Some(1.0));
        assert_eq!(parameter_step_for_key("pitchBendRange"), Some(1.0));
        assert_eq!(parameter_step_for_key("volume"), None);
        assert_eq!(parameter_step_for_key("lfoDepth"), None);
        assert_eq!(parameter_step_for_key("missing"), None);
    }
}
