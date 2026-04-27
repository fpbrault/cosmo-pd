use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// BitcrusherFx — bit depth reduction + sample rate reduction
// ---------------------------------------------------------------------------

pub struct BitcrusherFx {
    pub enabled: bool,
    pub bits: f32,         // 1..16 bit depth
    pub rate_reduction: f32, // 1..32 sample rate divisor
    pub mix: f32,
    hold_counter: f32,
    hold_value: f32,
}

impl BitcrusherFx {
    pub fn new() -> Self {
        Self {
            enabled: false,
            bits: 8.0,
            rate_reduction: 1.0,
            mix: 1.0,
            hold_counter: 0.0,
            hold_value: 0.0,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        // Sample rate reduction
        self.hold_counter += 1.0;
        let divisor = self.rate_reduction.max(1.0);
        if self.hold_counter >= divisor {
            self.hold_counter -= divisor;
            // Bit reduction
            let levels = libm::powf(2.0, self.bits.clamp(1.0, 16.0));
            self.hold_value = libm::roundf(sample * levels) / levels;
        }

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + self.hold_value * sinf(mix_angle)
    }
}
