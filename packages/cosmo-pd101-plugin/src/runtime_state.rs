use std::sync::atomic::{AtomicBool, AtomicU8, AtomicU32, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};

use arc_swap::ArcSwap;
use cosmo_synth_engine::params::SynthParams;
use cosmo_synth_engine::processor::CosmoInputEvent;
use cosmo_synth_engine::processor::state::{RuntimeModSources, RuntimeVoiceDebugState};
use crossbeam_queue::ArrayQueue;
use truce_core::events::TransportInfo;

use crate::midi_learn::MidiLearnService;
use crate::preset_library::PresetLibrary;
use crate::preset_service::PresetService;
use cosmo_pd101_bridge_types::{EditorState, MidiLearnState, PresetSession, TransportInfoResponse};

pub const SCOPE_CAPACITY: usize = 4096;
pub const UI_INPUT_QUEUE_CAPACITY: usize = 1024;
pub const MIDI_CC_QUEUE_CAPACITY: usize = 128;

pub type ScopeBuffer = Arc<Mutex<ScopeFrame>>;
pub type UiInputQueue = Arc<ArrayQueue<CosmoInputEvent>>;
pub type MidiCcQueue = Arc<ArrayQueue<(u8, u8, u8)>>;
pub type SharedSynthParams = Arc<ArcSwap<SynthParams>>;
pub type SharedRtSynthParams = Arc<ArcSwap<SynthParams>>;
pub type SharedRuntimeModSources = Arc<ArcSwap<RuntimeModSources>>;
pub type SharedRuntimeVoiceStates = Arc<ArcSwap<Vec<RuntimeVoiceDebugState>>>;
pub type SharedTransportSnapshot = Arc<TransportSnapshot>;
pub type SynthParamsVersion = Arc<AtomicU64>;
pub type SharedPresetSession = Arc<Mutex<PresetSession>>;
pub type SharedEditorState = Arc<Mutex<Option<EditorState>>>;
pub type SharedMidiMappings = Arc<Mutex<MidiLearnState>>;

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
}

#[derive(Clone)]
pub struct UiEventQueues {
    pub ui_input_queue: UiInputQueue,
    pub midi_cc_queue: MidiCcQueue,
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
    /// Runtime voice limit (1-16). Read/written by IPC, consumed by audio thread.
    pub voice_limit: AtomicU8,
}

impl PluginSharedState {
    pub fn new(
        default_params: SynthParams,
        default_rt_params: SynthParams,
        preset_library: Arc<Mutex<PresetLibrary>>,
        midi_learn_state: MidiLearnState,
        voice_limit: u8,
    ) -> Self {
        let preset_session = Arc::new(Mutex::new(PresetSession::default()));
        let midi_learn_state = Arc::new(Mutex::new(midi_learn_state));
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
            },
            ui: UiEventQueues {
                ui_input_queue: Arc::new(ArrayQueue::new(UI_INPUT_QUEUE_CAPACITY)),
                midi_cc_queue: Arc::new(ArrayQueue::new(MIDI_CC_QUEUE_CAPACITY)),
            },
            editor: EditorSessionState {
                editor_state: Arc::new(Mutex::new(None)),
            },
            presets: PresetService::new(preset_library.clone(), preset_session),
            midi_learn: MidiLearnService::new(midi_learn_state),
            voice_limit: AtomicU8::new(voice_limit),
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
}
