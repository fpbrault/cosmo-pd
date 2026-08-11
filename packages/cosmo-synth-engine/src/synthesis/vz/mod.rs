//! VZ synthesis engine: a wave-shaping replica of the Casio VZ-1/VZ-10M
//! "iPD" sound source.
//!
//! Per US5040448A and third-party teardowns of the hardware, VZ's
//! "interactive Phase Distortion" is not phase modulation (there is no
//! carrier `omega*t` term) and not classic Casio CZ phase distortion
//! either -- it is wave shaping: a module's audio-rate output is fed
//! directly as the phase address into another module's sine lookup, so the
//! shaping module runs at 0 Hz. A VZ line here models four modules (M1-M4 on
//! line 1, M5-M8 on line 2) as two pairs, each combined as MIX, RING or
//! PHASE:
//!
//!   MIX:   E_a * W_a(phi_a) + E_b * W_b(phi_b)
//!   RING:  (E_b + E_a * W_a(phi_a)) * W_b(phi_b)
//!   PHASE: E_b * W_b(E_a * W_a(phi_a))            -- module b never advances
//!
//! An external phase input (from the other pair on this line, or from the
//! other cosmo line via `ModMode::Phase`) can replace a pair's own module-a
//! excitation, reproducing the VZ's cross-line cascade (e.g. `M4(M2+M1)+M3`).

pub mod parameters;
mod waveforms;

use crate::dsp_utils::wrap01;
use crate::envelope::{EnvGen, EnvelopeBank, EnvelopeTimingCache, StepEnvelopeTiming};
use crate::params::{LineEnvelopeParams, LineParams, StepEnvData, SynthesisMethod};
use crate::synthesis::pd::algorithms::PER_LINE_HEADROOM;
use crate::synthesis::pd::envelope_map::{dca_env_gain, line_frequency};
use crate::synthesis::pd::modulation::apply_shared_line_mods;

use super::engine::{
    CompiledLinePlan, LineEngine, LineEngineContext, LineEngineFrame, LineEngineOutput,
    LineEnvelopeFrame, LinePhaseContext, LinePhaseFrame, LineRole, LineSignalFrame,
};

pub(crate) use parameters::VzLineParams;
use parameters::{VzModuleParams, VzPairMode};
use waveforms::vz_waveform;

/// VZ-specific per-sample inputs.
#[derive(Debug, Clone, Copy)]
pub(crate) struct VzEngineFrame {
    pub envelopes: LineEnvelopeFrame,
    /// The other cosmo line's completed output sample, present only when
    /// `ModMode::Phase` routes it in as this line's cross-line cascade
    /// input. Consumed by pair 0.
    pub external_phase: Option<f32>,
}

/// Stable per-line metadata for the VZ engine. VZ has no expensive per-sample
/// resolution step (unlike PD's CZ waveform/window decoding), so this plan
/// carries no data today; it exists to satisfy the shared `CompiledLinePlan`
/// contract and as a home for future static resolution.
#[derive(Debug, Clone, Copy)]
pub(crate) struct CompiledVzLinePlan;

impl CompiledVzLinePlan {
    pub(crate) fn from_params(_line: &VzLineParams) -> Self {
        Self
    }
}

#[derive(Clone, Copy)]
pub(crate) struct VzEngineParams<'a> {
    line: &'a VzLineParams,
}

impl<'a> VzEngineParams<'a> {
    #[inline(always)]
    pub fn new(line: &'a VzLineParams) -> Self {
        Self { line }
    }
}

#[derive(Debug, Clone)]
struct VzModuleState {
    phase: f32,
    env: EnvGen,
    prng: u32,
}

impl VzModuleState {
    fn new(seed: u32) -> Self {
        Self {
            phase: 0.0,
            env: EnvGen::default(),
            prng: seed,
        }
    }
}

#[derive(Debug, Clone)]
pub(crate) struct VzEngine {
    role: LineRole,
    modules: [VzModuleState; 4],
    module_timing: StepEnvelopeTiming,
    /// Cached pre-amplitude line output from the most recent `render_primary`
    /// call this sample, reused by `render_prime` so the prime path never
    /// advances module phase or PRNG state a second time.
    prime_source: f32,
}

impl VzEngine {
    pub fn new(role: LineRole) -> Self {
        let base_seed: u32 = match role {
            LineRole::Line1 => 0x5642_5a31, // "VZ1"
            LineRole::Line2 => 0x5642_5a32, // "VZ2"
        };
        Self {
            role,
            modules: core::array::from_fn(|i| {
                VzModuleState::new(base_seed.wrapping_add((i as u32).wrapping_mul(0x2545_f491)))
            }),
            module_timing: module_envelope_timing(48_000.0),
            prime_source: 0.0,
        }
    }

