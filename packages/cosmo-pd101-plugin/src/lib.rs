//! Cosmo PD-101 Phase Distortion synthesizer — VST3/CLAP/AUv3 via truce.audio.

#![recursion_limit = "256"]

use std::fs::OpenOptions;
use std::io::Write;
use std::sync::atomic::{AtomicBool, AtomicU32, AtomicU64, Ordering};
use std::sync::{Arc, Mutex, Once};
use std::time::Instant;
use std::time::{SystemTime, UNIX_EPOCH};

use arc_swap::ArcSwap;
use cosmo_synth_engine::envelope::normalize_synth_params_envelopes_to_raw_if_human;
use cosmo_synth_engine::params::SynthParams;
use cosmo_synth_engine::processor::state::{RuntimeModSources, RuntimeVoiceDebugState};
use cosmo_synth_engine::processor::{CosmoProcessor, midi_note_to_freq};
use crossbeam_queue::ArrayQueue;
use truce::prelude::*;
use truce_core::events::TransportInfo;
use truce_core::midi::{norm_7bit, norm_pitch_bend};

pub mod ffi;
pub mod gui;
pub mod preset_library;
pub mod preset_library_path;
pub mod session_state;

use crate::preset_library::PresetLibrary;

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

static PANIC_HOOK_INIT: Once = Once::new();

pub fn init_panic_hook() {
    PANIC_HOOK_INIT.call_once(|| {
        let default_hook = std::panic::take_hook();
        std::panic::set_hook(Box::new(move |info| {
            let payload = info.payload();
            let msg = if let Some(s) = payload.downcast_ref::<&str>() {
                s.to_string()
            } else if let Some(s) = payload.downcast_ref::<String>() {
                s.clone()
            } else {
                format!("{:?}", payload)
            };
            let location = info
                .location()
                .map(|l| format!(" at {}:{}", l.file(), l.line()))
                .unwrap_or_default();
            append_log(&format!("PANIC: {}{}", msg, location));
            eprintln!("[cosmo-pd101] PANIC: {}{}", msg, location);
            default_hook(info);
        }));
    });
}

// =============================================================================
// Scope ring buffer
// =============================================================================

const SCOPE_CAPACITY: usize = 4096;

