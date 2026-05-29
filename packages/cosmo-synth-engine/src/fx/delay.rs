use super::delay_line::DelayLine;
use crate::dsp_utils::{TWO_PI, wrap01};
use crate::params::{DelayParams, ModDestination};

const SMOOTH_COEFF: f32 = 0.005;
const TAPE_BRIGHT_CUTOFF_HZ: f32 = 20000.0;
const TAPE_WARM_RANGE_HZ: f32 = 19700.0;
const TAPE_SATURATION_DRIVE: f32 = 2.1;
const BBD_CUTOFF_HZ: f32 = 7000.0;
const BBD_MAX_MOD_MS: f32 = 0.5;
const BBD_LFO_RATE_HZ: f32 = 0.6;
const MAX_STEREO_SPREAD_FRACTION: f32 = 0.5;

// ---------------------------------------------------------------------------
// DelayFx
// ---------------------------------------------------------------------------

pub struct DelayFx {
    delay_line: DelayLine,
    delay_line_r: DelayLine,
    pub time: f32,
    pub feedback: f32,
    pub mix: f32,
    pub enabled: bool,
    smooth_samples: f32,
    smooth_samples_r: f32,
    pub mode: u8,
    pub extra: f32,
    pub time_mode: crate::params::LfoRateMode,
    pub sync_division: crate::params::LfoSyncDivision,
    pub tempo_bpm: f32,
    tape_filter_state: f32,
    tape_wow_phase: f32,
    tape_flutter_phase: f32,
    bbd_lfo_phase: f32,
    bbd_filter_state: f32,
    sample_counter: usize,
    sample_rate: f32,
}

