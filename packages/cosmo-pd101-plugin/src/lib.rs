//! Cosmo PD-101 Phase Distortion synthesizer — VST3/CLAP/AUv3 via truce.audio.

#![recursion_limit = "256"]

#[cfg(not(test))]
use std::fs;
use std::fs::OpenOptions;
use std::io::Write;
#[cfg(not(test))]
use std::path::PathBuf;
#[cfg(not(test))]
use std::sync::OnceLock;
use std::sync::atomic::{AtomicBool, AtomicU32, AtomicU64, Ordering};
use std::sync::{Arc, Mutex, Once};
use std::time::{SystemTime, UNIX_EPOCH};

use arc_swap::ArcSwap;
use cosmo_synth_engine::envelope::normalize_synth_params_envelopes_to_raw_if_human;
use cosmo_synth_engine::params::{
    MidiMappingBinding, SynthParams, apply_midi_mapping as apply_engine_midi_mapping,
    parameter_range_for_key,
};
use cosmo_synth_engine::processor::state::{RuntimeModSources, RuntimeVoiceDebugState};
use cosmo_synth_engine::processor::{
    CosmoInputEvent, CosmoProcessor, CosmoTimedInputEvent, CosmoTransportState,
};
use crossbeam_queue::ArrayQueue;
use truce::prelude::*;
use truce_core::events::TransportInfo;
use truce_core::midi::{norm_7bit, norm_pitch_bend};
use uuid::Uuid;

pub mod ffi;
pub mod global_settings;
pub mod gui;
pub mod preset_library;
pub mod preset_library_path;
pub mod session_state;

use crate::global_settings::PluginLogLevel;
use crate::preset_library::PresetLibrary;

const PLUGIN_LOG_PATH: &str = "/tmp/cosmo-plugin.log";
const MAX_UI_INPUT_EVENTS_PER_BLOCK: usize = 64;
const UI_INPUT_QUEUE_CAPACITY: usize = 1024;
const DEFAULT_USER_PRESET_AUTHOR: &str = "User";

#[cfg(not(test))]
#[derive(Clone)]
struct LogLevelCache {
    settings_path: Option<PathBuf>,
    settings_modified_at: Option<SystemTime>,
    settings_len: Option<u64>,
    level: PluginLogLevel,
}

#[cfg(not(test))]
impl Default for LogLevelCache {
    fn default() -> Self {
        Self {
            settings_path: None,
            settings_modified_at: None,
            settings_len: None,
            level: PluginLogLevel::Info,
        }
    }
}

#[cfg(not(test))]
static LOG_LEVEL_CACHE: OnceLock<Mutex<LogLevelCache>> = OnceLock::new();

fn log_timestamp_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or_default()
}

pub fn append_log(message: &str) {
    append_log_at_level(PluginLogLevel::Info, message);
}

pub fn append_log_debug(message: &str) {
    append_log_at_level(PluginLogLevel::Debug, message);
}

pub fn append_log_warn(message: &str) {
    append_log_at_level(PluginLogLevel::Warn, message);
}

pub fn append_log_error(message: &str) {
    append_log_at_level(PluginLogLevel::Error, message);
}

#[cfg(not(test))]
fn cached_log_level() -> PluginLogLevel {
    let cache = LOG_LEVEL_CACHE.get_or_init(|| Mutex::new(LogLevelCache::default()));
    let settings_path = crate::global_settings::get_global_settings_path();
    let settings_metadata = fs::metadata(&settings_path).ok();
    let settings_modified_at = settings_metadata
        .as_ref()
        .and_then(|metadata| metadata.modified().ok());
    let settings_len = settings_metadata.as_ref().map(|metadata| metadata.len());

    let mut cache = cache.lock().unwrap();
    let path_changed = cache
        .settings_path
        .as_ref()
        .map(|path| path != &settings_path)
        .unwrap_or(true);
    let modified_changed = cache.settings_modified_at != settings_modified_at;
    let len_changed = cache.settings_len != settings_len;

    if path_changed || modified_changed || len_changed {
        cache.level = crate::global_settings::load_or_init_global_settings()
            .map(|settings| settings.log_level)
            .unwrap_or(PluginLogLevel::Info);
        cache.settings_path = Some(settings_path);
        cache.settings_modified_at = settings_modified_at;
        cache.settings_len = settings_len;
    }

    cache.level
}

#[cfg(test)]
static TEST_LOG_LEVEL: AtomicU32 = AtomicU32::new(PluginLogLevel::Error as u32);

#[cfg(test)]
fn set_test_log_level(level: PluginLogLevel) {
    TEST_LOG_LEVEL.store(level as u32, Ordering::Relaxed);
}

#[cfg(test)]
fn cached_log_level() -> PluginLogLevel {
    match TEST_LOG_LEVEL.load(Ordering::Relaxed) {
        value if value == PluginLogLevel::Error as u32 => PluginLogLevel::Error,
        value if value == PluginLogLevel::Warn as u32 => PluginLogLevel::Warn,
        value if value == PluginLogLevel::Info as u32 => PluginLogLevel::Info,
        value if value == PluginLogLevel::Debug as u32 => PluginLogLevel::Debug,
        _ => PluginLogLevel::Error,
    }
}

fn should_log(level: PluginLogLevel) -> bool {
    level <= cached_log_level()
}

fn log_level_label(level: PluginLogLevel) -> &'static str {
    match level {
        PluginLogLevel::Error => "ERROR",
        PluginLogLevel::Warn => "WARN",
        PluginLogLevel::Info => "INFO",
        PluginLogLevel::Debug => "DEBUG",
    }
}

