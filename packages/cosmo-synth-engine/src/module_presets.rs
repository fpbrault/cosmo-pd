use serde::Serialize;
#[cfg(feature = "specta-bindings")]
use specta::Type;

use crate::{
    fx::{
        FxPresetOptionV1, bitcrusher::apply_bitcrusher_preset, chorus::apply_chorus_preset,
        compressor::apply_compressor_preset, delay::apply_delay_preset,
        distortion::apply_distortion_preset, eq::apply_eq_preset, flanger::apply_flanger_preset,
        grain_delay::apply_grain_delay_preset, juno_chorus::apply_juno_chorus_preset,
        lofi::apply_lofi_preset, multimode_filter::apply_multimode_filter_preset,
        phase_mod::apply_phase_mod_preset, phaser::apply_phaser_preset,
        reverb::apply_reverb_preset, ring_mod::apply_ring_mod_preset,
        shimmer_verb::apply_shimmer_verb_preset, tremolo::apply_tremolo_preset,
        vibrato::apply_vibrato_preset, wavefolder::apply_wavefolder_preset,
    },
    params::{LfoParams, LfoWaveform, ModEnvMode, ModEnvParams, SynthParams},
};

#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModulePresetGroupV1 {
    pub module: &'static str,
    pub presets: &'static [FxPresetOptionV1],
}

#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct LfoPresetV1 {
    pub id: &'static str,
    pub label: &'static str,
    pub params: LfoParams,
}

#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ModEnvPresetV1 {
    pub id: &'static str,
    pub label: &'static str,
    pub params: ModEnvParams,
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

const LFO_PRESET_DATA: [LfoPresetV1; 3] = [
    LfoPresetV1 {
        id: "slowSine",
        label: "Slow Sine",
        params: LfoParams {
            waveform: LfoWaveform::Sine,
            rate: 0.6,
            depth: 1.0,
            rate_mode: crate::params::LfoRateMode::Hz,
            sync_division: crate::params::LfoSyncDivision::Quarter,
            symmetry: 0.5,
            retrigger: false,
            offset: 0.0,
        },
    },
    LfoPresetV1 {
        id: "tempoTri",
        label: "Tempo Tri",
        params: LfoParams {
            waveform: LfoWaveform::Triangle,
            rate: 2.25,
            depth: 1.0,
            rate_mode: crate::params::LfoRateMode::Hz,
            sync_division: crate::params::LfoSyncDivision::Quarter,
            symmetry: 0.5,
            retrigger: true,
            offset: 0.0,
        },
    },
    LfoPresetV1 {
        id: "randomDrift",
        label: "Random Drift",
        params: LfoParams {
            waveform: LfoWaveform::Square,
            rate: 4.0,
            depth: 0.35,
            rate_mode: crate::params::LfoRateMode::Hz,
            sync_division: crate::params::LfoSyncDivision::Quarter,
            symmetry: 0.5,
            retrigger: false,
            offset: 0.0,
        },
    },
];

const MOD_ENV_PRESET_DATA: [ModEnvPresetV1; 3] = [
    ModEnvPresetV1 {
        id: "pluck",
        label: "Pluck",
        params: ModEnvParams {
            attack: 0.005,
            decay: 0.16,
            sustain: 0.08,
            release: 0.14,
            mode: ModEnvMode::Adsr,
        },
    },
    ModEnvPresetV1 {
        id: "pad",
        label: "Pad",
        params: ModEnvParams {
            attack: 0.7,
            decay: 1.2,
            sustain: 0.75,
            release: 1.5,
            mode: ModEnvMode::Adsr,
        },
    },
    ModEnvPresetV1 {
        id: "reverseSwell",
        label: "Reverse Swell",
        params: ModEnvParams {
            attack: 1.8,
            decay: 0.28,
            sustain: 0.66,
            release: 0.95,
            mode: ModEnvMode::Adsr,
        },
    },
];

const MODULE_PRESET_CATALOG_V1: [ModulePresetGroupV1; 22] = [
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
];

pub fn lfo_preset_data() -> &'static [LfoPresetV1] {
    &LFO_PRESET_DATA
}