    #[inline(always)]
    fn module_frequency(context: LineEngineContext, module: &VzModuleParams) -> f32 {
        context.frequency
            * (2.0_f32)
                .powf(module.octave + module.detune_note / 12.0 + module.detune_fine / 1200.0)
    }

    /// Render one pair (0 = modules 0+1, 1 = modules 2+3) and advance the
    /// phase of whichever module(s) act as real oscillators this sample.
    /// A module used as a PHASE-mode shaper, or driven by `external`, is a
    /// 0 Hz wave-shaping stage and never advances -- matching the patent's
    /// documented behaviour.
    #[inline(always)]
    fn render_pair(
        &mut self,
        pair_index: usize,
        line: &VzLineParams,
        context: LineEngineContext,
        warp_depth: f32,
        external: Option<f32>,
    ) -> f32 {
        let a = pair_index * 2;
        let b = a + 1;
        let pair = line.pairs[pair_index];
        let a_params = &line.modules[a];
        let b_params = &line.modules[b];

        let wave_a = vz_waveform(
            a_params.waveform,
            self.modules[a].phase,
            &mut self.modules[a].prng,
        );
        let env_a = self.modules[a].env.output * a_params.level;

        let sample = match pair.mode {
            VzPairMode::Mix => {
                let out_a = if a_params.enabled {
                    env_a * wave_a
                } else {
                    0.0
                };
                let out_b = match external {
                    Some(source) => {
                        let wave_b =
                            vz_waveform(b_params.waveform, source, &mut self.modules[b].prng);
                        self.modules[b].env.output * b_params.level * wave_b
                    }
                    None if b_params.enabled => {
                        let wave_b = vz_waveform(
                            b_params.waveform,
                            self.modules[b].phase,
                            &mut self.modules[b].prng,
                        );
                        self.modules[b].env.output * b_params.level * wave_b
                    }
                    None => 0.0,
                };
                out_a + out_b
            }
            VzPairMode::Ring => {
                let exciter = if a_params.enabled {
                    env_a * wave_a
                } else {
                    0.0
                };
                let (wave_b, env_b) = match external {
                    Some(source) => (
                        vz_waveform(b_params.waveform, source, &mut self.modules[b].prng),
                        self.modules[b].env.output * b_params.level,
                    ),
                    None => (
                        vz_waveform(
                            b_params.waveform,
                            self.modules[b].phase,
                            &mut self.modules[b].prng,
                        ),
                        self.modules[b].env.output * b_params.level,
                    ),
                };
                (env_b + exciter) * wave_b
            }
            VzPairMode::Phase => {
                // Module `a` stays active as the exciter even when disabled
                // in the UI, matching the hardware's documented PHASE-mode
                // quirk (`enabled` is intentionally not consulted here).
                let exciter = env_a * wave_a * warp_depth.clamp(0.0, 1.0);
                let phase_input = external.unwrap_or(exciter);
                let wave_b = vz_waveform(b_params.waveform, phase_input, &mut self.modules[b].prng);
                self.modules[b].env.output * b_params.level * wave_b
            }
        };

        let sample_rate = context.sample_rate.max(1.0);
        self.modules[a].phase =
            wrap01(self.modules[a].phase + Self::module_frequency(context, a_params) / sample_rate);

        let b_advances = pair.mode != VzPairMode::Phase && external.is_none();
        if b_advances {
            self.modules[b].phase = wrap01(
                self.modules[b].phase + Self::module_frequency(context, b_params) / sample_rate,
            );
        }

        sample
    }
}

impl LineEngine for VzEngine {
    type Params<'a> = VzEngineParams<'a>;

    fn method(&self) -> SynthesisMethod {
        SynthesisMethod::Vz
    }

    fn role(&self) -> LineRole {
        self.role
    }

    fn reset(&mut self, sample_rate: f32, voice_identity: u64) {
        self.module_timing = module_envelope_timing(sample_rate);
        let identity_salt = (voice_identity as u32).wrapping_mul(0x9e37_79b9);
        for (index, module) in self.modules.iter_mut().enumerate() {
            module.phase = 0.0;
            module.env.reset();
            module.prng = module
                .prng
                .wrapping_add(identity_salt)
                .wrapping_add(index as u32);
        }
    }

