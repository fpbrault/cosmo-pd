use crate::voice::{AdsrPhase, Voice};
use serde::Serialize;

#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Snapshot of modulation source values for UI telemetry.
#[derive(Debug, Clone, Copy, Default, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct RuntimeModSources {
    pub pitch_bend: f32,
    pub lfo1: f32,
    pub lfo2: f32,
    pub random: f32,
    pub mod_env: f32,
    pub velocity: f32,
    pub mod_wheel: f32,
    pub aftertouch: f32,
    pub macro1: f32,
    pub macro2: f32,
    pub macro3: f32,
    pub macro4: f32,
    pub voice_limit: u8,
}

/// Snapshot of a single envelope generator's runtime state.
#[derive(Debug, Clone, Copy, Default, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct RuntimeVoiceEnvState {
    pub value: f32,
    #[cfg_attr(feature = "specta-bindings", specta(type = u32))]
    pub step: usize,
    pub releasing: bool,
    pub step_pos: u32,
    pub prev_level: f32,
}

/// Snapshot of the ADSR/ADR modulation envelope runtime state.
#[derive(Debug, Clone, Copy, Default, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct RuntimeModEnvState {
    pub value: f32,
    pub phase: AdsrPhase,
    pub releasing: bool,
    pub release_start: f32,
}

/// Snapshot of one oscillator line's envelope generators.
#[derive(Debug, Clone, Copy, Default, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct RuntimeVoiceLineState {
    pub dco: RuntimeVoiceEnvState,
    pub dcw: RuntimeVoiceEnvState,
    pub dca: RuntimeVoiceEnvState,
}

/// Full debug snapshot of one voice's runtime state.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct RuntimeVoiceDebugState {
    #[cfg_attr(feature = "specta-bindings", specta(type = u32))]
    pub index: usize,
    pub active: bool,
    pub is_releasing: bool,
    pub sustained: bool,
    pub note: Option<u8>,
    pub env_note: u8,
    pub velocity: f32,
    pub frequency: f32,
    pub current_freq: f32,
    pub target_freq: f32,
    pub phase1: f32,
    pub phase2: f32,
    pub anti_click_fade: u32,
    pub anti_click_attack: u32,
    pub release_tail_level: f32,
    pub mod_env: RuntimeModEnvState,
    pub line1: RuntimeVoiceLineState,
    pub line2: RuntimeVoiceLineState,
}

/// Maps a MIDI note to a voice index.
#[derive(Debug, Clone)]
pub struct NoteEntry {
    pub note: u8,
    pub voice_idx: usize,
}

/// Full voice state saved when switching notes in mono mode.
#[derive(Debug, Clone)]
pub struct MonoStackEntry {
    pub note: u8,
    pub voice: Voice,
}
