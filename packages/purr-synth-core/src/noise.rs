/// Deterministic seedable pseudo-random generator for audio and modulation noise.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct NoiseGenerator {
    state: u32,
}

impl NoiseGenerator {
    pub fn new(seed: u32) -> Self {
        Self { state: seed.max(1) }
    }

    pub fn seed(&mut self, seed: u32) {
        self.state = seed.max(1);
    }

    pub fn next_u32(&mut self) -> u32 {
        let mut x = self.state;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        self.state = x.max(1);
        self.state
    }

    pub fn next_unipolar(&mut self) -> f32 {
        self.next_u32() as f32 / u32::MAX as f32
    }

    pub fn next_bipolar(&mut self) -> f32 {
        self.next_unipolar() * 2.0 - 1.0
    }
}

impl Default for NoiseGenerator {
    fn default() -> Self {
        Self::new(0x1234_5678)
    }
}

/// Sample-and-hold generator with deterministic noise source.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct SampleHold {
    noise: NoiseGenerator,
    held_value: f32,
    phase: f32,
}

impl SampleHold {
    pub fn new(seed: u32) -> Self {
        Self {
            noise: NoiseGenerator::new(seed),
            held_value: 0.0,
            phase: 0.0,
        }
    }

    pub fn held_value(&self) -> f32 {
        self.held_value
    }

    pub fn next(&mut self, rate_hz: f32, sample_rate: f32) -> f32 {
        self.phase += rate_hz.max(0.0) / sample_rate.max(1.0);

        if self.phase >= 1.0 {
            self.phase -= libm::floorf(self.phase);
            self.held_value = self.noise.next_bipolar();
        }

        self.held_value
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn noise_is_repeatable_for_same_seed() {
        let mut first = NoiseGenerator::new(42);
        let mut second = NoiseGenerator::new(42);

        assert_eq!(first.next_u32(), second.next_u32());
        assert_eq!(first.next_u32(), second.next_u32());
    }

    #[test]
    fn sample_hold_updates_after_cycle() {
        let mut sample_hold = SampleHold::new(7);
        let before = sample_hold.held_value();

        sample_hold.next(1.0, 1.0);

        assert_ne!(sample_hold.held_value(), before);
    }
}
