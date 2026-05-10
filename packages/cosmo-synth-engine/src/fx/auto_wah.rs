use libm::{cosf, fabsf, sinf};

// ---------------------------------------------------------------------------
// AutoWahFx — envelope-following multimode wah filter
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
            1 => {
                let b0 = (1.0 + c) * 0.5;
                let b1 = -(1.0 + c);
                let b2 = (1.0 + c) * 0.5;
                let a0 = 1.0 + alpha;
                let a1 = -2.0 * c;
                let a2 = 1.0 - alpha;
                (b0, b1, b2, a0, a1, a2)
            }
            2 => {
                let b0 = alpha;
                let b1 = 0.0;
                let b2 = -alpha;
                let a0 = 1.0 + alpha;
                let a1 = -2.0 * c;
                let a2 = 1.0 - alpha;
                (b0, b1, b2, a0, a1, a2)
            }
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

pub struct AutoWahFx {
    stage: Biquad,
    envelope: f32,
    pub enabled: bool,
    pub mode: u8,
    pub sensitivity: f32,
    pub cutoff_hz: f32,
    pub resonance: f32,
    pub attack_ms: f32,
    pub release_ms: f32,
    pub mix: f32,
    sample_rate: f32,
}

impl AutoWahFx {
    pub fn new(sr: f32) -> Self {
        Self {
            stage: Biquad::new(),
            envelope: 0.0,
            enabled: false,
            mode: 2,
            sensitivity: 0.55,
            cutoff_hz: 450.0,
            resonance: 0.6,
            attack_ms: 8.0,
            release_ms: 110.0,
            mix: 0.8,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let input_level = fabsf(sample);
        let atk = (-1.0 / ((self.attack_ms.clamp(0.5, 200.0) * 0.001) * self.sample_rate)).exp();
        let rel = (-1.0 / ((self.release_ms.clamp(1.0, 1200.0) * 0.001) * self.sample_rate)).exp();
        let coeff = if input_level > self.envelope {
            atk
        } else {
            rel
        };
        self.envelope = coeff * self.envelope + (1.0 - coeff) * input_level;

        let sweep_hz = self.cutoff_hz + self.envelope * self.sensitivity.clamp(0.0, 1.0) * 9000.0;
        let q = 0.5 + self.resonance.clamp(0.0, 1.0) * 11.5;
        self.stage
            .set_coeffs(self.mode.min(2), sweep_hz, q, self.sample_rate);

        let wet = self.stage.process(sample);
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
        id: "vowelQuack",
        label: "Vowel Quack",
    },
    FxPresetOptionV1 {
        id: "funkSweep",
        label: "Funk Sweep",
    },
    FxPresetOptionV1 {
        id: "softTouch",
        label: "Soft Touch",
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

const CONTROLS: [FxControlV1; 7] = [
    FxControlV1 {
        id: "mode",
        label: "Mode",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(2.0),
        options: &MODE_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "sensitivity",
        label: "Sense",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.55),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("autoWahSensitivity"),
    },
    FxControlV1 {
        id: "cutoffHz",
        label: "Cutoff",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(40.0),
        max: Some(2500.0),
        default_f32: Some(450.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("autoWahCutoffHz"),
    },
    FxControlV1 {
        id: "resonance",
        label: "Reso",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.6),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("autoWahResonance"),
    },
    FxControlV1 {
        id: "attackMs",
        label: "Attack",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.5),
        max: Some(200.0),
        default_f32: Some(8.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("autoWahAttackMs"),
    },
    FxControlV1 {
        id: "releaseMs",
        label: "Release",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(1.0),
        max: Some(1200.0),
        default_f32: Some(110.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("autoWahReleaseMs"),
    },
    FxControlV1 {
        id: "mix",
        label: "Mix",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.8),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("autoWahMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::AutoWah,
    name: "Auto-Wah",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_auto_wah_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::AutoWah(wah) = s {
            Some(wah)
        } else {
            None
        }
    });
    let Some(wah) = slot else {
        return false;
    };

    match preset {
        "vowelQuack" => {
            wah.enabled = true;
            wah.mode = 2;
            wah.sensitivity = 0.75;
            wah.cutoff_hz = 520.0;
            wah.resonance = 0.78;
            wah.attack_ms = 6.0;
            wah.release_ms = 95.0;
            wah.mix = 0.84;
            true
        }
        "funkSweep" => {
            wah.enabled = true;
            wah.mode = 1;
            wah.sensitivity = 0.62;
            wah.cutoff_hz = 280.0;
            wah.resonance = 0.58;
            wah.attack_ms = 12.0;
            wah.release_ms = 170.0;
            wah.mix = 0.76;
            true
        }
        "softTouch" => {
            wah.enabled = true;
            wah.mode = 0;
            wah.sensitivity = 0.34;
            wah.cutoff_hz = 700.0;
            wah.resonance = 0.32;
            wah.attack_ms = 24.0;
            wah.release_ms = 240.0;
            wah.mix = 0.66;
            true
        }
        _ => false,
    }
}
