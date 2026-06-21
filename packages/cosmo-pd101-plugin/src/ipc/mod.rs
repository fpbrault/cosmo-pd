use std::sync::Arc;
use std::sync::atomic::Ordering;

use cosmo_pd101_bridge_types::{PluginIpcEnvelope, PluginIpcRequest, PluginIpcResponse};
use cosmo_synth_engine::params::SynthParams;
use cosmo_synth_engine::processor::CosmoInputEvent;
use uuid::Uuid;

use crate::diagnostics::{append_log, append_log_debug, append_log_error, append_log_warn};
use crate::params::{CzPluginParams, sync_all_daw_params_from_synth};
use crate::runtime_state::PluginSharedState;

mod editor;
mod midi;
mod performance;
mod presets;
mod settings;
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

    /// Dispatch via a `PluginIpcEnvelope` (new `{ method, payload }` format).
    pub fn invoke_envelope(
        &self,
        envelope: &PluginIpcEnvelope,
    ) -> Result<PluginIpcResponse, String> {
        self.invoke_typed(&envelope.request)
    }

    fn invoke_typed(&self, req: &PluginIpcRequest) -> Result<PluginIpcResponse, String> {
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
            | PluginIpcRequest::GetPendingParamChanges
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

            // Settings
            PluginIpcRequest::GetVoiceLimit | PluginIpcRequest::SetVoiceLimit(..) => {
                settings::handle(self, req)
            }
        }
    }
}
