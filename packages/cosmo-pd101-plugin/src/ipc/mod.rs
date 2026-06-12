use std::sync::Arc;
use std::sync::atomic::Ordering;

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

    pub fn invoke(
        &self,
        method: &str,
        args: &[serde_json::Value],
    ) -> Result<serde_json::Value, String> {
        if !matches!(
            method,
            "getScopeData"
                | "clientLog"
                | "getRuntimeModSources"
                | "getTransportInfo"
                | "getRuntimeVoiceStates"
        ) {
            append_log_debug(&format!("ipc invoke method={method} args={}", args.len()));
        }

        match method {
            "noteOn" | "noteOff" | "sustain" | "pitchBend" | "modWheel" | "aftertouch"
            | "polyAftertouch" | "macroValue" | "panic" => performance::handle(self, method, args),
            "setParams"
            | "getParams"
            | "getParamsVersion"
            | "getRuntimeModSources"
            | "getRuntimeVoiceStates"
            | "getTransportInfo"
            | "getScopeData"
            | "clientLog" => synth::handle(self, method, args),
            "setPresetName"
            | "getPresetName"
            | "getPresetSession"
            | "setPresetSession"
            | "getPresetLibrary"
            | "retryPresetLibrary"
            | "repairPresetLibrary"
            | "rebuildPresetLibrary"
            | "loadPresetData"
            | "addPreset"
            | "savePreset"
            | "deletePreset"
            | "renamePreset"
            | "toggleStarred"
            | "setPresetAuthor"
            | "setPresetDescription"
            | "setPresetTags"
            | "importPresetBank"
            | "listFxModulePresets"
            | "saveFxModulePreset"
            | "deleteFxModulePreset"
            | "exportPreset" => presets::handle(self, method, args),
            "setEditorState" | "getEditorState" => editor::handle(self, method, args),
            "setMidiLearnMode"
            | "setPendingMidiLearnParam"
            | "addMidiBinding"
            | "removeMidiBinding"
            | "clearMidiLearnBindings"
            | "getMidiLearnState" => midi::handle(self, method, args),
            _ => Err(format!("unknown method: {method}")),
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
