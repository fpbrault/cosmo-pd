// ---------------------------------------------------------------------------
use crate::params::{BitcrusherParams, ModDestination};

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

impl Default for BitcrusherFx {
    fn default() -> Self {
        Self::new()
    }
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
            let levels = (2.0_f32).powf(self.bits.clamp(1.0, 16.0));
            self.hold_value = (sample * levels).round() / levels;
        }

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * (mix_angle).cos() + self.hold_value * (mix_angle).sin()
    }
}

impl BitcrusherFx {
    pub fn apply_modulation(&mut self, config: &BitcrusherParams, mod_values: &[f32]) {
        let bits = mod_values[ModDestination::BitcrusherBits as usize];
        if bits != 0.0 {
            self.bits = (config.bits + bits * 16.0).clamp(1.0, 16.0);
        }
        let rate = mod_values[ModDestination::BitcrusherRateReduction as usize];
        if rate != 0.0 {
            self.rate_reduction = (config.rate_reduction + rate).clamp(1.0, 32.0);
        }
        let mix = mod_values[ModDestination::BitcrusherMix as usize];
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
        mod_destination_key: Some("bitcrusherBits"),
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
        mod_destination_key: Some("bitcrusherRateReduction"),
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
        mod_destination_key: Some("bitcrusherMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Bitcrusher,
    name: "Bitcrusher",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

crate::fx_preset_entry!(pub BitcrusherPresetV1, BitcrusherParams);

pub const BITCRUSHER_PRESET_DATA: [BitcrusherPresetV1; 3] = [
    BitcrusherPresetV1 {
        id: "retroGame",
        label: "Retro Game",
        params: BitcrusherParams {
            enabled: true,
            bits: 8.0,
            rate_reduction: 4.0,
            mix: 1.0,
        },
    },
    BitcrusherPresetV1 {
        id: "grunge",
        label: "Grunge",
        params: BitcrusherParams {
            enabled: true,
            bits: 4.0,
            rate_reduction: 2.0,
            mix: 0.8,
        },
    },
    BitcrusherPresetV1 {
        id: "subtle",
        label: "Subtle",
        params: BitcrusherParams {
            enabled: true,
            bits: 12.0,
            rate_reduction: 1.5,
            mix: 0.6,
        },
    },
];

pub fn bitcrusher_preset_data() -> &'static [BitcrusherPresetV1] {
    &BITCRUSHER_PRESET_DATA
}

pub fn apply_bitcrusher_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = BITCRUSHER_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Bitcrusher(bc) = s {
            Some(bc)
        } else {
            None
        }
    });
    if let Some(bc) = slot {
        *bc = p.params.clone();
        true
    } else {
        false
    }
}
