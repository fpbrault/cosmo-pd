//! Compiled render plan for parameter-derived DSP state.
//!
//! The audio loop runs sample-by-sample, so stable work derived from
//! `SynthParams` belongs here and is rebuilt only when parameters change.

use crate::generators::{cz101, pre_resolve_controls, PER_LINE_HEADROOM};
use crate::params::{
    Algo, BaseWaveform, LineParams, ModMatrixCache, SynthParams, WindowType, NUM_VOICES,
};

const REFERENCE_LINE_HEADROOM: f32 = 0.75;
const HEADROOM_MAKEUP_EXPONENT: f32 = 0.8;
const MAX_HEADROOM_MAKEUP: f32 = 1.0;

/// Stable render metadata compiled from a `SynthParams` snapshot.
#[derive(Debug, Clone)]
pub(crate) struct RenderPlan {
    pub mod_cache: ModMatrixCache,
    pub has_active_mod_routes: bool,
    pub has_env_step_routes: bool,
    pub norm: f32,
    pub line1: CompiledLinePlan,
    pub line2: CompiledLinePlan,
}

impl RenderPlan {
    pub fn from_params(params: &SynthParams) -> Self {
        let mut mod_cache = ModMatrixCache::new();
        mod_cache.rebuild_routes(&params.mod_matrix);

        Self {
            has_active_mod_routes: params.mod_matrix.routes.iter().any(|route| route.enabled),
            has_env_step_routes: mod_cache.has_env_step_routes,
            mod_cache,
            norm: compute_norm(params),
            line1: CompiledLinePlan::from_line(&params.line1),
            line2: CompiledLinePlan::from_line(&params.line2),
        }
    }
}

impl Default for RenderPlan {
    fn default() -> Self {
        Self::from_params(&SynthParams::default())
    }
}

/// Stable per-line algorithm metadata.
#[derive(Debug, Clone, Copy)]
pub(crate) struct CompiledLinePlan {
    pub primary: CompiledAlgoSlot,
    pub secondary: Option<CompiledAlgoSlot>,
}

impl CompiledLinePlan {
    fn from_line(line: &LineParams) -> Self {
        Self {
            primary: CompiledAlgoSlot::from_line_slot(
                line.algo,
                &line.algo_controls_a,
                line.window,
                line.base_waveform_a,
            ),
            secondary: line.algo2.map(|algo| {
                CompiledAlgoSlot::from_line_slot(
                    algo,
                    &line.algo_controls_b,
                    line.window,
                    line.base_waveform_b,
                )
            }),
        }
    }
}

/// Stable metadata for one primary or secondary line algorithm slot.
#[derive(Debug, Clone, Copy)]
pub(crate) struct CompiledAlgoSlot {
    #[allow(dead_code)]
    pub original_algo: Algo,
    pub resolved_static_algo: Algo,
    pub cz_even_algo: Option<Algo>,
    pub cz_odd_algo: Option<Algo>,
    pub window: WindowType,
    pub base_waveform: BaseWaveform,
    pub control_values: [f32; 8],
    #[allow(dead_code)]
    pub is_karpunk_candidate: bool,
}

impl CompiledAlgoSlot {
    fn from_line_slot(
        algo: Algo,
        controls: &crate::params::AlgoControlSlots,
        fallback_window: WindowType,
        base_waveform: BaseWaveform,
    ) -> Self {
        let control_values = pre_resolve_controls(algo, controls);
        if algo == Algo::Cz101 {
            let resolved = cz101::resolve_cz_controls(controls);
            let even = Algo::from_cz_waveform(resolved.waveform1);
            let odd = Algo::from_cz_waveform(resolved.waveform2);
            return Self {
                original_algo: algo,
                resolved_static_algo: even,
                cz_even_algo: Some(even),
                cz_odd_algo: Some(odd),
                window: resolved.window_function,
                base_waveform,
                control_values,
                is_karpunk_candidate: false,
            };
        }

        Self {
            original_algo: algo,
            resolved_static_algo: algo,
            cz_even_algo: None,
            cz_odd_algo: None,
            window: fallback_window,
            base_waveform,
            control_values,
            is_karpunk_candidate: algo == Algo::Karpunk,
        }
    }

    #[inline(always)]
    pub fn algo_for_cycle(self, cycle_count: u32) -> Algo {
        match (self.cz_even_algo, self.cz_odd_algo) {
            (Some(_), Some(odd)) if cycle_count & 1 != 0 => odd,
            (Some(even), _) => even,
            _ => self.resolved_static_algo,
        }
    }
}

fn compute_norm(params: &SynthParams) -> f32 {
    let headroom_ratio = REFERENCE_LINE_HEADROOM / PER_LINE_HEADROOM.max(0.01);
    let headroom_makeup = headroom_ratio
        .powf(HEADROOM_MAKEUP_EXPONENT)
        .clamp(1.0, MAX_HEADROOM_MAKEUP);
    params.volume * headroom_makeup / (NUM_VOICES as f32).sqrt()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::{AlgoControlId, AlgoControlValueV1};

    fn cz_controls(waveform1: f32, waveform2: f32) -> crate::params::AlgoControlSlots {
        let mut controls = [None; 8];
        controls[0] = Some(AlgoControlValueV1 {
            id: AlgoControlId::Waveform1,
            value: waveform1,
        });
        controls[1] = Some(AlgoControlValueV1 {
            id: AlgoControlId::Waveform2,
            value: waveform2,
        });
        controls
    }

    #[test]
    fn compiled_cz_slot_preserves_cycle_alternation() {
        let slot = CompiledAlgoSlot::from_line_slot(
            Algo::Cz101,
            &cz_controls(0.0, 1.0),
            WindowType::Off,
            BaseWaveform::Cosine,
        );

        assert_eq!(slot.algo_for_cycle(0), Algo::Saw);
        assert_eq!(slot.algo_for_cycle(1), Algo::Square);
        assert_eq!(slot.algo_for_cycle(2), Algo::Saw);
    }
}
