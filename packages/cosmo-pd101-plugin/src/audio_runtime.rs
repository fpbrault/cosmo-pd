use std::sync::Arc;
use std::sync::atomic::Ordering;

use arrayvec::ArrayVec;
use cosmo_pd101_bridge_types::UiAlgoControlSection;
use cosmo_synth_engine::params::{
    AppliedMidiAlgoControlSection, AppliedMidiParamChange, AppliedMidiParamTarget, SynthParams,
    apply_midi_mapping_binding, apply_midi_mapping_binding_rt, set_parameter_value_by_key,
};
use cosmo_synth_engine::processor::{
    CosmoInputEvent, CosmoProcessor, CosmoTimedInputEvent, CosmoTransportState,
};
use truce::prelude::*;
use truce_core::events::TransportInfo;
use truce_core::midi::{norm_7bit, norm_pitch_bend};

use crate::params::{
    CzPluginParams, CzPluginParamsParamId, daw_param_key_by_id, read_current_daw_param_by_id,
    read_daw_param_by_id, sync_all_daw_params_from_synth,
};
use crate::plugin::{CzPlugin, build_rt_synth_params};
use crate::rt_safety::ControlContext;
use crate::runtime_state::{
    NativeUiParamChange, NativeUiParamKey, PluginSharedState, RenderControlEvent,
};

pub(crate) const MAX_UI_INPUT_EVENTS_PER_BLOCK: usize = 64;
pub(crate) const MAX_BLOCK_INPUT_EVENTS: usize = 1024;

pub struct AudioRuntime {
    pub(crate) processor: Option<CosmoProcessor>,
    pub(crate) cached_rt_synth_params: Arc<SynthParams>,
    pub(crate) block_input_events: ArrayVec<CosmoTimedInputEvent, MAX_BLOCK_INPUT_EVENTS>,
    pub(crate) mono_output: Vec<f32>,
    pub(crate) daw_params_dirty: bool,
    pub(crate) last_daw_param_values: [f32; CzPlugin::TRACKED_PARAM_ID_CAPACITY],
    pub(crate) last_scope_hz: f32,
    pub(crate) voice_limit: usize,
    /// Latest `synth_params_version` consumed by the audio processor via
    /// `copy_params_for_realtime`. Written *only* by the audio thread after a
    /// successful copy. The control thread must not update this value when
    /// publishing shared params — it bumps `synth_params_version`, but audio
    /// consumption happens here. Initial `reset()`/`apply_preset_state()` may
    /// seed it because they initialize the processor directly.
    pub(crate) cached_synth_params_version: u64,
}