pub fn mod_env_preset_data() -> &'static [ModEnvPresetV1] {
    &MOD_ENV_PRESET_DATA
}

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
        _ => false,
    }
}

fn apply_lfo_preset(params: &mut SynthParams, preset: &str, secondary: bool) -> bool {
    let Some(p) = LFO_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    let lfo = if secondary {
        &mut params.lfo2
    } else {
        &mut params.lfo
    };
    lfo.waveform = p.params.waveform;
    lfo.rate = p.params.rate;
    lfo.depth = p.params.depth;
    lfo.symmetry = p.params.symmetry;
    lfo.retrigger = p.params.retrigger;
    lfo.offset = p.params.offset;
    true
}

fn apply_mod_env_preset(params: &mut SynthParams, preset: &str) -> bool {
    let Some(p) = MOD_ENV_PRESET_DATA.iter().find(|p| p.id == preset) else {
        return false;
    };
    params.mod_env = p.params.clone();
    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::FxSlotConfig;

    fn make_params_with_fx(variant: FxSlotConfig) -> SynthParams {
        let mut p = SynthParams::default();
        p.fx_slots[0] = variant;
        p
    }

    // --- LFO preset tests ---

    #[test]
    fn apply_lfo_preset_found() {
        let mut p = SynthParams::default();
        assert!(apply_lfo_preset(&mut p, "slowSine", false));
        assert_eq!(p.lfo.waveform, LfoWaveform::Sine);
        assert_eq!(p.lfo.rate, 0.6);
        assert_eq!(p.lfo.depth, 1.0);
        assert_eq!(p.lfo.symmetry, 0.5);
        assert!(!p.lfo.retrigger);
        assert_eq!(p.lfo.offset, 0.0);
    }

    #[test]
    fn apply_lfo_preset_tempo_tri() {
        let mut p = SynthParams::default();
        assert!(apply_lfo_preset(&mut p, "tempoTri", false));
        assert_eq!(p.lfo.waveform, LfoWaveform::Triangle);
        assert_eq!(p.lfo.rate, 2.25);
        assert!(p.lfo.retrigger);
    }

    #[test]
    fn apply_lfo_preset_random_drift() {
        let mut p = SynthParams::default();
        assert!(apply_lfo_preset(&mut p, "randomDrift", false));
        assert_eq!(p.lfo.waveform, LfoWaveform::Square);
        assert_eq!(p.lfo.rate, 4.0);
        assert_eq!(p.lfo.depth, 0.35);
        assert!(!p.lfo.retrigger);
    }

    #[test]
    fn apply_lfo_preset_unknown_returns_false() {
        let mut p = SynthParams::default();
        assert!(!apply_lfo_preset(&mut p, "nonExistent", false));
    }

    #[test]
    fn apply_lfo_preset_secondary_targets_lfo2() {
        let mut p = SynthParams::default();
        assert!(apply_lfo_preset(&mut p, "slowSine", true));
        assert_eq!(p.lfo2.waveform, LfoWaveform::Sine);
        assert_eq!(p.lfo2.rate, 0.6);
        assert_eq!(p.lfo2.depth, 1.0);
    }

    // --- Mod Env preset tests ---

    #[test]
    fn apply_mod_env_preset_found() {
        let mut p = SynthParams::default();
        assert!(apply_mod_env_preset(&mut p, "pluck"));
        assert_eq!(p.mod_env.attack, 0.005);
        assert_eq!(p.mod_env.decay, 0.16);
        assert_eq!(p.mod_env.sustain, 0.08);
        assert_eq!(p.mod_env.release, 0.14);
    }

    #[test]
    fn apply_mod_env_preset_pad() {
        let mut p = SynthParams::default();
        assert!(apply_mod_env_preset(&mut p, "pad"));
        assert_eq!(p.mod_env.attack, 0.7);
        assert_eq!(p.mod_env.release, 1.5);
    }

    #[test]
    fn apply_mod_env_preset_reverse_swell() {
        let mut p = SynthParams::default();
        assert!(apply_mod_env_preset(&mut p, "reverseSwell"));
        assert_eq!(p.mod_env.attack, 1.8);
        assert_eq!(p.mod_env.decay, 0.28);
    }

    #[test]
    fn apply_mod_env_preset_unknown_returns_false() {
        let mut p = SynthParams::default();
        assert!(!apply_mod_env_preset(&mut p, "nonExistent"));
    }

    // --- Dispatch tests ---

    #[test]
    fn apply_module_preset_unknown_module_returns_false() {
        let mut p = SynthParams::default();
        assert!(!apply_module_preset(&mut p, "imaginaryModule", "whatever"));
    }

    #[test]
    fn apply_module_preset_lfo1_dispatches() {
        let mut p = SynthParams::default();
        assert!(apply_module_preset(&mut p, "lfo1", "slowSine"));
        assert_eq!(p.lfo.waveform, LfoWaveform::Sine);
    }

    #[test]
    fn apply_module_preset_lfo2_dispatches() {
        let mut p = SynthParams::default();
        assert!(apply_module_preset(&mut p, "lfo2", "tempoTri"));
        assert_eq!(p.lfo2.waveform, LfoWaveform::Triangle);
    }

    #[test]
    fn apply_module_preset_mod_env_dispatches() {
        let mut p = SynthParams::default();
        assert!(apply_module_preset(&mut p, "modEnv", "pad"));
        assert_eq!(p.mod_env.attack, 0.7);
    }

    // --- FX dispatch tests ---

    #[test]
    fn apply_module_preset_chorus() {
        let mut p = make_params_with_fx(FxSlotConfig::Chorus(Default::default()));
        assert!(apply_module_preset(&mut p, "chorus", "classicWide"));
        if let FxSlotConfig::Chorus(c) = &p.fx_slots[0] {
            assert!(c.enabled);
            assert!((c.rate - 0.9).abs() < 1e-6);
        } else {
            panic!("expected Chorus variant");
        }
    }

    #[test]
    fn apply_module_preset_delay() {
        let mut p = make_params_with_fx(FxSlotConfig::Delay(Default::default()));
        assert!(apply_module_preset(&mut p, "delay", "digitalSlap"));
        if let FxSlotConfig::Delay(d) = &p.fx_slots[0] {
            assert!(d.enabled);
            assert!((d.time - 0.11).abs() < 1e-6);
        } else {
            panic!("expected Delay variant");
        }
    }

    #[test]
    fn apply_module_preset_reverb() {
        let mut p = make_params_with_fx(FxSlotConfig::Reverb(Default::default()));
        assert!(apply_module_preset(&mut p, "reverb", "smallRoom"));
        if let FxSlotConfig::Reverb(r) = &p.fx_slots[0] {
            assert!(r.enabled);
            assert!((r.mix - 0.22).abs() < 1e-6);
        } else {
            panic!("expected Reverb variant");
        }
    }

    #[test]
    fn apply_module_preset_compressor() {
        let mut p = make_params_with_fx(FxSlotConfig::Compressor(Default::default()));
        assert!(apply_module_preset(&mut p, "compressor", "punchy"));
        if let FxSlotConfig::Compressor(c) = &p.fx_slots[0] {
            assert!(c.enabled);
            assert!((c.ratio - 4.0).abs() < 1e-6);
        } else {
            panic!("expected Compressor variant");
        }
    }

    #[test]
    fn apply_module_preset_flanger() {
        let mut p = make_params_with_fx(FxSlotConfig::Flanger(Default::default()));
        assert!(apply_module_preset(&mut p, "flanger", "jetPlane"));
        if let FxSlotConfig::Flanger(f) = &p.fx_slots[0] {
            assert!(f.enabled);
            assert!((f.depth - 0.78).abs() < 1e-6);
        } else {
            panic!("expected Flanger variant");
        }
    }

    #[test]
    fn apply_module_preset_fx_for_module_without_slot_returns_false() {
        // Chorus preset but no Chorus slot
        let mut p = SynthParams::default(); // all slots Empty
        assert!(!apply_module_preset(&mut p, "chorus", "warmEnsemble"));
    }

    #[test]
    fn apply_module_preset_fx_unknown_preset_returns_false() {
        let mut p = make_params_with_fx(FxSlotConfig::Delay(Default::default()));
        assert!(!apply_module_preset(&mut p, "delay", "nonExistentPreset"));
    }
}
