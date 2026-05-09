use super::wrap01;
use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "twistHarmonics",
        label: "Harm",
        description: "Sets the internal modulation harmonic used to twist the phase.",
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
        id: "twistDepth",
        label: "Depth",
        description: "Controls how far the phase is displaced by the twist modulator.",
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
        id: "twistPhase",
        label: "Phase",
        description: "Offsets the phase of the internal twist modulation signal.",
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
        id: "twistShape",
        label: "Shape",
        description: "Changes the contour of the twist modulation from smooth to sharp.",
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
    id: Algo::Twist,
    name: "Twist",
    icon_path: "M4,12 C8,2 16,22 20,12",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Fast power approximation for twist shape modulation using piecewise interpolation.
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

/// Twist algorithm phase warp.
pub fn warp_phase(
    phase: f32,
    amt: f32,
    harmonics: f32,
    depth: f32,
    phase_offset: f32,
    shape: f32,
) -> f32 {
    let partials = 1.0 + harmonics * 11.0;
    let depth_scale = 0.03 + depth * 0.25;
    let shape_exp = 0.35 + shape * 2.2;
    let driver = libm::sinf(core::f32::consts::TAU * (phase + phase_offset) * partials);
    let shaped_mag = pow01(libm::fabsf(driver), shape_exp);
    let shaped = if driver >= 0.0 {
        shaped_mag
    } else {
        -shaped_mag
    };
    let warped = phase + amt * depth_scale * shaped;
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
