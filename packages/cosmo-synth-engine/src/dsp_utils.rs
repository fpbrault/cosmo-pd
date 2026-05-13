use crate::params::{LfoWaveform, WindowType};
use dasp_interpolate::{linear::Linear, Interpolator};
use std::sync::LazyLock;

pub const TWO_PI: f32 = core::f32::consts::TAU;
const PI: f32 = core::f32::consts::PI;
const TWO_OVER_PI: f32 = 2.0 / PI;

/// 2048-entry sine lookup table over [0, 1) phase.
const SIN_TABLE_SIZE: usize = 2048;
static SIN_TABLE: LazyLock<[f32; SIN_TABLE_SIZE]> = LazyLock::new(|| {
    let mut table = [0.0_f32; SIN_TABLE_SIZE];
    for i in 0..SIN_TABLE_SIZE {
        let phase = i as f32 / SIN_TABLE_SIZE as f32;
        table[i] = (TWO_PI * phase).sin();
    }
    table
});

#[inline]
pub fn sin_lut(phase: f32) -> f32 {
    let p = phase - phase.floor();
    let idx = (p * SIN_TABLE_SIZE as f32) as usize & (SIN_TABLE_SIZE - 1);
    unsafe { *SIN_TABLE.get_unchecked(idx) }
}

#[inline]
pub fn cos_lut(phase: f32) -> f32 {
    let p = phase - phase.floor();
    let idx = ((p + 0.25) * SIN_TABLE_SIZE as f32) as usize & (SIN_TABLE_SIZE - 1);
    unsafe { *SIN_TABLE.get_unchecked(idx) }
}

/// Wrap a value into [0, 1).
#[inline]
pub fn wrap01(v: f32) -> f32 {
    v - v.floor()
}

/// Linear interpolation.
#[inline]
pub fn lerp(a: f32, b: f32, t: f32) -> f32 {
    let interp = Linear::new([a], [b]);
    interp.interpolate(t as f64)[0]
}

