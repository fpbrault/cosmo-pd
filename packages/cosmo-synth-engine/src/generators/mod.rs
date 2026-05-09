use crate::dsp_utils::{apply_window, lerp, wrap01, TWO_PI};
use crate::params::{Algo, AlgoControlValueV1, BaseWaveform, LineParams};

/// Reference per-line output headroom used by processor normalization.
pub const PER_LINE_HEADROOM: f32 = 0.25;

pub mod bend;
pub mod catalog;
pub mod clip;
pub mod cz101;
pub use cz101::{CzPresetV1, CZ_PRESETS};
pub mod fof;
pub mod fold;
pub mod karpunk;
pub mod mirror;
pub mod pinch;
pub mod quantize;
pub mod ripple;
pub mod sine;
pub mod skew;
pub mod sync;
pub mod twist;

pub use catalog::{
    algo_definitions_v1, algo_ui_catalog_v1, AlgoControlAssignmentV1, AlgoControlKindV1,
    AlgoControlOptionV1, AlgoControlPresentationV1, AlgoControlV1, AlgoDefinitionV1,
    AlgoUiEntryV1, ALGO_DEFINITIONS_V1, ALGO_BLEND_NUMBER_CONTROL, DCW_CONTROL,
    FINE_DETUNE_NUMBER_CONTROL, KEY_FOLLOW_NUMBER_CONTROL, LEVEL_NUMBER_CONTROL, NO_CONTROLS,
    NO_CONTROL_OPTIONS, OCTAVE_NUMBER_CONTROL, WARP_AMOUNT_CONTROL, WARP_AMOUNT_NUMBER_CONTROL,
};

/// Per-line render inputs passed to a voice's generator for one sample.
#[derive(Debug, Clone, Copy)]
pub struct LineRenderConfig<'a> {
    pub primary_algo: Algo,
    pub secondary_algo: Option<Algo>,
    pub blend: f32,
    pub phase: f32,
    pub primary_window_gain: f32,
    pub secondary_window_gain: f32,
    pub final_dcw: f32,
    pub final_dca: f32,
    pub primary_base_waveform: BaseWaveform,
    pub secondary_base_waveform: BaseWaveform,
    pub effective_freq: f32,
    pub sample_rate: f32,
    pub primary_algo_controls: Option<&'a [AlgoControlValueV1]>,
    pub secondary_algo_controls: Option<&'a [AlgoControlValueV1]>,
    pub algo_param_mods: [f32; 8],
    /// Post-warp phase modulation offset (non-zero only when pm_pre=false).
    pub pm_post_mod: f32,
}

impl<'a> LineRenderConfig<'a> {
    /// Build a `LineRenderConfig` from line parameters, resolving algorithm and window
    /// choices internally without exposing CZ-specific details to the caller.
    #[allow(clippy::too_many_arguments)]
    pub fn from_line(
        line: &'a LineParams,
        cycle_count: u32,
        window_phi: f32,
        phase: f32,
        final_dcw: f32,
        final_dca: f32,
        effective_freq: f32,
        sample_rate: f32,
        algo_param_mods: [f32; 8],
        pm_post_mod: f32,
    ) -> Self {
        let primary_algo_controls = line.algo_controls_a.as_deref();
        let secondary_algo_controls = line.algo_controls_b.as_deref();
        let primary_algo = cz101::resolve_algo(line.algo, primary_algo_controls, cycle_count);
        let secondary_algo = line
            .algo2
            .map(|algo| cz101::resolve_algo(algo, secondary_algo_controls, cycle_count));
        let primary_window_gain = apply_window(
            window_phi,
            cz101::resolve_window(line.algo, primary_algo_controls, line.window),
        );
        let secondary_window_gain = line
            .algo2
            .map(|algo| {
                apply_window(
                    window_phi,
                    cz101::resolve_window(algo, secondary_algo_controls, line.window),
                )
            })
            .unwrap_or(primary_window_gain);
        Self {
            primary_algo,
            secondary_algo,
            blend: line.algo_blend,
            phase,
            primary_window_gain,
            secondary_window_gain,
            final_dcw,
            final_dca,
            primary_base_waveform: line.base_waveform_a,
            secondary_base_waveform: line.base_waveform_b,
            effective_freq,
            sample_rate,
            primary_algo_controls,
            secondary_algo_controls,
            algo_param_mods,
            pm_post_mod,
        }
    }
}

/// Per-voice state for any generator algorithms that need note-lifetime memory.
///
/// Today this wraps Karpunk state only. Keeping the API here avoids leaking
/// individual stateful algorithm details into the processor or voice layers.
#[derive(Debug, Clone, Default)]
pub struct AlgoRuntimeState {
    karpunk: karpunk::KarpunkPair,
}

impl AlgoRuntimeState {
    /// Create empty state for all state-aware algorithms used by one voice.
    pub fn new() -> Self {
        Self::default()
    }

