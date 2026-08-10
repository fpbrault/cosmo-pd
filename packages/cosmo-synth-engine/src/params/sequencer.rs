use serde::{Deserialize, Serialize};

#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::LfoSyncDivision;

pub const SEQUENCER_STEP_COUNT: usize = 16;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum SequencerMode {
    #[default]
    Arpeggiator,
    Step,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum SequencerDirection {
    #[default]
    Up,
    Down,
    UpDown,
    Random,
    AsPlayed,
    Forward,
    Reverse,
    PingPong,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum SequencerHoldMode {
    #[default]
    Hold,
    Latch,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase", default)]
pub struct SequencerStep {
    pub enabled: bool,
    pub pitch: i8,
    pub velocity: f32,
    pub gate: f32,
    pub probability: f32,
}

impl Default for SequencerStep {
    fn default() -> Self {
        Self {
            enabled: true,
            pitch: 0,
            velocity: 1.0,
            gate: 1.0,
            probability: 1.0,
        }
    }
}

fn default_steps() -> [SequencerStep; SEQUENCER_STEP_COUNT] {
    [SequencerStep::default(); SEQUENCER_STEP_COUNT]
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase", default)]
pub struct SequencerParams {
    pub enabled: bool,
    pub mode: SequencerMode,
    pub rate: LfoSyncDivision,
    pub direction: SequencerDirection,
    pub octave_range: u8,
    pub repeat: u8,
    pub gate: f32,
    pub swing: f32,
    pub hold_mode: SequencerHoldMode,
    pub pattern_length: u8,
    pub reset_on_transport: bool,
    pub steps: [SequencerStep; SEQUENCER_STEP_COUNT],
}

impl Default for SequencerParams {
    fn default() -> Self {
        Self {
            enabled: false,
            mode: SequencerMode::Arpeggiator,
            rate: LfoSyncDivision::Eighth,
            direction: SequencerDirection::Up,
            octave_range: 1,
            repeat: 1,
            gate: 0.75,
            swing: 0.0,
            hold_mode: SequencerHoldMode::Hold,
            pattern_length: 8,
            reset_on_transport: true,
            steps: default_steps(),
        }
    }
}
