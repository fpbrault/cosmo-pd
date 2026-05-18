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

/// LFO rate interpretation mode.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum LfoRateMode {
    #[default]
    Hz,
    Sync,
}

/// Musical beat division for BPM-synced LFOs.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum LfoSyncDivision {
    Whole,
    Half,
    #[default]
    Quarter,
    Eighth,
    Sixteenth,
    ThirtySecond,
    DottedQuarter,
    DottedEighth,
    QuarterTriplet,
    EighthTriplet,
}

impl LfoSyncDivision {
    pub fn beats_per_cycle(self) -> f32 {
        match self {
            Self::Whole => 4.0,
            Self::Half => 2.0,
            Self::Quarter => 1.0,
            Self::Eighth => 0.5,
            Self::Sixteenth => 0.25,
            Self::ThirtySecond => 0.125,
            Self::DottedQuarter => 1.5,
            Self::DottedEighth => 0.75,
            Self::QuarterTriplet => 2.0 / 3.0,
            Self::EighthTriplet => 1.0 / 3.0,
        }
    }

    pub fn cycles_per_beat(self) -> f32 {
        1.0 / self.beats_per_cycle()
    }
}

/// LFO parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct LfoParams {
    pub waveform: LfoWaveform,
    pub rate: f32,
    #[serde(default)]
    pub rate_mode: LfoRateMode,
    #[serde(default)]
    pub sync_division: LfoSyncDivision,
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
            rate_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
            depth: 1.0,
            symmetry: 0.5,
            retrigger: false,
            offset: 0.0,
        }
    }
}
