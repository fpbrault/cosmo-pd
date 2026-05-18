use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::dsp_utils::pow01;
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 3] = [
    AlgoControlV1 {
        id: "quantizeAmount",
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
    AlgoControlV1 {
        id: "quantizeSteps",
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
        id: "quantizeSkew",
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
    id: Algo::Quantize,
    name: "Quantize",
    icon_path: "M4,12 L6,12 L6,8 L8,8 L8,16 L10,16 L10,10 L12,10 L12,14 L14,14 L14,6 L16,6 L16,18 L18,18 L18,12 L20,12",
    visible: false,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Quantize algorithm phase warp.
pub fn warp_phase(phase: f32, amt: f32, steps: f32, skew: f32) -> f32 {
    let levels = 2.0 + (steps * 30.0).floor();
    let warped_phase = pow01(phase.clamp(0.0, 1.0), 0.4 + skew * 2.2);
    let target = (warped_phase * levels).round() / levels;
    phase + (target - phase) * amt
}