struct ScopeFrame {
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

type ScopeBuffer = Arc<Mutex<ScopeFrame>>;
type UiInputQueue = Arc<ArrayQueue<UiInputEvent>>;
type SharedSynthParams = Arc<ArcSwap<SynthParams>>;
type SharedRtSynthParams = Arc<ArcSwap<SynthParams>>;
type SharedRuntimeModSources = Arc<ArcSwap<RuntimeModSources>>;
type SharedRuntimeVoiceStates = Arc<ArcSwap<Vec<RuntimeVoiceDebugState>>>;
type SharedTransportSnapshot = Arc<TransportSnapshot>;
type SynthParamsVersion = Arc<AtomicU64>;
type PerformanceCountersHandle = Arc<PerformanceCounters>;

const MIDI_CC_QUEUE_CAPACITY: usize = 128;
type MidiCcQueue = Arc<ArrayQueue<(u8, u8, u8)>>;

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

struct TransportSnapshot {
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
    fn new(transport: &TransportInfo) -> Self {
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

    fn store(&self, transport: &TransportInfo) {
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

    fn load(&self) -> TransportInfo {
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

    fn snapshot_json(&self) -> serde_json::Value {
        let transport = self.load();
        serde_json::json!({
            "playing": transport.playing,
            "recording": transport.recording,
            "tempo": transport.tempo,
            "timeSigNum": transport.time_sig_num,
            "timeSigDen": transport.time_sig_den,
            "positionSamples": transport.position_samples,
            "positionSeconds": transport.position_seconds,
            "positionBeats": transport.position_beats,
            "barStartBeats": transport.bar_start_beats,
            "loopActive": transport.loop_active,
            "loopStartBeats": transport.loop_start_beats,
            "loopEndBeats": transport.loop_end_beats,
        })
    }
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
    PolyAftertouch { note: u8, value: f32 },
    Macro { index: usize, value: f32 },
    Panic,
}

// =============================================================================
// DAW-automatable parameters (truce FloatParams)
// =============================================================================

#[derive(Params)]
pub struct CzPluginParams {
    #[param(name = "Volume", range = "linear(0.0, 1.0)", default = 0.8, unit = "%")]
    pub volume: FloatParam,

    #[param(name = "Warp A Amount", range = "linear(0.0, 1.0)", default = 0.0)]
    pub warp_a_amount: FloatParam,

    #[param(name = "Warp B Amount", range = "linear(0.0, 1.0)", default = 0.0)]
    pub warp_b_amount: FloatParam,

    #[param(name = "Algo Blend A", range = "linear(0.0, 1.0)", default = 0.5)]
    pub algo_blend_a: FloatParam,

    #[param(name = "Algo Blend B", range = "linear(0.0, 1.0)", default = 0.5)]
    pub algo_blend_b: FloatParam,

    #[param(name = "Line 1 Level", range = "linear(0.0, 1.0)", default = 0.8)]
    pub line1_level: FloatParam,

    #[param(name = "Line 2 Level", range = "linear(0.0, 1.0)", default = 0.8)]
    pub line2_level: FloatParam,

    #[param(name = "Line 1 Octave", range = "linear(-2.0, 2.0)", default = 0.0)]
    pub line1_octave: FloatParam,

    #[param(name = "Line 2 Octave", range = "linear(-2.0, 2.0)", default = 0.0)]
    pub line2_octave: FloatParam,

    #[param(name = "Detune Note", range = "linear(-11.0, 11.0)", default = 0.0)]
    pub detune_note: FloatParam,

    #[param(name = "Detune Fine", range = "linear(-60.0, 60.0)", default = 0.0)]
    pub detune_fine: FloatParam,

    #[param(name = "Velocity Curve", range = "linear(-1.0, 1.0)", default = 0.0)]
    pub velocity_curve: FloatParam,

    #[param(name = "Pitch Bend Range", range = "linear(1.0, 24.0)", default = 2.0)]
    pub pitch_bend_range: FloatParam,

    #[param(name = "Portamento Rate", range = "linear(0.0, 127.0)", default = 30.0)]
    pub portamento_rate: FloatParam,

    #[param(name = "Portamento Time", range = "linear(0.0, 5.0)", default = 0.0)]
    pub portamento_time: FloatParam,

    #[param(name = "LFO Rate", range = "linear(0.01, 30.0)", default = 5.0)]
    pub lfo_rate: FloatParam,

    #[param(name = "LFO Depth", range = "linear(0.0, 1.0)", default = 0.2)]
    pub lfo_depth: FloatParam,

    #[param(name = "LFO Offset", range = "linear(-1.0, 1.0)", default = 0.0)]
    pub lfo_offset: FloatParam,

    #[param(name = "LFO 2 Rate", range = "linear(0.01, 30.0)", default = 3.0)]
    pub lfo2_rate: FloatParam,

    #[param(name = "LFO 2 Depth", range = "linear(0.0, 1.0)", default = 0.0)]
    pub lfo2_depth: FloatParam,

    #[param(name = "LFO 2 Offset", range = "linear(-1.0, 1.0)", default = 0.0)]
    pub lfo2_offset: FloatParam,

    #[param(name = "Random Rate", range = "linear(0.01, 30.0)", default = 2.0)]
    pub random_rate: FloatParam,

    #[param(name = "Mod Env Attack", range = "linear(0.0, 10.0)", default = 0.1)]
    pub mod_env_attack: FloatParam,

    #[param(name = "Mod Env Decay", range = "linear(0.0, 10.0)", default = 0.5)]
    pub mod_env_decay: FloatParam,

    #[param(name = "Mod Env Sustain", range = "linear(0.0, 1.0)", default = 0.5)]
    pub mod_env_sustain: FloatParam,

    #[param(name = "Mod Env Release", range = "linear(0.0, 10.0)", default = 2.0)]
    pub mod_env_release: FloatParam,

    #[meter]
    pub meter_l: MeterSlot,
    #[meter]
    pub meter_r: MeterSlot,
}

/// Apply DAW FloatParam values to a SynthParams struct, overwriting matching fields.
fn apply_daw_params(synth: &mut SynthParams, params: &CzPluginParams) {
    synth.volume = params.volume.value();
    synth.line1.dcw_base = params.warp_a_amount.value();
    synth.line2.dcw_base = params.warp_b_amount.value();
    synth.line1.algo_blend = params.algo_blend_a.value();
    synth.line2.algo_blend = params.algo_blend_b.value();
    synth.line1.dca_base = params.line1_level.value();
    synth.line2.dca_base = params.line2_level.value();
    synth.line1.octave = params.line1_octave.value();
    synth.line2.octave = params.line2_octave.value();
    synth.line2.detune_note = params.detune_note.value();
    synth.line2.detune_fine = params.detune_fine.value();
    synth.velocity_curve = params.velocity_curve.value();
    synth.pitch_bend_range = params.pitch_bend_range.value();
    synth.portamento.rate = params.portamento_rate.value();
    synth.portamento.time = params.portamento_time.value();
    synth.lfo.rate = params.lfo_rate.value();
    synth.lfo.depth = params.lfo_depth.value();
    synth.lfo.offset = params.lfo_offset.value();
    synth.lfo2.rate = params.lfo2_rate.value();
    synth.lfo2.depth = params.lfo2_depth.value();
    synth.lfo2.offset = params.lfo2_offset.value();
    synth.random.rate = params.random_rate.value();
    synth.mod_env.attack = params.mod_env_attack.value();
    synth.mod_env.decay = params.mod_env_decay.value();
    synth.mod_env.sustain = params.mod_env_sustain.value();
    synth.mod_env.release = params.mod_env_release.value();
}

fn write_daw_param_by_id(synth: &mut SynthParams, id: u32, value: f64) -> bool {
    let value = value as f32;
    match id {
        x if x == CzPluginParamsParamId::Volume as u32 => synth.volume = value,
        x if x == CzPluginParamsParamId::WarpAAmount as u32 => synth.line1.dcw_base = value,
        x if x == CzPluginParamsParamId::WarpBAmount as u32 => synth.line2.dcw_base = value,
        x if x == CzPluginParamsParamId::AlgoBlendA as u32 => synth.line1.algo_blend = value,
        x if x == CzPluginParamsParamId::AlgoBlendB as u32 => synth.line2.algo_blend = value,
        x if x == CzPluginParamsParamId::Line1Level as u32 => synth.line1.dca_base = value,
        x if x == CzPluginParamsParamId::Line2Level as u32 => synth.line2.dca_base = value,
        x if x == CzPluginParamsParamId::Line1Octave as u32 => synth.line1.octave = value,
        x if x == CzPluginParamsParamId::Line2Octave as u32 => synth.line2.octave = value,
        x if x == CzPluginParamsParamId::DetuneNote as u32 => synth.line2.detune_note = value,
        x if x == CzPluginParamsParamId::DetuneFine as u32 => synth.line2.detune_fine = value,
        x if x == CzPluginParamsParamId::VelocityCurve as u32 => synth.velocity_curve = value,
        x if x == CzPluginParamsParamId::PitchBendRange as u32 => synth.pitch_bend_range = value,
        x if x == CzPluginParamsParamId::PortamentoRate as u32 => synth.portamento.rate = value,
        x if x == CzPluginParamsParamId::PortamentoTime as u32 => synth.portamento.time = value,
        x if x == CzPluginParamsParamId::LfoRate as u32 => synth.lfo.rate = value,
        x if x == CzPluginParamsParamId::LfoDepth as u32 => synth.lfo.depth = value,
        x if x == CzPluginParamsParamId::LfoOffset as u32 => synth.lfo.offset = value,
        x if x == CzPluginParamsParamId::Lfo2Rate as u32 => synth.lfo2.rate = value,
        x if x == CzPluginParamsParamId::Lfo2Depth as u32 => synth.lfo2.depth = value,
        x if x == CzPluginParamsParamId::Lfo2Offset as u32 => synth.lfo2.offset = value,
        x if x == CzPluginParamsParamId::RandomRate as u32 => synth.random.rate = value,
        x if x == CzPluginParamsParamId::ModEnvAttack as u32 => synth.mod_env.attack = value,
        x if x == CzPluginParamsParamId::ModEnvDecay as u32 => synth.mod_env.decay = value,
        x if x == CzPluginParamsParamId::ModEnvSustain as u32 => synth.mod_env.sustain = value,
        x if x == CzPluginParamsParamId::ModEnvRelease as u32 => synth.mod_env.release = value,
        _ => return false,
    }
    true
}

fn read_daw_param_by_id(synth: &SynthParams, id: u32) -> Option<f32> {
    match id {
        x if x == CzPluginParamsParamId::Volume as u32 => Some(synth.volume),
        x if x == CzPluginParamsParamId::WarpAAmount as u32 => Some(synth.line1.dcw_base),
        x if x == CzPluginParamsParamId::WarpBAmount as u32 => Some(synth.line2.dcw_base),
        x if x == CzPluginParamsParamId::AlgoBlendA as u32 => Some(synth.line1.algo_blend),
        x if x == CzPluginParamsParamId::AlgoBlendB as u32 => Some(synth.line2.algo_blend),
        x if x == CzPluginParamsParamId::Line1Level as u32 => Some(synth.line1.dca_base),
        x if x == CzPluginParamsParamId::Line2Level as u32 => Some(synth.line2.dca_base),
        x if x == CzPluginParamsParamId::Line1Octave as u32 => Some(synth.line1.octave),
        x if x == CzPluginParamsParamId::Line2Octave as u32 => Some(synth.line2.octave),
        x if x == CzPluginParamsParamId::DetuneNote as u32 => Some(synth.line2.detune_note),
        x if x == CzPluginParamsParamId::DetuneFine as u32 => Some(synth.line2.detune_fine),
        x if x == CzPluginParamsParamId::VelocityCurve as u32 => Some(synth.velocity_curve),
        x if x == CzPluginParamsParamId::PitchBendRange as u32 => Some(synth.pitch_bend_range),
        x if x == CzPluginParamsParamId::PortamentoRate as u32 => Some(synth.portamento.rate),
        x if x == CzPluginParamsParamId::PortamentoTime as u32 => Some(synth.portamento.time),
        x if x == CzPluginParamsParamId::LfoRate as u32 => Some(synth.lfo.rate),
        x if x == CzPluginParamsParamId::LfoDepth as u32 => Some(synth.lfo.depth),
        x if x == CzPluginParamsParamId::LfoOffset as u32 => Some(synth.lfo.offset),
        x if x == CzPluginParamsParamId::Lfo2Rate as u32 => Some(synth.lfo2.rate),
        x if x == CzPluginParamsParamId::Lfo2Depth as u32 => Some(synth.lfo2.depth),
        x if x == CzPluginParamsParamId::Lfo2Offset as u32 => Some(synth.lfo2.offset),
        x if x == CzPluginParamsParamId::RandomRate as u32 => Some(synth.random.rate),
        x if x == CzPluginParamsParamId::ModEnvAttack as u32 => Some(synth.mod_env.attack),
        x if x == CzPluginParamsParamId::ModEnvDecay as u32 => Some(synth.mod_env.decay),
        x if x == CzPluginParamsParamId::ModEnvSustain as u32 => Some(synth.mod_env.sustain),
        x if x == CzPluginParamsParamId::ModEnvRelease as u32 => Some(synth.mod_env.release),
        _ => None,
    }
}

fn sync_all_daw_params_from_synth(params: &CzPluginParams, synth: &SynthParams) {
    params.volume.set_value(synth.volume as f64);
    params.warp_a_amount.set_value(synth.line1.dcw_base as f64);
    params.warp_b_amount.set_value(synth.line2.dcw_base as f64);
    params.algo_blend_a.set_value(synth.line1.algo_blend as f64);
    params.algo_blend_b.set_value(synth.line2.algo_blend as f64);
    params.line1_level.set_value(synth.line1.dca_base as f64);
    params.line2_level.set_value(synth.line2.dca_base as f64);
    params.line1_octave.set_value(synth.line1.octave as f64);
    params.line2_octave.set_value(synth.line2.octave as f64);
    params.detune_note.set_value(synth.line2.detune_note as f64);
    params.detune_fine.set_value(synth.line2.detune_fine as f64);
    params.velocity_curve.set_value(synth.velocity_curve as f64);
    params
        .pitch_bend_range
        .set_value(synth.pitch_bend_range as f64);
    params
        .portamento_rate
        .set_value(synth.portamento.rate as f64);
    params
        .portamento_time
        .set_value(synth.portamento.time as f64);
    params.lfo_rate.set_value(synth.lfo.rate as f64);
    params.lfo_depth.set_value(synth.lfo.depth as f64);
    params.lfo_offset.set_value(synth.lfo.offset as f64);
    params.lfo2_rate.set_value(synth.lfo2.rate as f64);
    params.lfo2_depth.set_value(synth.lfo2.depth as f64);
    params.lfo2_offset.set_value(synth.lfo2.offset as f64);
    params.random_rate.set_value(synth.random.rate as f64);
    params.mod_env_attack.set_value(synth.mod_env.attack as f64);
    params.mod_env_decay.set_value(synth.mod_env.decay as f64);
    params
        .mod_env_sustain
        .set_value(synth.mod_env.sustain as f64);
    params
        .mod_env_release
        .set_value(synth.mod_env.release as f64);
}

pub(crate) type SharedPresetName = Arc<Mutex<String>>;
pub(crate) type SharedEditorState = Arc<Mutex<Option<crate::session_state::EditorState>>>;
pub(crate) type SharedMidiMappings = Arc<Mutex<Option<Vec<crate::session_state::MidiMapping>>>>;

// =============================================================================
// IPC dispatch
// =============================================================================

#[allow(clippy::too_many_arguments)]
fn handle_ipc_invoke(
    method: &str,
    args: &[serde_json::Value],
    synth_params: &SharedSynthParams,
    rt_synth_params: &SharedRtSynthParams,
    runtime_mod_sources: &SharedRuntimeModSources,
    runtime_voice_states: &SharedRuntimeVoiceStates,
    transport_snapshot: &SharedTransportSnapshot,
    synth_params_version: &SynthParamsVersion,
    scope_buffer: &ScopeBuffer,
    ui_input_queue: &UiInputQueue,
    performance_counters: &PerformanceCountersHandle,
    params: &CzPluginParams,
    preset_name: &SharedPresetName,
    preset_library: &Arc<Mutex<PresetLibrary>>,
    loaded_preset_id: &Arc<Mutex<Option<String>>>,
    editor_state: &SharedEditorState,
    midi_mappings: &SharedMidiMappings,
) -> Result<serde_json::Value, String> {
    if method != "getScopeData"
        && method != "clientLog"
        && method != "getRuntimeModSources"
        && method != "getTransportInfo"
    {
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
        "polyAftertouch" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "polyAftertouch expects an object payload as first argument".to_string()
                })?;
            let note = payload
                .get("note")
                .and_then(serde_json::Value::as_u64)
                .ok_or_else(|| "polyAftertouch payload missing note".to_string())?;
            let note =
                u8::try_from(note).map_err(|_| "polyAftertouch note out of range".to_string())?;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "polyAftertouch payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(UiInputEvent::PolyAftertouch { note, value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "macroValue" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "macroValue expects an object payload as first argument".to_string()
                })?;
            let index = payload
                .get("index")
                .and_then(serde_json::Value::as_u64)
                .ok_or_else(|| "macroValue payload missing index".to_string())?
                as usize;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "macroValue payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(UiInputEvent::Macro { index, value })
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
            let new_params: SynthParams = serde_json::from_str(json_str)
                .map_err(|e| format!("invalid SynthParams payload: {e}"))?;

