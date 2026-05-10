use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::envelopes::StepEnvData;
use super::waveforms::{Algo, BaseWaveform, WindowType};
use crate::default_envelopes::{default_dca_env, default_dco_env, default_dcw_env};

/// Line select
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub enum LineSelect {
    #[serde(rename = "L1")]
    L1,
    #[serde(rename = "L2")]
    L2,
    #[serde(rename = "L1+L1'")]
    L1PlusL1Prime,
    #[serde(rename = "L1+L2'")]
    #[default]
    L1PlusL2Prime,
}

/// Modulation mode
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum ModMode {
    #[default]
    Normal,
    Ring,
    Noise,
}

/// Polyphony mode
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum PolyMode {
    #[default]
    #[serde(rename = "poly8")]
    Poly8,
    Mono,
}

/// One algorithm-specific control value persisted on a line.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AlgoControlValueV1 {
    pub id: String,
    pub value: f32,
}

/// Per-line parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct LineParams {
    pub algo: Algo,
    pub algo2: Option<Algo>,
    pub algo_blend: f32,
    #[serde(default)]
    pub base_waveform_a: BaseWaveform,
    #[serde(default)]
    pub base_waveform_b: BaseWaveform,
    pub window: WindowType,
    pub dca_base: f32,
    pub dcw_base: f32,
    pub modulation: f32,
    #[serde(default)]
    pub detune_note: f32,
    #[serde(default)]
    pub detune_fine: f32,
    pub octave: f32,
    pub dco_env: StepEnvData,
    pub dcw_env: StepEnvData,
    pub dca_env: StepEnvData,
    pub key_follow: f32,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub algo_controls_a: Option<Vec<AlgoControlValueV1>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub algo_controls_b: Option<Vec<AlgoControlValueV1>>,
}

impl Default for LineParams {
    fn default() -> Self {
        Self {
            algo: Algo::Saw,
            algo2: None,
            algo_blend: 0.0,
            base_waveform_a: BaseWaveform::default(),
            base_waveform_b: BaseWaveform::default(),
            window: WindowType::Off,
            dca_base: 1.0,
            dcw_base: 0.0,
            modulation: 0.0,
            detune_note: 0.0,
            detune_fine: 0.0,
            octave: 0.0,
            dco_env: default_dco_env(),
            dcw_env: default_dcw_env(),
            dca_env: default_dca_env(),
            key_follow: 0.0,
            algo_controls_a: None,
            algo_controls_b: None,
        }
    }
}
