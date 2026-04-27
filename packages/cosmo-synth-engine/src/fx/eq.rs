use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// Biquad peaking / shelving filter for the 5-band EQ
// ---------------------------------------------------------------------------

struct BiquadFilter {
    b0: f32,
    b1: f32,
    b2: f32,
    a1: f32,
    a2: f32,
    x1: f32,
    x2: f32,
    y1: f32,
    y2: f32,
}

impl BiquadFilter {
    fn new() -> Self {
        Self {
            b0: 1.0,
            b1: 0.0,
            b2: 0.0,
            a1: 0.0,
            a2: 0.0,
            x1: 0.0,
            x2: 0.0,
            y1: 0.0,
            y2: 0.0,
        }
    }

    /// Set peaking EQ coefficients. `gain_db` is boost/cut in dB, `q` is bandwidth.
    fn set_peaking(&mut self, freq_hz: f32, gain_db: f32, q: f32, sr: f32) {
        let a = libm::powf(10.0_f32, gain_db / 40.0);
        let w0 = 2.0 * core::f32::consts::PI * freq_hz / sr;
        let alpha = sinf(w0) / (2.0 * q);
        let cos_w0 = cosf(w0);
        let a0_inv = 1.0 / (1.0 + alpha / a);
        self.b0 = (1.0 + alpha * a) * a0_inv;
        self.b1 = (-2.0 * cos_w0) * a0_inv;
        self.b2 = (1.0 - alpha * a) * a0_inv;
        self.a1 = (-2.0 * cos_w0) * a0_inv;
        self.a2 = (1.0 - alpha / a) * a0_inv;
    }

    /// Set low-shelf coefficients.
    fn set_low_shelf(&mut self, freq_hz: f32, gain_db: f32, sr: f32) {
        let a = libm::powf(10.0_f32, gain_db / 40.0);
        let w0 = 2.0 * core::f32::consts::PI * freq_hz / sr;
        let cos_w0 = cosf(w0);
        let sin_w0 = sinf(w0);
        let alpha = sin_w0 / 2.0 * libm::sqrtf((a + 1.0 / a) * (1.0 / 0.707 - 1.0) + 2.0);
        let a0_inv = 1.0 / ((a + 1.0) + (a - 1.0) * cos_w0 + 2.0 * libm::sqrtf(a) * alpha);
        self.b0 = a * ((a + 1.0) - (a - 1.0) * cos_w0 + 2.0 * libm::sqrtf(a) * alpha) * a0_inv;
        self.b1 = 2.0 * a * ((a - 1.0) - (a + 1.0) * cos_w0) * a0_inv;
        self.b2 = a * ((a + 1.0) - (a - 1.0) * cos_w0 - 2.0 * libm::sqrtf(a) * alpha) * a0_inv;
        self.a1 = -2.0 * ((a - 1.0) + (a + 1.0) * cos_w0) * a0_inv;
        self.a2 = ((a + 1.0) + (a - 1.0) * cos_w0 - 2.0 * libm::sqrtf(a) * alpha) * a0_inv;
    }

    /// Set high-shelf coefficients.
    fn set_high_shelf(&mut self, freq_hz: f32, gain_db: f32, sr: f32) {
        let a = libm::powf(10.0_f32, gain_db / 40.0);
        let w0 = 2.0 * core::f32::consts::PI * freq_hz / sr;
        let cos_w0 = cosf(w0);
        let sin_w0 = sinf(w0);
        let alpha = sin_w0 / 2.0 * libm::sqrtf((a + 1.0 / a) * (1.0 / 0.707 - 1.0) + 2.0);
        let a0_inv = 1.0 / ((a + 1.0) - (a - 1.0) * cos_w0 + 2.0 * libm::sqrtf(a) * alpha);
        self.b0 = a * ((a + 1.0) + (a - 1.0) * cos_w0 + 2.0 * libm::sqrtf(a) * alpha) * a0_inv;
        self.b1 = -2.0 * a * ((a - 1.0) + (a + 1.0) * cos_w0) * a0_inv;
        self.b2 = a * ((a + 1.0) + (a - 1.0) * cos_w0 - 2.0 * libm::sqrtf(a) * alpha) * a0_inv;
        self.a1 = 2.0 * ((a - 1.0) - (a + 1.0) * cos_w0) * a0_inv;
        self.a2 = ((a + 1.0) - (a - 1.0) * cos_w0 - 2.0 * libm::sqrtf(a) * alpha) * a0_inv;
    }

    #[inline]
    fn process(&mut self, x: f32) -> f32 {
        let y = self.b0 * x + self.b1 * self.x1 + self.b2 * self.x2
            - self.a1 * self.y1
            - self.a2 * self.y2;
        self.x2 = self.x1;
        self.x1 = x;
        self.y2 = self.y1;
        self.y1 = y;
        y
    }
}

// ---------------------------------------------------------------------------
// EqFx — 5-band parametric EQ
// Bands: 80 Hz (shelf), 240 Hz (peak), 750 Hz (peak), 2.2 kHz (peak), 8 kHz (shelf)
// ---------------------------------------------------------------------------

const EQ_FREQS: [f32; 5] = [80.0, 240.0, 750.0, 2200.0, 8000.0];

pub struct EqFx {
    filters: [BiquadFilter; 5],
    pub gains: [f32; 5],
    pub enabled: bool,
    sample_rate: f32,
    dirty: bool,
}

impl EqFx {
    pub fn new(sr: f32) -> Self {
        let mut eq = Self {
            filters: [
                BiquadFilter::new(),
                BiquadFilter::new(),
                BiquadFilter::new(),
                BiquadFilter::new(),
                BiquadFilter::new(),
            ],
            gains: [0.0; 5],
            enabled: false,
            sample_rate: sr,
            dirty: true,
        };
        eq.rebuild_coeffs();
        eq
    }

    pub fn set_gain(&mut self, band: usize, gain_db: f32) {
        if band < 5 {
            self.gains[band] = gain_db;
            self.dirty = true;
        }
    }

    fn rebuild_coeffs(&mut self) {
        let sr = self.sample_rate;
        self.filters[0].set_low_shelf(EQ_FREQS[0], self.gains[0], sr);
        self.filters[1].set_peaking(EQ_FREQS[1], self.gains[1], 1.0, sr);
        self.filters[2].set_peaking(EQ_FREQS[2], self.gains[2], 1.0, sr);
        self.filters[3].set_peaking(EQ_FREQS[3], self.gains[3], 1.0, sr);
        self.filters[4].set_high_shelf(EQ_FREQS[4], self.gains[4], sr);
        self.dirty = false;
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled {
            return sample;
        }
        if self.dirty {
            self.rebuild_coeffs();
        }
        let mut out = sample;
        for filter in &mut self.filters {
            out = filter.process(out);
        }
        out
    }
}
