use super::wrap01;
use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "syncRatio",
        label: "Ratio",
        description: "Sets how many internal sync resets occur within one cycle.",
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
        id: "syncPhase",
        label: "Phase",
        description: "Offsets where the sync restart begins inside the cycle.",
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
        id: "syncCurve",
        label: "Curve",
        description: "Shapes the post-sync ramp after each internal reset.",
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
        id: "syncWindow",
        label: "Window",
        description: "Controls how strongly the sync-shaped phase replaces the original phase.",
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
    id: Algo::Sync,
    name: "Sync",
    icon_path: "M4,20 L8,4 L8,20 L12,4 L12,20 L16,4 L16,20 L20,4",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Fast power approximation for sync curve shaping using piecewise interpolation.
/// Tuned for exponent ranges typical in phase distortion algorithms.
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

/// Sync algorithm phase warp.
pub fn warp_phase(
    phase: f32,
    amt: f32,
    ratio: f32,
    phase_offset: f32,
    curve: f32,
    window: f32,
) -> f32 {
    let mult = 1.0 + amt * (4.0 + ratio * 14.0);
    let synced = wrap01((phase + phase_offset) * mult);
    let curve_exp = 0.35 + curve * 2.4;
    let sync_norm = (1.0 - (2.0 * synced - 1.0).abs()).clamp(0.0, 1.0);
    let sync_mag = 0.5 * pow01(sync_norm, curve_exp);
    let shaped = if synced < 0.5 {
        sync_mag
    } else {
        1.0 - sync_mag
    };
    phase + (shaped - phase) * (0.25 + window * 0.75)
}
