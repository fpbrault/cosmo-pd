use libm::{cosf, expf, tanhf};

use super::delay_line::DelayLine;

const SMOOTH_COEFF: f32 = 0.005;
const TWO_PI: f32 = core::f32::consts::PI * 2.0;
const TAPE_BRIGHT_CUTOFF_HZ: f32 = 20000.0;
const TAPE_WARM_RANGE_HZ: f32 = 19700.0;
const TAPE_SATURATION_DRIVE: f32 = 1.5;

// ---------------------------------------------------------------------------
// DelayFx
// ---------------------------------------------------------------------------

pub struct DelayFx {
    delay_line: DelayLine,
    pub time: f32,
    pub feedback: f32,
    pub mix: f32,
    pub enabled: bool,
    smooth_samples: f32,
    pub tape_mode: bool,
    pub warmth: f32,
    tape_filter_state: f32,
    sample_rate: f32,
}

impl DelayFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = libm::roundf(2.0 * sr) as usize;
        Self {
            delay_line: DelayLine::new(buf_len),
            time: 0.3,
            feedback: 0.35,
            mix: 0.0,
            enabled: false,
            smooth_samples: libm::roundf(0.3 * sr) as f32,
            tape_mode: false,
            warmth: 0.5,
            tape_filter_state: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        self.smooth_samples = self.smooth_samples
            + (self.time * self.sample_rate - self.smooth_samples) * SMOOTH_COEFF;
        let delay_samples = self.smooth_samples.max(1.0);
        let delayed = self.delay_line.read_at_fractional(delay_samples);

        let feedback_input = if self.tape_mode {
            let fc = TAPE_BRIGHT_CUTOFF_HZ - self.warmth * TAPE_WARM_RANGE_HZ;
            let g = expf(-TWO_PI * fc / self.sample_rate);
            self.tape_filter_state = self.tape_filter_state * g + delayed * (1.0 - g);
            tanhf(self.tape_filter_state * TAPE_SATURATION_DRIVE) / TAPE_SATURATION_DRIVE
        } else {
            delayed
        };

        self.delay_line
            .write(sample + feedback_input * self.feedback);
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        let dry_gain = cosf(mix_angle);
        let wet_gain = sinf_approx(mix_angle);
        sample * dry_gain + delayed * wet_gain
    }
}

#[inline]
fn sinf_approx(x: f32) -> f32 {
    libm::sinf(x)
}
