use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::dsp_utils::pow01;
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "pinchFocus",
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
        id: "pinchAsym",
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
    AlgoControlV1 {
        id: "pinchCurve",
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
        id: "pinchDrive",
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
    id: Algo::Pinch,
    name: "Pinch",
    icon_path: "M4,12 C8,4 10,12 12,12 C14,12 16,20 20,12",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Pinch algorithm phase warp.
pub fn warp_phase(phase: f32, amt: f32, focus: f32, asym: f32, curve: f32, drive: f32) -> f32 {
    let center = 0.3 + focus * 0.4;
    let intensity = 1.0 + amt * (2.0 + focus * 5.0 + drive * 4.0);
    let curve_exp = 0.35 + curve * 2.4;
    let shaped = if phase < center {
        center * pow01(phase / center, intensity)
    } else {
        let right_norm = (phase - center) / (1.0 - center);
        center + (1.0 - center) * (1.0 - pow01(1.0 - right_norm, intensity))
    };
    // asym is bipolar [-1, 1]; remap: old = (asym + 1) / 2, so (old - 0.5) = asym / 2
    let asym_shift = asym * (0.1 + drive * 0.1);
    let curve_norm = 1.0 - (2.0 * shaped - 1.0).abs();
    let curve_mag = 0.5 * pow01(curve_norm, curve_exp);
    let curved = if shaped < 0.5 {
        curve_mag
    } else {
        1.0 - curve_mag
    };
    (curved + asym_shift).clamp(0.0, 1.0)
}
