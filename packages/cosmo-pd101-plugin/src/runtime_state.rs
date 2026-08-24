use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, AtomicU8, AtomicU32, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};

use arc_swap::{ArcSwap, ArcSwapOption};
use cosmo_synth_engine::params::{AlgoControlId, MAX_VOICES, SynthParams};
use cosmo_synth_engine::processor::CosmoInputEvent;
use cosmo_synth_engine::processor::state::{RuntimeModSources, RuntimeVoiceDebugState};
use crossbeam_queue::ArrayQueue;
use truce_core::events::TransportInfo;

use crate::midi_learn::MidiLearnService;
use crate::preset_library::PresetLibrary;
use crate::preset_service::PresetService;
use cosmo_pd101_bridge_types::{
    EditorState, MidiLearnState, PerformanceMetricsResponse, PresetSession, TransportInfoResponse,
    UiAlgoControlSection, UiParamChange,
};

pub const SCOPE_CAPACITY: usize = 4096;
pub const UI_INPUT_QUEUE_CAPACITY: usize = 1024;
pub const MIDI_CC_QUEUE_CAPACITY: usize = 128;
pub const UI_PARAM_CHANGE_QUEUE_CAPACITY: usize = 128;
const RUNTIME_TELEMETRY_FRAME_COUNT: usize = 3;

pub type ScopeBuffer = Arc<Mutex<ScopeFrame>>;
pub type UiInputQueue = Arc<ArrayQueue<CosmoInputEvent>>;
pub type MidiCcQueue = Arc<ArrayQueue<(u8, u8, u8)>>;
#[derive(Debug)]
pub enum NativeUiParamKey {
    Static(&'static str),
    Owned(String),
}

#[derive(Debug)]
pub enum NativeUiParamChange {
    Scalar {
        key: NativeUiParamKey,
        value: f32,
    },
    AlgoControl {
        line: u8,
        section: UiAlgoControlSection,
        control_id: AlgoControlId,
        value: f32,
    },
}

pub type UiParamChangeQueue = Arc<ArrayQueue<NativeUiParamChange>>;
pub type SharedSynthParams = Arc<ArcSwap<SynthParams>>;
pub type SharedRtSynthParams = Arc<ArcSwap<SynthParams>>;
pub type SharedRuntimeModSources = Arc<ArcSwap<RuntimeModSources>>;
pub type SharedRuntimeVoiceStates = Arc<ArcSwap<Vec<RuntimeVoiceDebugState>>>;
pub type SharedTransportSnapshot = Arc<TransportSnapshot>;
pub type SynthParamsVersion = Arc<AtomicU64>;
pub type SharedPresetSession = Arc<ArcSwap<PresetSession>>;
pub type SharedEditorState = Arc<ArcSwapOption<EditorState>>;
pub type SharedMidiMappings = Arc<Mutex<MidiLearnState>>;
pub type SharedStateSnapshot = Arc<ArcSwap<Vec<u8>>>;

/// Lock-free, opt-in audio callback counters for the local diagnostics HUD.
/// No allocation or locking occurs when the audio thread records a block.
pub struct PerformanceCounters {
    pub enabled: AtomicBool,
    block_count: AtomicU64,
    total_ns: AtomicU64,
    last_ns: AtomicU64,
    max_ns: AtomicU64,
    over_budget_blocks: AtomicU64,
    block_samples: AtomicU32,
    sample_rate_bits: AtomicU64,
    active_voices: AtomicU32,
}

impl Default for PerformanceCounters {
    fn default() -> Self {
        Self {
            enabled: AtomicBool::new(false),
            block_count: AtomicU64::new(0),
            total_ns: AtomicU64::new(0),
            last_ns: AtomicU64::new(0),
            max_ns: AtomicU64::new(0),
            over_budget_blocks: AtomicU64::new(0),
            block_samples: AtomicU32::new(0),
            sample_rate_bits: AtomicU64::new(0),
            active_voices: AtomicU32::new(0),
        }
    }
}

impl PerformanceCounters {
    pub fn set_enabled(&self, enabled: bool) {
        self.enabled.store(enabled, Ordering::Release);
        if !enabled {
            self.block_count.store(0, Ordering::Relaxed);
            self.total_ns.store(0, Ordering::Relaxed);
            self.last_ns.store(0, Ordering::Relaxed);
            self.max_ns.store(0, Ordering::Relaxed);
            self.over_budget_blocks.store(0, Ordering::Relaxed);
        }
    }

