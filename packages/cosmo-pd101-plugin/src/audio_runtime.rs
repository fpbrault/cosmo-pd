use std::sync::Arc;
use std::sync::atomic::Ordering;

use cosmo_pd101_bridge_types::UiAlgoControlSection;
use cosmo_synth_engine::params::{
    AppliedMidiAlgoControlSection, AppliedMidiParamChange, AppliedMidiParamTarget, SynthParams,
    apply_midi_mapping_binding,
};
use cosmo_synth_engine::processor::{
    CosmoInputEvent, CosmoProcessor, CosmoTimedInputEvent, CosmoTransportState,
};
use truce::prelude::*;
use truce_core::events::TransportInfo;
use truce_core::midi::{norm_7bit, norm_pitch_bend};

use crate::params::{
    CzPluginParamsParamId, apply_daw_params, daw_param_key_by_id, read_current_daw_param_by_id,
    read_daw_param_by_id, sync_all_daw_params_from_synth, write_daw_param_by_id,
};
use crate::plugin::{CzPlugin, build_rt_synth_params};
use crate::runtime_state::{NativeUiParamChange, NativeUiParamKey};

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

impl CzPlugin {
    fn enqueue_static_ui_scalar(&self, key: &'static str, value: f32) {
        let _ = self
            .shared_state
            .ui
            .ui_param_change_queue
            .push(NativeUiParamChange::Scalar {
                key: NativeUiParamKey::Static(key),
                value,
            });
    }

    fn enqueue_daw_ui_param_changes(&self, id: u32, params: &SynthParams) {
        if id == CzPluginParamsParamId::Line1Octave as u32 {
            self.enqueue_static_ui_scalar("lineOctave", params.line1.octave);
            self.enqueue_static_ui_scalar(
                "line2DetuneOctave",
                params.line2.octave - params.line1.octave,
            );
            return;
        }
        if id == CzPluginParamsParamId::Line2Octave as u32 {
            self.enqueue_static_ui_scalar(
                "line2DetuneOctave",
                params.line2.octave - params.line1.octave,
            );
            return;
        }
        let (Some(key), Some(value)) = (daw_param_key_by_id(id), read_daw_param_by_id(params, id))
        else {
            return;
        };
        self.enqueue_static_ui_scalar(key, value);
    }

    pub(crate) fn apply_rt_param_change(&mut self, id: u32, value: f64, update_processor: bool) {
        let mut next_params = (*self.shared_state.synth.synth_params.load_full()).clone();
        if !write_daw_param_by_id(&mut next_params, id, value) {
            return;
        }

        let rt_params = Arc::new(build_rt_synth_params(&next_params));
        self.shared_state
            .synth
            .synth_params
            .store(Arc::new(next_params));
        self.shared_state
            .synth
            .rt_synth_params
            .store(Arc::clone(&rt_params));
        self.audio.cached_rt_synth_params = Arc::clone(&rt_params);
        self.audio.cached_synth_params_version = self
            .shared_state
            .synth
            .synth_params_version
            .fetch_add(1, Ordering::Release)
            + 1;
        self.audio.daw_params_dirty = false;
        if let Ok(mut session) = self.shared_state.presets.session.lock() {
            session.is_dirty = true;
        }

        if update_processor && let Some(proc) = self.audio.processor.as_mut() {
            proc.set_shared_params(rt_params);
        }
    }

