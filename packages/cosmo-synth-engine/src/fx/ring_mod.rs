
// ---------------------------------------------------------------------------
// RingModFx — ring modulation with configurable carrier frequency
// ---------------------------------------------------------------------------

pub struct RingModFx {
    pub enabled: bool,
    pub carrier_hz: f32, // 20..2000 Hz
    pub mix: f32,
    phase: f32,
    sample_rate: f32,
}

impl RingModFx {
    pub fn new(sr: f32) -> Self {
        Self {
            enabled: false,
            carrier_hz: 440.0,
            mix: 1.0,
            phase: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        self.phase += self.carrier_hz / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }
        let carrier = (self.phase * core::f32::consts::PI * 2.0).sin();
        let wet = sample * carrier;
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * (mix_angle).cos() + wet * (mix_angle).sin()
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
        id: "metallic",
        label: "Metallic",
    },
    FxPresetOptionV1 {
        id: "bell",
        label: "Bell",
    },
    FxPresetOptionV1 {
        id: "alien",
        label: "Alien",
    },
];

const CONTROLS: [FxControlV1; 2] = [
    FxControlV1 {
        id: "carrierHz",
        label: "Freq",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(20.0),
        max: Some(4000.0),
        default_f32: Some(440.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("ringModCarrierHz"),
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
        mod_destination_key: Some("ringModMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::RingMod,
    name: "Ring Mod",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_ring_mod_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::RingMod(rm) = s {
            Some(rm)
        } else {
            None
        }
    });
    let Some(rm) = slot else {
        return false;
    };
    match preset {
        "metallic" => {
            rm.enabled = true;
            rm.carrier_hz = 220.0;
            rm.mix = 0.7;
            true
        }
        "bell" => {
            rm.enabled = true;
            rm.carrier_hz = 523.0;
            rm.mix = 0.5;
            true
        }
        "alien" => {
            rm.enabled = true;
            rm.carrier_hz = 1337.0;
            rm.mix = 0.85;
            true
        }
        _ => false,
    }
}