impl AudioRuntime {
    pub fn new(default_rt_params: SynthParams) -> Self {
        Self {
            processor: None,
            cached_rt_synth_params: Arc::new(default_rt_params),
            block_input_events: ArrayVec::new(),
            mono_output: Vec::new(),
            daw_params_dirty: true,
            last_daw_param_values: [f32::NAN; CzPlugin::TRACKED_PARAM_ID_CAPACITY],
            last_scope_hz: 220.0,
            voice_limit: crate::global_settings::DEFAULT_VOICE_LIMIT as usize,
            cached_synth_params_version: 0,
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
    ctx: &ControlContext,
    shared_state: &PluginSharedState,
    params: &CzPluginParams,
) {
    crate::rt_safety::assert_not_rt("drain render control events");
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

                let bindings = shared_state.midi_learn.bindings_snapshot();
                let normalized = f32::from(value) / 127.0;
                let mut changes: Vec<AppliedMidiParamChange> = Vec::new();
                let params_ref = pending_params.get_or_insert_with(|| {
                    shared_state.synth.synth_params.load_full().as_ref().clone()
                });
                for binding in bindings.iter() {
                    if let Some(change) = apply_midi_mapping_binding(
                        params_ref,
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
                    shared_state
                        .ui
                        .render_control_diagnostics
                        .midi_mapping_misses
                        .fetch_add(1, Ordering::Relaxed);
                }

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
                    let _ = shared_state.ui.ui_param_change_queue.push(ui_change);
                }

                // Control-thread commit of any RT-stashed MIDI-learn capture.
                // Persistence happens here, never on the audio thread.
                shared_state.midi_learn.commit_pending_capture();
            }
            RenderControlEvent::MappedParamChange { param_key, value } => {
                let next_params = pending_params.get_or_insert_with(|| {
                    shared_state.synth.synth_params.load_full().as_ref().clone()
                });
                let _ = set_parameter_value_by_key(next_params, param_key, value);
                // Derive frontend UI patches from the coherent post-change
                // params. The webview uses a computed `line2DetuneOctave`
                // virtual key, not the raw `line2.octave` value, so both
                // `line1Octave` and `line2Octave` produce derived patches.
                // Computed here (control thread) instead of pushing from RT.
                match param_key {
                    "line1Octave" => {
                        let line1_oct = next_params.line1.octave;
                        let line2_oct = next_params.line2.octave;
                        let _ = shared_state.ui.ui_param_change_queue.push(
                            NativeUiParamChange::Scalar {
                                key: NativeUiParamKey::Static("lineOctave"),
                                value: line1_oct,
                            },
                        );
                        let _ = shared_state.ui.ui_param_change_queue.push(
                            NativeUiParamChange::Scalar {
                                key: NativeUiParamKey::Static("line2DetuneOctave"),
                                value: line2_oct - line1_oct,
                            },
                        );
                    }
                    "line2Octave" => {
                        let line1_oct = next_params.line1.octave;
                        let line2_oct = next_params.line2.octave;
                        let _ = shared_state.ui.ui_param_change_queue.push(
                            NativeUiParamChange::Scalar {
                                key: NativeUiParamKey::Static("line2DetuneOctave"),
                                value: line2_oct - line1_oct,
                            },
                        );
                    }
                    _ => {
                        let _ = shared_state.ui.ui_param_change_queue.push(
                            NativeUiParamChange::Scalar {
                                key: NativeUiParamKey::Static(param_key),
                                value,
                            },
                        );
                    }
                }
            }
            RenderControlEvent::ProgramChangeRequest { program } => {
                publish_pending_mapped_params(ctx, shared_state, params, &mut pending_params);
                apply_factory_preset_on_control_thread(
                    ctx,
                    shared_state,
                    params,
                    usize::from(program),
                );
            }
        }
    }
    publish_pending_mapped_params(ctx, shared_state, params, &mut pending_params);
}

fn publish_pending_mapped_params(
    ctx: &ControlContext,
    shared_state: &PluginSharedState,
    params: &CzPluginParams,
    pending_params: &mut Option<SynthParams>,
) {
    let Some(next_params) = pending_params.take() else {
        return;
    };
    publish_synth_params_from_control_thread(ctx, shared_state, params, next_params, true);
}

fn publish_synth_params_from_control_thread(
    _ctx: &ControlContext,
    shared_state: &PluginSharedState,
    params: &CzPluginParams,
    next_params: SynthParams,
    mark_dirty: bool,
) {
    crate::rt_safety::assert_not_rt("publish shared synth parameters");
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

    // NOTE: do not advance `cached_synth_params_version` here. That field
    // tracks the version *consumed* by the audio processor via
    // `copy_params_for_realtime`. Bumping `synth_params_version` from the
    // control thread is correct — audio will observe the new version on the
    // next block, copy it successfully, and advance the consumed version.
    // Only `reset()`/`apply_preset_state()` may seed the consumed version
    // because they initialise the processor directly.

    if mark_dirty && let Ok(mut session) = shared_state.presets.session.lock() {
        session.is_dirty = true;
    }
}

