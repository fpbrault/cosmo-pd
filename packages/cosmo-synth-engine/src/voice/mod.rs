//! Per-voice state and sample rendering for the Cosmo PD-101 engine.

extern crate alloc;

mod adsr;
mod modulation;
mod render;

pub use adsr::{AdsrEnv, AdsrPhase};
pub(crate) use modulation::ModSources;
pub(crate) use render::{VoiceRenderContext, render_voice};

use crate::envelope::EnvGen;
use crate::synthesis::{LineSynthesisRuntime, PdChannel, PdState};

pub(crate) const ANTI_CLICK_ATTACK_SAMPLES: u32 = 64;

const SILENCE_THRESHOLD: f32 = 0.001;
const ANTI_CLICK_FADE_SAMPLES: u32 = 64;
pub(crate) const POLY_VOICE_STEAL_FADE_SAMPLES: u32 = 128;
const ANTI_CLICK_FADE_MAX_SAMPLES: u32 = 1024;
const DCW_DEZIPPER_TIME_SECONDS: f32 = 0.0015;
const POP_SUPPRESS_DELTA_THRESHOLD: f32 = 1.2;
const POP_SUPPRESS_EXCESS_KEEP: f32 = 0.15;
const RELEASE_TAIL_LEVEL_TIME_SECONDS: f32 = 0.01;
const RELEASE_TAIL_LEVEL_THRESHOLD: f32 = 0.002;
const ZERO_CROSS_STOP_THRESHOLD: f32 = 0.0005;
const ZERO_CROSS_STOP_MAX_WAIT_SAMPLES: u32 = 1024;
const DCA_LEVEL_CURVE_EXPONENT: f32 = 1.5;
const DCW_LEVEL_CURVE_EXPONENT: f32 = 0.8;
const DUAL_LINE_MIX_GAIN: f32 = 0.8;
const DEFAULT_BASE_FREQ: f32 = 220.0;

/// The three envelope generators for a single oscillator line (DCO, DCW, DCA).
#[derive(Debug, Clone, Default)]
pub struct LineEnvs {
    pub dco: EnvGen,
    pub dcw: EnvGen,
    pub dca: EnvGen,
}

#[derive(Debug, Clone)]
pub struct Voice {
    pub phi1: f32,
    pub phi2: f32,
    pub noise_step: u32,
    pub cycle_count1: u32,
    pub cycle_count2: u32,
    pub pm_phi: f32,
    pub vibrato_phase: f32,
    pub vibrato_delay_counter: u32,
    pub current_freq: f32,
    pub target_freq: f32,
    pub glide_progress: f32,
    pub glide_start_freq: f32,
    pub is_releasing: bool,
    pub is_silent: bool,
    pub sustained: bool,
    pub gate_was_open: bool,
    pub note: Option<u8>,
    pub note_on_sequence: u64,
    pub env_note: u8,
    pub frequency: f32,
    pub velocity: f32,
    pub line1_env: LineEnvs,
    pub line2_env: LineEnvs,
    pub mod_env: AdsrEnv,
    pub anti_click_fade: u32,
    pub anti_click_fade_len: u32,
    pub zero_cross_stop_pending: bool,
    pub zero_cross_stop_wait: u32,
    pub anti_click_attack: u32,
    pub voice_steal_fade_sample: f32,
    pub voice_steal_fade: u32,
    pub voice_steal_fade_len: u32,
    pub smoothed_dcw1: f32,
    pub smoothed_dcw2: f32,
    pub last_output_sample: f32,
    pub release_tail_level: f32,
    pub aftertouch: f32,
    pub(crate) line1_synthesis: LineSynthesisRuntime,
    pub(crate) line2_synthesis: LineSynthesisRuntime,
    pub(crate) prime_synthesis: LineSynthesisRuntime,
    pub(crate) pd_state: PdState,
}

impl Voice {
    pub fn new() -> Self {
        Self {
            phi1: 0.0,
            phi2: 0.0,
            noise_step: 0,
            cycle_count1: 0,
            cycle_count2: 0,
            pm_phi: 0.0,
            vibrato_phase: 0.0,
            vibrato_delay_counter: 0,
            current_freq: 0.0,
            target_freq: 0.0,
            glide_progress: 0.0,
            glide_start_freq: 0.0,
            is_releasing: false,
            is_silent: true,
            sustained: false,
            gate_was_open: false,
            env_note: 60,
            note: None,
            note_on_sequence: 0,
            frequency: 0.0,
            velocity: 1.0,
            line1_env: LineEnvs::default(),
            line2_env: LineEnvs::default(),
            mod_env: AdsrEnv::default(),
            anti_click_fade: 0,
            anti_click_fade_len: 0,
            zero_cross_stop_pending: false,
            zero_cross_stop_wait: 0,
            anti_click_attack: 0,
            voice_steal_fade_sample: 0.0,
            voice_steal_fade: 0,
            voice_steal_fade_len: 0,
            smoothed_dcw1: 0.0,
            smoothed_dcw2: 0.0,
            last_output_sample: 0.0,
            release_tail_level: 0.0,
            aftertouch: 0.0,
            line1_synthesis: LineSynthesisRuntime::new(PdChannel::Line1),
            line2_synthesis: LineSynthesisRuntime::new(PdChannel::Line2),
            prime_synthesis: LineSynthesisRuntime::new(PdChannel::Prime),
            pd_state: PdState::default(),
        }
    }