    fn note_on(&mut self, note: u8, _velocity: f32, _params: VzEngineParams<'_>) {
        for module in self.modules.iter_mut() {
            module.env.reset();
            module.prng = module
                .prng
                .wrapping_add(note as u32)
                .wrapping_mul(0x9e37_79b9)
                | 1;
        }
    }

    fn note_off(&mut self, params: VzEngineParams<'_>) {
        for (module, module_params) in self.modules.iter_mut().zip(params.line.modules.iter()) {
            module
                .env
                .start_release(&normalized_module_env(&module_params.env));
        }
    }

    #[inline(always)]
    fn advance_envelopes(
        &mut self,
        params: VzEngineParams<'_>,
        envelopes: &LineEnvelopeParams,
        state: &mut EnvelopeBank,
        timing: &EnvelopeTimingCache,
        _note: u8,
    ) -> LineEnvelopeFrame {
        state.slots[0].advance(envelopes.pitch.as_step(), timing.slot(0), 1.0);
        state.slots[1].advance(envelopes.timbre.as_step(), timing.slot(1), 1.0);
        state.slots[2].advance(envelopes.amplitude.as_step(), timing.slot(2), 1.0);

        for (module, module_params) in self.modules.iter_mut().zip(params.line.modules.iter()) {
            let normalized = normalized_module_env(&module_params.env);
            module.env.advance(&normalized, &self.module_timing, 1.0);
        }

        LineEnvelopeFrame {
            pitch: state.slots[0].output,
            timbre: state.slots[1].output,
            amplitude: state.slots[2].output,
        }
    }

    fn start_envelope_release(
        &mut self,
        _params: VzEngineParams<'_>,
        envelopes: &LineEnvelopeParams,
        state: &mut EnvelopeBank,
    ) {
        state.slots[0].start_release(envelopes.pitch.as_step());
        state.slots[1].start_release(envelopes.timbre.as_step());
        state.slots[2].start_release(envelopes.amplitude.as_step());
    }

    fn apply_modulation(
        &self,
        output: &mut LineParams,
        base: &LineParams,
        line_index: u8,
        mod_values: &[f32],
        has_env_step_routes: bool,
    ) {
        *output = *base;
        apply_shared_line_mods(output, base, line_index, mod_values, has_env_step_routes);
    }

    #[inline(always)]
    fn prepare_signal(
        &self,
        line: &LineParams,
        base_frequency: f32,
        envelopes: LineEnvelopeFrame,
        _note: u8,
        timbre_modulation: f32,
        amplitude_modulation: f32,
    ) -> LineSignalFrame {
        LineSignalFrame {
            frequency: line_frequency(
                base_frequency,
                line.octave,
                line.detune_note,
                line.detune_fine,
                envelopes.pitch,
            ),
            timbre: (envelopes.timbre + timbre_modulation).clamp(0.0, 1.0),
            amplitude: (dca_env_gain(envelopes.amplitude) + amplitude_modulation).max(0.0),
        }
    }

    #[inline(always)]
    fn phase_frame(&self, context: LinePhaseContext) -> LinePhaseFrame {
        // VZ owns its own module phase accumulators internally and has no
        // PD-style phase-modulation FX stage.
        LinePhaseFrame {
            phase_a_post: context.phi1,
            phase_b_post: context.phi2,
            pm_delta: 0.0,
            pm_post_mod: 0.0,
        }
    }

    #[inline(always)]
    fn render_primary(
        &mut self,
        context: LineEngineContext,
        frame: LineEngineFrame,
        _plan: &CompiledLinePlan,
        params: VzEngineParams<'_>,
    ) -> LineEngineOutput {
        let LineEngineFrame::Vz(frame) = frame else {
            debug_assert!(false, "VzEngine received a non-VZ render frame");
            return LineEngineOutput::default();
        };
        let line = params.line;
        let warp_depth = frame.envelopes.timbre;

        let pair0 = self.render_pair(0, line, context, warp_depth, frame.external_phase);
        let output = if line.pairs[1].external_phase {
            self.render_pair(1, line, context, warp_depth, Some(pair0))
        } else {
            pair0 + self.render_pair(1, line, context, warp_depth, None)
        };

        self.prime_source = output;
        LineEngineOutput {
            sample: output * frame.envelopes.amplitude * PER_LINE_HEADROOM,
        }
    }

