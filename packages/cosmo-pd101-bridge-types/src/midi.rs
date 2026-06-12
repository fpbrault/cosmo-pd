use serde::{Deserialize, Serialize};

#[cfg(feature = "specta-bindings")]
use specta::Type;

/// A single MIDI learn binding stored in the engine.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct MidiLearnBinding {
    pub param_key: String,
    pub channel: i32,
    pub cc: i32,
}

/// MIDI learn state owned by the engine, pushed to webview on change.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct MidiLearnState {
    pub learn_mode: bool,
    pub pending_param_key: Option<String>,
    pub bindings: Vec<MidiLearnBinding>,
    pub version: u32,
}
