use std::sync::Arc;
use std::sync::atomic::Ordering;

use cosmo_synth_engine::params::{SynthParams, set_parameter_value_by_key};
use cosmo_synth_engine::processor::{
    CosmoInputEvent, CosmoProcessor, CosmoTimedInputEvent, CosmoTransportState,
};
use truce::prelude::*;
use truce_core::events::TransportInfo;
use truce_core::midi::{norm_7bit, norm_pitch_bend};

use crate::midi_learn::persist_midi_learn_bindings;
#[cfg(test)]
use crate::params::resolve_vst3_midi_mapping_param_id;
use crate::params::{
    CzPluginParams, CzPluginParamsParamId, apply_daw_params, daw_param_key_by_id,
    read_current_daw_param_by_id, read_daw_param_by_id, sync_all_daw_params_from_synth,
    write_daw_param_by_id,
};
use crate::plugin::{CzPlugin, build_rt_synth_params};
use crate::runtime_state::{PluginSharedState, RenderControlEvent};

pub(crate) const MAX_UI_INPUT_EVENTS_PER_BLOCK: usize = 64;

pub struct AudioRuntime {
    pub(crate) processor: Option<CosmoProcessor>,
    pub(crate) cached_synth_params_version: u64,
    pub(crate) cached_rt_synth_params: Arc<SynthParams>,
    pub(crate) block_input_events: Vec<CosmoTimedInputEvent>,
    pub(crate) mono_output: Vec<f32>,
    pub(crate) daw_params_dirty: bool,
    pub(crate) last_scope_hz: f32,
    pub(crate) voice_limit: usize,
}

impl AudioRuntime {
    pub fn new(default_rt_params: SynthParams) -> Self {
        Self {
            processor: None,
            cached_synth_params_version: 0,
            cached_rt_synth_params: Arc::new(default_rt_params),
            block_input_events: Vec::with_capacity(MAX_UI_INPUT_EVENTS_PER_BLOCK),
            mono_output: Vec::new(),
            daw_params_dirty: true,
            last_scope_hz: 220.0,
            voice_limit: crate::global_settings::DEFAULT_VOICE_LIMIT as usize,
        }
    }

    pub(crate) fn set_voice_limit(&mut self, limit: usize) {
        self.voice_limit = limit.clamp(
            crate::global_settings::MIN_VOICE_LIMIT as usize,
            crate::global_settings::MAX_VOICE_LIMIT as usize,
        );
        if let Some(proc) = self.processor.as_mut() {
            proc.set_voice_limit(self.voice_limit);
        }
    }
}

pub(crate) fn drain_render_control_events(
    shared_state: &PluginSharedState,
    params: &CzPluginParams,
) {
    let mut pending_params: Option<SynthParams> = None;
    while let Some(event) = shared_state.ui.render_control_queue.pop() {
        match event {
            RenderControlEvent::ObservedCc { channel, cc, value } => {
                if shared_state
                    .ui
                    .midi_cc_queue
                    .push((channel, cc, value))
                    .is_err()
                {
                    shared_state
                        .ui
                        .render_control_diagnostics
                        .queue_overflows
                        .fetch_add(1, Ordering::Relaxed);
                }

                let snapshot = shared_state.midi_learn.mapping_snapshot.load();
                let normalized = f32::from(value) / 127.0;
                let mut applied = false;
                for entry in snapshot.entries.iter() {
                    if entry.cc != i32::from(cc)
                        || (entry.channel != -1 && entry.channel != i32::from(channel))
                    {
                        continue;
                    }

                    let mapped_value = entry.min + normalized * (entry.max - entry.min);
                    let next_params = pending_params.get_or_insert_with(|| {
                        shared_state.synth.synth_params.load_full().as_ref().clone()
                    });
                    let _ = set_parameter_value_by_key(next_params, &entry.param_key, mapped_value);
                    applied = true;
                }

                if !applied {
                    shared_state
                        .ui
                        .render_control_diagnostics
                        .midi_mapping_misses
                        .fetch_add(1, Ordering::Relaxed);
                }
            }
            RenderControlEvent::MidiLearnCapture { channel, cc } => {
                capture_pending_midi_learn_binding_on_control_thread(shared_state, channel, cc);
            }
            RenderControlEvent::MappedParamChange { param_key, value } => {
                let next_params = pending_params.get_or_insert_with(|| {
                    shared_state.synth.synth_params.load_full().as_ref().clone()
                });
                let _ = set_parameter_value_by_key(next_params, &param_key, value);
            }
            RenderControlEvent::ProgramChangeRequest { program } => {
                publish_pending_mapped_params(shared_state, params, &mut pending_params);
                apply_factory_preset_on_control_thread(shared_state, params, usize::from(program));
            }
        }
    }
    publish_pending_mapped_params(shared_state, params, &mut pending_params);
}