    pub(crate) fn apply_midi_mapping(
        &mut self,
        channel: u8,
        cc: u8,
        value: u8,
    ) -> Vec<AppliedMidiParamChange> {
        let bindings = self.shared_state.midi_learn.bindings_snapshot();

        if bindings.is_empty() {
            return Vec::new();
        }
        let mut synth_params = (*self.shared_state.synth.synth_params.load_full()).clone();
        let normalized = f32::from(value) / 127.0;
        let mut changes = Vec::with_capacity(bindings.len());
        for binding in bindings.iter() {
            if let Some(change) = apply_midi_mapping_binding(
                &mut synth_params,
                &binding.param_key,
                binding.channel,
                binding.cc,
                channel,
                cc,
                normalized,
            ) {
                changes.push(change);
            }
        }

        if changes.is_empty() {
            return Vec::new();
        }

        let rt_params = Arc::new(build_rt_synth_params(&synth_params));
        sync_all_daw_params_from_synth(&self.params, &synth_params);
        self.shared_state
            .synth
            .synth_params
            .store(Arc::new(synth_params));
        self.shared_state
            .synth
            .rt_synth_params
            .store(Arc::clone(&rt_params));
        self.audio.cached_rt_synth_params = Arc::clone(&rt_params);
        self.audio.cached_synth_params_version = self
            .shared_state
            .synth
            .synth_params_version
            .fetch_add(1, Ordering::Release)
            + 1;
        self.audio.daw_params_dirty = false;

        if let Some(proc) = self.audio.processor.as_mut() {
            proc.set_shared_params(rt_params);
        }

        changes
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
        let params_version = self
            .shared_state
            .synth
            .synth_params_version
            .load(Ordering::Acquire);
        let mut host_param_changes = [false; Self::TRACKED_PARAM_ID_CAPACITY];
        if params_version == self.audio.cached_synth_params_version {
            for (id, changed) in host_param_changes.iter_mut().enumerate() {
                if tracked_param_changes[id] {
                    continue;
                }
                let param_id = id as u32;
                let Some(current) = read_current_daw_param_by_id(&self.params, param_id) else {
                    continue;
                };
                let Some(cached) =
                    read_daw_param_by_id(&self.audio.cached_rt_synth_params, param_id)
                else {
                    continue;
                };
                *changed = (current - cached).abs() > 0.000_001;
            }
        }
        let host_params_changed = host_param_changes.iter().any(|changed| *changed);
        let params_changed = params_version != self.audio.cached_synth_params_version
            || self.audio.daw_params_dirty
            || host_params_changed;

        if !params_changed {
            return;
        }

        // Start from the latest JS JSON params (or cached RT params).
        // Both rt_synth_params and cached_rt_synth_params have already been
        // normalized (envelope level/rate -> raw 0-127), and apply_daw_params
        // only touches top-level float fields (no envelope steps), so we
        // must NOT call build_rt_synth_params again - that would double-convert
        // envelope values, corrupting levels and rates.
        let previous_rt = (*self.audio.cached_rt_synth_params).clone();
        let merged = if params_version != self.audio.cached_synth_params_version {
            let mut params = (*self.shared_state.synth.rt_synth_params.load_full()).clone();
            apply_daw_params(&mut params, &self.params);
            params
        } else {
            let mut params = (*self.audio.cached_rt_synth_params).clone();
            apply_daw_params(&mut params, &self.params);
            params
        };

        let mut merged = merged;
        if has_param_change_events {
            for (id, changed) in tracked_param_changes.iter().enumerate() {
                if !*changed {
                    continue;
                }
                let Some(prev_value) = read_daw_param_by_id(&previous_rt, id as u32) else {
                    continue;
                };
                let _ = write_daw_param_by_id(&mut merged, id as u32, f64::from(prev_value));
            }
        }

        let published_params_version = if host_params_changed {
            self.shared_state
                .synth
                .synth_params_version
                .fetch_add(1, Ordering::Release)
                + 1
        } else {
            params_version
        };
        for (id, changed) in host_param_changes.iter().enumerate() {
            if !*changed {
                continue;
            }
            self.enqueue_daw_ui_param_changes(id as u32, &merged);
        }

        let rt_merged = Arc::new(merged);
        self.audio.cached_rt_synth_params = rt_merged.clone();
        if self
            .shared_state
            .preset_reset_pending
            .swap(false, Ordering::Acquire)
        {
            // Preset change: clear old voices/FX before new params take effect.
            // reset_audio_state() is the hard reset that stops all voices, clears
            // sustain/mod state, and reinitializes FX. Without this, the old voices
            // would receive the new preset params for at least one block.
            if let Some(ref mut proc) = self.audio.processor {
                proc.reset_audio_state();
            }
        }
        if let Some(ref mut proc) = self.audio.processor {
            proc.set_shared_params(rt_merged);
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
        let _ = self
            .shared_state
            .midi_learn
            .capture_pending_binding(channel, cc);
        let changes = self.apply_midi_mapping(channel, cc, value);
        for change in changes {
            let ui_change = match change.target {
                AppliedMidiParamTarget::Scalar => NativeUiParamChange::Scalar {
                    key: NativeUiParamKey::Owned(change.key),
                    value: change.value,
                },
                AppliedMidiParamTarget::AlgoControl {
                    line,
                    section,
                    control_id,
                } => NativeUiParamChange::AlgoControl {
                    line,
                    section: match section {
                        AppliedMidiAlgoControlSection::A => UiAlgoControlSection::A,
                        AppliedMidiAlgoControlSection::B => UiAlgoControlSection::B,
                    },
                    control_id,
                    value: change.value,
                },
            };
            let _ = self.shared_state.ui.ui_param_change_queue.push(ui_change);
        }
        let _ = self
            .shared_state
            .ui
            .midi_cc_queue
            .push((channel, cc, value));
    }

    pub(crate) fn handle_host_event_side_effects(&mut self, body: &EventBody) {
        match body {
            EventBody::ControlChange {
                channel, cc, value, ..
            } => self.handle_cc_side_effects(*channel, *cc, *value),
            EventBody::ControlChange2 {
                channel, cc, value, ..
            } => {
                let raw_value = (*value / 128) as u8;
                self.handle_cc_side_effects(*channel, *cc, raw_value);
            }
            EventBody::ParamChange { id, value } => {
                self.audio.daw_params_dirty = true;
                self.apply_rt_param_change(*id, *value, false);
                let synth_params = self.shared_state.synth.synth_params.load();
                self.enqueue_daw_ui_param_changes(*id, synth_params.as_ref());
            }
            EventBody::ProgramChange { program, .. }
            | EventBody::ProgramChange2 { program, .. }
                if usize::from(*program) < crate::ffi::factory_preset_count() =>
            {
                self.apply_factory_preset(usize::from(*program));
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
        if let Ok(mut scope) = self.shared_state.telemetry.scope_buffer.try_lock() {
            scope.push_block(mono_output, proc.sample_rate, hz);
        }

        self.shared_state
            .telemetry
            .runtime_mod_sources
            .store(Arc::new(proc.runtime_mod_sources()));
        self.shared_state
            .telemetry
            .runtime_voice_states
            .store(Arc::new(proc.runtime_voice_debug_state()));

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
