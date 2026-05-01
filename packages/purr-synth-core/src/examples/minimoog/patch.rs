use crate::envelope::AdsrParams;
use crate::lfo::LfoWaveform;
use crate::oscillator::BasicWaveform;

/// Modulation sources available in the Minimoog example synth.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MiniModSource {
    FilterEnvelope,
    Lfo,
}

/// Modulation targets available in the Minimoog example synth.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MiniModTarget {
    Osc1Pitch,
    Osc2Pitch,
    Osc3Pitch,
    FilterCutoff,
}

/// Per-oscillator settings in the patch.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct OscPatch {
    /// Waveform shape.
    pub waveform: BasicWaveform,
    /// Semitone offset from the played note.
    pub semitones: i8,
    /// Detune in cents (+/- 100).
    pub cents: f32,
    /// Mix level 0..1.
    pub level: f32,
    /// When true this oscillator's pitch does not track the keyboard.
    pub kbd_track: bool,
}

impl Default for OscPatch {
    fn default() -> Self {
        Self {
            waveform: BasicWaveform::Saw,
            semitones: 0,
            cents: 0.0,
            level: 1.0,
            kbd_track: true,
        }
    }
}

/// Filter patch parameters.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct FilterPatch {
    /// Base cutoff frequency in Hz.
    pub cutoff_hz: f32,
    /// Resonance 0..1 (framework SVF scale).
    pub resonance: f32,
    /// How much the filter envelope opens the filter, in Hz range.
    pub envelope_amount: f32,
    /// How much the played MIDI note shifts the cutoff (1.0 = full keyboard tracking).
    pub keyboard_track: f32,
}

impl Default for FilterPatch {
    fn default() -> Self {
        Self {
            cutoff_hz: 2_000.0,
            resonance: 0.3,
            envelope_amount: 3_000.0,
            keyboard_track: 0.5,
        }
    }
}

/// LFO patch parameters.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct LfoPatch {
    pub waveform: LfoWaveform,
    pub rate_hz: f32,
    /// Modulation depth 0..1 mapped by each mod route.
    pub depth: f32,
}

impl Default for LfoPatch {
    fn default() -> Self {
        Self {
            waveform: LfoWaveform::Triangle,
            rate_hz: 4.0,
            depth: 0.0,
        }
    }
}

/// Top-level patch for the Minimoog example synth.
#[derive(Debug, Clone, PartialEq)]
pub struct MiniPatch {
    pub osc1: OscPatch,
    pub osc2: OscPatch,
    pub osc3: OscPatch,
    pub filter: FilterPatch,
    pub amp_env: AdsrParams,
    pub filter_env: AdsrParams,
    pub lfo: LfoPatch,
    /// Master volume 0..1.
    pub volume: f32,
    /// Global pitch-bend range in semitones.
    pub pitch_bend_range: f32,
}

impl Default for MiniPatch {
    fn default() -> Self {
        Self {
            osc1: OscPatch::default(),
            osc2: OscPatch {
                cents: 7.0,
                ..OscPatch::default()
            },
            osc3: OscPatch {
                cents: -5.0,
                ..OscPatch::default()
            },
            filter: FilterPatch::default(),
            amp_env: AdsrParams {
                attack_seconds: 0.01,
                decay_seconds: 0.2,
                sustain_level: 0.8,
                release_seconds: 0.3,
            },
            filter_env: AdsrParams {
                attack_seconds: 0.05,
                decay_seconds: 0.3,
                sustain_level: 0.4,
                release_seconds: 0.4,
            },
            lfo: LfoPatch::default(),
            volume: 0.7,
            pitch_bend_range: 2.0,
        }
    }
}