fn capture_pending_midi_learn_binding_on_control_thread(
    shared_state: &PluginSharedState,
    channel: u8,
    cc: u8,
) {
    let mut bindings_changed = false;
    {
        let Ok(mut state) = shared_state.midi_learn.state.lock() else {
            return;
        };
        if state.learn_mode
            && let Some(ref pending) = state.pending_param_key.clone()
        {
            state
                .bindings
                .retain(|binding| binding.param_key != *pending);
            state.bindings.push(crate::session_state::MidiLearnBinding {
                param_key: pending.clone(),
                channel: i32::from(channel),
                cc: i32::from(cc),
            });
            state.version += 1;
            bindings_changed = true;
        }
    }

    if bindings_changed {
        persist_midi_learn_bindings(&shared_state.midi_learn.state);
        shared_state.midi_learn.publish_mapping_snapshot();
    }
}

fn publish_pending_mapped_params(
    shared_state: &PluginSharedState,
    params: &CzPluginParams,
    pending_params: &mut Option<SynthParams>,
) {
    let Some(next_params) = pending_params.take() else {
        return;
    };
    publish_synth_params_from_control_thread(shared_state, params, next_params, true);
}

fn publish_synth_params_from_control_thread(
    shared_state: &PluginSharedState,
    params: &CzPluginParams,
    next_params: SynthParams,
    mark_dirty: bool,
) {
    sync_all_daw_params_from_synth(params, &next_params);
    let rt_params = Arc::new(build_rt_synth_params(&next_params));
    shared_state.synth.synth_params.store(Arc::new(next_params));
    shared_state
        .synth
        .rt_synth_params
        .store(Arc::clone(&rt_params));
    shared_state
        .synth
        .synth_params_version
        .fetch_add(1, Ordering::Release);

    if mark_dirty && let Ok(mut session) = shared_state.presets.session.lock() {
        session.is_dirty = true;
    }
}

fn apply_factory_preset_on_control_thread(
    shared_state: &PluginSharedState,
    params: &CzPluginParams,
    index: usize,
) {
    let Some(next_params) = crate::ffi::factory_preset_params(index).cloned() else {
        return;
    };
    let identity = crate::ffi::factory_preset_identity(index)
        .map(|(id, name)| (id.to_string(), name.to_string()));

    shared_state
        .preset_reset_pending
        .store(true, Ordering::Release);
    publish_synth_params_from_control_thread(shared_state, params, next_params, false);

    if let Ok(mut session) = shared_state.presets.session.lock() {
        if let Some((preset_id, preset_name)) = identity {
            session.active_preset_name_base = preset_name;
            session.loaded_preset_id = Some(preset_id);
        }
        session.is_dirty = false;
    }
}

impl CzPlugin {
    pub(crate) fn enqueue_render_control_event(&self, event: RenderControlEvent) {
        if self
            .shared_state
            .ui
            .render_control_queue
            .push(event)
            .is_err()
        {
            self.shared_state
                .ui
                .render_control_diagnostics
                .queue_overflows
                .fetch_add(1, Ordering::Relaxed);
        }
    }

    #[cfg(test)]
    pub(crate) fn vst3_midi_mapping_param_id(
        &self,
        bus_index: i32,
        channel: i16,
        cc: i16,
    ) -> Option<u32> {
        let state = self.shared_state.midi_learn.state.lock().ok()?;
        resolve_vst3_midi_mapping_param_id(&state.bindings, bus_index, channel, cc)
    }

    pub(crate) fn tracked_param_changes(
        events: &EventList,
    ) -> [bool; Self::TRACKED_PARAM_ID_CAPACITY] {
        let mut changed = [false; Self::TRACKED_PARAM_ID_CAPACITY];
        for event in events.iter() {
            if let EventBody::ParamChange { id, .. } = event.body {
                let Ok(index) = usize::try_from(id) else {
                    continue;
                };
                if index < changed.len() {
                    changed[index] = true;
                }
            }
        }
        changed
    }

