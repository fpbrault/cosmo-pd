use crate::dsp_utils::{TWO_PI, apply_window, wrap01};
use crate::params::{Algo, BaseWaveform, LineParams};
use crate::render_cache::CompiledLinePlan;

/// Reference per-line output headroom used by processor normalization.
pub const PER_LINE_HEADROOM: f32 = 0.25;
const BLEND_SHORT_CIRCUIT_EPSILON: f32 = 0.03;

pub mod bend;
pub mod catalog;
pub mod clip;
pub mod cz101;
pub use cz101::{CZ_PRESETS, CzPresetV1};
pub mod cheby;
pub mod fof;
pub mod fold;
pub mod karpunk;
pub mod mirror;
pub mod pinch;
pub mod ripple;
pub mod skew;
pub mod stutter;
pub mod sync;
pub mod terrain;
pub mod twist;

pub use catalog::{
    ALGO_BLEND_NUMBER_CONTROL, ALGO_DEFINITIONS_V1, AlgoControlAssignmentV1, AlgoControlKindV1,
    AlgoControlOptionV1, AlgoControlPresentationV1, AlgoControlV1, AlgoDefinitionV1, AlgoUiEntryV1,
    DCW_CONTROL, FINE_DETUNE_NUMBER_CONTROL, KEY_FOLLOW_NUMBER_CONTROL, LEVEL_NUMBER_CONTROL,
    NO_CONTROL_OPTIONS, NO_CONTROLS, OCTAVE_NUMBER_CONTROL, WARP_AMOUNT_CONTROL,
    WARP_AMOUNT_NUMBER_CONTROL, algo_definitions_v1, algo_ui_catalog_v1,
};

/// Per-line render inputs passed to a voice's generator for one sample.
#[derive(Debug, Clone, Copy)]
pub struct LineRenderConfig {
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
    pub primary_control_values: [f32; 8],
    pub secondary_control_values: [f32; 8],
    pub algo_param_mods: [f32; 8],
    pub pm_post_mod: f32,
}

impl LineRenderConfig {
    #[inline(always)]
    #[allow(clippy::too_many_arguments)]
    pub fn from_line(
        line: &LineParams,
        cycle_count: u32,
        window_phi: f32,
        phase: f32,
        final_dcw: f32,
        final_dca: f32,
        effective_freq: f32,
        sample_rate: f32,
        algo_param_mods: [f32; 8],
        pm_post_mod: f32,
        primary_control_values: [f32; 8],
        secondary_control_values: [f32; 8],
    ) -> Self {
        let primary_algo_controls = &line.algo_controls_a;
        let secondary_algo_controls = &line.algo_controls_b;
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
            primary_control_values,
            secondary_control_values,
            algo_param_mods,
            pm_post_mod,
        }
    }

    #[inline(always)]
    #[allow(clippy::too_many_arguments)]
    pub(crate) fn from_compiled_line(
        plan: &CompiledLinePlan,
        line: &LineParams,
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
        let primary = plan.primary;
        let secondary = plan.secondary;
        let primary_algo = primary.algo_for_cycle(cycle_count);
        let secondary_algo = secondary.map(|slot| slot.algo_for_cycle(cycle_count));
        let primary_window_gain = apply_window(window_phi, primary.window);
        let secondary_window_gain = secondary
            .map(|slot| apply_window(window_phi, slot.window))
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
            primary_base_waveform: primary.base_waveform,
            secondary_base_waveform: secondary
                .map(|slot| slot.base_waveform)
                .unwrap_or(primary.base_waveform),
            effective_freq,
            sample_rate,
            primary_control_values: primary.control_values,
            secondary_control_values: secondary
                .map(|slot| slot.control_values)
                .unwrap_or([0.0; 8]),
            algo_param_mods,
            pm_post_mod,
        }
    }
}

/// Per-line state slot for stateful algorithms.
#[derive(Debug, Clone)]
pub(crate) enum LineAlgoState {
    None,
    Karpunk(karpunk::KarpunkState),
}

/// Per-voice state for any generator algorithms that need note-lifetime memory.
///
/// Each line owns its own state slot. The enum dispatch avoids heap allocation
/// for algorithms that do not need persistent state.
#[derive(Debug, Clone)]
pub struct AlgoRuntimeState {
    line_states: [LineAlgoState; 2],
}

impl AlgoRuntimeState {
    /// Create empty state for all state-aware algorithms used by one voice.
    pub fn new() -> Self {
        Self {
            line_states: [LineAlgoState::None, LineAlgoState::None],
        }
    }

    /// Reset note-scoped state when a voice starts a new note.
    pub fn note_on(&mut self, note: u8) {
        for (i, state) in self.line_states.iter_mut().enumerate() {
            if let LineAlgoState::Karpunk(ks) = state {
                if i == 0 {
                    ks.reseed_for_note(note);
                } else {
                    ks.reseed_for_note(note.wrapping_add(1));
                }
            }
        }
    }

