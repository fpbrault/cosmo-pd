use super::{
    lerp, wrap01, AlgoControlAssignmentV1, AlgoControlKindV1, AlgoControlOptionV1, AlgoControlV1,
    AlgoDefinitionV1,
};
use crate::params::{Algo, AlgoControlId, AlgoControlSlots, CzWaveform, WindowType};
use serde::Serialize;
#[cfg(feature = "specta-bindings")]
use specta::Type;

const WAVEFORM_OPTIONS: [AlgoControlOptionV1; 8] = [
    AlgoControlOptionV1 {
        value: "saw",
        label: "Saw",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "square",
        label: "Square",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "pulse",
        label: "Pulse",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "null",
        label: "Null",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "sinePulse",
        label: "Sine Pulse",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "sawPulse",
        label: "Saw Pulse",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "multiSine",
        label: "Multi Sine",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "pulse2",
        label: "Pulse 2",
        set: &[],
    },
];

const WINDOW_OPTIONS: [AlgoControlOptionV1; 6] = [
    AlgoControlOptionV1 {
        value: "off",
        label: "Off",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "saw",
        label: "Saw",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "triangle",
        label: "Triangle",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "trapezoid",
        label: "Trapezoid",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "pulse",
        label: "Pulse",
        set: &[],
    },
    AlgoControlOptionV1 {
        value: "doubleSaw",
        label: "Double Saw",
        set: &[],
    },
];

const PRESET_CZ_SAW_SET: [AlgoControlAssignmentV1; 3] = [
    AlgoControlAssignmentV1 {
        control_id: "waveform1",
        value: 0.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "waveform2",
        value: 0.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "windowFunction",
        value: 0.0,
    },
];
const PRESET_CZ_SQUARE_SET: [AlgoControlAssignmentV1; 3] = [
    AlgoControlAssignmentV1 {
        control_id: "waveform1",
        value: 1.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "waveform2",
        value: 1.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "windowFunction",
        value: 0.0,
    },
];
const PRESET_CZ_PULSE_SET: [AlgoControlAssignmentV1; 3] = [
    AlgoControlAssignmentV1 {
        control_id: "waveform1",
        value: 2.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "waveform2",
        value: 2.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "windowFunction",
        value: 0.0,
    },
];
const PRESET_CZ_DOUBLE_SINE_SET: [AlgoControlAssignmentV1; 3] = [
    AlgoControlAssignmentV1 {
        control_id: "waveform1",
        value: 4.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "waveform2",
        value: 4.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "windowFunction",
        value: 0.0,
    },
];
const PRESET_CZ_SAW_PULSE_SET: [AlgoControlAssignmentV1; 3] = [
    AlgoControlAssignmentV1 {
        control_id: "waveform1",
        value: 5.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "waveform2",
        value: 5.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "windowFunction",
        value: 0.0,
    },
];
const PRESET_CZ_RESO1_SET: [AlgoControlAssignmentV1; 3] = [
    AlgoControlAssignmentV1 {
        control_id: "waveform1",
        value: 6.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "waveform2",
        value: 6.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "windowFunction",
        value: 1.0,
    },
];
const PRESET_CZ_RESO2_SET: [AlgoControlAssignmentV1; 3] = [
    AlgoControlAssignmentV1 {
        control_id: "waveform1",
        value: 6.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "waveform2",
        value: 6.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "windowFunction",
        value: 2.0,
    },
];
const PRESET_CZ_RESO3_SET: [AlgoControlAssignmentV1; 3] = [
    AlgoControlAssignmentV1 {
        control_id: "waveform1",
        value: 6.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "waveform2",
        value: 6.0,
    },
    AlgoControlAssignmentV1 {
        control_id: "windowFunction",
        value: 3.0,
    },
];

const PRESET_OPTIONS: [AlgoControlOptionV1; 8] = [
    AlgoControlOptionV1 {
        value: "czSaw",
        label: "CZ Saw",
        set: &PRESET_CZ_SAW_SET,
    },
    AlgoControlOptionV1 {
        value: "czSquare",
        label: "CZ Square",
        set: &PRESET_CZ_SQUARE_SET,
    },
    AlgoControlOptionV1 {
        value: "czPulse",
        label: "CZ Pulse",
        set: &PRESET_CZ_PULSE_SET,
    },
    AlgoControlOptionV1 {
        value: "czDoubleSine",
        label: "CZ Double Sine",
        set: &PRESET_CZ_DOUBLE_SINE_SET,
    },
    AlgoControlOptionV1 {
        value: "czSawPulse",
        label: "CZ Saw Pulse",
        set: &PRESET_CZ_SAW_PULSE_SET,
    },
    AlgoControlOptionV1 {
        value: "czReso1",
        label: "CZ Reso 1",
        set: &PRESET_CZ_RESO1_SET,
    },
    AlgoControlOptionV1 {
        value: "czReso2",
        label: "CZ Reso 2",
        set: &PRESET_CZ_RESO2_SET,
    },
    AlgoControlOptionV1 {
        value: "czReso3",
        label: "CZ Reso 3",
        set: &PRESET_CZ_RESO3_SET,
    },
];

