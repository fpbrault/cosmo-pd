// ---------------------------------------------------------------------------
use crate::params::{DistortionParams, ModDestination};

// DistortionFx — soft/hard clipping with tone control (1-pole HP + LP)
// ---------------------------------------------------------------------------

pub struct DistortionFx {
    pub enabled: bool,
    pub mode: u8,
    pub drive: f32, // 0..1 → controls clipping amount
    pub tone: f32,  // 0..1 → 0=warm, 1=bright
    pub mix: f32,
    hp_state: f32,
    lp_state: f32,
    sample_rate: f32,
}

impl DistortionFx {
    pub fn new(sr: f32) -> Self {
        Self {
            enabled: false,
            mode: 0,
            drive: 0.5,
            tone: 0.5,
            mix: 1.0,
            hp_state: 0.0,
            lp_state: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        // High-pass to remove DC before distortion (30 Hz)
        let hp_fc = 30.0_f32;
        let hp_g = (-2.0 * core::f32::consts::PI * hp_fc / self.sample_rate).exp();
        self.hp_state = hp_g * self.hp_state + (1.0 - hp_g) * sample;
        let hp_out = sample - self.hp_state;

        let drive = self.drive.clamp(0.0, 1.0);
        let drive_gain = match self.mode {
            1 => 2.5 + drive * 28.0,
            2 => 10.0 + drive * 70.0,
            _ => 1.5 + drive * 18.0,
        };
        let driven = hp_out * drive_gain;

        let clipped = match self.mode {
            1 => hard_clip((driven * 0.75).tanh() * 1.2 + driven * 0.08),
            2 => fuzz_clip(driven),
            _ => (driven + driven.max(0.0) * 0.35).tanh(),
        };

        // Tone control: LP filter; tone=0 → cutoff=800Hz, tone=1 → cutoff=12kHz
        let tone = self.tone.clamp(0.0, 1.0);
        let lp_cutoff = match self.mode {
            2 => 650.0 + tone * 5200.0,
            1 => 900.0 + tone * 9800.0,
            _ => 700.0 + tone * 11200.0,
        };
        let lp_g = (-2.0 * core::f32::consts::PI * lp_cutoff / self.sample_rate).exp();
        self.lp_state = lp_g * self.lp_state + (1.0 - lp_g) * clipped;
        let toned = self.lp_state;

        // Compensate level
        let output_gain = match self.mode {
            2 => 0.34,
            1 => 0.52,
            _ => 0.72,
        };
        let wet = toned * output_gain;

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * (mix_angle).cos() + wet * (mix_angle).sin()
    }
}

#[inline]
fn hard_clip(value: f32) -> f32 {
    value.clamp(-1.0, 1.0)
}

#[inline]
fn fuzz_clip(value: f32) -> f32 {
    let gated = if value.abs() < 0.015 { 0.0 } else { value };
    let asymmetric = if gated >= 0.0 {
        gated * 1.25
    } else {
        gated * 0.82
    };
    hard_clip((asymmetric).tanh() * 1.35)
}

impl DistortionFx {
    pub fn apply_modulation(&mut self, config: &DistortionParams, mod_values: &[f32]) {
        let drive = mod_values[ModDestination::DistortionDrive as usize];
        if drive != 0.0 {
            self.drive = (config.drive + drive).clamp(0.0, 1.0);
        }
        let tone = mod_values[ModDestination::DistortionTone as usize];
        if tone != 0.0 {
            self.tone = (config.tone + tone).clamp(0.0, 1.0);
        }
        let mix = mod_values[ModDestination::DistortionMix as usize];
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
        id: "warmOverdrive",
        label: "Warm Overdrive",
    },
    FxPresetOptionV1 {
        id: "grittyFuzz",
        label: "Gritty Fuzz",
    },
    FxPresetOptionV1 {
        id: "bitingClip",
        label: "Biting Clip",
    },
];

const MODE_OPTIONS: [FxControlOptionV1; 3] = [
    FxControlOptionV1 {
        value: 0,
        label: "OD",
        icon_name: None,
    },
    FxControlOptionV1 {
        value: 1,
        label: "Dist",
        icon_name: None,
    },
    FxControlOptionV1 {
        value: 2,
        label: "Fuzz",
        icon_name: None,
    },
];

const CONTROLS: [FxControlV1; 4] = [
    FxControlV1 {
        id: "mode",
        label: "Type",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &MODE_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "drive",
        label: "Drive",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("distortionDrive"),
    },
    FxControlV1 {
        id: "tone",
        label: "Tone",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("distortionTone"),
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
        mod_destination_key: Some("distortionMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Distortion,
    name: "Distortion",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_distortion_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Distortion(d) = s {
            Some(d)
        } else {
            None
        }
    });
    let Some(dist) = slot else {
        return false;
    };
    match preset {
        "warmOverdrive" => {
            dist.enabled = true;
            dist.mode = 0;
            dist.drive = 0.48;
            dist.tone = 0.34;
            dist.mix = 0.9;
            true
        }
        "grittyFuzz" => {
            dist.enabled = true;
            dist.mode = 2;
            dist.drive = 0.72;
            dist.tone = 0.48;
            dist.mix = 1.0;
            true
        }
        "bitingClip" => {
            dist.enabled = true;
            dist.mode = 1;
            dist.drive = 0.88;
            dist.tone = 0.78;
            dist.mix = 1.0;
            true
        }
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn modes_are_distinct_and_bounded() {
        let mut sums = [0.0_f32; 3];
        for mode in 0..3 {
            let mut fx = DistortionFx::new(44100.0);
            fx.enabled = true;
            fx.mode = mode;
            fx.drive = 0.75;
            fx.tone = 0.7;
            fx.mix = 1.0;
            for i in 0..1024 {
                let input = (i as f32 * 0.04).sin() * 0.25;
                let out = fx.process(input);
                assert!(out.is_finite());
                assert!(out.abs() <= 1.1);
                sums[mode as usize] += out.abs();
            }
        }
        assert!((sums[0] - sums[1]).abs() > 1.0);
        assert!((sums[1] - sums[2]).abs() > 1.0);
    }
}