    #[inline(always)]
    fn render_prime(
        &mut self,
        _context: LineEngineContext,
        frame: LineEngineFrame,
        _plan: &CompiledLinePlan,
        _params: VzEngineParams<'_>,
    ) -> LineEngineOutput {
        let LineEngineFrame::Vz(frame) = frame else {
            debug_assert!(false, "VzEngine received a non-VZ render frame");
            return LineEngineOutput::default();
        };
        LineEngineOutput {
            sample: self.prime_source * frame.envelopes.amplitude * PER_LINE_HEADROOM,
        }
    }
}

/// VZ module envelopes reuse the shared `StepEnvData` shape (and its editor)
/// but not PD's human<->raw curve: `level`/`rate` map linearly to [0, 1]
/// rather than through a DCO/DCW/DCA-specific curve, since VZ has no
/// documented equivalent. `level_norm` is recomputed here rather than relying
/// on the deserialized value, which is only populated by PD's load-time
/// normalization pass.
#[inline(always)]
fn normalized_module_env(env: &StepEnvData) -> StepEnvData {
    let mut normalized = *env;
    for step in normalized.steps.iter_mut() {
        step.level_norm = step.level as f32 * (1.0 / 127.0);
    }
    normalized
}

fn module_envelope_timing(sample_rate: f32) -> StepEnvelopeTiming {
    let mut rate_samples = [0u32; 128];
    for (raw_rate, samples) in rate_samples.iter_mut().enumerate() {
        let normalized_rate = raw_rate.min(127) as f32 / 127.0;
        let seconds = 8.0_f32 * (0.003_f32 / 8.0_f32).powf(normalized_rate);
        *samples = (sample_rate * seconds).max(1.0).round() as u32;
    }
    StepEnvelopeTiming::from_rate_samples(rate_samples)
}

#[cfg(test)]
mod tests {
    use super::*;
    use parameters::{VzPairParams, VzWaveform};

    fn context() -> LineEngineContext {
        LineEngineContext {
            frequency: 220.0,
            sample_rate: 48_000.0,
        }
    }

    fn envelope_frame(timbre: f32, amplitude: f32) -> LineEnvelopeFrame {
        LineEnvelopeFrame {
            pitch: 0.0,
            timbre,
            amplitude,
        }
    }

    fn fully_open_line(mode: VzPairMode) -> VzLineParams {
        let mut line = VzLineParams::default();
        for module in line.modules.iter_mut() {
            module.enabled = true;
            module.level = 1.0;
            module.env.steps[0].level_norm = 1.0;
        }
        line.pairs[0].mode = mode;
        line.pairs[1] = VzPairParams {
            mode: VzPairMode::Mix,
            external_phase: false,
        };
        // Silence pair 1 so tests can reason about pair 0 in isolation.
        line.modules[2].level = 0.0;
        line.modules[3].level = 0.0;
        line
    }