const CZ_CONTROLS: [AlgoControlV1; 4] = [
    AlgoControlV1 {
        id: "preset",
        kind: AlgoControlKindV1::Select,
        control_type: super::AlgoControlPresentationV1::Dropdown,
        bipolar: false,
        icon_name: None,
        min: None,
        max: None,
        default: Some(0.0),
        default_toggle: None,
        options: &PRESET_OPTIONS,
        readout_format: crate::params::EngineParamReadoutFormatV1::Raw,
    },
    AlgoControlV1 {
        id: "waveform1",
        kind: AlgoControlKindV1::Select,
        control_type: super::AlgoControlPresentationV1::Dropdown,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(7.0),
        default: Some(0.0),
        default_toggle: None,
        options: &WAVEFORM_OPTIONS,
        readout_format: crate::params::EngineParamReadoutFormatV1::Raw,
    },
    AlgoControlV1 {
        id: "waveform2",
        kind: AlgoControlKindV1::Select,
        control_type: super::AlgoControlPresentationV1::Dropdown,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(7.0),
        default: Some(0.0),
        default_toggle: None,
        options: &WAVEFORM_OPTIONS,
        readout_format: crate::params::EngineParamReadoutFormatV1::Raw,
    },
    AlgoControlV1 {
        id: "windowFunction",
        kind: AlgoControlKindV1::Select,
        control_type: super::AlgoControlPresentationV1::Dropdown,
        bipolar: false,
        icon_name: None,
        min: Some(0.0),
        max: Some(5.0),
        default: Some(0.0),
        default_toggle: None,
        options: &WINDOW_OPTIONS,
        readout_format: crate::params::EngineParamReadoutFormatV1::Raw,
    },
];

pub const DEFINITION: AlgoDefinitionV1 = AlgoDefinitionV1 {
    id: Algo::Cz101,
    name: "CZ101",
    icon_path: "M4,12 L20,12",
    visible: true,
    default_base_waveform: crate::params::BaseWaveform::Cosine,
    controls: &CZ_CONTROLS,
};

/// A named CZ waveform combination preset (slot A waveform, slot B waveform, window function).
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct CzPresetV1 {
    pub id: &'static str,
    pub label: &'static str,
    pub waveform1: CzWaveform,
    pub waveform2: CzWaveform,
    pub window_function: WindowType,
}

pub const CZ_PRESETS: [CzPresetV1; 8] = [
    CzPresetV1 {
        id: "czSaw",
        label: "CZ Saw",
        waveform1: CzWaveform::Saw,
        waveform2: CzWaveform::Saw,
        window_function: WindowType::Off,
    },
    CzPresetV1 {
        id: "czSquare",
        label: "CZ Square",
        waveform1: CzWaveform::Square,
        waveform2: CzWaveform::Square,
        window_function: WindowType::Off,
    },
    CzPresetV1 {
        id: "czPulse",
        label: "CZ Pulse",
        waveform1: CzWaveform::Pulse,
        waveform2: CzWaveform::Pulse,
        window_function: WindowType::Off,
    },
    CzPresetV1 {
        id: "czDoubleSine",
        label: "CZ Double Sine",
        waveform1: CzWaveform::SinePulse,
        waveform2: CzWaveform::SinePulse,
        window_function: WindowType::Off,
    },
    CzPresetV1 {
        id: "czSawPulse",
        label: "CZ Saw Pulse",
        waveform1: CzWaveform::SawPulse,
        waveform2: CzWaveform::SawPulse,
        window_function: WindowType::Off,
    },
    CzPresetV1 {
        id: "czReso1",
        label: "CZ Reso 1",
        waveform1: CzWaveform::MultiSine,
        waveform2: CzWaveform::MultiSine,
        window_function: WindowType::Saw,
    },
    CzPresetV1 {
        id: "czReso2",
        label: "CZ Reso 2",
        waveform1: CzWaveform::MultiSine,
        waveform2: CzWaveform::MultiSine,
        window_function: WindowType::Triangle,
    },
    CzPresetV1 {
        id: "czReso3",
        label: "CZ Reso 3",
        waveform1: CzWaveform::MultiSine,
        waveform2: CzWaveform::MultiSine,
        window_function: WindowType::Trapezoid,
    },
];

