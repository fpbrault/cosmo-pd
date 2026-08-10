use crate::generators::{self, AlgoRuntimeState, LineRenderConfig};
use crate::params::LineParams;
use core::ops::{Deref, DerefMut};

use super::engine::{LineEngine, LineEngineContext, LineEngineOutput, PdChannel, PdRenderContext};

#[derive(Debug, Clone, Copy, Default)]
pub(crate) struct PdEngine;

#[derive(Debug, Clone, Default)]
pub(crate) struct PdState(AlgoRuntimeState);

impl Deref for PdState {
    type Target = AlgoRuntimeState;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for PdState {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl PdEngine {
    pub fn new(_channel: PdChannel) -> Self {
        Self
    }
}

impl LineEngine<LineParams, PdRenderContext<'_>> for PdEngine {
    fn reset(&mut self, _sample_rate: f32, _voice_identity: u64) {}

    fn set_sample_rate(&mut self, _sample_rate: f32) {}

    fn note_on(&mut self, _note: u8, _velocity: f32, _params: &LineParams) {}

    fn note_off(&mut self, _params: &LineParams) {}

    #[inline(always)]
    fn render(
        &mut self,
        context: &LineEngineContext<'_>,
        input: &PdRenderContext<'_>,
        params: &LineParams,
    ) -> LineEngineOutput {
        let config = LineRenderConfig::from_compiled_line(
            input.compiled_line,
            params,
            input.cycle_count,
            input.oscillator_phase,
            input.shaped_phase,
            context.envelope_values[1],
            context.envelope_values[2],
            context.frequency,
            context.sample_rate,
            context.modulation_values,
            input.phase_modulation,
        );
        let sample = generators::render_sample_from_config(&config, input.prime_source);
        let prime_source = input.prime_source;
        let amplitude = context.envelope_values[2].abs();
        LineEngineOutput {
            sample,
            amplitude,
            has_tail: amplitude > 0.000_1 || sample.abs() > 0.000_1,
            prime_source,
        }
    }

    fn is_silent(&self, _params: &LineParams) -> bool {
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::envelope::EnvelopeTimingCache;
    use crate::params::{Algo, SynthParams};
    use crate::render_cache::CompiledSynthParams;

    fn assert_output_bits_match(channel: PdChannel, algo: Algo, note: u8, sample_count: usize) {
        let mut params = SynthParams::default();
        params.line1.algo = algo;
        let line = params.line1;
        let compiled = CompiledSynthParams::from_params(&params);
        let timing = EnvelopeTimingCache::new(48_000.0);
        let mut adapter_state = PdState::default();
        let mut legacy = AlgoRuntimeState::new();
        adapter_state.note_on(note);
        legacy.note_on(note);

        for sample_index in 0..sample_count {
            let phase = sample_index as f32 * 0.007_31;
            let context = LineEngineContext {
                frequency: 440.0,
                velocity: 0.75,
                note,
                gate: true,
                sample_rate: 48_000.0,
                timing: &timing,
                voice_identity: 17,
                envelope_values: [0.0, 0.72, 0.81],
                modulation_values: [0.0; 8],
            };
            let input = PdRenderContext {
                compiled_line: &compiled.line1,
                cycle_count: sample_index as u32 / 137,
                oscillator_phase: phase,
                shaped_phase: phase,
                phase_modulation: 0.0,
                prime_source: None,
            };
            let config = LineRenderConfig::from_compiled_line(
                input.compiled_line,
                &line,
                input.cycle_count,
                input.oscillator_phase,
                input.shaped_phase,
                context.envelope_values[1],
                context.envelope_values[2],
                context.frequency,
                context.sample_rate,
                context.modulation_values,
                input.phase_modulation,
            );
            let expected = match channel {
                PdChannel::Line1 => legacy.render_line1(config),
                PdChannel::Line2 => legacy.render_line2(config),
                PdChannel::Prime => unreachable!("prime uses a separate equivalence test"),
            };
            let actual = match channel {
                PdChannel::Line1 => adapter_state.render_line1(config),
                PdChannel::Line2 => adapter_state.render_line2(config),
                PdChannel::Prime => unreachable!("prime uses a separate equivalence test"),
            };

            assert_eq!(actual.0.to_bits(), expected.0.to_bits());
            assert_eq!(actual.1.map(f32::to_bits), expected.1.map(f32::to_bits));
        }
    }

    #[test]
    fn pd_adapter_is_bit_identical_for_stateless_lines() {
        assert_output_bits_match(PdChannel::Line1, Algo::Saw, 60, 512);
        assert_output_bits_match(PdChannel::Line2, Algo::Saw, 60, 512);
    }

    #[test]
    fn pd_adapter_is_bit_identical_for_stateful_lines() {
        assert_output_bits_match(PdChannel::Line1, Algo::Karpunk, 43, 512);
        assert_output_bits_match(PdChannel::Line2, Algo::Karpunk, 43, 512);
    }

    #[test]
    fn pd_prime_adapter_is_bit_identical_to_legacy_prime_render() {
        let mut params = SynthParams::default();
        params.line1.algo = Algo::Karpunk;
        let line = params.line1;
        let compiled = CompiledSynthParams::from_params(&params);
        let timing = EnvelopeTimingCache::new(48_000.0);
        let mut adapter = PdEngine::new(PdChannel::Prime);
        let context = LineEngineContext {
            frequency: 0.0,
            velocity: 1.0,
            note: 60,
            gate: true,
            sample_rate: 1.0,
            timing: &timing,
            voice_identity: 3,
            envelope_values: [0.0, 0.65, 0.9],
            modulation_values: [0.0; 8],
        };
        let input = PdRenderContext {
            compiled_line: &compiled.line1,
            cycle_count: 9,
            oscillator_phase: 0.375,
            shaped_phase: 0.375,
            phase_modulation: 0.0,
            prime_source: Some(-0.271_828),
        };
        let config = LineRenderConfig::from_compiled_line(
            input.compiled_line,
            &line,
            input.cycle_count,
            input.oscillator_phase,
            input.shaped_phase,
            context.envelope_values[1],
            context.envelope_values[2],
            context.frequency,
            context.sample_rate,
            context.modulation_values,
            input.phase_modulation,
        );

        let expected = generators::render_sample_from_config(&config, input.prime_source);
        let actual = adapter.render(&context, &input, &line);

        assert_eq!(actual.sample.to_bits(), expected.to_bits());
        assert_eq!(actual.prime_source, input.prime_source);
    }
}
