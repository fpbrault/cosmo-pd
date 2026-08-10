extern crate alloc;

use alloc::boxed::Box;

use crate::generators::PER_LINE_HEADROOM;
use crate::params::{KarpunkParams, LineParams};

use super::engine::{LineEngine, LineEngineContext, LineEngineOutput, LineRole};

#[derive(Clone, Copy)]
pub(crate) struct KarpunkEngineParams<'a> {
    line: &'a LineParams,
}

impl<'a> KarpunkEngineParams<'a> {
    pub fn new(line: &'a LineParams) -> Self {
        Self { line }
    }
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct KarpunkRenderInput {
    pub dcw_envelope: f32,
    pub dca_envelope: f32,
}

const KS_BUFFER_SIZE: usize = 2048;
const DEFAULT_PRNG_SEED: u32 = 0x1234_5678;
const SECONDARY_PRNG_SALT: u32 = 0x9e37_79b9;

#[derive(Debug, Clone)]
struct KarpunkState {
    buffer: Box<[f32; KS_BUFFER_SIZE]>,
    write_pos: usize,
    last_sample: f32,
    prng: u32,
}

impl KarpunkState {
    fn new(prng_seed: u32) -> Self {
        Self {
            buffer: Box::new([0.0; KS_BUFFER_SIZE]),
            write_pos: 0,
            last_sample: 0.0,
            prng: prng_seed,
        }
    }

    fn reseed_for_note(&mut self, note: u8) {
        self.prng = self
            .prng
            .wrapping_add(note as u32)
            .wrapping_mul(0x9e37_79b9);
        for sample in self.buffer.iter_mut() {
            *sample = lcg_rand(&mut self.prng);
        }
        self.write_pos = 0;
        self.last_sample = 0.0;
    }

    fn advance(
        &mut self,
        effective_freq: f32,
        sample_rate: f32,
        dcw: f32,
        controls: KarpunkParams,
    ) -> f32 {
        let safe_freq = if effective_freq > 0.0 {
            effective_freq
        } else {
            220.0
        };
        let delay_length =
            ((sample_rate / safe_freq).round() as usize).clamp(2, KS_BUFFER_SIZE - 1);
        let read_pos = (self.write_pos + KS_BUFFER_SIZE - delay_length) % KS_BUFFER_SIZE;
        let output = self.buffer[read_pos];
        let damping = (0.2 + dcw * 0.45 + controls.damping.clamp(0.0, 1.0) * 0.35).clamp(0.0, 1.0);
        let brightness = controls.brightness.clamp(0.0, 1.0);
        let filtered = damping * output
            + (1.0 - damping) * (brightness * output + (1.0 - brightness) * self.last_sample);
        let decay = 0.96 + controls.decay.clamp(0.0, 1.0) * 0.039;
        let excitation = controls.excitation.clamp(0.0, 1.0) * 0.03;

        self.last_sample = filtered;
        self.buffer[self.write_pos] = filtered * decay + excitation * lcg_rand(&mut self.prng);
        self.write_pos = (self.write_pos + 1) % KS_BUFFER_SIZE;
        filtered
    }
}

fn lcg_rand(state: &mut u32) -> f32 {
    *state = state.wrapping_mul(1_664_525).wrapping_add(1_013_904_223);
    let bits = (*state >> 16) as f32;
    bits / 32767.5 - 1.0
}

#[derive(Debug, Clone)]
pub(crate) struct KarpunkEngine {
    state: KarpunkState,
    seed: u32,
    note_offset: u8,
}

impl KarpunkEngine {
    pub fn new(role: LineRole) -> Self {
        let (seed, note_offset) = match role {
            LineRole::Line1 => (DEFAULT_PRNG_SEED, 0),
            LineRole::Line2 => (DEFAULT_PRNG_SEED ^ SECONDARY_PRNG_SALT, 1),
        };
        Self {
            state: KarpunkState::new(seed),
            seed,
            note_offset,
        }
    }
}

impl LineEngine for KarpunkEngine {
    type Params<'a> = KarpunkEngineParams<'a>;
    type RenderInput<'a> = KarpunkRenderInput;

    fn reset(&mut self, _sample_rate: f32, voice_identity: u64) {
        self.state.write_pos = 0;
        self.state.last_sample = 0.0;
        self.state.prng = self.seed ^ (voice_identity as u32).wrapping_mul(0x9e37_79b9);
    }

    fn note_on(&mut self, note: u8, _velocity: f32, _params: KarpunkEngineParams<'_>) {
        self.state
            .reseed_for_note(note.wrapping_add(self.note_offset));
    }

    fn note_off(&mut self, _params: KarpunkEngineParams<'_>) {}

    #[inline(always)]
    fn render_primary(
        &mut self,
        context: LineEngineContext,
        input: &KarpunkRenderInput,
        params: KarpunkEngineParams<'_>,
    ) -> LineEngineOutput {
        let amplitude = input.dca_envelope.max(0.0);
        let source = self.state.advance(
            context.frequency,
            context.sample_rate,
            input.dcw_envelope,
            params.line.karpunk,
        );
        let sample = source * amplitude * PER_LINE_HEADROOM;
        LineEngineOutput {
            sample,
            prime_source: Some(source),
        }
    }

    #[inline(always)]
    fn render_prime(
        &mut self,
        _context: LineEngineContext,
        input: &KarpunkRenderInput,
        _params: KarpunkEngineParams<'_>,
        primary: LineEngineOutput,
    ) -> LineEngineOutput {
        let source = primary.prime_source.unwrap_or(0.0);
        LineEngineOutput {
            sample: source * input.dca_envelope.max(0.0) * PER_LINE_HEADROOM,
            prime_source: Some(source),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn context() -> LineEngineContext {
        LineEngineContext {
            frequency: 220.0,
            sample_rate: 48_000.0,
        }
    }

    fn input() -> KarpunkRenderInput {
        KarpunkRenderInput {
            dcw_envelope: 0.7,
            dca_envelope: 0.8,
        }
    }

    #[test]
    fn retrigger_is_deterministic() {
        let params = LineParams {
            synthesis_method: crate::params::SynthesisMethod::Karpunk,
            ..LineParams::default()
        };
        let mut first = KarpunkEngine::new(LineRole::Line1);
        let mut second = KarpunkEngine::new(LineRole::Line1);
        first.reset(48_000.0, 3);
        second.reset(48_000.0, 3);
        first.note_on(57, 0.8, KarpunkEngineParams::new(&params));
        second.note_on(57, 0.8, KarpunkEngineParams::new(&params));
        for _ in 0..512 {
            let left = first.render_primary(context(), &input(), KarpunkEngineParams::new(&params));
            let right =
                second.render_primary(context(), &input(), KarpunkEngineParams::new(&params));
            assert_eq!(left.sample.to_bits(), right.sample.to_bits());
            assert!(left.sample.is_finite());
        }
    }

    #[test]
    fn prime_render_reuses_the_primary_source_without_advancing_state() {
        let params = LineParams {
            synthesis_method: crate::params::SynthesisMethod::Karpunk,
            ..LineParams::default()
        };
        let mut line = KarpunkEngine::new(LineRole::Line1);
        line.reset(48_000.0, 1);
        line.note_on(57, 0.8, KarpunkEngineParams::new(&params));
        let primary = line.render_primary(context(), &input(), KarpunkEngineParams::new(&params));
        let prime = line.render_prime(
            context(),
            &input(),
            KarpunkEngineParams::new(&params),
            primary,
        );
        assert_eq!(primary.sample.to_bits(), prime.sample.to_bits());
        assert_eq!(primary.prime_source, prime.prime_source);
    }
}
