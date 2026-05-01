use crate::buffer::DelayLine;
use crate::mixing::dry_wet;

/// Shared delay effect primitive without product-specific preset or UI metadata.
#[derive(Debug, Clone, PartialEq)]
pub struct DelayTap {
    delay: DelayLine,
    delay_samples: f32,
    feedback: f32,
    mix: f32,
    feedback_sample: f32,
}

impl DelayTap {
    pub fn new(max_delay_samples: usize) -> Self {
        Self {
            delay: DelayLine::new(max_delay_samples),
            delay_samples: 0.0,
            feedback: 0.0,
            mix: 0.0,
            feedback_sample: 0.0,
        }
    }

    pub fn set_delay_samples(&mut self, delay_samples: f32) {
        self.delay_samples = delay_samples.max(0.0);
    }

    pub fn set_feedback(&mut self, feedback: f32) {
        self.feedback = feedback.clamp(-0.99, 0.99);
    }

    pub fn set_mix(&mut self, mix: f32) {
        self.mix = mix.clamp(0.0, 1.0);
    }

    pub fn clear(&mut self) {
        self.delay.clear();
        self.feedback_sample = 0.0;
    }

    pub fn process(&mut self, input: f32) -> f32 {
        self.delay
            .push(input + self.feedback_sample * self.feedback);
        let delayed = self.delay.read(self.delay_samples);
        self.feedback_sample = delayed;
        dry_wet(input, delayed, self.mix)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn delay_tap_emits_delayed_signal() {
        let mut delay = DelayTap::new(8);
        delay.set_delay_samples(1.0);
        delay.set_mix(1.0);

        let first = delay.process(1.0);
        let second = delay.process(0.0);

        assert_eq!(first, 0.0);
        assert_eq!(second, 1.0);
    }
}
