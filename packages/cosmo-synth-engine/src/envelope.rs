use crate::dsp_utils::lerp;
pub use crate::envelope_map::EnvelopeKind;
use crate::envelope_map::human_level_to_raw;
use crate::envelope_map::human_rate_to_raw;
use crate::envelope_map::raw_level_to_human;
use crate::params::{StepEnvData, SynthParams};

const KEY_FOLLOW_REFERENCE_NOTE: f32 = 48.0;
const DCA_KEY_FOLLOW_SEMITONE_SPAN: f32 = 48.0;
const DCA_KEY_FOLLOW_MAX_DURATION_REDUCTION: f32 = 1.0;
const DCA_KEY_FOLLOW_MIN_DURATION_SCALE: f32 = 0.01;

pub fn normalize_env_to_raw_if_human(kind: EnvelopeKind, env: &mut StepEnvData) {
    const INV_99: f32 = 1.0 / 99.0;
    for step in env.steps.iter_mut() {
        step.level = human_level_to_raw(kind, step.level);
        step.rate = human_rate_to_raw(kind, step.rate);
        step.level_norm = raw_level_to_human(kind, step.level) as f32 * INV_99;
    }
}

pub fn normalize_synth_params_envelopes_to_raw_if_human(params: &mut SynthParams) {
    normalize_env_to_raw_if_human(EnvelopeKind::Dco, &mut params.line1.dco_env);
    normalize_env_to_raw_if_human(EnvelopeKind::Dcw, &mut params.line1.dcw_env);
    normalize_env_to_raw_if_human(EnvelopeKind::Dca, &mut params.line1.dca_env);
    normalize_env_to_raw_if_human(EnvelopeKind::Dco, &mut params.line2.dco_env);
    normalize_env_to_raw_if_human(EnvelopeKind::Dcw, &mut params.line2.dcw_env);
    normalize_env_to_raw_if_human(EnvelopeKind::Dca, &mut params.line2.dca_env);
}

#[derive(Debug, Clone)]
pub struct EnvelopeTimingCache {
    dco_rate_samples: [u32; 100],
    dcw_rate_samples: [u32; 100],
    dca_rate_samples: [u32; 100],
}

impl EnvelopeTimingCache {
    pub fn new(sample_rate: f32) -> Self {
        let mut dco_rate_samples = [0_u32; 100];
        let mut dcw_rate_samples = [0_u32; 100];
        let mut dca_rate_samples = [0_u32; 100];

        for rate in 0..100 {
            let rate = rate as u8;
            dco_rate_samples[rate as usize] = rate_to_samples(EnvelopeKind::Dco, rate, sample_rate);
            dcw_rate_samples[rate as usize] = rate_to_samples(EnvelopeKind::Dcw, rate, sample_rate);
            dca_rate_samples[rate as usize] = rate_to_samples(EnvelopeKind::Dca, rate, sample_rate);
        }

        Self {
            dco_rate_samples,
            dcw_rate_samples,
            dca_rate_samples,
        }
    }

