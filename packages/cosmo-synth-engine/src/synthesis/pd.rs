use crate::generators::{self, AlgoRuntimeState, LineRenderConfig};
use crate::params::{LineParams, SynthesisMethod};
use crate::render_cache::CompiledLinePlan;

use super::engine::{LineEngine, LineEngineContext, LineEngineOutput, LineRole};

#[derive(Clone, Copy)]
pub(crate) struct PdEngineParams<'a> {
    line: &'a LineParams,
}

impl<'a> PdEngineParams<'a> {
    pub fn new(line: &'a LineParams) -> Self {
        Self { line }
    }
}

#[derive(Clone, Copy)]
pub(crate) struct PdRenderInput<'a> {
    pub compiled_line: &'a CompiledLinePlan,
    pub cycle_count: u32,
    pub oscillator_phase: f32,
    pub shaped_phase: f32,
    pub dcw_envelope: f32,
    pub dca_envelope: f32,
    pub modulation_values: [f32; 8],
    pub phase_modulation: f32,
}

#[derive(Debug, Clone)]
pub(crate) struct PdEngine {
    role: LineRole,
    state: AlgoRuntimeState,
}

impl PdEngine {
    pub fn new(role: LineRole) -> Self {
        Self {
            role,
            state: AlgoRuntimeState::new(Self::seed(role)),
        }
    }

    fn seed(role: LineRole) -> u32 {
        match role {
            LineRole::Line1 => generators::karpunk::DEFAULT_PRNG_SEED,
            LineRole::Line2 => {
                generators::karpunk::DEFAULT_PRNG_SEED ^ generators::karpunk::SECONDARY_PRNG_SALT
            }
        }
    }

    fn note(role: LineRole, note: u8) -> u8 {
        match role {
            LineRole::Line1 => note,
            LineRole::Line2 => note.wrapping_add(1),
        }
    }

    #[inline(always)]
    fn config(
        context: LineEngineContext,
        input: &PdRenderInput<'_>,
        params: PdEngineParams<'_>,
    ) -> LineRenderConfig {
        LineRenderConfig::from_compiled_line(
            input.compiled_line,
            params.line,
            input.cycle_count,
            input.oscillator_phase,
            input.shaped_phase,
            input.dcw_envelope,
            input.dca_envelope,
            context.frequency,
            context.sample_rate,
            input.modulation_values,
            input.phase_modulation,
        )
    }
}

impl LineEngine for PdEngine {
    type Params<'a> = PdEngineParams<'a>;
    type RenderInput<'a> = PdRenderInput<'a>;

    fn method(&self) -> SynthesisMethod {
        SynthesisMethod::Pd
    }

    fn role(&self) -> LineRole {
        self.role
    }

    fn reset(&mut self, _sample_rate: f32, _voice_identity: u64) {}

    fn note_on(&mut self, note: u8, _velocity: f32, _params: PdEngineParams<'_>) {
        self.state.note_on(Self::note(self.role, note));
    }

