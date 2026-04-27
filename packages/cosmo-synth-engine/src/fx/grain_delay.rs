use libm::{cosf, sinf};

use super::delay_line::DelayLine;

// ---------------------------------------------------------------------------
// GrainDelayFx — granular delay with time scatter and density control
// ---------------------------------------------------------------------------

pub struct GrainDelayFx {
    delay_line: DelayLine,
    pub time: f32,    // base delay time in seconds (0.01..1.0)
    pub scatter: f32, // time randomization (0..1)
    pub density: f32, // grain density / playback speed variation (0..1)
    pub mix: f32,
    pub enabled: bool,
    read_offset: f32,
    scatter_phase: f32,
    sample_rate: f32,
}

impl GrainDelayFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = libm::roundf(2.0 * sr) as usize;
        Self {
            delay_line: DelayLine::new(buf_len),
            time: 0.25,
            scatter: 0.0,
            density: 0.5,
            mix: 0.0,
            enabled: false,
            read_offset: libm::roundf(0.25 * sr) as f32,
            scatter_phase: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }

        // Advance a slow LFO to modulate scatter
        let scatter_rate = 0.5 + self.density * 3.0;
        self.scatter_phase += scatter_rate / self.sample_rate;
        if self.scatter_phase >= 1.0 {
            self.scatter_phase -= 1.0;
        }
        let scatter_mod = sinf(self.scatter_phase * core::f32::consts::PI * 2.0);

        let base_samples = self.time * self.sample_rate;
        let scatter_samples = self.scatter * 0.1 * self.sample_rate * scatter_mod;
        let target_offset = (base_samples + scatter_samples).max(1.0);
        self.read_offset = self.read_offset + (target_offset - self.read_offset) * 0.005;

        let wet = self
            .delay_line
            .read_at_fractional(self.read_offset.max(1.0));
        self.delay_line.write(sample);

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * cosf(mix_angle) + wet * sinf(mix_angle)
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
        id: "cloudEcho",
        label: "Cloud Echo",
    },
    FxPresetOptionV1 {
        id: "glitchDelay",
        label: "Glitch Delay",
    },
    FxPresetOptionV1 {
        id: "shimmerEcho",
        label: "Shimmer Echo",
    },
];

const CONTROLS: [FxControlV1; 4] = [
    FxControlV1 {
        id: "time",
        label: "Time",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.01),
        max: Some(1.0),
        default_f32: Some(0.25),
        options: &NO_FX_CONTROL_OPTIONS,
    },
    FxControlV1 {
        id: "scatter",
        label: "Scatter",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
    },
    FxControlV1 {
        id: "density",
        label: "Density",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
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
    slot_type: FxSlotType::GrainDelay,
    name: "Grain Delay",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

pub fn apply_grain_delay_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::GrainDelay(gd) = s {
            Some(gd)
        } else {
            None
        }
    });
    let Some(gd) = slot else {
        return false;
    };
    match preset {
        "cloudEcho" => {
            gd.enabled = true;
            gd.time = 0.35;
            gd.scatter = 0.6;
            gd.density = 0.7;
            gd.mix = 0.4;
            true
        }
        "glitchDelay" => {
            gd.enabled = true;
            gd.time = 0.12;
            gd.scatter = 0.9;
            gd.density = 0.85;
            gd.mix = 0.5;
            true
        }
        "shimmerEcho" => {
            gd.enabled = true;
            gd.time = 0.5;
            gd.scatter = 0.35;
            gd.density = 0.5;
            gd.mix = 0.35;
            true
        }
        _ => false,
    }
}
