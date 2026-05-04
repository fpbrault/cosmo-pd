use crate::params::{FxSlotConfig, SynthParams, VibratoParams};

fn set_vibrato(params: &mut SynthParams, p: VibratoParams) {
    for slot in params.fx_slots.iter_mut() {
        if let FxSlotConfig::Vibrato(vib) = slot {
            *vib = p;
            return;
        }
    }
}

pub fn apply_vibrato_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "subtle" => {
            set_vibrato(
                params,
                VibratoParams {
                    enabled: true,
                    waveform: 1,
                    rate: 20.0,
                    depth: 6.0,
                    delay: 160.0,
                },
            );
            true
        }
        "chorused" => {
            set_vibrato(
                params,
                VibratoParams {
                    enabled: true,
                    waveform: 2,
                    rate: 38.0,
                    depth: 14.0,
                    delay: 80.0,
                },
            );
            true
        }
        "warble" => {
            set_vibrato(
                params,
                VibratoParams {
                    enabled: true,
                    waveform: 4,
                    rate: 62.0,
                    depth: 26.0,
                    delay: 20.0,
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
        mod_destination_key: None,
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
        mod_destination_key: Some("vibratoRate"),
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
        mod_destination_key: Some("vibratoDepth"),
    },
    FxControlV1 {
        id: "delay",
        label: "Delay",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(5000.0),
        default_f32: Some(120.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("vibratoDelay"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Vibrato,
    name: "Vibrato",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};
