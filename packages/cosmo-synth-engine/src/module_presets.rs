use crate::params::{FxSlotConfig, LfoWaveform, SynthParams};
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
        _ => false,
    }
}

fn apply_chorus_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "classicWide" => {
            params.chorus.enabled = true;
            params.chorus.rate = 0.9;
            params.chorus.depth = 1.2;
            params.chorus.mix = 0.38;
            true
        }
        "slowShimmer" => {
            params.chorus.enabled = true;
            params.chorus.rate = 0.35;
            params.chorus.depth = 2.1;
            params.chorus.mix = 0.44;
            true
        }
        "ensembleThick" => {
            params.chorus.enabled = true;
            params.chorus.rate = 1.8;
            params.chorus.depth = 2.6;
            params.chorus.mix = 0.56;
            true
        }
        _ => false,
    }
}

fn apply_delay_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "digitalSlap" => {
            params.delay.enabled = true;
            params.delay.time = 0.11;
            params.delay.feedback = 0.22;
            params.delay.mix = 0.27;
            params.delay.tape_mode = false;
            params.delay.warmth = 0.2;
            true
        }
        "tapeEcho" => {
            params.delay.enabled = true;
            params.delay.time = 0.34;
            params.delay.feedback = 0.46;
            params.delay.mix = 0.35;
            params.delay.tape_mode = true;
            params.delay.warmth = 0.72;
            true
        }
        "dubFeedback" => {
            params.delay.enabled = true;
            params.delay.time = 0.52;
            params.delay.feedback = 0.68;
            params.delay.mix = 0.4;
            params.delay.tape_mode = true;
            params.delay.warmth = 0.55;
            true
        }
        _ => false,
    }
}

fn apply_reverb_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "smallRoom" => {
            params.reverb.enabled = true;
            params.reverb.mix = 0.22;
            params.reverb.space = 0.32;
            params.reverb.predelay = 0.006;
            params.reverb.distance = 0.28;
            params.reverb.character = 0.45;
            true
        }
        "plateAir" => {
            params.reverb.enabled = true;
            params.reverb.mix = 0.31;
            params.reverb.space = 0.58;
            params.reverb.predelay = 0.012;
            params.reverb.distance = 0.4;
            params.reverb.character = 0.74;
            true
        }
        "cathedral" => {
            params.reverb.enabled = true;
            params.reverb.mix = 0.47;
            params.reverb.space = 0.9;
            params.reverb.predelay = 0.03;
            params.reverb.distance = 0.68;
            params.reverb.character = 0.66;
            true
        }
        _ => false,
    }
}

fn apply_phaser_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "gentleSweep" => {
            params.phaser.enabled = true;
            params.phaser.rate = 0.35;
            params.phaser.depth = 0.45;
            params.phaser.feedback = 0.2;
            params.phaser.mix = 0.25;
            true
        }
        "jetWash" => {
            params.phaser.enabled = true;
            params.phaser.rate = 0.9;
            params.phaser.depth = 0.78;
            params.phaser.feedback = 0.55;
            params.phaser.mix = 0.43;
            true
        }
        "wideNotch" => {
            params.phaser.enabled = true;
            params.phaser.rate = 0.18;
            params.phaser.depth = 1.0;
            params.phaser.feedback = 0.72;
            params.phaser.mix = 0.52;
            true
        }
        _ => false,
    }
}

fn apply_vibrato_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "subtle" => {
            params.vibrato.enabled = true;
            params.vibrato.waveform = 1;
            params.vibrato.rate = 20.0;
            params.vibrato.depth = 6.0;
            params.vibrato.delay = 160.0;
            true
        }
        "chorused" => {
            params.vibrato.enabled = true;
            params.vibrato.waveform = 2;
            params.vibrato.rate = 38.0;
            params.vibrato.depth = 14.0;
            params.vibrato.delay = 80.0;
            true
        }
        "warble" => {
            params.vibrato.enabled = true;
            params.vibrato.waveform = 4;
            params.vibrato.rate = 62.0;
            params.vibrato.depth = 26.0;
            params.vibrato.delay = 20.0;
            true
        }
        _ => false,
    }
}