    /// Reset note-scoped state when a voice starts a new note.
    pub fn note_on(&mut self, note: u8) {
        self.karpunk.reseed_for_note(note);
    }

    /// Render line 1, applying any stateful algorithm behavior as needed.
    pub fn render_line1(&mut self, config: LineRenderConfig<'_>) -> (f32, Option<f32>) {
        if karpunk::requires_state_tick(config.primary_algo, config.secondary_algo) {
            self.karpunk.render_line1(config)
        } else {
            render_line_stateless(config)
        }
    }

    /// Render line 2, applying any stateful algorithm behavior as needed.
    pub fn render_line2(&mut self, config: LineRenderConfig<'_>) -> (f32, Option<f32>) {
        if karpunk::requires_state_tick(config.primary_algo, config.secondary_algo) {
            self.karpunk.render_line2(config)
        } else {
            render_line_stateless(config)
        }
    }
}

#[inline(always)]
fn render_line_stateless(config: LineRenderConfig<'_>) -> (f32, Option<f32>) {
    let sample = if let Some(secondary_algo) = config.secondary_algo {
        let secondary_dcw = config.final_dcw * config.blend;
        let primary_dcw = config.final_dcw * (1.0 - config.blend);
        let primary = render_algo_sample(
            config.primary_algo,
            config.phase,
            primary_dcw,
            config.primary_base_waveform,
            config.primary_algo_controls,
            config.algo_param_mods,
            None,
            config.pm_post_mod,
        ) * config.primary_window_gain;
        let secondary = render_algo_sample(
            secondary_algo,
            config.phase,
            secondary_dcw,
            config.secondary_base_waveform,
            config.secondary_algo_controls,
            config.algo_param_mods,
            None,
            config.pm_post_mod,
        ) * config.secondary_window_gain;
        blend_line_samples(config.primary_algo, primary, secondary, config.blend)
    } else {
        render_algo_sample(
            config.primary_algo,
            config.phase,
            config.final_dcw,
            config.primary_base_waveform,
            config.primary_algo_controls,
            config.algo_param_mods,
            None,
            config.pm_post_mod,
        ) * config.primary_window_gain
    };

    (sample * config.final_dca * PER_LINE_HEADROOM, None)
}

#[inline(always)]
fn sample_base_wave(base_waveform: BaseWaveform, phase: f32) -> f32 {
    let p = wrap01(phase);
    match base_waveform {
        BaseWaveform::Cosine => -libm::cosf(TWO_PI * p),
        BaseWaveform::Sine => libm::sinf(TWO_PI * p),
        BaseWaveform::Triangle => 1.0 - 4.0 * libm::fabsf(p - 0.5),
        BaseWaveform::Saw => p * 2.0 - 1.0,
        BaseWaveform::Square => {
            if p < 0.5 {
                1.0
            } else {
                -1.0
            }
        }
    }
}

#[inline(always)]
pub(crate) fn blend_line_samples(
    primary_algo: Algo,
    primary: f32,
    secondary: f32,
    blend: f32,
) -> f32 {
    if primary_algo == Algo::Karpunk {
        primary + (primary * secondary * 2.0 - primary) * blend
    } else {
        primary + (secondary - primary) * blend
    }
}

/// Unified algorithm phase warp dispatcher.
fn algo_control_slot_index(algo: Algo, id: &str) -> Option<usize> {
    let definition = ALGO_DEFINITIONS_V1
        .iter()
        .find(|definition| definition.id == algo)?;
    let mut slot_index = 0usize;
    for control in definition.controls {
        if control.kind == AlgoControlKindV1::Number {
            if control.id == id {
                return Some(slot_index);
            }
            slot_index += 1;
            if slot_index >= 8 {
                break;
            }
        }
    }
    None
}

pub(crate) fn resolve_algo_control_value(
    algo: Algo,
    algo_controls: Option<&[AlgoControlValueV1]>,
    id: &str,
    fallback: f32,
    algo_param_mods: &[f32; 8],
) -> f32 {
    let mut value = fallback;
    if let Some(entries) = algo_controls {
        if let Some(entry) = entries.iter().find(|entry| entry.id == id) {
            value = entry.value;
        }
    }
    if let Some(slot_index) = algo_control_slot_index(algo, id) {
        value += algo_param_mods[slot_index];
    }
    value
}

