//! Batch parameter caching for per-voice rendering.
//!
//! Strategy: Pre-compute commonly-used parameters for each voice at the start
//! of a block, then reference cached values during sample generation.
//! This reduces redundant LFO evaluations and modulation matrix lookups.

use crate::params::{FxSlotType, SynthParams, NUM_OPERATORS};
use crate::simd::SimdType;

/// Cached block-level state derived from the current synth parameters.
#[derive(Debug, Clone, Copy)]
pub struct RenderBlockCache {
    /// Master output volume for the current block.
    pub volume: f32,
    /// Whether the modulation matrix has any active routes.
    pub mod_matrix_active: bool,
    /// Number of active non-utility FX slots.
    pub active_fx_slots: usize,
}

impl RenderBlockCache {
    pub fn from_params(params: &SynthParams) -> Self {
        let active_fx_slots = params
            .fx_slots
            .iter()
            .filter(|slot| {
                !matches!(
                    slot.slot_type(),
                    FxSlotType::Empty | FxSlotType::Vibrato | FxSlotType::PhaseMod
                )
            })
            .count();

        Self {
            volume: params.volume,
            mod_matrix_active: !params.mod_matrix.routes.is_empty(),
            active_fx_slots,
        }
    }

    #[inline]
    pub fn has_modulation(&self) -> bool {
        self.mod_matrix_active
    }
}

/// Cached parameters for a single voice, laid out for cache efficiency.
/// Process multiple samples before updating cache to amortize computation.
#[derive(Debug, Clone, Copy)]
pub struct VoiceParameterCache {
    /// Master volume [0, 1]
    pub master_volume: f32,
    /// Master pitch shift (1.0 = no change)
    pub master_pitch: f32,
    /// Per-operator volume [NUM_OPERATORS]
    pub op_volumes: [f32; NUM_OPERATORS],
    /// Per-operator mix output [NUM_OPERATORS]
    pub op_mix_out: [f32; NUM_OPERATORS],
    /// Per-operator modulation output [NUM_OPERATORS]
    pub op_mod_out: [f32; NUM_OPERATORS],
    /// Per-operator feedback amount [NUM_OPERATORS]
    pub op_feedback: [f32; NUM_OPERATORS],
    /// Per-operator panning (0=left, 0.5=center, 1.0=right)
    pub op_panning: [f32; NUM_OPERATORS],
    /// Whether LFO is active
    pub lfo_active: bool,
    /// Whether modulation matrix is active
    pub mod_matrix_active: bool,
}

impl VoiceParameterCache {
    pub fn new() -> Self {
        Self {
            master_volume: 1.0,
            master_pitch: 1.0,
            op_volumes: [0.0; NUM_OPERATORS],
            op_mix_out: [0.0; NUM_OPERATORS],
            op_mod_out: [0.0; NUM_OPERATORS],
            op_feedback: [0.0; NUM_OPERATORS],
            op_panning: [0.5; NUM_OPERATORS],
            lfo_active: false,
            mod_matrix_active: false,
        }
    }

    /// Get master volume, with early-exit check for silence.
    #[inline]
    pub fn get_master_volume(&self) -> f32 {
        self.master_volume
    }

    /// Check if this voice is effectively silent.
    #[inline]
    pub fn is_silent(&self) -> bool {
        self.master_volume < 0.001
    }

    /// Get active operator count (operators with non-zero volume).
    pub fn active_operator_count(&self) -> usize {
        self.op_volumes.iter().filter(|v| v.abs() > 0.001).count()
    }
}

impl Default for VoiceParameterCache {
    fn default() -> Self {
        Self::new()
    }
}

/// Vectorized parameter cache for SIMD processing.
///
/// Holds cached parameters for processing W samples in parallel.
#[derive(Debug, Clone, Copy)]
pub struct BatchParameterCache<S: SimdType> {
    /// Cached samples' master volumes
    pub master_volumes: [f32; 4], // Up to 4 voices per batch (may optimize later)
    /// LFO values for this batch
    pub lfo_values: [f32; 4],
    /// Modulation matrix column (which operators are modulating)
    pub mod_matrix_active: bool,
    /// Used SIMD width
    pub _phantom: core::marker::PhantomData<S>,
}

impl<S: SimdType> BatchParameterCache<S> {
    pub fn new() -> Self {
        Self {
            master_volumes: [1.0; 4],
            lfo_values: [0.0; 4],
            mod_matrix_active: false,
            _phantom: core::marker::PhantomData,
        }
    }
}

impl<S: SimdType> Default for BatchParameterCache<S> {
    fn default() -> Self {
        Self::new()
    }
}

// `RenderBlockCache` is used by `processor/process.rs` to derive block-level
// invariants once per buffer call.  `VoiceParameterCache` and
// `BatchParameterCache` remain available for future per-voice SIMD optimisation.
