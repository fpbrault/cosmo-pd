//! Cosmo PD-101 Phase Distortion synthesizer — VST3/CLAP plugin via nih-plug.
//!
//! Uses nih-plug for VST3/CLAP plugin hosting and cosmo-synth-engine for the DSP engine.

#![recursion_limit = "256"]

use std::fs::OpenOptions;
use std::io::Write;
use std::sync::atomic::{AtomicBool, AtomicU32, AtomicU64, Ordering};
use std::sync::Arc;
use std::sync::Mutex;
use std::time::Instant;
use std::time::{SystemTime, UNIX_EPOCH};

use arc_swap::ArcSwap;
use cosmo_synth_engine::envelope::normalize_synth_params_envelopes_to_raw_if_human;
use cosmo_synth_engine::params::SynthParams;
use cosmo_synth_engine::processor::{midi_note_to_freq, CosmoProcessor};
use crossbeam_queue::ArrayQueue;
use nih_plug::prelude::*;

pub mod gui;

const PLUGIN_LOG_PATH: &str = "/tmp/cosmo-plugin.log";
const MAX_UI_INPUT_EVENTS_PER_BLOCK: usize = 64;
const UI_INPUT_QUEUE_CAPACITY: usize = 1024;

fn log_timestamp_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or_default()
}

pub fn append_log(message: &str) {
    if let Ok(mut file) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(PLUGIN_LOG_PATH)
    {
        let _ = writeln!(
            file,
            "[rust pid={} ts_ms={}] {}",
            std::process::id(),
            log_timestamp_ms(),
            message
        );
    }
}

pub fn plugin_log_path() -> &'static str {
    PLUGIN_LOG_PATH
}

// =============================================================================
// Scope ring buffer
// =============================================================================

/// Number of PCM samples kept in the scope ring buffer.
/// 4096 samples ≈ 93 ms at 44.1 kHz — enough to cover ≥2 cycles at ~22 Hz.
const SCOPE_CAPACITY: usize = 4096;

/// Rolling PCM buffer written by the audio thread and read by the GUI thread.
struct ScopeFrame {
    /// Circular buffer of mono samples in [-1, 1].
    samples: Vec<f32>,
    /// Write cursor (next position to overwrite once the buffer is full).
    cursor: usize,
    /// Sample rate reported by the audio engine.
    sample_rate: f32,
    /// Fundamental frequency of the currently sounding voice, or 0 if silent.
    hz: f32,
}

impl Default for ScopeFrame {
    fn default() -> Self {
        Self {
            samples: vec![0.0; SCOPE_CAPACITY],
            cursor: 0,
            sample_rate: 44100.0,
            hz: 0.0,
        }
    }
}

impl ScopeFrame {
    /// Append one audio block to the ring buffer (non-allocating once full).
    fn push_block(&mut self, mono: &[f32], sample_rate: f32, hz: f32) {
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

    /// Return all buffered samples in chronological order (oldest → newest).
    fn to_linear(&self) -> Vec<f32> {
        if self.samples.len() < SCOPE_CAPACITY {
            self.samples.clone()
        } else {
            let mut out = Vec::with_capacity(SCOPE_CAPACITY);
            out.extend_from_slice(&self.samples[self.cursor..]);
            out.extend_from_slice(&self.samples[..self.cursor]);
            out
        }
    }
}

/// Thread-safe scope buffer shared between the audio thread and the GUI thread.
type ScopeBuffer = Arc<Mutex<ScopeFrame>>;
type UiInputQueue = Arc<ArrayQueue<UiInputEvent>>;
type SharedSynthParams = Arc<ArcSwap<SynthParams>>;
type SharedRtSynthParams = Arc<ArcSwap<SynthParams>>;
type SynthParamsVersion = Arc<AtomicU64>;
type PerformanceCountersHandle = Arc<PerformanceCounters>;

fn build_rt_synth_params(params: &SynthParams) -> SynthParams {
    let mut rt_params = params.clone();
    normalize_synth_params_envelopes_to_raw_if_human(&mut rt_params);
    rt_params
}

struct PerformanceCounters {
    enabled: AtomicBool,
    block_count: AtomicU64,
    total_process_ns: AtomicU64,
    last_process_ns: AtomicU64,
    max_process_ns: AtomicU64,
    last_block_samples: AtomicU32,
    sample_rate_bits: AtomicU32,
    active_voices: AtomicU32,
    ui_queue_depth: AtomicU32,
    params_apply_count: AtomicU64,
}

impl Default for PerformanceCounters {
    fn default() -> Self {
        Self {
            enabled: AtomicBool::new(false),
            block_count: AtomicU64::new(0),
            total_process_ns: AtomicU64::new(0),
            last_process_ns: AtomicU64::new(0),
            max_process_ns: AtomicU64::new(0),
            last_block_samples: AtomicU32::new(0),
            sample_rate_bits: AtomicU32::new(44_100.0_f32.to_bits()),
            active_voices: AtomicU32::new(0),
            ui_queue_depth: AtomicU32::new(0),
            params_apply_count: AtomicU64::new(0),
        }
    }
}

impl PerformanceCounters {
    fn set_enabled(&self, enabled: bool) {
        self.enabled.store(enabled, Ordering::Release);
        if !enabled {
            self.reset();
        }
    }