    fn render_with_envelopes_open(
        engine: &mut VzEngine,
        line: &VzLineParams,
        ctx: LineEngineContext,
        warp: f32,
    ) -> f32 {
        // Drive every module envelope to full output without going through
        // advance_envelopes (keeps these formula tests independent of the
        // envelope timing curve).
        for module in engine.modules.iter_mut() {
            module.env.output = 1.0;
        }
        let frame = LineEngineFrame::Vz(VzEngineFrame {
            envelopes: envelope_frame(warp, 1.0),
            external_phase: None,
        });
        let plan = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(line));
        engine
            .render_primary(ctx, frame, &plan, VzEngineParams::new(line))
            .sample
    }

    // Sine/Saw waveforms (the defaults used below) ignore the PRNG entirely,
    // so a throwaway seed is fine for recomputing the reference formula.
    fn waveform_at(waveform: VzWaveform, phase: f32) -> f32 {
        let mut unused_prng = 0u32;
        vz_waveform(waveform, phase, &mut unused_prng)
    }

    #[test]
    fn mix_mode_matches_reference_formula() {
        let line = fully_open_line(VzPairMode::Mix);
        let mut engine = VzEngine::new(LineRole::Line1);
        let sample = render_with_envelopes_open(&mut engine, &line, context(), 1.0);

        let wave_a = waveform_at(line.modules[0].waveform, 0.0);
        let wave_b = waveform_at(line.modules[1].waveform, 0.0);
        let expected = (wave_a + wave_b) * PER_LINE_HEADROOM;

        assert!(
            (sample - expected).abs() < 1e-5,
            "mix sample {sample} != expected {expected}"
        );
    }

    #[test]
    fn ring_mode_matches_reference_formula() {
        let line = fully_open_line(VzPairMode::Ring);
        let mut engine = VzEngine::new(LineRole::Line1);
        let sample = render_with_envelopes_open(&mut engine, &line, context(), 1.0);

        let wave_a = waveform_at(line.modules[0].waveform, 0.0);
        let wave_b = waveform_at(line.modules[1].waveform, 0.0);
        // (E_b + E_a*W_a) * W_b, with E_a = E_b = 1.0
        let expected = (1.0 + wave_a) * wave_b * PER_LINE_HEADROOM;

        assert!(
            (sample - expected).abs() < 1e-5,
            "ring sample {sample} != expected {expected}"
        );
    }

    #[test]
    fn phase_mode_matches_reference_formula() {
        let line = fully_open_line(VzPairMode::Phase);
        let mut engine = VzEngine::new(LineRole::Line1);
        let sample = render_with_envelopes_open(&mut engine, &line, context(), 1.0);

        let wave_a = waveform_at(line.modules[0].waveform, 0.0);
        // E_b * W_b(E_a * W_a(phi_a)), all envelopes = 1.0, warp = 1.0
        let phase_input = wave_a;
        let wave_b = waveform_at(line.modules[1].waveform, phase_input);
        let expected = wave_b * PER_LINE_HEADROOM;

        assert!(
            (sample - expected).abs() < 1e-5,
            "phase sample {sample} != expected {expected}"
        );
    }

    #[test]
    fn phase_mode_shaper_module_never_advances_phase() {
        let mut line = fully_open_line(VzPairMode::Phase);
        line.modules[1].octave = 3.0; // should have no audible effect
        line.modules[1].detune_note = 7.0;
        let mut engine = VzEngine::new(LineRole::Line1);
        let plan = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&line));

        for _ in 0..256 {
            let frame = LineEngineFrame::Vz(VzEngineFrame {
                envelopes: envelope_frame(1.0, 1.0),
                external_phase: None,
            });
            engine.render_primary(context(), frame, &plan, VzEngineParams::new(&line));
        }

        assert_eq!(
            engine.modules[1].phase, 0.0,
            "shaper module must stay at 0 Hz"
        );
    }

    #[test]
    fn phase_mode_pitch_is_inert_on_the_shaper_module() {
        let base = fully_open_line(VzPairMode::Phase);
        let mut detuned = base;
        detuned.modules[1].octave = -2.0;
        detuned.modules[1].detune_note = -11.0;
        detuned.modules[1].detune_fine = -60.0;

        let mut engine_a = VzEngine::new(LineRole::Line1);
        let mut engine_b = VzEngine::new(LineRole::Line1);
        for module in engine_a
            .modules
            .iter_mut()
            .chain(engine_b.modules.iter_mut())
        {
            module.env.output = 1.0;
        }

        let plan_a = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&base));
        let plan_b = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&detuned));
        let frame = || {
            LineEngineFrame::Vz(VzEngineFrame {
                envelopes: envelope_frame(1.0, 1.0),
                external_phase: None,
            })
        };

        for _ in 0..64 {
            let out_a = engine_a
                .render_primary(context(), frame(), &plan_a, VzEngineParams::new(&base))
                .sample;
            let out_b = engine_b
                .render_primary(context(), frame(), &plan_b, VzEngineParams::new(&detuned))
                .sample;
            assert_eq!(out_a.to_bits(), out_b.to_bits());
        }
    }

    #[test]
    fn phase_mode_exciter_stays_active_when_disabled_in_ui() {
        let base = fully_open_line(VzPairMode::Phase);
        let mut disabled_exciter = base;
        disabled_exciter.modules[0].enabled = false;

        let mut engine_a = VzEngine::new(LineRole::Line1);
        let mut engine_b = VzEngine::new(LineRole::Line1);
        for module in engine_a
            .modules
            .iter_mut()
            .chain(engine_b.modules.iter_mut())
        {
            module.env.output = 1.0;
        }
        let plan_a = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&base));
        let plan_b = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&disabled_exciter));

        let out_a = engine_a
            .render_primary(
                context(),
                LineEngineFrame::Vz(VzEngineFrame {
                    envelopes: envelope_frame(1.0, 1.0),
                    external_phase: None,
                }),
                &plan_a,
                VzEngineParams::new(&base),
            )
            .sample;
        let out_b = engine_b
            .render_primary(
                context(),
                LineEngineFrame::Vz(VzEngineFrame {
                    envelopes: envelope_frame(1.0, 1.0),
                    external_phase: None,
                }),
                &plan_b,
                VzEngineParams::new(&disabled_exciter),
            )
            .sample;

        assert_eq!(out_a.to_bits(), out_b.to_bits());
    }

    #[test]
    fn external_phase_overrides_pair_zero_excitation() {
        let mut line = fully_open_line(VzPairMode::Phase);
        line.modules[1].waveform = VzWaveform::Sine;
        let mut engine = VzEngine::new(LineRole::Line1);
        for module in engine.modules.iter_mut() {
            module.env.output = 1.0;
        }
        let plan = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&line));

        let without_external = engine
            .render_primary(
                context(),
                LineEngineFrame::Vz(VzEngineFrame {
                    envelopes: envelope_frame(1.0, 1.0),
                    external_phase: None,
                }),
                &plan,
                VzEngineParams::new(&line),
            )
            .sample;

        for module in engine.modules.iter_mut() {
            module.env.output = 1.0;
        }
        let with_external = engine
            .render_primary(
                context(),
                LineEngineFrame::Vz(VzEngineFrame {
                    envelopes: envelope_frame(1.0, 1.0),
                    external_phase: Some(0.9),
                }),
                &plan,
                VzEngineParams::new(&line),
            )
            .sample;

        assert_ne!(without_external.to_bits(), with_external.to_bits());
    }

    #[test]
    fn identical_voice_identity_and_note_render_bit_identical_output() {
        let mut line = fully_open_line(VzPairMode::Mix);
        line.modules[0].waveform = VzWaveform::Noise;

        let mut a = VzEngine::new(LineRole::Line1);
        let mut b = VzEngine::new(LineRole::Line1);
        a.reset(48_000.0, 7);
        b.reset(48_000.0, 7);
        a.note_on(60, 0.8, VzEngineParams::new(&line));
        b.note_on(60, 0.8, VzEngineParams::new(&line));

        let plan = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&line));
        for _ in 0..512 {
            let frame = LineEngineFrame::Vz(VzEngineFrame {
                envelopes: envelope_frame(0.5, 0.5),
                external_phase: None,
            });
            let out_a = a
                .render_primary(context(), frame, &plan, VzEngineParams::new(&line))
                .sample;
            let out_b = b
                .render_primary(context(), frame, &plan, VzEngineParams::new(&line))
                .sample;
            assert_eq!(out_a.to_bits(), out_b.to_bits());
            assert!(out_a.is_finite());
        }
    }

    #[test]
    fn render_prime_reuses_cached_source_without_advancing_state() {
        let line = fully_open_line(VzPairMode::Mix);
        let mut engine = VzEngine::new(LineRole::Line1);
        for module in engine.modules.iter_mut() {
            module.env.output = 1.0;
        }
        let plan = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&line));

        let primary = engine
            .render_primary(
                context(),
                LineEngineFrame::Vz(VzEngineFrame {
                    envelopes: envelope_frame(1.0, 1.0),
                    external_phase: None,
                }),
                &plan,
                VzEngineParams::new(&line),
            )
            .sample;

        let phases_before: Vec<f32> = engine.modules.iter().map(|m| m.phase).collect();
        let prngs_before: Vec<u32> = engine.modules.iter().map(|m| m.prng).collect();

        let prime = engine
            .render_prime(
                context(),
                LineEngineFrame::Vz(VzEngineFrame {
                    envelopes: envelope_frame(1.0, 1.0),
                    external_phase: None,
                }),
                &plan,
                VzEngineParams::new(&line),
            )
            .sample;

        let phases_after: Vec<f32> = engine.modules.iter().map(|m| m.phase).collect();
        let prngs_after: Vec<u32> = engine.modules.iter().map(|m| m.prng).collect();

        assert_eq!(primary, prime);
        assert_eq!(phases_before, phases_after);
        assert_eq!(prngs_before, prngs_after);
    }

    #[test]
    #[cfg(feature = "std")]
    fn no_allocation_after_construction() {
        let line = VzLineParams::default();
        let mut engine = VzEngine::new(LineRole::Line1);
        engine.reset(48_000.0, 1);
        engine.note_on(60, 1.0, VzEngineParams::new(&line));
        let plan = CompiledLinePlan::Vz(CompiledVzLinePlan::from_params(&line));

        assert_no_alloc::assert_no_alloc(|| {
            for _ in 0..64 {
                let frame = LineEngineFrame::Vz(VzEngineFrame {
                    envelopes: envelope_frame(0.5, 0.5),
                    external_phase: None,
                });
                engine.render_primary(context(), frame, &plan, VzEngineParams::new(&line));
            }
        });
    }
}
