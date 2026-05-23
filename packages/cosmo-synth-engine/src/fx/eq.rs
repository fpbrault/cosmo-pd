// ---------------------------------------------------------------------------
use crate::params::{EqParams, ModDestination};

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
        let a = (10.0_f32).powf(gain_db / 40.0);
        let w0 = 2.0 * core::f32::consts::PI * freq_hz / sr;
        let alpha = (w0).sin() / (2.0 * q);
        let cos_w0 = (w0).cos();
        let a0_inv = 1.0 / (1.0 + alpha / a);
        self.b0 = (1.0 + alpha * a) * a0_inv;
        self.b1 = (-2.0 * cos_w0) * a0_inv;
        self.b2 = (1.0 - alpha * a) * a0_inv;
        self.a1 = (-2.0 * cos_w0) * a0_inv;
        self.a2 = (1.0 - alpha / a) * a0_inv;
    }

    /// Set low-shelf coefficients.
    fn set_low_shelf(&mut self, freq_hz: f32, gain_db: f32, sr: f32) {
        let a = (10.0_f32).powf(gain_db / 40.0);
        let w0 = 2.0 * core::f32::consts::PI * freq_hz / sr;
        let cos_w0 = (w0).cos();
        let sin_w0 = (w0).sin();
        let alpha = sin_w0 / 2.0 * (((a + 1.0 / a) * (1.0 / 0.707 - 1.0) + 2.0).sqrt());
        let a0_inv = 1.0 / ((a + 1.0) + (a - 1.0) * cos_w0 + 2.0 * (a).sqrt() * alpha);
        self.b0 = a * ((a + 1.0) - (a - 1.0) * cos_w0 + 2.0 * (a).sqrt() * alpha) * a0_inv;
        self.b1 = 2.0 * a * ((a - 1.0) - (a + 1.0) * cos_w0) * a0_inv;
        self.b2 = a * ((a + 1.0) - (a - 1.0) * cos_w0 - 2.0 * (a).sqrt() * alpha) * a0_inv;
        self.a1 = -2.0 * ((a - 1.0) + (a + 1.0) * cos_w0) * a0_inv;
        self.a2 = ((a + 1.0) + (a - 1.0) * cos_w0 - 2.0 * (a).sqrt() * alpha) * a0_inv;
    }

    /// Set high-shelf coefficients.
    fn set_high_shelf(&mut self, freq_hz: f32, gain_db: f32, sr: f32) {
        let a = (10.0_f32).powf(gain_db / 40.0);
        let w0 = 2.0 * core::f32::consts::PI * freq_hz / sr;
        let cos_w0 = (w0).cos();
        let sin_w0 = (w0).sin();
        let alpha = sin_w0 / 2.0 * (((a + 1.0 / a) * (1.0 / 0.707 - 1.0) + 2.0).sqrt());
        let a0_inv = 1.0 / ((a + 1.0) - (a - 1.0) * cos_w0 + 2.0 * (a).sqrt() * alpha);
        self.b0 = a * ((a + 1.0) + (a - 1.0) * cos_w0 + 2.0 * (a).sqrt() * alpha) * a0_inv;
        self.b1 = -2.0 * a * ((a - 1.0) + (a + 1.0) * cos_w0) * a0_inv;
        self.b2 = a * ((a + 1.0) + (a - 1.0) * cos_w0 - 2.0 * (a).sqrt() * alpha) * a0_inv;
        self.a1 = 2.0 * ((a - 1.0) - (a + 1.0) * cos_w0) * a0_inv;
        self.a2 = ((a + 1.0) - (a - 1.0) * cos_w0 - 2.0 * (a).sqrt() * alpha) * a0_inv;
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

impl EqFx {
    pub fn apply_modulation(&mut self, config: &EqParams, mod_values: &[f32]) {
        let v = mod_values[ModDestination::EqGain80 as usize];
        if v != 0.0 {
            self.gains[0] = (config.gain80 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGain240 as usize];
        if v != 0.0 {
            self.gains[1] = (config.gain240 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGain750 as usize];
        if v != 0.0 {
            self.gains[2] = (config.gain750 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGain2200 as usize];
        if v != 0.0 {
            self.gains[3] = (config.gain2200 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGain8000 as usize];
        if v != 0.0 {
            self.gains[4] = (config.gain8000 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
    }
}

// ---------------------------------------------------------------------------
// Module definition and presets
// ---------------------------------------------------------------------------

use crate::{
    fx::{FxControlKindV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1, NO_FX_CONTROL_OPTIONS},
    params::{FxSlotConfig, FxSlotType, SynthParams},
};

const PRESET_OPTIONS: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "bassBoost",
        label: "Bass Boost",
    },
    FxPresetOptionV1 {
        id: "presence",
        label: "Presence",
    },
    FxPresetOptionV1 {
        id: "warmth",
        label: "Warmth",
    },
];

const CONTROLS: [FxControlV1; 5] = [
    FxControlV1 {
        id: "gain80",
        label: "80",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGain80"),
    },
    FxControlV1 {
        id: "gain240",
        label: "240",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGain240"),
    },
    FxControlV1 {
        id: "gain750",
        label: "750",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGain750"),
    },
    FxControlV1 {
        id: "gain2200",
        label: "2.2k",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGain2200"),
    },
    FxControlV1 {
        id: "gain8000",
        label: "8k",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGain8000"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Eq5Band,
    name: "5-Band EQ",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_eq_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Eq5Band(eq) = s {
            Some(eq)
        } else {
            None
        }
    });
    let Some(eq) = slot else {
        return false;
    };
    match preset {
        "bassBoost" => {
            eq.enabled = true;
            eq.gain80 = 6.0;
            eq.gain240 = 3.0;
            eq.gain750 = 0.0;
            eq.gain2200 = -1.0;
            eq.gain8000 = -2.0;
            true
        }
        "presence" => {
            eq.enabled = true;
            eq.gain80 = 0.0;
            eq.gain240 = -2.0;
            eq.gain750 = 0.0;
            eq.gain2200 = 5.0;
            eq.gain8000 = 3.0;
            true
        }
        "warmth" => {
            eq.enabled = true;
            eq.gain80 = 3.0;
            eq.gain240 = 4.0;
            eq.gain750 = 1.0;
            eq.gain2200 = -3.0;
            eq.gain8000 = -5.0;
            true
        }
        _ => false,
    }
}
