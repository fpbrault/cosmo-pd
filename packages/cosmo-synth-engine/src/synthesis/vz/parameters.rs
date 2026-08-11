//! Parameters owned by the VZ (Casio iPD-style wave-shaping) engine for one line.
//!
//! A VZ line models half of the Casio VZ-1's eight-module architecture: four
//! modules (M1-M4 on line 1, M5-M8 on line 2) arranged as two pairs. Each pair
//! combines its two modules as MIX, RING or PHASE, per US5040448A.

use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

use crate::params::{EnvStep, StepEnvData};

/// Fixed VZ module waveform table: one sine, five phase-distortion-derived
/// saw shapes of increasing depth, white noise, and a pitched noise/sine mix.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum VzWaveform {
    #[default]
    Sine,
    Saw1,
    Saw2,
    Saw3,
    Saw4,
    Saw5,
    Noise,
    NoiseSine,
}

/// How the two modules of a VZ pair combine.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum VzPairMode {
    /// `E_a*W_a(phi_a) + E_b*W_b(phi_b)`
    #[default]
    Mix,
    /// `(E_b + E_a*W_a(phi_a)) * W_b(phi_b)`
    Ring,
    /// `E_b*W_b(E_a*W_a(phi_a))` -- module b receives module a's output as its
    /// phase input instead of its own phase, so it never advances (0 Hz).
    Phase,
}

/// Parameters for one of the four VZ modules on a line.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct VzModuleParams {
    pub enabled: bool,
    pub waveform: VzWaveform,
    pub octave: f32,
    pub detune_note: f32,
    pub detune_fine: f32,
    pub level: f32,
    pub env: StepEnvData,
}

impl Default for VzModuleParams {
    fn default() -> Self {
        Self {
            enabled: true,
            waveform: VzWaveform::default(),
            octave: 0.0,
            detune_note: 0.0,
            detune_fine: 0.0,
            level: 1.0,
            env: default_module_env(),
        }
    }
}

/// Parameters for one of the two VZ pairs (modules 0+1, or 2+3) on a line.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct VzPairParams {
    pub mode: VzPairMode,
    /// When set on pair 1, pair 1 receives pair 0's output as its phase input
    /// instead of summing with it. Pair 0 receives an external phase input
    /// automatically whenever the line-select topology routes one in
    /// (`ModMode::Phase`); this flag has no additional effect on pair 0.
    pub external_phase: bool,
}

/// Parameters owned by the VZ engine for one line: four modules in two pairs.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct VzLineParams {
    #[cfg_attr(feature = "specta-bindings", specta(type = Vec<VzModuleParams>))]
    pub modules: [VzModuleParams; 4],
    #[cfg_attr(feature = "specta-bindings", specta(type = Vec<VzPairParams>))]
    pub pairs: [VzPairParams; 2],
}

impl Default for VzLineParams {
    fn default() -> Self {
        let mut modules = [VzModuleParams::default(); 4];
        modules[0].waveform = VzWaveform::Saw3;
        modules[1].waveform = VzWaveform::Sine;
        modules[1].level = 0.0;
        modules[2].level = 0.0;
        modules[3].level = 0.0;
        Self {
            modules,
            pairs: [VzPairParams::default(); 2],
        }
    }
}

fn default_module_env() -> StepEnvData {
    let mut env = StepEnvData::default();
    env.steps[0] = EnvStep {
        level: 127,
        rate: 99,
        level_norm: 1.0,
    };
    env.steps[1] = EnvStep {
        level: 0,
        rate: 70,
        level_norm: 0.0,
    };
    env.sustain_step = 0;
    env.step_count = 2;
    env.loop_ = false;
    env
}
