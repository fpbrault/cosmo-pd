pub mod bitcrusher;
pub mod chain;
pub mod chorus;
pub mod compressor;
pub mod delay;
pub mod delay_line;
pub mod distortion;
pub mod eq;
pub mod grain_delay;
pub mod juno_chorus;
pub mod lofi;
pub mod phase_mod;
pub mod phaser;
pub mod reverb;
pub mod ring_mod;
pub mod shimmer_verb;
pub mod tremolo;
pub mod vibrato;
pub mod wavefolder;

pub use chain::FxChain;

use serde::Serialize;
#[cfg(feature = "specta-bindings")]
use specta::Type;

use crate::params::FxSlotType;

// ---------------------------------------------------------------------------
// Preset option — shared by module_presets.rs and each fx module's DEFINITION
// ---------------------------------------------------------------------------

/// A single named preset that can be applied to an FX module.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct FxPresetOptionV1 {
    pub id: &'static str,
    pub label: &'static str,
}

// ---------------------------------------------------------------------------
// Control definition types — mirror the algo control system
// ---------------------------------------------------------------------------

/// Visual/semantic kind for an FX control.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum FxControlKindV1 {
    Knob,
    ButtonGroup,
    Toggle,
}

/// One selectable option for button-group controls.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct FxControlOptionV1 {
    pub value: u8,
    pub label: &'static str,
    pub icon_name: Option<&'static str>,
}

/// Describes one control surfaced by an FX module.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct FxControlV1 {
    pub id: &'static str,
    pub label: &'static str,
    pub kind: FxControlKindV1,
    pub bipolar: bool,
    pub min: Option<f32>,
    pub max: Option<f32>,
    pub default_f32: Option<f32>,
    /// Options for `ButtonGroup` controls (empty slice for knobs/toggles).
    pub options: &'static [FxControlOptionV1],
}

/// Complete definition of an FX slot module — controls, name, and preset catalog.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct FxDefinitionV1 {
    pub slot_type: FxSlotType,
    pub name: &'static str,
    pub controls: &'static [FxControlV1],
    pub presets: &'static [FxPresetOptionV1],
}

pub const NO_FX_CONTROL_OPTIONS: [FxControlOptionV1; 0] = [];

// ---------------------------------------------------------------------------
// Catalog — one entry per FX slot type (excluding Empty)
// ---------------------------------------------------------------------------

pub const FX_DEFINITIONS_V1: [FxDefinitionV1; 17] = [
    chorus::DEFINITION,
    delay::DEFINITION,
    reverb::DEFINITION,
    phaser::DEFINITION,
    vibrato::DEFINITION,
    phase_mod::DEFINITION,
    compressor::DEFINITION,
    eq::DEFINITION,
    grain_delay::DEFINITION,
    bitcrusher::DEFINITION,
    shimmer_verb::DEFINITION,
    distortion::DEFINITION,
    juno_chorus::DEFINITION,
    ring_mod::DEFINITION,
    tremolo::DEFINITION,
    wavefolder::DEFINITION,
    lofi::DEFINITION,
];

pub fn fx_definitions_v1() -> &'static [FxDefinitionV1] {
    &FX_DEFINITIONS_V1
}
pub use delay_line::DelayLine;
pub use reverb::FdnReverb;