    pub fn record_block(
        &self,
        elapsed_ns: u64,
        block_samples: usize,
        sample_rate: f32,
        active_voices: u32,
    ) {
        if !self.enabled.load(Ordering::Relaxed) {
            return;
        }
        let samples = block_samples as u32;
        let budget_ns = if sample_rate > 0.0 {
            (block_samples as f64 / f64::from(sample_rate) * 1_000_000_000.0) as u64
        } else {
            0
        };
        self.block_count.fetch_add(1, Ordering::Relaxed);
        self.total_ns.fetch_add(elapsed_ns, Ordering::Relaxed);
        self.last_ns.store(elapsed_ns, Ordering::Relaxed);
        self.max_ns.fetch_max(elapsed_ns, Ordering::Relaxed);
        if budget_ns > 0 && elapsed_ns > budget_ns {
            self.over_budget_blocks.fetch_add(1, Ordering::Relaxed);
        }
        self.block_samples.store(samples, Ordering::Relaxed);
        self.sample_rate_bits
            .store(f64::from(sample_rate).to_bits(), Ordering::Relaxed);
        self.active_voices.store(active_voices, Ordering::Relaxed);
    }

    pub fn snapshot(&self) -> PerformanceMetricsResponse {
        let block_count = self.block_count.load(Ordering::Acquire);
        let total_ns = self.total_ns.load(Ordering::Acquire);
        let block_samples = self.block_samples.load(Ordering::Acquire);
        let sample_rate = f64::from_bits(self.sample_rate_bits.load(Ordering::Acquire));
        let block_budget_ms = if sample_rate > 0.0 {
            f64::from(block_samples) / sample_rate * 1000.0
        } else {
            0.0
        };
        let avg_ms = if block_count > 0 {
            total_ns as f64 / block_count as f64 / 1_000_000.0
        } else {
            0.0
        };
        let last_ms = self.last_ns.load(Ordering::Acquire) as f64 / 1_000_000.0;
        let max_ms = self.max_ns.load(Ordering::Acquire) as f64 / 1_000_000.0;
        PerformanceMetricsResponse {
            enabled: self.enabled.load(Ordering::Acquire),
            block_count: block_count.min(u64::from(u32::MAX)) as u32,
            last_ms,
            avg_ms,
            max_ms,
            block_budget_ms,
            last_rt_percent: if block_budget_ms > 0.0 {
                last_ms / block_budget_ms * 100.0
            } else {
                0.0
            },
            avg_rt_percent: if block_budget_ms > 0.0 {
                avg_ms / block_budget_ms * 100.0
            } else {
                0.0
            },
            max_rt_percent: if block_budget_ms > 0.0 {
                max_ms / block_budget_ms * 100.0
            } else {
                0.0
            },
            block_samples,
            sample_rate,
            active_voices: self.active_voices.load(Ordering::Acquire),
            over_budget_blocks: self
                .over_budget_blocks
                .load(Ordering::Acquire)
                .min(u64::from(u32::MAX)) as u32,
        }
    }
}

pub struct RuntimeTelemetryFrame {
    pub mod_sources: RuntimeModSources,
    pub voice_states: [RuntimeVoiceDebugState; MAX_VOICES],
    pub voice_count: usize,
    pub scope_samples: [f32; SCOPE_CAPACITY],
    pub scope_sample_rate: f32,
    pub scope_hz: f32,
}

impl Default for RuntimeTelemetryFrame {
    fn default() -> Self {
        Self {
            mod_sources: RuntimeModSources::default(),
            voice_states: [RuntimeVoiceDebugState::default(); MAX_VOICES],
            voice_count: 0,
            scope_samples: [0.0; SCOPE_CAPACITY],
            scope_sample_rate: 44_100.0,
            scope_hz: 220.0,
        }
    }
}

pub struct RuntimeTelemetryExchange {
    free_frames: ArrayQueue<Box<RuntimeTelemetryFrame>>,
    ready_frames: ArrayQueue<Box<RuntimeTelemetryFrame>>,
    coalesced_frames: AtomicU64,
}

impl Default for RuntimeTelemetryExchange {
    fn default() -> Self {
        let exchange = Self {
            free_frames: ArrayQueue::new(RUNTIME_TELEMETRY_FRAME_COUNT),
            ready_frames: ArrayQueue::new(RUNTIME_TELEMETRY_FRAME_COUNT),
            coalesced_frames: AtomicU64::new(0),
        };
        for _ in 0..RUNTIME_TELEMETRY_FRAME_COUNT {
            let _ = exchange
                .free_frames
                .push(Box::new(RuntimeTelemetryFrame::default()));
        }
        exchange
    }
}

impl RuntimeTelemetryExchange {
    pub fn acquire_frame(&self) -> Option<Box<RuntimeTelemetryFrame>> {
        self.free_frames.pop().or_else(|| {
            let frame = self.ready_frames.pop();
            if frame.is_some() {
                self.coalesced_frames.fetch_add(1, Ordering::Relaxed);
            }
            frame
        })
    }

