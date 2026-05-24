use serde::Serialize;
#[cfg(feature = "specta-bindings")]
use specta::Type;

use crate::{
    fx::{
        FxPresetOptionV1, auto_wah::apply_auto_wah_preset, bitcrusher::apply_bitcrusher_preset,
        chorus::apply_chorus_preset, compressor::apply_compressor_preset,
        delay::apply_delay_preset, distortion::apply_distortion_preset, eq::apply_eq_preset,
        flanger::apply_flanger_preset, grain_delay::apply_grain_delay_preset,
        juno_chorus::apply_juno_chorus_preset, lofi::apply_lofi_preset,
        multimode_filter::apply_multimode_filter_preset, phase_mod::apply_phase_mod_preset,
        phaser::apply_phaser_preset, reverb::apply_reverb_preset, ring_mod::apply_ring_mod_preset,
        rotary_speaker::apply_rotary_speaker_preset, shimmer_verb::apply_shimmer_verb_preset,
        stereo_widener::apply_stereo_widener_preset, tremolo::apply_tremolo_preset,
        vibrato::apply_vibrato_preset, wavefolder::apply_wavefolder_preset,
    },
    params::{LfoWaveform, SynthParams},
};

#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModulePresetGroupV1 {
    pub module: &'static str,
    pub presets: &'static [FxPresetOptionV1],
}

const LFO_PRESET_OPTIONS_V1: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "slowSine",
        label: "Slow Sine",
    },
    FxPresetOptionV1 {
        id: "tempoTri",
        label: "Tempo Tri",
    },
    FxPresetOptionV1 {
        id: "randomDrift",
        label: "Random Drift",
    },
];

const MOD_ENV_PRESET_OPTIONS_V1: [FxPresetOptionV1; 3] = [
    FxPresetOptionV1 {
        id: "pluck",
        label: "Pluck",
    },
    FxPresetOptionV1 {
        id: "pad",
        label: "Pad",
    },
    FxPresetOptionV1 {
        id: "reverseSwell",
        label: "Reverse Swell",
    },
];

const MODULE_PRESET_CATALOG_V1: [ModulePresetGroupV1; 25] = [
    ModulePresetGroupV1 {
        module: "chorus",
        presets: crate::fx::chorus::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "delay",
        presets: crate::fx::delay::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "reverb",
        presets: crate::fx::reverb::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "phaser",
        presets: crate::fx::phaser::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "vibrato",
        presets: crate::fx::vibrato::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "phaseMod",
        presets: crate::fx::phase_mod::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "lfo1",
        presets: &LFO_PRESET_OPTIONS_V1,
    },
    ModulePresetGroupV1 {
        module: "lfo2",
        presets: &LFO_PRESET_OPTIONS_V1,
    },
    ModulePresetGroupV1 {
        module: "modEnv",
        presets: &MOD_ENV_PRESET_OPTIONS_V1,
    },
    ModulePresetGroupV1 {
        module: "compressor",
        presets: crate::fx::compressor::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "eq",
        presets: crate::fx::eq::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "grainDelay",
        presets: crate::fx::grain_delay::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "bitcrusher",
        presets: crate::fx::bitcrusher::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "shimmerVerb",
        presets: crate::fx::shimmer_verb::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "distortion",
        presets: crate::fx::distortion::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "junoChorus",
        presets: crate::fx::juno_chorus::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "ringMod",
        presets: crate::fx::ring_mod::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "tremolo",
        presets: crate::fx::tremolo::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "wavefolder",
        presets: crate::fx::wavefolder::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "loFi",
        presets: crate::fx::lofi::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "multimodeFilter",
        presets: crate::fx::multimode_filter::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "flanger",
        presets: crate::fx::flanger::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "rotarySpeaker",
        presets: crate::fx::rotary_speaker::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "autoWah",
        presets: crate::fx::auto_wah::DEFINITION.presets,
    },
    ModulePresetGroupV1 {
        module: "stereoWidener",
        presets: crate::fx::stereo_widener::DEFINITION.presets,
    },
];

pub fn module_preset_catalog_v1() -> &'static [ModulePresetGroupV1] {
    &MODULE_PRESET_CATALOG_V1
}

pub fn apply_module_preset(params: &mut SynthParams, module: &str, preset: &str) -> bool {
    match module {
        "chorus" => apply_chorus_preset(params, preset),
        "delay" => apply_delay_preset(params, preset),
        "reverb" => apply_reverb_preset(params, preset),
        "phaser" => apply_phaser_preset(params, preset),
        "vibrato" => apply_vibrato_preset(params, preset),
        "phaseMod" => apply_phase_mod_preset(params, preset),
        "lfo1" => apply_lfo_preset(params, preset, false),
        "lfo2" => apply_lfo_preset(params, preset, true),
        "modEnv" => apply_mod_env_preset(params, preset),
        "compressor" => apply_compressor_preset(params, preset),
        "eq" => apply_eq_preset(params, preset),
        "grainDelay" => apply_grain_delay_preset(params, preset),
        "bitcrusher" => apply_bitcrusher_preset(params, preset),
        "shimmerVerb" => apply_shimmer_verb_preset(params, preset),
        "distortion" => apply_distortion_preset(params, preset),
        "junoChorus" => apply_juno_chorus_preset(params, preset),
        "ringMod" => apply_ring_mod_preset(params, preset),
        "tremolo" => apply_tremolo_preset(params, preset),
        "wavefolder" => apply_wavefolder_preset(params, preset),
        "loFi" => apply_lofi_preset(params, preset),
        "multimodeFilter" => apply_multimode_filter_preset(params, preset),
        "flanger" => apply_flanger_preset(params, preset),
        "rotarySpeaker" => apply_rotary_speaker_preset(params, preset),
        "autoWah" => apply_auto_wah_preset(params, preset),
        "stereoWidener" => apply_stereo_widener_preset(params, preset),
        _ => false,
    }
}

fn apply_lfo_preset(params: &mut SynthParams, preset: &str, secondary: bool) -> bool {
    let lfo = if secondary {
        &mut params.lfo2
    } else {
        &mut params.lfo
    };

    match preset {
        "slowSine" => {
            lfo.waveform = LfoWaveform::Sine;
            lfo.rate = 0.6;
            lfo.depth = 1.0;
            lfo.symmetry = 0.5;
            lfo.retrigger = false;
            lfo.offset = 0.0;
            true
        }
        "tempoTri" => {
            lfo.waveform = LfoWaveform::Triangle;
            lfo.rate = 2.25;
            lfo.depth = 1.0;
            lfo.symmetry = 0.5;
            lfo.retrigger = true;
            lfo.offset = 0.0;
            true
        }
        _ => false,
    }
}

fn apply_mod_env_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "pluck" => {
            params.mod_env.attack = 0.005;
            params.mod_env.decay = 0.16;
            params.mod_env.sustain = 0.08;
            params.mod_env.release = 0.14;
            true
        }
        "pad" => {
            params.mod_env.attack = 0.7;
            params.mod_env.decay = 1.2;
            params.mod_env.sustain = 0.75;
            params.mod_env.release = 1.5;
            true
        }
        "reverseSwell" => {
            params.mod_env.attack = 1.8;
            params.mod_env.decay = 0.28;
            params.mod_env.sustain = 0.66;
            params.mod_env.release = 0.95;
            true
        }
        _ => false,
    }
}
