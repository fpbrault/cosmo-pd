use cosmo_synth_engine::params::SynthParams;
use truce::prelude::*;

#[derive(Params)]
pub struct CzPluginParams {
    #[param(name = "Volume", range = "linear(0.0, 1.0)", default = 1.0, unit = "%")]
    pub volume: FloatParam,

    #[param(name = "Warp A Amount", range = "linear(0.0, 1.0)", default = 0.0)]
    pub warp_a_amount: FloatParam,

    #[param(name = "Warp B Amount", range = "linear(0.0, 1.0)", default = 0.0)]
    pub warp_b_amount: FloatParam,

    #[param(name = "Algo Blend A", range = "linear(0.0, 1.0)", default = 0.5)]
    pub algo_blend_a: FloatParam,

    #[param(name = "Algo Blend B", range = "linear(0.0, 1.0)", default = 0.5)]
    pub algo_blend_b: FloatParam,

    #[param(name = "Line 1 Level", range = "linear(0.0, 1.0)", default = 0.8)]
    pub line1_level: FloatParam,

    #[param(name = "Line 2 Level", range = "linear(0.0, 1.0)", default = 0.8)]
    pub line2_level: FloatParam,

    #[param(name = "Line 1 Octave", range = "linear(-2.0, 2.0)", default = 0.0)]
    pub line1_octave: FloatParam,

    #[param(name = "Line 2 Octave", range = "linear(-2.0, 2.0)", default = 0.0)]
    pub line2_octave: FloatParam,

    #[param(name = "Detune Note", range = "linear(-11.0, 11.0)", default = 0.0)]
    pub detune_note: FloatParam,

    #[param(name = "Detune Fine", range = "linear(-60.0, 60.0)", default = 0.0)]
    pub detune_fine: FloatParam,

    #[param(name = "Velocity Curve", range = "linear(-1.0, 1.0)", default = 0.0)]
    pub velocity_curve: FloatParam,

    #[param(name = "Pitch Bend Range", range = "linear(1.0, 24.0)", default = 2.0)]
    pub pitch_bend_range: FloatParam,

    #[param(name = "Portamento Rate", range = "linear(0.0, 127.0)", default = 85.0)]
    pub portamento_rate: FloatParam,

    #[param(name = "Portamento Time", range = "linear(0.0, 5.0)", default = 0.1)]
    pub portamento_time: FloatParam,

    #[param(name = "LFO Rate", range = "linear(0.01, 30.0)", default = 5.0)]
    pub lfo_rate: FloatParam,

    #[param(name = "LFO Depth", range = "linear(0.0, 1.0)", default = 0.2)]
    pub lfo_depth: FloatParam,

    #[param(name = "LFO Offset", range = "linear(-1.0, 1.0)", default = 0.0)]
    pub lfo_offset: FloatParam,

    #[param(name = "LFO 2 Rate", range = "linear(0.01, 30.0)", default = 3.0)]
    pub lfo2_rate: FloatParam,

    #[param(name = "LFO 2 Depth", range = "linear(0.0, 1.0)", default = 0.0)]
    pub lfo2_depth: FloatParam,

    #[param(name = "LFO 2 Offset", range = "linear(-1.0, 1.0)", default = 0.0)]
    pub lfo2_offset: FloatParam,

    #[param(name = "Random Rate", range = "linear(0.01, 30.0)", default = 2.0)]
    pub random_rate: FloatParam,

    #[param(name = "Mod Env Attack", range = "linear(0.0, 10.0)", default = 0.1)]
    pub mod_env_attack: FloatParam,

    #[param(name = "Mod Env Decay", range = "linear(0.0, 10.0)", default = 0.5)]
    pub mod_env_decay: FloatParam,

    #[param(name = "Mod Env Sustain", range = "linear(0.0, 1.0)", default = 0.5)]
    pub mod_env_sustain: FloatParam,

    #[param(name = "Mod Env Release", range = "linear(0.0, 10.0)", default = 2.0)]
    pub mod_env_release: FloatParam,

    #[param(name = "Macro 1", range = "linear(0.0, 1.0)", default = 0.0)]
    pub macro1: FloatParam,

    #[param(name = "Macro 2", range = "linear(0.0, 1.0)", default = 0.0)]
    pub macro2: FloatParam,

    #[param(name = "Macro 3", range = "linear(0.0, 1.0)", default = 0.0)]
    pub macro3: FloatParam,

