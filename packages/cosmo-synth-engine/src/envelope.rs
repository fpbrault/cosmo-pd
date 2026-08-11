use crate::dsp_utils::lerp;
use crate::params::StepEnvData;

/// Number of engine-neutral envelope slots carried by a synthesis line.
pub const ENVELOPE_SLOT_COUNT: usize = 3;

/// Sample durations for a single stepped-envelope slot.
///
/// The table is supplied by the synthesis engine. The core evaluator only
/// knows that a raw rate selects a duration; it does not know the source
/// engine's rate curves or display mappings.
#[derive(Debug, Clone, Copy)]
pub struct StepEnvelopeTiming {
    rate_samples: [u32; 128],
}

impl StepEnvelopeTiming {
    pub fn from_rate_samples(rate_samples: [u32; 128]) -> Self {
        Self { rate_samples }
    }

    #[inline]
    pub fn rate_to_samples(&self, rate: u8) -> u32 {
        self.rate_samples[rate.min(127) as usize]
    }
}

/// Timing tables used by the current step-envelope evaluator.
///
/// This is deliberately a collection of generic slot tables. A synthesis
/// method supplies the tables for its own envelope programs at the boundary.
#[derive(Debug, Clone, Copy)]
pub struct EnvelopeTimingCache {
    slots: [StepEnvelopeTiming; ENVELOPE_SLOT_COUNT],
}

impl EnvelopeTimingCache {
    pub fn from_slots(slots: [StepEnvelopeTiming; ENVELOPE_SLOT_COUNT]) -> Self {
        Self { slots }
    }

    #[inline]
    pub fn slot(&self, index: usize) -> &StepEnvelopeTiming {
        &self.slots[index.min(ENVELOPE_SLOT_COUNT - 1)]
    }
}

/// Runtime state for one envelope program.
#[derive(Debug, Clone, Copy, Default)]
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

/// Runtime state for the engine-neutral envelope slots of one synthesis line.
#[derive(Debug, Clone, Copy)]
pub struct EnvelopeBank {
    pub slots: [EnvGen; ENVELOPE_SLOT_COUNT],
}

impl Default for EnvelopeBank {
    fn default() -> Self {
        Self {
            slots: [EnvGen::default(); ENVELOPE_SLOT_COUNT],
        }
    }
}

impl EnvelopeBank {
    pub fn reset(&mut self) {
        for generator in &mut self.slots {
            generator.reset();
        }
    }
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
        env_data: &StepEnvData,
        timing: &StepEnvelopeTiming,
        duration_scale: f32,
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
        let rate_samples = timing.rate_to_samples(step_data.rate);
        let raw_duration = step_duration_samples(self.prev_level, target_level, rate_samples);
        let duration = scale_duration(raw_duration, duration_scale);

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

#[inline]
fn scale_duration(raw_duration: u32, duration_scale: f32) -> u32 {
    if raw_duration == 0 {
        return 0;
    }

    (raw_duration as f32 * duration_scale.max(0.0))
        .round()
        .max(1.0) as u32
}

/// Duration in samples for a transition between two envelope levels.
#[inline]
fn step_duration_samples(from_level: f32, to_level: f32, base_samples: u32) -> u32 {
    let distance = (to_level - from_level).abs();
    if distance <= 0.0 {
        return 0;
    }
    ((base_samples as f32 * distance).max(1.0).round()) as u32
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::EnvStep;

    fn timing() -> EnvelopeTimingCache {
        let table = StepEnvelopeTiming::from_rate_samples([48; 128]);
        EnvelopeTimingCache::from_slots([table; ENVELOPE_SLOT_COUNT])
    }

    #[test]
    fn envelope_bank_resets_all_slots() {
        let mut bank = EnvelopeBank::default();
        bank.slots[1].step = 4;
        bank.slots[2].output = 0.75;

        bank.reset();

        assert_eq!(bank.slots[1].step, 0);
        assert_eq!(bank.slots[2].output, 0.0);
    }

    #[test]
    fn release_with_multiple_post_sustain_steps_does_not_hard_zero_on_transition() {
        let mut env = StepEnvData {
            steps: [EnvStep {
                level: 0,
                rate: 99,
                level_norm: 0.0,
            }; crate::params::NUM_ENV_STEPS],
            sustain_step: 1,
            step_count: 4,
            loop_: false,
        };
        env.steps[0].level_norm = 0.99;
        env.steps[1].level_norm = 0.70;
        env.steps[2].level_norm = 0.40;
        env.steps[3].level_norm = 0.30;

        let timing = timing();
        let mut generator = EnvGen {
            prev_level: 0.7,
            output: 0.7,
            step: 1,
            ..Default::default()
        };

        generator.start_release(&env);
        for _ in 0..8192 {
            generator.advance(&env, timing.slot(2), 1.0);
            if generator.step >= 3 {
                break;
            }
        }

        assert_eq!(generator.step, 3);
        assert!(generator.output > 0.0);
    }

    #[test]
    fn duration_scale_shortens_active_progression() {
        let mut env = StepEnvData {
            step_count: 2,
            sustain_step: 1,
            ..Default::default()
        };
        env.steps[0].level_norm = 1.0;
        env.steps[0].rate = 50;

        let timing = timing();
        let mut base = EnvGen::default();
        let mut fast = EnvGen::default();

        for _ in 0..16 {
            base.advance(&env, timing.slot(0), 1.0);
            fast.advance(&env, timing.slot(0), 0.25);
        }

        assert!(fast.output > base.output);
    }
}
