use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// TremoloFx — amplitude modulation (volume LFO)
// ---------------------------------------------------------------------------

pub struct TremoloFx {
    pub enabled: bool,
    pub rate: f32,    // 0.1..20 Hz
    pub depth: f32,   // 0..1
    pub waveform: u8, // 0=sine, 1=triangle, 2=square
    pub mix: f32,
    phase: f32,
    sample_rate: f32,
}

impl TremoloFx {
    pub fn new(sr: f32) -> Self {
        Self {
            enabled: false,
            rate: 4.0,
            depth: 0.5,
            waveform: 0,
            mix: 1.0,
            phase: 0.0,
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

        let lfo = match self.waveform {
            1 => {
                // Triangle
                let t = self.phase;
                if t < 0.5 {
                    t * 4.0 - 1.0
                } else {
                    3.0 - t * 4.0
                }
            }
            2 => {
                // Square
                if self.phase < 0.5 {
                    1.0
                } else {
                    -1.0
                }
            }
            _ => sinf(self.phase * core::f32::consts::PI * 2.0),
        };

        // Convert LFO [-1,1] to amplitude gain [1-depth, 1]
        let gain = 1.0 - self.depth * (1.0 - lfo) * 0.5;
        let wet = sample * gain;

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
    }
}
