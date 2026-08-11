use crate::params::{Algo, EngineParamReadoutFormatV1};
use serde::Serialize;
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::bend::DEFINITION as BEND;
use super::cheby::DEFINITION as CHEBY;
use super::clip::DEFINITION as CLIP;
use super::cz101::DEFINITION as CZ101;
use super::fof::DEFINITION as FOF;
use super::fold::DEFINITION as FOLD;
use super::mirror::DEFINITION as MIRROR;
use super::pinch::DEFINITION as PINCH;
use super::ripple::DEFINITION as RIPPLE;
use super::skew::DEFINITION as SKEW;
use super::stutter::DEFINITION as STUTTER;
use super::sync::DEFINITION as SYNC;
use super::terrain::DEFINITION as TERRAIN;
use super::twist::DEFINITION as TWIST;

/// Describes one control surfaced by an algorithm package.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum AlgoControlKindV1 {
    Number,
    Select,
    Toggle,
}

/// Intended presentation for a control in synth UIs.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum AlgoControlPresentationV1 {
    Knob,
    Slider,
    ButtonGroup,
    Dropdown,
}

/// Assignment emitted by a select option to update one or more numeric controls.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AlgoControlAssignmentV1 {
    pub control_id: &'static str,
    pub value: f32,
}

/// One selectable option for list-based controls.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AlgoControlOptionV1 {
    pub value: &'static str,
    pub label: &'static str,
    pub set: &'static [AlgoControlAssignmentV1],
}

/// Describes one control surfaced by an algorithm package.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AlgoControlV1 {
    pub id: &'static str,
    pub kind: AlgoControlKindV1,
    pub control_type: AlgoControlPresentationV1,
    pub bipolar: bool,
    pub icon_name: Option<&'static str>,
    pub min: Option<f32>,
    pub max: Option<f32>,
    pub default: Option<f32>,
    pub default_toggle: Option<bool>,
    pub options: &'static [AlgoControlOptionV1],
    pub readout_format: EngineParamReadoutFormatV1,
}

/// Complete algorithm package definition.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AlgoDefinitionV1 {
    pub id: Algo,
    pub name: &'static str,
    pub icon_path: &'static str,
    pub visible: bool,
    pub default_base_waveform: crate::params::BaseWaveform,
    pub controls: &'static [AlgoControlV1],
}

/// UI catalog entry for algorithm pickers.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AlgoUiEntryV1 {
    pub id: Algo,
    pub label: &'static str,
    pub icon_path: &'static str,
    pub visible: bool,
}

