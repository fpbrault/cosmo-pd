//! Cosmo PD-101 Phase Distortion synthesizer — VST3/CLAP plugin via nih-plug.
//!
//! Uses nih-plug for VST3/CLAP plugin hosting and cosmo-synth-engine for the DSP engine.

#![recursion_limit = "256"]

use std::collections::VecDeque;
use std::fs::OpenOptions;
use std::io::Write;
use std::sync::{Arc, Mutex, RwLock};
use std::time::{SystemTime, UNIX_EPOCH};

use cosmo_synth_engine::params::SynthParams;
use cosmo_synth_engine::processor::{midi_note_to_freq, CosmoProcessor};
use nih_plug::prelude::*;

pub mod gui;

const PLUGIN_LOG_PATH: &str = "/tmp/cosmo-plugin.log";

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
            samples: Vec::with_capacity(SCOPE_CAPACITY),
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
type UiInputQueue = Arc<Mutex<VecDeque<UiInputEvent>>>;

#[allow(dead_code)]
#[derive(Debug, Clone, Copy)]
enum UiInputEvent {
    NoteOn { note: u8, velocity: f32 },
    NoteOff { note: u8 },
    Sustain { on: bool },
    PitchBend { value: f32 },
    ModWheel { value: f32 },
    Aftertouch { value: f32 },
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
    synth_params: &Arc<RwLock<SynthParams>>,
    scope_buffer: &ScopeBuffer,
) -> Result<serde_json::Value, String> {
    if method != "getScopeData" && method != "clientLog" {
        append_log(&format!("ipc invoke method={method} args={}", args.len()));
    }

    match method {
        "setParams" => {
            let json_str = args
                .first()
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setParams expects a JSON string as first argument".to_string())?;
            let params: SynthParams = serde_json::from_str(json_str)
                .map_err(|e| format!("invalid SynthParams payload: {e}"))?;
            let mut sp = synth_params
                .write()
                .map_err(|_| "synth params store is poisoned".to_string())?;
            *sp = params;
            Ok(serde_json::Value::Null)
        }
        "getParams" => {
            let sp = synth_params
                .read()
                .map_err(|_| "synth params store is poisoned".to_string())?;
            serde_json::to_value(&*sp).map_err(|e| e.to_string())
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
    synth_params: Arc<RwLock<SynthParams>>,
    /// Per-frame cached copy read by the audio thread.
    cached_synth_params: SynthParams,
    scope_buffer: ScopeBuffer,
    ui_input_queue: UiInputQueue,
}

impl Default for CzPlugin {
    fn default() -> Self {
        Self {
            params: Arc::new(CzParams::default()),
            processor: None,
            synth_params: Arc::new(RwLock::new(SynthParams::default())),
            cached_synth_params: SynthParams::default(),
            scope_buffer: Arc::new(Mutex::new(ScopeFrame::default())),
            ui_input_queue: Arc::new(Mutex::new(VecDeque::new())),
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
        let Ok(mut queue) = self.ui_input_queue.lock() else {
            return;
        };
        while let Some(event) = queue.pop_front() {
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
                }
            }
        }
    }
}

impl Plugin for CzPlugin {
    const NAME: &'static str = "Cosmo PD-101";
    const VENDOR: &'static str = "Cosmo";
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
            self.scope_buffer.clone(),
            self.ui_input_queue.clone(),
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
        processor.set_params(synth_params.clone());
        self.cached_synth_params = synth_params;
        self.processor = Some(processor);
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

        // Snapshot latest params from the IPC thread (non-blocking).
        if let Ok(sp) = self.synth_params.try_read() {
            self.cached_synth_params = sp.clone();
        }

        if let Some(proc) = &mut self.processor {
            proc.set_params(self.cached_synth_params.clone());

            let num_samples = buffer.samples();
            let mut mono_output = vec![0.0f32; num_samples];
            proc.process(&mut mono_output);

            let hz = proc
                .voices
                .iter()
                .filter(|v| !v.is_silent && !v.is_releasing && v.note.is_some())
                .map(|v| v.current_freq)
                .max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
                .unwrap_or(0.0);
            if let Ok(mut scope) = self.scope_buffer.try_lock() {
                scope.push_block(&mono_output, proc.sample_rate, hz);
            }

            for channel_slice in buffer.as_slice() {
                channel_slice.copy_from_slice(&mono_output);
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
        let synth_params = Arc::new(RwLock::new(SynthParams::default()));
        let scope_buffer: ScopeBuffer = Arc::new(Mutex::new(ScopeFrame::default()));

        let mut new_params = SynthParams::default();
        new_params.volume = 0.42;
        let json_str = serde_json::to_string(&new_params).unwrap();

        let result = handle_ipc_invoke(
            "setParams",
            &[serde_json::Value::String(json_str)],
            &synth_params,
            &scope_buffer,
        );
        assert!(result.is_ok());
        assert_eq!(synth_params.read().unwrap().volume, 0.42);
    }

    #[test]
    fn get_params_rpc_returns_current_synth_params() {
        let mut initial = SynthParams::default();
        initial.volume = 0.77;
        let synth_params = Arc::new(RwLock::new(initial));
        let scope_buffer: ScopeBuffer = Arc::new(Mutex::new(ScopeFrame::default()));

        let result = handle_ipc_invoke("getParams", &[], &synth_params, &scope_buffer);
        assert!(result.is_ok());
        let val = result.unwrap();
        assert_eq!(val["volume"].as_f64().unwrap(), 0.77);
    }
}
