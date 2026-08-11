use crate::params::{LineParams, SynthesisMethod};

use super::pd::{PdEngine, PdEngineParams, PdRenderInput};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum LineRole {
    Line1,
    Line2,
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct LineEngineContext {
    pub frequency: f32,
    pub sample_rate: f32,
}

#[derive(Debug, Clone, Copy, Default)]
pub(crate) struct LineEngineOutput {
    pub sample: f32,
    pub prime_source: Option<f32>,
}

pub(crate) trait LineEngine {
    type Params<'a>: Copy;
    type RenderInput<'a>;

    fn method(&self) -> SynthesisMethod;
    fn role(&self) -> LineRole;
    fn reset(&mut self, sample_rate: f32, voice_identity: u64);
    fn note_on(&mut self, note: u8, velocity: f32, params: Self::Params<'_>);
    fn note_off(&mut self, params: Self::Params<'_>);
    fn render_primary<'a>(
        &mut self,
        context: LineEngineContext,
        input: &Self::RenderInput<'a>,
        params: Self::Params<'a>,
    ) -> LineEngineOutput;
    fn render_prime<'a>(
        &mut self,
        context: LineEngineContext,
        input: &Self::RenderInput<'a>,
        params: Self::Params<'a>,
        primary: LineEngineOutput,
    ) -> LineEngineOutput;
}

#[derive(Debug, Clone)]
pub(crate) enum LineSynthesisRuntime {
    Pd(PdEngine),
}

impl LineSynthesisRuntime {
    pub fn new(method: SynthesisMethod, role: LineRole) -> Self {
        match method {
            SynthesisMethod::Pd => Self::Pd(PdEngine::new(role)),
        }
    }

    pub fn method(&self) -> SynthesisMethod {
        match self {
            Self::Pd(engine) => engine.method(),
        }
    }

    pub fn role(&self) -> LineRole {
        match self {
            Self::Pd(engine) => engine.role(),
        }
    }

    pub fn reconcile_method(
        &mut self,
        method: SynthesisMethod,
        sample_rate: f32,
        voice_identity: u64,
        active_note: Option<(u8, f32)>,
        params: &LineParams,
    ) {
        if self.method() == method {
            return;
        }

        let role = self.role();
        *self = Self::new(method, role);
        self.reset(sample_rate, voice_identity);
        if let Some((note, velocity)) = active_note {
            self.note_on(params, note, velocity);
        }
    }

    pub fn reset(&mut self, sample_rate: f32, voice_identity: u64) {
        match self {
            Self::Pd(engine) => engine.reset(sample_rate, voice_identity),
        }
    }

    pub fn note_on(&mut self, line: &LineParams, note: u8, velocity: f32) {
        match self {
            Self::Pd(engine) => engine.note_on(note, velocity, PdEngineParams::new(line)),
        }
    }

    pub fn note_off(&mut self, line: &LineParams) {
        match self {
            Self::Pd(engine) => engine.note_off(PdEngineParams::new(line)),
        }
    }

    #[inline(always)]
    pub fn render_primary(
        &mut self,
        line: &LineParams,
        context: LineEngineContext,
        input: PdRenderInput<'_>,
    ) -> LineEngineOutput {
        match self {
            Self::Pd(engine) => engine.render_primary(context, &input, PdEngineParams::new(line)),
        }
    }

    #[inline(always)]
    pub fn render_prime(
        &mut self,
        line: &LineParams,
        context: LineEngineContext,
        input: PdRenderInput<'_>,
        primary: LineEngineOutput,
    ) -> LineEngineOutput {
        match self {
            Self::Pd(engine) => {
                engine.render_prime(context, &input, PdEngineParams::new(line), primary)
            }
        }
    }
}
