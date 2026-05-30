use super::delay_line::DelayLine;
use crate::dsp_utils::TWO_PI;
use crate::params::{LoFiParams, ModDestination};

const CENTER_DELAY_S: f32 = 0.015;
const MAX_WOW_MOD_S: f32 = 0.008;
const MAX_FLUTTER_MOD_S: f32 = 0.002;

/// LoFi effect with multiple components: wow/flutter modulation, sample rate reduction, bit crushing, noise, crackle, saturation, and filtering.
pub struct LoFiFx {
    delay: DelayLine,
    /// Whether the effect is active or bypassed
    pub enabled: bool,
    /// Intensity of wow pitch modulation
    pub wow: f32,
    /// Intensity of flutter modulation
    pub flutter: f32,
    /// Intensity of sample rate reduction and bit crushing
    pub degrade: f32,
    // Bipolar control blending LPF (negative) and HPF (positive)
    pub filter: f32,
    /// Intensity of crackle effect (random pops and dropouts)
    pub crackle: f32,
    /// Intensity of added noise
    pub noise: f32,
    /// Intensity of saturation effect
    pub saturation: f32,
    /// Wet/dry mix
    pub mix: f32,
    flutter_phase: f32,
    lp_state: f32,
    hp_state: f32,
    hp_prev: f32,
    sr_reduction_counter: f32,
    sr_hold: f32,
    rng: u32,
    crackle_timer: f32,
    crackle_block_period: f32,
    crackle_event_phase: f32,
    crackle_event_amp: f32,
    crackle_drop_gain: f32,
    crackle_drop_target: f32,
    noise_hp: f32,
    crackle_env: f32,
    crackle_pop_phase: f32,
    sat_memory: f32,
    wow_noise: f32,
    wow_noise_target: f32,
    wow_noise_timer: f32,
    flutter_phase2: f32,
    flutter_phase3: f32,
    sample_rate: f32,
    wow_smooth: f32,
    wow_phase: f32,
}

