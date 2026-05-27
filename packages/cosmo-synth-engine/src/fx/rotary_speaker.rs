use crate::params::{ModDestination, RotarySpeakerParams};
use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// RotarySpeakerFx — mono rotary simulation with crossover and dual amplitude
// modulation for woofer/horn motion.
// ---------------------------------------------------------------------------

struct OnePole {
    a: f32,
    z: f32,
}

impl OnePole {
    fn new() -> Self {
        Self { a: 0.0, z: 0.0 }
    }

    #[inline]
    fn set_cutoff(&mut self, cutoff_hz: f32, sample_rate: f32) {
        let cutoff = cutoff_hz.clamp(20.0, sample_rate * 0.45);
        let x = (-2.0 * core::f32::consts::PI * cutoff / sample_rate).exp();
        self.a = x;
    }

    #[inline]
    fn lowpass(&mut self, input: f32) -> f32 {
        self.z = (1.0 - self.a) * input + self.a * self.z;
        self.z
    }
}

pub struct RotarySpeakerFx {
    low_split: OnePole,
    high_split: OnePole,
    phase_low: f32,
    phase_high: f32,
    pub enabled: bool,
    pub speed: f32,
    pub depth: f32,
    pub drive: f32,
    pub mix: f32,
    sample_rate: f32,
}

impl RotarySpeakerFx {
    pub fn new(sr: f32) -> Self {
        let mut low_split = OnePole::new();
        let mut high_split = OnePole::new();
        low_split.set_cutoff(800.0, sr);
        high_split.set_cutoff(800.0, sr);

        Self {
            low_split,
            high_split,
            phase_low: 0.0,
            phase_high: 0.0,
            enabled: false,
            speed: 0.9,
            depth: 0.6,
            drive: 0.1,
            mix: 0.6,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let speed_hz = self.speed.clamp(0.1, 12.0);
        self.phase_low += speed_hz / self.sample_rate;
        self.phase_high += (speed_hz * 1.67) / self.sample_rate;
        if self.phase_low >= 1.0 {
            self.phase_low -= 1.0;
        }
        if self.phase_high >= 1.0 {
            self.phase_high -= 1.0;
        }

        let low = self.low_split.lowpass(sample);
        let low_in_high = self.high_split.lowpass(sample);
        let high = sample - low_in_high;

        let depth = self.depth.clamp(0.0, 1.0);
        let low_amp = 1.0 - depth * 0.5
            + depth * 0.5 * (sinf(self.phase_low * 2.0 * core::f32::consts::PI) * 0.5 + 0.5);
        let high_amp = 1.0 - depth * 0.6
            + depth
                * 0.6
                * (sinf(self.phase_high * 2.0 * core::f32::consts::PI + 0.75) * 0.5 + 0.5);

        let drive = 1.0 + self.drive.clamp(0.0, 1.0) * 4.0;
        let wet = libm::tanhf((low * low_amp + high * high_amp) * drive);

        let mix_angle = self.mix.clamp(0.0, 1.0) * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
    }

    pub fn apply_modulation(
        &mut self,
        config: &crate::params::RotarySpeakerParams,
        mod_values: &[f32],
    ) {
        let speed = mod_values[ModDestination::RotarySpeakerSpeed as usize];
        self.speed = (config.speed + speed).clamp(0.1, 12.0);
        let depth = mod_values[ModDestination::RotarySpeakerDepth as usize];
        self.depth = (config.depth + depth).clamp(0.0, 1.0);
        let drive = mod_values[ModDestination::RotarySpeakerDrive as usize];
        self.drive = (config.drive + drive).clamp(0.0, 1.0);
        let mix = mod_values[ModDestination::RotarySpeakerMix as usize];
        self.mix = (config.mix + mix).clamp(0.0, 1.0);
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
        id: "classicSpin",
        label: "Classic Spin",
    },
    FxPresetOptionV1 {
        id: "fastHorn",
        label: "Fast Horn",
    },
    FxPresetOptionV1 {
        id: "dirtyCab",
        label: "Dirty Cab",
    },
];

const CONTROLS: [FxControlV1; 4] = [
    FxControlV1 {
        id: "speed",
        label: "Speed",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.1),
        max: Some(12.0),
        default_f32: Some(0.9),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("rotarySpeakerSpeed"),
    },
    FxControlV1 {
        id: "depth",
        label: "Depth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.6),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("rotarySpeakerDepth"),
    },
    FxControlV1 {
        id: "drive",
        label: "Drive",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.1),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("rotarySpeakerDrive"),
    },
    FxControlV1 {
        id: "mix",
        label: "Mix",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.6),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("rotarySpeakerMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::RotarySpeaker,
    name: "Rotary Speaker",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

crate::fx_preset_entry!(pub RotarySpeakerPresetV1, RotarySpeakerParams);

pub const ROTARY_SPEAKER_PRESET_DATA: [RotarySpeakerPresetV1; 3] = [
    RotarySpeakerPresetV1 {
        id: "classicSpin",
        label: "Classic Spin",
        params: RotarySpeakerParams {
            enabled: true,
            speed: 0.9,
            depth: 0.62,
            drive: 0.08,
            mix: 0.58,
        },
    },
    RotarySpeakerPresetV1 {
        id: "fastHorn",
        label: "Fast Horn",
        params: RotarySpeakerParams {
            enabled: true,
            speed: 4.2,
            depth: 0.84,
            drive: 0.12,
            mix: 0.66,
        },
    },
    RotarySpeakerPresetV1 {
        id: "dirtyCab",
        label: "Dirty Cab",
        params: RotarySpeakerParams {
            enabled: true,
            speed: 1.8,
            depth: 0.72,
            drive: 0.48,
            mix: 0.74,
        },
    },
];

pub fn rotary_speaker_preset_data() -> &'static [RotarySpeakerPresetV1] {
    &ROTARY_SPEAKER_PRESET_DATA
}

pub fn apply_rotary_speaker_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = ROTARY_SPEAKER_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::RotarySpeaker(rs) = s {
            Some(rs)
        } else {
            None
        }
    });
    if let Some(rs) = slot {
        *rs = p.params.clone();
        true
    } else {
        false
    }
}
