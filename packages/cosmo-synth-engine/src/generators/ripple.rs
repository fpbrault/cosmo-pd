use super::wrap01;
use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "rippleFreq",
        label: "Freq",
        description: "Sets how many ripple oscillations appear across the cycle.",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.5),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Decimal,
    },
    AlgoControlV1 {
        id: "rippleDepth",
        label: "Depth",
        description: "Controls the amplitude of the ripple imposed on the phase.",
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
        id: "ripplePhase",
        label: "Phase",
        description: "Offsets where the ripple pattern begins inside the cycle.",
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
        id: "rippleShape",
        label: "Shape",
        description: "Changes the ripple from a smooth sine to a sharper contour.",
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
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Ripple,
    name: "Ripple",
    icon_path: "M4,12 C6,8 8,16 10,12 C12,8 14,16 16,12 C18,8 19,13 20,12",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Ripple algorithm phase warp.
pub fn warp_phase(
    phase: f32,
    amt: f32,
    ripple_freq: f32,
    ripple_depth: f32,
    phase_offset: f32,
    shape: f32,
) -> f32 {
    let cycles = 2.0 + ripple_freq * 22.0;
    let depth = 0.01 + ripple_depth * 0.12;
    let shape_exp = 0.35 + shape * 2.4;
    let ripple = (core::f32::consts::TAU * (phase + phase_offset) * cycles).sin();
    let shaped_mag = ripple.abs().powf(shape_exp);
    let shaped = if ripple >= 0.0 {
        shaped_mag
    } else {
        -shaped_mag
    };
    let warped = phase + amt * depth * shaped;
    if (0.0..1.0).contains(&warped) {
        warped
    } else if warped >= 1.0 && warped < 2.0 {
        warped - 1.0
    } else if warped >= -1.0 && warped < 0.0 {
        warped + 1.0
    } else {
        wrap01(warped)
    }
}
