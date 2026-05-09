use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "pinchFocus",
        label: "Focus",
        description: "Moves the pinch center toward the start or end of the cycle.",
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
        label: "Asym",
        description: "Adds asymmetry so one side of the pinch shifts more than the other.",
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
        label: "Curve",
        description: "Changes the curvature of the pinched center region.",
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
        label: "Drive",
        description: "Pushes the pinch harder for a tighter, more exaggerated distortion.",
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

/// Fast power approximation for phase distortion using piecewise interpolation.
/// Custom tuned for exponent ranges [0.5, 8] typical in phase distortion.
/// Avoids expensive libm::powf and f32→f64 conversion overhead.
#[inline]
fn pow01(base: f32, exponent: f32) -> f32 {
    let x = base.clamp(0.0, 1.0);
    if x <= 0.0 {
        return 0.0;
    }
    if x >= 1.0 {
        return 1.0;
    }

    let x2 = x * x;
    let x4 = x2 * x2;
    let x8 = x4 * x4;
    let x16 = x8 * x8;

    if exponent <= 0.5 {
        let x025 = libm::sqrtf(libm::sqrtf(x));
        let x05 = libm::sqrtf(x);
        let t = ((exponent - 0.25) / 0.25).clamp(0.0, 1.0);
        return x025 + (x05 - x025) * t;
    }
    if exponent <= 1.0 {
        let x05 = libm::sqrtf(x);
        let t = (exponent - 0.5) / 0.5;
        return x05 + (x - x05) * t;
    }
    if exponent <= 2.0 {
        let t = exponent - 1.0;
        return x + (x2 - x) * t;
    }
    if exponent <= 4.0 {
        let t = (exponent - 2.0) * 0.5;
        return x2 + (x4 - x2) * t;
    }
    if exponent <= 8.0 {
        let t = (exponent - 4.0) * 0.25;
        return x4 + (x8 - x4) * t;
    }

    let t = ((exponent - 8.0) * 0.125).clamp(0.0, 1.0);
    x8 + (x16 - x8) * t
}

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
