use std::ffi::CStr;
use std::os::raw::c_char;
use std::ptr;
use std::slice;
use std::sync::OnceLock;

use cosmo_synth_engine::params::{
    engine_param_default_v1, engine_param_ui_meta_v1, EngineParamReadoutFormatV1, SynthParams,
};
use cosmo_synth_engine::processor::{midi_note_to_freq, CosmoProcessor};

const SCOPE_CAPACITY: usize = 4096;
const PARAM_KEY_CAPACITY: usize = 64;
const PARAM_LABEL_CAPACITY: usize = 64;
const PARAM_FLAG_AUTOMATABLE: u32 = 1 << 0;
const FACTORY_PRESETS_JSON: &str = include_str!("factory_presets.json");

struct FactoryPresetEntry {
    name: String,
    params_json: String,
}

static FACTORY_PRESETS: OnceLock<Vec<FactoryPresetEntry>> = OnceLock::new();

fn factory_presets() -> &'static [FactoryPresetEntry] {
    FACTORY_PRESETS.get_or_init(load_factory_presets).as_slice()
}

fn load_factory_presets() -> Vec<FactoryPresetEntry> {
    let Ok(presets_value) = serde_json::from_str::<serde_json::Value>(FACTORY_PRESETS_JSON) else {
        return Vec::new();
    };
    let Some(presets) = presets_value.as_array() else {
        return Vec::new();
    };

    presets
        .iter()
        .filter_map(|preset| {
            let name = preset.get("name")?.as_str()?.to_owned();
            let params = preset.get("data")?.get("params")?;
            Some(FactoryPresetEntry {
                name,
                params_json: params.to_string(),
            })
        })
        .collect()
}

#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct CosmoPd101FfiParamInfo {
    pub id: u32,
    pub key: [c_char; PARAM_KEY_CAPACITY],
    pub label: [c_char; PARAM_LABEL_CAPACITY],
    pub default_value: f32,
    pub min_value: f32,
    pub max_value: f32,
    pub flags: u32,
}

