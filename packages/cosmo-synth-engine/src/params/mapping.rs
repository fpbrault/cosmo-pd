use super::{SynthParams, engine_param_ranges_v1};

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
}

const AUTOMATABLE_PARAMS: &[AutomatableParamSpec] = &[
    AutomatableParamSpec {
        key: "volume",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "warpAAmount",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "warpBAmount",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "algoBlendA",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "algoBlendB",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "line1Level",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "line2Level",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "line1Octave",
        min: -2.0,
        max: 2.0,
    },
    AutomatableParamSpec {
        key: "line2Octave",
        min: -2.0,
        max: 2.0,
    },
    AutomatableParamSpec {
        key: "line2DetuneNote",
        min: -11.0,
        max: 11.0,
    },
    AutomatableParamSpec {
        key: "line2DetuneFine",
        min: -60.0,
        max: 60.0,
    },
    AutomatableParamSpec {
        key: "velocityCurve",
        min: -1.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "pitchBendRange",
        min: 1.0,
        max: 24.0,
    },
    AutomatableParamSpec {
        key: "portamentoRate",
        min: 0.0,
        max: 127.0,
    },
    AutomatableParamSpec {
        key: "portamentoTime",
        min: 0.0,
        max: 5.0,
    },
    AutomatableParamSpec {
        key: "lfoRate",
        min: 0.01,
        max: 30.0,
    },
    AutomatableParamSpec {
        key: "lfoDepth",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "lfoOffset",
        min: -1.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "lfo2Rate",
        min: 0.01,
        max: 30.0,
    },
    AutomatableParamSpec {
        key: "lfo2Depth",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "lfo2Offset",
        min: -1.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "randomRate",
        min: 0.01,
        max: 30.0,
    },
    AutomatableParamSpec {
        key: "modEnvAttack",
        min: 0.0,
        max: 10.0,
    },
    AutomatableParamSpec {
        key: "modEnvDecay",
        min: 0.0,
        max: 10.0,
    },
    AutomatableParamSpec {
        key: "modEnvSustain",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        key: "modEnvRelease",
        min: 0.0,
        max: 10.0,
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
        "lineOctave" => params.octave = value,
        "macro1" => params.macro1 = value,
        "macro2" => params.macro2 = value,
        "macro3" => params.macro3 = value,
        "macro4" => params.macro4 = value,
        _ => return false,
    }
    true
}

pub fn parameter_range_for_key(key: &str) -> Option<(f32, f32)> {
    if let Some(spec) = AUTOMATABLE_PARAMS.iter().find(|spec| spec.key == key) {
        return Some((spec.min, spec.max));
    }

    if let Some(range) = engine_param_ranges_v1()
        .iter()
        .find(|range| range.key == key)
    {
        return Some((range.min, range.max));
    }

    match key {
        "lfoSymmetry" | "lfo2Symmetry" | "macro1" | "macro2" | "macro3" | "macro4" => {
            Some((0.0, 1.0))
        }
        "lineOctave" => Some((-2.0, 2.0)),
        _ => None,
    }
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
        if binding.cc != i32::from(cc)
            || (binding.channel != -1 && binding.channel != i32::from(channel))
        {
            continue;
        }

        let Some((min, max)) = parameter_range_for_key(binding.param_key) else {
            continue;
        };

        let mapped_value = min + normalized * (max - min);
        if set_parameter_value_by_key(params, binding.param_key, mapped_value) {
            applied = true;
        }
    }

    applied
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
}