    pub fn publish_frame(&self, frame: Box<RuntimeTelemetryFrame>) {
        if let Err(frame) = self.ready_frames.push(frame) {
            self.coalesced_frames.fetch_add(1, Ordering::Relaxed);
            let _ = self.free_frames.push(frame);
        }
    }

    fn take_latest(&self) -> Option<Box<RuntimeTelemetryFrame>> {
        let mut latest = self.ready_frames.pop()?;
        while let Some(next) = self.ready_frames.pop() {
            self.release_frame(latest);
            self.coalesced_frames.fetch_add(1, Ordering::Relaxed);
            latest = next;
        }
        Some(latest)
    }

    fn release_frame(&self, frame: Box<RuntimeTelemetryFrame>) {
        let _ = self.free_frames.push(frame);
    }

    pub fn coalesced_frames(&self) -> u64 {
        self.coalesced_frames.load(Ordering::Relaxed)
    }
}

pub fn drain_and_coalesce_ui_param_changes(queue: &UiParamChangeQueue) -> Vec<UiParamChange> {
    let mut scalar_changes = HashMap::<String, f32>::new();
    let mut algo_changes = HashMap::<(u8, UiAlgoControlSection, AlgoControlId), f32>::new();

    while let Some(change) = queue.pop() {
        match change {
            NativeUiParamChange::Scalar { key, value } => {
                let key = match key {
                    NativeUiParamKey::Static(key) => key.to_string(),
                    NativeUiParamKey::Owned(key) => key,
                };
                scalar_changes.insert(key, value);
            }
            NativeUiParamChange::AlgoControl {
                line,
                section,
                control_id,
                value,
            } => {
                algo_changes.insert((line, section, control_id), value);
            }
        }
    }

    let mut changes = Vec::with_capacity(scalar_changes.len() + algo_changes.len());
    changes.extend(
        scalar_changes
            .into_iter()
            .map(|(key, value)| UiParamChange::Scalar { key, value }),
    );
    changes.extend(
        algo_changes
            .into_iter()
            .map(
                |((line, section, control_id), value)| UiParamChange::AlgoControl {
                    line,
                    section,
                    control_id: control_id.as_str().to_string(),
                    value,
                },
            ),
    );
    changes
}

pub struct ScopeFrame {
    samples: Vec<f32>,
    cursor: usize,
    sample_rate: f32,
    hz: f32,
}

impl Default for ScopeFrame {
    fn default() -> Self {
        Self {
            samples: vec![0.0; SCOPE_CAPACITY],
            cursor: 0,
            sample_rate: 44100.0,
            hz: 220.0,
        }
    }
}

impl ScopeFrame {
    pub fn push_block(&mut self, mono: &[f32], sample_rate: f32, hz: f32) {
        self.sample_rate = sample_rate;
        self.hz = hz;
        for &s in mono {
            if self.samples.len() < SCOPE_CAPACITY {
                self.samples.push(s);
            } else {
                self.samples[self.cursor] = s;
                self.cursor = (self.cursor + 1) % SCOPE_CAPACITY;
            }
        }
    }

