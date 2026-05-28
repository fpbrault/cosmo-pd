// ---------------------------------------------------------------------------
use crate::params::{CompressorParams, ModDestination};

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
        let attack_coeff = (-1.0 / (self.attack_ms * 0.001 * self.sample_rate).max(1.0)).exp();
        let release_coeff = (-1.0 / (self.release_ms * 0.001 * self.sample_rate).max(1.0)).exp();

        let abs_sample = (sample).abs();
        if abs_sample > self.envelope {
            self.envelope = attack_coeff * self.envelope + (1.0 - attack_coeff) * abs_sample;
        } else {
            self.envelope *= release_coeff;
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
        sample * (mix_angle).cos() + wet * (mix_angle).sin()
    }
}

#[inline]
fn db_to_linear(db: f32) -> f32 {
    (10.0_f32).powf(db / 20.0)
}

#[inline]
fn linear_to_db(linear: f32) -> f32 {
    20.0 * (linear.max(1e-9).log10())
}

impl CompressorFx {
    pub fn apply_modulation(&mut self, config: &CompressorParams, mod_values: &[f32]) {
        let threshold = mod_values[ModDestination::CompressorThreshold as usize];
        if threshold != 0.0 {
            self.threshold_db = (config.threshold_db + threshold * 30.0).clamp(-60.0, 0.0);
        }
        let ratio = mod_values[ModDestination::CompressorRatio as usize];
        if ratio != 0.0 {
            self.ratio = (config.ratio + ratio * 50.0).clamp(1.0, 50.0);
        }
        let makeup = mod_values[ModDestination::CompressorMakeup as usize];
        if makeup != 0.0 {
            self.makeup_db = (config.makeup_db + makeup * 20.0).clamp(0.0, 20.0);
        }
        let mix = mod_values[ModDestination::CompressorMix as usize];
        if mix != 0.0 {
            self.mix = (config.mix + mix).clamp(0.0, 1.0);
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
        id: "gentle",
        label: "Gentle",
    },
    FxPresetOptionV1 {
        id: "punchy",
        label: "Punchy",
    },
    FxPresetOptionV1 {
        id: "limiter",
        label: "Limiter",
    },
];

const CONTROLS: [FxControlV1; 6] = [
    FxControlV1 {
        id: "thresholdDb",
        label: "Threshold",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(-60.0),
        max: Some(0.0),
        default_f32: Some(-12.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("compressorThreshold"),
    },
    FxControlV1 {
        id: "ratio",
        label: "Ratio",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(1.0),
        max: Some(20.0),
        default_f32: Some(4.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("compressorRatio"),
    },
    FxControlV1 {
        id: "attackMs",
        label: "Attack",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.1),
        max: Some(200.0),
        default_f32: Some(5.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "releaseMs",
        label: "Release",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(10.0),
        max: Some(2000.0),
        default_f32: Some(100.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "makeupDb",
        label: "Makeup",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(24.0),
        default_f32: Some(6.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("compressorMakeup"),
    },
    FxControlV1 {
        id: "mix",
        label: "Mix",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(1.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("compressorMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Compressor,
    name: "Compressor",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

crate::fx_preset_entry!(pub CompressorPresetV1, CompressorParams);

pub const COMPRESSOR_PRESET_DATA: [CompressorPresetV1; 3] = [
    CompressorPresetV1 {
        id: "gentle",
        label: "Gentle",
        params: CompressorParams {
            enabled: true,
            threshold_db: -18.0,
            ratio: 2.0,
            attack_ms: 10.0,
            release_ms: 150.0,
            makeup_db: 3.0,
            mix: 1.0,
        },
    },
    CompressorPresetV1 {
        id: "punchy",
        label: "Punchy",
        params: CompressorParams {
            enabled: true,
            threshold_db: -12.0,
            ratio: 4.0,
            attack_ms: 5.0,
            release_ms: 80.0,
            makeup_db: 6.0,
            mix: 1.0,
        },
    },
    CompressorPresetV1 {
        id: "limiter",
        label: "Limiter",
        params: CompressorParams {
            enabled: true,
            threshold_db: -6.0,
            ratio: 20.0,
            attack_ms: 1.0,
            release_ms: 200.0,
            makeup_db: 2.0,
            mix: 1.0,
        },
    },
];

pub fn compressor_preset_data() -> &'static [CompressorPresetV1] {
    &COMPRESSOR_PRESET_DATA
}

pub fn apply_compressor_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = COMPRESSOR_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Compressor(c) = s {
            Some(c)
        } else {
            None
        }
    });
    if let Some(c) = slot {
        *c = p.params.clone();
        true
    } else {
        false
    }
}