            // Keep truce FloatParams aligned with the nested SynthParams payload so
            // the next process() block does not overwrite preset state with stale
            // default automation values.
            sync_all_daw_params_from_synth(params, &new_params);

            let rt_params = build_rt_synth_params(&new_params);
            synth_params.store(Arc::new(new_params));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);
            Ok(serde_json::Value::Null)
        }
        "getParams" => {
            let sp = synth_params.load();
            serde_json::to_value(sp.as_ref()).map_err(|e| e.to_string())
        }
        "getRuntimeModSources" => {
            let sources = runtime_mod_sources.load();
            serde_json::to_value(sources.as_ref()).map_err(|e| e.to_string())
        }
        "getRuntimeVoiceStates" => {
            let states = runtime_voice_states.load();
            serde_json::to_value(states.as_ref()).map_err(|e| e.to_string())
        }
        "getTransportInfo" => Ok(transport_snapshot.snapshot_json()),
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
            Ok(
                serde_json::json!({ "samples": linear, "sampleRate": scope.sample_rate, "hz": scope.hz }),
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
        "setPresetName" => {
            let name = args
                .first()
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetName expects a string argument".to_string())?;
            if let Ok(mut stored) = preset_name.lock() {
                *stored = name.to_string();
            }
            Ok(serde_json::Value::Null)
        }
        "getPresetName" => {
            let name = preset_name.lock().map(|n| n.clone()).unwrap_or_default();
            Ok(serde_json::Value::String(name))
        }
        "getPresetLibrary" => {
            let source_filter = args
                .first()
                .and_then(serde_json::Value::as_object)
                .and_then(|o| o.get("source"))
                .and_then(serde_json::Value::as_str);
            let lib = preset_library.lock().map_err(|e| e.to_string())?;
            let entries: Vec<serde_json::Value> = lib
                .list_entries(source_filter)
                .map_err(|e| e.to_string())?
                .iter()
                .map(|e| {
                    serde_json::json!({
                        "id": e.id,
                        "name": e.name,
                        "source": e.source,
                        "author": e.author,
                        "starred": e.starred,
                        "tags": e.tags,
                    })
                })
                .collect();
            Ok(serde_json::json!({ "entries": entries }))
        }
        "loadPresetData" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "loadPresetData expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "loadPresetData payload missing id".to_string())?;

            let (entry_data, preset_name_val): (serde_json::Value, String) = {
                let lib = preset_library.lock().map_err(|e| e.to_string())?;
                let data = lib
                    .get_entry_data(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                let name = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .map(|e| e.name)
                    .unwrap_or_default();
                (data, name)
            };

            let new_sp: SynthParams = if let Some(params_value) = entry_data.get("params") {
                serde_json::from_value(params_value.clone())
                    .map_err(|e| format!("Failed to deserialize preset: {e}"))?
            } else {
                serde_json::from_value(entry_data)
                    .map_err(|e| format!("Failed to deserialize preset: {e}"))?
            };

            sync_all_daw_params_from_synth(params, &new_sp);
            let rt_params = build_rt_synth_params(&new_sp);
            synth_params.store(Arc::new(new_sp));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);

            if let Ok(mut stored) = preset_name.lock() {
                *stored = preset_name_val.clone();
            }
            if let Ok(mut stored) = loaded_preset_id.lock() {
                *stored = Some(id.to_string());
            }

            Ok(serde_json::json!({ "preset_name": preset_name_val }))
        }
        "addPreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "addPreset expects an object payload as first argument".to_string()
                })?;
            let name = payload
                .get("name")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "addPreset payload missing name".to_string())?
                .to_string();
            let tags: Vec<String> = payload
                .get("tags")
                .and_then(|v| v.as_array())
                .map(|a| {
                    a.iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect()
                })
                .unwrap_or_default();

            let params_val = synth_params.load();
            let data = serde_json::to_value(&**params_val).map_err(|e| e.to_string())?;

            let id = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let entry = lib.add_entry(name, tags, data).map_err(|e| e.to_string())?;
                entry.id.clone()
            };

            Ok(serde_json::json!({ "id": id }))
        }
        "deletePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "deletePreset expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "deletePreset payload missing id".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.delete_entry(id).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "renamePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "renamePreset expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "renamePreset payload missing id".to_string())?;
            let new_name = payload
                .get("newName")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "renamePreset payload missing newName".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.rename_entry(id, new_name).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "toggleStarred" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "toggleStarred expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "toggleStarred payload missing id".to_string())?;
            let starred = payload
                .get("starred")
                .and_then(serde_json::Value::as_bool)
                .ok_or_else(|| "toggleStarred payload missing starred".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.set_starred(id, starred).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "setEditorState" => {
            let payload = args
                .first()
                .ok_or_else(|| "setEditorState expects an object payload".to_string())?;
            let state: crate::session_state::EditorState = serde_json::from_value(payload.clone())
                .map_err(|e| format!("invalid EditorState: {e}"))?;
            if let Ok(mut stored) = editor_state.lock() {
                *stored = Some(state);
            }
            Ok(serde_json::Value::Null)
        }
        "getEditorState" => {
            let state = editor_state.lock().map(|s| s.clone()).unwrap_or(None);
            serde_json::to_value(state).map_err(|e| e.to_string())
        }
        "setMidiMappings" => {
            let payload = args
                .first()
                .ok_or_else(|| "setMidiMappings expects an array payload".to_string())?;
            let mappings: Vec<crate::session_state::MidiMapping> =
                serde_json::from_value(payload.clone())
                    .map_err(|e| format!("invalid MidiMappings: {e}"))?;
            if let Ok(mut stored) = midi_mappings.lock() {
                *stored = Some(mappings);
            }
            Ok(serde_json::Value::Null)
        }
        "getMidiMappings" => {
            let mappings = midi_mappings.lock().map(|s| s.clone()).unwrap_or(None);
            serde_json::to_value(mappings).map_err(|e| e.to_string())
        }
        _ => Err(format!("unknown method: {method}")),
    }
}

