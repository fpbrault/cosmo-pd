use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::dsp_utils::cubic_sine_approx;
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "terrainRatio",
        label: "Ratio",
        description: "Sets the frequency ratio of the phase-modulating oscillator (1–8).",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(1.0),
        max: Some(8.0),
        default: Some(2.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    AlgoControlV1 {
        id: "terrainDepth",
        label: "Depth",
        description: "Controls how far the modulator displaces the phase path.",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.5),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "terrainFmPhase",
        label: "FM Phase",
        description: "Offsets the modulator's start phase within the cycle.",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Degrees,
    },
    AlgoControlV1 {
        id: "terrainShape",
        label: "Shape",
        description: "Morphs the modulator waveform from a sine (0) to a sawtooth (1).",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Terrain,
    name: "Terrain",
    icon_path: "M4,12 C6,4 9,20 12,12 C15,4 18,20 20,12",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Terrain: FM-inside-PD phase displacement.
///
/// The linear phase is displaced by a secondary oscillator running at `ratio`
/// times the fundamental, creating FM-like sidebands through the PD engine.
/// `shape` morphs the modulator from sine to sawtooth for richer sideband sets.
pub fn warp_phase(phase: f32, amt: f32, ratio: f32, depth: f32, fm_phase: f32, shape: f32) -> f32 {
    let displacement_scale = amt * depth * 0.35;
    if displacement_scale == 0.0 {
        return phase;
    }

    let fm_x = ratio * phase + fm_phase;
    let shape_clamped = shape.clamp(0.0, 1.0);

    let modulator = if shape_clamped <= 0.0 {
        cubic_sine_approx(fm_x)
    } else {
        // Sawtooth modulator in [-1, 1]
        let saw_x = fm_x - libm::floorf(fm_x);
        let saw_mod = 2.0 * saw_x - 1.0;
        if shape_clamped >= 1.0 {
            saw_mod
        } else {
            let sin_mod = cubic_sine_approx(fm_x);
            sin_mod + (saw_mod - sin_mod) * shape_clamped
        }
    };

    let warped = phase + displacement_scale * modulator;
    if (0.0..1.0).contains(&warped) {
        warped
    } else if warped >= 1.0 {
        warped - 1.0
    } else {
        warped + 1.0
    }
}