pub const NO_CONTROLS: [AlgoControlV1; 0] = [];
pub const NO_CONTROL_OPTIONS: [AlgoControlOptionV1; 0] = [];
pub const WARP_AMOUNT_NUMBER_CONTROL: AlgoControlV1 = AlgoControlV1 {
    id: "warpAmount",
    kind: AlgoControlKindV1::Number,
    control_type: AlgoControlPresentationV1::Knob,
    bipolar: false,
    icon_name: None,
    min: Some(0.0),
    max: Some(1.0),
    default: Some(0.0),
    default_toggle: None,
    options: &NO_CONTROL_OPTIONS,
    readout_format: EngineParamReadoutFormatV1::Percent,
};
pub const LEVEL_NUMBER_CONTROL: AlgoControlV1 = AlgoControlV1 {
    id: "level",
    kind: AlgoControlKindV1::Number,
    control_type: AlgoControlPresentationV1::Slider,
    bipolar: false,
    icon_name: Some("volume"),
    min: Some(0.0),
    max: Some(1.0),
    default: Some(1.0),
    default_toggle: None,
    options: &NO_CONTROL_OPTIONS,
    readout_format: EngineParamReadoutFormatV1::Percent,
};
pub const OCTAVE_NUMBER_CONTROL: AlgoControlV1 = AlgoControlV1 {
    id: "octave",
    kind: AlgoControlKindV1::Number,
    control_type: AlgoControlPresentationV1::Knob,
    bipolar: true,
    icon_name: Some("octave"),
    min: Some(-2.0),
    max: Some(2.0),
    default: Some(0.0),
    default_toggle: None,
    options: &NO_CONTROL_OPTIONS,
    readout_format: EngineParamReadoutFormatV1::Integer,
};
pub const FINE_DETUNE_NUMBER_CONTROL: AlgoControlV1 = AlgoControlV1 {
    id: "fineDetune",
    kind: AlgoControlKindV1::Number,
    control_type: AlgoControlPresentationV1::Knob,
    bipolar: true,
    icon_name: Some("tuningFork"),
    min: Some(-50.0),
    max: Some(50.0),
    default: Some(0.0),
    default_toggle: None,
    options: &NO_CONTROL_OPTIONS,
    readout_format: EngineParamReadoutFormatV1::Integer,
};
pub const KEY_FOLLOW_NUMBER_CONTROL: AlgoControlV1 = AlgoControlV1 {
    id: "keyFollow",
    kind: AlgoControlKindV1::Number,
    control_type: AlgoControlPresentationV1::Knob,
    bipolar: false,
    icon_name: Some("keyboard"),
    min: Some(0.0),
    max: Some(9.0),
    default: Some(0.0),
    default_toggle: None,
    options: &NO_CONTROL_OPTIONS,
    readout_format: EngineParamReadoutFormatV1::Decimal,
};
pub const ALGO_BLEND_NUMBER_CONTROL: AlgoControlV1 = AlgoControlV1 {
    id: "algoBlend",
    kind: AlgoControlKindV1::Number,
    control_type: AlgoControlPresentationV1::Slider,
    bipolar: false,
    icon_name: Some("blend"),
    min: Some(0.0),
    max: Some(1.0),
    default: Some(0.0),
    default_toggle: None,
    options: &NO_CONTROL_OPTIONS,
    readout_format: EngineParamReadoutFormatV1::Percent,
};
pub const WARP_AMOUNT_CONTROL: [AlgoControlV1; 1] = [WARP_AMOUNT_NUMBER_CONTROL];
pub const DCW_CONTROL: [AlgoControlV1; 1] = [AlgoControlV1 {
    id: "dcw",
    kind: AlgoControlKindV1::Number,
    control_type: AlgoControlPresentationV1::Knob,
    bipolar: false,
    icon_name: Some("waveSine"),
    min: Some(0.0),
    max: Some(1.0),
    default: Some(0.0),
    default_toggle: None,
    options: &NO_CONTROL_OPTIONS,
    readout_format: EngineParamReadoutFormatV1::Percent,
}];

const ALGO_DEFINITION_COUNT: usize = 14;

pub const ALGO_DEFINITIONS_V1: [AlgoDefinitionV1; ALGO_DEFINITION_COUNT] = [
    CZ101, BEND, SYNC, PINCH, FOLD, SKEW, TWIST, CLIP, RIPPLE, MIRROR, FOF, TERRAIN, STUTTER, CHEBY,
];

pub fn algo_definitions_v1() -> &'static [AlgoDefinitionV1] {
    &ALGO_DEFINITIONS_V1
}

pub fn algo_ui_catalog_v1() -> &'static [AlgoUiEntryV1] {
    macro_rules! entry {
        ($index:expr_2021) => {
            AlgoUiEntryV1 {
                id: ALGO_DEFINITIONS_V1[$index].id,
                label: ALGO_DEFINITIONS_V1[$index].name,
                icon_path: ALGO_DEFINITIONS_V1[$index].icon_path,
                visible: ALGO_DEFINITIONS_V1[$index].visible,
            }
        };
    }

    const CATALOG: [AlgoUiEntryV1; ALGO_DEFINITION_COUNT] = [
        entry!(0),
        entry!(1),
        entry!(2),
        entry!(3),
        entry!(4),
        entry!(5),
        entry!(6),
        entry!(7),
        entry!(8),
        entry!(9),
        entry!(10),
        entry!(11),
        entry!(12),
        entry!(13),
    ];

    &CATALOG
}