// =============================================================================
// Plugin struct
// =============================================================================

pub struct CzPlugin {
    params: Arc<CzPluginParams>,
    processor: Option<CosmoProcessor>,
    synth_params: SharedSynthParams,
    rt_synth_params: SharedRtSynthParams,
    runtime_mod_sources: SharedRuntimeModSources,
    transport_snapshot: SharedTransportSnapshot,
    synth_params_version: SynthParamsVersion,
    cached_synth_params_version: u64,
    cached_rt_synth_params: Arc<SynthParams>,
    scope_buffer: ScopeBuffer,
    ui_input_queue: UiInputQueue,
    midi_cc_queue: MidiCcQueue,
    mono_output: Vec<f32>,
    performance_counters: PerformanceCountersHandle,
    /// Tracks whether DAW param values changed since last process() call.
    daw_params_dirty: bool,
    last_scope_hz: f32,
    /// Tracks transport playing state across process() calls to detect stop.
    last_playing: bool,
    /// Preset name shared with the webview, persisted via save_state/load_state.
    preset_name: SharedPresetName,
    /// Latest voice debug state snapshot, populated each process block.
    runtime_voice_states: SharedRuntimeVoiceStates,
    /// The preset library (factory + user). Lock when reading or writing.
    preset_library: Arc<Mutex<PresetLibrary>>,
    /// Tracks the currently loaded preset ID, if any.
    loaded_preset_id: Arc<Mutex<Option<String>>>,
    /// UI editor state persisted across DAW sessions.
    editor_state: SharedEditorState,
    /// MIDI learn bindings persisted across DAW sessions.
    midi_learn_bindings: SharedMidiMappings,
}

impl CzPlugin {
    const TRACKED_PARAM_ID_CAPACITY: usize = 64;

