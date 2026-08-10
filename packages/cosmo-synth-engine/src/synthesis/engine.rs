use crate::envelope::EnvelopeTimingCache;
use crate::params::{LineParams, SynthesisMethod};
use crate::render_cache::CompiledLinePlan;

use super::pd::PdEngine;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum PdChannel {
    Line1,
    Line2,
    Prime,
}

#[derive(Clone, Copy)]
#[allow(dead_code)]
pub(crate) struct LineEngineContext<'a> {
    pub frequency: f32,
    pub velocity: f32,
    pub note: u8,
    pub gate: bool,
    pub sample_rate: f32,
    pub timing: &'a EnvelopeTimingCache,
    pub voice_identity: u64,
    pub envelope_values: [f32; 3],
    pub modulation_values: [f32; 8],
}

#[derive(Clone, Copy)]
pub(crate) struct PdRenderContext<'a> {
    pub compiled_line: &'a CompiledLinePlan,
    pub cycle_count: u32,
    pub oscillator_phase: f32,
    pub shaped_phase: f32,
    pub phase_modulation: f32,
    pub prime_source: Option<f32>,
}

#[derive(Debug, Clone, Copy, Default)]
#[allow(dead_code)]
pub(crate) struct LineEngineOutput {
    pub sample: f32,
    pub amplitude: f32,
    pub has_tail: bool,
    pub prime_source: Option<f32>,
}

#[allow(dead_code)]
pub(crate) trait LineEngine<P, I> {
    fn reset(&mut self, sample_rate: f32, voice_identity: u64);
    fn set_sample_rate(&mut self, sample_rate: f32);
    fn note_on(&mut self, note: u8, velocity: f32, params: &P);
    fn note_off(&mut self, params: &P);
    fn render(
        &mut self,
        context: &LineEngineContext<'_>,
        input: &I,
        params: &P,
    ) -> LineEngineOutput;
    fn is_silent(&self, params: &P) -> bool;
}

#[derive(Debug, Clone)]
pub(crate) enum LineSynthesisRuntime {
    Pd(PdEngine),
}

impl LineSynthesisRuntime {
    pub fn new(channel: PdChannel) -> Self {
        Self::Pd(PdEngine::new(channel))
    }

    pub fn reset(&mut self, sample_rate: f32, voice_identity: u64) {
        match self {
            Self::Pd(engine) => engine.reset(sample_rate, voice_identity),
        }
    }

    #[allow(dead_code)]
    pub fn set_sample_rate(&mut self, sample_rate: f32) {
        match self {
            Self::Pd(engine) => engine.set_sample_rate(sample_rate),
        }
    }

    pub fn note_on(&mut self, line: &LineParams, note: u8, velocity: f32) {
        match (self, line.synthesis_method) {
            (Self::Pd(engine), SynthesisMethod::Pd) => engine.note_on(note, velocity, line),
        }
    }

    pub fn note_off(&mut self, line: &LineParams) {
        match (self, line.synthesis_method) {
            (Self::Pd(engine), SynthesisMethod::Pd) => engine.note_off(line),
        }
    }

    #[inline(always)]
    #[allow(dead_code)]
    pub fn render(
        &mut self,
        line: &LineParams,
        context: LineEngineContext<'_>,
        input: PdRenderContext<'_>,
    ) -> LineEngineOutput {
        match self {
            Self::Pd(engine) => engine.render(&context, &input, line),
        }
    }

    #[allow(dead_code)]
    pub fn is_silent(&self, line: &LineParams) -> bool {
        match self {
            Self::Pd(engine) => engine.is_silent(line),
        }
    }
}
