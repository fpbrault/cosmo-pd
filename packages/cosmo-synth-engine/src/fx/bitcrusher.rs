use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// BitcrusherFx — bit depth reduction + sample rate reduction
// ---------------------------------------------------------------------------

pub struct BitcrusherFx {
    pub enabled: bool,
    pub bits: f32,           // 1..16 bit depth
    pub rate_reduction: f32, // 1..32 sample rate divisor
    pub mix: f32,
    hold_counter: f32,
    hold_value: f32,
}

impl BitcrusherFx {
    pub fn new() -> Self {
        Self {
            enabled: false,
            bits: 8.0,
            rate_reduction: 1.0,
            mix: 1.0,
            hold_counter: 0.0,
            hold_value: 0.0,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        // Sample rate reduction
        self.hold_counter += 1.0;
        let divisor = self.rate_reduction.max(1.0);
        if self.hold_counter >= divisor {
            self.hold_counter -= divisor;
            // Bit reduction
            let levels = libm::powf(2.0, self.bits.clamp(1.0, 16.0));
            self.hold_value = libm::roundf(sample * levels) / levels;
        }

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + self.hold_value * sinf(mix_angle)
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
        id: "retroGame",
        label: "Retro Game",
    },
    FxPresetOptionV1 {
        id: "grunge",
        label: "Grunge",
    },
    FxPresetOptionV1 {
        id: "subtle",
        label: "Subtle",
    },
];

const CONTROLS: [FxControlV1; 3] = [
    FxControlV1 {
        id: "bits",
        label: "Bits",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(1.0),
        max: Some(16.0),
        default_f32: Some(8.0),
        options: &NO_FX_CONTROL_OPTIONS,
    },
    FxControlV1 {
        id: "rateReduction",
        label: "Rate",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(1.0),
        max: Some(32.0),
        default_f32: Some(1.0),
        options: &NO_FX_CONTROL_OPTIONS,
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
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Bitcrusher,
    name: "Bitcrusher",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_bitcrusher_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Bitcrusher(bc) = s {
            Some(bc)
        } else {
            None
        }
    });
    let Some(bc) = slot else {
        return false;
    };
    match preset {
        "retroGame" => {
            bc.enabled = true;
            bc.bits = 8.0;
            bc.rate_reduction = 4.0;
            bc.mix = 1.0;
            true
        }
        "grunge" => {
            bc.enabled = true;
            bc.bits = 4.0;
            bc.rate_reduction = 2.0;
            bc.mix = 0.8;
            true
        }
        "subtle" => {
            bc.enabled = true;
            bc.bits = 12.0;
            bc.rate_reduction = 1.5;
            bc.mix = 0.6;
            true
        }
        _ => false,
    }
}
