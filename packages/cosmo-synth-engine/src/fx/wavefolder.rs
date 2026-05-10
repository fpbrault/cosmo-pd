use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// WavefolderFx — waveshaping / folding
// ---------------------------------------------------------------------------

pub struct WavefolderFx {
    pub enabled: bool,
    pub drive: f32, // 0..1 → input gain before folding (1..8x)
    pub folds: f32, // 0..1 → fold threshold (controls number of folds)
    pub mix: f32,
}

impl Default for WavefolderFx {
    fn default() -> Self {
        Self::new()
    }
}

impl WavefolderFx {
    pub fn new() -> Self {
        Self {
            enabled: false,
            drive: 0.5,
            folds: 0.5,
            mix: 1.0,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let gain = 1.0 + self.drive * 7.0;
        let driven = sample * gain;

        // Fold threshold maps 0..1 → 0.3..1.0 (lower = more folding)
        let threshold = 1.0 - self.folds * 0.7;

        // Iterative folding: reflect signal at threshold
        let wet = fold(driven, threshold);

        // Normalize output to compensate for gain
        let normalized = wet / gain.max(1.0);

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + normalized * sinf(mix_angle)
    }
}

/// Reflect signal between [-threshold, threshold], folding iteratively.
fn fold(mut x: f32, threshold: f32) -> f32 {
    if threshold <= 0.0 {
        return 0.0;
    }
    let mut iterations = 0;
    loop {
        if libm::fabsf(x) <= threshold {
            break;
        }
        if x > threshold {
            x = 2.0 * threshold - x;
        } else {
            x = -2.0 * threshold - x;
        }
        iterations += 1;
        if iterations >= 8 {
            break;
        }
    }
    x
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
        id: "aggressive",
        label: "Aggressive",
    },
    FxPresetOptionV1 {
        id: "harmonic",
        label: "Harmonic",
    },
];

const CONTROLS: [FxControlV1; 3] = [
    FxControlV1 {
        id: "drive",
        label: "Drive",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("wavefolderDrive"),
    },
    FxControlV1 {
        id: "folds",
        label: "Folds",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("wavefolderFolds"),
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
        mod_destination_key: Some("wavefolderMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Wavefolder,
    name: "Wavefolder",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_wavefolder_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Wavefolder(wf) = s {
            Some(wf)
        } else {
            None
        }
    });
    let Some(wf) = slot else {
        return false;
    };
    match preset {
        "gentle" => {
            wf.enabled = true;
            wf.drive = 0.3;
            wf.folds = 0.3;
            wf.mix = 0.8;
            true
        }
        "aggressive" => {
            wf.enabled = true;
            wf.drive = 0.75;
            wf.folds = 0.7;
            wf.mix = 1.0;
            true
        }
        "harmonic" => {
            wf.enabled = true;
            wf.drive = 0.5;
            wf.folds = 0.5;
            wf.mix = 0.9;
            true
        }
        _ => false,
    }
}
