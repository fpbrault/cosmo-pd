use super::delay_line::DelayLine;
use crate::dsp_utils::{TWO_PI, wrap01};
use crate::params::{DelayParams, ModDestination};

const SMOOTH_COEFF: f32 = 0.005;
const TAPE_BRIGHT_CUTOFF_HZ: f32 = 20000.0;
const TAPE_WARM_RANGE_HZ: f32 = 19700.0;
const TAPE_SATURATION_DRIVE: f32 = 2.1;

// ---------------------------------------------------------------------------
// DelayFx
// ---------------------------------------------------------------------------

pub struct DelayFx {
    delay_line: DelayLine,
    pub time: f32,
    pub feedback: f32,
    pub mix: f32,
    pub enabled: bool,
    smooth_samples: f32,
    pub tape_mode: bool,
    pub warmth: f32,
    pub time_mode: crate::params::LfoRateMode,
    pub sync_division: crate::params::LfoSyncDivision,
    pub tempo_bpm: f32,
    tape_filter_state: f32,
    tape_wow_phase: f32,
    tape_flutter_phase: f32,
    sample_rate: f32,
}

impl DelayFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = (2.0 * sr).round() as usize;
        Self {
            delay_line: DelayLine::new(buf_len),
            time: 0.3,
            feedback: 0.35,
            mix: 0.0,
            enabled: false,
            smooth_samples: (0.3 * sr).round(),
            tape_mode: false,
            warmth: 0.5,
            time_mode: crate::params::LfoRateMode::Hz,
            sync_division: crate::params::LfoSyncDivision::Quarter,
            tempo_bpm: 120.0,
            tape_filter_state: 0.0,
            tape_wow_phase: 0.0,
            tape_flutter_phase: 0.31,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        let time_seconds = match self.time_mode {
            crate::params::LfoRateMode::Hz => self.time,
            crate::params::LfoRateMode::Sync => {
                let beats = self.sync_division.beats_per_cycle();
                (60.0 / self.tempo_bpm.max(1.0)) * beats
            }
        };
        let target_samples = time_seconds * self.sample_rate;
        let smooth_coeff = if self.tape_mode { 0.0009 } else { SMOOTH_COEFF };
        self.smooth_samples += (target_samples - self.smooth_samples) * smooth_coeff;
        let wow_flutter = if self.tape_mode {
            self.tape_wow_phase = wrap01(self.tape_wow_phase + 0.42 / self.sample_rate);
            self.tape_flutter_phase = wrap01(self.tape_flutter_phase + 6.2 / self.sample_rate);
            let wow = (self.tape_wow_phase * TWO_PI).sin() * 0.0025 * self.sample_rate;
            let flutter = (self.tape_flutter_phase * TWO_PI).sin() * 0.00045 * self.sample_rate;
            (wow + flutter) * self.warmth.clamp(0.0, 1.0)
        } else {
            0.0
        };
        let delay_samples = (self.smooth_samples + wow_flutter).max(1.0);
        let delayed = self.delay_line.read_at_fractional(delay_samples);

        let wet = if self.tape_mode {
            let fc = TAPE_BRIGHT_CUTOFF_HZ - self.warmth * TAPE_WARM_RANGE_HZ;
            let g = (-TWO_PI * fc / self.sample_rate).exp();
            self.tape_filter_state = self.tape_filter_state * g + delayed * (1.0 - g);
            (self.tape_filter_state * TAPE_SATURATION_DRIVE).tanh() / TAPE_SATURATION_DRIVE
        } else {
            delayed
        };

        self.delay_line
            .write(sample + wet * self.feedback.clamp(0.0, 0.97));
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        let dry_gain = (mix_angle).cos();
        let wet_gain = (mix_angle).sin();
        sample * dry_gain + wet * wet_gain
    }
}

