//! Plugin implementation for Cosmo PD-101.

use std::sync::atomic::Ordering;
use std::sync::{Arc, Mutex};

#[cfg(test)]
use std::sync::atomic::AtomicU64;

use crate::audio_runtime::AudioRuntime;
#[cfg(test)]
use crate::diagnostics::append_log_debug;
use crate::diagnostics::{
    append_log, append_log_error, append_log_warn, init_panic_hook, plugin_log_path,
};
use crate::params::{CzPluginParams, apply_daw_params, sync_all_daw_params_from_synth};
#[cfg(test)]
use crate::params::{CzPluginParamsParamId, read_daw_param_by_id, write_daw_param_by_id};
use crate::preset_library::PresetLibrary;
use crate::runtime_state::PluginSharedState;
#[cfg(test)]
use crate::runtime_state::{
    ScopeBuffer, ScopeFrame, SharedEditorState, SharedMidiMappings, SharedPresetSession,
    SharedRtSynthParams, SharedRuntimeModSources, SharedRuntimeVoiceStates, SharedSynthParams,
    SharedTransportSnapshot, SynthParamsVersion, TransportSnapshot, UI_INPUT_QUEUE_CAPACITY,
    UiInputQueue,
};
#[cfg(test)]
use arc_swap::ArcSwap;
use cosmo_synth_engine::envelope::normalize_synth_params_envelopes_to_raw_if_human;
use cosmo_synth_engine::params::SynthParams;
#[cfg(test)]
use cosmo_synth_engine::processor::CosmoInputEvent;
use cosmo_synth_engine::processor::CosmoProcessor;
#[cfg(test)]
use cosmo_synth_engine::processor::state::RuntimeModSources;
#[cfg(test)]
use crossbeam_queue::ArrayQueue;
use truce::prelude::*;
use truce_core::events::TransportInfo;

pub(crate) fn build_rt_synth_params(params: &SynthParams) -> SynthParams {
    let mut rt_params = params.clone();
    normalize_synth_params_envelopes_to_raw_if_human(&mut rt_params);
    rt_params
}

#[cfg(test)]
#[allow(clippy::too_many_arguments)]
fn handle_ipc_invoke(
    request: cosmo_pd101_bridge_types::PluginIpcRequest,
    synth_params: &SharedSynthParams,
    rt_synth_params: &SharedRtSynthParams,
    runtime_mod_sources: &SharedRuntimeModSources,
    runtime_voice_states: &SharedRuntimeVoiceStates,
    transport_snapshot: &SharedTransportSnapshot,
    synth_params_version: &SynthParamsVersion,
    scope_buffer: &ScopeBuffer,
    ui_input_queue: &UiInputQueue,
    params: &Arc<CzPluginParams>,
    preset_session: &SharedPresetSession,
    preset_library: &Arc<Mutex<PresetLibrary>>,
    editor_state: &SharedEditorState,
    midi_learn_state: &SharedMidiMappings,
) -> Result<serde_json::Value, String> {
    let shared_state = Arc::new(PluginSharedState {
        synth: crate::runtime_state::SynthParamState {
            synth_params: synth_params.clone(),
            rt_synth_params: rt_synth_params.clone(),
            synth_params_version: synth_params_version.clone(),
        },
        telemetry: crate::runtime_state::RuntimeTelemetry {
            runtime_mod_sources: runtime_mod_sources.clone(),
            runtime_voice_states: runtime_voice_states.clone(),
            transport_snapshot: transport_snapshot.clone(),
            scope_buffer: scope_buffer.clone(),
        },
        ui: crate::runtime_state::UiEventQueues {
            ui_input_queue: ui_input_queue.clone(),
            midi_cc_queue: Arc::new(ArrayQueue::new(
                crate::runtime_state::MIDI_CC_QUEUE_CAPACITY,
            )),
            ui_param_change_queue: Arc::new(ArrayQueue::new(
                crate::runtime_state::UI_PARAM_CHANGE_QUEUE_CAPACITY,
            )),
            pending_param_changes_flushed_via_ipc: Arc::new(std::sync::atomic::AtomicBool::new(
                false,
            )),
        },
        editor: crate::runtime_state::EditorSessionState {
            editor_state: editor_state.clone(),
        },
        presets: crate::preset_service::PresetService::new(
            preset_library.clone(),
            preset_session.clone(),
        ),
        midi_learn: crate::midi_learn::MidiLearnService::new(
            midi_learn_state
                .lock()
                .map(|state| state.clone())
                .unwrap_or_default(),
        ),
        voice_limit: std::sync::atomic::AtomicU8::new(crate::global_settings::DEFAULT_VOICE_LIMIT),
        preset_reset_pending: std::sync::atomic::AtomicBool::new(false),
    });
    crate::ipc::IpcContext::new(shared_state, params.clone())
        .invoke_envelope(&cosmo_pd101_bridge_types::PluginIpcEnvelope { id: 0, request })?
        .into_result()
        .map_err(|error| error.to_string())
}

