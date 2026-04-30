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

pub fn apply_phaser_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Phaser(p) = s {
            Some(p)
        } else {
            None
        }
    });
    let Some(p) = slot else {
        return false;
    };

    match preset {
        "gentleSweep" => {
            p.enabled = true;
            p.rate = 0.35;
            p.depth = 0.45;
            p.feedback = 0.2;
            p.mix = 0.25;
            true
        }
        "jetWash" => {
            p.enabled = true;
            p.rate = 0.9;
            p.depth = 0.78;
            p.feedback = 0.55;
            p.mix = 0.43;
            true
        }
        "wideNotch" => {
            p.enabled = true;
            p.rate = 0.18;
            p.depth = 1.0;
            p.feedback = 0.72;
            p.mix = 0.52;
            true
        }
        _ => false,
    }
}
