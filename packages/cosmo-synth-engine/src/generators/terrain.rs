use super::{lerp, wrap01, AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::Algo;

const TWO_PI: f32 = core::f32::consts::TAU;

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
    },
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Terrain,
    name: "Terrain",
    icon_path: "M4,12 C6,4 9,20 12,12 C15,4 18,20 20,12",
    visible: true,
    controls: &CONTROLS,
};

/// Terrain: FM-inside-PD phase displacement.
///
/// The linear phase is displaced by a secondary oscillator running at `ratio`
/// times the fundamental, creating FM-like sidebands through the PD engine.
/// `shape` morphs the modulator from sine to sawtooth for richer sideband sets.
pub fn warp_phase(
    phase: f32,
    amt: f32,
    ratio: f32,
    depth: f32,
    fm_phase: f32,
    shape: f32,
) -> f32 {
    let fm_x = ratio * phase + fm_phase;
    // Sine modulator
    let sin_mod = libm::sinf(TWO_PI * fm_x);
    // Sawtooth modulator in [-1, 1]
    let saw_x = fm_x - libm::floorf(fm_x);
    let saw_mod = 2.0 * saw_x - 1.0;
    // Blend between sine and saw
    let modulator = lerp(sin_mod, saw_mod, shape.clamp(0.0, 1.0));
    // Scale so that full depth + full amt displaces by at most ~0.35 of the cycle
    let displacement = amt * depth * 0.35 * modulator;
    wrap01(phase + displacement)
}
