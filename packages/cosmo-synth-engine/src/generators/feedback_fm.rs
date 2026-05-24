use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::dsp_utils::{cubic_sine_approx, wrap01};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 3] = [
    AlgoControlV1 {
        id: "feedbackFmRatio",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.3),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "feedbackFmFeedback",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.4),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "feedbackFmSkew",
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
    id: Algo::FeedbackFm,
    name: "FeedbackFm",
    icon_path: "M4,14 C7,6 10,18 13,10 C15,6 17,14 20,8",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// FeedbackFm: two-pass self-feedback FM phase displacement.
pub fn warp_phase(phase: f32, amt: f32, ratio: f32, feedback: f32, skew: f32) -> f32 {
    let r = 1.0 + ratio.clamp(0.0, 1.0) * 12.0;
    let fb = feedback.clamp(0.0, 1.0) * 0.45;
    let skewed = wrap01(phase + skew.clamp(-1.0, 1.0) * 0.2);

    let m1 = cubic_sine_approx(skewed * r);
    let m2 = cubic_sine_approx(skewed * r + fb * m1);
    let offset = (m1 * 0.5 + m2 * 0.5) * (0.03 + 0.15 * amt);

    wrap01(phase + offset)
}
