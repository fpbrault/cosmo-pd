pub mod pd;

use crate::params::{Algo, AlgoControlSlots};

/// The synthesis strategy driving per-sample generation.
///
/// Each variant maps to a family of wave-shaping / phase-distortion algorithms.
/// Dispatch is a static jump table (`match self { PD => ... }`) — zero vtable overhead.
pub enum SynthEngine {
    PhaseDistortion,
}

impl SynthEngine {
    #[inline]
    pub fn warp_phase(
        &self,
        algo: Algo,
        phase: f32,
        amt: f32,
        control_values: &[f32; 8],
        algo_param_mods: &[f32; 8],
    ) -> f32 {
        match self {
            Self::PhaseDistortion => pd::warp_phase(algo, phase, amt, control_values, algo_param_mods),
        }
    }

    #[inline]
    pub fn control_slot_index(&self, algo: Algo, id: &str) -> Option<usize> {
        match self {
            Self::PhaseDistortion => pd::algo_control_slot_index(algo, id),
        }
    }

    #[inline]
    pub fn pre_resolve_controls(&self, algo: Algo, controls: &AlgoControlSlots) -> [f32; 8] {
        match self {
            Self::PhaseDistortion => pd::pre_resolve_controls(algo, controls),
        }
    }
}
