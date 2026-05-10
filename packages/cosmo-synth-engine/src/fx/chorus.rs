use libm::{cosf, sinf};

use super::delay_line::DelayLine;
use crate::dsp_utils::TWO_PI;

const SMOOTH_COEFF: f32 = 0.005;

// ---------------------------------------------------------------------------
// ChorusFx
// ---------------------------------------------------------------------------

pub struct ChorusFx {
    delay: DelayLine,
    phase: f32,
    pub rate: f32,
    pub depth: f32,
    pub mix: f32,
    pub enabled: bool,
    smooth_depth: f32,
    sample_rate: f32,
}

impl ChorusFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = libm::roundf(0.05 * sr) as usize + 2;
        Self {
            delay: DelayLine::new(buf_len),
            phase: 0.0,
            rate: 0.8,
            depth: 0.003,
            mix: 0.0,
            enabled: false,
            smooth_depth: 0.003,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        self.smooth_depth =
            (self.smooth_depth + (self.depth - self.smooth_depth) * SMOOTH_COEFF) / 10.0;
        self.phase += self.rate / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }
        let mod_val = sinf(TWO_PI * self.phase);
        let delay_samples = (0.005 + self.smooth_depth * (mod_val + 1.0)) * self.sample_rate;
        let delay_samples = delay_samples.max(1.0);
        let wet = self.delay.read_at_fractional(delay_samples);
        self.delay.write(sample);
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        let dry_gain = cosf(mix_angle);
        let wet_gain = sinf(mix_angle);
        sample * dry_gain + wet * wet_gain
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
        id: "classicWide",
        label: "Classic Wide",
    },
    FxPresetOptionV1 {
        id: "slowShimmer",
        label: "Slow Shimmer",
    },
    FxPresetOptionV1 {
        id: "ensembleThick",
        label: "Ensemble Thick",
    },
];

const CONTROLS: [FxControlV1; 3] = [
    FxControlV1 {
        id: "rate",
        label: "Rate",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.1),
        max: Some(10.0),
        default_f32: Some(0.8),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("chorusRate"),
    },
    FxControlV1 {
        id: "depth",
        label: "Depth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(5.0),
        default_f32: Some(0.003),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("chorusDepth"),
    },
    FxControlV1 {
        id: "mix",
        label: "Mix",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("chorusMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Chorus,
    name: "Chorus",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_chorus_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Chorus(c) = s {
            Some(c)
        } else {
            None
        }
    });
    let Some(c) = slot else {
        return false;
    };

    match preset {
        "classicWide" => {
            c.enabled = true;
            c.rate = 0.9;
            c.depth = 1.2;
            c.mix = 0.38;
            true
        }
        "slowShimmer" => {
            c.enabled = true;
            c.rate = 0.35;
            c.depth = 2.1;
            c.mix = 0.44;
            true
        }
        "ensembleThick" => {
            c.enabled = true;
            c.rate = 1.8;
            c.depth = 2.6;
            c.mix = 0.56;
            true
        }
        _ => false,
    }
}