fn apply_phase_mod_preset(params: &mut SynthParams, preset: &str) -> bool {
    match preset {
        "glassBell" => {
            params.int_pm_enabled = true;
            params.pm_pre = true;
            params.int_pm_amount = 0.06;
            params.int_pm_ratio = 2.0;
            true
        }
        "metalFold" => {
            params.int_pm_enabled = true;
            params.pm_pre = true;
            params.int_pm_amount = 0.11;
            params.int_pm_ratio = 2.7;
            true
        }
        "aggressiveSync" => {
            params.int_pm_enabled = true;
            params.pm_pre = false;
            params.int_pm_amount = 0.18;
            params.int_pm_ratio = 3.4;
            true
        }
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
            lfo.depth = 0.23;
            lfo.symmetry = 0.5;
            lfo.retrigger = false;
            lfo.offset = 0.0;
            true
        }
        "tempoTri" => {
            lfo.waveform = LfoWaveform::Triangle;
            lfo.rate = 2.25;
            lfo.depth = 0.48;
            lfo.symmetry = 0.5;
            lfo.retrigger = true;
            lfo.offset = 0.0;
            true
        }
        "randomDrift" => {
            lfo.waveform = LfoWaveform::Random;
            lfo.rate = 4.4;
            lfo.depth = 0.36;
            lfo.symmetry = 0.5;
            lfo.retrigger = false;
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

fn apply_compressor_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Compressor(c) = s {
            Some(c)
        } else {
            None
        }
    });
    let Some(c) = slot else {
        return false;
    };
    match preset {
        "gentle" => {
            c.enabled = true;
            c.threshold_db = -18.0;
            c.ratio = 2.0;
            c.attack_ms = 10.0;
            c.release_ms = 150.0;
            c.makeup_db = 3.0;
            c.mix = 1.0;
            true
        }
        "punchy" => {
            c.enabled = true;
            c.threshold_db = -12.0;
            c.ratio = 4.0;
            c.attack_ms = 5.0;
            c.release_ms = 80.0;
            c.makeup_db = 6.0;
            c.mix = 1.0;
            true
        }
        "limiter" => {
            c.enabled = true;
            c.threshold_db = -6.0;
            c.ratio = 20.0;
            c.attack_ms = 1.0;
            c.release_ms = 200.0;
            c.makeup_db = 2.0;
            c.mix = 1.0;
            true
        }
        _ => false,
    }
}

fn apply_eq_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Eq5Band(eq) = s {
            Some(eq)
        } else {
            None
        }
    });
    let Some(eq) = slot else {
        return false;
    };
    match preset {
        "bassBoost" => {
            eq.enabled = true;
            eq.gain80 = 6.0;
            eq.gain240 = 3.0;
            eq.gain750 = 0.0;
            eq.gain2200 = -1.0;
            eq.gain8000 = -2.0;
            true
        }
        "presence" => {
            eq.enabled = true;
            eq.gain80 = 0.0;
            eq.gain240 = -2.0;
            eq.gain750 = 0.0;
            eq.gain2200 = 5.0;
            eq.gain8000 = 3.0;
            true
        }
        "warmth" => {
            eq.enabled = true;
            eq.gain80 = 3.0;
            eq.gain240 = 4.0;
            eq.gain750 = 1.0;
            eq.gain2200 = -3.0;
            eq.gain8000 = -5.0;
            true
        }
        _ => false,
    }
}

fn apply_bitcrusher_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Bitcrusher(bc) = s {
            Some(bc)
        } else {
            None
        }
    });
    let Some(bc) = slot else {
        return false;
    };
    match preset {
        "retroGame" => {
            bc.enabled = true;
            bc.bits = 8.0;
            bc.rate_reduction = 4.0;
            bc.mix = 1.0;
            true
        }
        "grunge" => {
            bc.enabled = true;
            bc.bits = 4.0;
            bc.rate_reduction = 2.0;
            bc.mix = 0.8;
            true
        }
        "subtle" => {
            bc.enabled = true;
            bc.bits = 12.0;
            bc.rate_reduction = 1.5;
            bc.mix = 0.6;
            true
        }
        _ => false,
    }
}

