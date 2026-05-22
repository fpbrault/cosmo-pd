/// DAC coloration effect state (experimental CZ-1 emulation).
#[derive(Debug, Clone, Copy)]
pub(crate) struct CzDacColor {
    pub expander_env: f32,
    pub slew_env: f32,
    pub prev_held: f32,
    pub held_companded: f32,
    pub sample_hold_phase: f32,
    pub output_lp_state: f32,
    pub dc_block_state: f32,
}

impl CzDacColor {
    pub fn new() -> Self {
        Self {
            expander_env: 0.0,
            slew_env: 0.0,
            prev_held: 0.0,
            held_companded: 0.0,
            sample_hold_phase: 0.0,
            output_lp_state: 0.0,
            dc_block_state: 0.0,
        }
    }

    pub fn reset(&mut self) {
        *self = Self::new();
    }

    pub fn process(&mut self, input: f32, sr: f32) -> f32 {
        use super::utils::{one_pole_hp, one_pole_lp, signed_pow};

        // Approximate the CZ-1 output path more literally:
        // digital companding -> 12-bit DAC-ish quantization at ~40 kHz
        // -> imperfect analog expansion -> gentle 20 kHz reconstruction filter.
        const DAC_SAMPLE_RATE_HZ: f32 = 40_000.0;
        const QUANT_STEPS: f32 = 2047.0;
        const COMPRESS_GAMMA: f32 = 0.84;
        const EXPAND_GAMMA: f32 = 1.0 / COMPRESS_GAMMA;
        const TRACK_ATTACK_SECONDS: f32 = 0.0025;
        const TRACK_RELEASE_SECONDS: f32 = 0.028;
        const MISTRACK_SLEW_AMOUNT: f32 = 0.42;
        const MISTRACK_LEVEL_AMOUNT: f32 = 0.22;
        const MISTRACK_BIAS_AMOUNT: f32 = 0.014;
        const RECONSTRUCTION_LPF_HZ: f32 = 20_000.0;
        const OUTPUT_DC_BLOCK_HZ: f32 = 12.0;
        const STATIC_COLOR_TRIM: f32 = 1.0_31_6; // Geometric-mean loudness match across factory preset calibration.

        let sample_rate_hz = sr.max(1.0);
        let normalized = input.clamp(-1.0, 1.0);
        let companded = signed_pow(normalized, COMPRESS_GAMMA);

        let hold_increment = DAC_SAMPLE_RATE_HZ / sample_rate_hz;
        self.sample_hold_phase += hold_increment;
        if self.sample_hold_phase >= 1.0 {
            self.sample_hold_phase -= self.sample_hold_phase.floor();
            self.held_companded = (companded * QUANT_STEPS).round() / QUANT_STEPS;
        }

        let slew = (self.held_companded - self.prev_held).abs();
        self.slew_env = self.slew_env * 0.96 + slew * 0.04;
        self.prev_held = self.held_companded;

        let detector = self.held_companded.abs();
        let attack_alpha = 1.0 - (-1.0 / (TRACK_ATTACK_SECONDS * sample_rate_hz)).exp();
        let release_alpha = 1.0 - (-1.0 / (TRACK_RELEASE_SECONDS * sample_rate_hz)).exp();
        let env_alpha = if detector > self.expander_env {
            attack_alpha
        } else {
            release_alpha
        };
        self.expander_env += (detector - self.expander_env) * env_alpha;

        let level_error = (detector - self.expander_env).abs();
        let mistrack = (self.slew_env * MISTRACK_SLEW_AMOUNT + level_error * MISTRACK_LEVEL_AMOUNT)
            .clamp(0.0, 0.45);
        let expand_gamma = EXPAND_GAMMA * (1.0 + mistrack);
        let biased = (self.held_companded + level_error * MISTRACK_BIAS_AMOUNT).clamp(-1.0, 1.0);

        let mut out = signed_pow(biased, expand_gamma);
        out = one_pole_lp(
            out,
            &mut self.output_lp_state,
            RECONSTRUCTION_LPF_HZ,
            sample_rate_hz,
        );
        out = one_pole_hp(
            out,
            &mut self.dc_block_state,
            OUTPUT_DC_BLOCK_HZ,
            sample_rate_hz,
        );

        (out * STATIC_COLOR_TRIM).clamp(-1.0, 1.0)
    }
}
