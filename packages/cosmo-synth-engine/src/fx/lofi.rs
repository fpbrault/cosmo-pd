use libm::{cosf, expf, sinf, tanhf};

use super::delay_line::DelayLine;

const TWO_PI: f32 = core::f32::consts::PI * 2.0;
const CENTER_DELAY_S: f32 = 0.012;
const MAX_MOD_S: f32 = 0.010;
const MAX_WOW_FLUTTER_DEPTH: f32 = 0.20;

pub struct LoFiFx {
    delay: DelayLine,
    pub enabled: bool,
    pub degrade: f32,
    pub wow_depth: f32,
    pub wow_rate: f32,
    pub flutter_depth: f32,
    pub flutter_rate: f32,
    pub tone: f32,
    pub mix: f32,
    wobble_phase: f32,
    flutter_phase: f32,
    hp_state: f32,
    lp_state: f32,
    clean_energy: f32,
    dirty_energy: f32,
    sample_rate: f32,
}

impl LoFiFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = libm::roundf(0.05 * sr) as usize + 4;
        Self {
            delay: DelayLine::new(buf_len),
            enabled: false,
            degrade: 0.25,
            wow_depth: 0.07,
            wow_rate: 0.42,
            flutter_depth: 0.036,
            flutter_rate: 6.7,
            tone: 0.45,
            mix: 1.0,
            wobble_phase: 0.0,
            flutter_phase: 0.23,
            hp_state: 0.0,
            lp_state: 0.0,
            clean_energy: 1.0e-4,
            dirty_energy: 1.0e-4,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        self.wobble_phase =
            wrap01(self.wobble_phase + self.wow_rate.clamp(0.03, 2.5) / self.sample_rate);
        self.flutter_phase =
            wrap01(self.flutter_phase + self.flutter_rate.clamp(0.5, 18.0) / self.sample_rate);

        let wow_depth = self.wow_depth.clamp(0.0, MAX_WOW_FLUTTER_DEPTH);
        let flutter_depth = self.flutter_depth.clamp(0.0, MAX_WOW_FLUTTER_DEPTH);
        let wobble = sinf(self.wobble_phase * TWO_PI) * wow_depth;
        let flutter = sinf(self.flutter_phase * TWO_PI) * flutter_depth;
        let mod_seconds = CENTER_DELAY_S + wobble * MAX_MOD_S + flutter * MAX_MOD_S * 0.18;
        let delay_samples = (mod_seconds * self.sample_rate).max(1.0);

        let warbled = self.delay.read_at_fractional(delay_samples);
        self.delay.write(sample);

        let clean = warbled;
        let shaped = self.tone_shape(warbled);
        let degrade = self.degrade.clamp(0.0, 1.0);
        let wow_norm = wow_depth / MAX_WOW_FLUTTER_DEPTH;
        let flutter_norm = flutter_depth / MAX_WOW_FLUTTER_DEPTH;
        let phase_mod =
            self.wobble_phase * TWO_PI * 0.37 + self.flutter_phase * TWO_PI * flutter_norm;
        let dropout = 1.0 + 0.14 * degrade * sinf(phase_mod) * wow_norm.max(flutter_norm);
        let drive_gain = 1.0 + degrade * 12.0;
        let dirty_raw = tanhf(shaped * dropout * drive_gain);

        // Keep perceived level stable as dirt rises by matching the dirt branch
        // energy to the clean branch with a slow envelope follower.
        self.clean_energy = 0.999 * self.clean_energy + 0.001 * clean * clean;
        self.dirty_energy = 0.999 * self.dirty_energy + 0.001 * dirty_raw * dirty_raw;
        let level_match = (self.clean_energy / self.dirty_energy.max(1.0e-6))
            .sqrt()
            .clamp(0.5, 2.0);
        let dirty = dirty_raw * level_match;
        let saturated = clean * (1.0 - degrade) + dirty * degrade;

        let mix_angle = self.mix.clamp(0.0, 1.0) * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + saturated * sinf(mix_angle)
    }

    fn tone_shape(&mut self, sample: f32) -> f32 {
        let tone = self.tone.clamp(0.0, 1.0);
        let hp_fc = 18.0 + tone * 620.0;
        let hp_g = expf(-TWO_PI * hp_fc / self.sample_rate);
        self.hp_state = hp_g * self.hp_state + (1.0 - hp_g) * sample;
        let high_passed = sample - self.hp_state;

        let lp_fc = 380.0 + tone * tone * 17500.0;
        let lp_g = expf(-TWO_PI * lp_fc / self.sample_rate);
        self.lp_state = lp_g * self.lp_state + (1.0 - lp_g) * high_passed;
        self.lp_state
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

use crate::{
    fx::{FxControlKindV1, FxControlV1, FxDefinitionV1, FxPresetOptionV1, NO_FX_CONTROL_OPTIONS},
    params::{FxSlotConfig, FxSlotType, SynthParams},
};

const PRESET_OPTIONS: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "warpedCassette",
        label: "Warped Cassette",
    },
    FxPresetOptionV1 {
        id: "dustyKeys",
        label: "Dusty Keys",
    },
    FxPresetOptionV1 {
        id: "cheapSpeaker",
        label: "Cheap Speaker",
    },
];

