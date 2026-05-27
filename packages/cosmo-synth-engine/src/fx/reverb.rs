use super::delay_line::DelayLine;
use crate::params::{ModDestination, ReverbParams};

const SMOOTH_COEFF: f32 = 0.005;

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
        let pre_line = DelayLine::new((0.1 * sr).round() as usize + 2);
        let er_line = DelayLine::new((0.08 * sr).round() as usize + 2);
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
        for (index, gain) in ER_TAP_GAINS.iter().copied().enumerate().take(ER_N) {
            er_out += self.er_line.read_at_fractional(self.er_tap_samples[index]) * gain;
        }
        self.er_line.write(pre_delayed);

        let mut x = [0.0_f32; FDN_N];
        for (i, sample) in x.iter_mut().enumerate().take(FDN_N) {
            self.lfo_phases[i] += FDN_LFO_RATES[i] / self.sample_rate;
            if self.lfo_phases[i] >= 1.0 {
                self.lfo_phases[i] -= 1.0;
            }
            // ECO quality mode: triangle LFO avoids per-sample sinf cost.
            let tri_lfo = 1.0 - 4.0 * (self.lfo_phases[i] - 0.5).abs();
            let read_pos = (self.base_lengths[i] + tri_lfo * lfo_depth).max(1.0);
            *sample = self.lines[i].read_at_fractional(read_pos);
        }

        for (state, sample) in self.lp_state.iter_mut().zip(x.iter()) {
            *state = lp_damp * *state + (1.0 - lp_damp) * *sample;
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

        // ECO quality mode: linear crossfade is cheaper than equal-power trig mix.
        let mix = self.mix.clamp(0.0, 1.0);
        sample * (1.0 - mix) + wet * mix
    }

    #[inline]
    fn smooth(current: f32, target: f32, coeff: f32) -> f32 {
        current + (target - current) * coeff
    }
}

impl FdnReverb {
    pub fn apply_modulation(&mut self, config: &ReverbParams, mod_values: &[f32]) {
        let mix = mod_values[ModDestination::ReverbMix as usize];
        if mix != 0.0 {
            self.mix = (config.mix + mix).clamp(0.0, 1.0);
        }
        let space = mod_values[ModDestination::ReverbSpace as usize];
        if space != 0.0 {
            self.space = (config.space + space).clamp(0.0, 1.0);
        }
        let predelay = mod_values[ModDestination::ReverbPredelay as usize];
        if predelay != 0.0 {
            self.predelay = (config.predelay + predelay * 50.0).clamp(0.0, 200.0);
        }
        let distance = mod_values[ModDestination::ReverbDistance as usize];
        if distance != 0.0 {
            self.distance = (config.distance + distance).clamp(0.0, 1.0);
        }
        let character = mod_values[ModDestination::ReverbCharacter as usize];
        if character != 0.0 {
            self.character = (config.character + character).clamp(0.0, 1.0);
        }
    }
}

// ---------------------------------------------------------------------------
// Module definition and presets
// ---------------------------------------------------------------------------

use crate::{
    fx::{FxControlKindV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1, NO_FX_CONTROL_OPTIONS},
    params::{FxSlotConfig, FxSlotType, SynthParams},
};

const PRESET_OPTIONS: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "smallRoom",
        label: "Small Room",
    },
    FxPresetOptionV1 {
        id: "plateAir",
        label: "Plate Air",
    },
    FxPresetOptionV1 {
        id: "cathedral",
        label: "Cathedral",
    },
];

const CONTROLS: [FxControlV1; 5] = [
    FxControlV1 {
        id: "mix",
        label: "Mix",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("reverbMix"),
    },
    FxControlV1 {
        id: "space",
        label: "Space",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("reverbSpace"),
    },
    FxControlV1 {
        id: "predelay",
        label: "Pre",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(0.1),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("reverbPredelay"),
    },
    FxControlV1 {
        id: "distance",
        label: "Dist",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.3),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("reverbDistance"),
    },
    FxControlV1 {
        id: "character",
        label: "Char",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.65),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("reverbCharacter"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Reverb,
    name: "Reverb",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

crate::fx_preset_entry!(pub ReverbPresetV1, ReverbParams);

pub const REVERB_PRESET_DATA: [ReverbPresetV1; 3] = [
    ReverbPresetV1 {
        id: "smallRoom",
        label: "Small Room",
        params: ReverbParams {
            enabled: true,
            mix: 0.22,
            space: 0.32,
            predelay: 0.006,
            distance: 0.28,
            character: 0.45,
        },
    },
    ReverbPresetV1 {
        id: "plateAir",
        label: "Plate Air",
        params: ReverbParams {
            enabled: true,
            mix: 0.31,
            space: 0.58,
            predelay: 0.012,
            distance: 0.4,
            character: 0.74,
        },
    },
    ReverbPresetV1 {
        id: "cathedral",
        label: "Cathedral",
        params: ReverbParams {
            enabled: true,
            mix: 0.47,
            space: 0.9,
            predelay: 0.03,
            distance: 0.68,
            character: 0.66,
        },
    },
];

pub fn reverb_preset_data() -> &'static [ReverbPresetV1] {
    &REVERB_PRESET_DATA
}

pub fn apply_reverb_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = REVERB_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Reverb(r) = s {
            Some(r)
        } else {
            None
        }
    });
    if let Some(r) = slot {
        *r = p.params.clone();
        true
    } else {
        false
    }
}