    pub(crate) fn current_transport_state(transport: &TransportInfo) -> CosmoTransportState {
        CosmoTransportState {
            tempo_bpm: (transport.tempo.is_finite() && transport.tempo > 0.0)
                .then_some(transport.tempo as f32),
            playing: transport.playing,
            position_beats: transport.position_beats,
        }
    }

    pub(crate) fn sync_runtime_params_from_host(&mut self, events: &EventList) {
        let tracked_param_changes = Self::tracked_param_changes(events);
        let has_param_change_events = tracked_param_changes.iter().any(|changed| *changed);
        let host_params_changed = (0..Self::TRACKED_PARAM_ID_CAPACITY).any(|id| {
            if tracked_param_changes[id] {
                return false;
            }
            let id = id as u32;
            let Some(current) = read_current_daw_param_by_id(&self.params, id) else {
                return false;
            };
            let Some(cached) = read_daw_param_by_id(&self.audio.cached_rt_synth_params, id) else {
                return false;
            };
            (current - cached).abs() > 0.000_001
        });
        let params_version = self
            .shared_state
            .synth
            .synth_params_version
            .load(Ordering::Acquire);
        let params_changed = params_version != self.audio.cached_synth_params_version
            || self.audio.daw_params_dirty
            || host_params_changed;

        if !params_changed {
            return;
        }

        let published_params_version: u64;

        if params_version != self.audio.cached_synth_params_version {
            // Webview changed params: take snapshot from ArcSwap.
            // The clone from load_full() allocates on this infrequent path.
            let mut merged = (*self.shared_state.synth.rt_synth_params.load_full()).clone();
            apply_daw_params(&mut merged, &self.params);

            // Undo event-list param changes (applied via process_block events)
            if has_param_change_events {
                for (id, changed) in tracked_param_changes.iter().enumerate() {
                    if !*changed {
                        continue;
                    }
                    let Some(prev_value) = read_daw_param_by_id(&merged, id as u32) else {
                        continue;
                    };
                    let _ = write_daw_param_by_id(&mut merged, id as u32, f64::from(prev_value));
                }
            }

            published_params_version = if host_params_changed {
                self.shared_state
                    .synth
                    .synth_params_version
                    .fetch_add(1, Ordering::Release)
                    + 1
            } else {
                params_version
            };

            let rt_merged = Arc::new(merged);
            self.audio.cached_rt_synth_params = rt_merged.clone();

            if self
                .shared_state
                .preset_reset_pending
                .swap(false, Ordering::Acquire)
                && let Some(ref mut proc) = self.audio.processor
            {
                proc.reset_audio_state();
            }

            if let Some(ref mut proc) = self.audio.processor {
                proc.set_shared_params(rt_merged);
            }
        } else {
            // Only DAW automation changed params: mutate cached_rt_synth_params in-place.
            // Arc::make_mut avoids allocating when refcount == 1 (common case).
            published_params_version = if host_params_changed {
                self.shared_state
                    .synth
                    .synth_params_version
                    .fetch_add(1, Ordering::Release)
                    + 1
            } else {
                params_version
            };

            let rt = Arc::make_mut(&mut self.audio.cached_rt_synth_params);

            if has_param_change_events {
                // Rare: both DAW automation and event-list params in the same block.
                // Only clone previous values for undo in this edge case.
                let previous_rt = rt.clone();
                apply_daw_params(rt, &self.params);
                for (id, changed) in tracked_param_changes.iter().enumerate() {
                    if !*changed {
                        continue;
                    }
                    let Some(prev_value) = read_daw_param_by_id(&previous_rt, id as u32) else {
                        continue;
                    };
                    let _ = write_daw_param_by_id(rt, id as u32, f64::from(prev_value));
                }
            } else {
                apply_daw_params(rt, &self.params);
            }

            if self
                .shared_state
                .preset_reset_pending
                .swap(false, Ordering::Acquire)
                && let Some(ref mut proc) = self.audio.processor
            {
                proc.reset_audio_state();
            }

            if let Some(ref mut proc) = self.audio.processor {
                proc.set_shared_params(self.audio.cached_rt_synth_params.clone());
            }
        }

        self.audio.cached_synth_params_version = published_params_version;
        self.audio.daw_params_dirty = false;

        // Push merged params to ArcSwaps so idle loop pushes to webview.
        self.shared_state
            .synth
            .synth_params
            .store(self.audio.cached_rt_synth_params.clone());
        self.shared_state
            .synth
            .rt_synth_params
            .store(self.audio.cached_rt_synth_params.clone());
    }

