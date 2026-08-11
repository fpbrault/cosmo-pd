use crate::envelope::{EnvelopeBank, EnvelopeTimingCache};
use crate::params::{LineEngineParams, LineEnvelopeParams, LineParams, SynthesisMethod};

use super::pd::{CompiledPdLinePlan, PdEngine, PdEngineFrame, PdEngineParams};
use super::vz::{CompiledVzLinePlan, VzEngine, VzEngineFrame, VzEngineParams};

/// Engine-neutral dispatch handle for a compiled line plan.
///
/// The concrete plan remains owned by its engine module; this enum is only the
/// processor's validated runtime pairing between a line payload and its plan.
#[derive(Debug, Clone, Copy)]
pub(crate) enum CompiledLinePlan {
    Pd(CompiledPdLinePlan),
    Vz(CompiledVzLinePlan),
}

impl CompiledLinePlan {
    pub(crate) fn from_line(line: &LineParams) -> Self {
        match line.engine {
            LineEngineParams::Pd(params) => Self::Pd(CompiledPdLinePlan::from_params(&params)),
            LineEngineParams::Vz(params) => Self::Vz(CompiledVzLinePlan::from_params(&params)),
        }
    }

    pub(crate) fn headroom(self) -> f32 {
        match self {
            Self::Pd(_) => super::pd::algorithms::PER_LINE_HEADROOM,
            Self::Vz(_) => super::pd::algorithms::PER_LINE_HEADROOM,
        }
    }
}

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