impl DelayFx {
    pub fn apply_modulation(&mut self, config: &DelayParams, mod_values: &[f32]) {
        let time = mod_values[ModDestination::DelayTime as usize];
        if time != 0.0 {
            self.time = (config.time + time * 2000.0).clamp(1.0, 4000.0);
        }
        let feedback = mod_values[ModDestination::DelayFeedback as usize];
        if feedback != 0.0 {
            self.feedback = (config.feedback + feedback).clamp(0.0, 0.99);
        }
        let warmth = mod_values[ModDestination::DelayWarmth as usize];
        if warmth != 0.0 {
            self.warmth = (config.warmth + warmth).clamp(0.0, 1.0);
        }
        let mix = mod_values[ModDestination::DelayMix as usize];
        if mix != 0.0 {
            self.mix = (config.mix + mix).clamp(0.0, 1.0);
        }
    }
}

// ---------------------------------------------------------------------------
// Module definition and presets
// ---------------------------------------------------------------------------

use crate::{
    fx::{
        FxControlKindV1, FxControlOptionV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1,
        NO_FX_CONTROL_OPTIONS,
    },
    params::{FxSlotConfig, FxSlotType, SynthParams},
};

const PRESET_OPTIONS: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "digitalSlap",
        label: "Digital Slap",
    },
    FxPresetOptionV1 {
        id: "tapeEcho",
        label: "Tape Echo",
    },
    FxPresetOptionV1 {
        id: "dubFeedback",
        label: "Dub Feedback",
    },
];

const TAPE_MODE_OPTIONS: [FxControlOptionV1; 2] = [
    FxControlOptionV1 {
        value: 0,
        label: "Digital",
        icon_name: None,
    },
    FxControlOptionV1 {
        value: 1,
        label: "Tape",
        icon_name: None,
    },
];

const CONTROLS: [FxControlV1; 7] = [
    FxControlV1 {
        id: "time",
        label: "Time",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.01),
        max: Some(2.0),
        default_f32: Some(0.3),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("delayTime"),
    },
    FxControlV1 {
        id: "feedback",
        label: "Feedback",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(0.99),
        default_f32: Some(0.35),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("delayFeedback"),
    },
    FxControlV1 {
        id: "mix",
        label: "Mix",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("delayMix"),
    },
    FxControlV1 {
        id: "timeMode",
        label: "Time Mode",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "syncDivision",
        label: "Sync Division",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "tapeMode",
        label: "Mode",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &TAPE_MODE_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "warmth",
        label: "Warmth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("delayWarmth"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Delay,
    name: "Delay",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_delay_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Delay(d) = s {
            Some(d)
        } else {
            None
        }
    });
    let Some(d) = slot else {
        return false;
    };

    match preset {
        "digitalSlap" => {
            d.enabled = true;
            d.time = 0.11;
            d.feedback = 0.22;
            d.mix = 0.27;
            d.tape_mode = false;
            d.warmth = 0.2;
            d.time_mode = crate::params::LfoRateMode::Hz;
            d.sync_division = crate::params::LfoSyncDivision::Quarter;
            true
        }
        "tapeEcho" => {
            d.enabled = true;
            d.time = 0.34;
            d.feedback = 0.46;
            d.mix = 0.35;
            d.tape_mode = true;
            d.warmth = 0.72;
            d.time_mode = crate::params::LfoRateMode::Hz;
            d.sync_division = crate::params::LfoSyncDivision::Quarter;
            true
        }
        "dubFeedback" => {
            d.enabled = true;
            d.time = 0.52;
            d.feedback = 0.68;
            d.mix = 0.4;
            d.tape_mode = true;
            d.warmth = 0.55;
            d.time_mode = crate::params::LfoRateMode::Hz;
            d.sync_division = crate::params::LfoSyncDivision::Quarter;
            true
        }
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tape_time_changes_remain_bounded() {
        let mut fx = DelayFx::new(44100.0);
        fx.enabled = true;
        fx.tape_mode = true;
        fx.mix = 0.8;
        fx.feedback = 0.8;
        fx.warmth = 0.75;
        for i in 0..24000 {
            fx.time = if i < 8000 { 0.12 } else { 0.55 };
            let input = if i % 1000 == 0 { 0.9 } else { 0.0 };
            let out = fx.process(input);
            assert!(out.is_finite());
            assert!(out.abs() < 4.0);
        }
    }
}
