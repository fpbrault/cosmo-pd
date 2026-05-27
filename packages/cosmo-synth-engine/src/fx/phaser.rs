use crate::dsp_utils::TWO_PI;
use crate::params::{ModDestination, PhaserParams};

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
        let lfo = (TWO_PI * self.phase).sin();
        let min_freq = 100.0_f32;
        let max_freq = 2000.0_f32;
        let depth_clamped = self.depth.clamp(0.0, 1.0);
        let center_freq = min_freq + (max_freq - min_freq) * 0.5 * (1.0 + lfo * depth_clamped);
        let g = (core::f32::consts::PI * center_freq / self.sample_rate).tan();
        let a = (g - 1.0) / (g + 1.0);
        let fb = self.feedback.clamp(-0.9, 0.9);
        let input_with_fb = sample + self.feedback_buf * fb;
        let mut out = input_with_fb;
        for stage in &mut self.stages {
            out = stage.process(out, a);
        }
        self.feedback_buf = out;
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        let dry_gain = (mix_angle).cos();
        let wet_gain = (mix_angle).sin();
        sample * dry_gain + out * wet_gain
    }
}

impl PhaserFx {
    pub fn apply_modulation(&mut self, config: &PhaserParams, mod_values: &[f32]) {
        let rate = mod_values[ModDestination::PhaserRate as usize];
        if rate != 0.0 {
            self.rate = (config.rate + rate * 15.0).clamp(0.05, 20.0);
        }
        let depth = mod_values[ModDestination::PhaserDepth as usize];
        if depth != 0.0 {
            self.depth = (config.depth + depth).clamp(0.0, 1.0);
        }
        let feedback = mod_values[ModDestination::PhaserFeedback as usize];
        if feedback != 0.0 {
            self.feedback = (config.feedback + feedback).clamp(0.0, 0.98);
        }
        let mix = mod_values[ModDestination::PhaserMix as usize];
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
        id: "gentleSweep",
        label: "Gentle Sweep",
    },
    FxPresetOptionV1 {
        id: "jetWash",
        label: "Jet Wash",
    },
    FxPresetOptionV1 {
        id: "wideNotch",
        label: "Wide Notch",
    },
];

const CONTROLS: [FxControlV1; 4] = [
    FxControlV1 {
        id: "rate",
        label: "Rate",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.1),
        max: Some(10.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("phaserRate"),
    },
    FxControlV1 {
        id: "depth",
        label: "Depth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(1.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("phaserDepth"),
    },
    FxControlV1 {
        id: "feedback",
        label: "Feedback",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(-0.9),
        max: Some(0.9),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("phaserFeedback"),
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
        mod_destination_key: Some("phaserMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Phaser,
    name: "Phaser",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

crate::fx_preset_entry!(pub PhaserPresetV1, PhaserParams);

pub const PHASER_PRESET_DATA: [PhaserPresetV1; 3] = [
    PhaserPresetV1 {
        id: "gentleSweep",
        label: "Gentle Sweep",
        params: PhaserParams {
            enabled: true,
            rate: 0.35,
            depth: 0.45,
            feedback: 0.2,
            mix: 0.25,
        },
    },
    PhaserPresetV1 {
        id: "jetWash",
        label: "Jet Wash",
        params: PhaserParams {
            enabled: true,
            rate: 0.9,
            depth: 0.78,
            feedback: 0.55,
            mix: 0.43,
        },
    },
    PhaserPresetV1 {
        id: "wideNotch",
        label: "Wide Notch",
        params: PhaserParams {
            enabled: true,
            rate: 0.18,
            depth: 1.0,
            feedback: 0.72,
            mix: 0.52,
        },
    },
];

pub fn phaser_preset_data() -> &'static [PhaserPresetV1] {
    &PHASER_PRESET_DATA
}

pub fn apply_phaser_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(entry) = PHASER_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Phaser(p) = s {
            Some(p)
        } else {
            None
        }
    });
    if let Some(p) = slot {
        *p = entry.params.clone();
        true
    } else {
        false
    }
}