/// Resolve the active CZ slot waveform for the current cycle.
#[inline(always)]
pub fn resolve_cycle_waveform(
    slot_a: CzWaveform,
    slot_b: CzWaveform,
    cycle_count: u32,
) -> CzWaveform {
    if cycle_count & 1 == 0 {
        slot_a
    } else {
        slot_b
    }
}

/// Compute CZ phase transfer from front-panel CZ controls.
///
/// `window_function` is consumed here for a single authoritative control path,
/// but phase transfer itself is waveform-driven; amplitude shaping is applied
/// later in the voice render path.
#[inline(always)]
pub fn warp_phase_from_controls(
    waveform1: CzWaveform,
    waveform2: CzWaveform,
    window_function: WindowType,
    cycle_count: u32,
    phase: f32,
    dcw: f32,
) -> f32 {
    let _ = window_function;
    let waveform = resolve_cycle_waveform(waveform1, waveform2, cycle_count);
    warp_phase_for_waveform(waveform, phase, dcw)
}

#[derive(Debug, Clone, Copy)]
pub struct ResolvedCzControls {
    pub waveform1: CzWaveform,
    pub waveform2: CzWaveform,
    pub window_function: WindowType,
}

impl Default for ResolvedCzControls {
    fn default() -> Self {
        Self {
            waveform1: CzWaveform::Saw,
            waveform2: CzWaveform::Saw,
            window_function: WindowType::Off,
        }
    }
}

fn find_control_value(entries: &AlgoControlSlots, control_id: AlgoControlId) -> Option<f32> {
    entries
        .iter()
        .flatten()
        .find(|entry| entry.id == control_id)
        .map(|entry| entry.value)
}

fn decode_waveform(value: f32) -> CzWaveform {
    match (value).round().clamp(0.0, 7.0) as i32 {
        0 => CzWaveform::Saw,
        1 => CzWaveform::Square,
        2 => CzWaveform::Pulse,
        3 => CzWaveform::Null,
        4 => CzWaveform::SinePulse,
        5 => CzWaveform::SawPulse,
        6 => CzWaveform::MultiSine,
        7 => CzWaveform::Pulse2,
        _ => CzWaveform::Saw,
    }
}

fn decode_window(value: f32) -> WindowType {
    match (value).round().clamp(0.0, 5.0) as i32 {
        0 => WindowType::Off,
        1 => WindowType::Saw,
        2 => WindowType::Triangle,
        3 => WindowType::Trapezoid,
        4 => WindowType::Pulse,
        5 => WindowType::DoubleSaw,
        _ => WindowType::Off,
    }
}

pub fn resolve_cz_controls(entries: &AlgoControlSlots) -> ResolvedCzControls {
    ResolvedCzControls {
        waveform1: find_control_value(entries, AlgoControlId::Waveform1)
            .map(decode_waveform)
            .unwrap_or(CzWaveform::Saw),
        waveform2: find_control_value(entries, AlgoControlId::Waveform2)
            .map(decode_waveform)
            .unwrap_or(CzWaveform::Saw),
        window_function: find_control_value(entries, AlgoControlId::WindowFunction)
            .map(decode_window)
            .unwrap_or(WindowType::Off),
    }
}

pub fn resolve_algo(algo: Algo, algo_controls: &AlgoControlSlots, cycle_count: u32) -> Algo {
    if algo == Algo::Cz101 {
        let controls = resolve_cz_controls(algo_controls);
        return Algo::from_cz_waveform(resolve_cycle_waveform(
            controls.waveform1,
            controls.waveform2,
            cycle_count,
        ));
    }

    algo
}

pub fn resolve_window(
    algo: Algo,
    algo_controls: &AlgoControlSlots,
    fallback: WindowType,
) -> WindowType {
    if algo == Algo::Cz101 {
        return resolve_cz_controls(algo_controls).window_function;
    }

    fallback
}

