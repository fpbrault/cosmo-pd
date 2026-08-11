use crate::envelope::{EnvelopeBank, EnvelopeTimingCache};
use crate::params::{LineEnvelopeParams, SynthesisMethod};
use crate::synthesis::pd::algorithms::PdRenderConfig;
use crate::synthesis::pd::parameters::PdLineParams;

use super::engine::{
    CompiledLinePlan, LineClockFrame, LineEngine, LineEngineContext, LineEngineFrame,
    LineEngineOutput, LineEnvelopeFrame, LinePhaseContext, LineRole, LineSignalFrame,
};

pub mod algorithms;
pub(crate) mod default_envelopes;
pub(crate) mod envelope_map;
pub(crate) mod modulation;
pub mod parameters;
pub(crate) mod plan;

pub(crate) use plan::CompiledPdLinePlan;

/// PD-specific per-sample inputs. The algorithm-control vector belongs to the
/// PD engine and is deliberately absent from the common engine frame.
#[derive(Debug, Clone, Copy)]
pub(crate) struct PdEngineFrame {
    pub clock: LineClockFrame,
    pub envelopes: LineEnvelopeFrame,
    pub modulation: [f32; 8],
    pub phase_modulation: f32,
}

pub use envelope_map::{compute_env_level_norms, normalize_synth_params_envelopes_to_raw_if_human};

#[derive(Clone, Copy)]
pub(crate) struct PdEngineParams<'a> {
    line: &'a PdLineParams,
}

impl<'a> PdEngineParams<'a> {
    #[inline(always)]
    pub fn new(line: &'a PdLineParams) -> Self {
        Self { line }
    }
}

#[derive(Debug, Clone)]
pub(crate) struct PdEngine {
    role: LineRole,
}

impl PdEngine {
    pub fn new(role: LineRole) -> Self {
        Self { role }
    }

    #[inline(always)]
    fn config(
        context: LineEngineContext,
        frame: PdEngineFrame,
        compiled_line: &CompiledPdLinePlan,
        params: PdEngineParams<'_>,
    ) -> PdRenderConfig {
        PdRenderConfig::from_compiled_line(
            compiled_line,
            params.line,
            frame.clock.cycle_count,
            frame.clock.oscillator_phase,
            frame.clock.shaped_phase,
            frame.envelopes.timbre,
            frame.envelopes.amplitude,
            context.frequency,
            context.sample_rate,
            frame.modulation,
            frame.phase_modulation,
        )
    }
}

impl LineEngine for PdEngine {
    type Params<'a> = PdEngineParams<'a>;

    fn method(&self) -> SynthesisMethod {
        SynthesisMethod::Pd
    }

    fn role(&self) -> LineRole {
        self.role
    }

    fn reset(&mut self, _sample_rate: f32, _voice_identity: u64) {}

    fn note_on(&mut self, note: u8, _velocity: f32, _params: PdEngineParams<'_>) {
        let _ = (self.role, note);
    }

