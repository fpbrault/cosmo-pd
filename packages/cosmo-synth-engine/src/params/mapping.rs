use crate::generators::{AlgoControlKindV1, algo_definitions_v1};

use super::{
    AlgoControlId, AlgoControlSlots, AlgoControlValueV1, EngineParamRangeV1, LineParams,
    SynthParams, engine_param_ranges_v1,
};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct MidiMappingBinding<'a> {
    pub param_key: &'a str,
    pub channel: i32,
    pub cc: i32,
}

/// A MIDI-mapped param change: the parameter key and its authoritative
/// (clamped, quantized) mapped value.  Emitted by `apply_midi_mapping` so
/// the plugin can send small visual patches to the webview.
#[derive(Clone, Debug, PartialEq)]
pub struct AppliedMidiParamChange {
    pub key: String,
    pub value: f32,
    pub target: AppliedMidiParamTarget,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AppliedMidiAlgoControlSection {
    A,
    B,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AppliedMidiParamTarget {
    Scalar,
    AlgoControl {
        line: u8,
        section: AppliedMidiAlgoControlSection,
        control_id: AlgoControlId,
    },
}

#[derive(Clone, Copy)]
struct AutomatableParamSpec {
    key: &'static str,
    min: f32,
    max: f32,
    step: Option<f32>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
struct AlgoControlMidiSlot {
    line_index: usize,
    slot_index: usize,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum AlgoControlSection {
    A,
    B,
}

#[derive(Clone, Copy, Debug, PartialEq)]
struct ResolvedAlgoControlTarget {
    line_index: usize,
    section: AlgoControlSection,
    control_id: AlgoControlId,
    min: f32,
    max: f32,
}

fn parse_algo_control_midi_slot(key: &str) -> Option<AlgoControlMidiSlot> {
    let suffix = key.strip_prefix("line")?;
    let (line, slot) = suffix.split_once("AlgoControl")?;
    let line_index = match line {
        "1" => 0,
        "2" => 1,
        _ => return None,
    };
    let slot_index = slot.parse::<usize>().ok()?.checked_sub(1)?;
    if slot_index >= 8 || slot.len() != 1 {
        return None;
    }
    Some(AlgoControlMidiSlot {
        line_index,
        slot_index,
    })
}

pub fn is_algo_control_slot_key(key: &str) -> bool {
    parse_algo_control_midi_slot(key).is_some()
}

fn algo_definition_for(algo: super::Algo) -> Option<&'static crate::generators::AlgoDefinitionV1> {
    algo_definitions_v1()
        .iter()
        .find(|definition| definition.id == algo)
}

fn resolve_algo_control_slot(
    params: &SynthParams,
    slot: AlgoControlMidiSlot,
) -> Option<ResolvedAlgoControlTarget> {
    let line = match slot.line_index {
        0 => &params.line1,
        1 => &params.line2,
        _ => return None,
    };
    let mut numeric_slot = 0;

    for (section, algo) in [
        (AlgoControlSection::A, Some(line.algo)),
        (AlgoControlSection::B, line.algo2),
    ] {
        let Some(definition) = algo.and_then(algo_definition_for) else {
            continue;
        };
        for control in definition.controls {
            if control.kind != AlgoControlKindV1::Number {
                continue;
            }
            if numeric_slot == slot.slot_index {
                let control_id = AlgoControlId::from_str(control.id);
                if control_id == AlgoControlId::Unknown {
                    return None;
                }
                return Some(ResolvedAlgoControlTarget {
                    line_index: slot.line_index,
                    section,
                    control_id,
                    min: control.min.unwrap_or(0.0),
                    max: control.max.unwrap_or(1.0),
                });
            }
            numeric_slot += 1;
            if numeric_slot >= 8 {
                return None;
            }
        }
    }
    None
}

fn upsert_algo_control_value(
    controls: &mut AlgoControlSlots,
    control_id: AlgoControlId,
    value: f32,
) -> bool {
    if let Some(existing) = controls
        .iter_mut()
        .flatten()
        .find(|entry| entry.id == control_id)
    {
        existing.value = value;
        return true;
    }
    let Some(empty) = controls.iter_mut().find(|entry| entry.is_none()) else {
        return false;
    };
    *empty = Some(AlgoControlValueV1 {
        id: control_id,
        value,
    });
    true
}

fn apply_virtual_algo_control_midi_mapping(
    params: &mut SynthParams,
    key: &str,
    normalized_value: f32,
) -> Option<AppliedMidiParamChange> {
    let slot = parse_algo_control_midi_slot(key)?;
    let target = resolve_algo_control_slot(params, slot)?;
    let mapped = target.min + normalized_value.clamp(0.0, 1.0) * (target.max - target.min);
    let line: &mut LineParams = match target.line_index {
        0 => &mut params.line1,
        1 => &mut params.line2,
        _ => return None,
    };
    let controls = match target.section {
        AlgoControlSection::A => &mut line.algo_controls_a,
        AlgoControlSection::B => &mut line.algo_controls_b,
    };
    if !upsert_algo_control_value(controls, target.control_id, mapped) {
        return None;
    }
    Some(AppliedMidiParamChange {
        key: key.to_string(),
        value: mapped,
        target: AppliedMidiParamTarget::AlgoControl {
            line: target.line_index as u8 + 1,
            section: match target.section {
                AlgoControlSection::A => AppliedMidiAlgoControlSection::A,
                AlgoControlSection::B => AppliedMidiAlgoControlSection::B,
            },
            control_id: target.control_id,
        },
    })
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

/// Returns the canonical static key accepted by realtime parameter events.
pub fn canonical_parameter_key(key: &str) -> Option<&'static str> {
    match key {
        "volume" => Some("volume"),
        "warpAAmount" => Some("warpAAmount"),
        "warpBAmount" => Some("warpBAmount"),
        "algoBlendA" => Some("algoBlendA"),
        "algoBlendB" => Some("algoBlendB"),
        "line1Level" => Some("line1Level"),
        "line2Level" => Some("line2Level"),
        "line1Octave" => Some("line1Octave"),
        "line2Octave" => Some("line2Octave"),
        "line2DetuneNote" => Some("line2DetuneNote"),
        "line2DetuneFine" => Some("line2DetuneFine"),
        "velocityCurve" => Some("velocityCurve"),
        "pitchBendRange" => Some("pitchBendRange"),
        "portamentoRate" => Some("portamentoRate"),
        "portamentoTime" => Some("portamentoTime"),
        "lfoRate" => Some("lfoRate"),
        "lfoDepth" => Some("lfoDepth"),
        "lfoSymmetry" => Some("lfoSymmetry"),
        "lfoOffset" => Some("lfoOffset"),
        "lfo2Rate" => Some("lfo2Rate"),
        "lfo2Depth" => Some("lfo2Depth"),
        "lfo2Symmetry" => Some("lfo2Symmetry"),
        "lfo2Offset" => Some("lfo2Offset"),
        "randomRate" => Some("randomRate"),
        "modEnvAttack" => Some("modEnvAttack"),
        "modEnvDecay" => Some("modEnvDecay"),
        "modEnvSustain" => Some("modEnvSustain"),
        "modEnvRelease" => Some("modEnvRelease"),
        "tempoBpm" => Some("tempoBpm"),
        "lineOctave" => Some("lineOctave"),
        "macro1" => Some("macro1"),
        "macro2" => Some("macro2"),
        "macro3" => Some("macro3"),
        "macro4" => Some("macro4"),
        _ => None,
    }
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
) -> Vec<AppliedMidiParamChange> {
    let normalized = f32::from(value) / 127.0;
    let mut changes = Vec::with_capacity(bindings.len());

    for binding in bindings {
        if let Some(change) = apply_midi_mapping_binding(
            params,
            binding.param_key,
            binding.channel,
            binding.cc,
            channel,
            cc,
            normalized,
        ) {
            changes.push(change);
        }
    }

    changes
}

pub fn apply_midi_mapping_binding(
    params: &mut SynthParams,
    param_key: &str,
    binding_channel: i32,
    binding_cc: i32,
    channel: u8,
    cc: u8,
    normalized_value: f32,
) -> Option<AppliedMidiParamChange> {
    if binding_cc != i32::from(cc)
        || (binding_channel != -1 && binding_channel != i32::from(channel))
    {
        return None;
    }
    if let Some(change) =
        apply_virtual_algo_control_midi_mapping(params, param_key, normalized_value)
    {
        return Some(change);
    }
    let (min, max) = parameter_range_for_key(param_key)?;
    let mapped = min + normalized_value.clamp(0.0, 1.0) * (max - min);
    let step = parameter_step_for_key(param_key);
    let quantized = quantize_midi_mapped_value(mapped, step, min);
    if set_parameter_value_by_key(params, param_key, quantized) {
        Some(AppliedMidiParamChange {
            key: param_key.to_string(),
            value: quantized,
            target: AppliedMidiParamTarget::Scalar,
        })
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn midi_mapping_applies_matching_binding() {
        let mut params = SynthParams::default();
        let changes = apply_midi_mapping(
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

        assert_eq!(changes.len(), 1);
        assert_eq!(changes[0].key, "macro1");
        assert_eq!(changes[0].value, 1.0);
        assert_eq!(params.macro1, 1.0);
    }

    #[test]
    fn midi_mapping_ignores_non_matching_channel() {
        let mut params = SynthParams::default();
        let changes = apply_midi_mapping(
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

        assert!(changes.is_empty());
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

        let changes = apply_midi_mapping(&mut params, &bindings, 0, 12, 0);
        assert_eq!(changes.len(), 2);
        assert_eq!(params.line1.octave, -2.0);
        assert_eq!(params.line2.detune_fine, -60.0);
    }

    #[test]
    fn midi_mapping_quantizes_octave_control_to_integer() {
        let mut params = SynthParams::default();
        // CC 15, value 76 → normalized ~0.598 → lineOctave = -2 + 0.598*4 ≈ 0.394 → quantized to 0
        let changes = apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "lineOctave",
                channel: -1,
                cc: 15,
            }],
            0,
            15,
            76,
        );
        assert_eq!(changes.len(), 1);
        assert_eq!(changes[0].value, 0.0);
        assert_eq!(params.line1.octave, 0.0);
        assert_eq!(params.line2.octave, 0.0);
    }

    #[test]
    fn midi_mapping_quantizes_octave_cc_127_to_max() {
        let mut params = SynthParams::default();
        // CC 16, value 127 → normalized 1.0 → lineOctave = -2 + 1.0*4 = 2.0 → quantized to 2.0
        let changes = apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "lineOctave",
                channel: -1,
                cc: 16,
            }],
            0,
            16,
            127,
        );
        assert_eq!(changes.len(), 1);
        assert_eq!(changes[0].value, 2.0);
        assert_eq!(params.line1.octave, 2.0);
    }

