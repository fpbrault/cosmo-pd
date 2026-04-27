use super::{lerp, wrap01, AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::Algo;

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "stutterSegs",
        label: "Segs",
        description: "Number of equal segments the cycle is split into (2–8).",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.25),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
    },
    AlgoControlV1 {
        id: "stutterReverse",
        label: "Reverse",
        description: "Blends alternate segments toward time-reversed playback.",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(1.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
    },
    AlgoControlV1 {
        id: "stutterSlip",
        label: "Slip",
        description: "Adds a cumulative phase slip at each segment boundary.",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
    },
    AlgoControlV1 {
        id: "stutterSpacing",
        label: "Spacing",
        description: "Sets how many segments separate each reversed segment (2, 3, or 4).",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
    },
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Stutter,
    name: "Stutter",
    icon_path: "M4,20 L8,20 L8,4 L12,4 L12,20 L16,20 L16,4 L20,4",
    visible: true,
    controls: &CONTROLS,
};

/// Stutter: segmented phase with alternating time-reversal.
///
/// The cycle is divided into N equal segments. Segments whose index satisfies
/// `seg % period == 1` play backwards (controlled by `reverse`). A cumulative
/// `slip` drifts each segment boundary forward, adding inharmonic character.
pub fn warp_phase(phase: f32, amt: f32, segs: f32, reverse: f32, slip: f32, spacing: f32) -> f32 {
    // Map segs [0..1] → integer count [2..8]
    let n = (2.0 + libm::roundf(segs * 6.0)).clamp(2.0, 8.0);
    let scaled = phase * n;
    let seg_f = libm::floorf(scaled);
    let local = scaled - seg_f; // 0..1 within the segment
    let seg_u = seg_f as usize;

    // spacing [0..1] → period [2, 3, 4]
    let period = 2 + (libm::roundf(spacing * 2.0) as usize).min(2);
    let should_reverse = (seg_u % period) == 1;
    let rev_blend = if should_reverse { reverse } else { 0.0 };
    let local_warped = lerp(local, 1.0 - local, rev_blend);

    // Cumulative slip: each segment boundary drifts by slip * 0.5 / n
    let slip_offset = slip * seg_f / n * 0.5;
    let warped = wrap01(seg_f / n + local_warped / n + slip_offset);
    lerp(phase, warped, amt)
}