    fn note_off(&mut self, _params: PdEngineParams<'_>) {}

    #[inline(always)]
    fn render_primary(
        &mut self,
        context: LineEngineContext,
        input: &PdRenderInput<'_>,
        params: PdEngineParams<'_>,
    ) -> LineEngineOutput {
        let config = Self::config(context, input, params);
        let (sample, prime_source) = self.state.render(config);
        LineEngineOutput {
            sample,
            prime_source,
        }
    }

    #[inline(always)]
    fn render_prime(
        &mut self,
        context: LineEngineContext,
        input: &PdRenderInput<'_>,
        params: PdEngineParams<'_>,
        primary: LineEngineOutput,
    ) -> LineEngineOutput {
        let config = Self::config(context, input, params);
        LineEngineOutput {
            sample: generators::render_sample_from_config(&config, primary.prime_source),
            prime_source: primary.prime_source,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::{Algo, SynthParams};
    use crate::render_cache::CompiledSynthParams;

    fn assert_primary_bits_match(role: LineRole, algo: Algo, note: u8, sample_count: usize) {
        let mut params = SynthParams::default();
        let line = match role {
            LineRole::Line1 => &mut params.line1,
            LineRole::Line2 => &mut params.line2,
        };
        line.algo = algo;
        let line = *line;
        let compiled = CompiledSynthParams::from_params(&params);
        let compiled_line = match role {
            LineRole::Line1 => &compiled.line1,
            LineRole::Line2 => &compiled.line2,
        };
        let mut adapter = PdEngine::new(role);
        let mut legacy = AlgoRuntimeState::new(PdEngine::seed(role));
        adapter.note_on(note, 0.75, PdEngineParams::new(&line));
        legacy.note_on(PdEngine::note(role, note));

        for sample_index in 0..sample_count {
            let phase = sample_index as f32 * 0.007_31;
            let context = LineEngineContext {
                frequency: 440.0,
                sample_rate: 48_000.0,
            };
            let input = PdRenderInput {
                compiled_line,
                cycle_count: sample_index as u32 / 137,
                oscillator_phase: phase,
                shaped_phase: phase,
                dcw_envelope: 0.72,
                dca_envelope: 0.81,
                modulation_values: [0.0; 8],
                phase_modulation: 0.0,
            };
            let config = PdEngine::config(context, &input, PdEngineParams::new(&line));
            let expected = legacy.render(config);
            let actual = adapter.render_primary(context, &input, PdEngineParams::new(&line));

            assert_eq!(actual.sample.to_bits(), expected.0.to_bits());
            assert_eq!(
                actual.prime_source.map(f32::to_bits),
                expected.1.map(f32::to_bits)
            );
        }
    }

    #[test]
    fn pd_adapter_is_bit_identical_for_stateless_lines() {
        assert_primary_bits_match(LineRole::Line1, Algo::Saw, 60, 512);
        assert_primary_bits_match(LineRole::Line2, Algo::Saw, 60, 512);
    }

    #[test]
    fn pd_adapter_is_bit_identical_for_stateful_lines() {
        assert_primary_bits_match(LineRole::Line1, Algo::Karpunk, 43, 512);
        assert_primary_bits_match(LineRole::Line2, Algo::Karpunk, 43, 512);
    }

    #[test]
    fn pd_adapter_preserves_stateful_retrigger_sequence() {
        let mut params = SynthParams::default();
        params.line1.algo = Algo::Karpunk;
        let line = params.line1;
        let compiled = CompiledSynthParams::from_params(&params);
        let mut adapter = PdEngine::new(LineRole::Line1);
        let mut legacy = AlgoRuntimeState::new(PdEngine::seed(LineRole::Line1));

        for note in [43, 55, 43] {
            adapter.reset(48_000.0, 0);
            adapter.note_on(note, 0.75, PdEngineParams::new(&line));
            legacy.note_on(note);

            for sample_index in 0..128 {
                let phase = sample_index as f32 * 0.007_31;
                let context = LineEngineContext {
                    frequency: 220.0,
                    sample_rate: 48_000.0,
                };
                let input = PdRenderInput {
                    compiled_line: &compiled.line1,
                    cycle_count: sample_index as u32 / 37,
                    oscillator_phase: phase,
                    shaped_phase: phase,
                    dcw_envelope: 0.72,
                    dca_envelope: 0.81,
                    modulation_values: [0.0; 8],
                    phase_modulation: 0.0,
                };
                let config = PdEngine::config(context, &input, PdEngineParams::new(&line));
                let expected = legacy.render(config);
                let actual = adapter.render_primary(context, &input, PdEngineParams::new(&line));

                assert_eq!(actual.sample.to_bits(), expected.0.to_bits());
                assert_eq!(
                    actual.prime_source.map(f32::to_bits),
                    expected.1.map(f32::to_bits)
                );
            }
        }
    }

    #[test]
    fn pd_prime_render_uses_the_primary_state_source_without_advancing_it() {
        let mut params = SynthParams::default();
        params.line1.algo = Algo::Karpunk;
        let line = params.line1;
        let compiled = CompiledSynthParams::from_params(&params);
        let mut adapter = PdEngine::new(LineRole::Line1);
        adapter.note_on(60, 1.0, PdEngineParams::new(&line));
        let primary_input = PdRenderInput {
            compiled_line: &compiled.line1,
            cycle_count: 9,
            oscillator_phase: 0.125,
            shaped_phase: 0.125,
            dcw_envelope: 0.65,
            dca_envelope: 0.9,
            modulation_values: [0.0; 8],
            phase_modulation: 0.0,
        };
        let primary_context = LineEngineContext {
            frequency: 220.0,
            sample_rate: 48_000.0,
        };
        let primary =
            adapter.render_primary(primary_context, &primary_input, PdEngineParams::new(&line));
        let prime_input = PdRenderInput {
            oscillator_phase: 0.375,
            shaped_phase: 0.375,
            ..primary_input
        };
        let prime_context = LineEngineContext {
            frequency: 0.0,
            sample_rate: 1.0,
        };
        let config = PdEngine::config(prime_context, &prime_input, PdEngineParams::new(&line));
        let expected = generators::render_sample_from_config(&config, primary.prime_source);
        let actual = adapter.render_prime(
            prime_context,
            &prime_input,
            PdEngineParams::new(&line),
            primary,
        );

        assert_eq!(actual.sample.to_bits(), expected.to_bits());
        assert_eq!(actual.prime_source, primary.prime_source);
    }
}
