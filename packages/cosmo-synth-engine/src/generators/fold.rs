use super::wrap01;
use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "foldStages",
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
        id: "foldTilt",
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
        id: "foldSymmetry",
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
        id: "foldSoftness",
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
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Fold,
    name: "Fold",
    icon_path: "M4,20 L8,4 L12,20 L16,4 L20,20",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

#[inline]
fn fold_pass(mut p: f32, pivot: f32, softened_gain: f32) -> f32 {
    if p > pivot {
        // Reflect around the configured pivot for continuity at the fold edge.
        // Use abs() for true reflection so values above 2*pivot fold back
        // rather than clamping to 0 (which would create a flat region and aliasing).
        p = (2.0 * pivot - p).abs();
    }
    p * softened_gain
}

#[inline]
fn apply_folds(mut p: f32, fold_count: u32, pivot: f32, softened_gain: f32) -> f32 {
    for _ in 0..fold_count {
        p = fold_pass(p, pivot, softened_gain);
    }
    wrap01(p)
}

#[inline]
fn smoothstep01(x: f32) -> f32 {
    let t = x.clamp(0.0, 1.0);
    t * t * (3.0 - 2.0 * t)
}

#[inline]
fn lerp_phase(a: f32, b: f32, t: f32) -> f32 {
    let mut delta = b - a;
    if delta > 0.5 {
        delta -= 1.0;
    } else if delta < -0.5 {
        delta += 1.0;
    }
    wrap01(a + delta * t)
}

/// Fold algorithm phase warp.
pub fn warp_phase(
    phase: f32,
    amt: f32,
    stages: f32,
    tilt: f32,
    symmetry: f32,
    softness: f32,
) -> f32 {
    let fold_drive = (0.5 + stages * 5.5) * amt.max(0.05);
    let fold_floor = libm::floorf(fold_drive).max(0.0);
    let fold_frac = smoothstep01(fold_drive - fold_floor);

    // Keep at least one pass; blend toward the next pass smoothly to avoid
    // audible DCW threshold pops when the fold count increments.
    let base_folds = 1 + fold_floor as u32;
    let next_folds = base_folds + 1;

    // tilt and symmetry are bipolar [-1, 1]; remap: old = (x + 1) / 2
    let pivot = (0.5 + tilt * 0.3 + symmetry * 0.125).clamp(0.05, 0.95);
    let softness_clamped = softness.clamp(0.0, 1.0);
    let fold_gain = (1.0 / pivot).min(8.0);
    let softened_gain = fold_gain * (1.0 - softness_clamped) + softness_clamped;

    let base_phase = apply_folds(phase, base_folds, pivot, softened_gain);
    if fold_frac <= 0.0 {
        return base_phase;
    }

    let next_phase = apply_folds(phase, next_folds, pivot, softened_gain);
    lerp_phase(base_phase, next_phase, fold_frac)
}
