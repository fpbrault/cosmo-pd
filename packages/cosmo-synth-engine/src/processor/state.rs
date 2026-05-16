use crate::voice::Voice;
use serde::Serialize;

/// DAC coloration effect state (experimental CZ-1 emulation).
#[derive(Debug, Clone, Copy)]
pub(crate) struct CzDacColor {
    pub env: f32,
    pub slew_env: f32,
    pub prev_q: f32,
    pub low_state: f32,
    pub honk_hp_state: f32,
    pub honk_lp_state: f32,
    pub air_hp_state: f32,
    pub output_lp_state: f32,
}

impl CzDacColor {
    pub fn new() -> Self {
        Self {
            env: 0.0,
            slew_env: 0.0,
            prev_q: 0.0,
            low_state: 0.0,
            honk_hp_state: 0.0,
            honk_lp_state: 0.0,
            air_hp_state: 0.0,
            output_lp_state: 0.0,
        }
    }

    pub fn reset(&mut self) {
        *self = Self::new();
    }

    pub fn process(&mut self, input: f32, sr: f32) -> f32 {
        use super::utils::{one_pole_hp, one_pole_lp, signed_pow};

        const SAMPLE_RATE_HZ: f32 = 40_000.0;
        const QUANT_STEPS: f32 = 2047.0;
        const COMPRESS_GAMMA: f32 = 0.78;
        const EXPAND_GAMMA: f32 = 1.0 / COMPRESS_GAMMA;
        const MISTRACK_MAX: f32 = 0.22;
        const LOW_BUMP_HZ: f32 = 100.0;
        const HONK_HP_HZ: f32 = 650.0;
        const HONK_LP_HZ: f32 = 1_700.0;
        const AIR_HP_HZ: f32 = 5_500.0;
        const HF_ROLLOFF_HZ: f32 = 20_000.0;

        let slew = (input - self.prev_q).abs();
        self.slew_env = self.slew_env * 0.999 + slew * 0.001;
        self.prev_q = input;

        let env_alpha = if sr > 0.0 { 1.0 / (sr * 0.01) } else { 0.01 };
        self.env = self.env * (1.0 - env_alpha) + self.slew_env * env_alpha;

        let mistrack = (self.env * MISTRACK_MAX).clamp(0.0, MISTRACK_MAX);
        let q = QUANT_STEPS + mistrack * 2.0;
        let quantized = (input * q).round() / q;

        let compressed = signed_pow(quantized, COMPRESS_GAMMA);

        let low = one_pole_lp(compressed, &mut self.low_state, LOW_BUMP_HZ, SAMPLE_RATE_HZ);
        let honk_hp = one_pole_hp(
            compressed,
            &mut self.honk_hp_state,
            HONK_HP_HZ,
            SAMPLE_RATE_HZ,
        );
        let honk_lp = one_pole_lp(honk_hp, &mut self.honk_lp_state, HONK_LP_HZ, SAMPLE_RATE_HZ);
        let air_hp = one_pole_hp(
            compressed,
            &mut self.air_hp_state,
            AIR_HP_HZ,
            SAMPLE_RATE_HZ,
        );

        let mut out = low + honk_lp * 0.5 + air_hp * 0.3;
        out = signed_pow(out, EXPAND_GAMMA);
        out = one_pole_lp(
            out,
            &mut self.output_lp_state,
            HF_ROLLOFF_HZ,
            SAMPLE_RATE_HZ,
        );

        out.clamp(-1.0, 1.0)
    }
}

/// Snapshot of modulation source values for UI telemetry.
#[derive(Debug, Clone, Copy, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeModSources {
    pub lfo1: f32,
    pub lfo2: f32,
    pub random: f32,
    pub mod_env: f32,
    pub velocity: f32,
    pub mod_wheel: f32,
    pub aftertouch: f32,
}

/// Snapshot of a single envelope generator's runtime state.
#[derive(Debug, Clone, Copy, Default, Serialize)]
pub struct RuntimeVoiceEnvState {
    pub value: f32,
    pub step: usize,
    pub releasing: bool,
    pub step_pos: u32,
    pub prev_level: f32,
}

/// Snapshot of one oscillator line's envelope generators.
#[derive(Debug, Clone, Copy, Default, Serialize)]
pub struct RuntimeVoiceLineState {
    pub dco: RuntimeVoiceEnvState,
    pub dcw: RuntimeVoiceEnvState,
    pub dca: RuntimeVoiceEnvState,
}

/// Full debug snapshot of one voice's runtime state.
#[derive(Debug, Clone, Serialize)]
pub struct RuntimeVoiceDebugState {
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
