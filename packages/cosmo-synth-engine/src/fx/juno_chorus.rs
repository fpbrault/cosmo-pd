use libm::{cosf, sinf};

use super::delay_line::DelayLine;

// ---------------------------------------------------------------------------
// JunoChorusFx — dual BBD-style chorus inspired by the Roland Juno
//
// Mode 0: single path, slow LFO (~0.5 Hz, 1.7ms center)
// Mode 1: dual path, fast LFO (~3.0 Hz, 1.7ms center)
// Mode 2: dual path, both LFOs blended
// ---------------------------------------------------------------------------

const JUNO_CENTER_S: f32 = 0.0017; // 1.7 ms center delay
const JUNO_DEPTH_S: f32 = 0.0008; // ±0.8 ms swing

pub struct JunoChorusFx {
    delay1: DelayLine,
    delay2: DelayLine,
    lfo1_phase: f32,
    lfo2_phase: f32,
    pub mode: u8, // 0, 1, or 2
    pub mix: f32,
    pub enabled: bool,
    sample_rate: f32,
}

impl JunoChorusFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = libm::roundf(0.01 * sr) as usize + 2;
        Self {
            delay1: DelayLine::new(buf_len),
            delay2: DelayLine::new(buf_len),
            lfo1_phase: 0.0,
            lfo2_phase: 0.25, // 90° offset
            mode: 0,
            mix: 0.5,
            enabled: false,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let lfo1_rate = 0.5_f32;
        let lfo2_rate = 3.0_f32;

        self.lfo1_phase += lfo1_rate / self.sample_rate;
        self.lfo2_phase += lfo2_rate / self.sample_rate;
        if self.lfo1_phase >= 1.0 {
            self.lfo1_phase -= 1.0;
        }
        if self.lfo2_phase >= 1.0 {
            self.lfo2_phase -= 1.0;
        }

        let lfo1 = sinf(self.lfo1_phase * core::f32::consts::PI * 2.0);
        let lfo2 = sinf(self.lfo2_phase * core::f32::consts::PI * 2.0);

        let center = JUNO_CENTER_S * self.sample_rate;
        let depth = JUNO_DEPTH_S * self.sample_rate;

        let t1 = (center + lfo1 * depth).max(1.0);
        let t2 = (center + lfo2 * depth).max(1.0);

        self.delay1.write(sample);
        self.delay2.write(sample);

        let wet = match self.mode {
            0 => self.delay1.read_at_fractional(t1),
            1 => self.delay2.read_at_fractional(t2),
            _ => {
                let w1 = self.delay1.read_at_fractional(t1);
                let w2 = self.delay2.read_at_fractional(t2);
                (w1 + w2) * 0.5
            }
        };

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
    }
}
