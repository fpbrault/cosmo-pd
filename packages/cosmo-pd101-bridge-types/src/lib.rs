#[cfg(feature = "specta-bindings")]
extern crate specta;

#[cfg(feature = "specta-bindings")]
#[derive(serde::Serialize, serde::Deserialize, specta::Type)]
#[serde(untagged)]
pub enum BridgeJsonValue {
    Null,
    Bool(bool),
    Number(f64),
    String(String),
    Array(Vec<BridgeJsonValue>),
    Object(std::collections::BTreeMap<String, BridgeJsonValue>),
}

mod editor;
mod ipc;
mod midi;
mod preset;
mod runtime;
mod session;

pub use cosmo_synth_engine::params::SynthParams;
pub use cosmo_synth_engine::processor::SequencerRuntimeState;
pub use cosmo_synth_engine::processor::state::{
    RuntimeModEnvState, RuntimeModSources, RuntimeVoiceDebugState, RuntimeVoiceEnvState,
    RuntimeVoiceLineState,
};
pub use editor::EditorState;
pub use ipc::{
    AddPresetPayload, LoadPresetPayload, PluginIpcEnvelope, PluginIpcRequest, PluginIpcResponse,
    SaveFxModulePresetPayload, SavePresetPayload, UiAlgoControlSection, UiParamChange,
};
pub use midi::{MidiLearnBinding, MidiLearnState};
pub use preset::{
    AddPresetResponse, ExportPresetResponse, FxModulePresetEntry, LoadPresetResponse,
    PresetBankBundle, PresetBankEntry, PresetBankMetadata, PresetLibraryActionResponse,
    PresetLibraryEntry, PresetLibraryResponse, PresetLibraryStatus, PresetLibrarySummaryEntry,
    SavePresetResponse,
};
pub use runtime::{ScopeDataResponse, TransportInfoResponse};
pub use session::PresetSession;
