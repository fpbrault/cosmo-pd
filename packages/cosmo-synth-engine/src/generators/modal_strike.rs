use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::dsp_utils::{TWO_PI, pow01, wrap01};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 3] = [
    AlgoControlV1 {
        id: "modalStrikeModes",
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
        id: "modalStrikeDecay",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.4),
        max: Some(1.0),
        default: Some(0.85),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "modalStrikeTone",
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
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::ModalStrike,
    name: "ModalStrike",
    icon_path: "M4,16 L7,8 L9,16 L12,6 L14,16 L17,10 L20,12",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Triangle,
    controls: &CONTROLS,
};

/// ModalStrike: decaying resonant modal bursts over phase.
pub fn warp_phase(phase: f32, amt: f32, modes: f32, decay: f32, tone: f32) -> f32 {
    let mode_count = 2.0 + modes.clamp(0.0, 1.0) * 10.0;
    let shifted_decay = decay.clamp(0.4, 1.0);
    let decay_exp = 0.4 + (1.0 - shifted_decay) * 4.0;
    let env = pow01(1.0 - phase.clamp(0.0, 1.0), decay_exp);

    let m1 = libm::sinf(TWO_PI * phase * mode_count);
    let m2 = libm::sinf(TWO_PI * phase * (mode_count * (1.4 + tone * 0.8)) + 0.3);
    let resonant = (m1 * (1.0 - tone) + m2 * tone) * env;

    wrap01(phase + resonant * (0.02 + 0.14 * amt))
}
