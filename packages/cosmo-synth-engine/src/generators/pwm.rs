use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::dsp_utils::{pow01, wrap01};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 3] = [
    AlgoControlV1 {
        id: "pwmWidth",
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
        id: "pwmShape",
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
        id: "pwmDrift",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: true,
        icon_name: None,
        min: Some(-1.0),
        max: Some(1.0),
        default: Some(0.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::BipolarPercent,
    },
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Pwm,
    name: "Pwm",
    icon_path: "M4,16 L4,8 L10,8 L10,16 L16,16 L16,8 L20,8",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Pwm: sine-base PWM that hardens toward square duty as DCW rises.
pub fn warp_phase(phase: f32, amt: f32, width: f32, shape: f32, drift: f32) -> f32 {
    let drifted_width = width + drift * 0.2 * libm::sinf(core::f32::consts::TAU * phase);
    let pivot = drifted_width.clamp(0.05, 0.95);

    let segmented = if phase < pivot {
        0.5 * (phase / pivot)
    } else {
        0.5 + 0.5 * ((phase - pivot) / (1.0 - pivot))
    };

    let expo = 0.3 + shape.clamp(0.0, 1.0) * 3.0;
    let curved = if segmented < 0.5 {
        0.5 * pow01(segmented * 2.0, expo)
    } else {
        1.0 - 0.5 * pow01((1.0 - segmented) * 2.0, expo)
    };

    let square_phase = if segmented < 0.5 { 0.25 } else { 0.75 };
    let hardness = 0.25 + 0.75 * shape.clamp(0.0, 1.0);
    let pwm_target = curved + (square_phase - curved) * hardness;
    wrap01(phase + (pwm_target - phase) * amt)
}