    /// Render a line (0 or 1), applying any stateful algorithm behavior as needed.
    pub fn render_line(
        &mut self,
        line_idx: usize,
        config: LineRenderConfig,
    ) -> (f32, Option<f32>) {
        if karpunk::requires_state_tick(config.primary_algo, config.secondary_algo) {
            let state = match &mut self.line_states[line_idx] {
                LineAlgoState::Karpunk(state) => state,
                slot @ LineAlgoState::None => {
                    let seed = if line_idx == 0 {
                        karpunk::DEFAULT_PRNG_SEED
                    } else {
                        karpunk::DEFAULT_PRNG_SEED ^ karpunk::SECONDARY_PRNG_SALT
                    };
                    *slot = LineAlgoState::Karpunk(karpunk::KarpunkState::new(seed));
                    match slot {
                        LineAlgoState::Karpunk(state) => state,
                        _ => unreachable!(),
                    }
                }
            };
            karpunk::render_stateful_line(state, config)
        } else {
            render_line_stateless(config)
        }
    }
}

impl Default for AlgoRuntimeState {
    fn default() -> Self {
        Self::new()
    }
}

#[inline(always)]
pub(crate) fn render_sample_from_config(
    config: &LineRenderConfig,
    karpunk_raw_sample: Option<f32>,
) -> f32 {
    let sample = if let Some(secondary_algo) = config.secondary_algo {
        if config.blend <= BLEND_SHORT_CIRCUIT_EPSILON {
            render_algo_sample(
                config.primary_algo,
                config.phase,
                config.final_dcw,
                config.primary_base_waveform,
                &config.primary_control_values,
                config.algo_param_mods,
                karpunk_raw_sample,
                config.pm_post_mod,
            ) * config.primary_window_gain
        } else if config.blend >= 1.0 - BLEND_SHORT_CIRCUIT_EPSILON {
            render_algo_sample(
                secondary_algo,
                config.phase,
                config.final_dcw,
                config.secondary_base_waveform,
                &config.secondary_control_values,
                config.algo_param_mods,
                karpunk_raw_sample,
                config.pm_post_mod,
            ) * config.secondary_window_gain
        } else {
            let secondary_dcw = config.final_dcw * config.blend;
            let primary_dcw = config.final_dcw * (1.0 - config.blend);
            let primary = render_algo_sample(
                config.primary_algo,
                config.phase,
                primary_dcw,
                config.primary_base_waveform,
                &config.primary_control_values,
                config.algo_param_mods,
                karpunk_raw_sample,
                config.pm_post_mod,
            ) * config.primary_window_gain;
            let secondary = render_algo_sample(
                secondary_algo,
                config.phase,
                secondary_dcw,
                config.secondary_base_waveform,
                &config.secondary_control_values,
                config.algo_param_mods,
                karpunk_raw_sample,
                config.pm_post_mod,
            ) * config.secondary_window_gain;
            blend_line_samples(config.primary_algo, primary, secondary, config.blend)
        }
    } else {
        render_algo_sample(
            config.primary_algo,
            config.phase,
            config.final_dcw,
            config.primary_base_waveform,
            &config.primary_control_values,
            config.algo_param_mods,
            karpunk_raw_sample,
            config.pm_post_mod,
        ) * config.primary_window_gain
    };
    sample * config.final_dca * PER_LINE_HEADROOM
}

#[inline(always)]
fn render_line_stateless(config: LineRenderConfig) -> (f32, Option<f32>) {
    (render_sample_from_config(&config, None), None)
}

#[inline(always)]
fn sample_base_wave(base_waveform: BaseWaveform, phase: f32) -> f32 {
    let p = if (0.0..1.0).contains(&phase) {
        phase
    } else {
        wrap01(phase)
    };
    match base_waveform {
        BaseWaveform::Cosine => -(TWO_PI * p).cos(),
        BaseWaveform::Sine => (TWO_PI * p).sin(),
        BaseWaveform::Triangle => 1.0 - 4.0 * (p - 0.5).abs(),
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

use crate::synth_engine::pd;

/// Unified algorithm sample renderer used by voice and utility paths.
///
/// `runtime_sample` is used only when an algorithm is rendered by per-voice state.
#[allow(clippy::too_many_arguments)]
pub fn render_algo_sample(
    algo: Algo,
    phase: f32,
    dcw: f32,
    base_waveform: BaseWaveform,
    control_values: &[f32; 8],
    algo_param_mods: [f32; 8],
    runtime_sample: Option<f32>,
    pm_post_mod: f32,
) -> f32 {
    if algo == Algo::Karpunk {
        return runtime_sample.unwrap_or(0.0);
    }
    let warped = pd::warp_phase(algo, phase, dcw, control_values, &algo_param_mods);
    sample_base_wave(base_waveform, warped + pm_post_mod)
}

#[cfg(test)]
mod tests {
    use super::LineRenderConfig;
    use super::render_line_stateless;
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
            primary_control_values: [0.5, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0],
            secondary_control_values: [0.0f32; 8],
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