    pub fn samples(&self) -> &[f32] {
        &self.samples
    }

    pub fn sample_rate(&self) -> f32 {
        self.sample_rate
    }

    pub fn hz(&self) -> f32 {
        self.hz
    }

    pub fn to_linear(&self) -> Vec<f32> {
        if self.samples.len() < SCOPE_CAPACITY {
            self.samples.clone()
        } else {
            let mut out = Vec::with_capacity(SCOPE_CAPACITY);
            out.extend_from_slice(&self.samples[self.cursor..]);
            out.extend_from_slice(&self.samples[..self.cursor]);
            out
        }
    }

    pub fn copy_linear_into(&self, output: &mut [f32; SCOPE_CAPACITY]) {
        if self.samples.len() < SCOPE_CAPACITY {
            output.fill(0.0);
            output[..self.samples.len()].copy_from_slice(&self.samples);
            return;
        }
        let split = SCOPE_CAPACITY - self.cursor;
        output[..split].copy_from_slice(&self.samples[self.cursor..]);
        output[split..].copy_from_slice(&self.samples[..self.cursor]);
    }

    fn replace_linear(&mut self, samples: &[f32; SCOPE_CAPACITY], sample_rate: f32, hz: f32) {
        self.samples.copy_from_slice(samples);
        self.cursor = 0;
        self.sample_rate = sample_rate;
        self.hz = hz;
    }
}

pub struct TransportSnapshot {
    playing: AtomicBool,
    recording: AtomicBool,
    tempo_bits: AtomicU64,
    time_sig_num: AtomicU32,
    time_sig_den: AtomicU32,
    position_samples: AtomicU64,
    position_seconds_bits: AtomicU64,
    position_beats_bits: AtomicU64,
    bar_start_beats_bits: AtomicU64,
    loop_active: AtomicBool,
    loop_start_beats_bits: AtomicU64,
    loop_end_beats_bits: AtomicU64,
}

impl Default for TransportSnapshot {
    fn default() -> Self {
        let transport = TransportInfo::default();
        Self::new(&transport)
    }
}

impl TransportSnapshot {
    pub fn new(transport: &TransportInfo) -> Self {
        let snapshot = Self {
            playing: AtomicBool::new(false),
            recording: AtomicBool::new(false),
            tempo_bits: AtomicU64::new(0),
            time_sig_num: AtomicU32::new(0),
            time_sig_den: AtomicU32::new(0),
            position_samples: AtomicU64::new(0),
            position_seconds_bits: AtomicU64::new(0),
            position_beats_bits: AtomicU64::new(0),
            bar_start_beats_bits: AtomicU64::new(0),
            loop_active: AtomicBool::new(false),
            loop_start_beats_bits: AtomicU64::new(0),
            loop_end_beats_bits: AtomicU64::new(0),
        };
        snapshot.store(transport);
        snapshot
    }

