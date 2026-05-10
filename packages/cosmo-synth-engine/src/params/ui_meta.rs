use serde::Serialize;
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::filter::FilterParams;
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
    pub tooltip: &'static str,
    pub readout_label: &'static str,
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

/// Tooltip metadata for enum-like button choices.
#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EngineEnumValueTooltipV1 {
    pub key: &'static str,
    pub value: &'static str,
    pub tooltip: &'static str,
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

const ENGINE_PARAM_UI_META_V1: [EngineParamUiMetaV1; 57] = [
    EngineParamUiMetaV1 {
        key: "volume",
        tooltip: "Sets the global synth output level.",
        readout_label: "Volume",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "warpAAmount",
        tooltip: "Sets base harmonic warp amount for this line.",
        readout_label: "Line 1 DCW",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "warpBAmount",
        tooltip: "Sets base harmonic warp amount for this line.",
        readout_label: "Line 2 DCW",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "algoBlendA",
        tooltip: "Crossfades between Algo A and Algo B outputs.",
        readout_label: "Line 1 Blend",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "algoBlendB",
        tooltip: "Crossfades between Algo A and Algo B outputs.",
        readout_label: "Line 2 Blend",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "line1Level",
        tooltip: "Sets base output level for this line.",
        readout_label: "Line 1 Level",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "line2Level",
        tooltip: "Sets base output level for this line.",
        readout_label: "Line 2 Level",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "line1Octave",
        tooltip: "Transposes both lines by octave steps (shared).",
        readout_label: "Octave",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line2Octave",
        tooltip: "Relative octave shift for line 2.",
        readout_label: "L2 Oct",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line2DetuneNote",
        tooltip: "Semitone offset for line 2 (0–11).",
        readout_label: "L2 Note",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "line2DetuneFine",
        tooltip: "Fine detune for line 2 in CZ units (±60).",
        readout_label: "L2 Fine",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "lineSelect",
        tooltip: "Selects which oscillator lines are heard together.",
        readout_label: "Line Select",
        readout_format: EngineParamReadoutFormatV1::Raw,
    },
    EngineParamUiMetaV1 {
        key: "modMode",
        tooltip: "Chooses the interaction mode between oscillator lines.",
        readout_label: "Modulation",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "polyMode",
        tooltip: "Switches between polyphonic and monophonic note allocation.",
        readout_label: "Voice Mode",
        readout_format: EngineParamReadoutFormatV1::EnumMap {
            values: &POLY_MODE_LABELS_V1,
        },
    },
    EngineParamUiMetaV1 {
        key: "intPmAmount",
        tooltip: "Sets internal phase modulation depth.",
        readout_label: "PM Amount",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "intPmRatio",
        tooltip: "Sets modulator-to-carrier frequency ratio.",
        readout_label: "PM Ratio",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "pmPre",
        tooltip: "Apply phase modulation before warp shaping.",
        readout_label: "PM Mode",
        readout_format: EngineParamReadoutFormatV1::OnOff,
    },
    EngineParamUiMetaV1 {
        key: "vibratoRate",
        tooltip: "Sets vibrato speed.",
        readout_label: "Vibrato Rate",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "vibratoDepth",
        tooltip: "Sets vibrato pitch modulation depth.",
        readout_label: "Vibrato Depth",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "vibratoDelay",
        tooltip: "Delays vibrato onset after note start.",
        readout_label: "Vibrato Delay",
        readout_format: EngineParamReadoutFormatV1::Milliseconds,
    },
    EngineParamUiMetaV1 {
        key: "lfoWaveform",
        tooltip: "Selects LFO 1 waveform shape.",
        readout_label: "LFO Wave",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "lfoRate",
        tooltip: "Sets LFO 1 speed.",
        readout_label: "LFO Rate",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfoDepth",
        tooltip: "Sets LFO 1 modulation depth.",
        readout_label: "LFO Depth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfoSymmetry",
        tooltip: "Skews LFO 1 waveform timing around the midpoint.",
        readout_label: "LFO Symmetry",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfoOffset",
        tooltip: "Offsets LFO 1 output around zero.",
        readout_label: "LFO Offset",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Rate",
        tooltip: "Sets LFO 2 speed.",
        readout_label: "LFO 2 Rate",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Depth",
        tooltip: "Sets LFO 2 modulation depth.",
        readout_label: "LFO 2 Depth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Symmetry",
        tooltip: "Skews LFO 2 waveform timing around the midpoint.",
        readout_label: "LFO 2 Symmetry",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "lfo2Offset",
        tooltip: "Offsets LFO 2 output around zero.",
        readout_label: "LFO 2 Offset",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "randomRate",
        tooltip: "Sets sample-and-hold random modulation refresh rate.",
        readout_label: "Random Rate",
        readout_format: EngineParamReadoutFormatV1::Hertz,
    },
    EngineParamUiMetaV1 {
        key: "modEnvAttack",
        tooltip: "Sets modulation envelope attack time.",
        readout_label: "Mod Env Attack",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "modEnvDecay",
        tooltip: "Sets modulation envelope decay time.",
        readout_label: "Mod Env Decay",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "modEnvSustain",
        tooltip: "Sets sustained modulation level while note is held.",
        readout_label: "Mod Env Sustain",
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    EngineParamUiMetaV1 {
        key: "modEnvRelease",
        tooltip: "Sets modulation envelope release time after note off.",
        readout_label: "Mod Env Release",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "filterType",
        tooltip: "Selects the filter response shape.",
        readout_label: "Filter Type",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "filterCutoff",
        tooltip: "Sets the filter cutoff frequency.",
        readout_label: "Filter Cutoff",
        readout_format: EngineParamReadoutFormatV1::Hertz,
    },
    EngineParamUiMetaV1 {
        key: "filterResonance",
        tooltip: "Boosts frequencies around the cutoff point.",
        readout_label: "Filter Resonance",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "filterEnvAmount",
        tooltip: "Applies envelope modulation amount to the cutoff.",
        readout_label: "Filter Env",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "chorusRate",
        tooltip: "Sets chorus modulation speed.",
        readout_label: "Chorus Rate",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "chorusDepth",
        tooltip: "Sets intensity of chorus pitch modulation.",
        readout_label: "Chorus Depth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "chorusMix",
        tooltip: "Blends dry signal with chorus effect.",
        readout_label: "Chorus Mix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayTime",
        tooltip: "Sets the delay repeat interval.",
        readout_label: "Delay Time",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "delayFeedback",
        tooltip: "Feeds delayed signal back for additional repeats.",
        readout_label: "Delay Feedback",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayWarmth",
        tooltip: "Adds tape-style saturation and high-frequency rolloff.",
        readout_label: "Delay Warmth",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayMix",
        tooltip: "Blends dry signal with delayed signal.",
        readout_label: "Delay Mix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "delayTapeMode",
        tooltip: "Toggle tape echo coloration for delay repeats.",
        readout_label: "Tape Mode",
        readout_format: EngineParamReadoutFormatV1::OnOff,
    },
    EngineParamUiMetaV1 {
        key: "reverbSpace",
        tooltip: "Sets the virtual room size for reverb reflections.",
        readout_label: "Reverb Space",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbPredelay",
        tooltip: "Adds delay before the reverb tail starts.",
        readout_label: "Reverb Pre-Delay",
        readout_format: EngineParamReadoutFormatV1::Milliseconds,
    },
    EngineParamUiMetaV1 {
        key: "reverbDistance",
        tooltip: "Moves source position deeper into the reverb space.",
        readout_label: "Reverb Distance",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbCharacter",
        tooltip: "Shapes reverb tone from dark to bright.",
        readout_label: "Reverb Character",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "reverbMix",
        tooltip: "Blends dry signal with reverb output.",
        readout_label: "Reverb Mix",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "portamentoMode",
        tooltip: "Chooses whether glide uses rate or fixed time behavior.",
        readout_label: "Portamento Mode",
        readout_format: EngineParamReadoutFormatV1::Uppercase,
    },
    EngineParamUiMetaV1 {
        key: "portamentoRate",
        tooltip: "Sets glide speed when portamento mode is Rate.",
        readout_label: "Portamento Rate",
        readout_format: EngineParamReadoutFormatV1::Integer,
    },
    EngineParamUiMetaV1 {
        key: "portamentoTime",
        tooltip: "Sets glide duration when portamento mode is Time.",
        readout_label: "Portamento Time",
        readout_format: EngineParamReadoutFormatV1::Seconds2,
    },
    EngineParamUiMetaV1 {
        key: "pitchBendRange",
        tooltip: "Sets maximum pitch bend range in semitones.",
        readout_label: "Bend Range",
        readout_format: EngineParamReadoutFormatV1::Semitones,
    },
    EngineParamUiMetaV1 {
        key: "velocityCurve",
        tooltip: "Shapes how keyboard velocity maps to output level.",
        readout_label: "Vel Curve",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    EngineParamUiMetaV1 {
        key: "modWheelVibratoDepth",
        tooltip: "Sets how much mod wheel movement affects vibrato depth.",
        readout_label: "Mod to Vibrato",
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
];

const ENGINE_PARAM_RANGES_V1: [EngineParamRangeV1; 1] = [EngineParamRangeV1 {
    key: "randomRate",
    min: 0.0,
    max: 200.0,
}];

const ENGINE_ENUM_VALUE_TOOLTIPS_V1: [EngineEnumValueTooltipV1; 13] = [
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L1",
        tooltip: "Play oscillator line 1 only.",
    },
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L1+L2",
        tooltip: "Layer oscillator lines 1 and 2.",
    },
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L2",
        tooltip: "Play oscillator line 2 only.",
    },
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L1+L1'",
        tooltip: "Stack line 1 with a detuned variant.",
    },
    EngineEnumValueTooltipV1 {
        key: "lineSelect",
        value: "L1+L2'",
        tooltip: "Layer line 1 with a detuned line 2 variant.",
    },
    EngineEnumValueTooltipV1 {
        key: "modMode",
        value: "normal",
        tooltip: "Standard phase modulation behavior.",
    },
    EngineEnumValueTooltipV1 {
        key: "modMode",
        value: "ring",
        tooltip: "Enable ring modulation between lines.",
    },
    EngineEnumValueTooltipV1 {
        key: "modMode",
        value: "noise",
        tooltip: "Mix noise source into modulation path.",
    },
    EngineEnumValueTooltipV1 {
        key: "filterType",
        value: "lp",
        tooltip: "Low-pass mode: attenuates frequencies above cutoff.",
    },
    EngineEnumValueTooltipV1 {
        key: "filterType",
        value: "hp",
        tooltip: "High-pass mode: attenuates frequencies below cutoff.",
    },
    EngineEnumValueTooltipV1 {
        key: "filterType",
        value: "bp",
        tooltip: "Band-pass mode: emphasizes a narrow band around cutoff.",
    },
    EngineEnumValueTooltipV1 {
        key: "portamentoMode",
        value: "rate",
        tooltip: "Portamento time scales with note interval distance.",
    },
    EngineEnumValueTooltipV1 {
        key: "portamentoMode",
        value: "time",
        tooltip: "Portamento uses a fixed glide time between notes.",
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
    let filter = FilterParams::default();
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
        "filterCutoff" => Some(filter.cutoff),
        "filterResonance" => Some(filter.resonance),
        "filterEnvAmount" => Some(filter.env_amount),
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

pub fn engine_enum_value_tooltips_v1() -> &'static [EngineEnumValueTooltipV1] {
    &ENGINE_ENUM_VALUE_TOOLTIPS_V1
}
