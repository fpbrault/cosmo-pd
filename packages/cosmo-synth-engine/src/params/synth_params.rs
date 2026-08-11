use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::fx_params::{FxSlotConfig, VibratoParams, default_fx_slot_configs};
use super::lfo::{LfoParams, LfoRateMode, LfoSyncDivision};
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
#[serde(rename_all = "camelCase")]
pub struct RandomParams {
    pub rate: f32,
    #[serde(default)]
    pub rate_mode: LfoRateMode,
    #[serde(default)]
    pub sync_division: LfoSyncDivision,
}

impl Default for RandomParams {
    fn default() -> Self {
        Self {
            rate: 2.0,
            rate_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        }
    }
}

/// Modulation envelope mode: ADSR (sustain hold) or ADR (no sustain).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum ModEnvMode {
    #[default]
    Adsr,
    Adr,
}

/// Modulation envelope retrigger mode:
/// - `Mono` -> envelope re-attacks on every note-on.
/// - `Legato` -> envelope continues its current phase when a new note is played
///   while other notes are still held (only retriggers after all keys are released).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum ModEnvRetrigMode {
    #[default]
    Poly,
    Mono,
    Legato,
}

/// ADSR mod envelope parameters.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModEnvParams {
    pub attack: f32,
    pub decay: f32,
    pub sustain: f32,
    pub release: f32,
    #[serde(default)]
    pub mode: ModEnvMode,
    #[serde(default)]
    pub retrig_mode: ModEnvRetrigMode,
}

impl Default for ModEnvParams {
    fn default() -> Self {
        Self {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.2,
            mode: ModEnvMode::default(),
            retrig_mode: ModEnvRetrigMode::default(),
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
}

impl Default for SynthParams {
    fn default() -> Self {
        let mut line1 = LineParams::default();
        let mut line2 = LineParams::default();
        line1.envelopes = crate::synthesis::pd::default_envelopes::default_line_envelopes();
        line2.envelopes = crate::synthesis::pd::default_envelopes::default_line_envelopes();

        Self {
            line_select: LineSelect::default(),
            mod_mode: ModMode::default(),
            ring_gain: default_ring_gain(),
            octave: 0.0,
            line1,
            line2,
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mod_env_params_default_mode_is_adsr() {
        assert_eq!(ModEnvParams::default().mode, ModEnvMode::Adsr);
    }

    #[test]
    fn mod_env_params_default_retrig_mode_is_poly() {
        assert_eq!(ModEnvParams::default().retrig_mode, ModEnvRetrigMode::Poly);
    }

    #[test]
    fn mod_env_params_legacy_json_defaults_mode_to_adsr() {
        let json = r#"{"attack":0.01,"decay":0.1,"sustain":0.5,"release":0.2}"#;
        let params: ModEnvParams = serde_json::from_str(json).expect("valid legacy mod env json");
        assert_eq!(params.mode, ModEnvMode::Adsr);
        assert_eq!(params.retrig_mode, ModEnvRetrigMode::Poly);
    }

    #[test]
    fn mod_env_params_mode_roundtrips_through_serde() {
        for mode in [ModEnvMode::Adsr, ModEnvMode::Adr] {
            let params = ModEnvParams {
                attack: 0.0,
                decay: 0.0,
                sustain: 0.0,
                release: 0.0,
                mode,
                retrig_mode: ModEnvRetrigMode::default(),
            };
            let json = serde_json::to_string(&params).expect("serialize mod env params");
            let back: ModEnvParams =
                serde_json::from_str(&json).expect("deserialize mod env params");
            assert_eq!(back.mode, mode);
        }
    }

    #[test]
    fn mod_env_params_retrig_mode_roundtrips_through_serde() {
        for retrig in [
            ModEnvRetrigMode::Poly,
            ModEnvRetrigMode::Mono,
            ModEnvRetrigMode::Legato,
        ] {
            let params = ModEnvParams {
                attack: 0.0,
                decay: 0.0,
                sustain: 0.0,
                release: 0.0,
                mode: ModEnvMode::default(),
                retrig_mode: retrig,
            };
            let json = serde_json::to_string(&params).expect("serialize mod env params");
            let back: ModEnvParams =
                serde_json::from_str(&json).expect("deserialize mod env params");
            assert_eq!(back.retrig_mode, retrig);
        }
    }
}