impl Default for CosmoPd101FfiParamInfo {
    fn default() -> Self {
        Self {
            id: 0,
            key: [0; PARAM_KEY_CAPACITY],
            label: [0; PARAM_LABEL_CAPACITY],
            default_value: 0.0,
            min_value: 0.0,
            max_value: 1.0,
            flags: 0,
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct AutomatableParamSpec {
    id: u32,
    key: &'static str,
    min: f32,
    max: f32,
}

const AUTOMATABLE_PARAMS: &[AutomatableParamSpec] = &[
    AutomatableParamSpec {
        id: 1,
        key: "volume",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 2,
        key: "warpAAmount",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 3,
        key: "warpBAmount",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 4,
        key: "algoBlendA",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 5,
        key: "algoBlendB",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 6,
        key: "line1Level",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 7,
        key: "line2Level",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 8,
        key: "line1Octave",
        min: -2.0,
        max: 2.0,
    },
    AutomatableParamSpec {
        id: 9,
        key: "line2Octave",
        min: -2.0,
        max: 2.0,
    },
    AutomatableParamSpec {
        id: 10,
        key: "line2DetuneNote",
        min: -11.0,
        max: 11.0,
    },
    AutomatableParamSpec {
        id: 11,
        key: "line2DetuneFine",
        min: -60.0,
        max: 60.0,
    },
    AutomatableParamSpec {
        id: 12,
        key: "velocityCurve",
        min: -1.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 13,
        key: "pitchBendRange",
        min: 1.0,
        max: 24.0,
    },
    AutomatableParamSpec {
        id: 14,
        key: "portamentoRate",
        min: 0.0,
        max: 127.0,
    },
    AutomatableParamSpec {
        id: 15,
        key: "portamentoTime",
        min: 0.0,
        max: 5.0,
    },
    AutomatableParamSpec {
        id: 16,
        key: "lfoRate",
        min: 0.01,
        max: 30.0,
    },
    AutomatableParamSpec {
        id: 17,
        key: "lfoDepth",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 18,
        key: "lfoOffset",
        min: -1.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 19,
        key: "lfo2Rate",
        min: 0.01,
        max: 30.0,
    },
    AutomatableParamSpec {
        id: 20,
        key: "lfo2Depth",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 21,
        key: "lfo2Offset",
        min: -1.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 22,
        key: "randomRate",
        min: 0.01,
        max: 30.0,
    },
    AutomatableParamSpec {
        id: 23,
        key: "modEnvAttack",
        min: 0.0,
        max: 10.0,
    },
    AutomatableParamSpec {
        id: 24,
        key: "modEnvDecay",
        min: 0.0,
        max: 10.0,
    },
    AutomatableParamSpec {
        id: 25,
        key: "modEnvSustain",
        min: 0.0,
        max: 1.0,
    },
    AutomatableParamSpec {
        id: 26,
        key: "modEnvRelease",
        min: 0.0,
        max: 10.0,
    },
];

#[repr(C)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CosmoPd101FfiStatus {
    Ok = 0,
    NullPointer = 1,
    InvalidArgument = 2,
    BufferTooSmall = 3,
    JsonError = 4,
}

struct ScopeRing {
    samples: Vec<f32>,
    cursor: usize,
    sample_rate: f32,
    hz: f32,
}

impl ScopeRing {
    fn new(sample_rate: f32) -> Self {
        Self {
            samples: Vec::with_capacity(SCOPE_CAPACITY),
            cursor: 0,
            sample_rate,
            hz: 0.0,
        }
    }

    fn push_block(&mut self, mono: &[f32], sample_rate: f32, hz: f32) {
        self.sample_rate = sample_rate;
        self.hz = hz;
        for &sample in mono {
            if self.samples.len() < SCOPE_CAPACITY {
                self.samples.push(sample);
            } else {
                self.samples[self.cursor] = sample;
                self.cursor = (self.cursor + 1) % SCOPE_CAPACITY;
            }
        }
    }

    fn copy_linear_i8(&self, output: &mut [i8]) -> Result<usize, CosmoPd101FfiStatus> {
        let sample_count = self.samples.len();
        if output.len() < sample_count {
            return Err(CosmoPd101FfiStatus::BufferTooSmall);
        }

        if sample_count < SCOPE_CAPACITY {
            for (dest, sample) in output.iter_mut().zip(self.samples.iter()) {
                *dest = sample_to_i8(*sample);
            }
            return Ok(sample_count);
        }

        let (head, tail) = output.split_at_mut(SCOPE_CAPACITY - self.cursor);
        for (dest, sample) in head.iter_mut().zip(self.samples[self.cursor..].iter()) {
            *dest = sample_to_i8(*sample);
        }
        for (dest, sample) in tail.iter_mut().zip(self.samples[..self.cursor].iter()) {
            *dest = sample_to_i8(*sample);
        }
        Ok(sample_count)
    }

    fn copy_linear_f32(&self, output: &mut [f32]) -> Result<usize, CosmoPd101FfiStatus> {
        let sample_count = self.samples.len();
        if output.len() < sample_count {
            return Err(CosmoPd101FfiStatus::BufferTooSmall);
        }

        if sample_count < SCOPE_CAPACITY {
            output[..sample_count].copy_from_slice(&self.samples);
            return Ok(sample_count);
        }

        let (head, tail) = output.split_at_mut(SCOPE_CAPACITY - self.cursor);
        head.copy_from_slice(&self.samples[self.cursor..]);
        tail.copy_from_slice(&self.samples[..self.cursor]);
        Ok(sample_count)
    }
}

pub struct CosmoPd101FfiEngine {
    processor: CosmoProcessor,
    scratch: Vec<f32>,
    max_frames: usize,
    scope: ScopeRing,
}

impl CosmoPd101FfiEngine {
    fn new(sample_rate: f32, max_frames: usize) -> Self {
        Self {
            processor: CosmoProcessor::new(sample_rate),
            scratch: vec![0.0; max_frames],
            max_frames,
            scope: ScopeRing::new(sample_rate),
        }
    }

    fn active_hz(&self) -> f32 {
        self.processor
            .voices
            .iter()
            .filter(|voice| !voice.is_silent && !voice.is_releasing && voice.note.is_some())
            .map(|voice| voice.current_freq)
            .max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
            .unwrap_or(0.0)
    }

    fn render_to_scratch(&mut self, frames: usize) -> CosmoPd101FfiStatus {
        if frames > self.max_frames {
            return CosmoPd101FfiStatus::InvalidArgument;
        }

        {
            let block = &mut self.scratch[..frames];
            block.fill(0.0);
            self.processor.process(block);
        }
        let hz = self.active_hz();
        self.scope
            .push_block(&self.scratch[..frames], self.processor.sample_rate, hz);
        CosmoPd101FfiStatus::Ok
    }
}

fn sample_to_i8(sample: f32) -> i8 {
    (sample.clamp(-1.0, 1.0) * 127.0) as i8
}

fn automatable_param_by_id(id: u32) -> Option<&'static AutomatableParamSpec> {
    AUTOMATABLE_PARAMS.iter().find(|spec| spec.id == id)
}

fn automatable_param_by_index(index: usize) -> Option<&'static AutomatableParamSpec> {
    AUTOMATABLE_PARAMS.get(index)
}

