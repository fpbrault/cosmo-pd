use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

/// LFO waveform
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum LfoWaveform {
    #[default]
    Sine,
    Triangle,
    Square,
    Saw,
    InvertedSaw,
}

/// LFO parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct LfoParams {
    pub waveform: LfoWaveform,
    pub rate: f32,
    pub depth: f32,
    pub symmetry: f32,
    pub retrigger: bool,
    #[serde(default)]
    pub offset: f32,
}

impl Default for LfoParams {
    fn default() -> Self {
        Self {
            waveform: LfoWaveform::Sine,
            rate: 2.0,
            depth: 1.0,
            symmetry: 0.5,
            retrigger: false,
            offset: 0.0,
        }
    }
}
