use crate::params::SynthParams;

pub fn apply_vibrato_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "subtle" => {
            params.vibrato.enabled = true;
            params.vibrato.waveform = 1;
            params.vibrato.rate = 20.0;
            params.vibrato.depth = 6.0;
            params.vibrato.delay = 160.0;
            true
        }
        "chorused" => {
            params.vibrato.enabled = true;
            params.vibrato.waveform = 2;
            params.vibrato.rate = 38.0;
            params.vibrato.depth = 14.0;
            params.vibrato.delay = 80.0;
            true
        }
        "warble" => {
            params.vibrato.enabled = true;
            params.vibrato.waveform = 4;
            params.vibrato.rate = 62.0;
            params.vibrato.depth = 26.0;
            params.vibrato.delay = 20.0;
            true
        }
        _ => false,
    }
}

// ---------------------------------------------------------------------------
// Module definition
// ---------------------------------------------------------------------------

use crate::fx::{
    FxControlKindV1, FxControlOptionV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1,
    NO_FX_CONTROL_OPTIONS,
};
use crate::params::FxSlotType;

const PRESET_OPTIONS: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "subtle",
        label: "Subtle",
    },
    FxPresetOptionV1 {
        id: "chorused",
        label: "Chorused",
    },
    FxPresetOptionV1 {
        id: "warble",
        label: "Warble",
    },
];

const WAVEFORM_OPTIONS: [FxControlOptionV1; 4] = [
    FxControlOptionV1 {
        value: 1,
        label: "Sine",
        icon_name: Some("waveSine"),
    },
    FxControlOptionV1 {
        value: 2,
        label: "Tri",
        icon_name: Some("waveTriangle"),
    },
    FxControlOptionV1 {
        value: 3,
        label: "Sq",
        icon_name: Some("waveSquare"),
    },
    FxControlOptionV1 {
        value: 4,
        label: "Saw",
        icon_name: Some("waveSawtooth"),
    },
];

const CONTROLS: [FxControlV1; 4] = [
    FxControlV1 {
        id: "waveform",
        label: "Wave",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(1.0),
        options: &WAVEFORM_OPTIONS,
    },
    FxControlV1 {
        id: "rate",
        label: "Rate",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(1.0),
        max: Some(200.0),
        default_f32: Some(55.0),
        options: &NO_FX_CONTROL_OPTIONS,
    },
    FxControlV1 {
        id: "depth",
        label: "Depth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(50.0),
        default_f32: Some(8.0),
        options: &NO_FX_CONTROL_OPTIONS,
    },
    FxControlV1 {
        id: "delay",
        label: "Delay",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(500.0),
        default_f32: Some(120.0),
        options: &NO_FX_CONTROL_OPTIONS,
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Vibrato,
    name: "Vibrato",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};
