extern crate alloc;

use alloc::vec::Vec;

/// ADSR stage state.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub enum AdsrPhase {
    #[default]
    Idle,
    Attack,
    Decay,
    Sustain,
    Release,
}

/// Time and sustain parameters for a reusable ADSR envelope.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct AdsrParams {
    pub attack_seconds: f32,
    pub decay_seconds: f32,
    pub sustain_level: f32,
    pub release_seconds: f32,
}

impl Default for AdsrParams {
    fn default() -> Self {
        Self {
            attack_seconds: 0.01,
            decay_seconds: 0.1,
            sustain_level: 0.8,
            release_seconds: 0.2,
        }
    }
}

/// Reusable ADSR envelope suitable for modulation or amplitude control.
#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub struct AdsrEnvelope {
    phase: AdsrPhase,
    output: f32,
    release_start: f32,
}

impl AdsrEnvelope {
    pub fn phase(&self) -> AdsrPhase {
        self.phase
    }

    pub fn output(&self) -> f32 {
        self.output
    }

    pub fn note_on(&mut self) {
        self.phase = AdsrPhase::Attack;
    }

    pub fn note_off(&mut self) {
        self.release_start = self.output;
        self.phase = AdsrPhase::Release;
    }

    pub fn reset(&mut self) {
        *self = Self::default();
    }

    pub fn advance(&mut self, params: AdsrParams, sample_rate: f32) -> f32 {
        let sample_rate = sample_rate.max(1.0);
        let sustain = params.sustain_level.clamp(0.0, 1.0);

        match self.phase {
            AdsrPhase::Idle => self.output = 0.0,
            AdsrPhase::Attack => {
                self.output += rate_per_sample(params.attack_seconds, sample_rate, 1.0);
                if self.output >= 1.0 {
                    self.output = 1.0;
                    self.phase = AdsrPhase::Decay;
                }
            }
            AdsrPhase::Decay => {
                let distance = (1.0 - sustain).max(0.0);
                self.output -= rate_per_sample(params.decay_seconds, sample_rate, distance);
                if self.output <= sustain {
                    self.output = sustain;
                    self.phase = AdsrPhase::Sustain;
                }
            }
            AdsrPhase::Sustain => self.output = sustain,
            AdsrPhase::Release => {
                self.output -=
                    rate_per_sample(params.release_seconds, sample_rate, self.release_start);
                if self.output <= 0.0 {
                    self.reset();
                }
            }
        }

        self.output
    }
}

/// A generic level-and-duration envelope step.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct StepEnvelopeStep {
    pub target_level: f32,
    pub duration_seconds: f32,
}

/// Simple reusable multi-step envelope runtime.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct StepEnvelope {
    steps: Vec<StepEnvelopeStep>,
    current_step: usize,
    samples_in_step: u32,
    start_level: f32,
    output: f32,
    active: bool,
    loop_enabled: bool,
}

impl StepEnvelope {
    pub fn new(steps: Vec<StepEnvelopeStep>) -> Self {
        Self {
            steps,
            ..Self::default()
        }
    }

    pub fn set_loop_enabled(&mut self, loop_enabled: bool) {
        self.loop_enabled = loop_enabled;
    }

    pub fn trigger(&mut self) {
        self.current_step = 0;
        self.samples_in_step = 0;
        self.start_level = self.output;
        self.active = !self.steps.is_empty();
    }

    pub fn output(&self) -> f32 {
        self.output
    }

    pub fn is_active(&self) -> bool {
        self.active
    }

    pub fn advance(&mut self, sample_rate: f32) -> f32 {
        if !self.active || self.steps.is_empty() {
            return self.output;
        }

        let step = self.steps[self.current_step];
        let duration_samples = seconds_to_samples(step.duration_seconds, sample_rate).max(1);
        let progress = (self.samples_in_step as f32 / duration_samples as f32).clamp(0.0, 1.0);
        self.output = self.start_level + (step.target_level - self.start_level) * progress;
        self.samples_in_step += 1;

        if self.samples_in_step >= duration_samples {
            self.output = step.target_level;
            self.current_step += 1;
            self.samples_in_step = 0;
            self.start_level = self.output;

            if self.current_step >= self.steps.len() {
                if self.loop_enabled {
                    self.current_step = 0;
                } else {
                    self.active = false;
                }
            }
        }

        self.output
    }
}

fn rate_per_sample(seconds: f32, sample_rate: f32, distance: f32) -> f32 {
    if seconds <= 0.0 {
        return distance.max(1.0);
    }

    distance / (seconds * sample_rate).max(1.0)
}

fn seconds_to_samples(seconds: f32, sample_rate: f32) -> u32 {
    libm::roundf(seconds.max(0.0) * sample_rate.max(1.0)) as u32
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adsr_reaches_sustain_and_releases_to_idle() {
        let mut envelope = AdsrEnvelope::default();
        let params = AdsrParams {
            attack_seconds: 0.01,
            decay_seconds: 0.01,
            sustain_level: 0.5,
            release_seconds: 0.01,
        };

        envelope.note_on();
        for _ in 0..30 {
            envelope.advance(params, 1_000.0);
        }

        assert_eq!(envelope.phase(), AdsrPhase::Sustain);
        assert!((envelope.output() - 0.5).abs() < 0.0001);

        envelope.note_off();
        for _ in 0..20 {
            envelope.advance(params, 1_000.0);
        }

        assert_eq!(envelope.phase(), AdsrPhase::Idle);
        assert_eq!(envelope.output(), 0.0);
    }

    #[test]
    fn step_envelope_advances_through_steps() {
        let mut envelope = StepEnvelope::new(alloc::vec![
            StepEnvelopeStep {
                target_level: 1.0,
                duration_seconds: 0.01,
            },
            StepEnvelopeStep {
                target_level: 0.25,
                duration_seconds: 0.01,
            },
        ]);

        envelope.trigger();
        for _ in 0..20 {
            envelope.advance(1_000.0);
        }

        assert!(!envelope.is_active());
        assert!((envelope.output() - 0.25).abs() < 0.0001);
    }
}
