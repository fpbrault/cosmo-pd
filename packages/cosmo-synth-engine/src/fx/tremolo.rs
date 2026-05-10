use libm::{cosf, sinf};

// ---------------------------------------------------------------------------
// TremoloFx — amplitude modulation (volume LFO)
// ---------------------------------------------------------------------------

pub struct TremoloFx {
    pub enabled: bool,
    pub rate: f32,    // 0.1..20 Hz
    pub depth: f32,   // 0..1
    pub waveform: u8, // 0=sine, 1=triangle, 2=square
    pub mix: f32,
    phase: f32,
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
            phase: 0.0,
            sample_rate: sr,
        }
    }

    pub fn process(&mut self, sample: f32) -> f32 {
        if !self.enabled || self.mix <= 0.0 {
            return sample;
        }
        self.phase += self.rate / self.sample_rate;
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
                if self.phase < 0.5 {
                    1.0
                } else {
                    -1.0
                }
            }
            _ => sinf(self.phase * core::f32::consts::PI * 2.0),
        };

        // Convert LFO [-1,1] to amplitude gain [1-depth, 1]
        let gain = 1.0 - self.depth * (1.0 - lfo) * 0.5;
        let wet = sample * gain;

        let mix_angle = self.mix * core::f32::consts::PI * 0.5;
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

const CONTROLS: [FxControlV1; 4] = [
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

pub fn apply_tremolo_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Tremolo(tr) = s {
            Some(tr)
        } else {
            None
        }
    });
    let Some(tr) = slot else {
        return false;
    };
    match preset {
        "slowWave" => {
            tr.enabled = true;
            tr.rate = 2.0;
            tr.depth = 0.5;
            tr.waveform = 0;
            tr.mix = 1.0;
            true
        }
        "fastChop" => {
            tr.enabled = true;
            tr.rate = 8.0;
            tr.depth = 0.75;
            tr.waveform = 2;
            tr.mix = 1.0;
            true
        }
        "triPulse" => {
            tr.enabled = true;
            tr.rate = 5.0;
            tr.depth = 0.6;
            tr.waveform = 1;
            tr.mix = 1.0;
            true
        }
        _ => false,
    }
}
