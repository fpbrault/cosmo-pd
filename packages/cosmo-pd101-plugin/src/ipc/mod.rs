use std::sync::Arc;
use std::sync::atomic::Ordering;

use cosmo_pd101_bridge_types::{PluginIpcEnvelope, PluginIpcRequest};
use cosmo_synth_engine::params::SynthParams;
use cosmo_synth_engine::processor::CosmoInputEvent;
use uuid::Uuid;

use crate::diagnostics::{append_log, append_log_debug, append_log_error, append_log_warn};
use crate::midi_learn::persist_midi_learn_bindings;
use crate::params::{CzPluginParams, sync_all_daw_params_from_synth};
use crate::runtime_state::PluginSharedState;

mod editor;
mod midi;
mod performance;
mod presets;
mod synth;

pub(crate) const DEFAULT_USER_PRESET_AUTHOR: &str = "User";

fn denorm_midi_7bit(value: f32) -> u8 {
    (value.clamp(0.0, 1.0) * 127.0).round() as u8
}

fn build_rt_synth_params(params: &SynthParams) -> SynthParams {
    let mut rt_params = params.clone();
    cosmo_synth_engine::envelope::normalize_synth_params_envelopes_to_raw_if_human(&mut rt_params);
    rt_params
}

pub struct IpcContext {
    shared_state: Arc<PluginSharedState>,
    params: Arc<CzPluginParams>,
}

impl IpcContext {
    pub fn new(shared_state: Arc<PluginSharedState>, params: Arc<CzPluginParams>) -> Self {
        Self {
            shared_state,
            params,
        }
    }

    /// Dispatch a legacy `(method, args)` pair to the typed handler.
    ///
    /// Keeps backward compat with the current `{ id, method, args }` wire
    /// format.  Phase 6 can switch to deserializing `PluginIpcEnvelope`
    /// directly.
    pub fn invoke(
        &self,
        method: &str,
        args: &[serde_json::Value],
    ) -> Result<serde_json::Value, String> {
        let request = PluginIpcRequest::from_legacy(method, args)?;

        if !matches!(
            request,
            PluginIpcRequest::GetScopeData
                | PluginIpcRequest::ClientLog { .. }
                | PluginIpcRequest::GetRuntimeModSources
                | PluginIpcRequest::GetTransportInfo
                | PluginIpcRequest::GetRuntimeVoiceStates
        ) {
            append_log_debug(&format!("ipc invoke method={method} args={}", args.len()));
        }

        self.invoke_typed(&request)
    }

    /// Dispatch via a `PluginIpcEnvelope` (new `{ method, payload }` format).
    pub fn invoke_envelope(
        &self,
        envelope: &PluginIpcEnvelope,
    ) -> Result<serde_json::Value, String> {
        self.invoke_typed(&envelope.request)
    }

    fn invoke_typed(&self, req: &PluginIpcRequest) -> Result<serde_json::Value, String> {
        match req {
            // Performance
            PluginIpcRequest::NoteOn { .. }
            | PluginIpcRequest::NoteOff { .. }
            | PluginIpcRequest::Sustain { .. }
            | PluginIpcRequest::PitchBend { .. }
            | PluginIpcRequest::ModWheel { .. }
            | PluginIpcRequest::Aftertouch { .. }
            | PluginIpcRequest::PolyAftertouch { .. }
            | PluginIpcRequest::MacroValue { .. }
            | PluginIpcRequest::Panic => performance::handle(self, req),

            // Synth
            PluginIpcRequest::GetParams
            | PluginIpcRequest::SetParams(..)
            | PluginIpcRequest::GetParamsVersion
            | PluginIpcRequest::GetRuntimeModSources
            | PluginIpcRequest::GetRuntimeVoiceStates
            | PluginIpcRequest::GetTransportInfo
            | PluginIpcRequest::GetScopeData
            | PluginIpcRequest::ClientLog { .. } => synth::handle(self, req),

            // Presets
            PluginIpcRequest::GetPresetSession
            | PluginIpcRequest::SetPresetSession(..)
            | PluginIpcRequest::GetPresetName
            | PluginIpcRequest::SetPresetName(..)
            | PluginIpcRequest::LoadPreset(..)
            | PluginIpcRequest::GetPresetLibrary { .. }
            | PluginIpcRequest::RetryPresetLibrary
            | PluginIpcRequest::RepairPresetLibrary
            | PluginIpcRequest::RebuildPresetLibrary
            | PluginIpcRequest::AddPreset(..)
            | PluginIpcRequest::SavePreset(..)
            | PluginIpcRequest::DeletePreset { .. }
            | PluginIpcRequest::RenamePreset { .. }
            | PluginIpcRequest::ToggleStarred { .. }
            | PluginIpcRequest::SetPresetAuthor { .. }
            | PluginIpcRequest::SetPresetDescription { .. }
            | PluginIpcRequest::SetPresetTags { .. }
            | PluginIpcRequest::ImportPresetBank(..)
            | PluginIpcRequest::ExportPreset { .. }
            | PluginIpcRequest::ListFxModulePresets { .. }
            | PluginIpcRequest::SaveFxModulePreset(..)
            | PluginIpcRequest::DeleteFxModulePreset { .. } => presets::handle(self, req),

            // Editor
            PluginIpcRequest::GetEditorState | PluginIpcRequest::SetEditorState(..) => {
                editor::handle(self, req)
            }

            // MIDI learn
            PluginIpcRequest::SetMidiLearnMode(..)
            | PluginIpcRequest::SetPendingMidiLearnParam(..)
            | PluginIpcRequest::AddMidiBinding { .. }
            | PluginIpcRequest::RemoveMidiBinding(..)
            | PluginIpcRequest::ClearMidiLearnBindings
            | PluginIpcRequest::GetMidiLearnState => midi::handle(self, req),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Mutex;

    use super::*;
    use crate::preset_library::PresetLibrary;
    use crate::session_state::MidiLearnState;

    #[test]
    fn unknown_method_returns_an_error() {
        let params = SynthParams::default();
        let library = Arc::new(Mutex::new(PresetLibrary::from_embedded_factory("[]")));
        let shared_state = Arc::new(PluginSharedState::new(
            params.clone(),
            params,
            library,
            MidiLearnState::default(),
        ));
        let context = IpcContext::new(shared_state, Arc::new(CzPluginParams::new()));

        assert_eq!(
            context.invoke("notARealMethod", &[]),
            Err("unknown method: notARealMethod".to_string())
        );
    }
}
