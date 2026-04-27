use super::{lerp, wrap01, AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::Algo;

const TWO_PI: f32 = core::f32::consts::TAU;

const CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "chebyOrder",
        label: "Order",
        description: "Chebyshev polynomial degree (maps 0→1 to harmonic orders 1→6).",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.2),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
    },
    AlgoControlV1 {
        id: "chebyTilt",
        label: "Tilt",
        description: "Phase-shifts the fold points within the super-cycle for asymmetric spectra.",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: true,
        icon_name: None,
        min: Some(-1.0),
        max: Some(1.0),
        default: Some(0.0),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
    },
    AlgoControlV1 {
        id: "chebyWarp",
        label: "Warp",
        description: "Pre-warps the input phase before the polynomial, shifting harmonic peaks.",
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
        id: "chebyMix",
        label: "Mix",
        description: "Blends between the original linear phase and the polynomial-warped phase.",
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
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Cheby,
    name: "Cheby",
    icon_path: "M4,20 L7,4 L10,20 L12,12 L14,4 L17,20 L20,12",
    visible: true,
    controls: &CONTROLS,
};

/// Cheby: Chebyshev-polynomial harmonic stacking.
///
/// The phase is remapped via `acos(cos(n · 2π · phase)) / π`, which produces a
/// triangle-wave phase path running at `n` times the fundamental frequency.
/// This identity — T_n(cos θ) = cos(nθ) — gives exact harmonic multiplication:
/// integer orders produce pure overtones; fractional orders blend adjacent ones.
/// `tilt` shifts the fold phase; `warp` pre-distorts the input phase.
pub fn warp_phase(
    phase: f32,
    amt: f32,
    order: f32,
    tilt: f32,
    warp: f32,
    mix: f32,
) -> f32 {
    // Map order [0..1] → n [1..6]
    let n = 1.0 + order * 5.0;
    // Pre-warp: shift fold start points (max quarter-cycle offset)
    let pre_phase = wrap01(phase + warp * 0.25);
    // Chebyshev triangle remap: acos(cos(n·θ)) ∈ [0, π], divide by π → [0, 1]
    let inner_theta = n * TWO_PI * pre_phase + tilt * TWO_PI;
    let poly = libm::acosf(libm::cosf(inner_theta)) / core::f32::consts::PI;
    // Mix between linear phase and polynomial phase
    let mixed = lerp(phase, poly, mix);
    lerp(phase, mixed, amt)
}