    pub fn store(&self, transport: &TransportInfo) {
        self.playing.store(transport.playing, Ordering::Release);
        self.recording.store(transport.recording, Ordering::Release);
        self.tempo_bits
            .store(transport.tempo.to_bits(), Ordering::Release);
        self.time_sig_num
            .store(u32::from(transport.time_sig_num), Ordering::Release);
        self.time_sig_den
            .store(u32::from(transport.time_sig_den), Ordering::Release);
        self.position_samples.store(
            u64::from_ne_bytes(transport.position_samples.to_ne_bytes()),
            Ordering::Release,
        );
        self.position_seconds_bits
            .store(transport.position_seconds.to_bits(), Ordering::Release);
        self.position_beats_bits
            .store(transport.position_beats.to_bits(), Ordering::Release);
        self.bar_start_beats_bits
            .store(transport.bar_start_beats.to_bits(), Ordering::Release);
        self.loop_active
            .store(transport.loop_active, Ordering::Release);
        self.loop_start_beats_bits
            .store(transport.loop_start_beats.to_bits(), Ordering::Release);
        self.loop_end_beats_bits
            .store(transport.loop_end_beats.to_bits(), Ordering::Release);
    }

    pub fn load(&self) -> TransportInfo {
        TransportInfo {
            playing: self.playing.load(Ordering::Acquire),
            recording: self.recording.load(Ordering::Acquire),
            tempo: f64::from_bits(self.tempo_bits.load(Ordering::Acquire)),
            time_sig_num: self.time_sig_num.load(Ordering::Acquire) as u8,
            time_sig_den: self.time_sig_den.load(Ordering::Acquire) as u8,
            position_samples: i64::from_ne_bytes(
                self.position_samples.load(Ordering::Acquire).to_ne_bytes(),
            ),
            position_seconds: f64::from_bits(self.position_seconds_bits.load(Ordering::Acquire)),
            position_beats: f64::from_bits(self.position_beats_bits.load(Ordering::Acquire)),
            bar_start_beats: f64::from_bits(self.bar_start_beats_bits.load(Ordering::Acquire)),
            loop_active: self.loop_active.load(Ordering::Acquire),
            loop_start_beats: f64::from_bits(self.loop_start_beats_bits.load(Ordering::Acquire)),
            loop_end_beats: f64::from_bits(self.loop_end_beats_bits.load(Ordering::Acquire)),
        }
    }