    fn reset(&self) {
        self.block_count.store(0, Ordering::Release);
        self.total_process_ns.store(0, Ordering::Release);
        self.last_process_ns.store(0, Ordering::Release);
        self.max_process_ns.store(0, Ordering::Release);
        self.last_block_samples.store(0, Ordering::Release);
        self.active_voices.store(0, Ordering::Release);
        self.ui_queue_depth.store(0, Ordering::Release);
        self.params_apply_count.store(0, Ordering::Release);
    }

    fn record_param_apply(&self) {
        if self.enabled.load(Ordering::Acquire) {
            self.params_apply_count.fetch_add(1, Ordering::Relaxed);
        }
    }

    fn record_process_block(
        &self,
        elapsed_ns: u64,
        block_samples: usize,
        sample_rate: f32,
        active_voices: usize,
        ui_queue_depth: usize,
    ) {
        if !self.enabled.load(Ordering::Acquire) {
            return;
        }

        self.block_count.fetch_add(1, Ordering::Relaxed);
        self.total_process_ns
            .fetch_add(elapsed_ns, Ordering::Relaxed);
        self.last_process_ns.store(elapsed_ns, Ordering::Relaxed);
        self.last_block_samples
            .store(block_samples as u32, Ordering::Relaxed);
        self.sample_rate_bits
            .store(sample_rate.to_bits(), Ordering::Relaxed);
        self.active_voices
            .store(active_voices as u32, Ordering::Relaxed);
        self.ui_queue_depth
            .store(ui_queue_depth as u32, Ordering::Relaxed);

        let mut current_max = self.max_process_ns.load(Ordering::Relaxed);
        while elapsed_ns > current_max {
            match self.max_process_ns.compare_exchange_weak(
                current_max,
                elapsed_ns,
                Ordering::Relaxed,
                Ordering::Relaxed,
            ) {
                Ok(_) => break,
                Err(next) => current_max = next,
            }
        }
    }

