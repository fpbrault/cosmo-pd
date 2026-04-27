use libm::{cosf, sinf};

const TWO_PI: f32 = core::f32::consts::PI * 2.0;

// ---------------------------------------------------------------------------
// PhaserStage (first-order all-pass)
// ---------------------------------------------------------------------------

struct PhaserStage {
    x_prev: f32,
    y_prev: f32,
}

impl PhaserStage {
    fn new() -> Self {
        Self {
            x_prev: 0.0,
            y_prev: 0.0,
        }
    }

    #[inline]
    fn process(&mut self, input: f32, a: f32) -> f32 {
        let output = a * input + self.x_prev - a * self.y_prev;
        self.x_prev = input;
        self.y_prev = output;
        output
    }
}

// ---------------------------------------------------------------------------
// PhaserFx
// ---------------------------------------------------------------------------

pub struct PhaserFx {
    stages: [PhaserStage; 4],
    phase: f32,
    pub rate: f32,
    pub depth: f32,
    pub mix: f32,
    pub feedback: f32,
    pub enabled: bool,
    feedback_buf: f32,
    sample_rate: f32,
}

impl PhaserFx {
    pub fn new(sr: f32) -> Self {
        Self {
            stages: [
                PhaserStage::new(),
                PhaserStage::new(),
                PhaserStage::new(),
                PhaserStage::new(),
            ],
            phase: 0.0,
            rate: 0.5,
            depth: 1.0,
            mix: 0.0,
            feedback: 0.5,
            enabled: false,
            feedback_buf: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        self.phase += self.rate / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }
        let lfo = sinf(TWO_PI * self.phase);
        let min_freq = 100.0_f32;
        let max_freq = 2000.0_f32;
        let depth_clamped = self.depth.clamp(0.0, 1.0);
        let center_freq = min_freq + (max_freq - min_freq) * 0.5 * (1.0 + lfo * depth_clamped);
        let g = libm::tanf(core::f32::consts::PI * center_freq / self.sample_rate);
        let a = (g - 1.0) / (g + 1.0);
        let fb = self.feedback.clamp(-0.9, 0.9);
        let input_with_fb = sample + self.feedback_buf * fb;
        let mut out = input_with_fb;
        for stage in &mut self.stages {
            out = stage.process(out, a);
        }
        self.feedback_buf = out;
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        let dry_gain = cosf(mix_angle);
        let wet_gain = sinf(mix_angle);
        sample * dry_gain + out * wet_gain
    }
}