impl LoFiFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = (0.05 * sr).round() as usize + 4;
        Self {
            delay: DelayLine::new(buf_len),
            enabled: false,
            wow: 0.3,
            flutter: 0.3,
            degrade: 0.2,
            filter: 0.0,
            crackle: 0.0,
            noise: 0.0,
            saturation: 0.0,
            mix: 1.0,
            flutter_phase: 0.23,
            lp_state: 0.0,
            hp_state: 0.0,
            hp_prev: 0.0,
            sr_reduction_counter: 0.0,
            sr_hold: 0.0,
            rng: 12345,
            crackle_timer: 0.0,
            crackle_block_period: 0.05,
            crackle_event_phase: 0.0,
            crackle_event_amp: 0.0,
            crackle_drop_gain: 1.0,
            crackle_drop_target: 1.0,
            noise_hp: 0.0,
            crackle_env: 0.0,
            crackle_pop_phase: 0.0,
            sat_memory: 0.0,
            wow_noise: 0.0,
            wow_noise_target: 0.0,
            wow_noise_timer: 0.0,
            flutter_phase2: 0.47,
            flutter_phase3: 0.89,
            wow_smooth: 1.0 - (-4.0 / sr).exp(),
            wow_phase: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let inv_sr = 1.0 / self.sample_rate;
        let wow_intensity = self.wow.clamp(0.0, 1.0);
        let flutter_intensity = self.flutter.clamp(0.0, 1.0);
        let crackle_intensity = self.crackle.clamp(0.0, 1.0);
        let noise_intensity = self.noise.clamp(0.0, 1.0);
        let degrade_intensity = self.degrade.clamp(0.0, 1.0);
        let sat_intensity = self.saturation.clamp(0.0, 1.0);
        let filter_bipolar = self.filter.clamp(-1.0, 1.0);

        let wow_mod = self.process_wow(wow_intensity, inv_sr);
        let flutter_mod = self.process_flutter(flutter_intensity, inv_sr);
        let crackle_snag = self.process_crackle_pre(crackle_intensity, inv_sr);

        let warbled = self.process_delay_mod(sample, wow_mod, flutter_mod, crackle_snag);

        let mut degraded = self.process_degrade(warbled, degrade_intensity);

        self.process_envelope(degraded, crackle_intensity, noise_intensity);
        self.process_crackle_post(&mut degraded, crackle_intensity, inv_sr);
        self.process_noise(&mut degraded, noise_intensity);
        self.process_saturation(&mut degraded, sat_intensity);

        let wet = self.process_filter(degraded, filter_bipolar, inv_sr);
        Self::process_mix(sample, wet, self.mix)
    }

    fn process_wow(&mut self, intensity: f32, inv_sr: f32) -> f32 {
        self.wow_noise_timer -= inv_sr;
        if self.wow_noise_timer <= 0.0 {
            let interval = 0.6 + lcg_rand(&mut self.rng) * 1.2;
            self.wow_noise_timer = interval;
            self.wow_noise_target = lcg_rand(&mut self.rng) * 2.0 - 1.0;
        }
        self.wow_noise += (self.wow_noise_target - self.wow_noise) * self.wow_smooth;

        let base_rate = 0.5 + intensity * 2.5;
        let current_wow_rate = (base_rate + self.wow_noise * 0.4 * base_rate).max(0.1);

        self.wow_phase += current_wow_rate * inv_sr;
        self.wow_phase -= self.wow_phase.floor();

        (self.wow_phase * TWO_PI).sin() * intensity * MAX_WOW_MOD_S
    }

    fn process_flutter(&mut self, intensity: f32, inv_sr: f32) -> f32 {
        let flutter_rate = 3.0 + intensity * 9.0;

        self.flutter_phase += flutter_rate * inv_sr;
        self.flutter_phase2 += flutter_rate * 1.73 * inv_sr;
        self.flutter_phase3 += flutter_rate * 0.47 * inv_sr;

        self.flutter_phase -= self.flutter_phase.floor();
        self.flutter_phase2 -= self.flutter_phase2.floor();
        self.flutter_phase3 -= self.flutter_phase3.floor();

        let f1 = (self.flutter_phase * TWO_PI).sin();
        let f2 = (self.flutter_phase2 * TWO_PI + 1.2).sin();
        let f3 = (self.flutter_phase3 * TWO_PI + 2.8).sin();
        let flutter_lfo = f1 * 0.5 + f2 * 0.3 + f3 * 0.2;

        flutter_lfo * intensity * MAX_FLUTTER_MOD_S
    }

    fn process_crackle_pre(&mut self, intensity: f32, inv_sr: f32) -> f32 {
        if intensity <= 0.0 {
            return 0.0;
        }

        self.crackle_timer += inv_sr;
        if self.crackle_timer >= self.crackle_block_period {
            let mean_period = 0.02 + intensity * 0.06;
            self.crackle_block_period = mean_period * (0.5 + lcg_rand(&mut self.rng) * 1.0);
            self.crackle_timer -= self.crackle_block_period;

            let drop = lcg_rand(&mut self.rng) * intensity * 0.8;
            self.crackle_drop_target = 1.0 - drop;

            if lcg_rand(&mut self.rng) < 0.15 * intensity {
                self.crackle_event_amp = 0.2 + lcg_rand(&mut self.rng) * 0.8;
                self.crackle_event_phase = 1.0;
            } else {
                self.crackle_event_phase = 0.0;
            }

            if lcg_rand(&mut self.rng) < 0.02 * intensity {
                self.crackle_pop_phase = 1.0;
            }
        }

        if self.crackle_event_phase > 0.0 {
            self.crackle_event_phase -= inv_sr * 20.0;
            let p = (1.0 - self.crackle_event_phase * 2.0).clamp(0.0, 1.0);
            self.crackle_event_amp * p * intensity * 0.003
        } else {
            0.0
        }
    }

    fn process_delay_mod(
        &mut self,
        input: f32,
        wow_mod: f32,
        flutter_mod: f32,
        crackle_snag: f32,
    ) -> f32 {
        let mod_seconds = CENTER_DELAY_S + wow_mod + flutter_mod + crackle_snag;
        let delay_samples = (mod_seconds * self.sample_rate).max(1.0);
        let warbled = self.delay.read_at_fractional(delay_samples);
        self.delay.write(input);
        warbled
    }

    fn process_degrade(&mut self, input: f32, intensity: f32) -> f32 {
        let sr_reduction = 1.0 + intensity * intensity * 63.0;
        self.sr_reduction_counter += 1.0;
        if self.sr_reduction_counter >= sr_reduction {
            self.sr_reduction_counter -= sr_reduction;
            self.sr_hold = input;
        }
        let mut degraded = self.sr_hold;
        let bits = 4.0 + (1.0 - intensity) * 12.0;
        let quantize = 2.0_f32.powi(-(bits as i32));
        degraded = (degraded / quantize).round() * quantize;
        degraded
    }

    fn process_envelope(&mut self, input: f32, crackle_intensity: f32, noise_intensity: f32) {
        if crackle_intensity > 0.0 || noise_intensity > 0.0 {
            let env_in = input.abs();
            if env_in > self.crackle_env {
                self.crackle_env += 0.008 * (env_in - self.crackle_env);
            } else {
                self.crackle_env += 0.0005 * (env_in - self.crackle_env);
            }
        }
    }

    fn process_crackle_post(&mut self, signal: &mut f32, intensity: f32, inv_sr: f32) {
        if intensity <= 0.0 {
            return;
        }

        self.crackle_drop_gain += (self.crackle_drop_target - self.crackle_drop_gain) * 0.005;
        *signal *= self.crackle_drop_gain;

        if self.crackle_pop_phase > 0.0 {
            self.crackle_pop_phase -= inv_sr * 400.0;
            let p = (1.0 - self.crackle_pop_phase * 5.0).clamp(0.0, 1.0);
            let pop_amp = self.crackle_event_amp * intensity * 0.5;
            *signal += pop_amp * p * (0.5 + lcg_rand(&mut self.rng) * 0.5);
        }
    }

    fn process_noise(&mut self, signal: &mut f32, intensity: f32) {
        if intensity <= 0.0 {
            return;
        }

        let raw = (lcg_rand(&mut self.rng) * 2.0 - 1.0) * intensity * 0.04;
        self.noise_hp += (raw - self.noise_hp) * 0.25;
        let noise = raw - self.noise_hp;
        let noise_gate = (1.0 - (self.crackle_env * 3.0).min(1.0)).max(0.0);
        *signal += noise * (0.2 + noise_gate * 0.8);
    }

    fn process_saturation(&mut self, signal: &mut f32, intensity: f32) {
        if intensity <= 0.0 {
            return;
        }

        self.sat_memory += (*signal * 0.3 - self.sat_memory) * (0.1 + intensity * 0.4);
        let biased = *signal + self.sat_memory * intensity * 2.0;
        let drive = 1.0 + intensity * 3.0;
        let sat_out = (biased * drive).tanh();
        let comp = 1.0 / (1.0 + intensity * 1.2);
        *signal = (*signal * (1.0 - intensity) + sat_out * intensity) * comp;
    }

    fn process_filter(&mut self, input: f32, bipolar: f32, inv_sr: f32) -> f32 {
        if bipolar < 0.0 {
            let t = -bipolar;
            let fc = 300.0 + (1.0 - t * t) * 12000.0;
            let g = (-TWO_PI * fc * inv_sr).exp();
            self.lp_state = g * self.lp_state + (1.0 - g) * input;
            self.lp_state
        } else if bipolar > 0.0 {
            let t = bipolar;
            let fc = 20.0 + t * t * 10000.0;
            let g = (-TWO_PI * fc * inv_sr).exp();
            self.hp_state = g * (self.hp_state + input - self.hp_prev);
            self.hp_prev = input;
            self.hp_state
        } else {
            input
        }
    }

    fn process_mix(dry: f32, wet: f32, mix: f32) -> f32 {
        let mix_angle = mix.clamp(0.0, 1.0) * core::f32::consts::PI * 0.5;
        dry * (mix_angle).cos() + wet * (mix_angle).sin()
    }
}