fn append_log_at_level(level: PluginLogLevel, message: &str) {
    if !should_log(level) {
        return;
    }
    if let Ok(mut file) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(PLUGIN_LOG_PATH)
    {
        let _ = writeln!(
            file,
            "[rust level={} pid={} ts_ms={}] {}",
            log_level_label(level),
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
            append_log_error(&format!("PANIC: {}{}", msg, location));
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
type UiInputQueue = Arc<ArrayQueue<CosmoInputEvent>>;
type SharedSynthParams = Arc<ArcSwap<SynthParams>>;
type SharedRtSynthParams = Arc<ArcSwap<SynthParams>>;
type SharedRuntimeModSources = Arc<ArcSwap<RuntimeModSources>>;
type SharedRuntimeVoiceStates = Arc<ArcSwap<Vec<RuntimeVoiceDebugState>>>;
type SharedTransportSnapshot = Arc<TransportSnapshot>;
type SynthParamsVersion = Arc<AtomicU64>;
const MIDI_CC_QUEUE_CAPACITY: usize = 128;
type MidiCcQueue = Arc<ArrayQueue<(u8, u8, u8)>>;

fn denorm_midi_7bit(value: f32) -> u8 {
    (value.clamp(0.0, 1.0) * 127.0).round() as u8
}

fn build_rt_synth_params(params: &SynthParams) -> SynthParams {
    let mut rt_params = params.clone();
    normalize_synth_params_envelopes_to_raw_if_human(&mut rt_params);
    rt_params
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

// =============================================================================
// DAW-automatable parameters (truce FloatParams)
// =============================================================================

#[derive(Params)]
pub struct CzPluginParams {
    #[param(name = "Volume", range = "linear(0.0, 1.0)", default = 1.0, unit = "%")]
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

    #[param(name = "Portamento Rate", range = "linear(0.0, 127.0)", default = 85.0)]
    pub portamento_rate: FloatParam,

    #[param(name = "Portamento Time", range = "linear(0.0, 5.0)", default = 0.1)]
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

    #[param(name = "Macro 1", range = "linear(0.0, 1.0)", default = 0.0)]
    pub macro1: FloatParam,

    #[param(name = "Macro 2", range = "linear(0.0, 1.0)", default = 0.0)]
    pub macro2: FloatParam,

    #[param(name = "Macro 3", range = "linear(0.0, 1.0)", default = 0.0)]
    pub macro3: FloatParam,

    #[param(name = "Macro 4", range = "linear(0.0, 1.0)", default = 0.0)]
    pub macro4: FloatParam,

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
    synth.macro1 = params.macro1.value();
    synth.macro2 = params.macro2.value();
    synth.macro3 = params.macro3.value();
    synth.macro4 = params.macro4.value();
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
        x if x == CzPluginParamsParamId::Macro1 as u32 => synth.macro1 = value,
        x if x == CzPluginParamsParamId::Macro2 as u32 => synth.macro2 = value,
        x if x == CzPluginParamsParamId::Macro3 as u32 => synth.macro3 = value,
        x if x == CzPluginParamsParamId::Macro4 as u32 => synth.macro4 = value,
        _ => return false,
    }
    true
}

fn daw_param_key_by_id(id: u32) -> Option<&'static str> {
    match id {
        x if x == CzPluginParamsParamId::Volume as u32 => Some("volume"),
        x if x == CzPluginParamsParamId::WarpAAmount as u32 => Some("warpAAmount"),
        x if x == CzPluginParamsParamId::WarpBAmount as u32 => Some("warpBAmount"),
        x if x == CzPluginParamsParamId::AlgoBlendA as u32 => Some("algoBlendA"),
        x if x == CzPluginParamsParamId::AlgoBlendB as u32 => Some("algoBlendB"),
        x if x == CzPluginParamsParamId::Line1Level as u32 => Some("line1Level"),
        x if x == CzPluginParamsParamId::Line2Level as u32 => Some("line2Level"),
        x if x == CzPluginParamsParamId::Line1Octave as u32 => Some("line1Octave"),
        x if x == CzPluginParamsParamId::Line2Octave as u32 => Some("line2Octave"),
        x if x == CzPluginParamsParamId::DetuneNote as u32 => Some("line2DetuneNote"),
        x if x == CzPluginParamsParamId::DetuneFine as u32 => Some("line2DetuneFine"),
        x if x == CzPluginParamsParamId::VelocityCurve as u32 => Some("velocityCurve"),
        x if x == CzPluginParamsParamId::PitchBendRange as u32 => Some("pitchBendRange"),
        x if x == CzPluginParamsParamId::PortamentoRate as u32 => Some("portamentoRate"),
        x if x == CzPluginParamsParamId::PortamentoTime as u32 => Some("portamentoTime"),
        x if x == CzPluginParamsParamId::LfoRate as u32 => Some("lfoRate"),
        x if x == CzPluginParamsParamId::LfoDepth as u32 => Some("lfoDepth"),
        x if x == CzPluginParamsParamId::LfoOffset as u32 => Some("lfoOffset"),
        x if x == CzPluginParamsParamId::Lfo2Rate as u32 => Some("lfo2Rate"),
        x if x == CzPluginParamsParamId::Lfo2Depth as u32 => Some("lfo2Depth"),
        x if x == CzPluginParamsParamId::Lfo2Offset as u32 => Some("lfo2Offset"),
        x if x == CzPluginParamsParamId::RandomRate as u32 => Some("randomRate"),
        x if x == CzPluginParamsParamId::ModEnvAttack as u32 => Some("modEnvAttack"),
        x if x == CzPluginParamsParamId::ModEnvDecay as u32 => Some("modEnvDecay"),
        x if x == CzPluginParamsParamId::ModEnvSustain as u32 => Some("modEnvSustain"),
        x if x == CzPluginParamsParamId::ModEnvRelease as u32 => Some("modEnvRelease"),
        x if x == CzPluginParamsParamId::Macro1 as u32 => Some("macro1"),
        x if x == CzPluginParamsParamId::Macro2 as u32 => Some("macro2"),
        x if x == CzPluginParamsParamId::Macro3 as u32 => Some("macro3"),
        x if x == CzPluginParamsParamId::Macro4 as u32 => Some("macro4"),
        _ => None,
    }
}

#[cfg(any(feature = "vst3", test))]
fn daw_param_id_by_key(key: &str) -> Option<u32> {
    match key {
        "volume" => Some(CzPluginParamsParamId::Volume as u32),
        "warpAAmount" => Some(CzPluginParamsParamId::WarpAAmount as u32),
        "warpBAmount" => Some(CzPluginParamsParamId::WarpBAmount as u32),
        "algoBlendA" => Some(CzPluginParamsParamId::AlgoBlendA as u32),
        "algoBlendB" => Some(CzPluginParamsParamId::AlgoBlendB as u32),
        "line1Level" => Some(CzPluginParamsParamId::Line1Level as u32),
        "line2Level" => Some(CzPluginParamsParamId::Line2Level as u32),
        "line1Octave" => Some(CzPluginParamsParamId::Line1Octave as u32),
        "line2Octave" => Some(CzPluginParamsParamId::Line2Octave as u32),
        "line2DetuneNote" => Some(CzPluginParamsParamId::DetuneNote as u32),
        "line2DetuneFine" => Some(CzPluginParamsParamId::DetuneFine as u32),
        "velocityCurve" => Some(CzPluginParamsParamId::VelocityCurve as u32),
        "pitchBendRange" => Some(CzPluginParamsParamId::PitchBendRange as u32),
        "portamentoRate" => Some(CzPluginParamsParamId::PortamentoRate as u32),
        "portamentoTime" => Some(CzPluginParamsParamId::PortamentoTime as u32),
        "lfoRate" => Some(CzPluginParamsParamId::LfoRate as u32),
        "lfoDepth" => Some(CzPluginParamsParamId::LfoDepth as u32),
        "lfoOffset" => Some(CzPluginParamsParamId::LfoOffset as u32),
        "lfo2Rate" => Some(CzPluginParamsParamId::Lfo2Rate as u32),
        "lfo2Depth" => Some(CzPluginParamsParamId::Lfo2Depth as u32),
        "lfo2Offset" => Some(CzPluginParamsParamId::Lfo2Offset as u32),
        "randomRate" => Some(CzPluginParamsParamId::RandomRate as u32),
        "modEnvAttack" => Some(CzPluginParamsParamId::ModEnvAttack as u32),
        "modEnvDecay" => Some(CzPluginParamsParamId::ModEnvDecay as u32),
        "modEnvSustain" => Some(CzPluginParamsParamId::ModEnvSustain as u32),
        "modEnvRelease" => Some(CzPluginParamsParamId::ModEnvRelease as u32),
        "macro1" => Some(CzPluginParamsParamId::Macro1 as u32),
        "macro2" => Some(CzPluginParamsParamId::Macro2 as u32),
        "macro3" => Some(CzPluginParamsParamId::Macro3 as u32),
        "macro4" => Some(CzPluginParamsParamId::Macro4 as u32),
        _ => None,
    }
}

#[cfg(any(feature = "vst3", test))]
fn resolve_vst3_midi_mapping_param_id(
    bindings: &[crate::session_state::MidiLearnBinding],
    bus_index: i32,
    channel: i16,
    cc: i16,
) -> Option<u32> {
    if bus_index != 0 || !(0..=15).contains(&channel) || !(0..=127).contains(&cc) {
        return None;
    }

    let mut omni_match = None;

    for binding in bindings {
        if binding.cc != i32::from(cc) {
            continue;
        }
        let Some(param_id) = daw_param_id_by_key(&binding.param_key) else {
            continue;
        };

        if binding.channel == i32::from(channel) {
            return Some(param_id);
        }
        if binding.channel == -1 && omni_match.is_none() {
            omni_match = Some(param_id);
        }
    }

    omni_match
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
        x if x == CzPluginParamsParamId::Macro1 as u32 => Some(synth.macro1),
        x if x == CzPluginParamsParamId::Macro2 as u32 => Some(synth.macro2),
        x if x == CzPluginParamsParamId::Macro3 as u32 => Some(synth.macro3),
        x if x == CzPluginParamsParamId::Macro4 as u32 => Some(synth.macro4),
        _ => None,
    }
}

fn read_current_daw_param_by_id(params: &CzPluginParams, id: u32) -> Option<f32> {
    match id {
        x if x == CzPluginParamsParamId::Volume as u32 => Some(params.volume.value()),
        x if x == CzPluginParamsParamId::WarpAAmount as u32 => Some(params.warp_a_amount.value()),
        x if x == CzPluginParamsParamId::WarpBAmount as u32 => Some(params.warp_b_amount.value()),
        x if x == CzPluginParamsParamId::AlgoBlendA as u32 => Some(params.algo_blend_a.value()),
        x if x == CzPluginParamsParamId::AlgoBlendB as u32 => Some(params.algo_blend_b.value()),
        x if x == CzPluginParamsParamId::Line1Level as u32 => Some(params.line1_level.value()),
        x if x == CzPluginParamsParamId::Line2Level as u32 => Some(params.line2_level.value()),
        x if x == CzPluginParamsParamId::Line1Octave as u32 => Some(params.line1_octave.value()),
        x if x == CzPluginParamsParamId::Line2Octave as u32 => Some(params.line2_octave.value()),
        x if x == CzPluginParamsParamId::DetuneNote as u32 => Some(params.detune_note.value()),
        x if x == CzPluginParamsParamId::DetuneFine as u32 => Some(params.detune_fine.value()),
        x if x == CzPluginParamsParamId::VelocityCurve as u32 => {
            Some(params.velocity_curve.value())
        }
        x if x == CzPluginParamsParamId::PitchBendRange as u32 => {
            Some(params.pitch_bend_range.value())
        }
        x if x == CzPluginParamsParamId::PortamentoRate as u32 => {
            Some(params.portamento_rate.value())
        }
        x if x == CzPluginParamsParamId::PortamentoTime as u32 => {
            Some(params.portamento_time.value())
        }
        x if x == CzPluginParamsParamId::LfoRate as u32 => Some(params.lfo_rate.value()),
        x if x == CzPluginParamsParamId::LfoDepth as u32 => Some(params.lfo_depth.value()),
        x if x == CzPluginParamsParamId::LfoOffset as u32 => Some(params.lfo_offset.value()),
        x if x == CzPluginParamsParamId::Lfo2Rate as u32 => Some(params.lfo2_rate.value()),
        x if x == CzPluginParamsParamId::Lfo2Depth as u32 => Some(params.lfo2_depth.value()),
        x if x == CzPluginParamsParamId::Lfo2Offset as u32 => Some(params.lfo2_offset.value()),
        x if x == CzPluginParamsParamId::RandomRate as u32 => Some(params.random_rate.value()),
        x if x == CzPluginParamsParamId::ModEnvAttack as u32 => Some(params.mod_env_attack.value()),
        x if x == CzPluginParamsParamId::ModEnvDecay as u32 => Some(params.mod_env_decay.value()),
        x if x == CzPluginParamsParamId::ModEnvSustain as u32 => {
            Some(params.mod_env_sustain.value())
        }
        x if x == CzPluginParamsParamId::ModEnvRelease as u32 => {
            Some(params.mod_env_release.value())
        }
        x if x == CzPluginParamsParamId::Macro1 as u32 => Some(params.macro1.value()),
        x if x == CzPluginParamsParamId::Macro2 as u32 => Some(params.macro2.value()),
        x if x == CzPluginParamsParamId::Macro3 as u32 => Some(params.macro3.value()),
        x if x == CzPluginParamsParamId::Macro4 as u32 => Some(params.macro4.value()),
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
    params.macro1.set_value(synth.macro1 as f64);
    params.macro2.set_value(synth.macro2 as f64);
    params.macro3.set_value(synth.macro3 as f64);
    params.macro4.set_value(synth.macro4 as f64);
}

pub(crate) type SharedPresetSession = Arc<Mutex<crate::session_state::PresetSession>>;
pub(crate) type SharedEditorState = Arc<Mutex<Option<crate::session_state::EditorState>>>;
pub(crate) type SharedMidiMappings = Arc<Mutex<crate::session_state::MidiLearnState>>;

fn persist_midi_learn_bindings(midi_learn_state: &SharedMidiMappings) {
    let bindings = midi_learn_state
        .lock()
        .map(|state| state.bindings.clone())
        .unwrap_or_else(|_| crate::session_state::default_midi_bindings());

    if let Err(error) = crate::global_settings::save_midi_learn_bindings(bindings) {
        append_log_warn(&format!(
            "failed to persist global midi learn bindings: {}",
            error
        ));
    }
}

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
    params: &CzPluginParams,
    preset_session: &SharedPresetSession,
    preset_library: &Arc<Mutex<PresetLibrary>>,
    editor_state: &SharedEditorState,
    midi_learn_state: &SharedMidiMappings,
) -> Result<serde_json::Value, String> {
    if method != "getScopeData"
        && method != "clientLog"
        && method != "getRuntimeModSources"
        && method != "getTransportInfo"
        && method != "getRuntimeVoiceStates"
    {
        append_log_debug(&format!("ipc invoke method={method} args={}", args.len()));
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
                .push(CosmoInputEvent::NoteOn { note, velocity })
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
                .push(CosmoInputEvent::NoteOff { note })
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
                .push(CosmoInputEvent::ControlChange {
                    channel: 0,
                    cc: 64,
                    value: if on { 127 } else { 0 },
                })
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
                .push(CosmoInputEvent::PitchBend { value })
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
                .push(CosmoInputEvent::ControlChange {
                    channel: 0,
                    cc: 1,
                    value: denorm_midi_7bit(value),
                })
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
                .push(CosmoInputEvent::Aftertouch { value })
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
                .push(CosmoInputEvent::PolyAftertouch { note, value })
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
                .push(CosmoInputEvent::Macro { index, value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "panic" => {
            ui_input_queue
                .push(CosmoInputEvent::Panic)
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
        "getParamsVersion" => Ok(serde_json::Value::from(
            synth_params_version.load(Ordering::Acquire),
        )),
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
        "clientLog" => {
            let level = args
                .first()
                .and_then(serde_json::Value::as_str)
                .unwrap_or("info");
            let message = args
                .get(1)
                .and_then(serde_json::Value::as_str)
                .unwrap_or("");
            match level {
                "debug" => append_log_debug(&format!("[webview:{level}] {message}")),
                "warn" => append_log_warn(&format!("[webview:{level}] {message}")),
                "error" => append_log_error(&format!("[webview:{level}] {message}")),
                _ => append_log(&format!("[webview:{level}] {message}")),
            }
            Ok(serde_json::Value::Null)
        }
        "setPresetName" => {
            let name = args
                .first()
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetName expects a string argument".to_string())?;
            if let Ok(mut stored) = preset_session.lock() {
                stored.active_preset_name_base = name.to_string();
            }
            Ok(serde_json::Value::Null)
        }
        "getPresetName" => {
            let name = preset_session
                .lock()
                .map(|session| session.active_preset_name_base.clone())
                .unwrap_or_default();
            Ok(serde_json::Value::String(name))
        }
        "getPresetSession" => {
            let session = preset_session
                .lock()
                .map(|session| session.clone())
                .map_err(|e| e.to_string())?;
            serde_json::to_value(session).map_err(|e| e.to_string())
        }
        "setPresetSession" => {
            let payload = args
                .first()
                .ok_or_else(|| "setPresetSession expects an object payload".to_string())?;
            let session: crate::session_state::PresetSession =
                serde_json::from_value(payload.clone())
                    .map_err(|e| format!("invalid PresetSession: {e}"))?;
            if let Ok(mut stored) = preset_session.lock() {
                *stored = session;
            }
            Ok(serde_json::Value::Null)
        }
        "getPresetLibrary" => {
            let source_filter = args
                .first()
                .and_then(serde_json::Value::as_object)
                .and_then(|o| o.get("source"))
                .and_then(serde_json::Value::as_str);
            let lib = preset_library.lock().map_err(|e| e.to_string())?;
            let entries: Vec<serde_json::Value> = lib
                .list_records(source_filter)
                .map_err(|e| e.to_string())?
                .iter()
                .map(|e| {
                    serde_json::json!({
                        "id": e.entry.id,
                        "name": e.entry.name,
                        "source": e.entry.source,
                        "author": e.entry.author,
                        "starred": e.entry.starred,
                        "sortIndex": e.entry.sort_index,
                        "bankId": e.entry.bank_id,
                        "bankName": e.entry.bank_name,
                        "favorite": e.favorite,
                        "tags": e.entry.tags,
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

            let (entry_data, preset_name_val, entry_macro_labels): (
                serde_json::Value,
                String,
                Option<[String; 4]>,
            ) = {
                let lib = preset_library.lock().map_err(|e| e.to_string())?;
                let entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                let data = entry.data.clone();
                let name = entry.name;
                let labels = Some(entry.macro_labels);
                (data, name, labels)
            };

            let mut new_sp: SynthParams = if let Some(params_value) = entry_data.get("params") {
                serde_json::from_value(params_value.clone())
                    .map_err(|e| format!("Failed to deserialize preset: {e}"))?
            } else {
                serde_json::from_value(entry_data)
                    .map_err(|e| format!("Failed to deserialize preset: {e}"))?
            };

            // Override macro_labels with the entry's stored labels (handles
            // presets saved before macro_labels was added to SynthParams).
            if let Some(labels) = entry_macro_labels {
                new_sp.macro_labels = labels;
            }

            sync_all_daw_params_from_synth(params, &new_sp);
            let rt_params = build_rt_synth_params(&new_sp);
            synth_params.store(Arc::new(new_sp));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);

            if let Ok(mut stored) = preset_session.lock() {
                stored.active_preset_name_base = preset_name_val.clone();
                stored.loaded_preset_id = Some(id.to_string());
                stored.is_dirty = false;
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
            let macro_labels: [String; 4] = payload
                .get("macroLabels")
                .and_then(|v| serde_json::from_value(v.clone()).ok())
                .unwrap_or_else(|| SynthParams::default().macro_labels);

            let params_val = synth_params.load();
            let data = serde_json::to_value(&**params_val).map_err(|e| e.to_string())?;

            let id = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let entry = lib
                    .add_entry(name, tags, macro_labels, data)
                    .map_err(|e| e.to_string())?;
                entry.id.clone()
            };

            Ok(serde_json::json!({ "id": id }))
        }
        "savePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "savePreset expects an object payload as first argument".to_string()
                })?;
            let name = payload
                .get("name")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "savePreset payload missing name".to_string())?
                .to_string();
            let author = payload
                .get("author")
                .and_then(serde_json::Value::as_str)
                .unwrap_or_default()
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
            let macro_labels: [String; 4] = payload
                .get("macroLabels")
                .and_then(|v| serde_json::from_value(v.clone()).ok())
                .unwrap_or_else(|| SynthParams::default().macro_labels);
            let payload_id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .filter(|value| !value.is_empty())
                .map(|value| value.to_string());

            let data = if let Some(data_value) = payload.get("data") {
                data_value.clone()
            } else {
                let params_val = synth_params.load();
                serde_json::to_value(&**params_val).map_err(|e| e.to_string())?
            };

            let saved_entry = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = if let Some(id) = payload_id.clone() {
                    lib.get_entry(&id)
                        .map_err(|e| e.to_string())?
                        .ok_or_else(|| "Preset not found".to_string())?
                } else {
                    crate::preset_library::PresetLibraryEntry {
                        id: Uuid::new_v4().to_string(),
                        name: String::new(),
                        source: "user".to_string(),
                        author: String::new(),
                        starred: false,
                        sort_index: u32::MAX,
                        bank_id: None,
                        bank_name: None,
                        tags: vec![],
                        macro_labels: SynthParams::default().macro_labels,
                        factory_version: 0,
                        data: serde_json::Value::Null,
                    }
                };

                entry.name = name.clone();
                entry.source = "user".to_string();
                entry.bank_id = None;
                entry.bank_name = None;
                entry.author = if author.trim().is_empty() {
                    DEFAULT_USER_PRESET_AUTHOR.to_string()
                } else {
                    author
                };
                entry.tags = tags;
                entry.macro_labels = macro_labels;
                entry.data = data;

                lib.save_entry(entry).map_err(|e| e.to_string())?
            };

            if let Ok(mut stored) = preset_session.lock() {
                stored.active_preset_name_base = saved_entry.name.clone();
                stored.loaded_preset_id = Some(saved_entry.id.clone());
                stored.is_dirty = false;
            }

            Ok(serde_json::json!({
                "id": saved_entry.id,
                "name": saved_entry.name,
            }))
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
                // Keep the legacy RPC name, but persist user favorites separately
                // from authored factory star metadata.
                let _ = lib.set_starred(id, starred).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "setPresetAuthor" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "setPresetAuthor expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetAuthor payload missing id".to_string())?;
            let author = payload
                .get("author")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetAuthor payload missing author".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                entry.author = author.to_string();
                let _ = lib.save_entry(entry).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "setPresetTags" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "setPresetTags expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setPresetTags payload missing id".to_string())?;
            let tags: Vec<String> = payload
                .get("tags")
                .and_then(|v| v.as_array())
                .map(|a| {
                    a.iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect()
                })
                .unwrap_or_default();

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let mut entry = lib
                    .get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?;
                entry.tags = tags;
                let _ = lib.save_entry(entry).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "importPresetBank" => {
            let payload = args
                .first()
                .ok_or_else(|| "importPresetBank expects an object payload".to_string())?;
            let bundle: crate::preset_library::PresetBankBundle =
                serde_json::from_value(payload.clone())
                    .map_err(|e| format!("invalid preset bank bundle: {e}"))?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                lib.import_bank(bundle).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "listFxModulePresets" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "listFxModulePresets expects an object payload as first argument".to_string()
                })?;
            let module_type = payload
                .get("moduleType")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "listFxModulePresets payload missing moduleType".to_string())?;

            let lib = preset_library.lock().map_err(|e| e.to_string())?;
            serde_json::to_value(
                lib.list_fx_module_presets(module_type)
                    .map_err(|e| e.to_string())?,
            )
            .map_err(|e| e.to_string())
        }
        "saveFxModulePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "saveFxModulePreset expects an object payload as first argument".to_string()
                })?;
            let name = payload
                .get("name")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "saveFxModulePreset payload missing name".to_string())?
                .to_string();
            let module_type = payload
                .get("moduleType")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "saveFxModulePreset payload missing moduleType".to_string())?
                .to_string();
            let patch = payload
                .get("patch")
                .cloned()
                .ok_or_else(|| "saveFxModulePreset payload missing patch".to_string())?;

            let saved = {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                lib.save_fx_module_preset(name, module_type, patch)
                    .map_err(|e| e.to_string())?
            };

            serde_json::to_value(saved).map_err(|e| e.to_string())
        }
        "deleteFxModulePreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "deleteFxModulePreset expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "deleteFxModulePreset payload missing id".to_string())?;

            {
                let mut lib = preset_library.lock().map_err(|e| e.to_string())?;
                let _ = lib.delete_fx_module_preset(id).map_err(|e| e.to_string())?;
            }

            Ok(serde_json::Value::Null)
        }
        "exportPreset" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "exportPreset expects an object payload as first argument".to_string()
                })?;
            let id = payload
                .get("id")
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "exportPreset payload missing id".to_string())?;

            let entry = {
                let lib = preset_library.lock().map_err(|e| e.to_string())?;
                lib.get_entry(id)
                    .map_err(|e| e.to_string())?
                    .ok_or_else(|| "Preset not found".to_string())?
            };

            let json = serde_json::to_string_pretty(&serde_json::json!({
                "id": entry.id,
                "name": entry.name,
                "source": entry.source,
                "bankId": entry.bank_id,
                "bankName": entry.bank_name,
                "author": entry.author,
                "starred": entry.starred,
                "tags": entry.tags,
                "data": entry.data,
            }))
            .map_err(|e| e.to_string())?;

            Ok(serde_json::json!({
                "filename": format!("{}.json", entry.name),
                "json": json,
            }))
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
        "setMidiLearnMode" => {
            let mode = args
                .first()
                .and_then(|v| v.as_bool())
                .ok_or_else(|| "setMidiLearnMode expects a boolean".to_string())?;
            // TODO: remove this diagnostic once cross-format MIDI learn mode behavior is verified.
            append_log_debug(&format!("ipc_set_midi_learn_mode mode={}", mode));
            if let Ok(mut state) = midi_learn_state.lock() {
                state.learn_mode = mode;
                state.version += 1;
                append_log_debug(&format!(
                    "ipc_set_midi_learn_mode_applied mode={} version={} pending={:?}",
                    state.learn_mode, state.version, state.pending_param_key
                ));
            }
            Ok(serde_json::Value::Null)
        }
        "setPendingMidiLearnParam" => {
            let param_key = args.first().cloned().unwrap_or(serde_json::Value::Null);
            if let Ok(mut state) = midi_learn_state.lock() {
                state.pending_param_key = param_key
                    .as_str()
                    .filter(|value| !value.is_empty())
                    .map(|value| value.to_string());
                state.version += 1;
            }
            Ok(serde_json::Value::Null)
        }
        "addMidiBinding" => {
            let param_key = args
                .first()
                .and_then(|v| v.as_str())
                .ok_or_else(|| "addMidiBinding expects param_key".to_string())?;
            let channel = args
                .get(1)
                .and_then(|v| v.as_i64())
                .ok_or_else(|| "addMidiBinding expects channel".to_string())?
                as i32;
            let cc =
                args.get(2)
                    .and_then(|v| v.as_i64())
                    .ok_or_else(|| "addMidiBinding expects cc".to_string())? as i32;
            // TODO: remove this diagnostic once cross-format MIDI binding RPC flow is verified.
            append_log_debug(&format!(
                "ipc_add_midi_binding param_key={} channel={} cc={}",
                param_key, channel, cc
            ));
            if let Ok(mut state) = midi_learn_state.lock() {
                state
                    .bindings
                    .retain(|binding| binding.param_key != param_key);
                state.bindings.push(crate::session_state::MidiLearnBinding {
                    param_key: param_key.to_string(),
                    channel,
                    cc,
                });
                state.version += 1;
                append_log_debug(&format!(
                    "ipc_add_midi_binding_applied version={} bindings_count={} latest={{param_key:{},channel:{},cc:{}}}",
                    state.version,
                    state.bindings.len(),
                    param_key,
                    channel,
                    cc
                ));
            }
            persist_midi_learn_bindings(midi_learn_state);
            Ok(serde_json::Value::Null)
        }
        "removeMidiBinding" => {
            let binding = args
                .first()
                .cloned()
                .ok_or_else(|| "removeMidiBinding expects a binding object".to_string())?;
            let binding: crate::session_state::MidiLearnBinding =
                serde_json::from_value(binding)
                    .map_err(|e| format!("invalid MidiLearnBinding: {e}"))?;
            if let Ok(mut state) = midi_learn_state.lock() {
                state.bindings.retain(|existing| existing != &binding);
                state.version += 1;
            }
            persist_midi_learn_bindings(midi_learn_state);
            Ok(serde_json::Value::Null)
        }
        "clearMidiLearnBindings" => {
            if let Ok(mut state) = midi_learn_state.lock() {
                state.bindings.clear();
                state.version += 1;
            }
            persist_midi_learn_bindings(midi_learn_state);
            Ok(serde_json::Value::Null)
        }
        "getMidiLearnState" => {
            let state = midi_learn_state
                .lock()
                .map(|s| s.clone())
                .unwrap_or_default();
            serde_json::to_value(state).map_err(|e| e.to_string())
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
    block_input_events: Vec<CosmoTimedInputEvent>,
    mono_output: Vec<f32>,
    /// Tracks whether DAW param values changed since last process() call.
    daw_params_dirty: bool,
    last_scope_hz: f32,
    /// Shared preset session persisted across plugin state save/load and GUI reopen.
    preset_session: SharedPresetSession,
    /// Latest voice debug state snapshot, populated each process block.
    runtime_voice_states: SharedRuntimeVoiceStates,
    /// The preset library (factory + user). Lock when reading or writing.
    preset_library: Arc<Mutex<PresetLibrary>>,
    /// UI editor state persisted across DAW sessions.
    editor_state: SharedEditorState,
    /// MIDI learn state owned by the engine.
    midi_learn_state: SharedMidiMappings,
    /// Prevents cold-start favorite selection from re-running on later resets.
    startup_preset_resolved: bool,
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
        let midi_learn_bindings = crate::global_settings::load_or_init_global_settings()
            .map(|settings| settings.midi_learn_bindings)
            .unwrap_or_else(|error| {
                append_log_warn(&format!(
                    "failed to load global midi settings, using defaults: {}",
                    error
                ));
                crate::session_state::default_midi_bindings()
            });
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
            block_input_events: Vec::with_capacity(MAX_UI_INPUT_EVENTS_PER_BLOCK),
            mono_output: Vec::new(),
            daw_params_dirty: true,
            last_scope_hz: 220.0,
            preset_session: Arc::new(Mutex::new(crate::session_state::PresetSession::default())),
            runtime_voice_states: Arc::new(ArcSwap::from_pointee(Vec::new())),
            preset_library,
            editor_state: Arc::new(Mutex::new(None)),
            midi_learn_state: Arc::new(Mutex::new(crate::session_state::MidiLearnState {
                bindings: midi_learn_bindings,
                ..Default::default()
            })),
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
        self.synth_params.store(Arc::new(params));
        self.rt_synth_params.store(Arc::clone(&rt_params));
        self.cached_rt_synth_params = Arc::clone(&rt_params);
        self.synth_params_version.fetch_add(1, Ordering::Release);
        self.cached_synth_params_version = self.synth_params_version.load(Ordering::Acquire);
        self.daw_params_dirty = false;

        if let Ok(mut session) = self.preset_session.lock() {
            if preset_name.is_some() || preset_id.is_some() {
                if let Some(name) = preset_name {
                    session.active_preset_name_base = name;
                }
                session.loaded_preset_id = preset_id;
            }
            session.is_dirty = false;
        }

        if let Some(proc) = self.processor.as_mut() {
            proc.set_shared_params(rt_params);
        }
    }

    fn apply_startup_preset_if_needed(&mut self) {
        if self.startup_preset_resolved {
            return;
        }
        self.startup_preset_resolved = true;

        let startup_preset = self
            .preset_library
            .lock()
            .ok()
            .and_then(|library| library.find_startup_preset().ok().flatten());

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

    fn apply_factory_preset(&mut self, index: usize) {
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

    fn apply_rt_param_change(&mut self, id: u32, value: f64, update_processor: bool) {
        let mut next_params = (*self.synth_params.load_full()).clone();
        if !write_daw_param_by_id(&mut next_params, id, value) {
            return;
        }

        let rt_params = Arc::new(build_rt_synth_params(&next_params));
        self.synth_params.store(Arc::new(next_params));
        self.rt_synth_params.store(Arc::clone(&rt_params));
        self.cached_rt_synth_params = Arc::clone(&rt_params);
        self.cached_synth_params_version =
            self.synth_params_version.fetch_add(1, Ordering::Release) + 1;
        self.daw_params_dirty = false;
        if let Ok(mut session) = self.preset_session.lock() {
            session.is_dirty = true;
        }

        if update_processor && let Some(proc) = self.processor.as_mut() {
            proc.set_shared_params(rt_params);
        }
    }

    fn apply_midi_mapping(&mut self, channel: u8, cc: u8, value: u8) -> bool {
        let state_snapshot = self.midi_learn_state.lock().ok().map(|guard| guard.clone());
        let Some(state_snapshot) = state_snapshot else {
            return false;
        };
        let bindings = state_snapshot
            .bindings
            .iter()
            .map(|binding| MidiMappingBinding {
                param_key: binding.param_key.as_str(),
                channel: binding.channel,
                cc: binding.cc,
            })
            .collect::<Vec<_>>();

        if bindings.is_empty() {
            append_log_debug(&format!(
                "apply_midi_mapping miss ch={} cc={} value={} stored_mappings={:?}",
                channel, cc, value, state_snapshot
            ));
            return false;
        }
        let mut synth_params = (*self.synth_params.load_full()).clone();
        let applied = apply_engine_midi_mapping(&mut synth_params, &bindings, channel, cc, value);

        if !applied {
            let incoming_channel = i32::from(channel);
            let incoming_cc = i32::from(cc);
            let mut cc_match_count = 0usize;
            let mut channel_match_count = 0usize;
            let mut omni_channel_count = 0usize;
            let mut full_match_count = 0usize;
            let mut invalid_param_keys: Vec<&str> = Vec::new();
            let mut binding_sample: Vec<String> = Vec::new();

            for binding in &state_snapshot.bindings {
                let cc_match = binding.cc == incoming_cc;
                let channel_match = binding.channel == -1 || binding.channel == incoming_channel;

                if cc_match {
                    cc_match_count += 1;
                }
                if channel_match {
                    channel_match_count += 1;
                    if binding.channel == -1 {
                        omni_channel_count += 1;
                    }
                }
                if cc_match && channel_match {
                    full_match_count += 1;
                    if parameter_range_for_key(&binding.param_key).is_none() {
                        invalid_param_keys.push(binding.param_key.as_str());
                    }
                }

                if binding_sample.len() < 8 {
                    binding_sample.push(format!(
                        "{}(ch={},cc={})",
                        binding.param_key, binding.channel, binding.cc
                    ));
                }
            }

            let reject_reason = if cc_match_count == 0 {
                "no_cc_match"
            } else if full_match_count == 0 {
                "channel_mismatch"
            } else if !invalid_param_keys.is_empty() {
                "invalid_param_key"
            } else {
                "set_parameter_rejected"
            };

            append_log_debug(&format!(
                "apply_midi_mapping miss ch={} cc={} value={} reason={} bindings={} cc_matches={} channel_matches={} omni_matches={} full_matches={} invalid_param_keys={:?} binding_sample={:?}",
                channel,
                cc,
                value,
                reject_reason,
                state_snapshot.bindings.len(),
                cc_match_count,
                channel_match_count,
                omni_channel_count,
                full_match_count,
                invalid_param_keys,
                binding_sample
            ));
            return false;
        }

        let rt_params = Arc::new(build_rt_synth_params(&synth_params));
        sync_all_daw_params_from_synth(&self.params, &synth_params);
        self.synth_params.store(Arc::new(synth_params));
        self.rt_synth_params.store(Arc::clone(&rt_params));
        self.cached_rt_synth_params = Arc::clone(&rt_params);
        self.cached_synth_params_version =
            self.synth_params_version.fetch_add(1, Ordering::Release) + 1;
        self.daw_params_dirty = false;

        if let Some(proc) = self.processor.as_mut() {
            proc.set_shared_params(rt_params);
        }

        true
    }

    fn capture_pending_midi_learn_binding(&mut self, channel: u8, cc: u8) {
        let mut bindings_changed = false;
        {
            let mut state = self.midi_learn_state.lock().unwrap();
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
                // TODO: remove this diagnostic once host-side learn capture behavior is verified across plugin formats.
                append_log_debug(&format!(
                    "host_capture_pending_midi_binding pending={} channel={} cc={} version={} bindings_count={}",
                    pending,
                    channel,
                    cc,
                    state.version,
                    state.bindings.len()
                ));
            }
        }
        if bindings_changed {
            persist_midi_learn_bindings(&self.midi_learn_state);
        }
    }

    #[cfg(test)]
    fn vst3_midi_mapping_param_id(&self, bus_index: i32, channel: i16, cc: i16) -> Option<u32> {
        let state = self.midi_learn_state.lock().ok()?;
        resolve_vst3_midi_mapping_param_id(&state.bindings, bus_index, channel, cc)
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

    fn current_transport_state(transport: &TransportInfo) -> CosmoTransportState {
        CosmoTransportState {
            tempo_bpm: (transport.tempo.is_finite() && transport.tempo > 0.0)
                .then_some(transport.tempo as f32),
            playing: transport.playing,
            position_beats: transport.position_beats,
        }
    }

    fn sync_runtime_params_from_host(&mut self, events: &EventList) {
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
            let Some(cached) = read_daw_param_by_id(&self.cached_rt_synth_params, id) else {
                return false;
            };
            (current - cached).abs() > 0.000_001
        });
        let params_version = self.synth_params_version.load(Ordering::Acquire);
        let params_changed = params_version != self.cached_synth_params_version
            || self.daw_params_dirty
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
        let previous_rt = (*self.cached_rt_synth_params).clone();
        let merged = if params_version != self.cached_synth_params_version {
            let mut params = (*self.rt_synth_params.load_full()).clone();
            apply_daw_params(&mut params, &self.params);
            params
        } else {
            let mut params = (*self.cached_rt_synth_params).clone();
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
            self.synth_params_version.fetch_add(1, Ordering::Release) + 1
        } else {
            params_version
        };
        let rt_merged = Arc::new(merged);
        self.cached_rt_synth_params = rt_merged.clone();
        if let Some(ref mut proc) = self.processor {
            proc.set_shared_params(rt_merged);
        }
        self.cached_synth_params_version = published_params_version;
        self.daw_params_dirty = false;

        // Push merged params to ArcSwaps so idle loop pushes to webview.
        self.synth_params.store(self.cached_rt_synth_params.clone());
        self.rt_synth_params
            .store(self.cached_rt_synth_params.clone());
    }

    fn handle_cc_side_effects(&mut self, channel: u8, cc: u8, value: u8) {
        self.capture_pending_midi_learn_binding(channel, cc);
        let _ = self.apply_midi_mapping(channel, cc, value);
        let _ = self.midi_cc_queue.push((channel, cc, value));
    }

    fn handle_host_event_side_effects(&mut self, body: &EventBody) {
        match body {
            EventBody::ControlChange {
                channel, cc, value, ..
            } => {
                append_log_debug(&format!("host_cc ch={} cc={} value={}", channel, cc, value));
                self.handle_cc_side_effects(*channel, *cc, *value);
            }
            EventBody::ControlChange2 {
                channel, cc, value, ..
            } => {
                let raw_value = (*value / 128) as u8;
                append_log_debug(&format!(
                    "host_cc2 ch={} cc={} value={} raw={}",
                    channel, cc, value, raw_value
                ));
                self.handle_cc_side_effects(*channel, *cc, raw_value);
            }
            EventBody::ParamChange { id, value } => {
                self.daw_params_dirty = true;
                self.apply_rt_param_change(*id, *value, false);
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

    fn host_event_to_engine_event(body: &EventBody) -> Option<CosmoInputEvent> {
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

    fn collect_block_input_events(&mut self, events: &EventList, num_samples: usize) {
        self.block_input_events.clear();

        for _ in 0..MAX_UI_INPUT_EVENTS_PER_BLOCK {
            let Some(event) = self.ui_input_queue.pop() else {
                break;
            };
            self.block_input_events.push(CosmoTimedInputEvent {
                sample_offset: 0,
                event,
            });
        }

        for event in events.iter() {
            let sample_offset = (event.sample_offset as usize).min(num_samples);
            self.handle_host_event_side_effects(&event.body);
            if let Some(engine_event) = Self::host_event_to_engine_event(&event.body) {
                self.block_input_events.push(CosmoTimedInputEvent {
                    sample_offset,
                    event: engine_event,
                });
            }
        }
    }

    #[cfg(test)]
    fn process_host_events_into_buffer(&mut self, events: &EventList, num_samples: usize) {
        self.collect_block_input_events(events, num_samples);
        if let Some(proc) = self.processor.as_mut() {
            proc.process_block(
                &mut self.mono_output[..num_samples],
                &self.block_input_events,
                CosmoTransportState::default(),
            );
        }
    }

    #[cfg(test)]
    fn handle_host_event(&mut self, body: &EventBody) {
        self.handle_host_event_side_effects(body);
        if let Some(engine_event) = Self::host_event_to_engine_event(body)
            && let Some(proc) = self.processor.as_mut()
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

    fn render_audio_block(
        &mut self,
        buffer: &mut AudioBuffer,
        events: &EventList,
        context: &mut ProcessContext,
    ) -> ProcessStatus {
        let Some(_) = self.processor else {
            return ProcessStatus::Normal;
        };

        let num_samples = buffer.num_samples();
        if num_samples > self.mono_output.len() {
            for ch in 0..buffer.num_output_channels() {
                buffer.output(ch).fill(0.0);
            }
            return ProcessStatus::Normal;
        }

        self.collect_block_input_events(events, num_samples);
        if let Some(proc) = self.processor.as_mut() {
            proc.process_block(
                &mut self.mono_output[..num_samples],
                &self.block_input_events,
                Self::current_transport_state(context.transport),
            );
        }

        let mono_output = &mut self.mono_output[..num_samples];

        let Some(proc) = self.processor.as_ref() else {
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
            self.last_scope_hz = raw_hz;
            raw_hz
        } else {
            self.last_scope_hz
        };
        if let Ok(mut scope) = self.scope_buffer.try_lock() {
            scope.push_block(mono_output, proc.sample_rate, hz);
        }

        self.runtime_mod_sources
            .store(Arc::new(proc.runtime_mod_sources()));
        self.runtime_voice_states
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
        if !self.startup_preset_resolved {
            self.synth_params.store(Arc::new(current_params));
            self.apply_startup_preset_if_needed();
            current_params = (*self.synth_params.load_full()).clone();
        }
        let rt_params = Arc::new(build_rt_synth_params(&current_params));
        processor.set_shared_params(Arc::clone(&rt_params));
        self.synth_params.store(Arc::new(current_params));
        self.rt_synth_params.store(Arc::clone(&rt_params));
        self.cached_rt_synth_params = rt_params;
        self.cached_synth_params_version = self.synth_params_version.load(Ordering::Acquire);
        self.processor = Some(processor);
        self.mono_output.resize(max_block_size, 0.0);
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
        self.sync_runtime_params_from_host(events);
        self.render_audio_block(buffer, events, context)
    }

    fn bus_layouts() -> Vec<BusLayout> {
        vec![BusLayout::new().with_output("Main", ChannelConfig::Stereo)]
    }

    fn save_state(&self) -> Vec<u8> {
        let sp = self.synth_params.load();
        let preset_session = self
            .preset_session
            .lock()
            .map(|session| session.clone())
            .unwrap_or_default();
        let editor = self.editor_state.lock().map(|s| s.clone()).unwrap_or(None);
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

        if let Ok(mut stored) = self.preset_session.lock()
            && (!session.preset_session.active_preset_name_base.is_empty()
                || session.preset_session.loaded_preset_id.is_some())
        {
            *stored = session.preset_session.clone();
        }

        if let Ok(mut stored) = self.editor_state.lock() {
            *stored = session.editor_state;
        }

        self.apply_preset_state(None, None, params);
        Ok(())
    }

    fn state_changed(&mut self) {
        if let Some(ref mut proc) = self.processor {
            proc.set_shared_params(self.cached_rt_synth_params.clone());
        }
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
            self.params.clone(),
            self.preset_session.clone(),
            self.runtime_voice_states.clone(),
            self.preset_library.clone(),
            self.editor_state.clone(),
            self.midi_learn_state.clone(),
        ))
    }
}

truce::plugin! {
    logic: CzPlugin,
    params: CzPluginParams,
}

#[cfg(feature = "vst3")]
impl truce_vst3::Vst3PluginExt for Plugin {
    fn midi_mapping_get_param_id(&self, bus_index: i32, channel: i16, cc: i16) -> Option<u32> {
        let _ = self;
        let bindings = crate::global_settings::load_or_init_global_settings()
            .map(|settings| settings.midi_learn_bindings)
            .unwrap_or_else(|_| crate::session_state::default_midi_bindings());
        resolve_vst3_midi_mapping_param_id(&bindings, bus_index, channel, cc)
    }
}

// =============================================================================
// Tests
// =============================================================================

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;

    fn clear_test_global_settings() {
        let path = crate::global_settings::get_global_settings_path();
        let _ = fs::remove_file(path);
    }

    fn with_test_data_dir<T>(test_fn: impl FnOnce(PathBuf) -> T) -> T {
        let _guard = crate::global_settings::TEST_DATA_DIR_LOCK
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        let unique = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|duration| duration.as_nanos())
            .unwrap_or_default();
        let path = std::env::temp_dir().join(format!("cosmo-pd101-test-{}", unique));
        fs::create_dir_all(&path).unwrap();
        unsafe {
            std::env::set_var("COSMO_PD101_DATA_DIR", &path);
        }
        let result = test_fn(path.clone());
        unsafe {
            std::env::remove_var("COSMO_PD101_DATA_DIR");
        }
        let _ = fs::remove_dir_all(path);
        result
    }

    fn synth_params_json(params: &SynthParams) -> serde_json::Value {
        serde_json::to_value(params).unwrap()
    }

    #[test]
    fn debug_logs_follow_global_settings_log_level() {
        with_test_data_dir(|_| {
            let _ = fs::remove_file(plugin_log_path());
            set_test_log_level(crate::global_settings::PluginLogLevel::Info);
            append_log_debug("debug-hidden");

            let info_contents = fs::read_to_string(plugin_log_path()).unwrap_or_default();
            assert!(!info_contents.contains("debug-hidden"));

            set_test_log_level(crate::global_settings::PluginLogLevel::Debug);
            append_log_debug("debug-visible");

            let debug_contents = fs::read_to_string(plugin_log_path()).unwrap_or_default();
            assert!(debug_contents.contains("level=DEBUG"));
            assert!(debug_contents.contains("debug-visible"));

            set_test_log_level(crate::global_settings::PluginLogLevel::Error);
        });
    }

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
        Arc<CzPluginParams>,
        SharedPresetSession,
        Arc<Mutex<PresetLibrary>>,
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
        let params = Arc::new(CzPluginParams::new());
        let ps: SharedPresetSession =
            Arc::new(Mutex::new(crate::session_state::PresetSession::default()));
        let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
        let pl: Arc<Mutex<PresetLibrary>> = Arc::new(Mutex::new(
            PresetLibrary::from_embedded_factory(factory_json),
        ));
        let es: SharedEditorState = Arc::new(Mutex::new(None));
        let mm: SharedMidiMappings =
            Arc::new(Mutex::new(crate::session_state::MidiLearnState::default()));
        (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm)
    }

    fn make_test_editor() -> crate::gui::CzEditor {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
        crate::gui::CzEditor::new(
            sp,
            rsp,
            rms,
            ts,
            ver,
            sc,
            q,
            Arc::new(ArrayQueue::new(MIDI_CC_QUEUE_CAPACITY)),
            params,
            ps,
            rvs,
            pl,
            es,
            mm,
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
        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();

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
            &params,
            &ps,
            &pl,
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
        let params = Arc::new(CzPluginParams::new());
        let ps: SharedPresetSession =
            Arc::new(Mutex::new(crate::session_state::PresetSession::default()));
        let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
        let pl: Arc<Mutex<PresetLibrary>> = Arc::new(Mutex::new(
            PresetLibrary::from_embedded_factory(factory_json),
        ));
        let es: SharedEditorState = Arc::new(Mutex::new(None));
        let mm: SharedMidiMappings =
            Arc::new(Mutex::new(crate::session_state::MidiLearnState::default()));

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
            &params,
            &ps,
            &pl,
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
        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();

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
            &params,
            &ps,
            &pl,
            &es,
            &mm,
        );

        assert!(result.is_ok());
        match q.pop() {
            Some(CosmoInputEvent::NoteOn { note, velocity }) => {
                assert_eq!(note, 60);
                assert!((velocity - 0.75).abs() < f32::EPSILON);
            }
            other => panic!("unexpected queued event: {other:?}"),
        }
    }

    #[allow(clippy::field_reassign_with_default)]
    #[test]
    fn set_params_rpc_syncs_daw_float_params() {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
        assert_eq!(params.volume.value(), 1.0); // default

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
            &params,
            &ps,
            &pl,
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
        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
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
            &params,
            &ps,
            &pl,
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
        let expected = crate::ffi::factory_preset_params(0).unwrap().clone();
        let (expected_id, expected_name) = crate::ffi::factory_preset_identity(0).unwrap();

        params.volume.set_value(0.123);
        assert!((params.volume.value() - expected.volume).abs() > 0.000_001);

        plugin.handle_host_event(&EventBody::ProgramChange {
            group: 0,
            channel: 0,
            program: 0,
        });

        assert!((params.volume.value() - expected.volume).abs() < 0.000_001);
        let synth_params = plugin.synth_params.load();
        assert_eq!(synth_params.line_select, expected.line_select);
        assert!((synth_params.portamento.time - expected.portamento.time).abs() < 0.000_001);
        let session = plugin.preset_session.lock().unwrap().clone();
        assert_eq!(session.loaded_preset_id.as_deref(), Some(expected_id));
        assert_eq!(session.active_preset_name_base, expected_name);
    }

    #[test]
    fn midi_mapping_applies_in_plugin_core_without_editor() {
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);
        *plugin.midi_learn_state.lock().unwrap() = crate::session_state::MidiLearnState {
            bindings: vec![crate::session_state::MidiLearnBinding {
                param_key: "macro1".to_string(),
                channel: 0,
                cc: 74,
            }],
            ..Default::default()
        };

        plugin.handle_host_event(&EventBody::ControlChange {
            group: 0,
            channel: 0,
            cc: 74,
            value: 127,
        });

        assert!((plugin.synth_params.load().macro1 - 1.0).abs() < 0.000_001);
        assert!((plugin.cached_rt_synth_params.macro1 - 1.0).abs() < 0.000_001);
    }

    #[test]
    fn midi_mapping_matches_exact_channel() {
        with_test_data_dir(|_| {
            clear_test_global_settings();
            let params = Arc::new(CzPluginParams::new());
            let mut plugin = CzPlugin::new(Arc::clone(&params));
            plugin.reset(48_000.0, 64);
            *plugin.midi_learn_state.lock().unwrap() = crate::session_state::MidiLearnState {
                bindings: vec![crate::session_state::MidiLearnBinding {
                    param_key: "macro1".to_string(),
                    channel: 2,
                    cc: 74,
                }],
                ..Default::default()
            };
            let baseline = plugin.synth_params.load().macro1;

            plugin.handle_host_event(&EventBody::ControlChange {
                group: 0,
                channel: 1,
                cc: 74,
                value: 127,
            });

            assert!((plugin.synth_params.load().macro1 - baseline).abs() < 0.000_001);
        });
    }

    #[test]
    fn midi_mapping_applies_to_all_bindings_for_same_cc() {
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);
        *plugin.midi_learn_state.lock().unwrap() = crate::session_state::MidiLearnState {
            bindings: vec![
                crate::session_state::MidiLearnBinding {
                    param_key: "macro1".to_string(),
                    channel: 0,
                    cc: 74,
                },
                crate::session_state::MidiLearnBinding {
                    param_key: "macro2".to_string(),
                    channel: 0,
                    cc: 74,
                },
            ],
            ..Default::default()
        };

        plugin.handle_host_event(&EventBody::ControlChange {
            group: 0,
            channel: 0,
            cc: 74,
            value: 127,
        });

        let synth_params = plugin.synth_params.load();
        assert!((synth_params.macro1 - 1.0).abs() < 0.000_001);
        assert!((synth_params.macro2 - 1.0).abs() < 0.000_001);
    }

    #[test]
    fn midi_mapping_syncs_daw_backed_plugin_params() {
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);
        *plugin.midi_learn_state.lock().unwrap() = crate::session_state::MidiLearnState {
            bindings: vec![crate::session_state::MidiLearnBinding {
                param_key: "warpAAmount".to_string(),
                channel: 0,
                cc: 55,
            }],
            ..Default::default()
        };

        plugin.handle_host_event(&EventBody::ControlChange {
            group: 0,
            channel: 0,
            cc: 55,
            value: 64,
        });

        assert!((plugin.synth_params.load().line1.dcw_base - 64.0 / 127.0).abs() < 0.000_001);
        assert!((params.warp_a_amount.value() - 64.0 / 127.0).abs() < 0.000_001);
    }

    #[test]
    fn vst3_midi_mapping_resolves_default_macro_binding() {
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let plugin = CzPlugin::new(Arc::clone(&params));

        assert_eq!(
            plugin.vst3_midi_mapping_param_id(0, 0, 8),
            Some(CzPluginParamsParamId::Macro1 as u32)
        );
    }

    #[test]
    fn host_param_value_drift_updates_runtime_snapshot_and_version() {
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        let initial_version = plugin.synth_params_version.load(Ordering::Acquire);
        params.line1_level.set_value(0.37);

        plugin.sync_runtime_params_from_host(&EventList::default());

        assert!((plugin.synth_params.load().line1.dca_base - 0.37).abs() < 0.000_001);
        assert!((plugin.cached_rt_synth_params.line1.dca_base - 0.37).abs() < 0.000_001);
        assert!(plugin.synth_params_version.load(Ordering::Acquire) > initial_version);
        assert_eq!(
            plugin.cached_synth_params_version,
            plugin.synth_params_version.load(Ordering::Acquire)
        );
    }

    #[test]
    fn host_side_midi_learn_keeps_mode_and_pending_target_enabled() {
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);
        *plugin.midi_learn_state.lock().unwrap() = crate::session_state::MidiLearnState {
            learn_mode: true,
            pending_param_key: Some("macro1".to_string()),
            ..Default::default()
        };

        plugin.handle_host_event(&EventBody::ControlChange {
            group: 0,
            channel: 0,
            cc: 74,
            value: 64,
        });

        let state = plugin.midi_learn_state.lock().unwrap().clone();
        assert!(state.learn_mode);
        assert_eq!(state.pending_param_key.as_deref(), Some("macro1"));
        assert!(state.bindings.iter().any(|binding| {
            binding.param_key == "macro1" && binding.channel == 0 && binding.cc == 74
        }));
    }

    #[test]
    fn save_preset_defaults_new_user_author_to_user() {
        with_test_data_dir(|_| {
            let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, _pl, es, mm) = make_handler_state();
            let factory_json = include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
            let pl = Arc::new(Mutex::new(
                PresetLibrary::load_or_init(factory_json).unwrap(),
            ));

            let result = handle_ipc_invoke(
                "savePreset",
                &[serde_json::json!({
                    "name": "New Preset",
                    "author": "",
                    "tags": [],
                })],
                &sp,
                &rsp,
                &rms,
                &rvs,
                &ts,
                &ver,
                &sc,
                &q,
                &params,
                &ps,
                &pl,
                &es,
                &mm,
            )
            .unwrap();

            let id = result["id"].as_str().unwrap();
            let saved = pl.lock().unwrap().get_entry(id).unwrap().unwrap();
            assert_eq!(saved.author, DEFAULT_USER_PRESET_AUTHOR);
        });
    }

    #[test]
    fn param_change_applies_at_event_offset() {
        with_test_data_dir(|_| {
            clear_test_global_settings();
            let params = Arc::new(CzPluginParams::new());
            let mut plugin = CzPlugin::new(Arc::clone(&params));
            plugin.reset(48_000.0, 64);

            let previous_volume = plugin.cached_rt_synth_params.volume;
            let next_volume = if (previous_volume - 0.2).abs() < 0.000_001 {
                0.73
            } else {
                0.2
            };

            params.volume.set_value(next_volume);

            let mut events = EventList::default();
            events.push(Event {
                sample_offset: 32,
                body: EventBody::ParamChange {
                    id: CzPluginParamsParamId::Volume as u32,
                    value: next_volume,
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
            assert!((volume_before - next_volume as f32).abs() < 0.000_001);
        });
    }

    #[test]
    fn set_preset_name_rpc_stores_name() {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();

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
            &params,
            &ps,
            &pl,
            &es,
            &mm,
        );
        assert!(result.is_ok());
        let stored = ps.lock().unwrap();
        assert_eq!(stored.active_preset_name_base, "Warm Pad");
    }

    #[test]
    fn get_preset_name_rpc_returns_current_name() {
        let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
        {
            let mut stored = ps.lock().unwrap();
            stored.active_preset_name_base = "Factory Brass".to_string();
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
            &params,
            &ps,
            &pl,
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
        clear_test_global_settings();
        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        plugin
            .preset_session
            .lock()
            .unwrap()
            .active_preset_name_base = "Resonant Pad".to_string();
        plugin.preset_session.lock().unwrap().is_dirty = true;

        let state = plugin.save_state();
        assert!(!state.is_empty());

        let parsed: serde_json::Value =
            serde_json::from_slice(&state).expect("state should be valid JSON");
        assert_eq!(
            parsed["presetSession"]["activePresetNameBase"],
            "Resonant Pad"
        );
        assert_eq!(parsed["presetSession"]["isDirty"], true);
        assert!(parsed.get("synthParams").is_some());
        assert!(parsed.get("midiLearnState").is_none());
    }

    #[test]
    fn load_state_restores_preset_name() {
        with_test_data_dir(|_| {
            clear_test_global_settings();
            let params = Arc::new(CzPluginParams::new());
            let mut plugin = CzPlugin::new(Arc::clone(&params));
            plugin.reset(48_000.0, 64);

            // Save state with a preset name
            plugin
                .preset_session
                .lock()
                .unwrap()
                .active_preset_name_base = "Bright Piano".to_string();
            plugin.preset_session.lock().unwrap().is_dirty = true;
            let state = plugin.save_state();

            // Create new plugin and load state
            let params2 = Arc::new(CzPluginParams::new());
            let mut plugin2 = CzPlugin::new(Arc::clone(&params2));
            plugin2.reset(48_000.0, 64);
            assert_ne!(
                plugin2
                    .preset_session
                    .lock()
                    .unwrap()
                    .active_preset_name_base,
                "Bright Piano"
            );

            let result = plugin2.load_state(&state);
            assert!(result.is_ok());
            let restored = plugin2.preset_session.lock().unwrap().clone();
            assert_eq!(restored.active_preset_name_base, "Bright Piano");
            assert!(!restored.is_dirty);
        });
    }

    #[test]
    fn load_state_falls_back_to_old_format() {
        clear_test_global_settings();
        // Old format: flat SynthParams JSON (no wrapper)
        let synth = SynthParams::default();
        let data = serde_json::to_vec(&synth).unwrap();

        let params = Arc::new(CzPluginParams::new());
        let mut plugin = CzPlugin::new(Arc::clone(&params));
        plugin.reset(48_000.0, 64);

        // Set a name to verify it's not overwritten
        plugin
            .preset_session
            .lock()
            .unwrap()
            .active_preset_name_base = "Existing Name".to_string();

        let result = plugin.load_state(&data);
        assert!(result.is_ok());
        // Old format should not touch preset_name
        assert_eq!(
            plugin
                .preset_session
                .lock()
                .unwrap()
                .active_preset_name_base,
            "Existing Name"
        );
    }

    #[test]
    fn cold_start_loads_plugin_startup_preset() {
        with_test_data_dir(|_| {
            clear_test_global_settings();

            let params = Arc::new(CzPluginParams::new());
            let mut plugin = CzPlugin::new(Arc::clone(&params));
            plugin.reset(48_000.0, 64);

            let stored = plugin.preset_session.lock().unwrap().clone();
            let expected = plugin
                .preset_library
                .lock()
                .unwrap()
                .get_entry(
                    stored
                        .loaded_preset_id
                        .as_deref()
                        .expect("startup preset should populate loaded preset id"),
                )
                .unwrap()
                .unwrap();
            let expected_params: SynthParams = if let Some(value) = expected.data.get("params") {
                serde_json::from_value(value.clone()).unwrap()
            } else {
                serde_json::from_value(expected.data.clone()).unwrap()
            };

            assert_eq!(stored.loaded_preset_id, Some(expected.id.clone()));
            assert_eq!(stored.active_preset_name_base, expected.name);
            assert!(!stored.is_dirty);
            assert_eq!(
                synth_params_json(plugin.synth_params.load().as_ref()),
                synth_params_json(&expected_params)
            );
        });
    }

    #[test]
    fn cold_start_without_user_favorites_uses_factory_startup_preset_when_present() {
        with_test_data_dir(|_| {
            clear_test_global_settings();

            let params = Arc::new(CzPluginParams::new());
            let mut plugin = CzPlugin::new(Arc::clone(&params));

            plugin.reset(48_000.0, 64);

            let stored = plugin.preset_session.lock().unwrap().clone();
            assert!(!stored.is_dirty);
            if let Some(entry_id) = stored.loaded_preset_id.clone() {
                let entry = plugin
                    .preset_library
                    .lock()
                    .unwrap()
                    .get_entry(&entry_id)
                    .unwrap()
                    .unwrap();
                let expected_params: SynthParams = if let Some(value) = entry.data.get("params") {
                    serde_json::from_value(value.clone()).unwrap()
                } else {
                    serde_json::from_value(entry.data.clone()).unwrap()
                };
                assert_eq!(stored.active_preset_name_base, entry.name);
                assert_eq!(
                    synth_params_json(plugin.synth_params.load().as_ref()),
                    synth_params_json(&expected_params)
                );
            } else {
                let mut expected = SynthParams::default();
                apply_daw_params(&mut expected, &params);
                assert!(stored.active_preset_name_base.is_empty());
                assert!(stored.loaded_preset_id.is_none());
                assert_eq!(
                    synth_params_json(plugin.synth_params.load().as_ref()),
                    synth_params_json(&expected)
                );
            }
        });
    }

    #[test]
    fn restored_state_survives_later_resets_without_reapplying_startup_preset() {
        with_test_data_dir(|_| {
            clear_test_global_settings();

            let params = Arc::new(CzPluginParams::new());
            let mut plugin = CzPlugin::new(Arc::clone(&params));
            {
                let mut library = plugin.preset_library.lock().unwrap();
                let record = library
                    .list_records(None)
                    .unwrap()
                    .into_iter()
                    .next()
                    .unwrap();
                library.set_starred(&record.entry.id, true).unwrap();
            }
            plugin.reset(48_000.0, 64);
            assert!(
                plugin
                    .preset_session
                    .lock()
                    .unwrap()
                    .loaded_preset_id
                    .is_some()
            );

            let restored_params = SynthParams {
                volume: 0.11,
                ..SynthParams::default()
            };
            let restored_state = crate::session_state::PluginSessionState {
                synth_params: restored_params.clone(),
                preset_session: crate::session_state::PresetSession {
                    active_preset_name_base: "Saved Preset".to_string(),
                    loaded_preset_id: Some("saved-id".to_string()),
                    is_dirty: false,
                },
                editor_state: None,
            };
            let bytes = serde_json::to_vec(&restored_state).unwrap();

            plugin.load_state(&bytes).unwrap();
            plugin.reset(48_000.0, 64);

            let restored_session = plugin.preset_session.lock().unwrap().clone();
            assert_eq!(restored_session.active_preset_name_base, "Saved Preset");
            assert_eq!(
                restored_session.loaded_preset_id.as_deref(),
                Some("saved-id")
            );
            assert_eq!(
                synth_params_json(plugin.synth_params.load().as_ref()),
                synth_params_json(&restored_params)
            );
        });
    }

    #[test]
    fn plugin_startup_seeds_default_global_midi_settings() {
        with_test_data_dir(|_| {
            clear_test_global_settings();

            let params = Arc::new(CzPluginParams::new());
            let plugin = CzPlugin::new(Arc::clone(&params));
            let state = plugin.midi_learn_state.lock().unwrap().clone();
            let saved = crate::global_settings::load_or_init_global_settings().unwrap();

            assert_eq!(
                state.bindings,
                crate::session_state::default_midi_bindings()
            );
            assert_eq!(
                saved.midi_learn_bindings,
                crate::session_state::default_midi_bindings()
            );
        });
    }

    #[test]
    fn plugin_global_midi_settings_persist_across_instances() {
        with_test_data_dir(|_| {
            clear_test_global_settings();

            let params = Arc::new(CzPluginParams::new());
            let mut plugin = CzPlugin::new(Arc::clone(&params));
            plugin.reset(48_000.0, 64);

            let (sp, rsp, rms, rvs, ts, ver, sc, q, params, ps, pl, es, mm) = make_handler_state();
            {
                let mut state = mm.lock().unwrap();
                state.bindings = plugin.midi_learn_state.lock().unwrap().bindings.clone();
            }

            let result = handle_ipc_invoke(
                "addMidiBinding",
                &[
                    serde_json::Value::String("macro1".to_string()),
                    serde_json::Value::from(2),
                    serde_json::Value::from(74),
                ],
                &sp,
                &rsp,
                &rms,
                &rvs,
                &ts,
                &ver,
                &sc,
                &q,
                &params,
                &ps,
                &pl,
                &es,
                &mm,
            );
            assert!(result.is_ok());
            *plugin.midi_learn_state.lock().unwrap() = mm.lock().unwrap().clone();

            let params2 = Arc::new(CzPluginParams::new());
            let plugin2 = CzPlugin::new(Arc::clone(&params2));
            let bindings = plugin2.midi_learn_state.lock().unwrap().bindings.clone();
            assert!(bindings.iter().any(|binding| {
                binding.param_key == "macro1" && binding.channel == 2 && binding.cc == 74
            }));

            let remove_result = handle_ipc_invoke(
                "removeMidiBinding",
                &[serde_json::json!({
                    "paramKey": "macro1",
                    "channel": 2,
                    "cc": 74
                })],
                &sp,
                &rsp,
                &rms,
                &rvs,
                &ts,
                &ver,
                &sc,
                &q,
                &params,
                &ps,
                &pl,
                &es,
                &mm,
            );
            assert!(remove_result.is_ok());

            let params3 = Arc::new(CzPluginParams::new());
            let plugin3 = CzPlugin::new(Arc::clone(&params3));
            let bindings = plugin3.midi_learn_state.lock().unwrap().bindings.clone();
            assert!(!bindings.iter().any(|binding| {
                binding.param_key == "macro1" && binding.channel == 2 && binding.cc == 74
            }));

            let clear_result = handle_ipc_invoke(
                "clearMidiLearnBindings",
                &[],
                &sp,
                &rsp,
                &rms,
                &rvs,
                &ts,
                &ver,
                &sc,
                &q,
                &params,
                &ps,
                &pl,
                &es,
                &mm,
            );
            assert!(clear_result.is_ok());

            let params4 = Arc::new(CzPluginParams::new());
            let plugin4 = CzPlugin::new(Arc::clone(&params4));
            assert!(plugin4.midi_learn_state.lock().unwrap().bindings.is_empty());
        });
    }
}