    #[param(name = "Macro 4", range = "linear(0.0, 1.0)", default = 0.0)]
    pub macro4: FloatParam,

    #[meter]
    pub meter_l: MeterSlot,
    #[meter]
    pub meter_r: MeterSlot,
}

pub fn apply_daw_params(synth: &mut SynthParams, params: &CzPluginParams) {
    synth.volume = params.volume.value();
    synth.line1.dcw_base = params.warp_a_amount.value();
    synth.line2.dcw_base = params.warp_b_amount.value();
    synth.line1.algo_blend = params.algo_blend_a.value();
    synth.line2.algo_blend = params.algo_blend_b.value();
    synth.line1.dca_base = params.line1_level.value();
    synth.line2.dca_base = params.line2_level.value();
    synth.line1.octave = params.line1_octave.value();
    synth.line2.octave = params.line2_octave.value();
    synth.line2.detune_note = params.detune_note.value();
    synth.line2.detune_fine = params.detune_fine.value();
    synth.velocity_curve = params.velocity_curve.value();
    synth.pitch_bend_range = params.pitch_bend_range.value();
    synth.portamento.rate = params.portamento_rate.value();
    synth.portamento.time = params.portamento_time.value();
    synth.lfo.rate = params.lfo_rate.value();
    synth.lfo.depth = params.lfo_depth.value();
    synth.lfo.offset = params.lfo_offset.value();
    synth.lfo2.rate = params.lfo2_rate.value();
    synth.lfo2.depth = params.lfo2_depth.value();
    synth.lfo2.offset = params.lfo2_offset.value();
    synth.random.rate = params.random_rate.value();
    synth.mod_env.attack = params.mod_env_attack.value();
    synth.mod_env.decay = params.mod_env_decay.value();
    synth.mod_env.sustain = params.mod_env_sustain.value();
    synth.mod_env.release = params.mod_env_release.value();
    synth.macro1 = params.macro1.value();
    synth.macro2 = params.macro2.value();
    synth.macro3 = params.macro3.value();
    synth.macro4 = params.macro4.value();
}

pub fn write_daw_param_by_id(synth: &mut SynthParams, id: u32, value: f64) -> bool {
    let value = value as f32;
    match id {
        x if x == CzPluginParamsParamId::Volume as u32 => synth.volume = value,
        x if x == CzPluginParamsParamId::WarpAAmount as u32 => synth.line1.dcw_base = value,
        x if x == CzPluginParamsParamId::WarpBAmount as u32 => synth.line2.dcw_base = value,
        x if x == CzPluginParamsParamId::AlgoBlendA as u32 => synth.line1.algo_blend = value,
        x if x == CzPluginParamsParamId::AlgoBlendB as u32 => synth.line2.algo_blend = value,
        x if x == CzPluginParamsParamId::Line1Level as u32 => synth.line1.dca_base = value,
        x if x == CzPluginParamsParamId::Line2Level as u32 => synth.line2.dca_base = value,
        x if x == CzPluginParamsParamId::Line1Octave as u32 => synth.line1.octave = value,
        x if x == CzPluginParamsParamId::Line2Octave as u32 => synth.line2.octave = value,
        x if x == CzPluginParamsParamId::DetuneNote as u32 => synth.line2.detune_note = value,
        x if x == CzPluginParamsParamId::DetuneFine as u32 => synth.line2.detune_fine = value,
        x if x == CzPluginParamsParamId::VelocityCurve as u32 => synth.velocity_curve = value,
        x if x == CzPluginParamsParamId::PitchBendRange as u32 => synth.pitch_bend_range = value,
        x if x == CzPluginParamsParamId::PortamentoRate as u32 => synth.portamento.rate = value,
        x if x == CzPluginParamsParamId::PortamentoTime as u32 => synth.portamento.time = value,
        x if x == CzPluginParamsParamId::LfoRate as u32 => synth.lfo.rate = value,
        x if x == CzPluginParamsParamId::LfoDepth as u32 => synth.lfo.depth = value,
        x if x == CzPluginParamsParamId::LfoOffset as u32 => synth.lfo.offset = value,
        x if x == CzPluginParamsParamId::Lfo2Rate as u32 => synth.lfo2.rate = value,
        x if x == CzPluginParamsParamId::Lfo2Depth as u32 => synth.lfo2.depth = value,
        x if x == CzPluginParamsParamId::Lfo2Offset as u32 => synth.lfo2.offset = value,
        x if x == CzPluginParamsParamId::RandomRate as u32 => synth.random.rate = value,
        x if x == CzPluginParamsParamId::ModEnvAttack as u32 => synth.mod_env.attack = value,
        x if x == CzPluginParamsParamId::ModEnvDecay as u32 => synth.mod_env.decay = value,
        x if x == CzPluginParamsParamId::ModEnvSustain as u32 => synth.mod_env.sustain = value,
        x if x == CzPluginParamsParamId::ModEnvRelease as u32 => synth.mod_env.release = value,
        x if x == CzPluginParamsParamId::Macro1 as u32 => synth.macro1 = value,
        x if x == CzPluginParamsParamId::Macro2 as u32 => synth.macro2 = value,
        x if x == CzPluginParamsParamId::Macro3 as u32 => synth.macro3 = value,
        x if x == CzPluginParamsParamId::Macro4 as u32 => synth.macro4 = value,
        _ => return false,
    }
    true
}