    fn snapshot_json(&self) -> serde_json::Value {
        let enabled = self.enabled.load(Ordering::Acquire);
        let block_count = self.block_count.load(Ordering::Relaxed);
        let total_ns = self.total_process_ns.load(Ordering::Relaxed);
        let last_ns = self.last_process_ns.load(Ordering::Relaxed);
        let max_ns = self.max_process_ns.load(Ordering::Relaxed);
        let block_samples = self.last_block_samples.load(Ordering::Relaxed);
        let sample_rate = f32::from_bits(self.sample_rate_bits.load(Ordering::Relaxed)).max(1.0);
        let block_budget_ms = if block_samples == 0 {
            0.0
        } else {
            (block_samples as f64 / sample_rate as f64) * 1000.0
        };
        let last_ms = last_ns as f64 / 1_000_000.0;
        let max_ms = max_ns as f64 / 1_000_000.0;
        let avg_ms = if block_count == 0 {
            0.0
        } else {
            (total_ns as f64 / block_count as f64) / 1_000_000.0
        };

        serde_json::json!({
            "enabled": enabled,
            "blockCount": block_count,
            "lastMs": last_ms,
            "avgMs": avg_ms,
            "maxMs": max_ms,
            "blockBudgetMs": block_budget_ms,
            "lastRtPercent": if block_budget_ms > 0.0 { last_ms / block_budget_ms * 100.0 } else { 0.0 },
            "avgRtPercent": if block_budget_ms > 0.0 { avg_ms / block_budget_ms * 100.0 } else { 0.0 },
            "maxRtPercent": if block_budget_ms > 0.0 { max_ms / block_budget_ms * 100.0 } else { 0.0 },
            "blockSamples": block_samples,
            "sampleRate": sample_rate,
            "activeVoices": self.active_voices.load(Ordering::Relaxed),
            "uiQueueDepth": self.ui_queue_depth.load(Ordering::Relaxed),
            "paramsApplyCount": self.params_apply_count.load(Ordering::Relaxed),
        })
    }
}

#[allow(dead_code)]
#[derive(Debug, Clone, Copy)]
enum UiInputEvent {
    NoteOn { note: u8, velocity: f32 },
    NoteOff { note: u8 },
    Sustain { on: bool },
    PitchBend { value: f32 },
    ModWheel { value: f32 },
    Aftertouch { value: f32 },
    Panic,
}

// =============================================================================
// Minimal nih-plug Params struct (no DAW automation — all state flows through
// the JSON bridge).
// =============================================================================

#[derive(Params, Default)]
pub struct CzParams {}

// =============================================================================
// IPC dispatch
// =============================================================================

fn handle_ipc_invoke(
    method: &str,
    args: &[serde_json::Value],
    synth_params: &SharedSynthParams,
    rt_synth_params: &SharedRtSynthParams,
    synth_params_version: &SynthParamsVersion,
    scope_buffer: &ScopeBuffer,
    ui_input_queue: &UiInputQueue,
    performance_counters: &PerformanceCountersHandle,
) -> Result<serde_json::Value, String> {
    if method != "getScopeData" && method != "clientLog" {
        append_log(&format!("ipc invoke method={method} args={}", args.len()));
    }

    match method {
        "noteOn" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| "noteOn expects an object payload as first argument".to_string())?;
            let note = payload
                .get("note")
                .and_then(serde_json::Value::as_u64)
                .ok_or_else(|| "noteOn payload missing note".to_string())?;
            let velocity = payload
                .get("velocity")
                .and_then(serde_json::Value::as_f64)
                .unwrap_or(0.8_f64) as f32;
            let note = u8::try_from(note).map_err(|_| "noteOn note out of range".to_string())?;

            ui_input_queue
                .push(UiInputEvent::NoteOn { note, velocity })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "noteOff" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| "noteOff expects an object payload as first argument".to_string())?;
            let note = payload
                .get("note")
                .and_then(serde_json::Value::as_u64)
                .ok_or_else(|| "noteOff payload missing note".to_string())?;
            let note = u8::try_from(note).map_err(|_| "noteOff note out of range".to_string())?;