    #[test]
    fn midi_mapping_quantizes_octave_cc_0_to_min() {
        let mut params = SynthParams::default();
        // CC 17, value 0 → normalized 0.0 → lineOctave = -2.0 → quantized to -2.0
        let changes = apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "lineOctave",
                channel: -1,
                cc: 17,
            }],
            0,
            17,
            0,
        );
        assert_eq!(changes.len(), 1);
        assert_eq!(changes[0].value, -2.0);
        assert_eq!(params.line1.octave, -2.0);
    }

    #[test]
    fn midi_mapping_does_not_quantize_continuous_param() {
        let mut params = SynthParams::default();
        // volume has no step → must remain continuous
        let changes = apply_midi_mapping(
            &mut params,
            &[MidiMappingBinding {
                param_key: "volume",
                channel: -1,
                cc: 18,
            }],
            0,
            18,
            64,
        );
        assert_eq!(changes.len(), 1);
        assert_eq!(changes[0].key, "volume");
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

    #[test]
    fn parses_only_canonical_algo_control_midi_slots() {
        for (key, line_index, slot_index) in [
            ("line1AlgoControl1", 0, 0),
            ("line1AlgoControl8", 0, 7),
            ("line2AlgoControl1", 1, 0),
            ("line2AlgoControl8", 1, 7),
        ] {
            assert_eq!(
                parse_algo_control_midi_slot(key),
                Some(AlgoControlMidiSlot {
                    line_index,
                    slot_index,
                })
            );
        }

        for key in [
            "line0AlgoControl1",
            "line3AlgoControl1",
            "line1AlgoControl0",
            "line1AlgoControl9",
            "line1AlgoControl01",
            "line1AlgoAControldepth",
            "line1AlgoControlDepth",
            "line1AlgoParam1",
        ] {
            assert_eq!(parse_algo_control_midi_slot(key), None, "{key}");
        }
    }

    #[test]
    fn resolves_algo_a_then_algo_b_numeric_controls() {
        let mut params = SynthParams::default();
        params.line1.algo = super::super::Algo::Bend;
        params.line1.algo2 = Some(super::super::Algo::Fold);

        let first = resolve_algo_control_slot(
            &params,
            AlgoControlMidiSlot {
                line_index: 0,
                slot_index: 0,
            },
        )
        .unwrap();
        assert_eq!(first.section, AlgoControlSection::A);
        assert_eq!(first.control_id, AlgoControlId::BendCurve);

        let first_b = resolve_algo_control_slot(
            &params,
            AlgoControlMidiSlot {
                line_index: 0,
                slot_index: 3,
            },
        )
        .unwrap();
        assert_eq!(first_b.section, AlgoControlSection::B);
        assert_eq!(first_b.control_id, AlgoControlId::FoldStages);
    }

    #[test]
    fn non_numeric_controls_do_not_consume_algo_control_slots() {
        let mut params = SynthParams::default();
        params.line1.algo = super::super::Algo::Cz101;
        params.line1.algo2 = Some(super::super::Algo::Bend);

        let target = resolve_algo_control_slot(
            &params,
            AlgoControlMidiSlot {
                line_index: 0,
                slot_index: 0,
            },
        )
        .unwrap();
        assert_eq!(target.section, AlgoControlSection::B);
        assert_eq!(target.control_id, AlgoControlId::BendCurve);
    }

    #[test]
    fn resolves_at_most_eight_algo_control_slots_per_line() {
        let mut params = SynthParams::default();
        params.line2.algo = super::super::Algo::Fold;
        params.line2.algo2 = Some(super::super::Algo::Skew);

        let eighth = resolve_algo_control_slot(
            &params,
            AlgoControlMidiSlot {
                line_index: 1,
                slot_index: 7,
            },
        )
        .unwrap();
        assert_eq!(eighth.section, AlgoControlSection::B);
        assert_eq!(eighth.control_id, AlgoControlId::SkewTilt);
    }

    #[test]
    fn virtual_algo_control_mapping_uses_current_range_and_upserts() {
        let mut params = SynthParams::default();
        params.line1.algo = super::super::Algo::Bend;

        let min = apply_midi_mapping_binding(&mut params, "line1AlgoControl2", -1, 74, 0, 74, 0.0)
            .unwrap();
        assert_eq!(min.key, "line1AlgoControl2");
        assert_eq!(min.value, -1.0);

        let max = apply_midi_mapping_binding(&mut params, "line1AlgoControl2", -1, 74, 0, 74, 1.0)
            .unwrap();
        assert_eq!(max.value, 1.0);

        let entries: Vec<_> = params.line1.algo_controls_a.iter().flatten().collect();
        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].id, AlgoControlId::BendBias);
        assert_eq!(entries[0].value, 1.0);
    }

    #[test]
    fn virtual_algo_control_mapping_tracks_dynamic_algo_changes() {
        let mut params = SynthParams::default();
        params.line1.algo = super::super::Algo::Bend;

        let bend_change =
            apply_midi_mapping_binding(&mut params, "line1AlgoControl1", -1, 11, 0, 11, 0.25)
                .unwrap();
        assert_eq!(bend_change.key, "line1AlgoControl1");
        assert!(params.line1.algo_controls_a.iter().flatten().any(|entry| {
            entry.id == AlgoControlId::BendCurve && (entry.value - 0.25).abs() < f32::EPSILON
        }));

        params.line1.algo = super::super::Algo::Fold;
        let fold_change =
            apply_midi_mapping_binding(&mut params, "line1AlgoControl1", -1, 11, 0, 11, 0.75)
                .unwrap();
        assert_eq!(fold_change.key, "line1AlgoControl1");
        assert!(params.line1.algo_controls_a.iter().flatten().any(|entry| {
            entry.id == AlgoControlId::FoldStages && (entry.value - 0.75).abs() < f32::EPSILON
        }));
    }
}