pub fn daw_param_key_by_id(id: u32) -> Option<&'static str> {
    match id {
        x if x == CzPluginParamsParamId::Volume as u32 => Some("volume"),
        x if x == CzPluginParamsParamId::WarpAAmount as u32 => Some("warpAAmount"),
        x if x == CzPluginParamsParamId::WarpBAmount as u32 => Some("warpBAmount"),
        x if x == CzPluginParamsParamId::AlgoBlendA as u32 => Some("algoBlendA"),
        x if x == CzPluginParamsParamId::AlgoBlendB as u32 => Some("algoBlendB"),
        x if x == CzPluginParamsParamId::Line1Level as u32 => Some("line1Level"),
        x if x == CzPluginParamsParamId::Line2Level as u32 => Some("line2Level"),
        x if x == CzPluginParamsParamId::Line1Octave as u32 => Some("line1Octave"),
        x if x == CzPluginParamsParamId::Line2Octave as u32 => Some("line2Octave"),
        x if x == CzPluginParamsParamId::DetuneNote as u32 => Some("line2DetuneNote"),
        x if x == CzPluginParamsParamId::DetuneFine as u32 => Some("line2DetuneFine"),
        x if x == CzPluginParamsParamId::VelocityCurve as u32 => Some("velocityCurve"),
        x if x == CzPluginParamsParamId::PitchBendRange as u32 => Some("pitchBendRange"),
        x if x == CzPluginParamsParamId::PortamentoRate as u32 => Some("portamentoRate"),
        x if x == CzPluginParamsParamId::PortamentoTime as u32 => Some("portamentoTime"),
        x if x == CzPluginParamsParamId::LfoRate as u32 => Some("lfoRate"),
        x if x == CzPluginParamsParamId::LfoDepth as u32 => Some("lfoDepth"),
        x if x == CzPluginParamsParamId::LfoOffset as u32 => Some("lfoOffset"),
        x if x == CzPluginParamsParamId::Lfo2Rate as u32 => Some("lfo2Rate"),
        x if x == CzPluginParamsParamId::Lfo2Depth as u32 => Some("lfo2Depth"),
        x if x == CzPluginParamsParamId::Lfo2Offset as u32 => Some("lfo2Offset"),
        x if x == CzPluginParamsParamId::RandomRate as u32 => Some("randomRate"),
        x if x == CzPluginParamsParamId::ModEnvAttack as u32 => Some("modEnvAttack"),
        x if x == CzPluginParamsParamId::ModEnvDecay as u32 => Some("modEnvDecay"),
        x if x == CzPluginParamsParamId::ModEnvSustain as u32 => Some("modEnvSustain"),
        x if x == CzPluginParamsParamId::ModEnvRelease as u32 => Some("modEnvRelease"),
        x if x == CzPluginParamsParamId::Macro1 as u32 => Some("macro1"),
        x if x == CzPluginParamsParamId::Macro2 as u32 => Some("macro2"),
        x if x == CzPluginParamsParamId::Macro3 as u32 => Some("macro3"),
        x if x == CzPluginParamsParamId::Macro4 as u32 => Some("macro4"),
        _ => None,
    }
}