    fn note_off(&mut self, _params: PdEngineParams<'_>) {}

    #[inline(always)]
    fn advance_envelopes(
        &mut self,
        params: PdEngineParams<'_>,
        envelopes: &LineEnvelopeParams,
        state: &mut EnvelopeBank,
        timing: &EnvelopeTimingCache,
        note: u8,
    ) -> LineEnvelopeFrame {
        let values = envelope_map::advance_envelopes(params.line, envelopes, state, timing, note);
        LineEnvelopeFrame {
            pitch: values[0],
            timbre: values[1],
            amplitude: values[2],
        }
    }

    fn start_envelope_release(
        &mut self,
        _params: PdEngineParams<'_>,
        envelopes: &LineEnvelopeParams,
        state: &mut EnvelopeBank,
    ) {
        envelope_map::start_envelope_release(envelopes, state);
    }

    fn apply_modulation(
        &self,
        output: &mut crate::params::LineParams,
        base: &crate::params::LineParams,
        line_index: u8,
        mod_values: &[f32],
        has_env_step_routes: bool,
    ) {
        modulation::apply_line_mods(output, base, line_index, mod_values, has_env_step_routes);
    }

    #[inline(always)]
    fn prepare_signal(
        &self,
        line: &crate::params::LineParams,
        base_frequency: f32,
        envelopes: LineEnvelopeFrame,
        note: u8,
        timbre_modulation: f32,
        amplitude_modulation: f32,
    ) -> LineSignalFrame {
        LineSignalFrame {
            frequency: envelope_map::line_frequency(
                base_frequency,
                line.octave,
                line.detune_note,
                line.detune_fine,
                envelopes.pitch,
            ),
            timbre: (envelope_map::dcw_base_output(
                line.engine.pd().dcw_base,
                line.engine.pd().dcw_key_follow,
                envelopes.timbre,
                note,
            ) + timbre_modulation)
                .clamp(0.0, 1.0),
            amplitude: (line.engine.pd().dca_base
                * envelope_map::dca_env_gain(envelopes.amplitude)
                + amplitude_modulation)
                .max(0.0),
        }
    }

    #[inline(always)]
    fn phase_frame(&self, context: LinePhaseContext) -> super::engine::LinePhaseFrame {
        let amount = if context.phase_modulation.enabled {
            context.phase_modulation.amount.clamp(-1.0, 1.0)
        } else {
            0.0
        };
        let effective_ratio =
            (context.phase_modulation.ratio + context.ratio_modulation * 7.5).clamp(0.5, 8.0);
        let pm_delta = (context.base_frequency * effective_ratio) / context.sample_rate;
        let pm_mod = amount * 10.0 * (core::f32::consts::TAU * context.pm_phi).sin();
        let (phase_a_post, phase_b_post, pm_post_mod) = if context.phase_modulation.pm_pre {
            (
                crate::dsp_utils::wrap01(context.phi1 + pm_mod),
                crate::dsp_utils::wrap01(context.phi2 + pm_mod),
                0.0,
            )
        } else {
            (context.phi1, context.phi2, pm_mod)
        };

        super::engine::LinePhaseFrame {
            phase_a_post,
            phase_b_post,
            pm_delta,
            pm_post_mod,
        }
    }

    #[inline(always)]
    fn render_primary(
        &mut self,
        context: LineEngineContext,
        frame: LineEngineFrame,
        compiled_line: &CompiledLinePlan,
        params: PdEngineParams<'_>,
    ) -> LineEngineOutput {
        let CompiledLinePlan::Pd(compiled_line) = compiled_line;
        let LineEngineFrame::Pd(frame) = frame;
        let config = Self::config(context, frame, compiled_line, params);
        LineEngineOutput {
            sample: algorithms::render_sample_from_config(&config),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::{Algo, SynthParams};
    use crate::processor::render_plan::CompiledSynthParams;
    use crate::synthesis::engine::{LineClockFrame, LineEnvelopeFrame};

    fn assert_primary_bits_match(role: LineRole, algo: Algo, note: u8, sample_count: usize) {
        let mut params = SynthParams::default();
        let line = match role {
            LineRole::Line1 => &mut params.line1,
            LineRole::Line2 => &mut params.line2,
        };
        line.engine.pd_mut().algo = algo;
        let line = *line;
        let compiled = CompiledSynthParams::from_params(&params);
        let compiled_line = match role {
            LineRole::Line1 => &compiled.line1,
            LineRole::Line2 => &compiled.line2,
        };
        let mut adapter = PdEngine::new(role);
        adapter.note_on(note, 0.75, PdEngineParams::new(line.engine.pd()));

        for sample_index in 0..sample_count {
            let phase = sample_index as f32 * 0.007_31;
            let context = LineEngineContext {
                frequency: 440.0,
                sample_rate: 48_000.0,
            };
            let frame = LineEngineFrame::Pd(PdEngineFrame {
                clock: LineClockFrame {
                    cycle_count: sample_index as u32 / 137,
                    oscillator_phase: phase,
                    shaped_phase: phase,
                },
                envelopes: LineEnvelopeFrame {
                    pitch: 0.0,
                    timbre: 0.72,
                    amplitude: 0.81,
                },
                modulation: [0.0; 8],
                phase_modulation: 0.0,
            });
            let LineEngineFrame::Pd(pd_frame) = frame;
            let CompiledLinePlan::Pd(pd_plan) = compiled_line;
            let config = PdEngine::config(
                context,
                pd_frame,
                pd_plan,
                PdEngineParams::new(line.engine.pd()),
            );
            let expected = algorithms::render_sample_from_config(&config);
            let actual = adapter.render_primary(
                context,
                frame,
                compiled_line,
                PdEngineParams::new(line.engine.pd()),
            );

            assert_eq!(actual.sample.to_bits(), expected.to_bits());
        }
    }

    #[test]
    fn pd_adapter_is_bit_identical_for_stateless_lines() {
        assert_primary_bits_match(LineRole::Line1, Algo::Saw, 60, 512);
        assert_primary_bits_match(LineRole::Line2, Algo::Saw, 60, 512);
    }
}