// Plugin struct
// =============================================================================

pub struct CzPlugin {
    pub(crate) params: Arc<CzPluginParams>,
    pub(crate) audio: AudioRuntime,
    pub(crate) shared_state: Arc<PluginSharedState>,
    /// Prevents cold-start favorite selection from re-running on later resets.
    startup_preset_resolved: bool,
}

impl CzPlugin {
    fn new(params: Arc<CzPluginParams>) -> Self {
        init_panic_hook();
        let default_params = SynthParams::default();
        let default_rt_params = build_rt_synth_params(&default_params);
        let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
        let preset_library = Arc::new(Mutex::new(
            PresetLibrary::load_or_init(factory_json).unwrap_or_else(|e| {
                append_log_error(&format!(
                    "failed to initialize preset library, using factory-only mode: {e}"
                ));
                PresetLibrary::degraded(factory_json, e)
            }),
        ));
        let global_settings = crate::global_settings::load_or_init_global_settings()
            .unwrap_or_else(|error| {
                append_log_warn(&format!(
                    "failed to load global settings, using defaults: {}",
                    error
                ));
                crate::global_settings::PluginGlobalSettings::default()
            });
        let voice_limit = global_settings.clamped_voice_limit() as usize;
        let mut audio = AudioRuntime::new(default_rt_params.clone());
        audio.voice_limit = voice_limit;
        let shared_state = Arc::new(PluginSharedState::new(
            default_params.clone(),
            default_rt_params.clone(),
            preset_library.clone(),
            crate::session_state::MidiLearnState {
                bindings: global_settings.midi_learn_bindings,
                ..Default::default()
            },
            voice_limit as u8,
        ));
        Self {
            params,
            audio,
            shared_state: shared_state.clone(),
            startup_preset_resolved: false,
        }
    }

    fn apply_preset_state(
        &mut self,
        preset_id: Option<String>,
        preset_name: Option<String>,
        params: SynthParams,
    ) {
        sync_all_daw_params_from_synth(&self.params, &params);

        let rt_params = Arc::new(build_rt_synth_params(&params));
        self.shared_state.synth.synth_params.store(Arc::new(params));
        self.shared_state
            .synth
            .rt_synth_params
            .store(Arc::clone(&rt_params));
        self.audio.cached_rt_synth_params = Arc::clone(&rt_params);
        self.shared_state
            .synth
            .synth_params_version
            .fetch_add(1, Ordering::Release);
        self.audio.cached_synth_params_version = self
            .shared_state
            .synth
            .synth_params_version
            .load(Ordering::Acquire);
        self.audio.daw_params_dirty = false;

        if let Ok(mut session) = self.shared_state.presets.session.lock() {
            if preset_name.is_some() || preset_id.is_some() {
                if let Some(name) = preset_name {
                    session.active_preset_name_base = name;
                }
                session.loaded_preset_id = preset_id;
            }
            session.is_dirty = false;
        }

        if let Some(proc) = self.audio.processor.as_mut() {
            proc.reset_audio_state();
            proc.set_shared_params(rt_params);
        }
    }

    fn apply_startup_preset_if_needed(&mut self) {
        if self.startup_preset_resolved {
            return;
        }
        self.startup_preset_resolved = true;

        let startup_preset = self.shared_state.presets.startup_entry();

        let Some(entry) = startup_preset else {
            return;
        };

        let entry_data = entry.data.clone();
        let params = if let Some(params_value) = entry_data.get("params") {
            serde_json::from_value(params_value.clone())
        } else {
            serde_json::from_value(entry_data)
        };

        let Ok(params) = params else {
            append_log_warn(&format!(
                "failed to deserialize startup preset id={}",
                entry.id
            ));
            return;
        };

        self.apply_preset_state(Some(entry.id), Some(entry.name), params);
    }

