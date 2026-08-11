//! PD-specific render metadata compiled from a PD parameter payload.

use crate::params::AlgoControlSlots;
use crate::synthesis::pd::algorithms::{cz101, pre_resolve_controls};
use crate::synthesis::pd::parameters::{Algo, BaseWaveform, PdLineParams, WindowType};

/// Stable per-line metadata for the phase-distortion engine.
#[derive(Debug, Clone, Copy)]
pub(crate) struct CompiledPdLinePlan {
    pub primary: CompiledAlgoSlot,
    pub secondary: Option<CompiledAlgoSlot>,
}

impl CompiledPdLinePlan {
    pub(crate) fn from_params(line: &PdLineParams) -> Self {
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

/// Stable metadata for one primary or secondary PD algorithm slot.
#[derive(Debug, Clone, Copy)]
pub(crate) struct CompiledAlgoSlot {
    pub resolved_static_algo: Algo,
    pub cz_even_algo: Option<Algo>,
    pub cz_odd_algo: Option<Algo>,
    pub window: WindowType,
    pub base_waveform: BaseWaveform,
    pub control_values: [f32; 8],
}

impl CompiledAlgoSlot {
    fn from_line_slot(
        algo: Algo,
        controls: &AlgoControlSlots,
        fallback_window: WindowType,
        base_waveform: BaseWaveform,
    ) -> Self {
        let control_values = pre_resolve_controls(algo, controls);
        if algo == Algo::Cz101 {
            let resolved = cz101::resolve_cz_controls(controls);
            let even = Algo::from_cz_waveform(resolved.waveform1);
            let odd = Algo::from_cz_waveform(resolved.waveform2);
            return Self {
                resolved_static_algo: even,
                cz_even_algo: Some(even),
                cz_odd_algo: Some(odd),
                window: resolved.window_function,
                base_waveform,
                control_values,
            };
        }

        Self {
            resolved_static_algo: algo,
            cz_even_algo: None,
            cz_odd_algo: None,
            window: fallback_window,
            base_waveform,
            control_values,
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::{AlgoControlId, AlgoControlValueV1};

    fn cz_controls(waveform1: f32, waveform2: f32) -> AlgoControlSlots {
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
