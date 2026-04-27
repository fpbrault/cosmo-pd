use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// WavefolderFx — waveshaping / folding
// ---------------------------------------------------------------------------

pub struct WavefolderFx {
    pub enabled: bool,
    pub drive: f32,   // 0..1 → input gain before folding (1..8x)
    pub folds: f32,   // 0..1 → fold threshold (controls number of folds)
    pub mix: f32,
}

impl WavefolderFx {
    pub fn new() -> Self {
        Self {
            enabled: false,
            drive: 0.5,
            folds: 0.5,
            mix: 1.0,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let gain = 1.0 + self.drive * 7.0;
        let driven = sample * gain;

        // Fold threshold maps 0..1 → 0.3..1.0 (lower = more folding)
        let threshold = 1.0 - self.folds * 0.7;

        // Iterative folding: reflect signal at threshold
        let wet = fold(driven, threshold);

        // Normalize output to compensate for gain
        let normalized = wet / gain.max(1.0);

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + normalized * sinf(mix_angle)
    }
}

/// Reflect signal between [-threshold, threshold], folding iteratively.
fn fold(mut x: f32, threshold: f32) -> f32 {
    if threshold <= 0.0 {
        return 0.0;
    }
    let mut iterations = 0;
    loop {
        if libm::fabsf(x) <= threshold {
            break;
        }
        if x > threshold {
            x = 2.0 * threshold - x;
        } else {
            x = -2.0 * threshold - x;
        }
        iterations += 1;
        if iterations >= 8 {
            break;
        }
    }
    x
}
