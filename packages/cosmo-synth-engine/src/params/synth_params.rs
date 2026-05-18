use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::fx_params::{FxSlotConfig, PhaseModParams, VibratoParams, default_fx_slot_configs};
use super::lfo::LfoParams;
use super::line::{LineParams, LineSelect, ModMode, PolyMode};
use super::modulation::ModMatrix;
use super::portamento::PortamentoParams;

pub const NUM_VOICES: usize = 8;
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

pub(crate) fn default_ring_gain() -> f32 {
    4.0
}

pub(crate) fn default_cz_dac_enabled() -> bool {
    false
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
            volume: 0.4,
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
        }
    }
}
