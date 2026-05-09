use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Low-level CZ waveform selector.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum CzWaveform {
    #[default]
    Saw,
    Square,
    Pulse,
    Null,
    SinePulse,
    SawPulse,
    MultiSine,
    Pulse2,
}

/// Base waveform used as the final carrier for warp algorithms.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum BaseWaveform {
    #[default]
    Cosine,
    Sine,
    Triangle,
    Saw,
    Square,
}

/// Front-panel CZ algorithm shortcuts.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum CzAlgo {
    #[default]
    Saw,
    Square,
    Pulse,
    DoubleSine,
    SawPulse,
    Reso1,
    Reso2,
    Reso3,
}

impl CzAlgo {
    pub fn waveform(self) -> WindowType {
        match self {
            CzAlgo::Saw
            | CzAlgo::Square
            | CzAlgo::Pulse
            | CzAlgo::DoubleSine
            | CzAlgo::SawPulse => WindowType::Off,
            CzAlgo::Reso1 => WindowType::Saw,
            CzAlgo::Reso2 => WindowType::Triangle,
            CzAlgo::Reso3 => WindowType::Trapezoid,
        }
    }
}

/// Window type applied to oscillator output
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum WindowType {
    #[default]
    Off,
    Saw,
    Triangle,
    Trapezoid,
    Pulse,
    DoubleSaw,
}

/// Flat algorithm selector — unifies CZ waveforms and warp variants.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum Algo {
    // CZ waveforms
    Saw,
    Square,
    Pulse,
    Null,
    SinePulse,
    SawPulse,
    MultiSine,
    Pulse2,
    // Warp algorithms
    #[default]
    Cz101,
    Bend,
    Sync,
    Pinch,
    Fold,
    Skew,
    Quantize,
    Twist,
    Clip,
    Ripple,
    Mirror,
    Fof,
    Karpunk,
    Sine,
}

impl Algo {
    pub fn from_cz_waveform(waveform: CzWaveform) -> Self {
        match waveform {
            CzWaveform::Saw => Algo::Saw,
            CzWaveform::Square => Algo::Square,
            CzWaveform::Pulse => Algo::Pulse,
            CzWaveform::Null => Algo::Null,
            CzWaveform::SinePulse => Algo::SinePulse,
            CzWaveform::SawPulse => Algo::SawPulse,
            CzWaveform::MultiSine => Algo::MultiSine,
            CzWaveform::Pulse2 => Algo::Pulse2,
        }
    }

    pub fn as_cz_waveform(self) -> Option<CzWaveform> {
        match self {
            Algo::Saw => Some(CzWaveform::Saw),
            Algo::Square => Some(CzWaveform::Square),
            Algo::Pulse => Some(CzWaveform::Pulse),
            Algo::Null => Some(CzWaveform::Null),
            Algo::SinePulse => Some(CzWaveform::SinePulse),
            Algo::SawPulse => Some(CzWaveform::SawPulse),
            Algo::MultiSine => Some(CzWaveform::MultiSine),
            Algo::Pulse2 => Some(CzWaveform::Pulse2),
            _ => None,
        }
    }

    pub fn is_cz_waveform(self) -> bool {
        self.as_cz_waveform().is_some()
    }
}
