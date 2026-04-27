use super::delay_line::DelayLine;
use super::reverb::FdnReverb;

// ---------------------------------------------------------------------------
// ShimmerVerbFx — FDN reverb with pitch-shifted feedback (octave up)
// ---------------------------------------------------------------------------

pub struct ShimmerVerbFx {
    reverb: FdnReverb,
    pitch_line: DelayLine,
    pitch_phase: f32,
    pitch_buf_len: usize,
    pub shimmer: f32, // amount of octave-up shimmer fed back (0..1)
    pub mix: f32,
    pub space: f32,
    pub enabled: bool,
    sample_rate: f32,
}

impl ShimmerVerbFx {
    pub fn new(sr: f32) -> Self {
        // Buffer large enough for a full period of the lowest pitch-shift range (~1 octave)
        let pitch_buf_len = libm::roundf(0.05 * sr) as usize + 2;
        let mut reverb = FdnReverb::new(sr);
        reverb.enabled = true;
        reverb.mix = 1.0; // always wet internally; outer mix handled here
        reverb.space = 0.7;

        Self {
            reverb,
            pitch_line: DelayLine::new(pitch_buf_len),
            pitch_phase: 0.0,
            pitch_buf_len,
            shimmer: 0.4,
            mix: 0.0,
            space: 0.7,
            enabled: false,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        // Pitch shift up one octave using a single-crossfade read-position trick
        let buf_samples = self.pitch_buf_len;
        // Advance read phase at 2x speed for +1 octave
        self.pitch_phase += 2.0 / self.sample_rate;
        if self.pitch_phase >= 1.0 {
            self.pitch_phase -= 1.0;
        }
        let read_offset = (self.pitch_phase * buf_samples as f32).max(1.0);

        // Simple crossfade at wrap point to reduce clicks
        let xfade_width = (buf_samples as f32 * 0.1).max(1.0);
        let xfade_pos = self.pitch_phase * buf_samples as f32;
        let xfade = if xfade_pos < xfade_width {
            xfade_pos / xfade_width
        } else if xfade_pos > buf_samples as f32 - xfade_width {
            (buf_samples as f32 - xfade_pos) / xfade_width
        } else {
            1.0
        };

        let pitched = self.pitch_line.read_at_fractional(read_offset) * xfade;
        self.pitch_line.write(sample);

        // Feed shimmer back into reverb input
        let reverb_in = sample + pitched * self.shimmer;
        self.reverb.space = self.space;
        let wet = self.reverb.process(reverb_in);

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * libm::cosf(mix_angle) + wet * libm::sinf(mix_angle)
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
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::ShimmerVerb,
    name: "Shimmer Verb",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_shimmer_verb_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::ShimmerVerb(sv) = s {
            Some(sv)
        } else {
            None
        }
    });
    let Some(sv) = slot else {
        return false;
    };
    match preset {
        "crystalHall" => {
            sv.enabled = true;
            sv.shimmer = 0.6;
            sv.space = 0.8;
            sv.mix = 0.4;
            true
        }
        "ethereal" => {
            sv.enabled = true;
            sv.shimmer = 0.85;
            sv.space = 0.95;
            sv.mix = 0.55;
            true
        }
        "subtleShimmer" => {
            sv.enabled = true;
            sv.shimmer = 0.25;
            sv.space = 0.6;
            sv.mix = 0.3;
            true
        }
        _ => false,
    }
}
