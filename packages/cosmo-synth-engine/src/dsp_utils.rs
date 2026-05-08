use crate::params::{LfoWaveform, WindowType};

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
    a + (b - a) * t
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
        WindowType::Triangle => 1.0 - libm::fabsf(phase * 2.0 - 1.0),

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
    let hash = libm::sinf(seed) * 43758.5453;
    let fract = hash - libm::floorf(hash);
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
        LfoWaveform::Sine => libm::sinf(TWO_PI * warped),
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