#[cfg(any(feature = "vst3", test))]
pub fn daw_param_id_by_key(key: &str) -> Option<u32> {
    match key {
        "volume" => Some(CzPluginParamsParamId::Volume as u32),
        "warpAAmount" => Some(CzPluginParamsParamId::WarpAAmount as u32),
        "warpBAmount" => Some(CzPluginParamsParamId::WarpBAmount as u32),
        "algoBlendA" => Some(CzPluginParamsParamId::AlgoBlendA as u32),
        "algoBlendB" => Some(CzPluginParamsParamId::AlgoBlendB as u32),
        "line1Level" => Some(CzPluginParamsParamId::Line1Level as u32),
        "line2Level" => Some(CzPluginParamsParamId::Line2Level as u32),
        "line1Octave" => Some(CzPluginParamsParamId::Line1Octave as u32),
        "line2Octave" => Some(CzPluginParamsParamId::Line2Octave as u32),
        "line2DetuneNote" => Some(CzPluginParamsParamId::DetuneNote as u32),
        "line2DetuneFine" => Some(CzPluginParamsParamId::DetuneFine as u32),
        "velocityCurve" => Some(CzPluginParamsParamId::VelocityCurve as u32),
        "pitchBendRange" => Some(CzPluginParamsParamId::PitchBendRange as u32),
        "portamentoRate" => Some(CzPluginParamsParamId::PortamentoRate as u32),
        "portamentoTime" => Some(CzPluginParamsParamId::PortamentoTime as u32),
        "lfoRate" => Some(CzPluginParamsParamId::LfoRate as u32),
        "lfoDepth" => Some(CzPluginParamsParamId::LfoDepth as u32),
        "lfoOffset" => Some(CzPluginParamsParamId::LfoOffset as u32),
        "lfo2Rate" => Some(CzPluginParamsParamId::Lfo2Rate as u32),
        "lfo2Depth" => Some(CzPluginParamsParamId::Lfo2Depth as u32),
        "lfo2Offset" => Some(CzPluginParamsParamId::Lfo2Offset as u32),
        "randomRate" => Some(CzPluginParamsParamId::RandomRate as u32),
        "modEnvAttack" => Some(CzPluginParamsParamId::ModEnvAttack as u32),
        "modEnvDecay" => Some(CzPluginParamsParamId::ModEnvDecay as u32),
        "modEnvSustain" => Some(CzPluginParamsParamId::ModEnvSustain as u32),
        "modEnvRelease" => Some(CzPluginParamsParamId::ModEnvRelease as u32),
        "macro1" => Some(CzPluginParamsParamId::Macro1 as u32),
        "macro2" => Some(CzPluginParamsParamId::Macro2 as u32),
        "macro3" => Some(CzPluginParamsParamId::Macro3 as u32),
        "macro4" => Some(CzPluginParamsParamId::Macro4 as u32),
        _ => None,
    }
}

#[cfg(any(feature = "vst3", test))]
pub fn resolve_vst3_midi_mapping_param_id(
    bindings: &[crate::session_state::MidiLearnBinding],
    bus_index: i32,
    channel: i16,
    cc: i16,
) -> Option<u32> {
    if bus_index != 0 || !(0..=15).contains(&channel) || !(0..=127).contains(&cc) {
        return None;
    }

    let mut omni_match = None;

    for binding in bindings {
        if binding.cc != i32::from(cc) {
            continue;
        }
        let Some(param_id) = daw_param_id_by_key(&binding.param_key) else {
            continue;
        };

        if binding.channel == i32::from(channel) {
            return Some(param_id);
        }
        if binding.channel == -1 && omni_match.is_none() {
            omni_match = Some(param_id);
        }
    }

    omni_match
}

