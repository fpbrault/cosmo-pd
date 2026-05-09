//! Operator dependency analysis to skip silent operators.
//!
//! OctaSine strategy: Skip audio generation for inactive operators to reduce CPU waste.
//! An operator is "inactive" if it has:
//! - Zero output volume AND
//! - Zero modulation output AND
//! - All downstream operators that depend on it are also inactive

use crate::generators::AlgoRuntimeState;
use crate::params::NUM_OPERATORS;

/// Analyzes which operators should be rendered based on their volume and outputs.
#[derive(Debug, Clone, Copy)]
pub struct OperatorDependencyAnalysis {
    /// Which operators should generate audio [NUM_OPERATORS]
    pub should_render: [bool; NUM_OPERATORS],
}

impl OperatorDependencyAnalysis {
    /// Analyze which operators are actually needed for rendering.
    ///
    /// An operator should render if:
    /// 1. It has non-zero volume output to the mix, OR
    /// 2. It modulates another operator that will render, OR
    /// 3. It modulates itself (feedback)
    pub fn analyze(
        _algo_state: &AlgoRuntimeState,
        operator_volumes: &[f32; NUM_OPERATORS],
    ) -> Self {
        let mut should_render = [false; NUM_OPERATORS];

        // First pass: mark operators with active outputs or non-zero volume
        for i in 0..NUM_OPERATORS {
            let has_volume = operator_volumes[i].abs() > 0.001;
            // TODO: Check if operator modulates downstream operators
            // For now, render all with volume
            should_render[i] = has_volume;
        }

        // Second pass: mark operators needed by dependencies
        // This is algorithm-specific; will require integration with algo_state
        // For now, this is scaffolding for future optimization

        Self { should_render }
    }

    /// Should this operator render?
    #[inline]
    pub fn should_render(&self, op_idx: usize) -> bool {
        if op_idx < NUM_OPERATORS {
            self.should_render[op_idx]
        } else {
            true
        }
    }
}

// TODO: Integrate with modulation matrix to track actual dependencies
// This requires:
// 1. Analyzing which operators feed into which
// 2. Building a dependency graph
// 3. Backpropagating "needs to render" through the graph
// 4. Caching the result per parameter update