            ui_input_queue
                .push(UiInputEvent::NoteOff { note })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "sustain" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| "sustain expects an object payload as first argument".to_string())?;
            let on = payload
                .get("on")
                .and_then(serde_json::Value::as_bool)
                .ok_or_else(|| "sustain payload missing on".to_string())?;

            ui_input_queue
                .push(UiInputEvent::Sustain { on })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "pitchBend" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "pitchBend expects an object payload as first argument".to_string()
                })?;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "pitchBend payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(UiInputEvent::PitchBend { value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "modWheel" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "modWheel expects an object payload as first argument".to_string()
                })?;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "modWheel payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(UiInputEvent::ModWheel { value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "aftertouch" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "aftertouch expects an object payload as first argument".to_string()
                })?;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "aftertouch payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(UiInputEvent::Aftertouch { value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "panic" => {
            ui_input_queue
                .push(UiInputEvent::Panic)
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "setParams" => {
            let json_str = args
                .first()
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setParams expects a JSON string as first argument".to_string())?;
            let params: SynthParams = serde_json::from_str(json_str)
                .map_err(|e| format!("invalid SynthParams payload: {e}"))?;
            let rt_params = build_rt_synth_params(&params);
            synth_params.store(Arc::new(params));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);
            Ok(serde_json::Value::Null)
        }
        "getParams" => {
            let sp = synth_params.load();
            serde_json::to_value(sp.as_ref()).map_err(|e| e.to_string())
        }
        "getScopeData" => {
            let scope = scope_buffer
                .lock()
                .map_err(|_| "scope buffer is poisoned".to_string())?;
            if scope.samples.is_empty() {
                return Ok(
                    serde_json::json!({ "samples": [], "sampleRate": scope.sample_rate, "hz": 0.0_f64 }),
                );
            }
            let linear = scope.to_linear();
            let int_samples: Vec<i8> = linear
                .iter()
                .map(|&s| (s.clamp(-1.0, 1.0) * 127.0) as i8)
                .collect();
            Ok(
                serde_json::json!({ "samples": int_samples, "sampleRate": scope.sample_rate, "hz": scope.hz }),
            )
        }
        "setPerformanceMonitorEnabled" => {
            let enabled = args
                .first()
                .and_then(serde_json::Value::as_bool)
                .ok_or_else(|| "setPerformanceMonitorEnabled expects a boolean".to_string())?;
            performance_counters.set_enabled(enabled);
            Ok(serde_json::Value::Null)
        }
        "getPerformanceMetrics" => Ok(performance_counters.snapshot_json()),
        "clientLog" => {
            let level = args
                .first()
                .and_then(serde_json::Value::as_str)
                .unwrap_or("info");
            let message = args
                .get(1)
                .and_then(serde_json::Value::as_str)
                .unwrap_or("");
            append_log(&format!("[webview:{level}] {message}"));
            Ok(serde_json::Value::Null)
        }
        _ => Err(format!("unknown method: {method}")),
    }
}

// =============================================================================
// Plugin struct
// =============================================================================

pub struct CzPlugin {
    params: Arc<CzParams>,
    /// DSP engine, present after `initialize()`.
    processor: Option<CosmoProcessor>,
    /// Synth parameters shared with the GUI thread (set via `setParams` IPC).
    synth_params: SharedSynthParams,
    rt_synth_params: SharedRtSynthParams,
    synth_params_version: SynthParamsVersion,
    cached_synth_params_version: u64,
    /// Per-frame RT-safe cached snapshot for the audio thread.
    cached_rt_synth_params: Arc<SynthParams>,
    scope_buffer: ScopeBuffer,
    ui_input_queue: UiInputQueue,
    mono_output: Vec<f32>,
    performance_counters: PerformanceCountersHandle,
}

impl Default for CzPlugin {
    fn default() -> Self {
        let default_params = SynthParams::default();
        let default_rt_params = build_rt_synth_params(&default_params);
        Self {
            params: Arc::new(CzParams::default()),
            processor: None,
            synth_params: Arc::new(ArcSwap::new(Arc::new(default_params))),
            rt_synth_params: Arc::new(ArcSwap::new(Arc::new(default_rt_params.clone()))),
            synth_params_version: Arc::new(AtomicU64::new(0)),
            cached_synth_params_version: 0,
            cached_rt_synth_params: Arc::new(default_rt_params),
            scope_buffer: Arc::new(Mutex::new(ScopeFrame::default())),
            ui_input_queue: Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY)),
            mono_output: Vec::new(),
            performance_counters: Arc::new(PerformanceCounters::default()),
        }
    }
}

impl CzPlugin {
    fn all_notes_off(proc: &mut CosmoProcessor) {
        proc.set_sustain(false);
        for note in 0u8..=127u8 {
            proc.note_off(note);
        }
    }