fn apply_factory_preset_on_control_thread(
    ctx: &ControlContext,
    shared_state: &PluginSharedState,
    params: &CzPluginParams,
    index: usize,
) {
    crate::rt_safety::assert_not_rt("apply factory preset");
    let Some(next_params) = crate::ffi::factory_preset_params(index).cloned() else {
        return;
    };
    let identity = crate::ffi::factory_preset_identity(index)
        .map(|(id, name)| (id.to_string(), name.to_string()));

    shared_state
        .preset_reset_pending
        .store(true, Ordering::Release);
    publish_synth_params_from_control_thread(ctx, shared_state, params, next_params, false);

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
        let params_version = self
            .shared_state
            .synth
            .synth_params_version
            .load(Ordering::Acquire);

        let Some(proc) = self.audio.processor.as_mut() else {
            return;
        };

        // If shared state version advanced (e.g. after control-thread publish),
        // copy full params from the ArcSwap Guard into processor (RT-safe:
        // Guard is non-allocating, copy_params_for_realtime preallocated).
        let cached_version = self.audio.cached_synth_params_version;
        let mut snapshot_copied = false;
        if params_version != cached_version {
            let guard = self.shared_state.synth.rt_synth_params.load();
            let copied = proc.copy_params_for_realtime(&guard);
            if !copied {
                self.shared_state
                    .ui
                    .render_control_diagnostics
                    .parameter_snapshot_rejections
                    .fetch_add(1, Ordering::Relaxed);
                // Trip debug assertion AFTER bumping the rejection counter but
                // BEFORE advancing cached_synth_params_version, so the snapshot
                // remains pending and is retried on the next block.
                debug_assert!(false, "realtime snapshot exceeded preallocated storage");
            } else {
                snapshot_copied = true;
                // Only now has audio consumed this version: the processor has
                // successfully copied the snapshot into its preallocated storage.
                self.audio.cached_synth_params_version = params_version;
            }
        }

        // Detect DAW drift: params whose DAW-side value differs from the
        // processor's current params (not already covered by ParamChange events).
        // Apply directly to processor and enqueue MappedParamChange for the
        // control thread to mirror to shared state.
        //
        // Skipped immediately after a snapshot copy — the snapshot is the
        // authoritative source and drift detection would overwrite it with
        // stale DAW values.
        //
        // Note: we access `self.shared_state` directly (not via `self.enqueue_*`)
        // because `proc` holds `&mut self.audio.processor`; disjoint-field
        // borrows are allowed by the borrow checker.
        if !snapshot_copied {
            for (id, changed) in tracked_param_changes.iter().enumerate() {
                if *changed {
                    continue;
                }
                let param_id = id as u32;
                let Some(current) = read_current_daw_param_by_id(&self.params, param_id) else {
                    continue;
                };
                let Some(cached) = read_daw_param_by_id(&proc.params, param_id) else {
                    continue;
                };
                if (current - cached).abs() <= 0.000_001 {
                    continue;
                }
                let Some(param_key) = daw_param_key_by_id(param_id) else {
                    continue;
                };
                proc.apply_parameter_change_realtime(param_key, current);
                // Enqueue MappedParamChange so the control thread can mirror
                // the change to shared state, derive frontend UI patches from
                // coherent post-change params, and bump synth_params_version.
                if self
                    .shared_state
                    .ui
                    .render_control_queue
                    .push(RenderControlEvent::MappedParamChange {
                        param_key,
                        value: current,
                    })
                    .is_err()
                {
                    self.shared_state
                        .ui
                        .render_control_diagnostics
                        .queue_overflows
                        .fetch_add(1, Ordering::Relaxed);
                }
            }
        }

        // Handle preset reset (atomic bool check via swap — RT-safe).
        if self
            .shared_state
            .preset_reset_pending
            .swap(false, Ordering::Acquire)
        {
            proc.reset_audio_state();
        }
    }

    pub(crate) fn handle_cc_side_effects(&mut self, channel: u8, cc: u8, value: u8) {
        // Apply MIDI mapping to processor params (RT-safe path).
        // Uses bindings() Guard (no alloc) and apply_midi_mapping_binding_rt (no alloc).
        if let Some(proc) = self.audio.processor.as_mut() {
            let bindings = self.shared_state.midi_learn.bindings();
            if !bindings.is_empty() {
                let normalized = f32::from(value) / 127.0;
                let mut any_applied = false;
                for binding in bindings.iter() {
                    if apply_midi_mapping_binding_rt(
                        &mut proc.params,
                        &binding.param_key,
                        binding.channel,
                        binding.cc,
                        channel,
                        cc,
                        normalized,
                    ) {
                        any_applied = true;
                    }
                }
                if any_applied {
                    proc.refresh_parameter_caches();
                } else {
                    self.shared_state
                        .ui
                        .render_control_diagnostics
                        .midi_mapping_misses
                        .fetch_add(1, Ordering::Relaxed);
                }
            }
        }
        // RT-safe: stash the CC source for MIDI-learn capture. The control
        // thread commits it to in-memory bindings + global settings.
        self.shared_state
            .midi_learn
            .capture_pending_binding_rt(channel, cc);
        // Still enqueue ObservedCc for control-side drain (shared state mirror,
        // UI AlgoControl change publication, MIDI learn commit/persistence).
        self.enqueue_render_control_event(RenderControlEvent::ObservedCc { channel, cc, value });
    }

    pub(crate) fn push_block_input_event(&mut self, event: CosmoTimedInputEvent) {
        if self.audio.block_input_events.try_push(event).is_err() {
            self.shared_state
                .ui
                .render_control_diagnostics
                .block_event_overflows
                .fetch_add(1, Ordering::Relaxed);
        }
    }

    pub(crate) fn handle_host_event_side_effects(
        &mut self,
        _sample_offset: usize,
        body: &EventBody,
    ) {
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
                if let Ok(index) = usize::try_from(*id)
                    && index < self.audio.last_daw_param_values.len()
                {
                    self.audio.last_daw_param_values[index] = *value as f32;
                }
                self.audio.daw_params_dirty = true;
                if let Some(param_key) = daw_param_key_by_id(*id) {
                    // Apply to processor now so audio is effective immediately.
                    let value_f32 = *value as f32;
                    if let Some(proc) = self.audio.processor.as_mut() {
                        proc.apply_parameter_change_realtime(param_key, value_f32);
                    }
                    // Enqueue MappedParamChange so the control thread can
                    // mirror to shared state, derive UI patches (including the
                    // octave derivation) from coherent post-change params, and
                    // bump synth_params_version.
                    self.enqueue_render_control_event(RenderControlEvent::MappedParamChange {
                        param_key,
                        value: value_f32,
                    });
                }
            }
            EventBody::ProgramChange { program, .. }
            | EventBody::ProgramChange2 { program, .. }
                if usize::from(*program) < crate::ffi::factory_preset_count() =>
            {
                self.apply_factory_preset_realtime(usize::from(*program));
                self.enqueue_render_control_event(RenderControlEvent::ProgramChangeRequest {
                    program: *program,
                });
            }
            _ => {}
        }
    }

    /// Apply a factory preset to the audio processor without allocating.
    ///
    /// RT-safe: `factory_preset_params()` returns a `&'static SynthParams`
    /// preloaded on the control thread (see `preload_factory_presets()`).
    /// `copy_params_for_realtime()` copies into preallocated storage with
    /// bounded capacity checks. No Arc, Vec, lock, or I/O here.
    /// UI/session mirroring for the program change is deferred to
    /// `drain_render_control_events()` via `ProgramChangeRequest`.
    fn apply_factory_preset_realtime(&mut self, index: usize) {
        let Some(next_params) = crate::ffi::factory_preset_params(index) else {
            return;
        };
        let Some(proc) = self.audio.processor.as_mut() else {
            return;
        };
        proc.reset_audio_state();
        let copied = proc.copy_params_for_realtime(next_params);
        if !copied {
            self.shared_state
                .ui
                .render_control_diagnostics
                .parameter_snapshot_rejections
                .fetch_add(1, Ordering::Relaxed);
        }
        debug_assert!(
            copied,
            "factory preset exceeded preallocated realtime storage"
        );
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
        for _ in 0..MAX_UI_INPUT_EVENTS_PER_BLOCK {
            let Some(event) = self.shared_state.ui.ui_input_queue.pop() else {
                break;
            };
            self.push_block_input_event(CosmoTimedInputEvent {
                sample_offset: 0,
                event,
            });
        }

        for event in events.iter() {
            let sample_offset = (event.sample_offset as usize).min(num_samples);
            self.handle_host_event_side_effects(sample_offset, &event.body);
            if let Some(engine_event) = Self::host_event_to_engine_event(&event.body) {
                self.push_block_input_event(CosmoTimedInputEvent {
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
        self.audio.block_input_events.clear();
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
        // Mirrors `process_rt` ordering only. Production path owns:
        //   1. sync_runtime_params_from_host(&EventList::default())
        //   2. handle_host_event_side_effects(0, body)
        //   3. push timed engine event if applicable
        //   4. processor.process_block(...)
        //
        // PER PR #316 FIX: No test-only capture_pending_binding() call, no
        // conditional drain_render_control_events(), no cached_rt_synth_params
        // refresh. Tests that need control-side publication must call
        // drain_render_control_events() explicitly so the RT boundary is
        // visible (see `midi_mapping_applies_*` and `daw_*` tests).
        self.audio.block_input_events.clear();
        self.sync_runtime_params_from_host(&EventList::default());
        self.handle_host_event_side_effects(0, body);
        if let Some(engine_event) = Self::host_event_to_engine_event(body) {
            self.push_block_input_event(CosmoTimedInputEvent {
                sample_offset: 0,
                event: engine_event,
            });
        }
        if let Some(proc) = self.audio.processor.as_mut() {
            proc.process_block(
                &mut [],
                &self.audio.block_input_events,
                CosmoTransportState::default(),
            );
        }
    }

    pub(crate) fn render_audio_block(
        &mut self,
        _rt: &crate::rt_safety::RtContext,
        buffer: &mut AudioBuffer,
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
