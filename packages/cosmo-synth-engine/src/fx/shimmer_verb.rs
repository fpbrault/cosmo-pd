use super::delay_line::DelayLine;
use super::reverb::FdnReverb;
use crate::dsp_utils::wrap01;
use crate::params::{ModDestination, ShimmerVerbParams};

// ---------------------------------------------------------------------------
// ShimmerVerbFx — FDN reverb with pitch-shifted feedback (octave up)
// ---------------------------------------------------------------------------

pub struct ShimmerVerbFx {
    reverb: FdnReverb,
    pitch_line: DelayLine,
    pitch_phase_a: f32,
    pitch_phase_b: f32,
    pitch_window_samples: f32,
    shimmer_lp: f32,
    pub shimmer: f32, // amount of octave-up shimmer fed back (0..1)
    pub mix: f32,
    pub space: f32,
    pub enabled: bool,
}

impl ShimmerVerbFx {
    pub fn new(sr: f32) -> Self {
        let pitch_window_samples = (0.055 * sr).max(16.0);
        let pitch_buf_len = ((0.08 * sr).round().max(pitch_window_samples + 4.0)) as usize;
        let mut reverb = FdnReverb::new(sr);
        reverb.enabled = true;
        reverb.mix = 1.0; // always wet internally; outer mix handled here
        reverb.space = 0.7;

        Self {
            reverb,
            pitch_line: DelayLine::new(pitch_buf_len),
            pitch_phase_a: 0.0,
            pitch_phase_b: 0.5,
            pitch_window_samples,
            shimmer_lp: 0.0,
            shimmer: 0.4,
            mix: 0.0,
            space: 0.7,
            enabled: false,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        let phase_step = 1.0 / self.pitch_window_samples;
        self.pitch_phase_a = wrap01(self.pitch_phase_a + phase_step);
        self.pitch_phase_b = wrap01(self.pitch_phase_b + phase_step);

        let pitched_a = self.pitch_head(self.pitch_phase_a);
        let pitched_b = self.pitch_head(self.pitch_phase_b);
        let gain_a = raised_sine_window(self.pitch_phase_a);
        let gain_b = raised_sine_window(self.pitch_phase_b);
        let gain_sum = (gain_a + gain_b).max(0.001);
        let pitched = (pitched_a * gain_a + pitched_b * gain_b) / gain_sum;
        self.pitch_line.write(sample);

        self.shimmer_lp = self.shimmer_lp * 0.82 + pitched * 0.18;

        let shimmer_amount = (self.shimmer.clamp(0.0, 1.0) * 0.62).min(0.62);
        let reverb_in = sample + self.shimmer_lp * shimmer_amount;
        self.reverb.space = self.space;
        let wet = self.reverb.process(reverb_in);

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * (mix_angle).cos() + wet * (mix_angle).sin()
    }

    fn pitch_head(&self, phase: f32) -> f32 {
        let offset = 1.0 + (1.0 - phase) * self.pitch_window_samples;
        self.pitch_line.read_at_fractional(offset)
    }
}

#[inline]
fn raised_sine_window(phase: f32) -> f32 {
    (phase * core::f32::consts::PI).sin().max(0.0)
}

impl ShimmerVerbFx {
    pub fn apply_modulation(&mut self, config: &ShimmerVerbParams, mod_values: &[f32]) {
        let shimmer = mod_values[ModDestination::ShimmerVerbShimmer as usize];
        if shimmer != 0.0 {
            self.shimmer = (config.shimmer + shimmer).clamp(0.0, 1.0);
        }
        let space = mod_values[ModDestination::ShimmerVerbSpace as usize];
        if space != 0.0 {
            self.space = (config.space + space).clamp(0.0, 1.0);
        }
        let mix = mod_values[ModDestination::ShimmerVerbMix as usize];
        if mix != 0.0 {
            self.mix = (config.mix + mix).clamp(0.0, 1.0);
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
        id: "crystalHall",
        label: "Crystal Hall",
    },
    FxPresetOptionV1 {
        id: "ethereal",
        label: "Ethereal",
    },
    FxPresetOptionV1 {
        id: "subtleShimmer",
        label: "Subtle Shimmer",
    },
];

const CONTROLS: [FxControlV1; 3] = [
    FxControlV1 {
        id: "shimmer",
        label: "Shimmer",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.4),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("shimmerVerbShimmer"),
    },
    FxControlV1 {
        id: "space",
        label: "Space",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.7),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("shimmerVerbSpace"),
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
        mod_destination_key: Some("shimmerVerbMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::ShimmerVerb,
    name: "Shimmer Verb",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

crate::fx_preset_entry!(pub ShimmerVerbPresetV1, ShimmerVerbParams);

pub const SHIMMER_VERB_PRESET_DATA: [ShimmerVerbPresetV1; 3] = [
    ShimmerVerbPresetV1 {
        id: "crystalHall",
        label: "Crystal Hall",
        params: ShimmerVerbParams {
            enabled: true,
            shimmer: 0.6,
            space: 0.8,
            mix: 0.4,
        },
    },
    ShimmerVerbPresetV1 {
        id: "ethereal",
        label: "Ethereal",
        params: ShimmerVerbParams {
            enabled: true,
            shimmer: 0.85,
            space: 0.95,
            mix: 0.55,
        },
    },
    ShimmerVerbPresetV1 {
        id: "subtleShimmer",
        label: "Subtle Shimmer",
        params: ShimmerVerbParams {
            enabled: true,
            shimmer: 0.25,
            space: 0.6,
            mix: 0.3,
        },
    },
];

pub fn shimmer_verb_preset_data() -> &'static [ShimmerVerbPresetV1] {
    &SHIMMER_VERB_PRESET_DATA
}

pub fn apply_shimmer_verb_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = SHIMMER_VERB_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::ShimmerVerb(sv) = s {
            Some(sv)
        } else {
            None
        }
    });
    if let Some(sv) = slot {
        *sv = p.params.clone();
        true
    } else {
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shimmer_stays_finite_on_impulse() {
        let mut fx = ShimmerVerbFx::new(44100.0);
        fx.enabled = true;
        fx.mix = 0.7;
        fx.shimmer = 0.9;
        for i in 0..20000 {
            let out = fx.process(if i == 0 { 1.0 } else { 0.0 });
            assert!(out.is_finite());
            assert!(out.abs() < 8.0);
        }
    }
}