    fn drain_ui_input_events(&mut self) {
        if self.performance_counters.enabled.load(Ordering::Acquire) {
            self.performance_counters
                .ui_queue_depth
                .store(self.ui_input_queue.len() as u32, Ordering::Relaxed);
        }
        for _ in 0..MAX_UI_INPUT_EVENTS_PER_BLOCK {
            let Some(event) = self.ui_input_queue.pop() else {
                break;
            };
            if let Some(proc) = &mut self.processor {
                match event {
                    UiInputEvent::NoteOn { note, velocity } => {
                        proc.note_on(note, midi_note_to_freq(note), velocity)
                    }
                    UiInputEvent::NoteOff { note } => proc.note_off(note),
                    UiInputEvent::Sustain { on } => proc.set_sustain(on),
                    UiInputEvent::PitchBend { value } => proc.set_pitch_bend(value),
                    UiInputEvent::ModWheel { value } => proc.set_mod_wheel(value),
                    UiInputEvent::Aftertouch { value } => proc.set_aftertouch(value),
                    UiInputEvent::Panic => Self::all_notes_off(proc),
                }
            }
        }
    }
}

impl Plugin for CzPlugin {
    const NAME: &'static str = "Cosmo PD-101";
    const VENDOR: &'static str = "Purr Audio";
    const URL: &'static str = "https://github.com/fpbrault/cosmo-pd";
    const EMAIL: &'static str = "";
    const VERSION: &'static str = env!("CARGO_PKG_VERSION");