    pub(crate) fn handle_cc_side_effects(&mut self, channel: u8, cc: u8, value: u8) {
        self.enqueue_render_control_event(RenderControlEvent::ObservedCc { channel, cc, value });
        self.enqueue_render_control_event(RenderControlEvent::MidiLearnCapture { channel, cc });
    }

    pub(crate) fn handle_host_event_side_effects(&mut self, body: &EventBody) {
        match body {
            EventBody::ControlChange {
                channel, cc, value, ..
            } => {
                self.handle_cc_side_effects(*channel, *cc, *value);
            }
            EventBody::ControlChange2 {
                channel, cc, value, ..
            } => {
                let raw_value = (*value / 128) as u8;
                self.handle_cc_side_effects(*channel, *cc, raw_value);
            }
            EventBody::ParamChange { .. } => {
                self.audio.daw_params_dirty = true;
            }
            EventBody::ProgramChange { program, .. }
            | EventBody::ProgramChange2 { program, .. }
                if usize::from(*program) < crate::ffi::factory_preset_count() =>
            {
                self.enqueue_render_control_event(RenderControlEvent::ProgramChangeRequest {
                    program: *program,
                });
            }
            _ => {}
        }
    }

    pub(crate) fn host_event_to_engine_event(body: &EventBody) -> Option<CosmoInputEvent> {
        match body {
            EventBody::NoteOff { note, .. } | EventBody::NoteOff2 { note, .. } => {
                Some(CosmoInputEvent::NoteOff { note: *note })
            }
            EventBody::NoteOn { note, velocity, .. } => Some(CosmoInputEvent::NoteOn {
                note: *note,
                velocity: norm_7bit(*velocity),
            }),
            EventBody::NoteOn2 { note, velocity, .. } => Some(CosmoInputEvent::NoteOn {
                note: *note,
                velocity: *velocity as f32 / u16::MAX as f32,
            }),
            EventBody::Aftertouch { pressure, .. }
            | EventBody::ChannelPressure { pressure, .. } => Some(CosmoInputEvent::Aftertouch {
                value: norm_7bit(*pressure),
            }),
            EventBody::ChannelPressure2 { pressure, .. } => Some(CosmoInputEvent::Aftertouch {
                value: *pressure as f32 / u32::MAX as f32,
            }),
            EventBody::ControlChange {
                channel, cc, value, ..
            } => Some(CosmoInputEvent::ControlChange {
                channel: *channel,
                cc: *cc,
                value: *value,
            }),
            EventBody::ControlChange2 {
                channel, cc, value, ..
            } => Some(CosmoInputEvent::ControlChange {
                channel: *channel,
                cc: *cc,
                value: (*value / 128) as u8,
            }),
            EventBody::PitchBend { value, .. } => Some(CosmoInputEvent::PitchBend {
                value: norm_pitch_bend(*value),
            }),
            EventBody::PitchBend2 { value, .. } => Some(CosmoInputEvent::PitchBend {
                value: ((*value as f32 - 2_147_483_648.0) / 2_147_483_648.0).clamp(-1.0, 1.0),
            }),
            EventBody::ParamChange { id, value } => {
                daw_param_key_by_id(*id).map(|param_key| CosmoInputEvent::ParameterChange {
                    param_key,
                    value: *value as f32,
                })
            }
            _ => None,
        }
    }

    pub(crate) fn collect_block_input_events(&mut self, events: &EventList, num_samples: usize) {
        self.audio.block_input_events.clear();

        for _ in 0..MAX_UI_INPUT_EVENTS_PER_BLOCK {
            let Some(event) = self.shared_state.ui.ui_input_queue.pop() else {
                break;
            };
            self.audio.block_input_events.push(CosmoTimedInputEvent {
                sample_offset: 0,
                event,
            });
        }

        for event in events.iter() {
            let sample_offset = (event.sample_offset as usize).min(num_samples);
            self.handle_host_event_side_effects(&event.body);
            if let Some(engine_event) = Self::host_event_to_engine_event(&event.body) {
                self.audio.block_input_events.push(CosmoTimedInputEvent {
                    sample_offset,
                    event: engine_event,
                });
            }
        }
    }

