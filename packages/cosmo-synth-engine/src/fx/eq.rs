// ---------------------------------------------------------------------------
use crate::params::{EqParams, ModDestination};

// Biquad filter for the 8-band EQ (shelves, peaking)
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

    /// Set low-pass filter coefficients. `q` controls resonance.
    /// Kept for future use (will replace low-shelf band 0).
    #[allow(dead_code)]
    fn set_low_pass(&mut self, freq_hz: f32, q: f32, sr: f32) {
        let w0 = 2.0 * core::f32::consts::PI * freq_hz / sr;
        let cos_w0 = (w0).cos();
        let alpha = (w0).sin() / (2.0 * q);
        let a0_inv = 1.0 / (1.0 + alpha);
        self.b0 = (1.0 - cos_w0) / 2.0 * a0_inv;
        self.b1 = (1.0 - cos_w0) * a0_inv;
        self.b2 = (1.0 - cos_w0) / 2.0 * a0_inv;
        self.a1 = (-2.0 * cos_w0) * a0_inv;
        self.a2 = (1.0 - alpha) * a0_inv;
    }

    /// Set high-pass filter coefficients. `q` controls resonance.
    /// Kept for future use (will replace high-shelf band 7).
    #[allow(dead_code)]
    fn set_high_pass(&mut self, freq_hz: f32, q: f32, sr: f32) {
        let w0 = 2.0 * core::f32::consts::PI * freq_hz / sr;
        let cos_w0 = (w0).cos();
        let alpha = (w0).sin() / (2.0 * q);
        let a0_inv = 1.0 / (1.0 + alpha);
        self.b0 = (1.0 + cos_w0) / 2.0 * a0_inv;
        self.b1 = -(1.0 + cos_w0) * a0_inv;
        self.b2 = (1.0 + cos_w0) / 2.0 * a0_inv;
        self.a1 = (-2.0 * cos_w0) * a0_inv;
        self.a2 = (1.0 - alpha) * a0_inv;
    }

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
// EqFx — 8-band parametric EQ
// Band 0: low-shelf (64 Hz), bands 1-6: peaking, band 7: high-shelf (8 kHz)
// ---------------------------------------------------------------------------

const EQ_FREQS: [f32; 8] = [64.0, 125.0, 250.0, 500.0, 1000.0, 2000.0, 4000.0, 8000.0];

pub struct EqFx {
    filters: [BiquadFilter; 8],
    pub gains: [f32; 8],
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
                BiquadFilter::new(),
                BiquadFilter::new(),
                BiquadFilter::new(),
            ],
            gains: [0.0; 8],
            enabled: false,
            sample_rate: sr,
            dirty: true,
        };
        eq.rebuild_coeffs();
        eq
    }

    pub fn set_gain(&mut self, band: usize, gain_db: f32) {
        if band < 8 {
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
        self.filters[4].set_peaking(EQ_FREQS[4], self.gains[4], 1.0, sr);
        self.filters[5].set_peaking(EQ_FREQS[5], self.gains[5], 1.0, sr);
        self.filters[6].set_peaking(EQ_FREQS[6], self.gains[6], 1.0, sr);
        self.filters[7].set_high_shelf(EQ_FREQS[7], self.gains[7], sr);
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
        let v = mod_values[ModDestination::EqGainBand1 as usize];
        if v != 0.0 {
            self.gains[0] = (config.gain_band1 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGainBand2 as usize];
        if v != 0.0 {
            self.gains[1] = (config.gain_band2 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGainBand3 as usize];
        if v != 0.0 {
            self.gains[2] = (config.gain_band3 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGainBand4 as usize];
        if v != 0.0 {
            self.gains[3] = (config.gain_band4 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGainBand5 as usize];
        if v != 0.0 {
            self.gains[4] = (config.gain_band5 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGainBand6 as usize];
        if v != 0.0 {
            self.gains[5] = (config.gain_band6 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGainBand7 as usize];
        if v != 0.0 {
            self.gains[6] = (config.gain_band7 + v * 24.0).clamp(-12.0, 12.0);
            self.dirty = true;
        }
        let v = mod_values[ModDestination::EqGainBand8 as usize];
        if v != 0.0 {
            self.gains[7] = (config.gain_band8 + v * 24.0).clamp(-12.0, 12.0);
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

const CONTROLS: [FxControlV1; 8] = [
    FxControlV1 {
        id: "gainBand1",
        label: "64",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGainBand1"),
    },
    FxControlV1 {
        id: "gainBand2",
        label: "125",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGainBand2"),
    },
    FxControlV1 {
        id: "gainBand3",
        label: "250",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGainBand3"),
    },
    FxControlV1 {
        id: "gainBand4",
        label: "500",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGainBand4"),
    },
    FxControlV1 {
        id: "gainBand5",
        label: "1k",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGainBand5"),
    },
    FxControlV1 {
        id: "gainBand6",
        label: "2k",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGainBand6"),
    },
    FxControlV1 {
        id: "gainBand7",
        label: "4k",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGainBand7"),
    },
    FxControlV1 {
        id: "gainBand8",
        label: "8k",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-12.0),
        max: Some(12.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("eqGainBand8"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Eq8Band,
    name: "8-Band EQ",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

crate::fx_preset_entry!(pub EqPresetV1, EqParams);

pub const EQ_PRESET_DATA: [EqPresetV1; 3] = [
    EqPresetV1 {
        id: "bassBoost",
        label: "Bass Boost",
        params: EqParams {
            enabled: true,
            gain_band1: 6.0,
            gain_band2: 4.0,
            gain_band3: 2.0,
            gain_band4: 0.0,
            gain_band5: 0.0,
            gain_band6: -1.0,
            gain_band7: -2.0,
            gain_band8: -2.0,
        },
    },
    EqPresetV1 {
        id: "presence",
        label: "Presence",
        params: EqParams {
            enabled: true,
            gain_band1: 0.0,
            gain_band2: -2.0,
            gain_band3: -1.0,
            gain_band4: 0.0,
            gain_band5: 2.0,
            gain_band6: 5.0,
            gain_band7: 4.0,
            gain_band8: 3.0,
        },
    },
    EqPresetV1 {
        id: "warmth",
        label: "Warmth",
        params: EqParams {
            enabled: true,
            gain_band1: 3.0,
            gain_band2: 4.0,
            gain_band3: 3.0,
            gain_band4: 1.0,
            gain_band5: 0.0,
            gain_band6: -2.0,
            gain_band7: -4.0,
            gain_band8: -5.0,
        },
    },
];

pub fn eq_preset_data() -> &'static [EqPresetV1] {
    &EQ_PRESET_DATA
}

pub fn apply_eq_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = EQ_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Eq8Band(eq) = s {
            Some(eq)
        } else {
            None
        }
    });
    if let Some(eq) = slot {
        *eq = p.params.clone();
        true
    } else {
        false
    }
}
