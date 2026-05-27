// ---------------------------------------------------------------------------
use crate::params::{ModDestination, TremoloParams};

// TremoloFx — amplitude modulation (volume LFO)
// ---------------------------------------------------------------------------

pub struct TremoloFx {
    pub enabled: bool,
    pub rate: f32,    // 0.1..20 Hz
    pub depth: f32,   // 0..1
    pub waveform: u8, // 0=sine, 1=triangle, 2=square
    pub mix: f32,
    pub rate_mode: crate::params::LfoRateMode,
    pub sync_division: crate::params::LfoSyncDivision,
    pub tempo_bpm: f32,
    phase: f32,
    smoothed_gain: f32,
    sample_rate: f32,
}

impl TremoloFx {
    pub fn new(sr: f32) -> Self {
        Self {
            enabled: false,
            rate: 4.0,
            depth: 0.5,
            waveform: 0,
            mix: 1.0,
            rate_mode: crate::params::LfoRateMode::Hz,
            sync_division: crate::params::LfoSyncDivision::Quarter,
            tempo_bpm: 120.0,
            phase: 0.0,
            smoothed_gain: 1.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        let rate_hz = match self.rate_mode {
            crate::params::LfoRateMode::Hz => self.rate,
            crate::params::LfoRateMode::Sync => {
                (self.tempo_bpm.max(1.0) / 60.0) * self.sync_division.cycles_per_beat()
            }
        };
        self.phase += rate_hz / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }

        let lfo = match self.waveform {
            1 => {
                // Triangle
                let t = self.phase;
                if t < 0.5 {
                    t * 4.0 - 1.0
                } else {
                    3.0 - t * 4.0
                }
            }
            2 => {
                // Square
                if self.phase < 0.5 { 1.0 } else { -1.0 }
            }
            _ => (self.phase * core::f32::consts::PI * 2.0).sin(),
        };

        // Convert LFO [-1,1] to amplitude gain [1-depth, 1].
        // A short slew avoids hard square-wave gain steps that click at high depth.
        let target_gain = 1.0 - self.depth * (1.0 - lfo) * 0.5;
        self.smoothed_gain += (target_gain - self.smoothed_gain) * 0.02;
        let wet = sample * self.smoothed_gain;

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
        sample * (mix_angle).cos() + wet * (mix_angle).sin()
    }
}

impl TremoloFx {
    pub fn apply_modulation(&mut self, config: &TremoloParams, mod_values: &[f32]) {
        let rate = mod_values[ModDestination::TremoloRate as usize];
        if rate != 0.0 {
            self.rate = (config.rate + rate * 15.0).clamp(0.1, 20.0);
        }
        let depth = mod_values[ModDestination::TremoloDepth as usize];
        if depth != 0.0 {
            self.depth = (config.depth + depth).clamp(0.0, 1.0);
        }
        let mix = mod_values[ModDestination::TremoloMix as usize];
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
        id: "slowWave",
        label: "Slow Wave",
    },
    FxPresetOptionV1 {
        id: "fastChop",
        label: "Fast Chop",
    },
    FxPresetOptionV1 {
        id: "triPulse",
        label: "Tri Pulse",
    },
];

const WAVEFORM_OPTIONS: [FxControlOptionV1; 3] = [
    FxControlOptionV1 {
        value: 0,
        label: "Sine",
        icon_name: Some("waveSine"),
    },
    FxControlOptionV1 {
        value: 1,
        label: "Tri",
        icon_name: Some("waveTriangle"),
    },
    FxControlOptionV1 {
        value: 2,
        label: "Sq",
        icon_name: Some("waveSquare"),
    },
];

const CONTROLS: [FxControlV1; 6] = [
    FxControlV1 {
        id: "rate",
        label: "Rate",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.1),
        max: Some(20.0),
        default_f32: Some(4.0),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("tremoloRate"),
    },
    FxControlV1 {
        id: "rateMode",
        label: "Rate Mode",
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
        id: "depth",
        label: "Depth",
        kind: FxControlKindV1::Knob,
        bipolar: false,
        min: Some(0.0),
        max: Some(1.0),
        default_f32: Some(0.5),
        options: &NO_FX_CONTROL_OPTIONS,
        mod_destination_key: Some("tremoloDepth"),
    },
    FxControlV1 {
        id: "waveform",
        label: "Wave",
        kind: FxControlKindV1::ButtonGroup,
        bipolar: false,
        min: None,
        max: None,
        default_f32: Some(0.0),
        options: &WAVEFORM_OPTIONS,
        mod_destination_key: None,
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
        mod_destination_key: Some("tremoloMix"),
    },
];

pub const DEFINITION: FxDefinitionV1 = FxDefinitionV1 {
    slot_type: FxSlotType::Tremolo,
    name: "Tremolo",
    controls: &CONTROLS,
    presets: &PRESET_OPTIONS,
};

crate::fx_preset_entry!(pub TremoloPresetV1, TremoloParams);

use crate::params::{LfoRateMode, LfoSyncDivision};

pub const TREMOLO_PRESET_DATA: [TremoloPresetV1; 3] = [
    TremoloPresetV1 {
        id: "slowWave",
        label: "Slow Wave",
        params: TremoloParams {
            enabled: true,
            rate: 2.0,
            depth: 0.5,
            waveform: 0,
            mix: 1.0,
            rate_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        },
    },
    TremoloPresetV1 {
        id: "fastChop",
        label: "Fast Chop",
        params: TremoloParams {
            enabled: true,
            rate: 8.0,
            depth: 0.75,
            waveform: 2,
            mix: 1.0,
            rate_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        },
    },
    TremoloPresetV1 {
        id: "triPulse",
        label: "Tri Pulse",
        params: TremoloParams {
            enabled: true,
            rate: 5.0,
            depth: 0.6,
            waveform: 1,
            mix: 1.0,
            rate_mode: LfoRateMode::Hz,
            sync_division: LfoSyncDivision::Quarter,
        },
    },
];

pub fn tremolo_preset_data() -> &'static [TremoloPresetV1] {
    &TREMOLO_PRESET_DATA
}

pub fn apply_tremolo_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = TREMOLO_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Tremolo(tr) = s {
            Some(tr)
        } else {
            None
        }
    });
    if let Some(tr) = slot {
        *tr = p.params.clone();
        true
    } else {
        false
    }
}
