use libm::{cosf, expf, sinf, tanhf};

// ---------------------------------------------------------------------------
// DistortionFx — soft/hard clipping with tone control (1-pole HP + LP)
// ---------------------------------------------------------------------------

pub struct DistortionFx {
    pub enabled: bool,
    pub drive: f32, // 0..1 → controls clipping amount
    pub tone: f32,  // 0..1 → 0=warm, 1=bright
    pub mix: f32,
    hp_state: f32,
    lp_state: f32,
    sample_rate: f32,
}

impl DistortionFx {
    pub fn new(sr: f32) -> Self {
        Self {
            enabled: false,
            drive: 0.5,
            tone: 0.5,
            mix: 1.0,
            hp_state: 0.0,
            lp_state: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        // High-pass to remove DC before distortion (30 Hz)
        let hp_fc = 30.0_f32;
        let hp_g = expf(-2.0 * core::f32::consts::PI * hp_fc / self.sample_rate);
        self.hp_state = hp_g * self.hp_state + (1.0 - hp_g) * sample;
        let hp_out = sample - self.hp_state;

        // Drive → gain before clipping
        let drive_gain = 1.0 + self.drive * 15.0;
        let driven = hp_out * drive_gain;

        // Soft clip using tanh
        let clipped = tanhf(driven);

        // Tone control: LP filter; tone=0 → cutoff=800Hz, tone=1 → cutoff=12kHz
        let lp_cutoff = 800.0 + self.tone * 11200.0;
        let lp_g = expf(-2.0 * core::f32::consts::PI * lp_cutoff / self.sample_rate);
        self.lp_state = lp_g * self.lp_state + (1.0 - lp_g) * clipped;
        let toned = self.lp_state;

        // Compensate level
        let output_gain = 1.0 / (drive_gain * 0.5).max(1.0);
        let wet = toned * output_gain;

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
    }
}
