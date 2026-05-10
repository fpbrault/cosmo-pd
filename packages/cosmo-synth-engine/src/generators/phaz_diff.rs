use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::dsp_utils::wrap01;
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 3] = [
    AlgoControlV1 {
        id: "phazDiffDrive",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.6),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "phazDiffFeedback",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.25),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "phazDiffCenter",
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
    id: Algo::PhazDiff,
    name: "PhazDiff",
    icon_path: "M4,12 C6,8 8,16 10,12 C12,8 14,16 16,12 C17,11 18,10 20,10",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// PhazDiff: half-cycle phase differencing with controllable drive.
pub fn warp_phase(phase: f32, amt: f32, drive: f32, feedback: f32, center: f32) -> f32 {
    let delayed = wrap01(phase - 0.5);
    let mut diff = phase - delayed;
    if diff > 0.5 {
        diff -= 1.0;
    } else if diff < -0.5 {
        diff += 1.0;
    }

    let driven = libm::tanhf(diff * (0.5 + drive.clamp(0.0, 1.0) * 4.5));
    let center_offset = (center.clamp(0.0, 1.0) - 0.5) * 0.25;
    let modulation = diff + driven * feedback.clamp(0.0, 1.0);
    wrap01(phase + (center_offset + modulation * 0.35) * amt)
}
