use super::delay_line::DelayLine;
use crate::params::{GrainDelayParams, ModDestination};

const GRAIN_COUNT: usize = 4;

#[derive(Clone, Copy)]
struct Grain {
    active: bool,
    age: f32,
    duration: f32,
    offset: f32,
}

impl Grain {
    const fn inactive() -> Self {
        Self {
            active: false,
            age: 0.0,
            duration: 1.0,
            offset: 1.0,
        }
    }
}

pub struct GrainDelayFx {
    delay_line: DelayLine,
    pub time: f32,
    pub feedback: f32,
    pub scatter: f32,
    pub density: f32,
    pub mix: f32,
    pub enabled: bool,
    pub time_mode: crate::params::LfoRateMode,
    pub sync_division: crate::params::LfoSyncDivision,
    pub pitch_semitones: f32,
    pub tempo_bpm: f32,
    grains: [Grain; GRAIN_COUNT],
    spawn_counter: f32,
    spawn_index: u32,
    sample_rate: f32,
}

impl GrainDelayFx {
    pub fn new(sr: f32) -> Self {
        let buf_len = (2.0 * sr).round() as usize;
        Self {
            delay_line: DelayLine::new(buf_len),
            time: 0.25,
            feedback: 0.0,
            scatter: 0.0,
            density: 0.5,
            mix: 0.0,
            enabled: false,
            time_mode: crate::params::LfoRateMode::Hz,
            sync_division: crate::params::LfoSyncDivision::Quarter,
            pitch_semitones: 0.0,
            tempo_bpm: 120.0,
            grains: [Grain::inactive(); GRAIN_COUNT],
            spawn_counter: 0.0,
            spawn_index: 0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            self.delay_line.write(sample);
            return sample;
        }

        self.spawn_counter -= 1.0;
        if self.spawn_counter <= 0.0 {
            self.spawn_grain();
            self.spawn_counter += self.spawn_interval_samples();
        }

        let mut wet = 0.0;
        let mut gain_sum = 0.0;
        for grain in &mut self.grains {
            if !grain.active {
                continue;
            }
            let phase = grain.age / grain.duration;
            if phase >= 1.0 {
                grain.active = false;
                continue;
            }
            // ECO quality mode: triangle grain window avoids per-sample sinf cost.
            let window = (1.0 - 2.0 * (phase - 0.5).abs()).max(0.0);
            let pitch_ratio = (2.0_f32).powf(self.pitch_semitones.clamp(-24.0, 24.0) / 12.0);
            let read_rate_delta = pitch_ratio - 1.0;
            let read_offset = (grain.offset - grain.age * read_rate_delta).max(1.0);
            wet += self.delay_line.read_at_fractional(read_offset) * window;
            gain_sum += window;
            grain.age += 1.0;
        }

        if gain_sum > 0.001 {
            wet /= gain_sum;
        }

        self.delay_line
            .write(sample + wet * self.feedback.clamp(0.0, 0.85));

        // ECO quality mode: linear crossfade is cheaper than equal-power trig mix.
        let mix = self.mix.clamp(0.0, 1.0);
        sample * (1.0 - mix) + wet * mix
    }

    fn spawn_grain(&mut self) {
        let density = self.density.clamp(0.0, 1.0);
        let duration = (0.12 + density * 0.16) * self.sample_rate;
        let time_seconds = match self.time_mode {
            crate::params::LfoRateMode::Hz => self.time.clamp(0.01, 1.0),
            crate::params::LfoRateMode::Sync => {
                let beats = self.sync_division.beats_per_cycle();
                ((60.0 / self.tempo_bpm.max(1.0)) * beats).clamp(0.01, 1.0)
            }
        };
        let base = (time_seconds * self.sample_rate).max(duration + 1.0);
        let scatter_width = self.scatter.clamp(0.0, 1.0) * 0.14 * self.sample_rate;
        let random = hash_signed(self.spawn_index);
        let offset = (base + random * scatter_width).max(duration + 1.0);
        let grain_index = (self.spawn_index as usize) % GRAIN_COUNT;
        self.grains[grain_index] = Grain {
            active: true,
            age: 0.0,
            duration,
            offset,
        };
        self.spawn_index = self.spawn_index.wrapping_add(1);
    }

