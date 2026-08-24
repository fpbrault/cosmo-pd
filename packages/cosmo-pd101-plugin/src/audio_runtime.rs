use std::sync::Arc;
use std::sync::atomic::Ordering;
use std::time::Instant;

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
    CzPluginParamsParamId, DAW_PARAM_IDS, apply_daw_params, daw_param_key_by_id,
    read_current_daw_param_by_id, read_daw_param_by_id, sync_all_daw_params_from_synth,
    write_daw_param_by_id,
};
use crate::plugin::{CzPluginDspState, build_rt_synth_params};
use crate::runtime_state::{NativeUiParamChange, NativeUiParamKey, ScopeFrame};

pub(crate) const MAX_UI_INPUT_EVENTS_PER_BLOCK: usize = 64;

pub struct AudioRuntime {
    pub(crate) processor: Option<CosmoProcessor>,
    pub(crate) cached_synth_params_version: u64,
    pub(crate) cached_rt_synth_params: Arc<SynthParams>,
    pub(crate) block_input_events: Vec<CosmoTimedInputEvent>,
    pub(crate) mono_output: Vec<f32>,
    pub(crate) daw_params_dirty: bool,
    pub(crate) last_scope_hz: f32,
    pub(crate) scope_frame: ScopeFrame,
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
            scope_frame: ScopeFrame::default(),
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

impl CzPluginDspState {
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
        self.shared_state.presets.session.rcu(|current| {
            let mut next = (**current).clone();
            next.is_dirty = true;
            next
        });

        if update_processor && let Some(proc) = self.audio.processor.as_mut() {
            proc.set_shared_params(rt_params);
        }
    }

