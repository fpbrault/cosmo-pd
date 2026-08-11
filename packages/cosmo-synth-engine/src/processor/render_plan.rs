//! Compiled render plan for parameter-derived DSP state.
//!
//! The audio loop runs sample-by-sample, so stable work derived from
//! `SynthParams` belongs here and is rebuilt only when parameters change.

use crate::params::{DEFAULT_VOICE_LIMIT, ModMatrixCache, SynthParams};
use crate::synthesis::CompiledLinePlan;

const REFERENCE_LINE_HEADROOM: f32 = 0.75;
const HEADROOM_MAKEUP_EXPONENT: f32 = 0.8;
const MAX_HEADROOM_MAKEUP: f32 = 1.0;

/// Stable render metadata compiled from a `SynthParams` snapshot.
#[derive(Debug, Clone)]
pub(crate) struct CompiledSynthParams {
    pub mod_cache: ModMatrixCache,
    pub has_active_mod_routes: bool,
    pub has_env_step_routes: bool,
    pub norm: f32,
    pub line1: CompiledLinePlan,
    pub line2: CompiledLinePlan,
}

impl CompiledSynthParams {
    pub fn from_params(params: &SynthParams) -> Self {
        let mut mod_cache = ModMatrixCache::new();
        mod_cache.rebuild_routes(&params.mod_matrix);

        let has_active_mod_routes = params.mod_matrix.routes.iter().any(|route| route.enabled);
        let line1 = CompiledLinePlan::from_line(&params.line1);
        let line2 = CompiledLinePlan::from_line(&params.line2);

        Self {
            has_active_mod_routes,
            has_env_step_routes: mod_cache.has_env_step_routes,
            mod_cache,
            norm: compute_norm(params, line1.headroom().min(line2.headroom())),
            line1,
            line2,
        }
    }
}

impl Default for CompiledSynthParams {
    fn default() -> Self {
        Self::from_params(&SynthParams::default())
    }
}

fn compute_norm(params: &SynthParams, line_headroom: f32) -> f32 {
    let headroom_ratio = REFERENCE_LINE_HEADROOM / line_headroom.max(0.01);
    let headroom_makeup = headroom_ratio
        .powf(HEADROOM_MAKEUP_EXPONENT)
        .clamp(1.0, MAX_HEADROOM_MAKEUP);
    params.volume * headroom_makeup / (DEFAULT_VOICE_LIMIT as f32).sqrt()
}
