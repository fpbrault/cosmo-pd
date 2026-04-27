use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// RingModFx — ring modulation with configurable carrier frequency
// ---------------------------------------------------------------------------

pub struct RingModFx {
    pub enabled: bool,
    pub carrier_hz: f32,  // 20..2000 Hz
    pub mix: f32,
    phase: f32,
    sample_rate: f32,
}

impl RingModFx {
    pub fn new(sr: f32) -> Self {
        Self {
            enabled: false,
            carrier_hz: 440.0,
            mix: 1.0,
            phase: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        self.phase += self.carrier_hz / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }
        let carrier = sinf(self.phase * core::f32::consts::PI * 2.0);
        let wet = sample * carrier;
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
    }
}
