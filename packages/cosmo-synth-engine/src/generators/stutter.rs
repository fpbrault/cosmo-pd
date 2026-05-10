use super::{wrap01, AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "stutterSegs",
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
        id: "stutterReverse",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(1.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "stutterSlip",
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
        id: "stutterSpacing",
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
    id: Algo::Stutter,
    name: "Stutter",
    icon_path: "M4,20 L8,20 L8,4 L12,4 L12,20 L16,20 L16,4 L20,4",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Stutter: segmented phase with alternating time-reversal.
///
/// The cycle is divided into N equal segments. Segments whose index satisfies
/// `seg % period == 1` play backwards (controlled by `reverse`). A cumulative
/// `slip` drifts each segment boundary forward, adding inharmonic character.
pub fn warp_phase(phase: f32, amt: f32, segs: f32, reverse: f32, slip: f32, spacing: f32) -> f32 {
    if amt == 0.0 {
        return phase;
    }
    if reverse == 0.0 && slip == 0.0 {
        return phase;
    }

    // Map segs [0..1] → integer count [2..8]
    let n_i = (2.0 + libm::roundf(segs * 6.0)).clamp(2.0, 8.0) as i32;
    let n = n_i as f32;
    let inv_n = 1.0 / n;
    let scaled = phase * n;
    let seg_f = libm::floorf(scaled);
    let local = scaled - seg_f; // 0..1 within the segment
    let seg_i = seg_f as i32;

    // spacing [0..1] → period [2, 3, 4]
    let period = 2 + (libm::roundf(spacing * 2.0) as i32).clamp(0, 2);
    let should_reverse = (seg_i % period) == 1;
    let rev_blend = if should_reverse { reverse } else { 0.0 };
    let local_warped = local + (1.0 - 2.0 * local) * rev_blend;

    // Cumulative slip: each segment boundary drifts by slip * 0.5 / n
    let slip_offset = slip * seg_f * inv_n * 0.5;
    let raw_warped = seg_f * inv_n + local_warped * inv_n + slip_offset;
    let warped = if (0.0..1.0).contains(&raw_warped) {
        raw_warped
    } else if raw_warped >= 1.0 && raw_warped < 2.0 {
        raw_warped - 1.0
    } else if raw_warped < 0.0 && raw_warped >= -1.0 {
        raw_warped + 1.0
    } else {
        wrap01(raw_warped)
    };
    phase + (warped - phase) * amt
}
