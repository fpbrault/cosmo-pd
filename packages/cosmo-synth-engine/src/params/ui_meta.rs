use serde::Serialize;

use super::fx_params::{
    ChorusParams, DelayParams, PhaseModParams, PhaserParams, ReverbParams, VibratoParams,
};
use super::synth_params::SynthParams;

/// Readout label for one string enum value.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(specta::Type))]
#[serde(rename_all = "camelCase")]
pub struct EngineEnumValueLabelV1 {
    pub value: &'static str,
    pub label: &'static str,
}

/// Engine-owned formatting strategy for infobar readouts.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(specta::Type))]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum EngineParamReadoutFormatV1 {
    OnOff,
    Raw,
    Uppercase,
    Integer,
    Decimal,
    Percent,
    BipolarPercent,
    Degrees,
    Semitones,
    Milliseconds,
    Seconds2,
    Hertz,
    EnumMap {
        values: &'static [EngineEnumValueLabelV1],
    },
}

/// Engine-owned UI metadata for one parameter key.
#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EngineParamUiMetaV1 {
    pub key: &'static str,
    pub readout_format: EngineParamReadoutFormatV1,
}

/// Engine-owned numeric range metadata for one parameter key.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(specta::Type))]
#[serde(rename_all = "camelCase")]
pub struct EngineParamRangeV1 {
    pub key: &'static str,
    pub min: f32,
    pub max: f32,
}

const POLY_MODE_LABELS_V1: [EngineEnumValueLabelV1; 2] = [
    EngineEnumValueLabelV1 {
        value: "poly8",
        label: "POLY 8",
    },
    EngineEnumValueLabelV1 {
        value: "mono",
        label: "MONO",
    },
];

const LFO_RATE_MODE_LABELS_V1: [EngineEnumValueLabelV1; 2] = [
    EngineEnumValueLabelV1 {
        value: "hz",
        label: "HZ",
    },
    EngineEnumValueLabelV1 {
        value: "sync",
        label: "SYNC",
    },
];

const LFO_SYNC_DIVISION_LABELS_V1: [EngineEnumValueLabelV1; 10] = [
    EngineEnumValueLabelV1 {
        value: "whole",
        label: "1/1",
    },
    EngineEnumValueLabelV1 {
        value: "half",
        label: "1/2",
    },
    EngineEnumValueLabelV1 {
        value: "quarter",
        label: "1/4",
    },
    EngineEnumValueLabelV1 {
        value: "eighth",
        label: "1/8",
    },
    EngineEnumValueLabelV1 {
        value: "sixteenth",
        label: "1/16",
    },
    EngineEnumValueLabelV1 {
        value: "thirtySecond",
        label: "1/32",
    },
    EngineEnumValueLabelV1 {
        value: "dottedQuarter",
        label: "1/4.",
    },
    EngineEnumValueLabelV1 {
        value: "dottedEighth",
        label: "1/8.",
    },
    EngineEnumValueLabelV1 {
        value: "quarterTriplet",
        label: "1/4T",
    },
    EngineEnumValueLabelV1 {
        value: "eighthTriplet",
        label: "1/8T",
    },
];

const ENGINE_PARAM_UI_META_V1: [EngineParamUiMetaV1; 58] = [
    EngineParamUiMetaV1 {
        key: "volume",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "warpAAmount",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "warpBAmount",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "algoBlendA",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "algoBlendB",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "line1Level",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "line2Level",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "line1Octave",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line2Octave",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line2DetuneNote",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line2DetuneFine",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "lineSelect",
        readout_format: EngineParamReadoutFormatV1::Raw,
    },
    EngineParamUiMetaV1 {
        key: "modMode",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "polyMode",
        readout_format: EngineParamReadoutFormatV1::EnumMap {
            values: &POLY_MODE_LABELS_V1,
        },
    },
    EngineParamUiMetaV1 {
        key: "intPmAmount",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "intPmRatio",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "pmPre",
        readout_format: EngineParamReadoutFormatV1::OnOff,
    },
    EngineParamUiMetaV1 {
        key: "vibratoRate",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "vibratoDepth",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "vibratoDelay",
        readout_format: EngineParamReadoutFormatV1::Milliseconds,
    },
    EngineParamUiMetaV1 {
        key: "lfoWaveform",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "tempoBpm",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfoRate",
        readout_format: EngineParamReadoutFormatV1::Hertz,
    },
    EngineParamUiMetaV1 {
        key: "lfoRateMode",
        readout_format: EngineParamReadoutFormatV1::EnumMap {
            values: &LFO_RATE_MODE_LABELS_V1,
        },
    },
    EngineParamUiMetaV1 {
        key: "lfoSyncDivision",
        readout_format: EngineParamReadoutFormatV1::EnumMap {
            values: &LFO_SYNC_DIVISION_LABELS_V1,
        },
    },
    EngineParamUiMetaV1 {
        key: "lfoDepth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfoSymmetry",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfoOffset",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Rate",
        readout_format: EngineParamReadoutFormatV1::Hertz,
    },
    EngineParamUiMetaV1 {
        key: "lfo2RateMode",
        readout_format: EngineParamReadoutFormatV1::EnumMap {
            values: &LFO_RATE_MODE_LABELS_V1,
        },
    },
    EngineParamUiMetaV1 {
        key: "lfo2SyncDivision",
        readout_format: EngineParamReadoutFormatV1::EnumMap {
            values: &LFO_SYNC_DIVISION_LABELS_V1,
        },
    },
    EngineParamUiMetaV1 {
        key: "lfo2Depth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Symmetry",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Offset",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "randomRate",
        readout_format: EngineParamReadoutFormatV1::Hertz,
    },
    EngineParamUiMetaV1 {
        key: "modEnvAttack",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "modEnvDecay",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "modEnvSustain",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "modEnvRelease",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "chorusRate",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "chorusDepth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "chorusMix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayTime",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "delayFeedback",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayWarmth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayMix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayTapeMode",
        readout_format: EngineParamReadoutFormatV1::OnOff,
    },
    EngineParamUiMetaV1 {
        key: "reverbSpace",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbPredelay",
        readout_format: EngineParamReadoutFormatV1::Milliseconds,
    },
    EngineParamUiMetaV1 {
        key: "reverbDistance",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbCharacter",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbMix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "portamentoMode",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "portamentoRate",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "portamentoTime",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "pitchBendRange",
        readout_format: EngineParamReadoutFormatV1::Semitones,
    },
    EngineParamUiMetaV1 {
        key: "velocityCurve",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "modWheelVibratoDepth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
];

const ENGINE_PARAM_RANGES_V1: [EngineParamRangeV1; 2] = [
    EngineParamRangeV1 {
        key: "tempoBpm",
        min: 20.0,
        max: 300.0,
    },
    EngineParamRangeV1 {
        key: "randomRate",
        min: 0.0,
        max: 200.0,
    },
];

pub fn engine_param_ui_meta_v1() -> &'static [EngineParamUiMetaV1] {
    &ENGINE_PARAM_UI_META_V1
}