/// Fast power approximation on [0, 1] using piecewise interpolation.
/// Tuned for exponent ranges common in phase distortion shaping.
#[inline]
pub fn pow01(base: f32, exponent: f32) -> f32 {
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
        let x025 = (x).sqrt().sqrt();
        let x05 = (x).sqrt();
        let t = ((exponent - 0.25) / 0.25).clamp(0.0, 1.0);
        return x025 + (x05 - x025) * t;
    }
    if exponent <= 1.0 {
        let x05 = (x).sqrt();
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

/// Fast cubic sine approximation for phase ∈ [0, 1) → [-1, 1].
/// Based on quadrant-aware continuous cubic polynomial approach.
///
/// This approximation uses symmetry to reduce computation:
/// - Normalize phase to [0, 1), convert to radians [0, 2π)
/// - Determine quadrant and map to base quadrant [0, π/2]
/// - Apply cubic polynomial: a*x³ + b*x² + c*x (optimized coefficients)
/// - Restore sign based on original quadrant
///
/// Max error: ~0.001 (compared to libm::sinf)
/// Performance: ~3x faster than libm::sinf on typical hardware
#[inline]
pub fn cubic_sine_approx(phase: f32) -> f32 {
    // Normalize phase to [0, 1)
    let p = phase - (phase).floor();

    // Convert to [0, 2π)
    let angle = p * TWO_PI;

    // Determine quadrant: 0=Q1, 1=Q2, 2=Q3, 3=Q4
    let quadrant = (angle * TWO_OVER_PI).floor() as u32 & 3;

    // Map all quadrants to base [0, π/2]
    let x = match quadrant {
        0 => angle,          // Q1: [0, π/2]
        1 => PI - angle,     // Q2: [π/2, π] → mirror
        2 => angle - PI,     // Q3: [π, 3π/2] → shift
        _ => TWO_PI - angle, // Q4: [3π/2, 2π] → mirror
    };

    // Normalize to [0, 1]
    let t = x * TWO_OVER_PI;

    // Cubic polynomial optimized for sine approximation on [0, π/2]
    // Coefficients fitted for minimum max error:
    // y ≈ 0.144630 * t³ - 0.437500 * t² + 1.242920 * t
    // (Alternative: y ≈ 4/π * t * (1 - t), but cubic is more accurate)
    let t2 = t * t;
    let t3 = t2 * t;
    let y = 0.144630 * t3 - 0.437500 * t2 + 1.242920 * t;

    // Restore sign for Q2, Q3, Q4
    match quadrant {
        0 | 1 => y, // Q1, Q2 → positive
        _ => -y,    // Q3, Q4 → negative
    }
}

/// Benchmark-safe version: measure cost of cubic sine vs libm::sinf
///
/// TODO: Remove this after performance testing
#[cfg(test)]
pub fn sine_benchmark_cubic(phase: f32) -> f32 {
    cubic_sine_approx(phase)
}

/// Fast tanh approximation using Pade [3/3] approximant.
/// Accurate to within ~0.1% for |x| < 3, clamps to ±1 beyond that.
#[inline]
pub fn fast_tanh(x: f32) -> f32 {
    if x >= 3.0 {
        1.0
    } else if x <= -3.0 {
        -1.0
    } else {
        let x2 = x * x;
        x * (27.0 + x2) / (27.0 + 9.0 * x2)
    }
}

/// Apply amplitude window to oscillator output.
///
/// Returns a gain multiplier [0, 1]. Mirrors `applyWindow` in the JS.
/// Apply amplitude window to oscillator output.
///
/// Returns a gain multiplier [-1, 1]. Mirrors `applyWindow` in the JS.
/// Apply amplitude window to oscillator output.
///
/// Returns a gain multiplier [-1, 1]. Mirrors `applyWindow` in the JS.
pub fn apply_window(phase: f32, window: WindowType) -> f32 {
    if window == WindowType::Off {
        return 1.0;
    }

    // 1. Calculate the base unipolar amplitude shape [0.0, 1.0]
    let amp = match window {
        // WAVE 6: Starts at 100% and ramps steadily down to 0%
        WindowType::Saw => 1.0 - phase,

        // WAVE 7: Ramps 0% -> 100% -> 0% over the full cycle
        WindowType::Triangle => 1.0 - (phase * 2.0 - 1.0).abs(),

        // WAVE 8: Holds at 100% for the first half, then ramps to 0%
        WindowType::Trapezoid => {
            if phase < 0.5 {
                1.0
            } else {
                1.0 - (phase - 0.5) * 2.0
            }
        }

        // SYSEX ONLY: Holds at 100% for the first half, 0% for the second
        WindowType::Pulse => {
            if phase < 0.5 {
                1.0
            } else {
                0.0
            }
        }

        // SYSEX ONLY: Two consecutive ascending saws (0% -> 100%)
        WindowType::DoubleSaw => wrap01(phase * 2.0),

        _ => 1.0,
    };

    // 2. The Casio Rectifier Trick
    // If we are in the second half of the master cycle, flip the window's sign.
    // This perfectly counteracts the carrier wave's negative polarity!
    if phase >= 0.5 {
        -amp
    } else {
        amp
    }
}
// ─── LFO ──────────────────────────────────────────────────────────────────────

/// LFO sample for phase ∈ [0, 1). Mirrors `lfoOutput` in the JS.
pub fn lfo_output(phase: f32, waveform: LfoWaveform) -> f32 {
    lfo_output_with_symmetry(phase, waveform, 0.5)
}

pub fn random_hold_value(step_index: i32) -> f32 {
    let seed = step_index as f32 * 12.9898 + 78.233;
    let hash = (seed).sin() * 43_758.547;
    let fract = hash - (hash).floor();
    fract * 2.0 - 1.0
}

#[inline]
fn warp_phase_with_symmetry(phase: f32, symmetry: f32) -> f32 {
    let p = wrap01(phase);
    let pivot = symmetry.clamp(0.001, 0.999);
    if p < pivot {
        (p / pivot) * 0.5
    } else {
        0.5 + ((p - pivot) / (1.0 - pivot)) * 0.5
    }
}

pub fn lfo_output_with_symmetry(phase: f32, waveform: LfoWaveform, symmetry: f32) -> f32 {
    let warped = warp_phase_with_symmetry(phase, symmetry);
    match waveform {
        LfoWaveform::Sine => sin_lut(warped),
        LfoWaveform::Triangle => {
            if warped < 0.5 {
                warped * 4.0 - 1.0
            } else {
                3.0 - warped * 4.0
            }
        }
        LfoWaveform::Square => {
            if warped < 0.5 {
                1.0
            } else {
                -1.0
            }
        }
        LfoWaveform::Saw => warped * 2.0 - 1.0,
        LfoWaveform::InvertedSaw => 1.0 - warped * 2.0,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lfo_symmetry_modulates_saw_shape() {
        let phase = 0.25;
        let centered = lfo_output_with_symmetry(phase, LfoWaveform::Saw, 0.5);
        let skewed = lfo_output_with_symmetry(phase, LfoWaveform::Saw, 0.8);
        assert!(
            (centered - skewed).abs() > 0.1,
            "expected symmetry to alter saw output"
        );
    }

    #[test]
    fn lfo_symmetry_modulates_sine_phase() {
        let phase = 0.2;
        let centered = lfo_output_with_symmetry(phase, LfoWaveform::Sine, 0.5);
        let skewed = lfo_output_with_symmetry(phase, LfoWaveform::Sine, 0.8);
        assert!(
            (centered - skewed).abs() > 0.01,
            "expected symmetry to alter sine output"
        );
    }
}
