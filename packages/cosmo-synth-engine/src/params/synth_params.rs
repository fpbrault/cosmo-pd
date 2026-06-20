use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::fx_params::{FxSlotConfig, PhaseModParams, VibratoParams, default_fx_slot_configs};
use super::lfo::LfoParams;
use super::line::{LineParams, LineSelect, ModMode, PolyMode};
use super::modulation::ModMatrix;
use super::portamento::PortamentoParams;

pub const MIN_VOICE_LIMIT: usize = 1;
pub const DEFAULT_VOICE_LIMIT: usize = 8;
pub const MAX_VOICE_LIMIT: usize = 16;
pub const MAX_VOICES: usize = 16;
pub const NUM_OPERATORS: usize = 4; // CZ-101 has 4 operators per line

/// Parameters for the random (sample-and-hold) modulation source.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct RandomParams {
    pub rate: f32,
}

impl Default for RandomParams {
    fn default() -> Self {
        Self { rate: 2.0 }
    }
}

/// ADSR mod envelope parameters.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct ModEnvParams {
    pub attack: f32,
    pub decay: f32,
    pub sustain: f32,
    pub release: f32,
}

impl Default for ModEnvParams {
    fn default() -> Self {
        Self {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.2,
        }
    }
}

pub(crate) fn default_pitch_bend_range() -> f32 {
    2.0
}

pub fn default_synth_params_v1() -> SynthParams {
    SynthParams::default()
}

pub(crate) fn default_ring_gain() -> f32 {
    4.0
}

pub(crate) fn default_cz_dac_enabled() -> bool {
    false
}

pub(crate) fn default_tempo_bpm() -> f32 {
    120.0
}

pub(crate) fn default_macro_labels() -> [String; 4] {
    [
        "Brightness".to_string(),
        "Timbre".to_string(),
        "Time".to_string(),
        "Movement".to_string(),
    ]
}

/// Top-level synth parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct SynthParams {
    pub line_select: LineSelect,
    pub mod_mode: ModMode,
    #[serde(default = "default_ring_gain")]
    pub ring_gain: f32,
    pub octave: f32,
    pub line1: LineParams,
    pub line2: LineParams,
    pub frequency: f32,
    #[serde(default = "default_tempo_bpm")]
    pub tempo_bpm: f32,
    pub volume: f32,
    #[serde(default = "default_cz_dac_enabled")]
    pub cz_dac_enabled: bool,
    pub poly_mode: PolyMode,
    pub legato: bool,
    pub portamento: PortamentoParams,
    pub lfo: LfoParams,
    #[serde(default)]
    pub lfo2: LfoParams,
    #[serde(default)]
    pub velocity_curve: f32,
    #[serde(default = "default_pitch_bend_range")]
    pub pitch_bend_range: f32,
    #[serde(default)]
    pub mod_matrix: ModMatrix,
    #[serde(default)]
    pub random: RandomParams,
    #[serde(default)]
    pub mod_env: ModEnvParams,
    #[serde(default = "default_fx_slot_configs")]
    pub fx_slots: [FxSlotConfig; 6],
    #[serde(default)]
    pub macro1: f32,
    #[serde(default)]
    pub macro2: f32,
    #[serde(default)]
    pub macro3: f32,
    #[serde(default)]
    pub macro4: f32,
    #[serde(default = "default_macro_labels")]
    pub macro_labels: [String; 4],
}

impl SynthParams {
    pub fn vibrato_params(&self) -> Option<&VibratoParams> {
        self.fx_slots.iter().find_map(|s| {
            if let FxSlotConfig::Vibrato(p) = s {
                Some(p)
            } else {
                None
            }
        })
    }

    pub fn phase_mod_params(&self) -> Option<&PhaseModParams> {
        self.fx_slots.iter().find_map(|s| {
            if let FxSlotConfig::PhaseMod(p) = s {
                Some(p)
            } else {
                None
            }
        })
    }

    pub fn copy_from_preserving_capacity(&mut self, source: &Self) {
        self.line_select = source.line_select;
        self.mod_mode = source.mod_mode;
        self.ring_gain = source.ring_gain;
        self.octave = source.octave;
        self.line1 = source.line1;
        self.line2 = source.line2;
        self.frequency = source.frequency;
        self.tempo_bpm = source.tempo_bpm;
        self.volume = source.volume;
        self.cz_dac_enabled = source.cz_dac_enabled;
        self.poly_mode = source.poly_mode;
        self.legato = source.legato;
        self.portamento.clone_from(&source.portamento);
        self.lfo.clone_from(&source.lfo);
        self.lfo2.clone_from(&source.lfo2);
        self.velocity_curve = source.velocity_curve;
        self.pitch_bend_range = source.pitch_bend_range;
        self.mod_matrix.routes.clone_from(&source.mod_matrix.routes);
        self.random.clone_from(&source.random);
        self.mod_env.clone_from(&source.mod_env);
        self.fx_slots.clone_from(&source.fx_slots);
        self.macro1 = source.macro1;
        self.macro2 = source.macro2;
        self.macro3 = source.macro3;
        self.macro4 = source.macro4;
        for (dest, src) in self.macro_labels.iter_mut().zip(source.macro_labels.iter()) {
            dest.clone_from(src);
        }
    }
}

impl Default for SynthParams {
    fn default() -> Self {
        Self {
            line_select: LineSelect::default(),
            mod_mode: ModMode::default(),
            ring_gain: default_ring_gain(),
            octave: 0.0,
            line1: LineParams::default(),
            line2: LineParams::default(),
            frequency: 220.0,
            tempo_bpm: default_tempo_bpm(),
            volume: 1.0,
            cz_dac_enabled: default_cz_dac_enabled(),
            poly_mode: PolyMode::default(),
            legato: false,
            portamento: PortamentoParams::default(),
            lfo: LfoParams::default(),
            lfo2: LfoParams::default(),
            velocity_curve: 0.0,
            pitch_bend_range: 2.0,
            mod_matrix: ModMatrix::default(),
            random: RandomParams::default(),
            mod_env: ModEnvParams::default(),
            fx_slots: default_fx_slot_configs(),
            macro1: 0.0,
            macro2: 0.0,
            macro3: 0.0,
            macro4: 0.0,
            macro_labels: default_macro_labels(),
        }
    }
}