    #[cfg(test)]
    pub(crate) fn process_host_events_into_buffer(
        &mut self,
        events: &EventList,
        num_samples: usize,
    ) {
        self.collect_block_input_events(events, num_samples);
        if let Some(proc) = self.audio.processor.as_mut() {
            proc.process_block(
                &mut self.audio.mono_output[..num_samples],
                &self.audio.block_input_events,
                CosmoTransportState::default(),
            );
        }
    }

    #[cfg(test)]
    pub(crate) fn handle_host_event(&mut self, body: &EventBody) {
        self.handle_host_event_side_effects(body);
        if let Some(engine_event) = Self::host_event_to_engine_event(body)
            && let Some(proc) = self.audio.processor.as_mut()
        {
            proc.process_block(
                &mut [],
                &[CosmoTimedInputEvent {
                    sample_offset: 0,
                    event: engine_event,
                }],
                CosmoTransportState::default(),
            );
        }
    }

    pub(crate) fn render_audio_block(
        &mut self,
        buffer: &mut AudioBuffer,
        events: &EventList,
        context: &mut ProcessContext,
    ) -> ProcessStatus {
        self.render_audio_block_inner(buffer, events, context)
    }

    fn render_audio_block_inner(
        &mut self,
        buffer: &mut AudioBuffer,
        events: &EventList,
        context: &mut ProcessContext,
    ) -> ProcessStatus {
        let Some(_) = self.audio.processor else {
            return ProcessStatus::Normal;
        };

        let num_samples = buffer.num_samples();
        if num_samples > self.audio.mono_output.len() {
            for ch in 0..buffer.num_output_channels() {
                buffer.output(ch).fill(0.0);
            }
            return ProcessStatus::Normal;
        }

        let shared_voice_limit = self.shared_state.voice_limit.load(Ordering::Relaxed) as usize;
        if shared_voice_limit != self.audio.voice_limit {
            self.audio.set_voice_limit(shared_voice_limit);
        }

        self.collect_block_input_events(events, num_samples);
        if let Some(proc) = self.audio.processor.as_mut() {
            proc.process_block(
                &mut self.audio.mono_output[..num_samples],
                &self.audio.block_input_events,
                Self::current_transport_state(context.transport),
            );
        }

        let mono_output = &mut self.audio.mono_output[..num_samples];

        let Some(proc) = self.audio.processor.as_ref() else {
            return ProcessStatus::Normal;
        };

        let raw_hz = proc
            .voices
            .iter()
            .filter(|voice| !voice.is_silent && voice.note.is_some())
            .map(|voice| voice.current_freq)
            .max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
            .unwrap_or(0.0);
        let hz = if raw_hz > 0.0 {
            self.audio.last_scope_hz = raw_hz;
            raw_hz
        } else {
            self.audio.last_scope_hz
        };
        if let Ok(mut scope) = self.shared_state.telemetry.scope_buffer.try_write() {
            scope.push_block(mono_output, proc.sample_rate, hz);
        }

        if let Ok(mut sources) = self.shared_state.telemetry.runtime_mod_sources.try_write() {
            *sources = proc.runtime_mod_sources();
        }
        if let Ok(mut states) = self.shared_state.telemetry.runtime_voice_states.try_write() {
            proc.write_runtime_voice_debug_state(&mut states);
        }

        let peak = mono_output[..num_samples]
            .iter()
            .fold(0.0f32, |acc, &sample| acc.max(sample.abs()));
        context.set_meter(CzPluginParamsParamId::MeterL as u32, peak);
        context.set_meter(CzPluginParamsParamId::MeterR as u32, peak);

        for ch in 0..buffer.num_output_channels() {
            buffer.output(ch)[..num_samples].copy_from_slice(mono_output);
        }

        let has_tail = proc.voices.iter().any(|voice| !voice.is_silent);
        if has_tail {
            ProcessStatus::Tail((proc.sample_rate * 10.0) as u32)
        } else {
            ProcessStatus::Normal
        }
    }
}