    #[inline]
    pub fn rate_to_samples(&self, kind: EnvelopeKind, rate: u8) -> u32 {
        let idx = rate.min(99) as usize;
        match kind {
            EnvelopeKind::Dco => self.dco_rate_samples[idx],
            EnvelopeKind::Dcw => self.dcw_rate_samples[idx],
            EnvelopeKind::Dca => self.dca_rate_samples[idx],
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct EnvGen {
    pub step: usize,
    pub step_pos: u32,
    pub prev_level: f32,
    pub output: f32,
    pub releasing: bool,
    pub holding: bool,
    pub release_start_level: f32,
    pub release_progress: f32,
    pub release_duration: u32,
}

impl EnvGen {
    pub fn reset(&mut self) {
        self.step = 0;
        self.step_pos = 0;
        self.prev_level = 0.0;
        self.output = 0.0;
        self.releasing = false;
        self.holding = false;
        self.release_start_level = 0.0;
        self.release_progress = 0.0;
        self.release_duration = 0;
    }

    /// Advance the envelope by one sample.
    #[inline(always)]
    pub fn advance(
        &mut self,
        kind: EnvelopeKind,
        env_data: &StepEnvData,
        timing: &EnvelopeTimingCache,
        key_follow_amount: f32,
        note: u8,
    ) {
        if self.holding {
            return;
        }

        let steps = &env_data.steps;
        let step_count = env_data.step_count.clamp(1, steps.len());
        let effective_end_step = step_count - 1;
        let current_step = self.step.min(effective_end_step);
        let sustain_step = env_data.sustain_step.min(step_count - 1);

        let step_data = &steps[current_step];
        let target_level = if current_step == effective_end_step {
            0.0
        } else {
            step_data.level_norm
        };
        let frozen_step = step_data.rate == 0 && (target_level - self.prev_level).abs() > 0.0;
        let rate_samples = timing.rate_to_samples(kind, step_data.rate);
        let raw_duration = step_duration_samples(self.prev_level, target_level, rate_samples);
        let duration = apply_key_follow_to_duration(raw_duration, key_follow_amount, note);

        if self.releasing {
            if frozen_step {
                self.output = self.prev_level;
                return;
            }

            if duration == 0 {
                self.output = target_level;
            } else {
                let progress = (self.step_pos as f32 / duration as f32).min(1.0);
                self.output = lerp(self.prev_level, target_level, progress);
            }

            self.step_pos += 1;
            if self.step_pos >= duration.max(1) {
                self.prev_level = target_level;
                self.step_pos = 0;
                self.step += 1;
                if self.step > effective_end_step {
                    self.step = effective_end_step;
                    self.output = 0.0;
                }
            }
            return;
        }

        if step_count == 0 {
            return;
        }

        if frozen_step {
            self.output = self.prev_level;
            return;
        }

        let progress = if raw_duration == 0 {
            1.0
        } else {
            (self.step_pos as f32 / duration as f32).min(1.0)
        };

        self.output = lerp(self.prev_level, target_level, progress);

        if !env_data.loop_ && current_step == sustain_step && progress >= 1.0 {
            self.output = target_level;
            self.holding = true;
            return;
        }

        self.step_pos += 1;
        if self.step_pos >= duration.max(1) {
            self.prev_level = target_level;
            self.step_pos = 0;

            if !env_data.loop_ && current_step == sustain_step {
                self.output = target_level;
                return;
            }

            self.step += 1;

            if self.step >= step_count {
                if env_data.loop_ {
                    self.step = 0;
                } else {
                    self.step = effective_end_step;
                    self.output = 0.0;
                }
            }
        }
    }

    /// Begin the release phase of the envelope.
    ///
    /// Mirrors `startEnvRelease` in cosmoProcessor.js exactly.
    pub fn start_release(&mut self, env_data: &StepEnvData) {
        let steps = &env_data.steps;
        let step_count = env_data.step_count.clamp(1, steps.len());
        let sustain_step = env_data.sustain_step.min(step_count - 1);
        let effective_end_step = step_count - 1;

        self.releasing = true;
        self.holding = false;
        self.release_progress = 0.0;

        if self.step <= sustain_step {
            self.step = (sustain_step + 1).min(effective_end_step);
            self.step_pos = 0;
        }

        self.prev_level = self.output;
    }
}

/// Converts a human rate [0..99] to a transition duration in seconds.
#[inline]
fn rate_to_seconds(kind: EnvelopeKind, rate: u8) -> f32 {
    let clamped_rate = rate.min(99);
    let normalized_rate = clamped_rate as f32 / 99.0;

    match kind {
        EnvelopeKind::Dca | EnvelopeKind::Dcw => {
            // DCA and DCW share the same measured timing curve once their raw
            // machine rates have been converted back to the displayed 0..99 scale.
            104.04_f32 * (0.004_f32 / 104.04_f32).powf(normalized_rate)
        }
        EnvelopeKind::Dco => {
            // DCO uses a steeper normalized exponential curve than DCA/DCW:
            // slowest at rate 0 (235.64s), fastest at rate 99 (~0.2ms).
            // Formula: 235.64 * e^(k*x) where k = -13.984.
            const DCO_EXP_K: f32 = -13.984;
            235.64_f32 * (DCO_EXP_K * normalized_rate).exp()
        }
    }
}

/// Converts a rate byte [0..99] to a sample count.
#[inline]
fn rate_to_samples(kind: EnvelopeKind, rate: u8, sr: f32) -> u32 {
    let v = sr * rate_to_seconds(kind, rate);
    v.max(1.0).round() as u32
}

/// Duration in samples for a transition between two envelope levels.
///
/// JS: `Math.max(1, Math.round(rateToSamples(rate, sr) * |toLevel - fromLevel|))`
/// Returns 0 when distance is 0 (no movement needed).
#[inline]
fn step_duration_samples(from_level: f32, to_level: f32, base_samples: u32) -> u32 {
    let distance = (to_level - from_level).abs();
    if distance <= 0.0 {
        return 0;
    }
    ((base_samples as f32 * distance).max(1.0).round()) as u32
}

#[inline]
fn key_follow_note_progress(note: u8, reference_note: f32, semitone_span: f32) -> f32 {
    if semitone_span <= 0.0 {
        return 0.0;
    }

    ((note as f32 - reference_note) / semitone_span).clamp(0.0, 1.0)
}

#[inline]
fn dca_key_follow_duration_scale(key_follow_amount: f32, note: u8) -> f32 {
    let key_follow = (key_follow_amount / 9.0).clamp(0.0, 1.0);
    if key_follow <= 0.0 {
        return 1.0;
    }

    let pitch_progress = key_follow_note_progress(
        note,
        KEY_FOLLOW_REFERENCE_NOTE,
        DCA_KEY_FOLLOW_SEMITONE_SPAN,
    );
    let reduction = key_follow * pitch_progress * DCA_KEY_FOLLOW_MAX_DURATION_REDUCTION;
    (1.0 - reduction).clamp(DCA_KEY_FOLLOW_MIN_DURATION_SCALE, 1.0)
}

#[inline]
fn apply_key_follow_to_duration(raw_duration: u32, key_follow_amount: f32, note: u8) -> u32 {
    if raw_duration == 0 {
        return 0;
    }

    let duration_scale = dca_key_follow_duration_scale(key_follow_amount, note);
    (raw_duration as f32 * duration_scale).round().max(1.0) as u32
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::envelope_map::raw_rate_to_human;
    use crate::params::SynthParams;

    #[test]
    fn dco_rate_mapping_matches_spec() {
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dco, 0), 0);
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dco, 99), 127);
        assert_eq!(raw_rate_to_human(EnvelopeKind::Dco, 0), 0);
        assert_eq!(raw_rate_to_human(EnvelopeKind::Dco, 127), 99);
    }

    #[test]
    fn dco_level_mapping_matches_spec() {
        assert_eq!(human_level_to_raw(EnvelopeKind::Dco, 63), 63);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dco, 64), 68);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dco, 99), 103);
        assert_eq!(raw_level_to_human(EnvelopeKind::Dco, 63), 63);
        assert_eq!(raw_level_to_human(EnvelopeKind::Dco, 68), 64);
    }

    #[test]
    fn dcw_mapping_matches_spec() {
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dcw, 0), 8);
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dcw, 99), 127);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dcw, 99), 127);
        assert_eq!(raw_rate_to_human(EnvelopeKind::Dcw, 8), 0);
        assert_eq!(raw_rate_to_human(EnvelopeKind::Dcw, 127), 99);
    }

    #[test]
    fn dca_mapping_matches_spec() {
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dca, 0), 0);
        assert_eq!(human_rate_to_raw(EnvelopeKind::Dca, 99), 119);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dca, 0), 0);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dca, 1), 29);
        assert_eq!(human_level_to_raw(EnvelopeKind::Dca, 99), 127);
        assert_eq!(raw_level_to_human(EnvelopeKind::Dca, 127), 99);
    }

    #[test]
    fn normalize_synth_params_converts_human_envelopes_to_raw() {
        use crate::params::{EnvStep, NUM_ENV_STEPS};
        // Build all envelopes from known human-scale values (level/rate in 0–99)
        // so no step starts as already-raw. This prevents double-conversion of
        // default/untouched steps.
        let blank = || StepEnvData {
            steps: [EnvStep {
                level: 0,
                rate: 0,
                level_norm: 0.0,
            }; NUM_ENV_STEPS],
            sustain_step: 0,
            step_count: 1,
            loop_: false,
        };
        let mut params = SynthParams::default();
        params.line1.dco_env = blank();
        params.line1.dco_env.steps[0] = EnvStep {
            level: 66,
            rate: 99,
            level_norm: 0.0,
        };
        params.line1.dcw_env = blank();
        params.line1.dcw_env.steps[0] = EnvStep {
            level: 99,
            rate: 0,
            level_norm: 0.0,
        };
        params.line1.dca_env = blank();
        params.line1.dca_env.steps[0] = EnvStep {
            level: 1,
            rate: 99,
            level_norm: 0.0,
        };
        params.line2.dco_env = blank();
        params.line2.dcw_env = blank();
        params.line2.dca_env = blank();

        normalize_synth_params_envelopes_to_raw_if_human(&mut params);

        assert_eq!(params.line1.dco_env.steps[0].level, 70);
        assert_eq!(params.line1.dco_env.steps[0].rate, 127);
        assert_eq!(params.line1.dcw_env.steps[0].level, 127);
        assert_eq!(params.line1.dcw_env.steps[0].rate, 8);
        assert_eq!(params.line1.dca_env.steps[0].level, 29);
        assert_eq!(params.line1.dca_env.steps[0].rate, 119);
    }

    #[test]
    fn dca_rate_curve_matches_measured_times() {
        let expected = [
            (0, 104.04_f32),
            (1, 92.45_f32),
            (10, 34.66_f32),
            (20, 13.0_f32),
            (40, 1.63_f32),
            (50, 0.544_f32),
            (60, 0.194_f32),
            (70, 0.066_f32),
            (85, 0.016_f32),
            (99, 0.004_f32),
        ];

        for (rate, seconds) in expected {
            let actual = rate_to_seconds(EnvelopeKind::Dca, rate);
            let relative_error = (actual - seconds).abs() / seconds;
            assert!(
                relative_error <= 0.20,
                "rate {rate}: expected about {seconds}s, got {actual}s (relative error {relative_error})"
            );
        }
    }

    #[test]
    fn dcw_uses_same_rate_curve_as_dca() {
        for rate in [0, 1, 10, 20, 40, 50, 60, 70, 85, 99] {
            let dcw = rate_to_seconds(EnvelopeKind::Dcw, rate);
            let dca = rate_to_seconds(EnvelopeKind::Dca, rate);
            assert_eq!(dcw, dca, "rate {rate}: DCW and DCA should share timing");
        }
    }

    #[test]
    fn dco_rate_curve_matches_measured_times() {
        let expected = [
            (0, 235.64_f32),
            (1, 204.60_f32),
            (10, 57.38_f32),
            (20, 13.97_f32),
            (40, 0.83_f32),
            (50, 0.20_f32),
            (60, 0.05_f32),
            (70, 0.012_f32),
            (85, 0.0014_f32),
            (99, 0.0002_f32),
        ];

        for (rate, seconds) in expected {
            let actual = rate_to_seconds(EnvelopeKind::Dco, rate);
            let relative_error = (actual - seconds).abs() / seconds;
            assert!(
                relative_error <= 0.12,
                "rate {rate}: expected about {seconds}s, got {actual}s (relative error {relative_error})"
            );
        }
    }

    #[test]
    fn release_with_multiple_post_sustain_steps_does_not_hard_zero_on_transition() {
        use crate::params::{EnvStep, NUM_ENV_STEPS, StepEnvData};

        let mut env = StepEnvData {
            steps: [EnvStep {
                level: 0,
                rate: 99,
                level_norm: 0.0,
            }; NUM_ENV_STEPS],
            sustain_step: 1,
            step_count: 4,
            loop_: false,
        };

        // Active steps:
        // 0 -> attack target
        // 1 -> sustain target
        // 2 -> first release segment target
        // 3 -> final segment (forced to zero in engine)
        env.steps[0] = EnvStep {
            level: 99,
            rate: 99,
            level_norm: 0.0,
        };
        env.steps[1] = EnvStep {
            level: 70,
            rate: 99,
            level_norm: 0.0,
        };
        env.steps[2] = EnvStep {
            level: 40,
            rate: 99,
            level_norm: 0.0,
        };
        env.steps[3] = EnvStep {
            level: 30,
            rate: 99,
            level_norm: 0.0,
        };

        let timing = EnvelopeTimingCache::new(48_000.0);
        let mut r#gen = EnvGen {
            prev_level: 0.7,
            output: 0.7,
            step: 1, // at sustain
            ..Default::default()
        };

        r#gen.start_release(&env);

        // Consume release step 2 completely so generator transitions to step 3.
        // We don't need exact sample count, just enough to guarantee transition.
        for _ in 0..8192 {
            r#gen.advance(EnvelopeKind::Dca, &env, &timing, 0.0, 60);
            if r#gen.step >= 3 {
                break;
            }
        }

        assert_eq!(r#gen.step, 3);
        // On entering the final step, output must still be above zero and then
        // decay using the final step's rate, not jump immediately to 0.
        assert!(r#gen.output > 0.0);
    }

    #[test]
    fn dca_key_follow_leaves_lower_notes_unchanged() {
        assert_eq!(dca_key_follow_duration_scale(0.0, 84), 1.0);
        assert_eq!(dca_key_follow_duration_scale(9.0, 48), 1.0);
        assert_eq!(dca_key_follow_duration_scale(9.0, 36), 1.0);
    }

    #[test]
    fn dca_key_follow_shortens_higher_notes() {
        let medium_note = dca_key_follow_duration_scale(9.0, 72);
        let high_note = dca_key_follow_duration_scale(9.0, 96);

        assert!(medium_note < 1.0);
        assert!(high_note < medium_note);
        assert!(high_note >= DCA_KEY_FOLLOW_MIN_DURATION_SCALE);
    }

    #[test]
    fn dca_key_follow_affects_active_progression_not_just_release() {
        use crate::params::{EnvStep, NUM_ENV_STEPS, StepEnvData};

        let mut env = StepEnvData {
            steps: [EnvStep {
                level: 0,
                rate: 50,
                level_norm: 0.0,
            }; NUM_ENV_STEPS],
            sustain_step: 7,
            step_count: 2,
            loop_: false,
        };
        env.steps[0] = EnvStep {
            level: 99,
            rate: 50,
            level_norm: 1.0,
        };
        env.steps[1] = EnvStep {
            level: 0,
            rate: 50,
            level_norm: 0.0,
        };

        let timing = EnvelopeTimingCache::new(48_000.0);
        let mut base = EnvGen::default();
        let mut high = EnvGen::default();

        for _ in 0..64 {
            base.advance(EnvelopeKind::Dca, &env, &timing, 0.0, 60);
            high.advance(EnvelopeKind::Dca, &env, &timing, 9.0, 96);
        }

        assert!(high.output > base.output);
    }
}