    pub(crate) fn apply_midi_mapping(
        &mut self,
        params: &crate::params::CzPluginParams,
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
        sync_all_daw_params_from_synth(params, &synth_params);
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

    pub(crate) fn changed_param_ids(events: &EventList) -> Vec<u32> {
        let mut ids: Vec<u32> = Vec::new();
        for event in events.iter() {
            if let EventBody::ParamChange { id, .. } = event.body
                && DAW_PARAM_IDS.contains(&id)
                && !ids.contains(&id)
            {
                ids.push(id);
            }
        }
        ids
    }

    pub(crate) fn current_transport_state(transport: &TransportInfo) -> CosmoTransportState {
        CosmoTransportState {
            tempo_bpm: (transport.tempo.is_finite() && transport.tempo > 0.0)
                .then_some(transport.tempo as f32),
            playing: transport.playing,
            position_beats: transport.position_beats,
        }
    }

    pub(crate) fn sync_runtime_params_from_host_with_params(
        &mut self,
        params: &crate::params::CzPluginParams,
        events: &EventList,
    ) {
        let changed_param_ids = Self::changed_param_ids(events);
        let has_param_change_events = !changed_param_ids.is_empty();
        let params_version = self
            .shared_state
            .synth
            .synth_params_version
            .load(Ordering::Acquire);
        let mut host_param_changes: Vec<u32> = Vec::new();
        if params_version == self.audio.cached_synth_params_version {
            for &param_id in DAW_PARAM_IDS {
                if changed_param_ids.contains(&param_id) {
                    continue;
                }
                let Some(current) = read_current_daw_param_by_id(params, param_id) else {
                    continue;
                };
                let Some(cached) =
                    read_daw_param_by_id(&self.audio.cached_rt_synth_params, param_id)
                else {
                    continue;
                };
                if (current - cached).abs() > 0.000_001 {
                    host_param_changes.push(param_id);
                }
            }
        }
        let host_params_changed = !host_param_changes.is_empty();
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
            let mut merged_params = (*self.shared_state.synth.rt_synth_params.load_full()).clone();
            apply_daw_params(&mut merged_params, params);
            merged_params
        } else {
            let mut merged_params = (*self.audio.cached_rt_synth_params).clone();
            apply_daw_params(&mut merged_params, params);
            merged_params
        };

        let mut merged = merged;
        if has_param_change_events {
            for &id in &changed_param_ids {
                let Some(prev_value) = read_daw_param_by_id(&previous_rt, id) else {
                    continue;
                };
                let _ = write_daw_param_by_id(&mut merged, id, f64::from(prev_value));
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
        for &id in &host_param_changes {
            self.enqueue_daw_ui_param_changes(id, &merged);
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

    #[cfg(test)]
    pub(crate) fn sync_runtime_params_from_host(&mut self, events: &EventList) {
        let params = self.test_params();
        self.sync_runtime_params_from_host_with_params(params.as_ref(), events);
    }

    pub(crate) fn handle_cc_side_effects(
        &mut self,
        params: &crate::params::CzPluginParams,
        channel: u8,
        cc: u8,
        value: u8,
    ) {
        let _ = self
            .shared_state
            .midi_learn
            .capture_pending_binding(channel, cc);
        let changes = self.apply_midi_mapping(params, channel, cc, value);
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

    pub(crate) fn handle_host_event_side_effects(
        &mut self,
        params: &crate::params::CzPluginParams,
        body: &EventBody,
    ) {
        match body {
            EventBody::ControlChange {
                channel, cc, value, ..
            } => self.handle_cc_side_effects(params, *channel, *cc, *value),
            EventBody::ControlChange2 {
                channel, cc, value, ..
            } => {
                let raw_value = (*value / 128) as u8;
                self.handle_cc_side_effects(params, *channel, *cc, raw_value);
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
                self.apply_factory_preset(params, usize::from(*program), false);
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

    pub(crate) fn collect_block_input_events(
        &mut self,
        params: &crate::params::CzPluginParams,
        events: &EventList,
        num_samples: usize,
    ) {
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
            self.handle_host_event_side_effects(params, &event.body);
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
        let params = self.test_params();
        self.process_host_events_into_buffer_with_params(params.as_ref(), events, num_samples);
    }

    #[cfg(test)]
    pub(crate) fn process_host_events_into_buffer_with_params(
        &mut self,
        params: &crate::params::CzPluginParams,
        events: &EventList,
        num_samples: usize,
    ) {
        self.collect_block_input_events(params, events, num_samples);
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
        let params = self.test_params();
        self.handle_host_event_with_params(params.as_ref(), body);
    }

    #[cfg(test)]
    pub(crate) fn handle_host_event_with_params(
        &mut self,
        params: &crate::params::CzPluginParams,
        body: &EventBody,
    ) {
        self.handle_host_event_side_effects(params, body);
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
        params: &crate::params::CzPluginParams,
        buffer: &mut AudioBuffer,
        events: &EventList,
        context: &mut ProcessContext,
    ) -> ProcessStatus {
        let Some(_) = self.audio.processor else {
            return ProcessStatus::Normal;
        };

        let num_samples = buffer.num_samples();
        let performance_started_at = self
            .shared_state
            .performance
            .enabled
            .load(Ordering::Relaxed)
            .then(Instant::now);
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

        self.collect_block_input_events(params, events, num_samples);
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
        self.audio
            .scope_frame
            .push_block(mono_output, proc.sample_rate, hz);
        if let Some(mut telemetry) = self.shared_state.telemetry.exchange.acquire_frame() {
            telemetry.mod_sources = proc.runtime_mod_sources();
            telemetry.voice_count =
                proc.write_runtime_voice_debug_state_slice(&mut telemetry.voice_states);
            self.audio
                .scope_frame
                .copy_linear_into(&mut telemetry.scope_samples);
            telemetry.scope_sample_rate = proc.sample_rate;
            telemetry.scope_hz = hz;
            self.shared_state
                .telemetry
                .exchange
                .publish_frame(telemetry);
        }

        let peak = mono_output[..num_samples]
            .iter()
            .fold(0.0f32, |acc, &sample| acc.max(sample.abs()));
        context.set_meter(CzPluginParamsParamId::MeterL as u32, peak);
        context.set_meter(CzPluginParamsParamId::MeterR as u32, peak);

        for ch in 0..buffer.num_output_channels() {
            buffer.output(ch)[..num_samples].copy_from_slice(mono_output);
        }

        if let Some(started_at) = performance_started_at {
            let active_voices = proc
                .voices
                .iter()
                .filter(|voice| !voice.is_silent && voice.note.is_some())
                .count() as u32;
            self.shared_state.performance.record_block(
                started_at.elapsed().as_nanos().min(u128::from(u64::MAX)) as u64,
                num_samples,
                proc.sample_rate,
                active_voices,
            );
        }

        let has_tail = proc.voices.iter().any(|voice| !voice.is_silent);
        if has_tail {
            ProcessStatus::Tail((proc.sample_rate * 10.0) as u32)
        } else {
            ProcessStatus::Normal
        }
    }
}