    const AUDIO_IO_LAYOUTS: &'static [AudioIOLayout] = &[AudioIOLayout {
        main_input_channels: None,
        main_output_channels: NonZeroU32::new(2),
        aux_input_ports: &[],
        aux_output_ports: &[],
        names: PortNames::const_default(),
    }];

    const MIDI_INPUT: MidiConfig = MidiConfig::Basic;
    const MIDI_OUTPUT: MidiConfig = MidiConfig::None;
    const SAMPLE_ACCURATE_AUTOMATION: bool = false;

    type SysExMessage = ();
    type BackgroundTask = ();

    fn params(&self) -> Arc<dyn Params> {
        self.params.clone()
    }

    fn editor(&mut self, _async_executor: AsyncExecutor<Self>) -> Option<Box<dyn Editor>> {
        Some(Box::new(crate::gui::CzEditor::new(
            self.synth_params.clone(),
            self.rt_synth_params.clone(),
            self.synth_params_version.clone(),
            self.scope_buffer.clone(),
            self.ui_input_queue.clone(),
            self.performance_counters.clone(),
        )))
    }

    fn initialize(
        &mut self,
        _audio_io_layout: &AudioIOLayout,
        buffer_config: &BufferConfig,
        _context: &mut impl InitContext<Self>,
    ) -> bool {
        append_log(&format!(
            "initialize sample_rate={} log_path={}",
            buffer_config.sample_rate,
            plugin_log_path()
        ));
        let mut processor = CosmoProcessor::new(buffer_config.sample_rate);
        let synth_params = SynthParams::default();
        let rt_synth_params = Arc::new(build_rt_synth_params(&synth_params));
        processor.set_shared_params(Arc::clone(&rt_synth_params));
        self.synth_params.store(Arc::new(synth_params));
        self.rt_synth_params.store(Arc::clone(&rt_synth_params));
        self.cached_rt_synth_params = rt_synth_params;
        self.cached_synth_params_version = self.synth_params_version.load(Ordering::Acquire);
        self.processor = Some(processor);
        self.mono_output
            .resize(buffer_config.max_buffer_size as usize, 0.0);
        self.performance_counters
            .sample_rate_bits
            .store(buffer_config.sample_rate.to_bits(), Ordering::Release);
        true
    }

    fn reset(&mut self) {
        if let Some(proc) = &mut self.processor {
            Self::all_notes_off(proc);
        }
    }

    fn process(
        &mut self,
        buffer: &mut Buffer,
        _aux: &mut AuxiliaryBuffers,
        context: &mut impl ProcessContext<Self>,
    ) -> ProcessStatus {
        // Handle MIDI events
        while let Some(event) = context.next_event() {
            match event {
                // NoteOn with (near) zero velocity is the standard MIDI equivalent
                // of NoteOff. Different hosts can encode release events differently.
                NoteEvent::NoteOn { note, velocity, .. } if velocity <= 0.0001 => {
                    if let Some(proc) = &mut self.processor {
                        proc.note_off(note);
                    }
                }
                NoteEvent::NoteOff { note, .. } => {
                    if let Some(proc) = &mut self.processor {
                        proc.note_off(note);
                    }
                }
                NoteEvent::Choke { note, .. } => {
                    if let Some(proc) = &mut self.processor {
                        proc.note_off(note);
                    }
                }
                NoteEvent::NoteOn { note, velocity, .. } => {
                    if let Some(proc) = &mut self.processor {
                        proc.note_on(note, midi_note_to_freq(note), velocity);
                    }
                }
                NoteEvent::MidiCC { cc, value, .. } => {
                    if let Some(proc) = &mut self.processor {
                        match cc {
                            1 => proc.set_mod_wheel(value),
                            64 => proc.set_sustain(value >= 0.5),
                            // Host transport stop/reset safety: clear held notes.
                            120 | 123 => {
                                Self::all_notes_off(proc);
                            }
                            _ => {}
                        }
                    }
                }
                NoteEvent::MidiPitchBend { value, .. } => {
                    if let Some(proc) = &mut self.processor {
                        proc.set_pitch_bend(value);
                    }
                }
                _ => {}
            }
        }

        self.drain_ui_input_events();

        let monitor_enabled = self.performance_counters.enabled.load(Ordering::Acquire);

        let params_version = self.synth_params_version.load(Ordering::Acquire);
        let params_changed = params_version != self.cached_synth_params_version;
        let mut apply_params_update = false;
        if params_changed {
            self.cached_rt_synth_params = self.rt_synth_params.load_full();
            self.cached_synth_params_version = params_version;
            apply_params_update = true;
        }

        if let Some(proc) = &mut self.processor {
            if apply_params_update {
                proc.set_shared_params(Arc::clone(&self.cached_rt_synth_params));
                self.performance_counters.record_param_apply();
            }
            let num_samples = buffer.samples();
            if num_samples > self.mono_output.len() {
                for channel_slice in buffer.as_slice() {
                    channel_slice.fill(0.0);
                }
                return ProcessStatus::Normal;
            }
            let mono_output = &mut self.mono_output[..num_samples];
            let process_start = monitor_enabled.then(Instant::now);
            proc.process(mono_output);
            let elapsed_ns = process_start
                .map(|start| start.elapsed().as_nanos().min(u128::from(u64::MAX)) as u64)
                .unwrap_or(0);

            let hz = proc
                .voices
                .iter()
                .filter(|v| !v.is_silent && !v.is_releasing && v.note.is_some())
                .map(|v| v.current_freq)
                .max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
                .unwrap_or(0.0);
            let active_voice_count = if monitor_enabled {
                proc.voices.iter().filter(|voice| !voice.is_silent).count()
            } else {
                0
            };
            let ui_queue_depth = if monitor_enabled {
                self.ui_input_queue.len()
            } else {
                0
            };
            self.performance_counters.record_process_block(
                elapsed_ns,
                num_samples,
                proc.sample_rate,
                active_voice_count,
                ui_queue_depth,
            );
            if let Ok(mut scope) = self.scope_buffer.try_lock() {
                scope.push_block(mono_output, proc.sample_rate, hz);
            }

            for channel_slice in buffer.as_slice() {
                channel_slice.copy_from_slice(mono_output);
            }
        }

        ProcessStatus::Normal
    }
}

impl ClapPlugin for CzPlugin {
    const CLAP_ID: &'static str = "jp.cosmo.pd101";
    const CLAP_DESCRIPTION: Option<&'static str> =
        Some("Cosmo PD-101 Phase Distortion Synthesizer");
    const CLAP_MANUAL_URL: Option<&'static str> = None;
    const CLAP_SUPPORT_URL: Option<&'static str> = None;
    const CLAP_FEATURES: &'static [ClapFeature] = &[
        ClapFeature::Instrument,
        ClapFeature::Synthesizer,
        ClapFeature::Stereo,
    ];
}

