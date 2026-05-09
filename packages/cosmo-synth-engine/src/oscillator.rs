use crate::params::{LfoWaveform, WindowType};
use dasp_interpolate::{linear::Linear, Interpolator};

const TWO_PI: f32 = core::f32::consts::TAU;

/// Wrap a value into [0, 1).
#[inline]
pub fn wrap01(v: f32) -> f32 {
    let w = v - libm::floorf(v);
    if w < 0.0 {
        w + 1.0
    } else {
        w
    }
}

/// Linear interpolation.
#[inline]
pub fn lerp(a: f32, b: f32, t: f32) -> f32 {
    let interp = Linear::new([a], [b]);
    interp.interpolate(t as f64)[0]
}

// ─── Optimized Wave Functions (Branch-Free) ─────────────────────────────────

/// Fast square wave with smooth transitions [0, 1) → [-1, 1]
/// Uses polynomial approximation instead of branching for better performance.
///
/// This is the OctaSine strategy: use 1/(1 + x^128) to approximate a square,
/// which is much faster than branching and has better CPU cache behavior.
#[inline]
pub fn square_optimized(phase: f32) -> f32 {
    // Get absolute value, extract sign
    let sign = if phase < 0.0 { -1.0 } else { 1.0 };
    let abs_phase = phase.abs();

    // Wrap to [0, 1)
    let wrapped = abs_phase - libm::floorf(abs_phase);

    // Apply negation if needed based on second half
    let negate_if_gt_half = if wrapped > 0.5 { -1.0 } else { 1.0 };

    // Map to [-1, 1], then apply polynomial approximation
    let x = if wrapped > 0.5 {
        1.0 - wrapped
    } else {
        wrapped
    };

    // Polynomial: 2 * (1/(1 + x^128)) - 1
    // Computed as repeated squaring to avoid expensive powf()
    let a = x * 4.0 - 1.0;
    let a2 = a * a;
    let a4 = a2 * a2;
    let a8 = a4 * a4;
    let a16 = a8 * a8;
    let a32 = a16 * a16;
    let a64 = a32 * a32;
    let a128 = a64 * a64;

    let poly = 2.0 * (1.0 / (1.0 + a128)) - 1.0;
    poly * sign * negate_if_gt_half
}

/// Fast saw wave [0, 1) → [-1, 1] with smooth transitions
/// Asymmetric ramp with fast rise and slow fall (or vice versa on negative phase)
#[inline]
pub fn saw_optimized(phase: f32) -> f32 {
    const DOWN_FACTOR: f32 = 50.0;
    const X_INTERSECTION: f32 = 1.0 - (1.0 / DOWN_FACTOR);
    const UP_FACTOR: f32 = 1.0 / X_INTERSECTION;

    let x_is_negative = phase < 0.0;
    let mut x = phase.abs().fract();

    if x_is_negative {
        x = 1.0 - x;
    }

    let up = x * UP_FACTOR;
    let down = DOWN_FACTOR - DOWN_FACTOR * x;
    let y = if x < X_INTERSECTION { up } else { down };

    (y - 0.5) * 2.0
}

/// Triangle wave [0, 1) → [-1, 1]
#[inline]
pub fn triangle_optimized(phase: f32) -> f32 {
    let wrapped = phase - libm::floorf(phase);
    let adjusted = wrapped + 0.25;
    let frac = adjusted - libm::floorf(adjusted);
    2.0 * (2.0 * (frac - (frac + 0.5).floor()).abs()) - 1.0
}

// ─── Apply amplitude window to oscillator output ───────────────────────────

/// Apply amplitude window to oscillator output.
///
/// Returns a gain multiplier [0, 1]. Mirrors `applyWindow` in the JS.
pub fn apply_window(phase: f32, window: WindowType) -> f32 {
    match window {
        WindowType::Off => 1.0,
        WindowType::Saw => phase,
        WindowType::Triangle => 1.0 - libm::fabsf(phase * 2.0 - 1.0),
        WindowType::Trapezoid => {
            if phase < 0.5 {
                1.0
            } else {
                2.0 * (1.0 - phase)
            }
        }
        WindowType::Pulse => {
            if phase < 0.5 {
                1.0
            } else {
                0.0
            }
        }
        WindowType::DoubleSaw => 1.0 - libm::fabsf(2.0 * wrap01(phase * 2.0) - 1.0),
    }
}

// ─── LFO ──────────────────────────────────────────────────────────────────────

/// LFO sample for phase ∈ [0, 1). Mirrors `lfoOutput` in the JS.
/// Uses optimized wave functions for better performance.
pub fn lfo_output(phase: f32, waveform: LfoWaveform) -> f32 {
    match waveform {
        LfoWaveform::Sine => libm::sinf(TWO_PI * phase),
        LfoWaveform::Triangle => triangle_optimized(phase),
        LfoWaveform::Square => square_optimized(phase),
        LfoWaveform::Saw => saw_optimized(phase),
        LfoWaveform::InvertedSaw => -saw_optimized(phase),
    }
}