pub fn read_daw_param_by_id(synth: &SynthParams, id: u32) -> Option<f32> {
    match id {
        x if x == CzPluginParamsParamId::Volume as u32 => Some(synth.volume),
        x if x == CzPluginParamsParamId::WarpAAmount as u32 => Some(synth.line1.dcw_base),
        x if x == CzPluginParamsParamId::WarpBAmount as u32 => Some(synth.line2.dcw_base),
        x if x == CzPluginParamsParamId::AlgoBlendA as u32 => Some(synth.line1.algo_blend),
        x if x == CzPluginParamsParamId::AlgoBlendB as u32 => Some(synth.line2.algo_blend),
        x if x == CzPluginParamsParamId::Line1Level as u32 => Some(synth.line1.dca_base),
        x if x == CzPluginParamsParamId::Line2Level as u32 => Some(synth.line2.dca_base),
        x if x == CzPluginParamsParamId::Line1Octave as u32 => Some(synth.line1.octave),
        x if x == CzPluginParamsParamId::Line2Octave as u32 => Some(synth.line2.octave),
        x if x == CzPluginParamsParamId::DetuneNote as u32 => Some(synth.line2.detune_note),
        x if x == CzPluginParamsParamId::DetuneFine as u32 => Some(synth.line2.detune_fine),
        x if x == CzPluginParamsParamId::VelocityCurve as u32 => Some(synth.velocity_curve),
        x if x == CzPluginParamsParamId::PitchBendRange as u32 => Some(synth.pitch_bend_range),
        x if x == CzPluginParamsParamId::PortamentoRate as u32 => Some(synth.portamento.rate),
        x if x == CzPluginParamsParamId::PortamentoTime as u32 => Some(synth.portamento.time),
        x if x == CzPluginParamsParamId::LfoRate as u32 => Some(synth.lfo.rate),
        x if x == CzPluginParamsParamId::LfoDepth as u32 => Some(synth.lfo.depth),
        x if x == CzPluginParamsParamId::LfoOffset as u32 => Some(synth.lfo.offset),
        x if x == CzPluginParamsParamId::Lfo2Rate as u32 => Some(synth.lfo2.rate),
        x if x == CzPluginParamsParamId::Lfo2Depth as u32 => Some(synth.lfo2.depth),
        x if x == CzPluginParamsParamId::Lfo2Offset as u32 => Some(synth.lfo2.offset),
        x if x == CzPluginParamsParamId::RandomRate as u32 => Some(synth.random.rate),
        x if x == CzPluginParamsParamId::ModEnvAttack as u32 => Some(synth.mod_env.attack),
        x if x == CzPluginParamsParamId::ModEnvDecay as u32 => Some(synth.mod_env.decay),
        x if x == CzPluginParamsParamId::ModEnvSustain as u32 => Some(synth.mod_env.sustain),
        x if x == CzPluginParamsParamId::ModEnvRelease as u32 => Some(synth.mod_env.release),
        x if x == CzPluginParamsParamId::Macro1 as u32 => Some(synth.macro1),
        x if x == CzPluginParamsParamId::Macro2 as u32 => Some(synth.macro2),
        x if x == CzPluginParamsParamId::Macro3 as u32 => Some(synth.macro3),
        x if x == CzPluginParamsParamId::Macro4 as u32 => Some(synth.macro4),
        _ => None,
    }
}

pub fn read_current_daw_param_by_id(params: &CzPluginParams, id: u32) -> Option<f32> {
    match id {
        x if x == CzPluginParamsParamId::Volume as u32 => Some(params.volume.value()),
        x if x == CzPluginParamsParamId::WarpAAmount as u32 => Some(params.warp_a_amount.value()),
        x if x == CzPluginParamsParamId::WarpBAmount as u32 => Some(params.warp_b_amount.value()),
        x if x == CzPluginParamsParamId::AlgoBlendA as u32 => Some(params.algo_blend_a.value()),
        x if x == CzPluginParamsParamId::AlgoBlendB as u32 => Some(params.algo_blend_b.value()),
        x if x == CzPluginParamsParamId::Line1Level as u32 => Some(params.line1_level.value()),
        x if x == CzPluginParamsParamId::Line2Level as u32 => Some(params.line2_level.value()),
        x if x == CzPluginParamsParamId::Line1Octave as u32 => Some(params.line1_octave.value()),
        x if x == CzPluginParamsParamId::Line2Octave as u32 => Some(params.line2_octave.value()),
        x if x == CzPluginParamsParamId::DetuneNote as u32 => Some(params.detune_note.value()),
        x if x == CzPluginParamsParamId::DetuneFine as u32 => Some(params.detune_fine.value()),
        x if x == CzPluginParamsParamId::VelocityCurve as u32 => {
            Some(params.velocity_curve.value())
        }
        x if x == CzPluginParamsParamId::PitchBendRange as u32 => {
            Some(params.pitch_bend_range.value())
        }
        x if x == CzPluginParamsParamId::PortamentoRate as u32 => {
            Some(params.portamento_rate.value())
        }
        x if x == CzPluginParamsParamId::PortamentoTime as u32 => {
            Some(params.portamento_time.value())
        }
        x if x == CzPluginParamsParamId::LfoRate as u32 => Some(params.lfo_rate.value()),
        x if x == CzPluginParamsParamId::LfoDepth as u32 => Some(params.lfo_depth.value()),
        x if x == CzPluginParamsParamId::LfoOffset as u32 => Some(params.lfo_offset.value()),
        x if x == CzPluginParamsParamId::Lfo2Rate as u32 => Some(params.lfo2_rate.value()),
        x if x == CzPluginParamsParamId::Lfo2Depth as u32 => Some(params.lfo2_depth.value()),
        x if x == CzPluginParamsParamId::Lfo2Offset as u32 => Some(params.lfo2_offset.value()),
        x if x == CzPluginParamsParamId::RandomRate as u32 => Some(params.random_rate.value()),
        x if x == CzPluginParamsParamId::ModEnvAttack as u32 => Some(params.mod_env_attack.value()),
        x if x == CzPluginParamsParamId::ModEnvDecay as u32 => Some(params.mod_env_decay.value()),
        x if x == CzPluginParamsParamId::ModEnvSustain as u32 => {
            Some(params.mod_env_sustain.value())
        }
        x if x == CzPluginParamsParamId::ModEnvRelease as u32 => {
            Some(params.mod_env_release.value())
        }
        x if x == CzPluginParamsParamId::Macro1 as u32 => Some(params.macro1.value()),
        x if x == CzPluginParamsParamId::Macro2 as u32 => Some(params.macro2.value()),
        x if x == CzPluginParamsParamId::Macro3 as u32 => Some(params.macro3.value()),
        x if x == CzPluginParamsParamId::Macro4 as u32 => Some(params.macro4.value()),
        _ => None,
    }
}

