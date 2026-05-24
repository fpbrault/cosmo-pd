use libm::{cosf, sinf};

use super::delay_line::DelayLine;

// ---------------------------------------------------------------------------
// StereoWidenerFx — mono-compatible pseudo-width enhancer using decorrelated
// short delay content.
// ---------------------------------------------------------------------------

pub struct StereoWidenerFx {
    delay: DelayLine,
    hp_state: f32,
    pub enabled: bool,
    pub width: f32,
    pub delay_ms: f32,
    pub tone: f32,
    pub mix: f32,
    sample_rate: f32,
}

impl StereoWidenerFx {
    pub fn new(sr: f32) -> Self {
        let length = libm::roundf(0.05 * sr) as usize + 4;
        Self {
            delay: DelayLine::new(length),
            hp_state: 0.0,
            enabled: false,
            width: 0.55,
            delay_ms: 12.0,
            tone: 0.5,
            mix: 0.5,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let delay_samples = (self.delay_ms.clamp(1.0, 30.0) * 0.001 * self.sample_rate).max(1.0);
        let delayed = self.delay.read_at_fractional(delay_samples);
        self.delay.write(sample);

        // Simple DC-safe high-passed decorrelated component.
        let hp_coeff = 0.995;
        self.hp_state = delayed - sample + hp_coeff * self.hp_state;
        let decorrelated = self.hp_state;

        let width = self.width.clamp(0.0, 1.0);
        let tone = self.tone.clamp(0.0, 1.0);
        let wet = sample + decorrelated * width * (0.35 + tone * 0.85);

        let mix_angle = self.mix.clamp(0.0, 1.0) * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
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
        id: "subtleSpread",
        label: "Subtle Spread",
    },
    FxPresetOptionV1 {
        id: "widePad",
        label: "Wide Pad",
    },
    FxPresetOptionV1 {
        id: "haasPush",
        label: "Haas Push",
    },
];

const CONTROLS: [FxControlV1; 4] = [
    FxControlV1 {
        id: "width",
        label: "Width",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.55),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("stereoWidenerWidth"),
    },
    FxControlV1 {
        id: "delayMs",
        label: "Delay",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(1.0),
        max: Some(30.0),
        default_f32: Some(12.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("stereoWidenerDelayMs"),
    },
    FxControlV1 {
        id: "tone",
        label: "Tone",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("stereoWidenerTone"),
    },
    FxControlV1 {
        id: "mix",
        label: "Mix",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("stereoWidenerMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::StereoWidener,
    name: "Stereo Widener",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_stereo_widener_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::StereoWidener(widener) = s {
            Some(widener)
        } else {
            None
        }
    });
    let Some(widener) = slot else {
        return false;
    };

    match preset {
        "subtleSpread" => {
            widener.enabled = true;
            widener.width = 0.35;
            widener.delay_ms = 9.0;
            widener.tone = 0.45;
            widener.mix = 0.45;
            true
        }
        "widePad" => {
            widener.enabled = true;
            widener.width = 0.72;
            widener.delay_ms = 14.0;
            widener.tone = 0.62;
            widener.mix = 0.62;
            true
        }
        "haasPush" => {
            widener.enabled = true;
            widener.width = 0.9;
            widener.delay_ms = 22.0;
            widener.tone = 0.72;
            widener.mix = 0.7;
            true
        }
        _ => false,
    }
}