    fn spawn_interval_samples(&self) -> f32 {
        let density = self.density.clamp(0.0, 1.0);
        ((0.1 - density * 0.05) * self.sample_rate).max(1024.0)
    }
}

fn hash_signed(index: u32) -> f32 {
    let seed = index as f32 * 12.9898 + 78.233;
    let hash = (seed).sin() * 43_758.547;
    let fract = hash - (hash).floor();
    fract * 2.0 - 1.0
}

impl GrainDelayFx {
    pub fn apply_modulation(&mut self, config: &GrainDelayParams, mod_values: &[f32]) {
        let time = mod_values[ModDestination::GrainDelayTime as usize];
        if time != 0.0 {
            self.time = (config.time + time * 2000.0).clamp(1.0, 3000.0);
        }
        let feedback = mod_values[ModDestination::GrainDelayFeedback as usize];
        if feedback != 0.0 {
            self.feedback = (config.feedback + feedback).clamp(0.0, 0.99);
        }
        let scatter = mod_values[ModDestination::GrainDelayScatter as usize];
        if scatter != 0.0 {
            self.scatter = (config.scatter + scatter).clamp(0.0, 1.0);
        }
        let density = mod_values[ModDestination::GrainDelayDensity as usize];
        if density != 0.0 {
            self.density = (config.density + density).clamp(0.0, 1.0);
        }
        let mix = mod_values[ModDestination::GrainDelayMix as usize];
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

const CONTROLS: [FxControlV1; 8] = [
    FxControlV1 {
        id: "time",
        label: "Time",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.01),
        max: Some(1.0),
        default_f32: Some(0.25),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("grainDelayTime"),
    },
    FxControlV1 {
        id: "feedback",
        label: "Feedback",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(0.85),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("grainDelayFeedback"),
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
        mod_destination_key: Some("grainDelayScatter"),
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
        mod_destination_key: Some("grainDelayDensity"),
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
        mod_destination_key: Some("grainDelayMix"),
    },
    FxControlV1 {
        id: "timeMode",
        label: "Time Mode",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "syncDivision",
        label: "Sync Division",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: None,
    },
    FxControlV1 {
        id: "pitchSemitones",
        label: "Pitch",
        kind: FxControlKindV1::Knob,
        bipolar: true,
        min: Some(-24.0),
        max: Some(24.0),
        default_f32: Some(0.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: None,
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
            gd.feedback = 0.22;
            gd.scatter = 0.32;
            gd.density = 0.58;
            gd.mix = 0.4;
            gd.time_mode = crate::params::LfoRateMode::Hz;
            gd.sync_division = crate::params::LfoSyncDivision::Quarter;
            gd.pitch_semitones = 0.0;
            true
        }
        "glitchDelay" => {
            gd.enabled = true;
            gd.time = 0.12;
            gd.feedback = 0.18;
            gd.scatter = 0.42;
            gd.density = 0.7;
            gd.mix = 0.5;
            gd.time_mode = crate::params::LfoRateMode::Hz;
            gd.sync_division = crate::params::LfoSyncDivision::Quarter;
            gd.pitch_semitones = 0.0;
            true
        }
        "shimmerEcho" => {
            gd.enabled = true;
            gd.time = 0.5;
            gd.feedback = 0.36;
            gd.scatter = 0.24;
            gd.density = 0.5;
            gd.mix = 0.35;
            gd.time_mode = crate::params::LfoRateMode::Hz;
            gd.sync_division = crate::params::LfoSyncDivision::Quarter;
            gd.pitch_semitones = 0.0;
            true
        }
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn emits_bounded_grain_output() {
        let mut fx = GrainDelayFx::new(44100.0);
        fx.enabled = true;
        fx.mix = 1.0;
        fx.time = 0.05;
        fx.feedback = 0.35;
        fx.scatter = 0.7;
        fx.density = 0.8;
        let mut energy = 0.0;
        for i in 0..12000 {
            let input = if i < 256 { 0.8 } else { 0.0 };
            let out = fx.process(input);
            assert!(out.is_finite());
            assert!(out.abs() < 2.0);
            energy += out.abs();
        }
        assert!(energy > 1.0);
    }
}