    fn new(params: Arc<CzPluginParams>) -> Self {
        init_panic_hook();
        let default_params = SynthParams::default();
        let default_rt_params = build_rt_synth_params(&default_params);
        let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
        let preset_library = Arc::new(Mutex::new(
            PresetLibrary::load_or_init(factory_json).unwrap_or_else(|e| {
                eprintln!("Failed to load preset library: {}, using factory only", e);
                PresetLibrary::from_embedded_factory(factory_json)
            }),
        ));
        Self {
            params,
            processor: None,
            synth_params: Arc::new(ArcSwap::new(Arc::new(default_params))),
            rt_synth_params: Arc::new(ArcSwap::new(Arc::new(default_rt_params.clone()))),
            runtime_mod_sources: Arc::new(ArcSwap::new(Arc::new(RuntimeModSources::default()))),
            transport_snapshot: Arc::new(TransportSnapshot::default()),
            synth_params_version: Arc::new(AtomicU64::new(0)),
            cached_synth_params_version: 0,
            cached_rt_synth_params: Arc::new(default_rt_params),
            scope_buffer: Arc::new(Mutex::new(ScopeFrame::default())),
            ui_input_queue: Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY)),
            midi_cc_queue: Arc::new(ArrayQueue::new(MIDI_CC_QUEUE_CAPACITY)),
            mono_output: Vec::new(),
            performance_counters: Arc::new(PerformanceCounters::default()),
            daw_params_dirty: true,
            last_scope_hz: 220.0,
            last_playing: false,
            preset_name: Arc::new(Mutex::new(String::new())),
            runtime_voice_states: Arc::new(ArcSwap::from_pointee(Vec::new())),
            preset_library,
            loaded_preset_id: Arc::new(Mutex::new(None)),
            editor_state: Arc::new(Mutex::new(None)),
            midi_learn_bindings: Arc::new(Mutex::new(None)),
        }
    }

    fn all_notes_off(proc: &mut CosmoProcessor) {
        append_log("all_notes_off: calling set_sustain(false) + note_off 0..127");
        proc.set_sustain(false);
        for note in 0u8..=127u8 {
            proc.note_off(note);
        }
    }

    fn apply_factory_preset(&mut self, index: usize) {
        let Some(params) = crate::ffi::factory_preset_params(index).cloned() else {
            return;
        };

        sync_all_daw_params_from_synth(&self.params, &params);

        let rt_params = Arc::new(build_rt_synth_params(&params));
        self.synth_params.store(Arc::new(params));
        self.rt_synth_params.store(Arc::clone(&rt_params));
        self.cached_rt_synth_params = Arc::clone(&rt_params);
        self.synth_params_version.fetch_add(1, Ordering::Release);
        self.cached_synth_params_version = self.synth_params_version.load(Ordering::Acquire);
        self.daw_params_dirty = false;

        if let Some(proc) = self.processor.as_mut() {
            proc.set_shared_params(rt_params);
            self.performance_counters.record_param_apply();
        }
    }

    fn apply_rt_param_change(&mut self, id: u32, value: f64) {
        let mut next_params = (*self.cached_rt_synth_params).clone();
        if !write_daw_param_by_id(&mut next_params, id, value) {
            return;
        }

        let next_params = Arc::new(next_params);
        self.cached_rt_synth_params = Arc::clone(&next_params);
        if let Some(proc) = self.processor.as_mut() {
            proc.set_shared_params(next_params);
            self.performance_counters.record_param_apply();
        }
    }

    fn tracked_param_changes(events: &EventList) -> [bool; Self::TRACKED_PARAM_ID_CAPACITY] {
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

    fn handle_host_event(&mut self, body: &EventBody) {
        match body {
            EventBody::NoteOff { note, .. } => {
                append_log(&format!("handle_host_event NoteOff note={}", note));
                if let Some(proc) = self.processor.as_mut() {
                    proc.note_off(*note);
                }
            }
            EventBody::NoteOn { note, velocity, .. } => {
                let vel = norm_7bit(*velocity);
                append_log(&format!(
                    "handle_host_event NoteOn note={} vel_raw={} vel_norm={}",
                    note, velocity, vel
                ));
                if vel <= 0.0 {
                    if let Some(proc) = self.processor.as_mut() {
                        proc.note_off(*note);
                    }
                } else {
                    let frequency = midi_note_to_freq(*note);
                    if let Some(proc) = self.processor.as_mut() {
                        proc.note_on(*note, frequency, vel);
                    }
                }
            }
            EventBody::NoteOff2 { note, .. } => {
                append_log(&format!("handle_host_event NoteOff2 note={}", note));
                if let Some(proc) = self.processor.as_mut() {
                    proc.note_off(*note);
                }
            }
            EventBody::NoteOn2 { note, velocity, .. } => {
                let vel = *velocity as f32 / u16::MAX as f32;
                append_log(&format!(
                    "handle_host_event NoteOn2 note={} vel_raw={} vel_norm={}",
                    note, velocity, vel
                ));
                if vel <= 0.0 {
                    if let Some(proc) = self.processor.as_mut() {
                        proc.note_off(*note);
                    }
                } else {
                    let frequency = midi_note_to_freq(*note);
                    if let Some(proc) = self.processor.as_mut() {
                        proc.note_on(*note, frequency, vel);
                    }
                }
            }
            EventBody::Aftertouch { pressure, .. }
            | EventBody::ChannelPressure { pressure, .. } => {
                if let Some(proc) = self.processor.as_mut() {
                    proc.set_aftertouch(norm_7bit(*pressure));
                }
            }
            EventBody::ChannelPressure2 { pressure, .. } => {
                if let Some(proc) = self.processor.as_mut() {
                    proc.set_aftertouch(*pressure as f32 / u32::MAX as f32);
                }
            }
            EventBody::ControlChange { cc, value, .. } => match cc {
                1 => {
                    if let Some(proc) = self.processor.as_mut() {
                        proc.set_mod_wheel(norm_7bit(*value));
                    }
                }
                64 => {
                    if let Some(proc) = self.processor.as_mut() {
                        proc.set_sustain(*value >= 64);
                    }
                }
                120 | 123 => {
                    if let Some(proc) = self.processor.as_mut() {
                        Self::all_notes_off(proc);
                    }
                }
                _ => {}
            },
            EventBody::ControlChange2 { cc, value, .. } => match cc {
                1 => {
                    if let Some(proc) = self.processor.as_mut() {
                        proc.set_mod_wheel(*value as f32 / u32::MAX as f32);
                    }
                }
                64 => {
                    if let Some(proc) = self.processor.as_mut() {
                        proc.set_sustain(*value >= (u32::MAX / 2));
                    }
                }
                120 | 123 => {
                    if let Some(proc) = self.processor.as_mut() {
                        Self::all_notes_off(proc);
                    }
                }
                _ => {}
            },
            EventBody::PitchBend { value, .. } => {
                if let Some(proc) = self.processor.as_mut() {
                    proc.set_pitch_bend(norm_pitch_bend(*value));
                }
            }
            EventBody::PitchBend2 { value, .. } => {
                if let Some(proc) = self.processor.as_mut() {
                    let normalized = (*value as f32 - 2_147_483_648.0) / 2_147_483_648.0;
                    proc.set_pitch_bend(normalized.clamp(-1.0, 1.0));
                }
            }
            EventBody::ParamChange { id, value } => self.apply_rt_param_change(*id, *value),
            EventBody::ProgramChange { program, .. }
            | EventBody::ProgramChange2 { program, .. } => {
                if usize::from(*program) < crate::ffi::factory_preset_count() {
                    self.apply_factory_preset(usize::from(*program));
                }
            }
            _ => {}
        }
    }

    fn process_host_events_into_buffer(&mut self, events: &EventList, num_samples: usize) {
        let mut next_event = 0usize;
        let mut rendered = 0usize;

        if !events.is_empty() {
            append_log(&format!(
                "process_events: num_events={} num_samples={}",
                events.len(),
                num_samples
            ));
        }

        while let Some(event) = events.get(next_event) {
            let event_offset = (event.sample_offset as usize).min(num_samples);
            if event_offset > rendered {
                append_log(&format!(
                    "  render [{}.0..{}.0] ({} samples)",
                    rendered,
                    event_offset,
                    event_offset - rendered
                ));
                if let Some(proc) = self.processor.as_mut() {
                    proc.process(&mut self.mono_output[rendered..event_offset]);
                }
                rendered = event_offset;
            }

            while let Some(simultaneous) = events.get(next_event) {
                let simultaneous_offset = (simultaneous.sample_offset as usize).min(num_samples);
                if simultaneous_offset != event_offset {
                    break;
                }
                self.handle_host_event(&simultaneous.body);
                next_event += 1;
            }
        }

        if rendered < num_samples
            && let Some(proc) = self.processor.as_mut()
        {
            proc.process(&mut self.mono_output[rendered..num_samples]);
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
                    UiInputEvent::PolyAftertouch { note, value } => {
                        proc.set_poly_aftertouch(note, value)
                    }
                    UiInputEvent::Macro { index, value } => proc.set_macro(index, value),
                    UiInputEvent::Panic => Self::all_notes_off(proc),
                }
            }
        }
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
        let mut current_params = (*self.synth_params.load_full()).clone();
        apply_daw_params(&mut current_params, &self.params);
        let rt_params = Arc::new(build_rt_synth_params(&current_params));
        processor.set_shared_params(Arc::clone(&rt_params));
        self.synth_params.store(Arc::new(current_params));
        self.rt_synth_params.store(Arc::clone(&rt_params));
        self.cached_rt_synth_params = rt_params;
        self.cached_synth_params_version = self.synth_params_version.load(Ordering::Acquire);
        self.processor = Some(processor);
        self.mono_output.resize(max_block_size, 0.0);
        self.performance_counters
            .sample_rate_bits
            .store(sr.to_bits(), Ordering::Release);
        self.daw_params_dirty = false;
        self.transport_snapshot.store(&TransportInfo::default());
    }

    fn process(
        &mut self,
        buffer: &mut AudioBuffer,
        events: &EventList,
        context: &mut ProcessContext,
    ) -> ProcessStatus {
        self.transport_snapshot.store(context.transport);
        if context.transport.playing != self.last_playing {
            append_log(&format!(
                "transport change: playing={} last_playing={} num_events={}",
                context.transport.playing,
                self.last_playing,
                events.len()
            ));
            if !context.transport.playing && self.last_playing {
                append_log("transport stop -> all_notes_off");
                if let Some(proc) = self.processor.as_mut() {
                    Self::all_notes_off(proc);
                }
            }
        }
        self.last_playing = context.transport.playing;
        if let Some(proc) = self.processor.as_mut() {
            if context.transport.tempo.is_finite() && context.transport.tempo > 0.0 {
                proc.set_host_transport(
                    context.transport.tempo as f32,
                    context.transport.playing,
                    context.transport.position_beats,
                );
            } else {
                proc.clear_host_transport();
            }
        }
        self.drain_ui_input_events();

        let monitor_enabled = self.performance_counters.enabled.load(Ordering::Acquire);
        let tracked_param_changes = Self::tracked_param_changes(events);
        let has_param_change_events = tracked_param_changes.iter().any(|changed| *changed);

        // Sync DAW params to the engine (DAW automation / host param changes)
        // Always reset dirty flag and apply since FloatParams are cheap to read.
        let params_version = self.synth_params_version.load(Ordering::Acquire);
        let params_changed =
            params_version != self.cached_synth_params_version || self.daw_params_dirty;

        if params_changed {
            // Start from the latest JS JSON params (or cached RT params).
            // Both rt_synth_params and cached_rt_synth_params have already been
            // normalized (envelope level/rate → raw 0-127), and apply_daw_params
            // only touches top-level float fields (no envelope steps), so we
            // must NOT call build_rt_synth_params again — that would double-convert
            // envelope values, corrupting levels and rates.
            let previous_rt = (*self.cached_rt_synth_params).clone();
            let merged = if params_version != self.cached_synth_params_version {
                let mut p = (*self.rt_synth_params.load_full()).clone();
                apply_daw_params(&mut p, &self.params);
                p
            } else {
                let mut p = (*self.cached_rt_synth_params).clone();
                apply_daw_params(&mut p, &self.params);
                p
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

            let rt_merged = Arc::new(merged);
            self.cached_rt_synth_params = rt_merged.clone();
            if let Some(ref mut proc) = self.processor {
                proc.set_shared_params(rt_merged);
                self.performance_counters.record_param_apply();
            }
            self.cached_synth_params_version = params_version;
            self.daw_params_dirty = false;
        }

        let tail_info = if self.processor.is_some() {
            let num_samples = buffer.num_samples();
            if num_samples > self.mono_output.len() {
                for ch in 0..buffer.num_output_channels() {
                    buffer.output(ch).fill(0.0);
                }
                return ProcessStatus::Normal;
            }
            let process_start = monitor_enabled.then(Instant::now);
            self.process_host_events_into_buffer(events, num_samples);
            let mono_output = &mut self.mono_output[..num_samples];
            let elapsed_ns = process_start
                .map(|start| start.elapsed().as_nanos().min(u128::from(u64::MAX)) as u64)
                .unwrap_or(0);

            let Some(proc) = self.processor.as_ref() else {
                return ProcessStatus::Normal;
            };
            let raw_hz = proc
                .voices
                .iter()
                .filter(|v| !v.is_silent && v.note.is_some())
                .map(|v| v.current_freq)
                .max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
                .unwrap_or(0.0);
            let hz = if raw_hz > 0.0 {
                self.last_scope_hz = raw_hz;
                raw_hz
            } else {
                self.last_scope_hz
            };
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

            self.runtime_mod_sources
                .store(Arc::new(proc.runtime_mod_sources()));
            self.runtime_voice_states
                .store(Arc::new(proc.runtime_voice_debug_state()));

            let peak = mono_output[..num_samples]
                .iter()
                .fold(0.0f32, |a, &s| a.max(s.abs()));
            context.set_meter(CzPluginParamsParamId::MeterL as u32, peak);
            context.set_meter(CzPluginParamsParamId::MeterR as u32, peak);

            for ch in 0..buffer.num_output_channels() {
                buffer.output(ch)[..num_samples].copy_from_slice(mono_output);
            }

            let has_tail = proc.voices.iter().any(|v| !v.is_silent);
            let tail = if has_tail {
                (proc.sample_rate * 10.0) as u32
            } else {
                0
            };
            (has_tail, tail)
        } else {
            (false, 0)
        };

        if tail_info.0 {
            ProcessStatus::Tail(tail_info.1)
        } else {
            ProcessStatus::Normal
        }
    }

    fn bus_layouts() -> Vec<BusLayout> {
        vec![BusLayout::new().with_output("Main", ChannelConfig::Stereo)]
    }

    fn save_state(&self) -> Vec<u8> {
        let sp = self.synth_params.load();
        let name = self
            .preset_name
            .lock()
            .map(|n| n.clone())
            .unwrap_or_default();
        let loaded_id = self
            .loaded_preset_id
            .lock()
            .map(|id| id.clone())
            .unwrap_or(None);
        let editor = self.editor_state.lock().map(|s| s.clone()).unwrap_or(None);
        let midi = self
            .midi_learn_bindings
            .lock()
            .map(|s| s.clone())
            .unwrap_or(None);
        let state = crate::session_state::PluginSessionState {
            synth_params: sp.as_ref().clone(),
            preset_name: name,
            loaded_preset_id: loaded_id,
            editor_state: editor,
            midi_mappings: midi,
        };
        serde_json::to_vec(&state).unwrap_or_default()
    }

    fn load_state(&mut self, data: &[u8]) -> Result<(), StateLoadError> {
        let session = crate::session_state::deserialize_state(data)
            .map_err(|_| StateLoadError::Malformed("unknown state format"))?;

        let params = session.synth_params;

        if let Ok(mut stored) = self.preset_name.lock()
            && (!session.preset_name.is_empty() || session.loaded_preset_id.is_some())
        {
            *stored = session.preset_name;
        }
        if let Ok(mut stored) = self.loaded_preset_id.lock() {
            *stored = session.loaded_preset_id;
        }

        if let Ok(mut stored) = self.editor_state.lock() {
            *stored = session.editor_state;
        }
        if let Ok(mut stored) = self.midi_learn_bindings.lock() {
            *stored = session.midi_mappings;
        }

        sync_all_daw_params_from_synth(&self.params, &params);
        let rt_params = build_rt_synth_params(&params);
        let rt_params_arc = Arc::new(rt_params);
        self.synth_params.store(Arc::new(params));
        self.rt_synth_params.store(Arc::clone(&rt_params_arc));
        self.cached_rt_synth_params = rt_params_arc.clone();
        self.synth_params_version.fetch_add(1, Ordering::Release);
        self.cached_synth_params_version = self.synth_params_version.load(Ordering::Acquire);
        self.daw_params_dirty = false;
        if let Some(ref mut proc) = self.processor {
            proc.set_shared_params(rt_params_arc);
            self.performance_counters.record_param_apply();
        }
        Ok(())
    }

    fn editor(&self) -> Box<dyn Editor> {
        Box::new(crate::gui::CzEditor::new(
            self.synth_params.clone(),
            self.rt_synth_params.clone(),
            self.runtime_mod_sources.clone(),
            self.transport_snapshot.clone(),
            self.synth_params_version.clone(),
            self.scope_buffer.clone(),
            self.ui_input_queue.clone(),
            self.midi_cc_queue.clone(),
            self.performance_counters.clone(),
            self.params.clone(),
            self.preset_name.clone(),
            self.runtime_voice_states.clone(),
            self.preset_library.clone(),
            self.loaded_preset_id.clone(),
            self.editor_state.clone(),
            self.midi_learn_bindings.clone(),
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
mod tests {
    use super::*;

    #[allow(clippy::type_complexity)]
    fn make_handler_state() -> (
        SharedSynthParams,
        SharedRtSynthParams,
        SharedRuntimeModSources,
        SharedRuntimeVoiceStates,
        SharedTransportSnapshot,
        SynthParamsVersion,
        ScopeBuffer,
        UiInputQueue,
        PerformanceCountersHandle,
        Arc<CzPluginParams>,
        SharedPresetName,
        Arc<Mutex<PresetLibrary>>,
        Arc<Mutex<Option<String>>>,
        SharedEditorState,
        SharedMidiMappings,
    ) {
        let sp = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
        let rsp = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
        let rms: SharedRuntimeModSources =
            Arc::new(ArcSwap::from_pointee(RuntimeModSources::default()));
        let rvs: SharedRuntimeVoiceStates = Arc::new(ArcSwap::from_pointee(Vec::new()));
        let ts = Arc::new(TransportSnapshot::default());
        let ver = Arc::new(AtomicU64::new(0));
        let sc: ScopeBuffer = Arc::new(Mutex::new(ScopeFrame::default()));
        let q: UiInputQueue = Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY));
        let pc = Arc::new(PerformanceCounters::default());
        let params = Arc::new(CzPluginParams::new());
        let pn: SharedPresetName = Arc::new(Mutex::new(String::new()));
        let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
        let pl: Arc<Mutex<PresetLibrary>> = Arc::new(Mutex::new(
            PresetLibrary::from_embedded_factory(factory_json),
        ));
        let lpi: Arc<Mutex<Option<String>>> = Arc::new(Mutex::new(None));
        let es: SharedEditorState = Arc::new(Mutex::new(None));
        let mm: SharedMidiMappings = Arc::new(Mutex::new(None));
        (
            sp, rsp, rms, rvs, ts, ver, sc, q, pc, params, pn, pl, lpi, es, mm,
        )
    }

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
        let (sp, rsp, rms, rvs, ts, ver, sc, q, pc, params, pn, pl, lpi, es, mm) =
            make_handler_state();

        let new_params = SynthParams {
            volume: 0.42,
            ..Default::default()
        };
        let json_str = serde_json::to_string(&new_params).unwrap();

        let result = handle_ipc_invoke(
            "setParams",
            &[serde_json::Value::String(json_str)],
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &pc,
            &params,
            &pn,
            &pl,
            &lpi,
            &es,
            &mm,
        );
        assert!(result.is_ok());
        let current = sp.load();
        assert_eq!(current.volume, 0.42);
        let rt_current = rsp.load();
        assert_eq!(rt_current.volume, 0.42);
    }

    #[allow(clippy::field_reassign_with_default)]
    #[test]
    fn get_params_rpc_returns_current_synth_params() {
        let mut initial = SynthParams::default();
        initial.volume = 0.77;
        let sp: SharedSynthParams = Arc::new(ArcSwap::new(Arc::new(initial)));
        let rsp = Arc::new(ArcSwap::from_pointee(SynthParams::default()));
        let rms: SharedRuntimeModSources =
            Arc::new(ArcSwap::from_pointee(RuntimeModSources::default()));
        let rvs: SharedRuntimeVoiceStates = Arc::new(ArcSwap::from_pointee(Vec::new()));
        let ts = Arc::new(TransportSnapshot::default());
        let ver = Arc::new(AtomicU64::new(0));
        let sc: ScopeBuffer = Arc::new(Mutex::new(ScopeFrame::default()));
        let q: UiInputQueue = Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY));
        let pc = Arc::new(PerformanceCounters::default());
        let params = Arc::new(CzPluginParams::new());
        let pn: SharedPresetName = Arc::new(Mutex::new(String::new()));
        let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
        let pl: Arc<Mutex<PresetLibrary>> = Arc::new(Mutex::new(
            PresetLibrary::from_embedded_factory(factory_json),
        ));
        let lpi: Arc<Mutex<Option<String>>> = Arc::new(Mutex::new(None));
        let es: SharedEditorState = Arc::new(Mutex::new(None));
        let mm: SharedMidiMappings = Arc::new(Mutex::new(None));

        let result = handle_ipc_invoke(
            "getParams",
            &[],
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &pc,
            &params,
            &pn,
            &pl,
            &lpi,
            &es,
            &mm,
        );
        assert!(result.is_ok());
        let val = result.unwrap();
        let volume = val["volume"].as_f64().unwrap();
        assert!((volume - 0.77).abs() < 1.0e-6);
    }

    #[test]
    fn note_on_rpc_enqueues_ui_input_event() {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, pc, params, pn, pl, lpi, es, mm) =
            make_handler_state();

        let result = handle_ipc_invoke(
            "noteOn",
            &[serde_json::json!({ "note": 60, "velocity": 0.75 })],
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &pc,
            &params,
            &pn,
            &pl,
            &lpi,
            &es,
            &mm,
        );

        assert!(result.is_ok());
        match q.pop() {
            Some(UiInputEvent::NoteOn { note, velocity }) => {
                assert_eq!(note, 60);
                assert!((velocity - 0.75).abs() < f32::EPSILON);
            }
            other => panic!("unexpected queued event: {other:?}"),
        }
    }

    #[allow(clippy::field_reassign_with_default)]
    #[test]
    fn set_params_rpc_syncs_daw_float_params() {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, pc, params, pn, pl, lpi, es, mm) =
            make_handler_state();
        assert_eq!(params.volume.value(), 0.8); // default

        let mut new_params = SynthParams::default();
        new_params.volume = 0.33;
        new_params.line1.dcw_base = 0.61;
        let json_str = serde_json::to_string(&new_params).unwrap();

        let result = handle_ipc_invoke(
            "setParams",
            &[serde_json::Value::String(json_str)],
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &pc,
            &params,
            &pn,
            &pl,
            &lpi,
            &es,
            &mm,
        );
        assert!(result.is_ok());
        assert!((params.volume.value() - 0.33).abs() < 0.000_001);
        assert!((params.warp_a_amount.value() - 0.61).abs() < 0.000_001);
    }

    #[test]
    fn transport_snapshot_round_trips_values() {
        let snapshot = TransportSnapshot::default();
        let transport = TransportInfo {
            playing: true,
            recording: false,
            tempo: 138.5,
            time_sig_num: 7,
            time_sig_den: 8,
            position_samples: 123_456,
            position_seconds: 12.75,
            position_beats: 42.5,
            bar_start_beats: 35.0,
            loop_active: true,
            loop_start_beats: 32.0,
            loop_end_beats: 48.0,
        };

        snapshot.store(&transport);
        let loaded = snapshot.load();

        assert_eq!(loaded.playing, transport.playing);
        assert_eq!(loaded.recording, transport.recording);
        assert_eq!(loaded.tempo, transport.tempo);
        assert_eq!(loaded.time_sig_num, transport.time_sig_num);
        assert_eq!(loaded.time_sig_den, transport.time_sig_den);
        assert_eq!(loaded.position_samples, transport.position_samples);
        assert_eq!(loaded.position_seconds, transport.position_seconds);
        assert_eq!(loaded.position_beats, transport.position_beats);
        assert_eq!(loaded.bar_start_beats, transport.bar_start_beats);
        assert_eq!(loaded.loop_active, transport.loop_active);
        assert_eq!(loaded.loop_start_beats, transport.loop_start_beats);
        assert_eq!(loaded.loop_end_beats, transport.loop_end_beats);
    }

    #[test]
    fn get_transport_info_rpc_returns_current_snapshot() {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, pc, params, pn, pl, lpi, es, mm) =
            make_handler_state();
        ts.store(&TransportInfo {
            playing: true,
            recording: true,
            tempo: 120.25,
            time_sig_num: 3,
            time_sig_den: 4,
            position_samples: 4096,
            position_seconds: 2.5,
            position_beats: 5.0,
            bar_start_beats: 4.0,
            loop_active: true,
            loop_start_beats: 4.0,
            loop_end_beats: 8.0,
        });

        let result = handle_ipc_invoke(
            "getTransportInfo",
            &[],
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &pc,
            &params,
            &pn,
            &pl,
            &lpi,
            &es,
            &mm,
        )
        .unwrap();

        assert_eq!(result["playing"], serde_json::Value::Bool(true));
        assert_eq!(result["recording"], serde_json::Value::Bool(true));
        assert_eq!(result["tempo"].as_f64(), Some(120.25));
        assert_eq!(result["timeSigNum"].as_u64(), Some(3));
        assert_eq!(result["timeSigDen"].as_u64(), Some(4));
        assert_eq!(result["positionSamples"].as_i64(), Some(4096));
        assert_eq!(result["positionBeats"].as_f64(), Some(5.0));
        assert_eq!(result["loopActive"], serde_json::Value::Bool(true));
        assert_eq!(result["loopEndBeats"].as_f64(), Some(8.0));
    }

    #[test]
    fn truce_driver_renders_with_transport_and_block_snapshots() {
        use std::time::Duration;
        use truce_test::{TransportSpec, assertions, driver};

        let result = driver!(Plugin)
            .duration(Duration::from_millis(20))
            .capture_block_snapshots(true)
            .transport(TransportSpec {
                bpm: 138.0,
                playing: true,
                position_beats: 16.5,
                time_signature: (7, 8),
            })
            .script(|script| {
                script.note_on(60, 100.0 / 127.0);
            })
            .run();

        assertions::assert_nonzero(&result);
        assertions::assert_no_nans(&result);
        assert!(!result.block_snapshots.is_empty());
    }

    #[test]
    fn host_event_processing_respects_sample_offsets() {
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(params);
        plugin.reset(48_000.0, 64);

        let mut events = EventList::default();
        events.push(Event {
            sample_offset: 32,
            body: EventBody::NoteOn {
                group: 0,
                channel: 0,
                note: 60,
                velocity: 127,
            },
        });

        plugin.mono_output.resize(64, 0.0);
        plugin.process_host_events_into_buffer(&events, 64);
        let mono = &plugin.mono_output[..64];

        let pre_event_peak = mono[..32]
            .iter()
            .fold(0.0_f32, |peak, sample| peak.max(sample.abs()));
        let post_event_peak = mono[32..]
            .iter()
            .fold(0.0_f32, |peak, sample| peak.max(sample.abs()));

        assert!(
            pre_event_peak <= 1.0e-6,
            "expected silence before note-on offset, got peak {pre_event_peak}"
        );
        assert!(
            post_event_peak > 1.0e-4,
            "expected audible output after note-on offset, got peak {post_event_peak}"
        );
    }

    #[test]
    fn program_change_applies_factory_preset() {
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        assert!((params.volume.value() - 0.8).abs() < 0.000_001);

        plugin.handle_host_event(&EventBody::ProgramChange {
            group: 0,
            channel: 0,
            program: 0,
        });

        assert!((params.volume.value() - 1.0).abs() < 0.000_001);
        let synth_params = plugin.synth_params.load();
        assert_eq!(
            synth_params.line_select,
            cosmo_synth_engine::params::LineSelect::L1PlusL1Prime
        );
        assert!((synth_params.portamento.time - 0.1).abs() < 0.000_001);
    }

    #[test]
    fn param_change_applies_at_event_offset() {
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        let previous_volume = plugin.cached_rt_synth_params.volume;
        assert!((previous_volume - 0.8).abs() < 0.000_001);

        params.volume.set_value(0.2);

        let mut events = EventList::default();
        events.push(Event {
            sample_offset: 32,
            body: EventBody::ParamChange {
                id: CzPluginParamsParamId::Volume as u32,
                value: 0.2,
            },
        });

        let tracked = CzPlugin::tracked_param_changes(&events);
        assert!(tracked[CzPluginParamsParamId::Volume as usize]);

        let params_version = plugin.synth_params_version.load(Ordering::Acquire);
        let previous_rt = (*plugin.cached_rt_synth_params).clone();
        let mut merged = (*plugin.cached_rt_synth_params).clone();
        apply_daw_params(&mut merged, &params);
        for (id, changed) in tracked.iter().enumerate() {
            if !*changed {
                continue;
            }
            if let Some(prev_value) = read_daw_param_by_id(&previous_rt, id as u32) {
                let _ = write_daw_param_by_id(&mut merged, id as u32, f64::from(prev_value));
            }
        }

        let rt_merged = Arc::new(merged);
        plugin.cached_rt_synth_params = Arc::clone(&rt_merged);
        if let Some(proc) = plugin.processor.as_mut() {
            proc.set_shared_params(rt_merged);
        }
        plugin.cached_synth_params_version = params_version;

        plugin.process_host_events_into_buffer(&events, 64);

        let volume_before = plugin.cached_rt_synth_params.volume;
        assert!((volume_before - 0.2).abs() < 0.000_001);
    }

    #[test]
    fn set_preset_name_rpc_stores_name() {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, pc, params, pn, pl, lpi, es, mm) =
            make_handler_state();

        let result = handle_ipc_invoke(
            "setPresetName",
            &[serde_json::Value::String("Warm Pad".to_string())],
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &pc,
            &params,
            &pn,
            &pl,
            &lpi,
            &es,
            &mm,
        );
        assert!(result.is_ok());
        let stored = pn.lock().unwrap();
        assert_eq!(*stored, "Warm Pad");
    }

    #[test]
    fn get_preset_name_rpc_returns_current_name() {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, pc, params, pn, pl, lpi, es, mm) =
            make_handler_state();
        {
            let mut stored = pn.lock().unwrap();
            *stored = "Factory Brass".to_string();
        }

        let result = handle_ipc_invoke(
            "getPresetName",
            &[],
            &sp,
            &rsp,
            &rms,
            &rvs,
            &ts,
            &ver,
            &sc,
            &q,
            &pc,
            &params,
            &pn,
            &pl,
            &lpi,
            &es,
            &mm,
        );
        assert!(result.is_ok());
        assert_eq!(
            result.unwrap(),
            serde_json::Value::String("Factory Brass".to_string())
        );
    }

    #[test]
    fn save_state_includes_preset_name() {
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        *plugin.preset_name.lock().unwrap() = "Resonant Pad".to_string();

        let state = plugin.save_state();
        assert!(!state.is_empty());

        let parsed: serde_json::Value =
            serde_json::from_slice(&state).expect("state should be valid JSON");
        assert_eq!(parsed["preset_name"], "Resonant Pad");
        assert!(parsed.get("synth_params").is_some());
    }

    #[test]
    fn load_state_restores_preset_name() {
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        // Save state with a preset name
        *plugin.preset_name.lock().unwrap() = "Bright Piano".to_string();
        let state = plugin.save_state();

        // Create new plugin and load state
        let params2 = Arc::new(CzPluginParams::new());
        let mut plugin2 = CzPlugin::new(Arc::clone(&params2));
        plugin2.reset(48_000.0, 64);
        assert!(plugin2.preset_name.lock().unwrap().is_empty());

        let result = plugin2.load_state(&state);
        assert!(result.is_ok());
        assert_eq!(*plugin2.preset_name.lock().unwrap(), "Bright Piano");
    }

    #[test]
    fn load_state_falls_back_to_old_format() {
        // Old format: flat SynthParams JSON (no wrapper)
        let synth = SynthParams::default();
        let data = serde_json::to_vec(&synth).unwrap();

        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        // Set a name to verify it's not overwritten
        *plugin.preset_name.lock().unwrap() = "Existing Name".to_string();

        let result = plugin.load_state(&data);
        assert!(result.is_ok());
        // Old format should not touch preset_name
        assert_eq!(*plugin.preset_name.lock().unwrap(), "Existing Name");
    }
}