pub fn sync_all_daw_params_from_synth(params: &CzPluginParams, synth: &SynthParams) {
    params.volume.set_value(synth.volume as f64);
    params.warp_a_amount.set_value(synth.line1.dcw_base as f64);
    params.warp_b_amount.set_value(synth.line2.dcw_base as f64);
    params.algo_blend_a.set_value(synth.line1.algo_blend as f64);
    params.algo_blend_b.set_value(synth.line2.algo_blend as f64);
    params.line1_level.set_value(synth.line1.dca_base as f64);
    params.line2_level.set_value(synth.line2.dca_base as f64);
    params.line1_octave.set_value(synth.line1.octave as f64);
    params.line2_octave.set_value(synth.line2.octave as f64);
    params.detune_note.set_value(synth.line2.detune_note as f64);
    params.detune_fine.set_value(synth.line2.detune_fine as f64);
    params.velocity_curve.set_value(synth.velocity_curve as f64);
    params
        .pitch_bend_range
        .set_value(synth.pitch_bend_range as f64);
    params
        .portamento_rate
        .set_value(synth.portamento.rate as f64);
    params
        .portamento_time
        .set_value(synth.portamento.time as f64);
    params.lfo_rate.set_value(synth.lfo.rate as f64);
    params.lfo_depth.set_value(synth.lfo.depth as f64);
    params.lfo_offset.set_value(synth.lfo.offset as f64);
    params.lfo2_rate.set_value(synth.lfo2.rate as f64);
    params.lfo2_depth.set_value(synth.lfo2.depth as f64);
    params.lfo2_offset.set_value(synth.lfo2.offset as f64);
    params.random_rate.set_value(synth.random.rate as f64);
    params.mod_env_attack.set_value(synth.mod_env.attack as f64);
    params.mod_env_decay.set_value(synth.mod_env.decay as f64);
    params
        .mod_env_sustain
        .set_value(synth.mod_env.sustain as f64);
    params
        .mod_env_release
        .set_value(synth.mod_env.release as f64);
    params.macro1.set_value(synth.macro1 as f64);
    params.macro2.set_value(synth.macro2 as f64);
    params.macro3.set_value(synth.macro3 as f64);
    params.macro4.set_value(synth.macro4 as f64);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn daw_parameter_keys_and_ids_round_trip() {
        for id in 0..64 {
            let Some(key) = daw_param_key_by_id(id) else {
                continue;
            };
            assert_eq!(daw_param_id_by_key(key), Some(id));
        }
    }

    #[test]
    fn writing_a_daw_parameter_updates_the_matching_synth_field() {
        let mut synth = SynthParams::default();
        let id = CzPluginParamsParamId::Macro2 as u32;
        assert!(write_daw_param_by_id(&mut synth, id, 0.75));
        assert_eq!(read_daw_param_by_id(&synth, id), Some(0.75));
    }
}