fn lcg_rand(state: &mut u32) -> f32 {
    *state = state.wrapping_mul(1664525).wrapping_add(1013904223);
    (*state as f32) * 2.3283064e-10
}

impl LoFiFx {
    pub fn apply_modulation(&mut self, config: &LoFiParams, mod_values: &[f32]) {
        let wow = mod_values[ModDestination::LoFiWow as usize];
        if wow != 0.0 {
            self.wow = (config.wow + wow).clamp(0.0, 1.0);
        }
        let flutter = mod_values[ModDestination::LoFiFlutter as usize];
        if flutter != 0.0 {
            self.flutter = (config.flutter + flutter).clamp(0.0, 1.0);
        }
        let degrade = mod_values[ModDestination::LoFiDegrade as usize];
        if degrade != 0.0 {
            self.degrade = (config.degrade + degrade).clamp(0.0, 1.0);
        }
        let filter = mod_values[ModDestination::LoFiFilter as usize];
        if filter != 0.0 {
            self.filter = (config.filter + filter).clamp(-1.0, 1.0);
        }
        let crackle = mod_values[ModDestination::LoFiCrackle as usize];
        if crackle != 0.0 {
            self.crackle = (config.crackle + crackle).clamp(0.0, 1.0);
        }
        let noise = mod_values[ModDestination::LoFiNoise as usize];
        if noise != 0.0 {
            self.noise = (config.noise + noise).clamp(0.0, 1.0);
        }
        let saturation = mod_values[ModDestination::LoFiSaturation as usize];
        if saturation != 0.0 {
            self.saturation = (config.saturation + saturation).clamp(0.0, 1.0);
        }
        let mix = mod_values[ModDestination::LoFiMix as usize];
        if mix != 0.0 {
            self.mix = (config.mix + mix).clamp(0.0, 1.0);
        }
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

const CONTROLS: [FxControlV1; 8] = [
    FxControlV1 {
        id: "wow",
        label: "Wow",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.3),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiWow"),
    },
    FxControlV1 {
        id: "flutter",
        label: "Flutter",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.3),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiFlutter"),
    },
    FxControlV1 {
        id: "degrade",
        label: "Degrade",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.2),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiDegrade"),
    },
    FxControlV1 {
        id: "filter",
        label: "Filter",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-1.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiFilter"),
    },
    FxControlV1 {
        id: "crackle",
        label: "Crackle",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiCrackle"),
    },
    FxControlV1 {
        id: "noise",
        label: "Noise",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiNoise"),
    },
    FxControlV1 {
        id: "saturation",
        label: "Saturation",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("loFiSaturation"),
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

crate::fx_preset_entry!(pub LoFiPresetV1, LoFiParams);

pub const LOFI_PRESET_DATA: [LoFiPresetV1; 3] = [
    LoFiPresetV1 {
        id: "warpedCassette",
        label: "Warped Cassette",
        params: LoFiParams {
            enabled: true,
            degrade: 0.07,
            wow: 0.22,
            flutter: 0.06,
            filter: -0.55,
            crackle: 0.1,
            noise: 0.25,
            saturation: 0.4,
            mix: 1.0,
        },
    },
    LoFiPresetV1 {
        id: "dustyKeys",
        label: "Dusty Keys",
        params: LoFiParams {
            enabled: true,
            degrade: 0.4,
            wow: 0.2,
            flutter: 0.03,
            filter: -0.5,
            crackle: 0.1,
            noise: 0.0,
            saturation: 0.0,
            mix: 1.0,
        },
    },
    LoFiPresetV1 {
        id: "cheapSpeaker",
        label: "Cheap Speaker",
        params: LoFiParams {
            enabled: true,
            degrade: 0.11,
            wow: 0.0,
            flutter: 0.0,
            filter: 0.31,
            crackle: 0.0,
            noise: 0.08,
            saturation: 0.6,
            mix: 1.0,
        },
    },
];

pub fn lofi_preset_data() -> &'static [LoFiPresetV1] {
    &LOFI_PRESET_DATA
}

pub fn apply_lofi_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = LOFI_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::LoFi(lofi) = s {
            Some(lofi)
        } else {
            None
        }
    });
    if let Some(lofi_params) = slot {
        *lofi_params = p.params.clone();
        true
    } else {
        false
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
        fx.wow = 0.7;
        fx.flutter = 0.5;
        fx.degrade = 0.8;
        for i in 0..8000 {
            let input = if i % 64 < 32 { 0.8 } else { -0.8 };
            let out = fx.process(input);
            assert!(out.is_finite());
            assert!(out.abs() <= 1.5);
        }
    }
}