fn meta_label_for_key(key: &str) -> String {
    engine_param_ui_meta_v1()
        .iter()
        .find(|meta| meta.key == key)
        .map(|meta| match meta.readout_format {
            EngineParamReadoutFormatV1::Integer => "Int".to_owned(),
            EngineParamReadoutFormatV1::Semitones => "St".to_owned(),
            EngineParamReadoutFormatV1::OnOff => "On/Off".to_owned(),
            EngineParamReadoutFormatV1::Percent => "%".to_owned(),
            EngineParamReadoutFormatV1::Decimal => "Dec".to_owned(),
            EngineParamReadoutFormatV1::Hertz => "Hz".to_owned(),
            EngineParamReadoutFormatV1::Milliseconds => "ms".to_owned(),
            EngineParamReadoutFormatV1::Seconds2 => "s".to_owned(),
            EngineParamReadoutFormatV1::Uppercase
            | EngineParamReadoutFormatV1::Raw
            | EngineParamReadoutFormatV1::EnumMap { .. } => key.to_owned(),
            EngineParamReadoutFormatV1::BipolarPercent | EngineParamReadoutFormatV1::Degrees => {
                key.to_owned()
            }
        })
        .unwrap_or_else(|| "Parameter".to_owned())
}

fn is_stepped_key(key: &str) -> bool {
    engine_param_ui_meta_v1()
        .iter()
        .find(|meta| meta.key == key)
        .map(|meta| {
            matches!(
                meta.readout_format,
                EngineParamReadoutFormatV1::Integer
                    | EngineParamReadoutFormatV1::Semitones
                    | EngineParamReadoutFormatV1::OnOff
            )
        })
        .unwrap_or(false)
}

fn write_c_char_array<const N: usize>(dest: &mut [c_char; N], value: &str) {
    dest.fill(0);
    let bytes = value.as_bytes();
    let len = bytes.len().min(N.saturating_sub(1));
    for (index, byte) in bytes[..len].iter().enumerate() {
        dest[index] = *byte as c_char;
    }
}

fn parameter_value(params: &SynthParams, key: &str) -> Option<f32> {
    match key {
        "volume" => Some(params.volume),
        "warpAAmount" => Some(params.line1.dcw_base),
        "warpBAmount" => Some(params.line2.dcw_base),
        "algoBlendA" => Some(params.line1.algo_blend),
        "algoBlendB" => Some(params.line2.algo_blend),
        "line1Level" => Some(params.line1.dca_base),
        "line2Level" => Some(params.line2.dca_base),
        "line1Octave" => Some(params.line1.octave),
        "line2Octave" => Some(params.line2.octave),
        "line2DetuneNote" => Some(params.line2.detune_note),
        "line2DetuneFine" => Some(params.line2.detune_fine),
        "velocityCurve" => Some(params.velocity_curve),
        "pitchBendRange" => Some(params.pitch_bend_range),
        "portamentoRate" => Some(params.portamento.rate),
        "portamentoTime" => Some(params.portamento.time),
        "lfoRate" => Some(params.lfo.rate),
        "lfoDepth" => Some(params.lfo.depth),
        "lfoOffset" => Some(params.lfo.offset),
        "lfo2Rate" => Some(params.lfo2.rate),
        "lfo2Depth" => Some(params.lfo2.depth),
        "lfo2Offset" => Some(params.lfo2.offset),
        "randomRate" => Some(params.random.rate),
        "modEnvAttack" => Some(params.mod_env.attack),
        "modEnvDecay" => Some(params.mod_env.decay),
        "modEnvSustain" => Some(params.mod_env.sustain),
        "modEnvRelease" => Some(params.mod_env.release),
        _ => None,
    }
}

fn set_parameter_value(params: &mut SynthParams, key: &str, value: f32) -> bool {
    match key {
        "volume" => params.volume = value,
        "warpAAmount" => params.line1.dcw_base = value,
        "warpBAmount" => params.line2.dcw_base = value,
        "algoBlendA" => params.line1.algo_blend = value,
        "algoBlendB" => params.line2.algo_blend = value,
        "line1Level" => params.line1.dca_base = value,
        "line2Level" => params.line2.dca_base = value,
        "line1Octave" => params.line1.octave = value,
        "line2Octave" => params.line2.octave = value,
        "line2DetuneNote" => params.line2.detune_note = value,
        "line2DetuneFine" => params.line2.detune_fine = value,
        "velocityCurve" => params.velocity_curve = value,
        "pitchBendRange" => params.pitch_bend_range = value,
        "portamentoRate" => params.portamento.rate = value,
        "portamentoTime" => params.portamento.time = value,
        "lfoRate" => params.lfo.rate = value,
        "lfoDepth" => params.lfo.depth = value,
        "lfoOffset" => params.lfo.offset = value,
        "lfo2Rate" => params.lfo2.rate = value,
        "lfo2Depth" => params.lfo2.depth = value,
        "lfo2Offset" => params.lfo2.offset = value,
        "randomRate" => params.random.rate = value,
        "modEnvAttack" => params.mod_env.attack = value,
        "modEnvDecay" => params.mod_env.decay = value,
        "modEnvSustain" => params.mod_env.sustain = value,
        "modEnvRelease" => params.mod_env.release = value,
        _ => return false,
    }
    true
}

