use crate::params::{LineParams, SynthesisMethod};

use super::karpunk::{KarpunkEngine, KarpunkEngineParams, KarpunkRenderInput};
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
pub(crate) struct LineSynthesisRuntime {
    method: SynthesisMethod,
    pd: PdEngine,
    karpunk: KarpunkEngine,
}

impl LineSynthesisRuntime {
    pub fn new(method: SynthesisMethod, role: LineRole) -> Self {
        Self {
            method,
            pd: PdEngine::new(role),
            karpunk: KarpunkEngine::new(role),
        }
    }

    pub fn method(&self) -> SynthesisMethod {
        self.method
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

        self.method = method;
        self.reset(sample_rate, voice_identity);
        if let Some((note, velocity)) = active_note {
            self.note_on(params, note, velocity);
        }
    }

    pub fn reset(&mut self, sample_rate: f32, voice_identity: u64) {
        match self.method {
            SynthesisMethod::Pd => self.pd.reset(sample_rate, voice_identity),
            SynthesisMethod::Karpunk => self.karpunk.reset(sample_rate, voice_identity),
        }
    }

    pub fn note_on(&mut self, line: &LineParams, note: u8, velocity: f32) {
        match self.method {
            SynthesisMethod::Pd => {
                self.pd.note_on(note, velocity, PdEngineParams::new(line));
            }
            SynthesisMethod::Karpunk => {
                self.karpunk
                    .note_on(note, velocity, KarpunkEngineParams::new(line));
            }
        }
    }

    pub fn note_off(&mut self, line: &LineParams) {
        match self.method {
            SynthesisMethod::Pd => self.pd.note_off(PdEngineParams::new(line)),
            SynthesisMethod::Karpunk => self.karpunk.note_off(KarpunkEngineParams::new(line)),
        }
    }

    #[inline(always)]
    pub fn render_primary(
        &mut self,
        line: &LineParams,
        context: LineEngineContext,
        input: PdRenderInput<'_>,
    ) -> LineEngineOutput {
        match self.method {
            SynthesisMethod::Pd => {
                self.pd
                    .render_primary(context, &input, PdEngineParams::new(line))
            }
            SynthesisMethod::Karpunk => self.karpunk.render_primary(
                context,
                &KarpunkRenderInput {
                    dcw_envelope: input.dcw_envelope,
                    dca_envelope: input.dca_envelope,
                },
                KarpunkEngineParams::new(line),
            ),
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
        match self.method {
            SynthesisMethod::Pd => {
                self.pd
                    .render_prime(context, &input, PdEngineParams::new(line), primary)
            }
            SynthesisMethod::Karpunk => self.karpunk.render_prime(
                context,
                &KarpunkRenderInput {
                    dcw_envelope: input.dcw_envelope,
                    dca_envelope: input.dca_envelope,
                },
                KarpunkEngineParams::new(line),
                primary,
            ),
        }
    }
}
