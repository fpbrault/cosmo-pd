use libm::{cosf, sinf};

use super::delay_line::DelayLine;
use crate::params::ModDestination;

// ---------------------------------------------------------------------------
// FlangerFx — short modulated delay with feedback and through-zero option
// ---------------------------------------------------------------------------

pub struct FlangerFx {
    delay: DelayLine,
    phase: f32,
    feedback_sample: f32,
    pub enabled: bool,
    pub rate: f32,
    pub depth: f32,
    pub delay_ms: f32,
    pub feedback: f32,
    pub through_zero: bool,
    pub mix: f32,
    sample_rate: f32,
}

impl FlangerFx {
    pub fn new(sr: f32) -> Self {
        let length = libm::roundf(0.03 * sr) as usize + 4;
        Self {
            delay: DelayLine::new(length),
            phase: 0.0,
            feedback_sample: 0.0,
            enabled: false,
            rate: 0.25,
            depth: 0.45,
            delay_ms: 2.0,
            feedback: 0.2,
            through_zero: false,
            mix: 0.5,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        self.phase += self.rate.clamp(0.01, 10.0) / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }

        let lfo = sinf(self.phase * core::f32::consts::PI * 2.0);
        let base_delay = (self.delay_ms.clamp(0.1, 10.0) * 0.001) * self.sample_rate;
        let depth_samples = (self.depth.clamp(0.0, 1.0) * 0.005) * self.sample_rate;

        let delay_samples = if self.through_zero {
            (base_delay + lfo * depth_samples).abs().max(1.0)
        } else {
            (base_delay + (lfo * 0.5 + 0.5) * depth_samples).max(1.0)
        };

        let wet = self.delay.read_at_fractional(delay_samples);
        let fb = self.feedback.clamp(-0.95, 0.95);
        let input = sample + self.feedback_sample * fb;
        self.delay.write(input);
        self.feedback_sample = wet;

        let mix_angle = self.mix.clamp(0.0, 1.0) * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
    }

    pub fn apply_modulation(&mut self, config: &crate::params::FlangerParams, mod_values: &[f32]) {
        let rate = mod_values[ModDestination::FlangerRate as usize];
        self.rate = (config.rate + rate).clamp(0.01, 10.0);
        let depth = mod_values[ModDestination::FlangerDepth as usize];
        self.depth = (config.depth + depth).clamp(0.0, 1.0);
        let delay_ms = mod_values[ModDestination::FlangerDelayMs as usize];
        self.delay_ms = (config.delay_ms + delay_ms).clamp(0.1, 10.0);
        let feedback = mod_values[ModDestination::FlangerFeedback as usize];
        self.feedback = (config.feedback + feedback).clamp(-0.95, 0.95);
        let mix = mod_values[ModDestination::FlangerMix as usize];
        self.mix = (config.mix + mix).clamp(0.0, 1.0);
    }
}

// ---------------------------------------------------------------------------
// Module definition and presets
// ---------------------------------------------------------------------------

use crate::{
    fx::{
        FxControlKindV1, FxControlOptionV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1,
        NO_FX_CONTROL_OPTIONS,
    },
    params::{FxSlotConfig, FxSlotType, SynthParams},
};

const PRESET_OPTIONS: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "softSweep",
        label: "Soft Sweep",
    },
    FxPresetOptionV1 {
        id: "jetPlane",
        label: "Jet Plane",
    },
    FxPresetOptionV1 {
        id: "throughZero",
        label: "Through-Zero",
    },
];

const THROUGH_ZERO_OPTIONS: [FxControlOptionV1; 2] = [
    FxControlOptionV1 {
        value: 0,
        label: "Off",
        icon_name: None,
    },
    FxControlOptionV1 {
        value: 1,
        label: "On",
        icon_name: None,
    },
];

const CONTROLS: [FxControlV1; 6] = [
    FxControlV1 {
        id: "rate",
        label: "Rate",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.01),
        max: Some(10.0),
        default_f32: Some(0.25),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("flangerRate"),
    },
    FxControlV1 {
        id: "depth",
        label: "Depth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.45),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("flangerDepth"),
    },
    FxControlV1 {
        id: "delayMs",
        label: "Delay",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.1),
        max: Some(10.0),
        default_f32: Some(2.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("flangerDelayMs"),
    },
    FxControlV1 {
        id: "feedback",
        label: "Feedback",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-0.95),
        max: Some(0.95),
        default_f32: Some(0.2),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("flangerFeedback"),
    },
    FxControlV1 {
        id: "throughZero",
        label: "TZ",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &THROUGH_ZERO_OPTIONS,
        mod_destination_key: None,
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
        mod_destination_key: Some("flangerMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Flanger,
    name: "Flanger",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_flanger_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Flanger(flanger) = s {
            Some(flanger)
        } else {
            None
        }
    });
    let Some(flanger) = slot else {
        return false;
    };

    match preset {
        "softSweep" => {
            flanger.enabled = true;
            flanger.rate = 0.2;
            flanger.depth = 0.35;
            flanger.delay_ms = 2.8;
            flanger.feedback = 0.18;
            flanger.through_zero = false;
            flanger.mix = 0.42;
            true
        }
        "jetPlane" => {
            flanger.enabled = true;
            flanger.rate = 0.45;
            flanger.depth = 0.78;
            flanger.delay_ms = 1.2;
            flanger.feedback = 0.62;
            flanger.through_zero = false;
            flanger.mix = 0.55;
            true
        }
        "throughZero" => {
            flanger.enabled = true;
            flanger.rate = 0.33;
            flanger.depth = 0.7;
            flanger.delay_ms = 0.8;
            flanger.feedback = 0.36;
            flanger.through_zero = true;
            flanger.mix = 0.58;
            true
        }
        _ => false,
    }
}
