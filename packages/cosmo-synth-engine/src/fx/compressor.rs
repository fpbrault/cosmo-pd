use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// CompressorFx — feed-forward peak compressor
// ---------------------------------------------------------------------------

pub struct CompressorFx {
    pub enabled: bool,
    pub threshold_db: f32,
    pub ratio: f32,
    pub attack_ms: f32,
    pub release_ms: f32,
    pub makeup_db: f32,
    pub mix: f32,
    envelope: f32,
    sample_rate: f32,
}

impl CompressorFx {
    pub fn new(sr: f32) -> Self {
        Self {
            enabled: false,
            threshold_db: -12.0,
            ratio: 4.0,
            attack_ms: 5.0,
            release_ms: 100.0,
            makeup_db: 6.0,
            mix: 1.0,
            envelope: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        let attack_coeff =
            libm::expf(-1.0 / (self.attack_ms * 0.001 * self.sample_rate).max(1.0));
        let release_coeff =
            libm::expf(-1.0 / (self.release_ms * 0.001 * self.sample_rate).max(1.0));

        let abs_sample = libm::fabsf(sample);
        if abs_sample > self.envelope {
            self.envelope = attack_coeff * self.envelope + (1.0 - attack_coeff) * abs_sample;
        } else {
            self.envelope = release_coeff * self.envelope;
        }

        let threshold_linear = db_to_linear(self.threshold_db);
        let gain_reduction = if self.envelope > threshold_linear && self.ratio > 1.0 {
            let excess_db = linear_to_db(self.envelope) - self.threshold_db;
            let compressed_excess = excess_db / self.ratio;
            db_to_linear(compressed_excess - excess_db)
        } else {
            1.0
        };

        let makeup = db_to_linear(self.makeup_db);
        let wet = sample * gain_reduction * makeup;

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
    }
}

#[inline]
fn db_to_linear(db: f32) -> f32 {
    libm::powf(10.0, db / 20.0)
}

#[inline]
fn linear_to_db(linear: f32) -> f32 {
    20.0 * libm::log10f(linear.max(1e-9))
}