/// Dispatch CZ waveform transfer by waveform id.
#[inline(always)]
pub fn warp_phase_for_waveform(waveform: CzWaveform, phi: f32, dcw: f32) -> f32 {
    match waveform {
        CzWaveform::Saw => warp_phase_saw(phi, dcw),
        CzWaveform::Square => warp_phase_square(phi, dcw),
        CzWaveform::Pulse => warp_phase_pulse(phi, dcw),
        CzWaveform::Null => warp_phase_null(phi, dcw),
        CzWaveform::SinePulse => warp_phase_sine_pulse(phi, dcw),
        CzWaveform::SawPulse => warp_phase_saw_pulse(phi, dcw),
        CzWaveform::MultiSine => warp_phase_multi_sine(phi, dcw),
        CzWaveform::Pulse2 => warp_phase_pulse2(phi, dcw),
    }
}

#[inline(always)]
fn warp_phase_saw(phi: f32, dcw: f32) -> f32 {
    let dcw = dcw.clamp(0.0, 0.999);
    let p_peak = lerp(0.5, 0.01, dcw);

    if phi < p_peak {
        (phi / p_peak) * 0.5
    } else {
        0.5 + ((phi - p_peak) / (1.0 - p_peak)) * 0.5
    }
}

#[inline(always)]
fn warp_phase_square(phi: f32, dcw: f32) -> f32 {
    let dcw = dcw.clamp(0.0, 0.999);
    let p_peak = lerp(0.5, 0.01, dcw);
    let p_fall = lerp(1.0, 0.51, dcw);

    if phi < p_peak {
        (phi / p_peak) * 0.5
    } else if phi < 0.5 {
        0.5
    } else if phi < p_fall {
        0.5 + ((phi - 0.5) / (p_fall - 0.5)) * 0.5
    } else {
        1.0
    }
}

#[inline(always)]
fn warp_phase_pulse(phi: f32, dcw: f32) -> f32 {
    let dcw = dcw.clamp(0.0, 0.999);
    let p_peak = lerp(0.5, 0.01, dcw);
    let p_hold = lerp(0.5, 0.03, dcw);
    let p_fall = lerp(1.0, 0.04, dcw);

    if phi < p_peak {
        (phi / p_peak) * 0.5
    } else if phi < p_hold {
        0.5
    } else if phi < p_fall {
        0.5 + ((phi - p_hold) / (p_fall - p_hold)) * 0.5
    } else {
        1.0
    }
}

#[inline(always)]
fn warp_phase_null(phi: f32, dcw: f32) -> f32 {
    let dcw = dcw.clamp(0.0, 0.999);
    let p_peak = lerp(0.5, 0.01, dcw);

    if phi < p_peak {
        (phi / p_peak) * 0.5
    } else {
        1.0
    }
}

#[inline(always)]
fn warp_phase_sine_pulse(phi: f32, dcw: f32) -> f32 {
    let dcw = dcw.clamp(0.0, 0.999);
    let p_end = lerp(1.0, 0.5, dcw);

    if p_end >= 0.999 {
        phi
    } else if phi < p_end {
        phi / p_end
    } else {
        (phi - p_end) / (1.0 - p_end)
    }
}

#[inline(always)]
fn warp_phase_saw_pulse(phi: f32, dcw: f32) -> f32 {
    let dcw = dcw.clamp(0.0, 0.999);
    let p_peak = lerp(0.5, 0.01, dcw);
    let p_end = lerp(1.0, 0.5, dcw);

    if phi < p_peak {
        (phi / p_peak) * 0.5
    } else if phi < p_end {
        0.5 + ((phi - p_peak) / (p_end - p_peak)) * 0.5
    } else {
        1.0
    }
}

#[inline(always)]
fn warp_phase_multi_sine(phi: f32, dcw: f32) -> f32 {
    let dcw = dcw.clamp(0.0, 0.999);
    wrap01(phi * lerp(1.0, 15.0, dcw))
}

#[inline(always)]
fn warp_phase_pulse2(phi: f32, dcw: f32) -> f32 {
    let dcw = dcw.clamp(0.0, 0.999);
    let p = wrap01(phi * 2.0);
    let p_peak = lerp(0.5, 0.01, dcw);
    let p_hold = lerp(0.5, 0.01, dcw);
    let p_fall = lerp(1.0, 0.01, dcw);

    if p < p_peak {
        (p / p_peak) * 0.5
    } else if p < p_hold {
        0.5
    } else if p < p_fall {
        0.5 + ((p - p_hold) / (p_fall - p_hold)) * 0.5
    } else {
        1.0
    }
}

/// CZ101 phase behavior (passthrough in warp stage).
pub fn warp_phase(phase: f32, _amt: f32) -> f32 {
    phase
}
