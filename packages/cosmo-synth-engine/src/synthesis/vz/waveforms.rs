//! The VZ engine's fixed eight-entry module waveform table.
//!
//! Real VZ hardware exposes eight fixed waveforms per module: one sine, five
//! sawtooth-like shapes produced by phase distortion at increasing depth, one
//! white-noise source, and one pitched noise/sine mix. Unlike CZ's DCW sweep,
//! these shapes are static -- VZ's timbral motion comes from envelopes and
//! the module/pair structure, not a continuously variable waveform.
//!
//! The five saw depths are not published; they are a progressive ramp chosen
//! to land in the documented "5 sawtooth-like waveforms, increasing
//! distortion" territory (US5040448A: "progressive distortions, levels
//! 1-5"), tuned by ear rather than reverse-engineered from ROM contents.

use crate::dsp_utils::cubic_sine_approx;
use crate::synthesis::pd::algorithms::cz101::warp_phase_saw;

use super::parameters::VzWaveform;

const SAW_DEPTHS: [f32; 5] = [0.35, 0.55, 0.72, 0.86, 0.97];

/// Simple LCG PRNG step. Matches the generator used by the Karpunk engine so
/// noise-bearing engines share one deterministic, allocation-free source.
#[inline(always)]
pub(crate) fn lcg_rand(state: &mut u32) -> f32 {
    *state = state.wrapping_mul(1_664_525).wrapping_add(1_013_904_223);
    let bits = (*state >> 16) as f32;
    bits / 32767.5 - 1.0
}

/// Evaluate a VZ module waveform at `phase`.
///
/// `phase` is not clamped to `[0, 1)`: in PHASE-mode pairs the input is
/// another module's audio-rate output rather than a wrapped oscillator
/// phase, matching the VZ's wave-shaping behaviour (the modulator's output
/// feeds the carrier's sine-lookup phase input directly, per US5040448A).
/// `cubic_sine_approx` wraps any real input via its own `floor`, so this
/// stays bounded and real-time-safe for both roles.
#[inline(always)]
pub(crate) fn vz_waveform(waveform: VzWaveform, phase: f32, prng: &mut u32) -> f32 {
    match waveform {
        VzWaveform::Sine => cubic_sine_approx(phase),
        VzWaveform::Saw1 => cubic_sine_approx(warp_phase_saw(phase, SAW_DEPTHS[0])),
        VzWaveform::Saw2 => cubic_sine_approx(warp_phase_saw(phase, SAW_DEPTHS[1])),
        VzWaveform::Saw3 => cubic_sine_approx(warp_phase_saw(phase, SAW_DEPTHS[2])),
        VzWaveform::Saw4 => cubic_sine_approx(warp_phase_saw(phase, SAW_DEPTHS[3])),
        VzWaveform::Saw5 => cubic_sine_approx(warp_phase_saw(phase, SAW_DEPTHS[4])),
        VzWaveform::Noise => lcg_rand(prng),
        VzWaveform::NoiseSine => cubic_sine_approx(phase) * (0.5 + 0.5 * lcg_rand(prng)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn all_waveforms_stay_in_range_for_arbitrary_input() {
        let mut prng = 0x1234_5678u32;
        for waveform in [
            VzWaveform::Sine,
            VzWaveform::Saw1,
            VzWaveform::Saw2,
            VzWaveform::Saw3,
            VzWaveform::Saw4,
            VzWaveform::Saw5,
            VzWaveform::Noise,
            VzWaveform::NoiseSine,
        ] {
            for i in -20..20 {
                let phase = i as f32 * 0.37;
                let value = vz_waveform(waveform, phase, &mut prng);
                assert!(
                    (-1.01..=1.01).contains(&value),
                    "{waveform:?} at phase {phase} produced {value}"
                );
                assert!(value.is_finite());
            }
        }
    }

    #[test]
    fn sine_and_saw_waveforms_are_deterministic_pure_functions() {
        let mut prng_a = 42u32;
        let mut prng_b = 42u32;
        for waveform in [
            VzWaveform::Sine,
            VzWaveform::Saw1,
            VzWaveform::Saw3,
            VzWaveform::Saw5,
        ] {
            let a = vz_waveform(waveform, 0.3, &mut prng_a);
            let b = vz_waveform(waveform, 0.3, &mut prng_b);
            assert_eq!(a.to_bits(), b.to_bits());
        }
    }

    #[test]
    fn noise_waveform_varies_and_is_seed_deterministic() {
        let mut prng_a = 7u32;
        let mut prng_b = 7u32;
        let sequence_a: Vec<f32> = (0..8)
            .map(|_| vz_waveform(VzWaveform::Noise, 0.0, &mut prng_a))
            .collect();
        let sequence_b: Vec<f32> = (0..8)
            .map(|_| vz_waveform(VzWaveform::Noise, 0.0, &mut prng_b))
            .collect();
        assert_eq!(sequence_a, sequence_b);
        assert!(sequence_a.windows(2).any(|pair| pair[0] != pair[1]));
    }

    #[test]
    fn saw_depths_increase_high_frequency_content() {
        let mut prng = 1u32;
        let phase = 0.42;
        let shallow = vz_waveform(VzWaveform::Saw1, phase, &mut prng);
        let deep = vz_waveform(VzWaveform::Saw5, phase, &mut prng);
        assert_ne!(shallow.to_bits(), deep.to_bits());
    }
}
