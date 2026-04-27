use crate::params::SynthParams;

pub fn apply_phase_mod_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "glassBell" => {
            params.int_pm_enabled = true;
            params.pm_pre = true;
            params.int_pm_amount = 0.06;
            params.int_pm_ratio = 2.0;
            true
        }
        "metalFold" => {
            params.int_pm_enabled = true;
            params.pm_pre = true;
            params.int_pm_amount = 0.11;
            params.int_pm_ratio = 2.7;
            true
        }
        "aggressiveSync" => {
            params.int_pm_enabled = true;
            params.pm_pre = false;
            params.int_pm_amount = 0.18;
            params.int_pm_ratio = 3.4;
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
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::PhaseMod,
    name: "Phase Mod",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};
