use super::{AlgoControlKindV1, AlgoControlV1, AlgoDefinitionV1, NO_CONTROL_OPTIONS};
use crate::dsp_utils::wrap01;
use crate::params::{Algo, EngineParamReadoutFormatV1};

const CONTROLS: [AlgoControlV1; 3] = [
    AlgoControlV1 {
        id: "noiseLabDensity",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.5),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "noiseLabJitter",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.4),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
    AlgoControlV1 {
        id: "noiseLabBlend",
        kind: AlgoControlKindV1::Number,
        control_type: super::AlgoControlPresentationV1::Knob,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(1.0),
        default: Some(0.5),
        default_toggle: None,
        options: &NO_CONTROL_OPTIONS,
        readout_format: EngineParamReadoutFormatV1::Percent,
    },
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::NoiseLab,
    name: "NoiseLab",
    icon_path: "M4,12 L6,8 L8,15 L10,6 L12,16 L14,9 L16,13 L18,7 L20,12",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Cosine,
    controls: &CONTROLS,
};

#[inline]
fn hash01(x: f32) -> f32 {
    let h = libm::sinf(x * 127.1 + 311.7) * 43_758.547;
    h - libm::floorf(h)
}

#[inline]
fn smoothstep01(t: f32) -> f32 {
    let x = t.clamp(0.0, 1.0);
    x * x * (3.0 - 2.0 * x)
}

#[inline]
fn cosine_to_saw_phase(phase: f32) -> f32 {
    libm::acosf((1.0 - phase * 2.0).clamp(-1.0, 1.0)) / core::f32::consts::TAU
}

/// NoiseLab: cosine-base morph to saw happens first, then noisy segmentation is applied.
pub fn warp_phase(phase: f32, amt: f32, density: f32, jitter: f32, blend: f32) -> f32 {
    let amt_clamped = amt.clamp(0.0, 1.0);
    let saw_phase = cosine_to_saw_phase(phase);
    let base_phase = phase + (saw_phase - phase) * amt_clamped;

    let segments = 2.0 + density.clamp(0.0, 1.0) * 34.0;
    let p_seg = base_phase * segments;
    let seg_index = libm::floorf(p_seg);
    let local = p_seg - seg_index;

    let rand_a = hash01(seg_index + 1.0) * 2.0 - 1.0;
    let rand_b = hash01(seg_index + 2.0) * 2.0 - 1.0;
    let walk = rand_a + (rand_b - rand_a) * smoothstep01(local);

    let jitter_mod = jitter.clamp(0.0, 1.0);
    let noise_phase =
        base_phase * (47.0 + density.clamp(0.0, 1.0) * 173.0) + hash01(seg_index + 37.0) * 0.73;
    let noise_index = libm::floorf(noise_phase * 64.0);
    let noise_frac = noise_phase * 64.0 - noise_index;
    let white_a = hash01(noise_index + 101.0) * 2.0 - 1.0;
    let white_b = hash01(noise_index + 102.0) * 2.0 - 1.0;
    let white = (white_a + (white_b - white_a) * smoothstep01(noise_frac)) * 2.0;

    let edge_noise = ((hash01(seg_index + 19.0) - 0.5) * 0.5 + white * 0.5) * jitter_mod * 0.35;
    let edge = (0.5 + edge_noise).clamp(0.05, 0.95);
    let gate = if local < edge { 1.0 } else { -1.0 };

    let noisy_walk = walk * (1.0 - jitter_mod * 0.5) + white * jitter_mod * 0.5;
    let offset =
        noisy_walk * gate * (0.01 + 0.14 * jitter_mod) * (0.2 + 0.8 * blend.clamp(0.0, 1.0));
    wrap01(base_phase + offset * (0.35 + 0.65 * density.clamp(0.0, 1.0)) * amt_clamped)
}