    pub(crate) fn apply_factory_preset(&mut self, index: usize) {
        let Some(params) = crate::ffi::factory_preset_params(index).cloned() else {
            return;
        };
        let identity = crate::ffi::factory_preset_identity(index)
            .map(|(id, name)| (id.to_string(), name.to_string()));
        self.apply_preset_state(
            identity.as_ref().map(|(id, _)| id.clone()),
            identity.as_ref().map(|(_, name)| name.clone()),
            params,
        );
    }
}

impl PluginLogic for CzPlugin {
    fn reset(&mut self, sample_rate: f64, max_block_size: usize) {
        append_log(&format!(
            "reset sample_rate={} log_path={}",
            sample_rate,
            plugin_log_path()
        ));
        let sr = sample_rate as f32;
        let mut processor = CosmoProcessor::new(sr);
        let mut current_params = (*self.shared_state.synth.synth_params.load_full()).clone();
        apply_daw_params(&mut current_params, &self.params);
        if !self.startup_preset_resolved {
            self.shared_state
                .synth
                .synth_params
                .store(Arc::new(current_params));
            self.apply_startup_preset_if_needed();
            current_params = (*self.shared_state.synth.synth_params.load_full()).clone();
        }
        let rt_params = Arc::new(build_rt_synth_params(&current_params));
        processor.set_shared_params(Arc::clone(&rt_params));
        self.shared_state
            .synth
            .synth_params
            .store(Arc::new(current_params));
        self.shared_state
            .synth
            .rt_synth_params
            .store(Arc::clone(&rt_params));
        self.audio.cached_rt_synth_params = rt_params;
        self.audio.cached_synth_params_version = self
            .shared_state
            .synth
            .synth_params_version
            .load(Ordering::Acquire);
        processor.set_voice_limit(self.audio.voice_limit);
        self.audio.processor = Some(processor);
        self.audio.mono_output.resize(max_block_size, 0.0);
        self.audio.daw_params_dirty = false;
        self.shared_state
            .telemetry
            .transport_snapshot
            .store(&TransportInfo::default());
    }

    fn process(
        &mut self,
        buffer: &mut AudioBuffer,
        events: &EventList,
        context: &mut ProcessContext,
    ) -> ProcessStatus {
        self.shared_state
            .telemetry
            .transport_snapshot
            .store(context.transport);
        self.sync_runtime_params_from_host(events);
        self.render_audio_block(buffer, events, context)
    }

    fn bus_layouts() -> Vec<BusLayout> {
        vec![BusLayout::new().with_output("Main", ChannelConfig::Stereo)]
    }

    fn save_state(&self) -> Vec<u8> {
        let sp = self.shared_state.synth.synth_params.load();
        let preset_session = self
            .shared_state
            .presets
            .session
            .lock()
            .map(|session| session.clone())
            .unwrap_or_default();
        let editor = self
            .shared_state
            .editor
            .editor_state
            .lock()
            .map(|s| s.clone())
            .unwrap_or(None);
        let state = crate::session_state::PluginSessionState {
            synth_params: sp.as_ref().clone(),
            preset_session,
            editor_state: editor,
        };
        serde_json::to_vec(&state).unwrap_or_default()
    }

    fn load_state(&mut self, data: &[u8]) -> Result<(), StateLoadError> {
        let session = crate::session_state::deserialize_state(data)
            .map_err(|_| StateLoadError::Malformed("unknown state format"))?;
        self.startup_preset_resolved = true;

        let params = session.synth_params;

        if let Ok(mut stored) = self.shared_state.presets.session.lock()
            && (!session.preset_session.active_preset_name_base.is_empty()
                || session.preset_session.loaded_preset_id.is_some())
        {
            *stored = session.preset_session.clone();
        }

        if let Ok(mut stored) = self.shared_state.editor.editor_state.lock() {
            *stored = session.editor_state;
        }

        self.apply_preset_state(None, None, params);
        Ok(())
    }

    fn state_changed(&mut self) {
        if let Some(ref mut proc) = self.audio.processor {
            proc.set_shared_params(self.audio.cached_rt_synth_params.clone());
        }
    }

    fn editor(&self) -> Box<dyn Editor> {
        Box::new(crate::gui::CzEditor::new(
            self.shared_state.clone(),
            self.params.clone(),
        ))
    }
}

truce::plugin! {
    logic: CzPlugin,
    params: CzPluginParams,
}

// =============================================================================
// Tests
// =============================================================================

#[cfg(test)]
#[path = "plugin/tests.rs"]
mod tests;
