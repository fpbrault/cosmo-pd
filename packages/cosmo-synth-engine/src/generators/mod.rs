use crate::dsp_utils::{TWO_PI, apply_window, lerp, wrap01};
use crate::params::{Algo, AlgoControlSlots, BaseWaveform, LineParams};
use crate::render_cache::CompiledLinePlan;
use crate::simd::SimdBackend;
use std::sync::LazyLock;

/// Reference per-line output headroom used by processor normalization.
pub const PER_LINE_HEADROOM: f32 = 0.25;
const BLEND_SHORT_CIRCUIT_EPSILON: f32 = 0.03;

/// Pre-computed per-algo default control values, keyed by `Algo as u8`.
static ALGO_DEFAULT_VALUES: LazyLock<[[f32; 8]; 256]> = LazyLock::new(|| {
    let mut table = [[0.0; 8]; 256];
    for def in &ALGO_DEFINITIONS_V1 {
        let mut slot = 0usize;
        for ctrl in def.controls {
            if ctrl.kind == AlgoControlKindV1::Number {
                table[def.id as usize][slot] = ctrl.default.unwrap_or(0.0);
                slot += 1;
                if slot >= 8 {
                    break;
                }
            }
        }
    }
    table
});

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
    pub fn render_line1(&mut self, config: LineRenderConfig) -> (f32, Option<f32>) {
        if karpunk::requires_state_tick(config.primary_algo, config.secondary_algo) {
            self.karpunk.render_line1(config)
        } else {
            render_line_stateless(config)
        }
    }

    /// Render line 2, applying any stateful algorithm behavior as needed.
    pub fn render_line2(&mut self, config: LineRenderConfig) -> (f32, Option<f32>) {
        if karpunk::requires_state_tick(config.primary_algo, config.secondary_algo) {
            self.karpunk.render_line2(config)
        } else {
            render_line_stateless(config)
        }
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
pub(crate) fn render_samples_from_configs_batch4(
    configs: &[LineRenderConfig; 4],
    simd_backend: SimdBackend,
) -> [f32; 4] {
    let primary_algo = configs[0].primary_algo;
    let secondary_algo = configs[0].secondary_algo;
    let primary_base_waveform = configs[0].primary_base_waveform;
    let secondary_base_waveform = configs[0].secondary_base_waveform;

    let uniform = configs.iter().skip(1).all(|config| {
        config.primary_algo == primary_algo
            && config.secondary_algo == secondary_algo
            && config.primary_base_waveform == primary_base_waveform
            && config.secondary_base_waveform == secondary_base_waveform
    });

    if !uniform || karpunk::requires_state_tick(primary_algo, secondary_algo) {
        return core::array::from_fn(|index| render_sample_from_config(&configs[index], None));
    }

    let primary = render_primary_batch4(
        primary_algo,
        primary_base_waveform,
        configs,
        simd_backend,
        false,
    );

    if let Some(algo) = secondary_algo {
        let secondary =
            render_primary_batch4(algo, secondary_base_waveform, configs, simd_backend, true);

        let mut blended = [0.0_f32; 4];
        for index in 0..4 {
            blended[index] = blend_line_samples(
                primary_algo,
                primary[index],
                secondary[index],
                configs[index].blend,
            );
        }
        return blended;
    }

    primary
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

#[inline]
fn algo_control_slot_index(algo: Algo, id: &str) -> Option<usize> {
    Some(match (algo, id) {
        (Algo::Bend, "bendCurve") => 0,
        (Algo::Bend, "bendBias") => 1,
        (Algo::Bend, "bendKnee") => 2,
        (Algo::Sync, "syncRatio") => 0,
        (Algo::Sync, "syncPhase") => 1,
        (Algo::Sync, "syncCurve") => 2,
        (Algo::Sync, "syncWindow") => 3,
        (Algo::Pinch, "pinchFocus") => 0,
        (Algo::Pinch, "pinchAsym") => 1,
        (Algo::Pinch, "pinchCurve") => 2,
        (Algo::Pinch, "pinchDrive") => 3,
        (Algo::Fold, "foldStages") => 0,
        (Algo::Fold, "foldTilt") => 1,
        (Algo::Fold, "foldSymmetry") => 2,
        (Algo::Fold, "foldSoftness") => 3,
        (Algo::Skew, "skewBias") => 0,
        (Algo::Skew, "skewCurve") => 1,
        (Algo::Skew, "skewSpread") => 2,
        (Algo::Skew, "skewTilt") => 3,
        (Algo::Twist, "twistHarmonics") => 0,
        (Algo::Twist, "twistDepth") => 1,
        (Algo::Twist, "twistPhase") => 2,
        (Algo::Twist, "twistShape") => 3,
        (Algo::Clip, "clipDrive") => 0,
        (Algo::Clip, "clipShape") => 1,
        (Algo::Clip, "clipBias") => 2,
        (Algo::Clip, "clipSoft") => 3,
        (Algo::Ripple, "rippleFreq") => 0,
        (Algo::Ripple, "rippleDepth") => 1,
        (Algo::Ripple, "ripplePhase") => 2,
        (Algo::Ripple, "rippleShape") => 3,
        (Algo::Mirror, "mirrorCenter") => 0,
        (Algo::Mirror, "mirrorBlend") => 1,
        (Algo::Mirror, "mirrorClip") => 2,
        (Algo::Mirror, "mirrorSkew") => 3,
        (Algo::Fof, "fofRatio") => 0,
        (Algo::Fof, "fofTightness") => 1,
        (Algo::Fof, "fofOffset") => 2,
        (Algo::Fof, "fofSkew") => 3,
        (Algo::Karpunk, "karpunkDamp") => 0,
        (Algo::Karpunk, "karpunkBright") => 1,
        (Algo::Karpunk, "karpunkDecay") => 2,
        (Algo::Karpunk, "karpunkExcite") => 3,
        (Algo::Terrain, "terrainRatio") => 0,
        (Algo::Terrain, "terrainDepth") => 1,
        (Algo::Terrain, "terrainFmPhase") => 2,
        (Algo::Terrain, "terrainShape") => 3,
        (Algo::Stutter, "stutterSegs") => 0,
        (Algo::Stutter, "stutterReverse") => 1,
        (Algo::Stutter, "stutterSlip") => 2,
        (Algo::Stutter, "stutterSpacing") => 3,
        (Algo::Cheby, "chebyOrder") => 0,
        (Algo::Cheby, "chebyTilt") => 1,
        (Algo::Cheby, "chebyWarp") => 2,
        _ => return None,
    })
}

/// Build a `[f32; 8]` from `ALGO_DEFINITIONS_V1` defaults, then apply any
/// preset-level overrides from `algo_controls`. String lookups happen here
/// (at config-build time) instead of inside `warp_phase` (per-sample).
#[inline(always)]
pub fn pre_resolve_controls(algo: Algo, controls: &AlgoControlSlots) -> [f32; 8] {
    let mut values = ALGO_DEFAULT_VALUES[algo as usize];
    for entry in controls.iter().flatten() {
        if let Some(slot) = algo_control_slot_index(algo, entry.id.as_str()) {
            values[slot] = entry.value;
        }
    }
    values
}

pub fn warp_phase(
    algo: Algo,
    phase: f32,
    amt: f32,
    control_values: &[f32; 8],
    algo_param_mods: &[f32; 8],
) -> f32 {
    if amt == 0.0 && !algo.is_cz_waveform() {
        return phase;
    }

    let c = |i: usize| control_values[i] + algo_param_mods[i];

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
        Algo::Bend => bend::warp_phase(phase, amt, c(0), c(1), c(2)),
        Algo::Sync => sync::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Pinch => pinch::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Fold => fold::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Skew => skew::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Twist => twist::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Clip => clip::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Ripple => ripple::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Mirror => mirror::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Fof => fof::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Karpunk => phase,
        Algo::Terrain => terrain::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Stutter => stutter::warp_phase(phase, amt, c(0), c(1), c(2), c(3)),
        Algo::Cheby => cheby::warp_phase(phase, amt, c(0), c(1), c(2)),
    }
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
    control_values: &[f32; 8],
    algo_param_mods: [f32; 8],
    runtime_sample: Option<f32>,
    pm_post_mod: f32,
) -> f32 {
    if algo == Algo::Karpunk {
        return runtime_sample.unwrap_or(0.0);
    }
    let warped = warp_phase(algo, phase, dcw, control_values, &algo_param_mods);
    sample_base_wave(base_waveform, warped + pm_post_mod)
}

#[inline(always)]
fn render_primary_batch4(
    algo: Algo,
    base_waveform: BaseWaveform,
    configs: &[LineRenderConfig; 4],
    simd_backend: SimdBackend,
    secondary: bool,
) -> [f32; 4] {
    let mut samples = [0.0_f32; 4];
    let mut window_gains = [0.0_f32; 4];
    let mut final_dca = [0.0_f32; 4];

    for index in 0..4 {
        let config = &configs[index];
        let dcw = if config.secondary_algo.is_some() && !secondary {
            config.final_dcw * (1.0 - config.blend)
        } else if config.secondary_algo.is_some() && secondary {
            config.final_dcw * config.blend
        } else {
            config.final_dcw
        };
        let control_values = if secondary {
            &config.secondary_control_values
        } else {
            &config.primary_control_values
        };
        window_gains[index] = if secondary {
            config.secondary_window_gain
        } else {
            config.primary_window_gain
        };
        final_dca[index] = config.final_dca;

        samples[index] = {
            let phase = config.phase;
            let warped = warp_phase(algo, phase, dcw, control_values, &config.algo_param_mods);
            warped + config.pm_post_mod
        };
    }

    let raw = samples;

    if algo != Algo::Karpunk {
        let mut wrapped = raw;
        for i in 0..4 {
            if !(0.0..1.0).contains(&raw[i]) {
                wrapped[i] = wrap01(raw[i]);
            }
        }

        samples = match base_waveform {
            BaseWaveform::Triangle => {
                let half = [0.5; 4];
                let four = [4.0; 4];
                let one = [1.0; 4];
                let centered = simd_backend.sub4(wrapped, half);
                let abs_centered = simd_backend.abs4(centered);
                simd_backend.sub4(one, simd_backend.mul4(abs_centered, four))
            }
            BaseWaveform::Saw => {
                let two = [2.0; 4];
                let one = [1.0; 4];
                simd_backend.sub4(simd_backend.mul4(wrapped, two), one)
            }
            BaseWaveform::Square => {
                let mask = simd_backend.cmplt4(wrapped, [0.5; 4]);
                simd_backend.blend4([1.0; 4], [-1.0; 4], mask)
            }
            _ => core::array::from_fn(|i| {
                match base_waveform {
                    BaseWaveform::Cosine => -(TWO_PI * wrapped[i]).cos(),
                    BaseWaveform::Sine => (TWO_PI * wrapped[i]).sin(),
                    _ => unreachable!(),
                }
            }),
        };
    }

    let with_window = simd_backend.mul4(samples, window_gains);
    let with_dca = simd_backend.mul4(with_window, final_dca);
    simd_backend.mul4(with_dca, [PER_LINE_HEADROOM; 4])
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