#[derive(Debug, Clone, Copy)]
pub(crate) struct LineClockFrame {
    pub cycle_count: u32,
    pub oscillator_phase: f32,
    pub shaped_phase: f32,
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct LineEnvelopeFrame {
    pub pitch: f32,
    pub timbre: f32,
    pub amplitude: f32,
}

#[derive(Debug, Clone, Copy)]
pub(crate) enum LineEngineFrame {
    Pd(PdEngineFrame),
    Vz(VzEngineFrame),
}

#[derive(Debug, Clone, Copy, Default)]
pub(crate) struct LineEngineOutput {
    pub sample: f32,
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct LineSignalFrame {
    pub frequency: f32,
    pub timbre: f32,
    pub amplitude: f32,
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct LinePhaseFrame {
    pub phase_a_post: f32,
    pub phase_b_post: f32,
    pub pm_delta: f32,
    pub pm_post_mod: f32,
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct LinePhaseModulation {
    pub enabled: bool,
    pub amount: f32,
    pub ratio: f32,
    pub pm_pre: bool,
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct LinePhaseContext {
    pub phase_modulation: LinePhaseModulation,
    pub phi1: f32,
    pub phi2: f32,
    pub pm_phi: f32,
    pub base_frequency: f32,
    pub sample_rate: f32,
    pub ratio_modulation: f32,
}

pub(crate) trait LineEngine {
    type Params<'a>: Copy;
    fn method(&self) -> SynthesisMethod;
    fn role(&self) -> LineRole;
    fn reset(&mut self, sample_rate: f32, voice_identity: u64);
    fn note_on(&mut self, note: u8, velocity: f32, params: Self::Params<'_>);
    fn note_off(&mut self, params: Self::Params<'_>);
    fn advance_envelopes(
        &mut self,
        params: Self::Params<'_>,
        envelopes: &LineEnvelopeParams,
        state: &mut EnvelopeBank,
        timing: &EnvelopeTimingCache,
        note: u8,
    ) -> LineEnvelopeFrame;
    fn start_envelope_release(
        &mut self,
        params: Self::Params<'_>,
        envelopes: &LineEnvelopeParams,
        state: &mut EnvelopeBank,
    );
    fn apply_modulation(
        &self,
        output: &mut LineParams,
        base: &LineParams,
        line_index: u8,
        mod_values: &[f32],
        has_env_step_routes: bool,
    );
    fn prepare_signal(
        &self,
        line: &LineParams,
        base_frequency: f32,
        envelopes: LineEnvelopeFrame,
        note: u8,
        timbre_modulation: f32,
        amplitude_modulation: f32,
    ) -> LineSignalFrame;
    fn phase_frame(&self, context: LinePhaseContext) -> LinePhaseFrame;
    fn render_primary(
        &mut self,
        context: LineEngineContext,
        frame: LineEngineFrame,
        plan: &CompiledLinePlan,
        params: Self::Params<'_>,
    ) -> LineEngineOutput;

    /// Render the "prime" line source used by `LineSelect::L1PlusL1Prime` /
    /// `L1PlusL2Prime`. Defaults to a second `render_primary` call, which is
    /// safe for stateless engines. Stateful engines (anything with per-sample
    /// oscillator phase or PRNG state) must override this to reuse cached
    /// state instead of advancing it a second time per sample.
    #[inline(always)]
    fn render_prime(
        &mut self,
        context: LineEngineContext,
        frame: LineEngineFrame,
        plan: &CompiledLinePlan,
        params: Self::Params<'_>,
    ) -> LineEngineOutput {
        self.render_primary(context, frame, plan, params)
    }
}

#[derive(Debug, Clone)]
pub(crate) enum LineSynthesisRuntime {
    Pd(PdEngine),
    Vz(Box<VzEngine>),
}

impl LineSynthesisRuntime {
    pub fn new(method: SynthesisMethod, role: LineRole) -> Self {
        match method {
            SynthesisMethod::Pd => Self::Pd(PdEngine::new(role)),
            SynthesisMethod::Vz => Self::Vz(Box::new(VzEngine::new(role))),
        }
    }

    pub fn method(&self) -> SynthesisMethod {
        match self {
            Self::Pd(engine) => engine.method(),
            Self::Vz(engine) => engine.method(),
        }
    }

    pub fn role(&self) -> LineRole {
        match self {
            Self::Pd(engine) => engine.role(),
            Self::Vz(engine) => engine.role(),
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
            Self::Vz(engine) => engine.reset(sample_rate, voice_identity),
        }
    }

    pub fn note_on(&mut self, line: &LineParams, note: u8, velocity: f32) {
        match self {
            Self::Pd(engine) => {
                engine.note_on(note, velocity, PdEngineParams::new(line.engine.pd()))
            }
            Self::Vz(engine) => {
                engine.note_on(note, velocity, VzEngineParams::new(line.engine.vz()))
            }
        }
    }

    pub fn note_off(&mut self, line: &LineParams) {
        match self {
            Self::Pd(engine) => engine.note_off(PdEngineParams::new(line.engine.pd())),
            Self::Vz(engine) => engine.note_off(VzEngineParams::new(line.engine.vz())),
        }
    }

    #[inline(always)]
    pub fn advance_envelopes(
        &mut self,
        line: &LineParams,
        state: &mut EnvelopeBank,
        timing: &EnvelopeTimingCache,
        note: u8,
    ) -> LineEnvelopeFrame {
        match self {
            Self::Pd(engine) => engine.advance_envelopes(
                PdEngineParams::new(line.engine.pd()),
                &line.envelopes,
                state,
                timing,
                note,
            ),
            Self::Vz(engine) => engine.advance_envelopes(
                VzEngineParams::new(line.engine.vz()),
                &line.envelopes,
                state,
                timing,
                note,
            ),
        }
    }

    pub fn start_envelope_release(&mut self, line: &LineParams, state: &mut EnvelopeBank) {
        match self {
            Self::Pd(engine) => engine.start_envelope_release(
                PdEngineParams::new(line.engine.pd()),
                &line.envelopes,
                state,
            ),
            Self::Vz(engine) => engine.start_envelope_release(
                VzEngineParams::new(line.engine.vz()),
                &line.envelopes,
                state,
            ),
        }
    }

    pub fn apply_modulation(
        &self,
        output: &mut LineParams,
        base: &LineParams,
        line_index: u8,
        mod_values: &[f32],
        has_env_step_routes: bool,
    ) {
        match self {
            Self::Pd(engine) => {
                engine.apply_modulation(output, base, line_index, mod_values, has_env_step_routes)
            }
            Self::Vz(engine) => {
                engine.apply_modulation(output, base, line_index, mod_values, has_env_step_routes)
            }
        }
    }

    #[inline(always)]
    pub fn prepare_signal(
        &self,
        line: &LineParams,
        base_frequency: f32,
        envelopes: LineEnvelopeFrame,
        note: u8,
        timbre_modulation: f32,
        amplitude_modulation: f32,
    ) -> LineSignalFrame {
        match self {
            Self::Pd(engine) => engine.prepare_signal(
                line,
                base_frequency,
                envelopes,
                note,
                timbre_modulation,
                amplitude_modulation,
            ),
            Self::Vz(engine) => engine.prepare_signal(
                line,
                base_frequency,
                envelopes,
                note,
                timbre_modulation,
                amplitude_modulation,
            ),
        }
    }

    #[inline(always)]
    pub fn phase_frame(&self, context: LinePhaseContext) -> LinePhaseFrame {
        match self {
            Self::Pd(engine) => engine.phase_frame(context),
            Self::Vz(engine) => engine.phase_frame(context),
        }
    }

    #[inline(always)]
    pub fn render_primary(
        &mut self,
        line: &LineParams,
        context: LineEngineContext,
        frame: LineEngineFrame,
        plan: &CompiledLinePlan,
    ) -> LineEngineOutput {
        match self {
            Self::Pd(engine) => {
                engine.render_primary(context, frame, plan, PdEngineParams::new(line.engine.pd()))
            }
            Self::Vz(engine) => {
                engine.render_primary(context, frame, plan, VzEngineParams::new(line.engine.vz()))
            }
        }
    }

    #[inline(always)]
    pub fn render_prime(
        &mut self,
        line: &LineParams,
        context: LineEngineContext,
        frame: LineEngineFrame,
        plan: &CompiledLinePlan,
    ) -> LineEngineOutput {
        match self {
            Self::Pd(engine) => {
                engine.render_prime(context, frame, plan, PdEngineParams::new(line.engine.pd()))
            }
            Self::Vz(engine) => {
                engine.render_prime(context, frame, plan, VzEngineParams::new(line.engine.vz()))
            }
        }
    }
}
