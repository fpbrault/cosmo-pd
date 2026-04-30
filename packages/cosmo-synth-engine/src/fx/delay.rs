use libm::{cosf, expf, tanhf};

use super::delay_line::DelayLine;

const SMOOTH_COEFF: f32 = 0.005;
const TWO_PI: f32 = core::f32::consts::PI * 2.0;
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
    tape_filter_state: f32,
    tape_wow_phase: f32,
    tape_flutter_phase: f32,
    sample_rate: f32,
}

impl DelayFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = libm::roundf(2.0 * sr) as usize;
        Self {
            delay_line: DelayLine::new(buf_len),
            time: 0.3,
            feedback: 0.35,
            mix: 0.0,
            enabled: false,
            smooth_samples: libm::roundf(0.3 * sr),
            tape_mode: false,
            warmth: 0.5,
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
        let target_samples = self.time * self.sample_rate;
        let smooth_coeff = if self.tape_mode { 0.0009 } else { SMOOTH_COEFF };
        self.smooth_samples += (target_samples - self.smooth_samples) * smooth_coeff;
        let wow_flutter = if self.tape_mode {
            self.tape_wow_phase = wrap01(self.tape_wow_phase + 0.42 / self.sample_rate);
            self.tape_flutter_phase = wrap01(self.tape_flutter_phase + 6.2 / self.sample_rate);
            let wow = libm::sinf(self.tape_wow_phase * TWO_PI) * 0.0025 * self.sample_rate;
            let flutter = libm::sinf(self.tape_flutter_phase * TWO_PI) * 0.00045 * self.sample_rate;
            (wow + flutter) * self.warmth.clamp(0.0, 1.0)
        } else {
            0.0
        };
        let delay_samples = (self.smooth_samples + wow_flutter).max(1.0);
        let delayed = self.delay_line.read_at_fractional(delay_samples);

        let wet = if self.tape_mode {
            let fc = TAPE_BRIGHT_CUTOFF_HZ - self.warmth * TAPE_WARM_RANGE_HZ;
            let g = expf(-TWO_PI * fc / self.sample_rate);
            self.tape_filter_state = self.tape_filter_state * g + delayed * (1.0 - g);
            tanhf(self.tape_filter_state * TAPE_SATURATION_DRIVE) / TAPE_SATURATION_DRIVE
        } else {
            delayed
        };

        self.delay_line
            .write(sample + wet * self.feedback.clamp(0.0, 0.97));
        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        let dry_gain = cosf(mix_angle);
        let wet_gain = sinf_approx(mix_angle);
        sample * dry_gain + wet * wet_gain
    }
}

#[inline]
fn wrap01(value: f32) -> f32 {
    if value >= 1.0 {
        value - 1.0
    } else {
        value
    }
}

#[inline]
fn sinf_approx(x: f32) -> f32 {
    libm::sinf(x)
}

// ---------------------------------------------------------------------------
// Module definition and presets
// ---------------------------------------------------------------------------

use crate::{
    fx::{
        FxControlKindV1, FxControlOptionV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1,
        NO_FX_CONTROL_OPTIONS,
    },
    params::{FxSlotType, SynthParams},
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

const CONTROLS: [FxControlV1; 5] = [
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
    match preset {
        "digitalSlap" => {
            params.delay.enabled = true;
            params.delay.time = 0.11;
            params.delay.feedback = 0.22;
            params.delay.mix = 0.27;
            params.delay.tape_mode = false;
            params.delay.warmth = 0.2;
            true
        }
        "tapeEcho" => {
            params.delay.enabled = true;
            params.delay.time = 0.34;
            params.delay.feedback = 0.46;
            params.delay.mix = 0.35;
            params.delay.tape_mode = true;
            params.delay.warmth = 0.72;
            true
        }
        "dubFeedback" => {
            params.delay.enabled = true;
            params.delay.time = 0.52;
            params.delay.feedback = 0.68;
            params.delay.mix = 0.4;
            params.delay.tape_mode = true;
            params.delay.warmth = 0.55;
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