impl DelayFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = (2.0 * sr).round() as usize;
        Self {
            delay_line: DelayLine::new(buf_len),
            delay_line_r: DelayLine::new(buf_len),
            time: 0.3,
            feedback: 0.35,
            mix: 0.0,
            enabled: false,
            smooth_samples: (0.3 * sr).round(),
            smooth_samples_r: (0.3 * sr).round(),
            mode: 0,
            extra: 0.5,
            time_mode: crate::params::LfoRateMode::Hz,
            sync_division: crate::params::LfoSyncDivision::Quarter,
            tempo_bpm: 120.0,
            tape_filter_state: 0.0,
            tape_wow_phase: 0.0,
            tape_flutter_phase: 0.31,
            bbd_lfo_phase: 0.0,
            bbd_filter_state: 0.0,
            sample_counter: 0,
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

        match self.mode {
            0 => self.process_digital(sample, time_seconds),
            1 => self.process_tape(sample, time_seconds),
            2 => self.process_bbd(sample, time_seconds),
            3 => self.process_stereo(sample, time_seconds),
            _ => sample,
        }
    }

    fn mix_output(&self, sample: f32, wet: f32) -> f32 {
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * mix_angle.cos() + wet * mix_angle.sin()
    }

    fn process_digital(&mut self, sample: f32, time_seconds: f32) -> f32 {
        let target_samples = time_seconds * self.sample_rate;
        self.smooth_samples += (target_samples - self.smooth_samples) * SMOOTH_COEFF;
        let delay_samples = self.smooth_samples.max(1.0);
        let delayed = self.delay_line.read_at_fractional(delay_samples);
        self.delay_line
            .write(sample + delayed * self.feedback.clamp(0.0, 0.97));
        self.mix_output(sample, delayed)
    }

    fn process_tape(&mut self, sample: f32, time_seconds: f32) -> f32 {
        let target_samples = time_seconds * self.sample_rate;
        self.smooth_samples += (target_samples - self.smooth_samples) * 0.0009;

        self.tape_wow_phase = wrap01(self.tape_wow_phase + 0.42 / self.sample_rate);
        self.tape_flutter_phase = wrap01(self.tape_flutter_phase + 6.2 / self.sample_rate);
        let wow = (self.tape_wow_phase * TWO_PI).sin() * 0.0025 * self.sample_rate;
        let flutter = (self.tape_flutter_phase * TWO_PI).sin() * 0.00045 * self.sample_rate;
        let mod_samples = (wow + flutter) * self.extra.clamp(0.0, 1.0);

        let delay_samples = (self.smooth_samples + mod_samples).max(1.0);
        let delayed = self.delay_line.read_at_fractional(delay_samples);

        let fc = TAPE_BRIGHT_CUTOFF_HZ - self.extra * TAPE_WARM_RANGE_HZ;
        let g = (-TWO_PI * fc / self.sample_rate).exp();
        self.tape_filter_state = self.tape_filter_state * g + delayed * (1.0 - g);
        let wet = (self.tape_filter_state * TAPE_SATURATION_DRIVE).tanh() / TAPE_SATURATION_DRIVE;

        self.delay_line
            .write(sample + wet * self.feedback.clamp(0.0, 0.97));
        self.mix_output(sample, wet)
    }

    fn process_bbd(&mut self, sample: f32, time_seconds: f32) -> f32 {
        let target_samples = time_seconds * self.sample_rate;
        self.smooth_samples += (target_samples - self.smooth_samples) * SMOOTH_COEFF;

        self.bbd_lfo_phase = wrap01(self.bbd_lfo_phase + BBD_LFO_RATE_HZ / self.sample_rate);
        let mod_samples = (self.bbd_lfo_phase * TWO_PI).sin()
            * self.extra
            * BBD_MAX_MOD_MS
            * 0.001
            * self.sample_rate;

        let delay_samples = (self.smooth_samples + mod_samples).max(1.0);
        let raw = self.delay_line.read_at_fractional(delay_samples);

        let g = (-TWO_PI * BBD_CUTOFF_HZ / self.sample_rate).exp();
        self.bbd_filter_state = self.bbd_filter_state * g + raw * (1.0 - g);
        let wet = self.bbd_filter_state;

        self.delay_line
            .write(sample + wet * self.feedback.clamp(0.0, 0.97));
        self.mix_output(sample, wet)
    }

    fn process_stereo(&mut self, sample: f32, time_seconds: f32) -> f32 {
        let is_left = self.sample_counter & 1 == 0;
        self.sample_counter += 1;

        let spread_frac = self.extra * MAX_STEREO_SPREAD_FRACTION;

        if is_left {
            let target_samples = time_seconds * self.sample_rate;
            self.smooth_samples += (target_samples - self.smooth_samples) * SMOOTH_COEFF;
            let delay_samples = self.smooth_samples.max(1.0);
            let delayed = self.delay_line.read_at_fractional(delay_samples);
            self.delay_line
                .write(sample + delayed * self.feedback.clamp(0.0, 0.97));
            self.mix_output(sample, delayed)
        } else {
            let target_samples = time_seconds * (1.0 + spread_frac) * self.sample_rate;
            self.smooth_samples_r += (target_samples - self.smooth_samples_r) * SMOOTH_COEFF;
            let delay_samples = self.smooth_samples_r.max(1.0);
            let delayed = self.delay_line_r.read_at_fractional(delay_samples);
            self.delay_line_r
                .write(sample + delayed * self.feedback.clamp(0.0, 0.97));
            self.mix_output(sample, delayed)
        }
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
        let extra = mod_values[ModDestination::DelayWarmth as usize];
        if extra != 0.0 {
            self.extra = (config.extra + extra).clamp(0.0, 1.0);
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

const PRESET_OPTIONS: [FxPresetOptionV1; 5] = [
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
    FxPresetOptionV1 {
        id: "analogBbd",
        label: "Analog BBD",
    },
    FxPresetOptionV1 {
        id: "pingPong",
        label: "Ping Pong",
    },
];

const MODE_OPTIONS: [FxControlOptionV1; 4] = [
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
    FxControlOptionV1 {
        value: 2,
        label: "BBD",
        icon_name: None,
    },
    FxControlOptionV1 {
        value: 3,
        label: "Stereo",
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
        id: "mode",
        label: "Mode",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &MODE_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "extra",
        label: "Extra",
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

crate::fx_preset_entry!(pub DelayPresetV1, DelayParams);

use crate::params::{LfoRateMode, LfoSyncDivision};

pub const DELAY_PRESET_DATA: [DelayPresetV1; 5] = [
    DelayPresetV1 {
        id: "digitalSlap",
        label: "Digital Slap",
        params: DelayParams {
            enabled: true,
            time: 0.11,
            feedback: 0.22,
            mix: 0.27,
            mode: 0,
            extra: 0.2,
            time_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        },
    },
    DelayPresetV1 {
        id: "tapeEcho",
        label: "Tape Echo",
        params: DelayParams {
            enabled: true,
            time: 0.34,
            feedback: 0.46,
            mix: 0.35,
            mode: 1,
            extra: 0.72,
            time_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        },
    },
    DelayPresetV1 {
        id: "dubFeedback",
        label: "Dub Feedback",
        params: DelayParams {
            enabled: true,
            time: 0.52,
            feedback: 0.68,
            mix: 0.4,
            mode: 1,
            extra: 0.55,
            time_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        },
    },
    DelayPresetV1 {
        id: "analogBbd",
        label: "Analog BBD",
        params: DelayParams {
            enabled: true,
            time: 0.28,
            feedback: 0.4,
            mix: 0.32,
            mode: 2,
            extra: 0.55,
            time_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        },
    },
    DelayPresetV1 {
        id: "pingPong",
        label: "Ping Pong",
        params: DelayParams {
            enabled: true,
            time: 0.35,
            feedback: 0.45,
            mix: 0.38,
            mode: 3,
            extra: 0.4,
            time_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        },
    },
];

pub fn delay_preset_data() -> &'static [DelayPresetV1] {
    &DELAY_PRESET_DATA
}

pub fn apply_delay_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = DELAY_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Delay(d) = s {
            Some(d)
        } else {
            None
        }
    });
    if let Some(d) = slot {
        *d = p.params.clone();
        true
    } else {
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tape_time_changes_remain_bounded() {
        let mut fx = DelayFx::new(44100.0);
        fx.enabled = true;
        fx.mode = 1;
        fx.mix = 0.8;
        fx.feedback = 0.8;
        fx.extra = 0.75;
        for i in 0..24000 {
            fx.time = if i < 8000 { 0.12 } else { 0.55 };
            let input = if i % 1000 == 0 { 0.9 } else { 0.0 };
            let out = fx.process(input);
            assert!(out.is_finite());
            assert!(out.abs() < 4.0);
        }
    }

    #[test]
    fn digital_passthrough_when_disabled() {
        let mut fx = DelayFx::new(44100.0);
        fx.enabled = false;
        assert_eq!(fx.process(0.5), 0.5);
    }

    #[test]
    fn bbd_stays_bounded() {
        let mut fx = DelayFx::new(44100.0);
        fx.enabled = true;
        fx.mode = 2;
        fx.mix = 0.8;
        fx.feedback = 0.7;
        fx.extra = 0.6;
        for i in 0..12000 {
            let input = if i % 2000 == 0 { 0.8 } else { 0.0 };
            let out = fx.process(input);
            assert!(out.is_finite());
            assert!(out.abs() < 4.0);
        }
    }

    #[test]
    fn stereo_stays_bounded() {
        let mut fx = DelayFx::new(44100.0);
        fx.enabled = true;
        fx.mode = 3;
        fx.mix = 0.8;
        fx.feedback = 0.7;
        fx.extra = 0.5;
        for i in 0..12000 {
            let input = if i % 2000 == 0 { 0.8 } else { 0.0 };
            let out = fx.process(input);
            assert!(out.is_finite());
            assert!(out.abs() < 4.0);
        }
    }
}
