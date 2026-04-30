use crate::params::{FxSlotConfig, PhaseModParams, SynthParams};

fn set_phase_mod(params: &mut SynthParams, p: PhaseModParams) {
    for slot in params.fx_slots.iter_mut() {
        if let FxSlotConfig::PhaseMod(pm) = slot {
            *pm = p;
            return;
        }
    }
}

pub fn apply_phase_mod_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "glassBell" => {
            set_phase_mod(
                params,
                PhaseModParams {
                    enabled: true,
                    amount: 0.06,
                    ratio: 2.0,
                    pm_pre: true,
                },
            );
            true
        }
        "metalFold" => {
            set_phase_mod(
                params,
                PhaseModParams {
                    enabled: true,
                    amount: 0.11,
                    ratio: 2.7,
                    pm_pre: true,
                },
            );
            true
        }
        "aggressiveSync" => {
            set_phase_mod(
                params,
                PhaseModParams {
                    enabled: true,
                    amount: 0.18,
                    ratio: 3.4,
                    pm_pre: false,
                },
            );
            true
        }
        _ => false,
    }
}

// ---------------------------------------------------------------------------
// Module definition
// ---------------------------------------------------------------------------

use crate::fx::{
    FxControlKindV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1, NO_FX_CONTROL_OPTIONS,
};
use crate::params::FxSlotType;

const PRESET_OPTIONS: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "glassBell",
        label: "Glass Bell",
    },
    FxPresetOptionV1 {
        id: "metalFold",
        label: "Metal Fold",
    },
    FxPresetOptionV1 {
        id: "aggressiveSync",
        label: "Aggressive Sync",
    },
];

const CONTROLS: [FxControlV1; 3] = [
    FxControlV1 {
        id: "intPmAmount",
        label: "Amount",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(0.5),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("intPmAmount"),
    },
    FxControlV1 {
        id: "intPmRatio",
        label: "Ratio",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.5),
        max: Some(8.0),
        default_f32: Some(2.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("intPmRatio"),
    },
    FxControlV1 {
        id: "pmPre",
        label: "Pre",
        kind: FxControlKindV1::Toggle,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(1.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: None,
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::PhaseMod,
    name: "Phase Mod",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};