const CONTROLS: [FxControlV1; 7] = [
    FxControlV1 {
        id: "degrade",
        label: "Degrade",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.25),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiDegrade"),
    },
    FxControlV1 {
        id: "wowDepth",
        label: "Wow Depth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(0.2),
        default_f32: Some(0.07),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiWowDepth"),
    },
    FxControlV1 {
        id: "wowRate",
        label: "Wow Rate",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.03),
        max: Some(2.5),
        default_f32: Some(0.42),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiWowRate"),
    },
    FxControlV1 {
        id: "flutterDepth",
        label: "Flutter Depth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(0.2),
        default_f32: Some(0.036),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiFlutterDepth"),
    },
    FxControlV1 {
        id: "flutterRate",
        label: "Flutter Rate",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.5),
        max: Some(18.0),
        default_f32: Some(6.7),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiFlutterRate"),
    },
    FxControlV1 {
        id: "tone",
        label: "Tone",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.45),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiTone"),
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
        mod_destination_key: Some("loFiMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::LoFi,
    name: "LoFi",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_lofi_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::LoFi(lofi) = s {
            Some(lofi)
        } else {
            None
        }
    });
    let Some(lofi) = slot else {
        return false;
    };
    match preset {
        "warpedCassette" => {
            lofi.enabled = true;
            lofi.degrade = 0.32;
            lofi.wow_depth = 0.13;
            lofi.wow_rate = 0.32;
            lofi.flutter_depth = 0.056;
            lofi.flutter_rate = 7.4;
            lofi.tone = 0.38;
            lofi.mix = 1.0;
            true
        }
        "dustyKeys" => {
            lofi.enabled = true;
            lofi.degrade = 0.22;
            lofi.wow_depth = 0.056;
            lofi.wow_rate = 0.5;
            lofi.flutter_depth = 0.032;
            lofi.flutter_rate = 5.9;
            lofi.tone = 0.42;
            lofi.mix = 1.0;
            true
        }
        "cheapSpeaker" => {
            lofi.enabled = true;
            lofi.degrade = 0.55;
            lofi.wow_depth = 0.036;
            lofi.wow_rate = 0.78;
            lofi.flutter_depth = 0.044;
            lofi.flutter_rate = 9.2;
            lofi.tone = 0.12;
            lofi.mix = 1.0;
            true
        }
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bypass_returns_input() {
        let mut fx = LoFiFx::new(44100.0);
        assert_eq!(fx.process(0.25), 0.25);
    }

    #[test]
    fn enabled_output_stays_bounded() {
        let mut fx = LoFiFx::new(44100.0);
        fx.enabled = true;
        fx.mix = 1.0;
        fx.wow_depth = 0.7;
        fx.flutter_depth = 0.5;
        fx.degrade = 0.8;
        for i in 0..8000 {
            let input = if i % 64 < 32 { 0.8 } else { -0.8 };
            let out = fx.process(input);
            assert!(out.is_finite());
            assert!(out.abs() <= 1.2);
        }
    }
}
