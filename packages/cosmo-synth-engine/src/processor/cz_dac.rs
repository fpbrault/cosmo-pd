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

        const QUANT_STEPS: f32 = 2047.0;
        const COMPRESS_GAMMA: f32 = 0.94;
        const EXPAND_GAMMA: f32 = 1.0 / COMPRESS_GAMMA;
        const MISTRACK_MAX: f32 = 0.22;
        const LOW_BUMP_HZ: f32 = 100.0;
        const HONK_HP_HZ: f32 = 650.0;
        const HONK_LP_HZ: f32 = 1_700.0;
        const AIR_HP_HZ: f32 = 5_500.0;
        const HF_ROLLOFF_HZ: f32 = 40_000.0;
        const STATIC_COLOR_TRIM: f32 = 2.084_508; // Geometric-mean loudness match across factory preset calibration.

        let sample_rate_hz = sr.max(1.0);

        let slew = (input - self.prev_q).abs();
        self.slew_env = self.slew_env * 0.999 + slew * 0.001;
        self.prev_q = input;

        let env_alpha = if sr > 0.0 { 1.0 / (sr * 0.01) } else { 0.01 };
        self.env = self.env * (1.0 - env_alpha) + self.slew_env * env_alpha;

        let mistrack = (self.env * MISTRACK_MAX).clamp(0.0, MISTRACK_MAX);
        let q = QUANT_STEPS + mistrack * 2.0;
        let quantized = (input * q).round() / q;

        let compressed = signed_pow(quantized, COMPRESS_GAMMA);

        let low = one_pole_lp(compressed, &mut self.low_state, LOW_BUMP_HZ, sample_rate_hz);
        let honk_hp = one_pole_hp(
            compressed,
            &mut self.honk_hp_state,
            HONK_HP_HZ,
            sample_rate_hz,
        );
        let honk_lp = one_pole_lp(honk_hp, &mut self.honk_lp_state, HONK_LP_HZ, sample_rate_hz);
        let air_hp = one_pole_hp(
            compressed,
            &mut self.air_hp_state,
            AIR_HP_HZ,
            sample_rate_hz,
        );

        let mut out = low + honk_lp * 0.5 + air_hp * 0.3;
        out = signed_pow(out, EXPAND_GAMMA);
        out = one_pole_lp(
            out,
            &mut self.output_lp_state,
            HF_ROLLOFF_HZ,
            sample_rate_hz,
        );

        (out * STATIC_COLOR_TRIM).clamp(-1.0, 1.0)
    }
}
