use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 3] = [
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
        readout_format: EngineParamReadoutFormatV1::Decimal,
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
        readout_format: EngineParamReadoutFormatV1::Degrees,
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
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Cheby,
    name: "Cheby",
    icon_path: "M4,20 L7,4 L10,20 L12,12 L14,4 L17,20 L20,12",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Sine,
    controls: &CONTROLS,
};

/// Cheby: Chebyshev-polynomial harmonic stacking.
///
/// The phase is remapped via `acos(cos(n · 2π · phase)) / π`, which produces a
/// triangle-wave phase path running at `n` times the fundamental frequency.
/// This identity — T_n(cos θ) = cos(nθ) — gives exact harmonic multiplication:
/// integer orders produce pure overtones; fractional orders blend adjacent ones.
/// `tilt` shifts the fold phase; `warp` pre-distorts the input phase.
pub fn warp_phase(phase: f32, amt: f32, order: f32, tilt: f32, warp: f32, mix: f32) -> f32 {
    let mix_amt = mix * amt;
    if mix_amt == 0.0 {
        return phase;
    }

    // Map order [0..1] → n [1..6]
    let n = 1.0 + order * 5.0;
    // Equivalent triangle identity for acos(cos(2πx))/π: 1 - |2*fract(x) - 1|
    let x = n * (phase + warp * 0.25) + tilt;
    let frac = x - libm::floorf(x);
    let poly = 1.0 - libm::fabsf(2.0 * frac - 1.0);
    phase + (poly - phase) * mix_amt
}