impl Vst3Plugin for CzPlugin {
    const VST3_CLASS_ID: [u8; 16] = *b"CosmoPD101Synth!";
    const VST3_SUBCATEGORIES: &'static [Vst3SubCategory] = &[
        Vst3SubCategory::Instrument,
        Vst3SubCategory::Synth,
        Vst3SubCategory::Stereo,
    ];
}

nih_export_clap!(CzPlugin);
nih_export_vst3!(CzPlugin);

// =============================================================================
// Tests
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn scope_frame_keeps_samples_in_chronological_order_after_wrap() {
        let mut frame = ScopeFrame::default();
        let initial: Vec<f32> = (0..SCOPE_CAPACITY).map(|sample| sample as f32).collect();
        frame.push_block(&initial, 48_000.0, 110.0);
        frame.push_block(&[4096.0, 4097.0, 4098.0], 48_000.0, 220.0);

        let linear = frame.to_linear();
        assert_eq!(linear.len(), SCOPE_CAPACITY);
        assert_eq!(&linear[..3], &[3.0, 4.0, 5.0]);
        assert_eq!(&linear[linear.len() - 3..], &[4096.0, 4097.0, 4098.0]);
        assert_eq!(frame.sample_rate, 48_000.0);
        assert_eq!(frame.hz, 220.0);
    }

    #[test]
    fn set_params_rpc_updates_synth_params() {
        let synth_params = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
        let rt_synth_params = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
        let scope_buffer: ScopeBuffer = Arc::new(Mutex::new(ScopeFrame::default()));
        let ui_input_queue: UiInputQueue = Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY));

        let mut new_params = SynthParams::default();
        new_params.volume = 0.42;
        let json_str = serde_json::to_string(&new_params).unwrap();

        let result = handle_ipc_invoke(
            "setParams",
            &[serde_json::Value::String(json_str)],
            &synth_params,
            &rt_synth_params,
            &Arc::new(AtomicU64::new(0)),
            &scope_buffer,
            &ui_input_queue,
            &Arc::new(PerformanceCounters::default()),
        );
        assert!(result.is_ok());
        let current = synth_params.load();
        assert_eq!(current.volume, 0.42);
        let rt_current = rt_synth_params.load();
        assert_eq!(rt_current.volume, 0.42);
    }

    #[test]
    fn get_params_rpc_returns_current_synth_params() {
        let mut initial = SynthParams::default();
        initial.volume = 0.77;
        let synth_params = Arc::new(ArcSwap::new(Arc::new(initial)));
        let rt_synth_params = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
        let scope_buffer: ScopeBuffer = Arc::new(Mutex::new(ScopeFrame::default()));
        let ui_input_queue: UiInputQueue = Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY));

        let result = handle_ipc_invoke(
            "getParams",
            &[],
            &synth_params,
            &rt_synth_params,
            &Arc::new(AtomicU64::new(0)),
            &scope_buffer,
            &ui_input_queue,
            &Arc::new(PerformanceCounters::default()),
        );
        assert!(result.is_ok());
        let val = result.unwrap();
        let volume = val["volume"].as_f64().unwrap();
        assert!((volume - 0.77).abs() < 1.0e-6);
    }

    #[test]
    fn note_on_rpc_enqueues_ui_input_event() {
        let synth_params = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
        let rt_synth_params = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
        let scope_buffer: ScopeBuffer = Arc::new(Mutex::new(ScopeFrame::default()));
        let ui_input_queue: UiInputQueue = Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY));

        let result = handle_ipc_invoke(
            "noteOn",
            &[serde_json::json!({ "note": 60, "velocity": 0.75 })],
            &synth_params,
            &rt_synth_params,
            &Arc::new(AtomicU64::new(0)),
            &scope_buffer,
            &ui_input_queue,
            &Arc::new(PerformanceCounters::default()),
        );

        assert!(result.is_ok());
        match ui_input_queue.pop() {
            Some(UiInputEvent::NoteOn { note, velocity }) => {
                assert_eq!(note, 60);
                assert!((velocity - 0.75).abs() < f32::EPSILON);
            }
            other => panic!("unexpected queued event: {other:?}"),
        }
    }
}