fn engine_mut<'a>(
    engine: *mut CosmoPd101FfiEngine,
) -> Result<&'a mut CosmoPd101FfiEngine, CosmoPd101FfiStatus> {
    if engine.is_null() {
        return Err(CosmoPd101FfiStatus::NullPointer);
    }
    Ok(unsafe { &mut *engine })
}

fn engine_ref<'a>(
    engine: *const CosmoPd101FfiEngine,
) -> Result<&'a CosmoPd101FfiEngine, CosmoPd101FfiStatus> {
    if engine.is_null() {
        return Err(CosmoPd101FfiStatus::NullPointer);
    }
    Ok(unsafe { &*engine })
}

unsafe fn output_slice_mut<'a, T>(
    output: *mut T,
    len: usize,
) -> Result<&'a mut [T], CosmoPd101FfiStatus> {
    if output.is_null() && len > 0 {
        return Err(CosmoPd101FfiStatus::NullPointer);
    }
    Ok(slice::from_raw_parts_mut(output, len))
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_engine_create(
    sample_rate: f32,
    max_frames: usize,
) -> *mut CosmoPd101FfiEngine {
    if !sample_rate.is_finite() || sample_rate <= 0.0 || max_frames == 0 {
        return ptr::null_mut();
    }

    Box::into_raw(Box::new(CosmoPd101FfiEngine::new(sample_rate, max_frames)))
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_engine_destroy(engine: *mut CosmoPd101FfiEngine) {
    if !engine.is_null() {
        drop(Box::from_raw(engine));
    }
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_reset_audio_state(
    engine: *mut CosmoPd101FfiEngine,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    engine.processor.reset_audio_state();
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_set_params_json(
    engine: *mut CosmoPd101FfiEngine,
    json: *const c_char,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    if json.is_null() {
        return CosmoPd101FfiStatus::NullPointer;
    }

    let Ok(json) = CStr::from_ptr(json).to_str() else {
        return CosmoPd101FfiStatus::InvalidArgument;
    };
    let Ok(params) = serde_json::from_str::<SynthParams>(json) else {
        return CosmoPd101FfiStatus::JsonError;
    };
    engine.processor.set_params(params);
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_get_params_json(
    engine: *const CosmoPd101FfiEngine,
    output: *mut u8,
    output_len: usize,
) -> usize {
    let Ok(engine) = engine_ref(engine) else {
        return 0;
    };
    let Ok(json) = serde_json::to_string(engine.processor.params.as_ref()) else {
        return 0;
    };
    let bytes = json.as_bytes();
    if output.is_null() || output_len == 0 {
        return bytes.len();
    }
    let Ok(output) = output_slice_mut(output, output_len) else {
        return 0;
    };
    let bytes_to_write = bytes.len().min(output.len());
    output[..bytes_to_write].copy_from_slice(&bytes[..bytes_to_write]);
    bytes.len()
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_get_factory_preset_count() -> usize {
    factory_presets().len()
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_get_factory_preset_name(
    index: usize,
    output: *mut u8,
    output_len: usize,
) -> usize {
    let Some(name) = factory_presets()
        .get(index)
        .map(|preset| preset.name.as_str())
    else {
        return 0;
    };
    let bytes = name.as_bytes();
    if output.is_null() || output_len == 0 {
        return bytes.len();
    }
    let Ok(output) = output_slice_mut(output, output_len) else {
        return 0;
    };
    let bytes_to_write = bytes.len().min(output.len());
    output[..bytes_to_write].copy_from_slice(&bytes[..bytes_to_write]);
    bytes.len()
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_get_factory_preset_params_json(
    index: usize,
    output: *mut u8,
    output_len: usize,
) -> usize {
    let Some(params_json) = factory_presets()
        .get(index)
        .map(|preset| &preset.params_json)
    else {
        return 0;
    };
    let bytes = params_json.as_bytes();
    if output.is_null() || output_len == 0 {
        return bytes.len();
    }
    let Ok(output) = output_slice_mut(output, output_len) else {
        return 0;
    };
    let bytes_to_write = bytes.len().min(output.len());
    output[..bytes_to_write].copy_from_slice(&bytes[..bytes_to_write]);
    bytes.len()
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_get_runtime_voice_states_json(
    engine: *const CosmoPd101FfiEngine,
    output: *mut u8,
    output_len: usize,
) -> usize {
    let Ok(engine) = engine_ref(engine) else {
        return 0;
    };
    let Ok(json) = serde_json::to_string(&engine.processor.runtime_voice_debug_state()) else {
        return 0;
    };
    let bytes = json.as_bytes();
    if output.is_null() || output_len == 0 {
        return bytes.len();
    }
    let Ok(output) = output_slice_mut(output, output_len) else {
        return 0;
    };
    let bytes_to_write = bytes.len().min(output.len());
    output[..bytes_to_write].copy_from_slice(&bytes[..bytes_to_write]);
    bytes.len()
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_get_runtime_mod_sources_json(
    engine: *const CosmoPd101FfiEngine,
    output: *mut u8,
    output_len: usize,
) -> usize {
    let Ok(engine) = engine_ref(engine) else {
        return 0;
    };
    let Ok(json) = serde_json::to_string(&engine.processor.runtime_mod_sources()) else {
        return 0;
    };
    let bytes = json.as_bytes();
    if output.is_null() || output_len == 0 {
        return bytes.len();
    }
    let Ok(output) = output_slice_mut(output, output_len) else {
        return 0;
    };
    let bytes_to_write = bytes.len().min(output.len());
    output[..bytes_to_write].copy_from_slice(&bytes[..bytes_to_write]);
    bytes.len()
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_get_parameter_count() -> usize {
    AUTOMATABLE_PARAMS.len()
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_get_parameter_info(
    index: usize,
    out_info: *mut CosmoPd101FfiParamInfo,
) -> CosmoPd101FfiStatus {
    if out_info.is_null() {
        return CosmoPd101FfiStatus::NullPointer;
    }
    let Some(spec) = automatable_param_by_index(index) else {
        return CosmoPd101FfiStatus::InvalidArgument;
    };

    let info = &mut *out_info;
    *info = CosmoPd101FfiParamInfo::default();
    info.id = spec.id;
    info.default_value = engine_param_default_v1(spec.key).unwrap_or(spec.min);
    info.min_value = spec.min;
    info.max_value = spec.max;
    info.flags = PARAM_FLAG_AUTOMATABLE;
    if is_stepped_key(spec.key) {
        info.flags |= 1 << 1;
    }
    write_c_char_array(&mut info.key, spec.key);
    write_c_char_array(&mut info.label, &meta_label_for_key(spec.key));
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_get_parameter_value(
    engine: *const CosmoPd101FfiEngine,
    id: u32,
    out_value: *mut f32,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_ref(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    if out_value.is_null() {
        return CosmoPd101FfiStatus::NullPointer;
    }
    let Some(spec) = automatable_param_by_id(id) else {
        return CosmoPd101FfiStatus::InvalidArgument;
    };
    let Some(value) = parameter_value(&engine.processor.params, spec.key) else {
        return CosmoPd101FfiStatus::InvalidArgument;
    };
    *out_value = value;
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_set_parameter_value(
    engine: *mut CosmoPd101FfiEngine,
    id: u32,
    value: f32,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    let Some(spec) = automatable_param_by_id(id) else {
        return CosmoPd101FfiStatus::InvalidArgument;
    };
    if !value.is_finite() {
        return CosmoPd101FfiStatus::InvalidArgument;
    }

    let mut params = (*engine.processor.params).clone();
    if !set_parameter_value(&mut params, spec.key, value.clamp(spec.min, spec.max)) {
        return CosmoPd101FfiStatus::InvalidArgument;
    }
    engine.processor.set_params(params);
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_note_on(
    engine: *mut CosmoPd101FfiEngine,
    note: u8,
    frequency: f32,
    velocity: f32,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    let frequency = if frequency > 0.0 {
        frequency
    } else {
        midi_note_to_freq(note)
    };
    engine
        .processor
        .note_on(note, frequency, velocity.clamp(0.0, 1.0));
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_note_off(
    engine: *mut CosmoPd101FfiEngine,
    note: u8,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    engine.processor.note_off(note);
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_all_notes_off(
    engine: *mut CosmoPd101FfiEngine,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    engine.processor.set_sustain(false);
    for note in 0u8..=127u8 {
        engine.processor.note_off(note);
    }
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_set_sustain(
    engine: *mut CosmoPd101FfiEngine,
    on: bool,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    engine.processor.set_sustain(on);
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_set_pitch_bend(
    engine: *mut CosmoPd101FfiEngine,
    value: f32,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    engine.processor.set_pitch_bend(value.clamp(-1.0, 1.0));
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_set_mod_wheel(
    engine: *mut CosmoPd101FfiEngine,
    value: f32,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    engine.processor.set_mod_wheel(value.clamp(0.0, 1.0));
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub extern "C" fn cosmo_pd101_ffi_set_aftertouch(
    engine: *mut CosmoPd101FfiEngine,
    value: f32,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    engine.processor.set_aftertouch(value.clamp(0.0, 1.0));
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_render_mono(
    engine: *mut CosmoPd101FfiEngine,
    output: *mut f32,
    frames: usize,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    let Ok(output) = output_slice_mut(output, frames) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    let status = engine.render_to_scratch(frames);
    if status != CosmoPd101FfiStatus::Ok {
        return status;
    }
    output.copy_from_slice(&engine.scratch[..frames]);
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_render_stereo(
    engine: *mut CosmoPd101FfiEngine,
    output_left: *mut f32,
    output_right: *mut f32,
    frames: usize,
) -> CosmoPd101FfiStatus {
    let Ok(engine) = engine_mut(engine) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    let Ok(left) = output_slice_mut(output_left, frames) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    let Ok(right) = output_slice_mut(output_right, frames) else {
        return CosmoPd101FfiStatus::NullPointer;
    };
    let status = engine.render_to_scratch(frames);
    if status != CosmoPd101FfiStatus::Ok {
        return status;
    }
    left.copy_from_slice(&engine.scratch[..frames]);
    right.copy_from_slice(&engine.scratch[..frames]);
    CosmoPd101FfiStatus::Ok
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_copy_scope_i8(
    engine: *const CosmoPd101FfiEngine,
    output: *mut i8,
    output_len: usize,
    out_sample_rate: *mut f32,
    out_hz: *mut f32,
) -> usize {
    let Ok(engine) = engine_ref(engine) else {
        return 0;
    };
    if !out_sample_rate.is_null() {
        *out_sample_rate = engine.scope.sample_rate;
    }
    if !out_hz.is_null() {
        *out_hz = engine.scope.hz;
    }
    if output.is_null() || output_len == 0 {
        return engine.scope.samples.len();
    }
    let Ok(output) = output_slice_mut(output, output_len) else {
        return 0;
    };
    engine.scope.copy_linear_i8(output).unwrap_or(0)
}

#[no_mangle]
pub unsafe extern "C" fn cosmo_pd101_ffi_copy_scope_f32(
    engine: *const CosmoPd101FfiEngine,
    output: *mut f32,
    output_len: usize,
    out_sample_rate: *mut f32,
    out_hz: *mut f32,
) -> usize {
    let Ok(engine) = engine_ref(engine) else {
        return 0;
    };
    if !out_sample_rate.is_null() {
        *out_sample_rate = engine.scope.sample_rate;
    }
    if !out_hz.is_null() {
        *out_hz = engine.scope.hz;
    }
    if output.is_null() || output_len == 0 {
        return engine.scope.samples.len();
    }
    let Ok(output) = output_slice_mut(output, output_len) else {
        return 0;
    };
    engine.scope.copy_linear_f32(output).unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use std::ffi::CString;

    use super::*;

    #[test]
    fn ffi_engine_renders_nonzero_audio_after_note_on() {
        let engine = cosmo_pd101_ffi_engine_create(44_100.0, 128);
        assert!(!engine.is_null());

        assert_eq!(
            cosmo_pd101_ffi_note_on(engine, 60, 0.0, 1.0),
            CosmoPd101FfiStatus::Ok,
        );
        let mut left = vec![0.0; 128];
        let mut right = vec![0.0; 128];
        let status = unsafe {
            cosmo_pd101_ffi_render_stereo(engine, left.as_mut_ptr(), right.as_mut_ptr(), 128)
        };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);
        assert!(left.iter().any(|sample| sample.abs() > 0.000_001));
        assert_eq!(left, right);

        unsafe { cosmo_pd101_ffi_engine_destroy(engine) };
    }

    #[test]
    fn ffi_params_roundtrip_uses_caller_owned_buffer() {
        let engine = cosmo_pd101_ffi_engine_create(44_100.0, 64);
        assert!(!engine.is_null());

        let mut params = SynthParams::default();
        params.volume = 0.23;
        let json = CString::new(serde_json::to_string(&params).unwrap()).unwrap();
        let status = unsafe { cosmo_pd101_ffi_set_params_json(engine, json.as_ptr()) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);

        let required = unsafe { cosmo_pd101_ffi_get_params_json(engine, ptr::null_mut(), 0) };
        assert!(required > 0);
        let mut buffer = vec![0; required];
        let written =
            unsafe { cosmo_pd101_ffi_get_params_json(engine, buffer.as_mut_ptr(), buffer.len()) };
        assert_eq!(written, required);

        let decoded: SynthParams = serde_json::from_slice(&buffer).unwrap();
        assert_eq!(decoded.volume, 0.23);

        unsafe { cosmo_pd101_ffi_engine_destroy(engine) };
    }

    #[test]
    fn ffi_rejects_render_blocks_larger_than_preallocated_capacity() {
        let engine = cosmo_pd101_ffi_engine_create(44_100.0, 8);
        assert!(!engine.is_null());
        let mut output = vec![0.0; 16];

        let status = unsafe { cosmo_pd101_ffi_render_mono(engine, output.as_mut_ptr(), 16) };
        assert_eq!(status, CosmoPd101FfiStatus::InvalidArgument);

        unsafe { cosmo_pd101_ffi_engine_destroy(engine) };
    }

    #[test]
    fn ffi_parameter_info_exposes_stable_automatable_metadata() {
        let count = cosmo_pd101_ffi_get_parameter_count();
        assert!(count >= 20);

        let mut info = CosmoPd101FfiParamInfo::default();
        let status = unsafe { cosmo_pd101_ffi_get_parameter_info(0, &mut info) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);
        assert_eq!(info.id, 1);

        let key = unsafe { CStr::from_ptr(info.key.as_ptr()) }
            .to_str()
            .unwrap();
        let label = unsafe { CStr::from_ptr(info.label.as_ptr()) }
            .to_str()
            .unwrap();
        assert_eq!(key, "volume");
        assert_eq!(label, "%");
        assert_eq!(info.min_value, 0.0);
        assert_eq!(info.max_value, 1.0);
        assert_eq!(info.flags & PARAM_FLAG_AUTOMATABLE, PARAM_FLAG_AUTOMATABLE);
    }

    #[test]
    fn ffi_parameter_value_updates_synth_params() {
        let engine = cosmo_pd101_ffi_engine_create(44_100.0, 64);
        assert!(!engine.is_null());

        let status = cosmo_pd101_ffi_set_parameter_value(engine, 1, 0.61);
        assert_eq!(status, CosmoPd101FfiStatus::Ok);

        let mut value = 0.0;
        let status = unsafe { cosmo_pd101_ffi_get_parameter_value(engine, 1, &mut value) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);
        assert!((value - 0.61).abs() < 0.000_001);

        let required = unsafe { cosmo_pd101_ffi_get_params_json(engine, ptr::null_mut(), 0) };
        let mut buffer = vec![0; required];
        unsafe { cosmo_pd101_ffi_get_params_json(engine, buffer.as_mut_ptr(), buffer.len()) };
        let decoded: SynthParams = serde_json::from_slice(&buffer).unwrap();
        assert!((decoded.volume - 0.61).abs() < 0.000_001);

        unsafe { cosmo_pd101_ffi_engine_destroy(engine) };
    }

    #[test]
    fn ffi_scope_copy_returns_rendered_samples_and_metadata() {
        let engine = cosmo_pd101_ffi_engine_create(48_000.0, 32);
        assert!(!engine.is_null());
        assert_eq!(
            cosmo_pd101_ffi_note_on(engine, 57, 0.0, 1.0),
            CosmoPd101FfiStatus::Ok,
        );

        let mut mono = vec![0.0; 32];
        let status = unsafe { cosmo_pd101_ffi_render_mono(engine, mono.as_mut_ptr(), mono.len()) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);

        let mut scope = vec![0; 32];
        let mut sample_rate = 0.0;
        let mut hz = 0.0;
        let copied = unsafe {
            cosmo_pd101_ffi_copy_scope_i8(
                engine,
                scope.as_mut_ptr(),
                scope.len(),
                &mut sample_rate,
                &mut hz,
            )
        };
        assert_eq!(copied, 32);
        assert_eq!(sample_rate, 48_000.0);
        assert!(hz > 0.0);

        unsafe { cosmo_pd101_ffi_engine_destroy(engine) };
    }

    #[test]
    fn ffi_scope_copy_f32_preserves_float_samples() {
        let engine = cosmo_pd101_ffi_engine_create(48_000.0, 32);
        assert!(!engine.is_null());
        assert_eq!(
            cosmo_pd101_ffi_note_on(engine, 57, 0.0, 1.0),
            CosmoPd101FfiStatus::Ok,
        );

        let mut mono = vec![0.0; 32];
        let status = unsafe { cosmo_pd101_ffi_render_mono(engine, mono.as_mut_ptr(), mono.len()) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);

        let required = unsafe {
            cosmo_pd101_ffi_copy_scope_f32(
                engine,
                ptr::null_mut(),
                0,
                ptr::null_mut(),
                ptr::null_mut(),
            )
        };
        assert_eq!(required, 32);
        let mut scope = vec![0.0; required];
        let mut sample_rate = 0.0;
        let mut hz = 0.0;
        let copied = unsafe {
            cosmo_pd101_ffi_copy_scope_f32(
                engine,
                scope.as_mut_ptr(),
                scope.len(),
                &mut sample_rate,
                &mut hz,
            )
        };
        assert_eq!(copied, 32);
        assert_eq!(sample_rate, 48_000.0);
        assert!(hz > 0.0);
        assert_eq!(scope, mono);

        unsafe { cosmo_pd101_ffi_engine_destroy(engine) };
    }

    #[test]
    fn ffi_mod_routes_roundtrip_and_produce_audible_lfo_output() {
        use cosmo_synth_engine::params::{ModDestination, ModMatrix, ModRoute, ModSource};

        let engine = cosmo_pd101_ffi_engine_create(44_100.0, 512);
        assert!(!engine.is_null());

        // Build SynthParams with an active LFO1→Volume mod route and non-zero LFO depth.
        let mut params = SynthParams::default();
        assert!(
            params.lfo.depth > 0.0,
            "SynthParams::default() must have lfo.depth > 0 (Rust default is 0.2)"
        );
        params.mod_matrix = ModMatrix {
            routes: vec![ModRoute {
                source: ModSource::Lfo1,
                destination: ModDestination::Volume,
                amount: 1.0,
                enabled: true,
            }],
        };
        let json = CString::new(serde_json::to_string(&params).unwrap()).unwrap();
        let status = unsafe { cosmo_pd101_ffi_set_params_json(engine, json.as_ptr()) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);

        // Verify mod routes survive the JSON roundtrip.
        let required = unsafe { cosmo_pd101_ffi_get_params_json(engine, ptr::null_mut(), 0) };
        assert!(required > 0);
        let mut buffer = vec![0u8; required];
        let written =
            unsafe { cosmo_pd101_ffi_get_params_json(engine, buffer.as_mut_ptr(), buffer.len()) };
        assert_eq!(written, required);
        let decoded: SynthParams = serde_json::from_slice(&buffer).unwrap();
        assert_eq!(decoded.mod_matrix.routes.len(), 1);
        assert!(decoded.mod_matrix.routes[0].enabled);
        assert_eq!(decoded.mod_matrix.routes[0].source, ModSource::Lfo1);
        assert_eq!(
            decoded.mod_matrix.routes[0].destination,
            ModDestination::Volume
        );
        assert!((decoded.mod_matrix.routes[0].amount - 1.0).abs() < 0.000_001);

        // Render two 512-sample blocks with a held note and verify that the peak amplitude
        // differs between them — confirming that the LFO is actually modulating the volume.
        assert_eq!(
            cosmo_pd101_ffi_note_on(engine, 60, 0.0, 1.0),
            CosmoPd101FfiStatus::Ok
        );
        let mut block1 = vec![0.0f32; 512];
        let mut block2 = vec![0.0f32; 512];
        let status =
            unsafe { cosmo_pd101_ffi_render_mono(engine, block1.as_mut_ptr(), block1.len()) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);
        let status =
            unsafe { cosmo_pd101_ffi_render_mono(engine, block2.as_mut_ptr(), block2.len()) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);

        let peak1: f32 = block1.iter().map(|s| s.abs()).fold(0.0, f32::max);
        let peak2: f32 = block2.iter().map(|s| s.abs()).fold(0.0, f32::max);
        assert!(peak1 > 0.0, "block1 should have audio output");
        assert!(peak2 > 0.0, "block2 should have audio output");
        // With LFO1 modulating volume at 5 Hz (1 full cycle / 44100 * 5 samples ≈ 8820),
        // two adjacent 512-sample blocks will have slightly different peak amplitudes.
        assert!(
            (peak1 - peak2).abs() > 0.000_001,
            "LFO modulation should produce differing peak amplitudes between blocks (peak1={peak1:.6}, peak2={peak2:.6})"
        );

        unsafe { cosmo_pd101_ffi_engine_destroy(engine) };
    }

    #[test]
    fn ffi_runtime_voice_states_json_reports_active_note() {
        let engine = cosmo_pd101_ffi_engine_create(44_100.0, 64);
        assert!(!engine.is_null());
        assert_eq!(
            cosmo_pd101_ffi_note_on(engine, 60, 0.0, 1.0),
            CosmoPd101FfiStatus::Ok,
        );

        let mut output = vec![0.0; 64];
        let status = unsafe { cosmo_pd101_ffi_render_mono(engine, output.as_mut_ptr(), 64) };
        assert_eq!(status, CosmoPd101FfiStatus::Ok);

        let required =
            unsafe { cosmo_pd101_ffi_get_runtime_voice_states_json(engine, ptr::null_mut(), 0) };
        assert!(required > 0);

        let mut buffer = vec![0; required];
        let written = unsafe {
            cosmo_pd101_ffi_get_runtime_voice_states_json(engine, buffer.as_mut_ptr(), buffer.len())
        };
        assert_eq!(written, required);

        let decoded: serde_json::Value = serde_json::from_slice(&buffer).unwrap();
        let voices = decoded.as_array().unwrap();
        assert!(voices.iter().any(|voice| {
            voice.get("active").and_then(|value| value.as_bool()) == Some(true)
                && voice.get("note").and_then(|value| value.as_u64()) == Some(60)
        }));

        unsafe { cosmo_pd101_ffi_engine_destroy(engine) };
    }
}
