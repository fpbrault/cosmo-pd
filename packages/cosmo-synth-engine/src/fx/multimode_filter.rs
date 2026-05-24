use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// MultimodeFilterFx — LP/HP/BP biquad with optional 4-pole cascade
// ---------------------------------------------------------------------------

#[derive(Clone, Copy)]
struct Biquad {
    b0: f32,
    b1: f32,
    b2: f32,
    a1: f32,
    a2: f32,
    z1: f32,
    z2: f32,
}

impl Biquad {
    fn new() -> Self {
        Self {
            b0: 1.0,
            b1: 0.0,
            b2: 0.0,
            a1: 0.0,
            a2: 0.0,
            z1: 0.0,
            z2: 0.0,
        }
    }

    #[inline]
    fn set_coeffs(&mut self, mode: u8, cutoff_hz: f32, q: f32, sample_rate: f32) {
        let nyquist = sample_rate * 0.5;
        let cutoff = cutoff_hz.clamp(20.0, nyquist * 0.95);
        let omega = 2.0 * core::f32::consts::PI * cutoff / sample_rate;
        let s = sinf(omega);
        let c = cosf(omega);
        let alpha = s / (2.0 * q.max(0.001));

        let (b0, b1, b2, a0, a1, a2) = match mode {
            // HP
            1 => {
                let b0 = (1.0 + c) * 0.5;
                let b1 = -(1.0 + c);
                let b2 = (1.0 + c) * 0.5;
                let a0 = 1.0 + alpha;
                let a1 = -2.0 * c;
                let a2 = 1.0 - alpha;
                (b0, b1, b2, a0, a1, a2)
            }
            // BP
            2 => {
                let b0 = alpha;
                let b1 = 0.0;
                let b2 = -alpha;
                let a0 = 1.0 + alpha;
                let a1 = -2.0 * c;
                let a2 = 1.0 - alpha;
                (b0, b1, b2, a0, a1, a2)
            }
            // LP (default)
            _ => {
                let b0 = (1.0 - c) * 0.5;
                let b1 = 1.0 - c;
                let b2 = (1.0 - c) * 0.5;
                let a0 = 1.0 + alpha;
                let a1 = -2.0 * c;
                let a2 = 1.0 - alpha;
                (b0, b1, b2, a0, a1, a2)
            }
        };

        let inv_a0 = 1.0 / a0;
        self.b0 = b0 * inv_a0;
        self.b1 = b1 * inv_a0;
        self.b2 = b2 * inv_a0;
        self.a1 = a1 * inv_a0;
        self.a2 = a2 * inv_a0;
    }

    #[inline]
    fn process(&mut self, input: f32) -> f32 {
        let out = self.b0 * input + self.z1;
        self.z1 = self.b1 * input - self.a1 * out + self.z2;
        self.z2 = self.b2 * input - self.a2 * out;
        out
    }
}

pub struct MultimodeFilterFx {
    stage_a: Biquad,
    stage_b: Biquad,
    pub enabled: bool,
    pub mode: u8,
    pub four_pole: bool,
    pub cutoff_hz: f32,
    pub resonance: f32,
    pub drive: f32,
    pub mix: f32,
    sample_rate: f32,
}

impl MultimodeFilterFx {
    pub fn new(sr: f32) -> Self {
        Self {
            stage_a: Biquad::new(),
            stage_b: Biquad::new(),
            enabled: false,
            mode: 0,
            four_pole: false,
            cutoff_hz: 1200.0,
            resonance: 0.2,
            drive: 0.0,
            mix: 1.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let q = 0.5 + self.resonance.clamp(0.0, 1.0) * 11.5;
        let mode = self.mode.min(2);
        self.stage_a
            .set_coeffs(mode, self.cutoff_hz, q, self.sample_rate);
        self.stage_b
            .set_coeffs(mode, self.cutoff_hz, q, self.sample_rate);

        let drive_gain = 1.0 + self.drive.clamp(0.0, 1.0) * 5.0;
        let driven = libm::tanhf(sample * drive_gain);

        let two_pole = self.stage_a.process(driven);
        let wet = if self.four_pole {
            self.stage_b.process(two_pole)
        } else {
            two_pole
        };

        let mix_angle = self.mix.clamp(0.0, 1.0) * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
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
        id: "warmLowPass",
        label: "Warm LP",
    },
    FxPresetOptionV1 {
        id: "tightHighPass",
        label: "Tight HP",
    },
    FxPresetOptionV1 {
        id: "vocalBandPass",
        label: "Vocal BP",
    },
];

const MODE_OPTIONS: [FxControlOptionV1; 3] = [
    FxControlOptionV1 {
        value: 0,
        label: "LP",
        icon_name: None,
    },
    FxControlOptionV1 {
        value: 1,
        label: "HP",
        icon_name: None,
    },
    FxControlOptionV1 {
        value: 2,
        label: "BP",
        icon_name: None,
    },
];

const POLE_OPTIONS: [FxControlOptionV1; 2] = [
    FxControlOptionV1 {
        value: 0,
        label: "2P",
        icon_name: None,
    },
    FxControlOptionV1 {
        value: 1,
        label: "4P",
        icon_name: None,
    },
];

const CONTROLS: [FxControlV1; 6] = [
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
        id: "poles",
        label: "Poles",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &POLE_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "cutoffHz",
        label: "Cutoff",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(20.0),
        max: Some(18_000.0),
        default_f32: Some(1200.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("multimodeFilterCutoffHz"),
    },
    FxControlV1 {
        id: "resonance",
        label: "Reso",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.2),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("multimodeFilterResonance"),
    },
    FxControlV1 {
        id: "drive",
        label: "Drive",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("multimodeFilterDrive"),
    },
    FxControlV1 {
        id: "mix",
        label: "Mix",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(1.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("multimodeFilterMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::MultimodeFilter,
    name: "Multimode Filter",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_multimode_filter_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::MultimodeFilter(filter) = s {
            Some(filter)
        } else {
            None
        }
    });
    let Some(filter) = slot else {
        return false;
    };

    match preset {
        "warmLowPass" => {
            filter.enabled = true;
            filter.mode = 0;
            filter.four_pole = true;
            filter.cutoff_hz = 1400.0;
            filter.resonance = 0.28;
            filter.drive = 0.22;
            filter.mix = 1.0;
            true
        }
        "tightHighPass" => {
            filter.enabled = true;
            filter.mode = 1;
            filter.four_pole = false;
            filter.cutoff_hz = 380.0;
            filter.resonance = 0.18;
            filter.drive = 0.08;
            filter.mix = 0.9;
            true
        }
        "vocalBandPass" => {
            filter.enabled = true;
            filter.mode = 2;
            filter.four_pole = true;
            filter.cutoff_hz = 1150.0;
            filter.resonance = 0.62;
            filter.drive = 0.18;
            filter.mix = 0.95;
            true
        }
        _ => false,
    }
}
