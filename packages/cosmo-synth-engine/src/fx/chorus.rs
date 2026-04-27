use libm::{cosf, sinf};

use super::delay_line::DelayLine;

const SMOOTH_COEFF: f32 = 0.005;
const TWO_PI: f32 = core::f32::consts::PI * 2.0;

// ---------------------------------------------------------------------------
// ChorusFx
// ---------------------------------------------------------------------------

pub struct ChorusFx {
    delay: DelayLine,
    phase: f32,
    pub rate: f32,
    pub depth: f32,
    pub mix: f32,
    pub enabled: bool,
    smooth_depth: f32,
    sample_rate: f32,
}

impl ChorusFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = libm::roundf(0.05 * sr) as usize + 2;
        Self {
            delay: DelayLine::new(buf_len),
            phase: 0.0,
            rate: 0.8,
            depth: 0.003,
            mix: 0.0,
            enabled: false,
            smooth_depth: 0.003,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        self.smooth_depth =
            (self.smooth_depth + (self.depth - self.smooth_depth) * SMOOTH_COEFF) / 10.0;
        self.phase += self.rate / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }
        let mod_val = sinf(TWO_PI * self.phase);
        let delay_samples = (0.005 + self.smooth_depth * (mod_val + 1.0)) * self.sample_rate;
        let delay_samples = delay_samples.max(1.0);
        let wet = self.delay.read_at_fractional(delay_samples);
        self.delay.write(sample);
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        let dry_gain = cosf(mix_angle);
        let wet_gain = sinf(mix_angle);
        sample * dry_gain + wet * wet_gain
    }
}