    pub fn reset_envs(&mut self) {
        self.line1_env.dco.reset();
        self.line1_env.dcw.reset();
        self.line1_env.dca.reset();
        self.line2_env.dco.reset();
        self.line2_env.dcw.reset();
        self.line2_env.dca.reset();
        self.mod_env.reset();
    }
}

impl Default for Voice {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
#[allow(clippy::field_reassign_with_default)]
mod tests {
    use super::ModSources;
    use super::{Voice, render::*};
    use crate::params::{LineParams, LineSelect, ModMatrixCache, ModMode, SynthParams};
    use crate::processor::utils;
    use crate::render_cache::CompiledSynthParams;

    fn render_sequence(params: SynthParams, note: u8, sample_count: usize) -> Vec<f32> {
        let mut voice = Voice::new();
        voice.frequency = utils::midi_note_to_freq(note);
        voice.current_freq = voice.frequency;
        voice.target_freq = voice.frequency;
        voice.glide_start_freq = voice.frequency;
        voice.env_note = note;
        voice.is_silent = false;
        voice.velocity = 1.0;

        let timing = crate::envelope::EnvelopeTimingCache::new(48_000.0);
        let sources = ModSources::new(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        let mut cache = ModMatrixCache::new();
        cache.compute(&sources);
        let plan = CompiledSynthParams::from_params(&params);

        (0..sample_count)
            .map(|_| {
                let ctx = super::VoiceRenderContext {
                    p: &params,
                    lfo_mod_val: 0.0,
                    lfo2_mod_val: 0.0,
                    random_mod_val: 0.0,
                    line1_modded: &params.line1,
                    line2_modded: &params.line2,
                    sr: 48_000.0,
                    timing: &timing,
                    pitch_bend_semitones: 0.0,
                    mod_wheel: 0.0,
                    macro1: 0.0,
                    macro2: 0.0,
                    macro3: 0.0,
                    macro4: 0.0,
                    cache: &cache,
                    modulation_active: false,
                    effective_tempo_bpm: 120.0,
                    line1_plan: &plan.line1,
                    line2_plan: &plan.line2,
                    shared_mod_env_val: 0.0,
                };
                render_voice(&mut voice, &ctx)
            })
            .collect()
    }

    fn sum_abs(samples: &[f32]) -> f32 {
        samples.iter().map(|sample| sample.abs()).sum()
    }

    #[test]
    fn dca_gain_uses_gentle_power_taper() {
        assert_eq!(super::render::cz_dca_env_gain(0.0), 0.0);
        assert_eq!(super::render::cz_dca_env_gain(1.0), 1.0);
        assert!(super::render::cz_dca_env_gain(0.5) < 0.5);
        assert!(super::render::cz_dca_env_gain(0.75) < 0.75);
    }

    #[test]
    fn dcw_depth_uses_gentle_power_taper() {
        assert_eq!(super::render::cz_dcw_env_depth(0.0), 0.0);
        assert_eq!(super::render::cz_dcw_env_depth(1.0), 1.0);
        assert!(super::render::cz_dcw_env_depth(0.5) > 0.5);
        assert!(super::render::cz_dcw_env_depth(0.75) > 0.75);
    }

    #[test]
    fn dcw_key_follow_leaves_lower_notes_unchanged() {
        assert_eq!(super::render::dcw_key_follow_scale(0.0, 96), 1.0);
        assert_eq!(super::render::dcw_key_follow_scale(9.0, 60), 1.0);
        assert_eq!(super::render::dcw_key_follow_scale(9.0, 48), 1.0);
    }

    #[test]
    fn dcw_key_follow_reduces_higher_note_depth() {
        let medium_note = super::render::dcw_key_follow_scale(9.0, 72);
        let high_note = super::render::dcw_key_follow_scale(9.0, 96);

        assert!(medium_note < 1.0);
        assert!(high_note < medium_note);
        assert!(high_note >= 0.15);
    }

    #[test]
    fn dco_env_matches_cz_reference_semitone_points() {
        let cases = [
            (8_u8, 1.0_f32),
            (16_u8, 2.0_f32),
            (24_u8, 3.0_f32),
            (32_u8, 4.0_f32),
            (40_u8, 5.0_f32),
            (48_u8, 6.0_f32),
            (56_u8, 7.0_f32),
            (64_u8, 8.0_f32),
            (65_u8, 10.0_f32),
            (66_u8, 12.0_f32),
            (72_u8, 24.0_f32),
        ];
        for (level, expected_semitones) in cases {
            let normalized_level = level as f32 / 99.0;
            let got = super::render::cz_dco_env_semitones(normalized_level);
            assert!(
                (got - expected_semitones).abs() <= 0.02,
                "level {level}: expected {expected_semitones} st, got {got} st"
            );
        }
    }

    #[test]
    fn dco_env_level_66_is_one_octave_up() {
        let base_freq = 220.0_f32;
        let line = crate::params::LineParams::default();
        let level_66 = 66.0_f32 / 99.0;
        let got = super::render::line_frequency(base_freq, &line, level_66);
        let expected = base_freq * 2.0;
        assert!(
            (got - expected).abs() <= expected * 0.02,
            "expected about {expected} Hz at level 66, got {got} Hz"
        );
    }

    #[test]
    fn render_voice_returns_zero_for_silent_voice() {
        let mut voice = Voice::new();
        voice.is_silent = true;
        let p = SynthParams::default();
        let timing = crate::envelope::EnvelopeTimingCache::new(48_000.0);
        let sources = ModSources::new(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        let mut cache = ModMatrixCache::new();
        cache.compute(&sources);
        let default_line = LineParams::default();
        let plan = CompiledSynthParams::from_params(&p);
        let ctx = super::VoiceRenderContext {
            p: &p,
            lfo_mod_val: 0.0,
            lfo2_mod_val: 0.0,
            random_mod_val: 0.0,
            line1_modded: &default_line,
            line2_modded: &default_line,
            sr: 48_000.0,
            timing: &timing,
            pitch_bend_semitones: 0.0,
            mod_wheel: 0.0,
            macro1: 0.0,
            macro2: 0.0,
            macro3: 0.0,
            macro4: 0.0,
            cache: &cache,
            modulation_active: false,
            effective_tempo_bpm: 120.0,
            line1_plan: &plan.line1,
            line2_plan: &plan.line2,
            shared_mod_env_val: 0.0,
        };
        let out = render_voice(&mut voice, &ctx);
        assert_eq!(out, 0.0);
    }

    #[test]
    fn render_voice_produces_nonzero_for_active_voice() {
        let mut voice = Voice::new();
        voice.frequency = 220.0;
        voice.env_note = 60;
        voice.is_silent = false;
        let p = SynthParams::default();
        let timing = crate::envelope::EnvelopeTimingCache::new(48_000.0);
        let sources = ModSources::new(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        let mut cache = ModMatrixCache::new();
        cache.compute(&sources);
        let default_line = LineParams::default();
        let plan = CompiledSynthParams::from_params(&p);
        let mut any_nonzero = false;
        for _ in 0..64 {
            let ctx = super::VoiceRenderContext {
                p: &p,
                lfo_mod_val: 0.0,
                lfo2_mod_val: 0.0,
                random_mod_val: 0.0,
                line1_modded: &default_line,
                line2_modded: &default_line,
                sr: 48_000.0,
                timing: &timing,
                pitch_bend_semitones: 0.0,
                mod_wheel: 0.0,
                macro1: 0.0,
                macro2: 0.0,
                macro3: 0.0,
                macro4: 0.0,
                cache: &cache,
                modulation_active: false,
                effective_tempo_bpm: 120.0,
                line1_plan: &plan.line1,
                line2_plan: &plan.line2,
                shared_mod_env_val: 0.0,
            };
            let out = render_voice(&mut voice, &ctx);
            if out.abs() > 1e-6 {
                any_nonzero = true;
                break;
            }
        }
        assert!(any_nonzero, "expected nonzero output from active voice");
    }

    #[test]
    fn noise_mode_is_unpitched_and_varies_per_sample() {
        let mut params = SynthParams::default();
        params.line_select = LineSelect::L1PlusL2Prime;
        params.mod_mode = ModMode::Noise;
        params.line1.dca_base = 0.0;
        params.line2.dca_base = 1.0;
        params.line2.dcw_base = 0.85;

        let low_note = render_sequence(params.clone(), 48, 16);
        let high_note = render_sequence(params, 84, 16);

        assert!(
            low_note
                .windows(2)
                .any(|pair| (pair[0] - pair[1]).abs() > 1e-6),
            "expected white noise to vary between successive samples"
        );
        assert_eq!(
            low_note, high_note,
            "noise-only output should not change pitch with the played note"
        );
    }

    #[test]
    fn l1_prime_noise_uses_line1_dcw_and_dca() {
        let mut params = SynthParams::default();
        params.line_select = LineSelect::L1PlusL1Prime;
        params.mod_mode = ModMode::Noise;
        params.line1.dca_base = 1.0;
        params.line1.dcw_base = 0.1;
        params.line2.dca_base = 0.0;

        let quiet = render_sequence(params.clone(), 60, 16);
        params.line1.dca_base = 0.0;
        let silent = render_sequence(params.clone(), 60, 16);
        params.line1.dca_base = 1.0;
        params.line1.dcw_base = 0.9;
        let bright = render_sequence(params, 60, 16);

        assert!(
            sum_abs(&silent) < 1e-6,
            "line 1 DCA should silence noise output"
        );
        assert!(
            sum_abs(&quiet) > 1e-4,
            "line 1 DCA should allow audible noise"
        );
        assert_ne!(quiet, bright, "line 1 DCW should reshape noise output");
    }

    #[test]
    fn l2_prime_noise_uses_line2_dcw_and_dca() {
        let mut params = SynthParams::default();
        params.line_select = LineSelect::L1PlusL2Prime;
        params.mod_mode = ModMode::Noise;
        params.line1.dca_base = 0.0;
        params.line2.dca_base = 1.0;
        params.line2.dcw_base = 0.15;

        let mellow = render_sequence(params.clone(), 60, 16);
        params.line2.dca_base = 0.0;
        let silent = render_sequence(params.clone(), 60, 16);
        params.line2.dca_base = 1.0;
        params.line2.dcw_base = 0.95;
        let bright = render_sequence(params, 60, 16);

        assert!(
            sum_abs(&silent) < 1e-6,
            "line 2 DCA should silence noise output"
        );
        assert!(
            sum_abs(&mellow) > 1e-4,
            "line 2 DCA should allow audible noise"
        );
        assert_ne!(mellow, bright, "line 2 DCW should reshape noise output");
    }

    #[test]
    fn single_line_modes_ignore_ring_and_noise() {
        let mut noise = SynthParams::default();
        noise.line_select = LineSelect::L1;
        noise.mod_mode = ModMode::Noise;
        noise.line1.dca_base = 1.0;

        let mut normal = noise.clone();
        normal.mod_mode = ModMode::Normal;

        let mut ring = SynthParams::default();
        ring.line_select = LineSelect::L2;
        ring.mod_mode = ModMode::Ring;
        ring.line2.dca_base = 1.0;

        let mut ring_normal = ring.clone();
        ring_normal.mod_mode = ModMode::Normal;

        assert_eq!(
            render_sequence(noise, 60, 16),
            render_sequence(normal, 60, 16)
        );
        assert_eq!(
            render_sequence(ring, 60, 16),
            render_sequence(ring_normal, 60, 16)
        );
    }

    #[test]
    fn both_prime_modes_render_their_selected_pd_sources() {
        let mut l1_prime = SynthParams::default();
        l1_prime.line_select = LineSelect::L1PlusL1Prime;
        l1_prime.mod_mode = ModMode::Normal;
        l1_prime.line1.algo = crate::params::Algo::Saw;
        l1_prime.line2.algo = crate::params::Algo::Square;
        l1_prime.line2.dca_base = 0.0;

        let mut l2_prime = l1_prime.clone();
        l2_prime.line_select = LineSelect::L1PlusL2Prime;

        let l1_prime_samples = render_sequence(l1_prime, 60, 64);
        let l2_prime_samples = render_sequence(l2_prime, 60, 64);
        assert!(sum_abs(&l1_prime_samples) > 1e-4);
        assert!(sum_abs(&l2_prime_samples) > 1e-4);
        assert_ne!(l1_prime_samples, l2_prime_samples);
    }

    #[test]
    fn dual_line_ring_uses_both_completed_pd_sources() {
        let mut normal = SynthParams::default();
        normal.line_select = LineSelect::L1PlusL2Prime;
        normal.mod_mode = ModMode::Normal;
        normal.line1.algo = crate::params::Algo::Saw;
        normal.line2.algo = crate::params::Algo::Square;

        let mut ring = normal.clone();
        ring.mod_mode = ModMode::Ring;

        let normal_samples = render_sequence(normal, 60, 64);
        let ring_samples = render_sequence(ring, 60, 64);
        assert!(ring_samples.iter().all(|sample| sample.is_finite()));
        assert!(sum_abs(&ring_samples) > 1e-4);
        assert_ne!(normal_samples, ring_samples);
    }
}