pub fn engine_param_ranges_v1() -> &'static [EngineParamRangeV1] {
    &ENGINE_PARAM_RANGES_V1
}

/// Engine-owned numeric defaults for UI parameters where a concrete number
/// exists and should be reused by frontend state initialization.
pub fn engine_param_default_v1(key: &str) -> Option<f32> {
    let synth = SynthParams::default();
    let line1 = &synth.line1;
    let line2 = &synth.line2;
    let phase_mod = PhaseModParams::default();
    let vibrato = VibratoParams::default();
    let chorus = ChorusParams::default();
    let delay = DelayParams::default();
    let reverb = ReverbParams::default();
    let phaser = PhaserParams::default();

    match key {
        "volume" => Some(synth.volume),
        "warpAAmount" => Some(line1.dcw_base),
        "warpBAmount" => Some(line2.dcw_base),
        "algoBlendA" => Some(line1.algo_blend),
        "algoBlendB" => Some(line2.algo_blend),
        "line1Level" => Some(line1.dca_base),
        "line2Level" => Some(line2.dca_base),
        "line1Octave" => Some(line1.octave),
        "line2Octave" => Some(line2.octave),
        "line2DetuneOctave" => Some(line2.octave - line1.octave),
        "line2DetuneNote" => Some(line2.detune_note),
        "line2DetuneFine" => Some(line2.detune_fine),
        "intPmAmount" => Some(phase_mod.amount),
        "intPmRatio" => Some(phase_mod.ratio),
        "pmPre" => Some(if phase_mod.pm_pre { 1.0 } else { 0.0 }),
        "vibratoRate" => Some(vibrato.rate),
        "vibratoDepth" => Some(vibrato.depth),
        "vibratoDelay" => Some(vibrato.delay),
        "tempoBpm" => Some(synth.tempo_bpm),
        "lfoRate" => Some(synth.lfo.rate),
        "lfoDepth" => Some(synth.lfo.depth),
        "lfoSymmetry" => Some(synth.lfo.symmetry),
        "lfoOffset" => Some(synth.lfo.offset),
        "lfo2Rate" => Some(synth.lfo2.rate),
        "lfo2Depth" => Some(synth.lfo2.depth),
        "lfo2Symmetry" => Some(synth.lfo2.symmetry),
        "lfo2Offset" => Some(synth.lfo2.offset),
        "randomRate" => Some(synth.random.rate),
        "modEnvAttack" => Some(synth.mod_env.attack),
        "modEnvDecay" => Some(synth.mod_env.decay),
        "modEnvSustain" => Some(synth.mod_env.sustain),
        "modEnvRelease" => Some(synth.mod_env.release),
        "chorusRate" => Some(chorus.rate),
        "chorusDepth" => Some(chorus.depth),
        "chorusMix" => Some(chorus.mix),
        "delayTime" => Some(delay.time),
        "delayFeedback" => Some(delay.feedback),
        "delayWarmth" => Some(delay.warmth),
        "delayMix" => Some(delay.mix),
        "delayTapeMode" => Some(if delay.tape_mode { 1.0 } else { 0.0 }),
        "reverbSpace" => Some(reverb.space),
        "reverbPredelay" => Some(reverb.predelay),
        "reverbDistance" => Some(reverb.distance),
        "reverbCharacter" => Some(reverb.character),
        "reverbMix" => Some(reverb.mix),
        "phaserRate" => Some(phaser.rate),
        "phaserDepth" => Some(phaser.depth),
        "phaserFeedback" => Some(phaser.feedback),
        "phaserMix" => Some(phaser.mix),
        "velocityCurve" => Some(synth.velocity_curve),
        "portamentoRate" => Some(synth.portamento.rate),
        "portamentoTime" => Some(synth.portamento.time),
        "pitchBendRange" => Some(synth.pitch_bend_range),
        "modWheelVibratoDepth" => Some(0.0),
        _ => None,
    }
}