fn apply_grain_delay_preset(params: &mut SynthParams, preset: &str) -> bool {
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

fn apply_shimmer_verb_preset(params: &mut SynthParams, preset: &str) -> bool {
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

fn apply_distortion_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Distortion(d) = s {
            Some(d)
        } else {
            None
        }
    });
    let Some(dist) = slot else {
        return false;
    };
    match preset {
        "warmOverdrive" => {
            dist.enabled = true;
            dist.drive = 0.35;
            dist.tone = 0.3;
            dist.mix = 0.9;
            true
        }
        "grittyFuzz" => {
            dist.enabled = true;
            dist.drive = 0.75;
            dist.tone = 0.6;
            dist.mix = 1.0;
            true
        }
        "bitingClip" => {
            dist.enabled = true;
            dist.drive = 0.9;
            dist.tone = 0.8;
            dist.mix = 1.0;
            true
        }
        _ => false,
    }
}

fn apply_juno_chorus_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::JunoChorus(jc) = s {
            Some(jc)
        } else {
            None
        }
    });
    let Some(jc) = slot else {
        return false;
    };
    match preset {
        "junoI" => {
            jc.enabled = true;
            jc.mode = 0;
            jc.mix = 0.5;
            true
        }
        "junoII" => {
            jc.enabled = true;
            jc.mode = 1;
            jc.mix = 0.55;
            true
        }
        "junoFull" => {
            jc.enabled = true;
            jc.mode = 2;
            jc.mix = 0.6;
            true
        }
        _ => false,
    }
}

fn apply_ring_mod_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::RingMod(rm) = s {
            Some(rm)
        } else {
            None
        }
    });
    let Some(rm) = slot else {
        return false;
    };
    match preset {
        "metallic" => {
            rm.enabled = true;
            rm.carrier_hz = 220.0;
            rm.mix = 0.7;
            true
        }
        "bell" => {
            rm.enabled = true;
            rm.carrier_hz = 523.0;
            rm.mix = 0.5;
            true
        }
        "alien" => {
            rm.enabled = true;
            rm.carrier_hz = 1337.0;
            rm.mix = 0.85;
            true
        }
        _ => false,
    }
}

fn apply_tremolo_preset(params: &mut SynthParams, preset: &str) -> bool {
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

fn apply_wavefolder_preset(params: &mut SynthParams, preset: &str) -> bool {
    let slot = params.fx_slots.iter_mut().find_map(|s| {
        if let FxSlotConfig::Wavefolder(wf) = s {
            Some(wf)
        } else {
            None
        }
    });
    let Some(wf) = slot else {
        return false;
    };
    match preset {
        "gentle" => {
            wf.enabled = true;
            wf.drive = 0.3;
            wf.folds = 0.3;
            wf.mix = 0.8;
            true
        }
        "aggressive" => {
            wf.enabled = true;
            wf.drive = 0.75;
            wf.folds = 0.7;
            wf.mix = 1.0;
            true
        }
        "harmonic" => {
            wf.enabled = true;
            wf.drive = 0.5;
            wf.folds = 0.5;
            wf.mix = 0.9;
            true
        }
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn applies_known_presets() {
        let mut params = SynthParams::default();

        assert!(apply_module_preset(&mut params, "chorus", "classicWide"));
        assert!(params.chorus.enabled);

        assert!(apply_module_preset(&mut params, "delay", "tapeEcho"));
        assert!(params.delay.tape_mode);

        assert!(apply_module_preset(&mut params, "reverb", "cathedral"));
        assert!(params.reverb.mix > 0.4);

        assert!(apply_module_preset(&mut params, "phaser", "wideNotch"));
        assert!(params.phaser.depth > 0.9);

        assert!(apply_module_preset(&mut params, "vibrato", "warble"));
        assert_eq!(params.vibrato.waveform, 4);

        assert!(apply_module_preset(&mut params, "phaseMod", "metalFold"));
        assert!(params.int_pm_enabled);

        assert!(apply_module_preset(&mut params, "lfo1", "randomDrift"));
        assert_eq!(params.lfo.waveform, LfoWaveform::Random);

        assert!(apply_module_preset(&mut params, "lfo2", "tempoTri"));
        assert_eq!(params.lfo2.waveform, LfoWaveform::Triangle);

        assert!(apply_module_preset(&mut params, "modEnv", "pad"));
        assert!(params.mod_env.sustain > 0.7);
    }

    #[test]
    fn rejects_unknown_module_or_preset() {
        let mut params = SynthParams::default();
        assert!(!apply_module_preset(&mut params, "unknown", "x"));
        assert!(!apply_module_preset(&mut params, "chorus", "unknown"));
    }
}