    pub fn to_response(&self) -> TransportInfoResponse {
        let transport = self.load();
        TransportInfoResponse {
            playing: transport.playing,
            recording: transport.recording,
            tempo: transport.tempo,
            time_sig_num: transport.time_sig_num,
            time_sig_den: transport.time_sig_den,
            position_samples: transport.position_samples as f64,
            position_seconds: transport.position_seconds,
            position_beats: transport.position_beats,
            bar_start_beats: transport.bar_start_beats,
            loop_active: transport.loop_active,
            loop_start_beats: transport.loop_start_beats,
            loop_end_beats: transport.loop_end_beats,
        }
    }
}

#[derive(Clone)]
pub struct SynthParamState {
    pub synth_params: SharedSynthParams,
    pub rt_synth_params: SharedRtSynthParams,
    pub synth_params_version: SynthParamsVersion,
}

#[derive(Clone)]
pub struct RuntimeTelemetry {
    pub runtime_mod_sources: SharedRuntimeModSources,
    pub runtime_voice_states: SharedRuntimeVoiceStates,
    pub transport_snapshot: SharedTransportSnapshot,
    pub scope_buffer: ScopeBuffer,
    pub exchange: Arc<RuntimeTelemetryExchange>,
}

impl RuntimeTelemetry {
    pub fn drain_latest(&self) -> bool {
        let Some(frame) = self.exchange.take_latest() else {
            return false;
        };
        self.runtime_mod_sources.store(Arc::new(frame.mod_sources));
        self.runtime_voice_states
            .store(Arc::new(frame.voice_states[..frame.voice_count].to_vec()));
        if let Ok(mut scope) = self.scope_buffer.lock() {
            scope.replace_linear(
                &frame.scope_samples,
                frame.scope_sample_rate,
                frame.scope_hz,
            );
        }
        self.exchange.release_frame(frame);
        true
    }
}

#[derive(Clone)]
pub struct UiEventQueues {
    pub ui_input_queue: UiInputQueue,
    pub midi_cc_queue: MidiCcQueue,
    pub ui_param_change_queue: UiParamChangeQueue,
    /// Set to true when IPC handler drains `ui_param_change_queue` via
    /// `GetPendingParamChanges`. Checked by `idle()` to skip redundant
    /// full-params sync when the JS rAF pull path is actively consuming
    /// native param patches. Reset to false by `idle()` each cycle.
    pub pending_param_changes_flushed_via_ipc: Arc<AtomicBool>,
}

#[derive(Clone)]
pub struct EditorSessionState {
    pub editor_state: SharedEditorState,
}

pub struct PluginSharedState {
    pub synth: SynthParamState,
    pub telemetry: RuntimeTelemetry,
    pub ui: UiEventQueues,
    pub editor: EditorSessionState,
    pub presets: PresetService,
    pub midi_learn: MidiLearnService,
    /// Pre-serialized custom state for Truce's audio-thread `snapshot_into`.
    /// Updated off the audio thread; copied lock-free during process.
    pub state_snapshot: SharedStateSnapshot,
    /// Synth parameter version represented by `state_snapshot`.
    pub state_snapshot_synth_version: AtomicU64,
    /// Monotonic generation for Truce's `snapshot_version` gate.
    pub state_snapshot_generation: AtomicU64,
    /// Runtime voice limit (1-16). Read/written by IPC, consumed by audio thread.
    pub voice_limit: AtomicU8,
    /// Set by `LoadPreset` IPC handler before publishing new params/version.
    /// Consumed by the audio thread in `sync_runtime_params_from_host` to call
    /// `processor.reset_audio_state()` *before* applying the new preset params.
    /// Ordering: IPC thread stores (Release), audio thread swaps (Acquire).
    pub preset_reset_pending: AtomicBool,
    pub performance: PerformanceCounters,
}

impl PluginSharedState {
    pub fn new(
        default_params: SynthParams,
        default_rt_params: SynthParams,
        preset_library: Arc<Mutex<PresetLibrary>>,
        midi_learn_state: MidiLearnState,
        voice_limit: u8,
    ) -> Self {
        let preset_session = Arc::new(ArcSwap::from_pointee(PresetSession::default()));
        Self {
            synth: SynthParamState {
                synth_params: Arc::new(ArcSwap::new(Arc::new(default_params))),
                rt_synth_params: Arc::new(ArcSwap::new(Arc::new(default_rt_params))),
                synth_params_version: Arc::new(AtomicU64::new(0)),
            },
            telemetry: RuntimeTelemetry {
                runtime_mod_sources: Arc::new(ArcSwap::new(Arc::new(RuntimeModSources::default()))),
                runtime_voice_states: Arc::new(ArcSwap::from_pointee(Vec::new())),
                transport_snapshot: Arc::new(TransportSnapshot::default()),
                scope_buffer: Arc::new(Mutex::new(ScopeFrame::default())),
                exchange: Arc::new(RuntimeTelemetryExchange::default()),
            },
            ui: UiEventQueues {
                ui_input_queue: Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY)),
                midi_cc_queue: Arc::new(ArrayQueue::new(MIDI_CC_QUEUE_CAPACITY)),
                ui_param_change_queue: Arc::new(ArrayQueue::new(UI_PARAM_CHANGE_QUEUE_CAPACITY)),
                pending_param_changes_flushed_via_ipc: Arc::new(AtomicBool::new(false)),
            },
            editor: EditorSessionState {
                editor_state: Arc::new(ArcSwapOption::empty()),
            },
            presets: PresetService::new(preset_library.clone(), preset_session),
            midi_learn: MidiLearnService::new(midi_learn_state),
            state_snapshot: Arc::new(ArcSwap::from_pointee(Vec::new())),
            state_snapshot_synth_version: AtomicU64::new(0),
            state_snapshot_generation: AtomicU64::new(0),
            voice_limit: AtomicU8::new(voice_limit),
            preset_reset_pending: AtomicBool::new(false),
            performance: PerformanceCounters::default(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shared_synth_state_publishes_params_and_versions() {
        let params = SynthParams::default();
        let library = Arc::new(Mutex::new(PresetLibrary::from_embedded_factory("[]")));
        let state = PluginSharedState::new(
            params.clone(),
            params,
            library,
            MidiLearnState::default(),
            crate::global_settings::DEFAULT_VOICE_LIMIT,
        );

        let updated = SynthParams {
            volume: 0.42,
            ..SynthParams::default()
        };
        state.synth.synth_params.store(Arc::new(updated));
        state
            .synth
            .synth_params_version
            .fetch_add(1, Ordering::Release);

        assert_eq!(state.synth.synth_params.load().volume, 0.42);
        assert_eq!(state.synth.synth_params_version.load(Ordering::Acquire), 1);
    }

    #[test]
    fn performance_counters_report_average_maximum_and_budget_overruns() {
        let counters = PerformanceCounters::default();
        counters.set_enabled(true);
        counters.record_block(3_000_000, 128, 48_000.0, 2);
        counters.record_block(4_000_000, 128, 48_000.0, 4);

        let snapshot = counters.snapshot();
        assert_eq!(snapshot.block_count, 2);
        assert_eq!(snapshot.block_samples, 128);
        assert_eq!(snapshot.sample_rate, 48_000.0);
        assert_eq!(snapshot.active_voices, 4);
        assert!((snapshot.avg_ms - 3.5).abs() < f64::EPSILON);
        assert!((snapshot.max_ms - 4.0).abs() < f64::EPSILON);
        assert!(snapshot.avg_rt_percent > 100.0);
        assert_eq!(snapshot.over_budget_blocks, 2);

        counters.set_enabled(false);
        let reset = counters.snapshot();
        assert_eq!(reset.block_count, 0);
        assert_eq!(reset.avg_ms, 0.0);
        assert_eq!(reset.max_ms, 0.0);
    }

    #[test]
    fn telemetry_exchange_coalesces_to_latest_frame() {
        let exchange = RuntimeTelemetryExchange::default();
        for value in [0.1, 0.2, 0.3, 0.4] {
            let mut frame = exchange
                .acquire_frame()
                .expect("preallocated telemetry frame");
            frame.mod_sources.lfo1 = value;
            exchange.publish_frame(frame);
        }

        let latest = exchange.take_latest().expect("published telemetry frame");
        assert_eq!(latest.mod_sources.lfo1, 0.4);
        assert!(exchange.coalesced_frames() > 0);
        exchange.release_frame(latest);
    }

    #[test]
    fn telemetry_drain_updates_ipc_snapshots() {
        let params = SynthParams::default();
        let library = Arc::new(Mutex::new(PresetLibrary::from_embedded_factory("[]")));
        let state = PluginSharedState::new(
            params.clone(),
            params,
            library,
            MidiLearnState::default(),
            crate::global_settings::DEFAULT_VOICE_LIMIT,
        );
        let mut frame = state
            .telemetry
            .exchange
            .acquire_frame()
            .expect("preallocated telemetry frame");
        frame.mod_sources.lfo1 = 0.75;
        frame.voice_count = 1;
        frame.voice_states[0].active = true;
        frame.voice_states[0].note = Some(64);
        frame.scope_samples[0] = 0.5;
        frame.scope_sample_rate = 48_000.0;
        frame.scope_hz = 330.0;
        state.telemetry.exchange.publish_frame(frame);

        assert!(state.telemetry.drain_latest());
        assert_eq!(state.telemetry.runtime_mod_sources.load().lfo1, 0.75);
        let voices = state.telemetry.runtime_voice_states.load();
        assert_eq!(voices.len(), 1);
        assert_eq!(voices[0].note, Some(64));
        let scope = state.telemetry.scope_buffer.lock().unwrap();
        assert_eq!(scope.samples()[0], 0.5);
        assert_eq!(scope.sample_rate(), 48_000.0);
        assert_eq!(scope.hz(), 330.0);
    }
}
