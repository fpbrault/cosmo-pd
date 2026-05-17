use crate::batch_cache::CompiledLinePlan;
use crate::dsp_utils::{apply_window, lerp, wrap01, TWO_PI};
use crate::params::{Algo, AlgoControlSlots, BaseWaveform, LineParams};
use std::sync::LazyLock;

/// Reference per-line output headroom used by processor normalization.
pub const PER_LINE_HEADROOM: f32 = 0.25;
const BLEND_SHORT_CIRCUIT_EPSILON: f32 = 0.03;

/// O(1) lookup table mapping `Algo as u8` → its definition.
static ALGO_DEF_TABLE: LazyLock<[Option<&'static AlgoDefinitionV1>; 256]> = LazyLock::new(|| {
    let mut table = [None; 256];
    for def in &ALGO_DEFINITIONS_V1 {
        table[def.id as usize] = Some(def);
    }
    table
});

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
pub use cz101::{CzPresetV1, CZ_PRESETS};
pub mod cheby;
pub mod fof;
pub mod fold;
pub mod karpunk;
pub mod mirror;
pub mod pinch;
pub mod quantize;
pub mod ripple;
pub mod sine;
pub mod skew;
pub mod stutter;
pub mod sync;
pub mod terrain;
pub mod twist;

pub use catalog::{
    algo_definitions_v1, algo_ui_catalog_v1, AlgoControlAssignmentV1, AlgoControlKindV1,
    AlgoControlOptionV1, AlgoControlPresentationV1, AlgoControlV1, AlgoDefinitionV1, AlgoUiEntryV1,
    ALGO_BLEND_NUMBER_CONTROL, ALGO_DEFINITIONS_V1, DCW_CONTROL, FINE_DETUNE_NUMBER_CONTROL,
    KEY_FOLLOW_NUMBER_CONTROL, LEVEL_NUMBER_CONTROL, NO_CONTROLS, NO_CONTROL_OPTIONS,
    OCTAVE_NUMBER_CONTROL, WARP_AMOUNT_CONTROL, WARP_AMOUNT_NUMBER_CONTROL,
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
fn render_line_stateless(config: LineRenderConfig) -> (f32, Option<f32>) {
    let sample = if let Some(secondary_algo) = config.secondary_algo {
        if config.blend <= BLEND_SHORT_CIRCUIT_EPSILON {
            render_algo_sample(
                config.primary_algo,
                config.phase,
                config.final_dcw,
                config.primary_base_waveform,
                &config.primary_control_values,
                config.algo_param_mods,
                None,
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
                None,
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
                None,
                config.pm_post_mod,
            ) * config.primary_window_gain;
            let secondary = render_algo_sample(
                secondary_algo,
                config.phase,
                secondary_dcw,
                config.secondary_base_waveform,
                &config.secondary_control_values,
                config.algo_param_mods,
                None,
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
            None,
            config.pm_post_mod,
        ) * config.primary_window_gain
    };

    (sample * config.final_dca * PER_LINE_HEADROOM, None)
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
        BaseWaveform::Sine => (TWO_PI as f32 * p).sin(),
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
    let definition = ALGO_DEF_TABLE[algo as usize]?;
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
        Algo::Bend => {
            let curve = control_values[0] + algo_param_mods[0];
            let bias = control_values[1] + algo_param_mods[1];
            let knee = control_values[2] + algo_param_mods[2];
            bend::warp_phase(phase, amt, curve, bias, knee)
        }
        Algo::Sync => {
            let ratio = control_values[0] + algo_param_mods[0];
            let phase_offset = control_values[1] + algo_param_mods[1];
            let curve = control_values[2] + algo_param_mods[2];
            let window = control_values[3] + algo_param_mods[3];
            sync::warp_phase(phase, amt, ratio, phase_offset, curve, window)
        }
        Algo::Pinch => {
            let focus = control_values[0] + algo_param_mods[0];
            let asym = control_values[1] + algo_param_mods[1];
            let curve = control_values[2] + algo_param_mods[2];
            let drive = control_values[3] + algo_param_mods[3];
            pinch::warp_phase(phase, amt, focus, asym, curve, drive)
        }
        Algo::Fold => {
            let stages = control_values[0] + algo_param_mods[0];
            let tilt = control_values[1] + algo_param_mods[1];
            let symmetry = control_values[2] + algo_param_mods[2];
            let softness = control_values[3] + algo_param_mods[3];
            fold::warp_phase(phase, amt, stages, tilt, symmetry, softness)
        }
        Algo::Skew => {
            let bias = control_values[0] + algo_param_mods[0];
            let curve = control_values[1] + algo_param_mods[1];
            let spread = control_values[2] + algo_param_mods[2];
            let tilt = control_values[3] + algo_param_mods[3];
            skew::warp_phase(phase, amt, bias, curve, spread, tilt)
        }
        Algo::Quantize => {
            let amount_mod = control_values[0] + algo_param_mods[0];
            let amount = if amount_mod == 0.0 { amt } else { amount_mod };
            quantize::warp_phase(
                phase,
                amount,
                control_values[1] + algo_param_mods[1],
                control_values[2] + algo_param_mods[2],
            )
        }
        Algo::Twist => {
            let harmonics = control_values[0] + algo_param_mods[0];
            let depth = control_values[1] + algo_param_mods[1];
            let phase_offset = control_values[2] + algo_param_mods[2];
            let shape = control_values[3] + algo_param_mods[3];
            twist::warp_phase(phase, amt, harmonics, depth, phase_offset, shape)
        }
        Algo::Clip => {
            let drive = control_values[0] + algo_param_mods[0];
            let shape = control_values[1] + algo_param_mods[1];
            let bias = control_values[2] + algo_param_mods[2];
            let soft = control_values[3] + algo_param_mods[3];
            clip::warp_phase(phase, amt, drive, shape, bias, soft)
        }
        Algo::Ripple => {
            let freq = control_values[0] + algo_param_mods[0];
            let depth = control_values[1] + algo_param_mods[1];
            let phase_offset = control_values[2] + algo_param_mods[2];
            let shape = control_values[3] + algo_param_mods[3];
            ripple::warp_phase(phase, amt, freq, depth, phase_offset, shape)
        }
        Algo::Mirror => {
            let center = control_values[0] + algo_param_mods[0];
            let blend = control_values[1] + algo_param_mods[1];
            let clip = control_values[2] + algo_param_mods[2];
            let skew = control_values[3] + algo_param_mods[3];
            mirror::warp_phase(phase, amt, center, blend, clip, skew)
        }
        Algo::Fof => {
            let ratio = control_values[0] + algo_param_mods[0];
            let tightness = control_values[1] + algo_param_mods[1];
            let offset = control_values[2] + algo_param_mods[2];
            let skew = control_values[3] + algo_param_mods[3];
            fof::warp_phase(phase, amt, ratio, tightness, offset, skew)
        }
        Algo::Sine => sine::warp_phase(phase, amt),
        Algo::Karpunk => phase,
        Algo::Terrain => terrain::warp_phase(
            phase,
            amt,
            control_values[0] + algo_param_mods[0],
            control_values[1] + algo_param_mods[1],
            control_values[2] + algo_param_mods[2],
            control_values[3] + algo_param_mods[3],
        ),
        Algo::Stutter => stutter::warp_phase(
            phase,
            amt,
            control_values[0] + algo_param_mods[0],
            control_values[1] + algo_param_mods[1],
            control_values[2] + algo_param_mods[2],
            control_values[3] + algo_param_mods[3],
        ),
        Algo::Cheby => cheby::warp_phase(
            phase,
            amt,
            control_values[0] + algo_param_mods[0],
            control_values[1] + algo_param_mods[1],
            control_values[2] + algo_param_mods[2],
            control_values[3] + algo_param_mods[3],
        ),
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
