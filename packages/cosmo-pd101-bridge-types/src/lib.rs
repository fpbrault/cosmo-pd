#[cfg(feature = "specta-bindings")]
extern crate specta;

mod editor;
mod ipc;
mod midi;
mod preset;
mod runtime;
mod session;

pub use cosmo_synth_engine::params::SynthParams;
pub use editor::EditorState;
pub use ipc::{
    AddPresetPayload, LoadPresetPayload, PluginIpcEnvelope, PluginIpcRequest,
    SaveFxModulePresetPayload, SavePresetPayload,
};
pub use midi::{MidiLearnBinding, MidiLearnState};
pub use preset::{
    FxModulePresetEntry, PresetBankBundle, PresetBankEntry, PresetBankMetadata, PresetLibraryEntry,
};
pub use runtime::{ScopeDataResponse, TransportInfoResponse};
pub use session::PresetSession;