pub fn warp_phase(
    algo: Algo,
    phase: f32,
    amt: f32,
    algo_controls: Option<&[AlgoControlValueV1]>,
    algo_param_mods: &[f32; 8],
) -> f32 {
    if amt == 0.0 && !algo.is_cz_waveform() {
        return phase;
    }

    match algo {
        Algo::Saw => cz101::warp_phase_for_waveform(crate::params::CzWaveform::Saw, phase, amt),
        Algo::Square => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::Square, phase, amt)
        }
        Algo::Pulse => cz101::warp_phase_for_waveform(crate::params::CzWaveform::Pulse, phase, amt),
        Algo::Null => cz101::warp_phase_for_waveform(crate::params::CzWaveform::Null, phase, amt),
        Algo::SinePulse => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::SinePulse, phase, amt)
        }
        Algo::SawPulse => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::SawPulse, phase, amt)
        }
        Algo::MultiSine => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::MultiSine, phase, amt)
        }
        Algo::Pulse2 => {
            cz101::warp_phase_for_waveform(crate::params::CzWaveform::Pulse2, phase, amt)
        }
        Algo::Cz101 => cz101::warp_phase(phase, amt),
        Algo::Bend => bend::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "bendCurve", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "bendBias", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "bendKnee", 0.5, algo_param_mods),
        ),
        Algo::Sync => sync::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "syncRatio", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "syncPhase", 0.0, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "syncCurve", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "syncWindow", 0.5, algo_param_mods),
        ),
        Algo::Pinch => pinch::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "pinchFocus", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "pinchAsym", 0.0, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "pinchCurve", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "pinchDrive", 0.5, algo_param_mods),
        ),
        Algo::Fold => fold::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "foldStages", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "foldTilt", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "foldSymmetry", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "foldSoftness", 0.0, algo_param_mods),
        ),
        Algo::Skew => skew::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "skewBias", 0.2, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "skewCurve", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "skewSpread", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "skewTilt", 0.5, algo_param_mods),
        ),
        Algo::Quantize => quantize::warp_phase(
            phase,
            resolve_algo_control_value(algo, algo_controls, "quantizeAmount", amt, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "quantizeSteps", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "quantizeSkew", 0.5, algo_param_mods),
        ),
        Algo::Twist => twist::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "twistHarmonics", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "twistDepth", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "twistPhase", 0.0, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "twistShape", 0.5, algo_param_mods),
        ),
        Algo::Clip => clip::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "clipDrive", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "clipShape", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "clipBias", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "clipSoft", 0.0, algo_param_mods),
        ),
        Algo::Ripple => ripple::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "rippleFreq", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "rippleDepth", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "ripplePhase", 0.0, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "rippleShape", 0.5, algo_param_mods),
        ),
        Algo::Mirror => mirror::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "mirrorCenter", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "mirrorBlend", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "mirrorClip", 0.0, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "mirrorSkew", 0.5, algo_param_mods),
        ),
        Algo::Fof => fof::warp_phase(
            phase,
            amt,
            resolve_algo_control_value(algo, algo_controls, "fofRatio", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "fofTightness", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "fofOffset", 0.5, algo_param_mods),
            resolve_algo_control_value(algo, algo_controls, "fofSkew", 0.5, algo_param_mods),
        ),
        Algo::Sine => sine::warp_phase(phase, amt),
        Algo::Karpunk => phase,
    }
}

fn render_direct_algo_sample(algo: Algo) -> Option<f32> {
    let _ = algo;
    None
}

/// Unified algorithm sample renderer used by voice and utility paths.
///
/// `runtime_sample` is used only when an algorithm is rendered by per-voice state.
#[allow(clippy::too_many_arguments)]
pub fn render_algo_sample(
    algo: Algo,
    phase: f32,
    dcw: f32,
    base_waveform: BaseWaveform,
    algo_controls: Option<&[AlgoControlValueV1]>,
    algo_param_mods: [f32; 8],
    runtime_sample: Option<f32>,
    pm_post_mod: f32,
) -> f32 {
    if algo == Algo::Karpunk {
        return runtime_sample.unwrap_or(0.0);
    }
    if let Some(sample) = render_direct_algo_sample(algo) {
        return sample;
    }
    let warped = warp_phase(algo, phase, dcw, algo_controls, &algo_param_mods);
    sample_base_wave(base_waveform, warped + pm_post_mod)
}

#[cfg(test)]
mod tests {
    use super::render_line_stateless;
    use super::LineRenderConfig;
    use crate::params::{Algo, BaseWaveform};

    #[test]
    fn stateless_render_applies_algo_param_mods() {
        let base = LineRenderConfig {
            primary_algo: Algo::Bend,
            secondary_algo: None,
            blend: 0.0,
            phase: 0.37,
            primary_window_gain: 1.0,
            secondary_window_gain: 1.0,
            final_dcw: 1.0,
            final_dca: 1.0,
            primary_base_waveform: BaseWaveform::Cosine,
            secondary_base_waveform: BaseWaveform::Cosine,
            effective_freq: 220.0,
            sample_rate: 44100.0,
            primary_algo_controls: None,
            secondary_algo_controls: None,
            algo_param_mods: [0.0; 8],
            pm_post_mod: 0.0,
        };

        let modded = LineRenderConfig {
            algo_param_mods: [0.75, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            ..base
        };

        let (base_sample, _) = render_line_stateless(base);
        let (modded_sample, _) = render_line_stateless(modded);
        assert_ne!(base_sample, modded_sample);
    }
}
