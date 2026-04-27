use libm::{cosf, sinf};

use super::delay_line::DelayLine;

const SMOOTH_COEFF: f32 = 0.005;
const TWO_PI: f32 = core::f32::consts::PI * 2.0;

// ---------------------------------------------------------------------------
// FDN reverb constants
// ---------------------------------------------------------------------------

const FDN_N: usize = 8;
const FDN_MAX_MOD: f32 = 14.0;
const FDN_BASE_LENGTHS_44100: [f32; FDN_N] = [
    947.0, 1283.0, 1523.0, 1789.0, 2053.0, 2341.0, 2677.0, 3049.0,
];
const FDN_LFO_RATES: [f32; FDN_N] = [0.127, 0.167, 0.207, 0.247, 0.289, 0.331, 0.373, 0.419];
const ER_N: usize = 5;
const ER_TAP_DELAYS_S: [f32; ER_N] = [0.017, 0.026, 0.035, 0.045, 0.057];
const ER_TAP_GAINS: [f32; ER_N] = [0.70, 0.55, 0.40, 0.28, 0.18];

// ---------------------------------------------------------------------------
// FdnReverb — 8-line Feedback Delay Network with early reflections
// ---------------------------------------------------------------------------

pub struct FdnReverb {
    lines: [DelayLine; FDN_N],
    base_lengths: [f32; FDN_N],
    lp_state: [f32; FDN_N],
    lfo_phases: [f32; FDN_N],
    smooth_predelay: f32,
    pre_line: DelayLine,
    er_line: DelayLine,
    er_tap_samples: [f32; ER_N],
    sample_rate: f32,

    pub enabled: bool,
    pub mix: f32,
    pub space: f32,
    pub predelay: f32,
    pub distance: f32,
    pub character: f32,
}

impl FdnReverb {
    pub fn new(sr: f32) -> Self {
        let ratio = sr / 44100.0;
        let base_lengths: [f32; FDN_N] =
            core::array::from_fn(|i| FDN_BASE_LENGTHS_44100[i] * ratio);
        let lines: [DelayLine; FDN_N] = core::array::from_fn(|i| {
            DelayLine::new(base_lengths[i] as usize + FDN_MAX_MOD as usize + 2)
        });
        let pre_line = DelayLine::new(libm::roundf(0.1 * sr) as usize + 2);
        let er_line = DelayLine::new(libm::roundf(0.08 * sr) as usize + 2);
        let er_tap_samples: [f32; ER_N] =
            core::array::from_fn(|i| (ER_TAP_DELAYS_S[i] * sr).max(1.0));

        Self {
            lines,
            base_lengths,
            lp_state: [0.0; FDN_N],
            lfo_phases: [0.0; FDN_N],
            smooth_predelay: 0.0,
            pre_line,
            er_line,
            er_tap_samples,
            sample_rate: sr,
            enabled: false,
            mix: 0.0,
            space: 0.5,
            predelay: 0.0,
            distance: 0.3,
            character: 0.65,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        let g = 0.50 + self.space * 0.47;
        let character = self.character.clamp(0.0, 1.0);
        let lp_damp = (0.90 - character * 0.85).clamp(0.0, 0.995);
        let lfo_depth = character * (FDN_MAX_MOD * 0.5);

        self.smooth_predelay = Self::smooth(
            self.smooth_predelay,
            self.predelay * self.sample_rate,
            SMOOTH_COEFF,
        );
        self.pre_line.write(sample);
        let pre_delayed = if self.smooth_predelay >= 1.0 {
            self.pre_line.read_at_fractional(self.smooth_predelay)
        } else {
            sample
        };

        let mut er_out = 0.0_f32;
        for i in 0..ER_N {
            er_out += self.er_line.read_at_fractional(self.er_tap_samples[i]) * ER_TAP_GAINS[i];
        }
        self.er_line.write(pre_delayed);

        let mut x = [0.0_f32; FDN_N];
        for i in 0..FDN_N {
            self.lfo_phases[i] += FDN_LFO_RATES[i] / self.sample_rate;
            if self.lfo_phases[i] >= 1.0 {
                self.lfo_phases[i] -= 1.0;
            }
            let lfo_val = sinf(self.lfo_phases[i] * TWO_PI);
            let read_pos = (self.base_lengths[i] + lfo_val * lfo_depth).max(1.0);
            x[i] = self.lines[i].read_at_fractional(read_pos);
        }

        for i in 0..FDN_N {
            self.lp_state[i] = lp_damp * self.lp_state[i] + (1.0 - lp_damp) * x[i];
        }

        let sum_lp: f32 = self.lp_state.iter().sum();
        let two_over_n = 2.0 / FDN_N as f32;

        for i in 0..FDN_N {
            let mixed = self.lp_state[i] - two_over_n * sum_lp;
            self.lines[i].write(pre_delayed + g * mixed);
        }

        let late_out: f32 = x.iter().sum::<f32>() / FDN_N as f32;
        let er_gain = (1.0 - self.distance) * 0.6;
        let lr_gain = 0.4 + self.distance * 0.6;
        let wet = er_out * er_gain + late_out * lr_gain;

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        let dry_gain = cosf(mix_angle);
        let wet_gain = sinf(mix_angle);
        sample * dry_gain + wet * wet_gain
    }

    #[inline]
    fn smooth(current: f32, target: f32, coeff: f32) -> f32 {
        current + (target - current) * coeff
    }
}
