use arrayvec::ArrayVec;

/// Per-voice state and sample rendering for the Cosmo PD-101 engine.
///
/// Ported from `createVoice` / `renderVoice` in `pdVisualizerProcessor.js`
/// (lines 488-1257).
extern crate alloc;

use libm::sinf;

use crate::dsp_utils::{lfo_output, wrap01};
use crate::envelope::{EnvGen, EnvelopeKind, EnvelopeTimingCache};
use crate::generators::{self, AlgoRuntimeState, LineRenderConfig};
use crate::params::{
    AlgoControlValueV1, BaseWaveform, EnvStep, LfoWaveform, LineParams, LineSelect, ModDestination,
    ModEnvParams, ModMatrix, ModMode, ModSource, PortamentoMode, StepEnvData, SynthParams,
    NUM_ENV_STEPS,
};

// TODO: Remove after performance testing — disables all modulation matrix routing
const ENABLE_MODULATION: bool = true;

// TWO_PI for f32
const TWO_PI: f32 = core::f32::consts::PI * 2.0;
const DEFAULT_BASE_FREQ: f32 = 220.0;
pub(crate) const ANTI_CLICK_ATTACK_SAMPLES: u32 = 64;
const POP_SUPPRESS_DELTA_THRESHOLD: f32 = 1.2;
const POP_SUPPRESS_EXCESS_KEEP: f32 = 0.15;
// Lower exponent keeps more level during decay (slower perceived drop-off).
const DCA_LEVEL_CURVE_EXPONENT: f32 = 1.5;
// Lower exponent keeps more brightness during DCW envelope decay.
const DCW_LEVEL_CURVE_EXPONENT: f32 = 0.8;
const DUAL_LINE_MIX_GAIN: f32 = 0.8;

fn should_finalize_release(env: &EnvelopeSnapshot) -> bool {
    env.dca1 <= 0.0 && env.dca2 <= 0.0
}

// ---------------------------------------------------------------------------
// ADSR modulation envelope
// ---------------------------------------------------------------------------

/// Phase state for the per-voice ADSR mod envelope.
#[derive(Debug, Clone, Default, PartialEq)]
enum AdsrPhase {
    #[default]
    Idle,
    Attack,
    Decay,
    Sustain,
    Release,
}

/// Simple ADSR envelope used as a modulation source.
#[derive(Debug, Clone, Default)]
pub struct AdsrEnv {
    phase: AdsrPhase,
    pub output: f32,
    release_start: f32,
}

impl AdsrEnv {
    /// Trigger attack — starts or retriggers from the current output level.
    pub fn note_on(&mut self) {
        self.phase = AdsrPhase::Attack;
    }

    /// Begin the release stage from the current output level.
    pub fn note_off(&mut self) {
        self.release_start = self.output;
        self.phase = AdsrPhase::Release;
    }

    /// Reset to idle (silent) state.
    pub fn reset(&mut self) {
        self.phase = AdsrPhase::Idle;
        self.output = 0.0;
        self.release_start = 0.0;
    }

    /// Advance the envelope by one sample and return the current output [0, 1].
    pub fn advance(&mut self, p: &ModEnvParams, sr: f32) -> f32 {
        match self.phase {
            AdsrPhase::Idle => {
                self.output = 0.0;
            }
            AdsrPhase::Attack => {
                let rate = if p.attack > 0.0 {
                    1.0 / (p.attack * sr)
                } else {
                    1.0
                };
                self.output = (self.output + rate).min(1.0);
                if self.output >= 1.0 {
                    self.phase = AdsrPhase::Decay;
                }
            }
            AdsrPhase::Decay => {
                let range = 1.0 - p.sustain;
                let rate = if p.decay > 0.0 && range > 0.0 {
                    range / (p.decay * sr)
                } else {
                    range
                };
                self.output = (self.output - rate).max(p.sustain);
                if self.output <= p.sustain {
                    self.output = p.sustain;
                    self.phase = AdsrPhase::Sustain;
                }
            }
            AdsrPhase::Sustain => {
                self.output = p.sustain;
            }
            AdsrPhase::Release => {
                if self.release_start <= 0.0 {
                    self.output = 0.0;
                    self.phase = AdsrPhase::Idle;
                } else {
                    let rate = if p.release > 0.0 {
                        self.release_start / (p.release * sr)
                    } else {
                        self.release_start
                    };
                    self.output = (self.output - rate).max(0.0);
                    if self.output <= 0.0 {
                        self.output = 0.0;
                        self.phase = AdsrPhase::Idle;
                    }
                }
            }
        }
        self.output
    }
}

// ---------------------------------------------------------------------------
// Modulation helpers
// ---------------------------------------------------------------------------

/// Pre-computed modulation source values for one render call.
#[derive(Debug, Clone, Copy)]
pub(crate) struct ModSources {
    pub lfo1: f32,
    pub lfo2: f32,
    pub random: f32,
    pub mod_env: f32,
    pub velocity: f32,
    pub mod_wheel: f32,
    /// Aftertouch — stub, always 0.0 this phase.
    pub aftertouch: f32,
}

impl ModSources {
    pub(crate) fn new(
        lfo1: f32,
        lfo2: f32,
        random: f32,
        mod_env: f32,
        velocity: f32,
        mod_wheel: f32,
        aftertouch: f32,
    ) -> Self {
        Self {
            lfo1,
            lfo2,
            random,
            mod_env,
            velocity,
            mod_wheel,
            aftertouch,
        }
    }

    pub(crate) fn source_value(&self, source: ModSource) -> f32 {
        match source {
            ModSource::Lfo1 => self.lfo1,
            ModSource::Lfo2 => self.lfo2,
            ModSource::Random => self.random,
            ModSource::ModEnv => self.mod_env,
            ModSource::Velocity => self.velocity,
            ModSource::ModWheel => self.mod_wheel,
            ModSource::Aftertouch => self.aftertouch,
        }
    }
}

const MOD_DESTINATION_COUNT: usize = ModDestination::EqGain8000 as usize + 1;

#[derive(Debug, Clone)]
pub(crate) struct ModValueCache {
    values: [f32; MOD_DESTINATION_COUNT],
}

impl ModValueCache {
    #[inline]
    pub(crate) fn get(&self, dest: ModDestination) -> f32 {
        self.values[dest as usize]
    }
}

impl Default for ModValueCache {
    fn default() -> Self {
        Self {
            values: [0.0_f32; MOD_DESTINATION_COUNT],
        }
    }
}

/// Build cached modulation destination values for one render step.
pub(crate) fn build_mod_value_cache(matrix: &ModMatrix, sources: &ModSources) -> ModValueCache {
    // TODO: Remove after performance testing — disables all modulation routing
    if !ENABLE_MODULATION {
        return ModValueCache {
            values: [0.0_f32; MOD_DESTINATION_COUNT],
        };
    }

    if matrix.routes.is_empty() {
        return ModValueCache {
            values: [0.0_f32; MOD_DESTINATION_COUNT],
        };
    }

    let mut values = [0.0_f32; MOD_DESTINATION_COUNT];
    let mut touched = [false; MOD_DESTINATION_COUNT];
    let mut touched_indices = ArrayVec::<usize, MOD_DESTINATION_COUNT>::new();

    for route in &matrix.routes {
        if !route.enabled || route.amount == 0.0 {
            continue;
        }
        let idx = route.destination as usize;
        if !touched[idx] {
            touched[idx] = true;
            touched_indices
                .try_push(idx)
                .expect("mod destination tracking exceeded capacity");
        }
        values[idx] += route.amount * sources.source_value(route.source);
    }

    for idx in touched_indices {
        values[idx] = values[idx].clamp(-1.0, 1.0);
    }

    ModValueCache { values }
}

fn apply_mod_env_delta_to_cache(matrix: &ModMatrix, cache: &mut ModValueCache, delta: f32) {
    if delta == 0.0 {
        return;
    }

    let mut touched = [false; MOD_DESTINATION_COUNT];
    let mut touched_indices = ArrayVec::<usize, MOD_DESTINATION_COUNT>::new();
    for route in &matrix.routes {
        if !route.enabled || route.amount == 0.0 || route.source != ModSource::ModEnv {
            continue;
        }
        let idx = route.destination as usize;
        if !touched[idx] {
            touched[idx] = true;
            touched_indices
                .try_push(idx)
                .expect("mod destination tracking exceeded capacity");
        }
        cache.values[idx] += route.amount * delta;
    }

    for idx in touched_indices {
        cache.values[idx] = cache.values[idx].clamp(-1.0, 1.0);
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub(crate) struct LineModTargets {
    pub algo_blend: bool,
    pub dco_env: bool,
    pub dcw_env: bool,
    pub dca_env: bool,
}

impl LineModTargets {
    #[inline]
    pub(crate) fn has_any(&self) -> bool {
        self.algo_blend || self.dco_env || self.dcw_env || self.dca_env
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub struct LineModulationState {
    pub(crate) line1: LineModTargets,
    pub(crate) line2: LineModTargets,
}

impl LineModulationState {
    #[inline]
    pub(crate) fn has_any(&self) -> bool {
        self.line1.has_any() || self.line2.has_any()
    }
}

fn algo_param_slot_mods_for_line(line_index: u8, mod_values: &ModValueCache) -> [f32; 8] {
    let destinations = if line_index == 2 {
        [
            ModDestination::Line2AlgoParam1,
            ModDestination::Line2AlgoParam2,
            ModDestination::Line2AlgoParam3,
            ModDestination::Line2AlgoParam4,
            ModDestination::Line2AlgoParam5,
            ModDestination::Line2AlgoParam6,
            ModDestination::Line2AlgoParam7,
            ModDestination::Line2AlgoParam8,
        ]
    } else {
        [
            ModDestination::Line1AlgoParam1,
            ModDestination::Line1AlgoParam2,
            ModDestination::Line1AlgoParam3,
            ModDestination::Line1AlgoParam4,
            ModDestination::Line1AlgoParam5,
            ModDestination::Line1AlgoParam6,
            ModDestination::Line1AlgoParam7,
            ModDestination::Line1AlgoParam8,
        ]
    };

    let mut out = [0.0_f32; 8];
    for (idx, dest) in destinations.iter().enumerate() {
        out[idx] = mod_values.get(*dest);
    }
    out
}

#[derive(Debug, Clone, Copy)]
enum EnvKindKey {
    Dco,
    Dcw,
    Dca,
}

const LINE1_DCO_LEVEL_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line1DcoEnvStep1Level,
    ModDestination::Line1DcoEnvStep2Level,
    ModDestination::Line1DcoEnvStep3Level,
    ModDestination::Line1DcoEnvStep4Level,
    ModDestination::Line1DcoEnvStep5Level,
    ModDestination::Line1DcoEnvStep6Level,
    ModDestination::Line1DcoEnvStep7Level,
    ModDestination::Line1DcoEnvStep8Level,
];

const LINE1_DCO_RATE_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line1DcoEnvStep1Rate,
    ModDestination::Line1DcoEnvStep2Rate,
    ModDestination::Line1DcoEnvStep3Rate,
    ModDestination::Line1DcoEnvStep4Rate,
    ModDestination::Line1DcoEnvStep5Rate,
    ModDestination::Line1DcoEnvStep6Rate,
    ModDestination::Line1DcoEnvStep7Rate,
    ModDestination::Line1DcoEnvStep8Rate,
];

const LINE1_DCW_LEVEL_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line1DcwEnvStep1Level,
    ModDestination::Line1DcwEnvStep2Level,
    ModDestination::Line1DcwEnvStep3Level,
    ModDestination::Line1DcwEnvStep4Level,
    ModDestination::Line1DcwEnvStep5Level,
    ModDestination::Line1DcwEnvStep6Level,
    ModDestination::Line1DcwEnvStep7Level,
    ModDestination::Line1DcwEnvStep8Level,
];

const LINE1_DCW_RATE_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line1DcwEnvStep1Rate,
    ModDestination::Line1DcwEnvStep2Rate,
    ModDestination::Line1DcwEnvStep3Rate,
    ModDestination::Line1DcwEnvStep4Rate,
    ModDestination::Line1DcwEnvStep5Rate,
    ModDestination::Line1DcwEnvStep6Rate,
    ModDestination::Line1DcwEnvStep7Rate,
    ModDestination::Line1DcwEnvStep8Rate,
];

const LINE1_DCA_LEVEL_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line1DcaEnvStep1Level,
    ModDestination::Line1DcaEnvStep2Level,
    ModDestination::Line1DcaEnvStep3Level,
    ModDestination::Line1DcaEnvStep4Level,
    ModDestination::Line1DcaEnvStep5Level,
    ModDestination::Line1DcaEnvStep6Level,
    ModDestination::Line1DcaEnvStep7Level,
    ModDestination::Line1DcaEnvStep8Level,
];

const LINE1_DCA_RATE_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line1DcaEnvStep1Rate,
    ModDestination::Line1DcaEnvStep2Rate,
    ModDestination::Line1DcaEnvStep3Rate,
    ModDestination::Line1DcaEnvStep4Rate,
    ModDestination::Line1DcaEnvStep5Rate,
    ModDestination::Line1DcaEnvStep6Rate,
    ModDestination::Line1DcaEnvStep7Rate,
    ModDestination::Line1DcaEnvStep8Rate,
];

const LINE2_DCO_LEVEL_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line2DcoEnvStep1Level,
    ModDestination::Line2DcoEnvStep2Level,
    ModDestination::Line2DcoEnvStep3Level,
    ModDestination::Line2DcoEnvStep4Level,
    ModDestination::Line2DcoEnvStep5Level,
    ModDestination::Line2DcoEnvStep6Level,
    ModDestination::Line2DcoEnvStep7Level,
    ModDestination::Line2DcoEnvStep8Level,
];

const LINE2_DCO_RATE_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line2DcoEnvStep1Rate,
    ModDestination::Line2DcoEnvStep2Rate,
    ModDestination::Line2DcoEnvStep3Rate,
    ModDestination::Line2DcoEnvStep4Rate,
    ModDestination::Line2DcoEnvStep5Rate,
    ModDestination::Line2DcoEnvStep6Rate,
    ModDestination::Line2DcoEnvStep7Rate,
    ModDestination::Line2DcoEnvStep8Rate,
];

const LINE2_DCW_LEVEL_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line2DcwEnvStep1Level,
    ModDestination::Line2DcwEnvStep2Level,
    ModDestination::Line2DcwEnvStep3Level,
    ModDestination::Line2DcwEnvStep4Level,
    ModDestination::Line2DcwEnvStep5Level,
    ModDestination::Line2DcwEnvStep6Level,
    ModDestination::Line2DcwEnvStep7Level,
    ModDestination::Line2DcwEnvStep8Level,
];

const LINE2_DCW_RATE_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line2DcwEnvStep1Rate,
    ModDestination::Line2DcwEnvStep2Rate,
    ModDestination::Line2DcwEnvStep3Rate,
    ModDestination::Line2DcwEnvStep4Rate,
    ModDestination::Line2DcwEnvStep5Rate,
    ModDestination::Line2DcwEnvStep6Rate,
    ModDestination::Line2DcwEnvStep7Rate,
    ModDestination::Line2DcwEnvStep8Rate,
];

const LINE2_DCA_LEVEL_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line2DcaEnvStep1Level,
    ModDestination::Line2DcaEnvStep2Level,
    ModDestination::Line2DcaEnvStep3Level,
    ModDestination::Line2DcaEnvStep4Level,
    ModDestination::Line2DcaEnvStep5Level,
    ModDestination::Line2DcaEnvStep6Level,
    ModDestination::Line2DcaEnvStep7Level,
    ModDestination::Line2DcaEnvStep8Level,
];

const LINE2_DCA_RATE_DESTS: [ModDestination; NUM_ENV_STEPS] = [
    ModDestination::Line2DcaEnvStep1Rate,
    ModDestination::Line2DcaEnvStep2Rate,
    ModDestination::Line2DcaEnvStep3Rate,
    ModDestination::Line2DcaEnvStep4Rate,
    ModDestination::Line2DcaEnvStep5Rate,
    ModDestination::Line2DcaEnvStep6Rate,
    ModDestination::Line2DcaEnvStep7Rate,
    ModDestination::Line2DcaEnvStep8Rate,
];

#[inline]
fn env_step_destinations(
    line_index: u8,
    env_kind: EnvKindKey,
) -> (
    &'static [ModDestination; NUM_ENV_STEPS],
    &'static [ModDestination; NUM_ENV_STEPS],
) {
    match (line_index, env_kind) {
        (2, EnvKindKey::Dco) => (&LINE2_DCO_LEVEL_DESTS, &LINE2_DCO_RATE_DESTS),
        (2, EnvKindKey::Dcw) => (&LINE2_DCW_LEVEL_DESTS, &LINE2_DCW_RATE_DESTS),
        (2, EnvKindKey::Dca) => (&LINE2_DCA_LEVEL_DESTS, &LINE2_DCA_RATE_DESTS),
        (_, EnvKindKey::Dco) => (&LINE1_DCO_LEVEL_DESTS, &LINE1_DCO_RATE_DESTS),
        (_, EnvKindKey::Dcw) => (&LINE1_DCW_LEVEL_DESTS, &LINE1_DCW_RATE_DESTS),
        (_, EnvKindKey::Dca) => (&LINE1_DCA_LEVEL_DESTS, &LINE1_DCA_RATE_DESTS),
    }
}

fn apply_env_step_modulation(
    env: &StepEnvData,
    line_index: u8,
    env_kind: EnvKindKey,
    mod_values: &ModValueCache,
) -> StepEnvData {
    let mut modded = env.clone();
    let (level_dests, rate_dests) = env_step_destinations(line_index, env_kind);

    for step_index in 0..NUM_ENV_STEPS {
        let level_mod = mod_values.get(level_dests[step_index]);
        let rate_mod = mod_values.get(rate_dests[step_index]);

        let step: &mut EnvStep = &mut modded.steps[step_index];
        let next_level = (step.level as f32 + level_mod * 127.0)
            .round()
            .clamp(0.0, 127.0) as u8;
        let next_rate = (step.rate as f32 + rate_mod * 127.0)
            .round()
            .clamp(0.0, 127.0) as u8;
        step.level = next_level;
        step.rate = next_rate;
    }

    modded
}

#[derive(Debug, Clone)]
struct LineRuntimeParams<'a> {
    algo: crate::params::Algo,
    algo2: Option<crate::params::Algo>,
    algo_blend: f32,
    base_waveform_a: BaseWaveform,
    base_waveform_b: BaseWaveform,
    window: crate::params::WindowType,
    dca_base: f32,
    dcw_base: f32,
    detune_note: f32,
    detune_fine: f32,
    octave: f32,
    dco_env: StepEnvData,
    dcw_env: StepEnvData,
    dca_env: StepEnvData,
    key_follow: f32,
    algo_controls_a: Option<&'a [AlgoControlValueV1]>,
    algo_controls_b: Option<&'a [AlgoControlValueV1]>,
}

impl<'a> LineRuntimeParams<'a> {
    fn from_line(line: &'a LineParams) -> Self {
        Self {
            algo: line.algo,
            algo2: line.algo2,
            algo_blend: line.algo_blend,
            base_waveform_a: line.base_waveform_a,
            base_waveform_b: line.base_waveform_b,
            window: line.window,
            dca_base: line.dca_base,
            dcw_base: line.dcw_base,
            detune_note: line.detune_note,
            detune_fine: line.detune_fine,
            octave: line.octave,
            dco_env: line.dco_env.clone(),
            dcw_env: line.dcw_env.clone(),
            dca_env: line.dca_env.clone(),
            key_follow: line.key_follow,
            algo_controls_a: line.algo_controls_a.as_deref(),
            algo_controls_b: line.algo_controls_b.as_deref(),
        }
    }

    fn apply_modulation(
        &self,
        line_index: u8,
        mod_values: &ModValueCache,
        targets: LineModTargets,
    ) -> Self {
        let mut modded = self.clone();
        if targets.algo_blend {
            let algo_blend_dest = if line_index == 2 {
                ModDestination::Line2AlgoBlend
            } else {
                ModDestination::Line1AlgoBlend
            };
            modded.algo_blend =
                (modded.algo_blend + mod_values.get(algo_blend_dest)).clamp(0.0, 1.0);
        }
        if targets.dco_env {
            modded.dco_env =
                apply_env_step_modulation(&modded.dco_env, line_index, EnvKindKey::Dco, mod_values);
        }
        if targets.dcw_env {
            modded.dcw_env =
                apply_env_step_modulation(&modded.dcw_env, line_index, EnvKindKey::Dcw, mod_values);
        }
        if targets.dca_env {
            modded.dca_env =
                apply_env_step_modulation(&modded.dca_env, line_index, EnvKindKey::Dca, mod_values);
        }
        modded
    }
}

#[cfg(test)]
fn modulated_line_params<'a>(
    line: &'a LineParams,
    line_index: u8,
    mod_values: &ModValueCache,
    targets: LineModTargets,
) -> LineRuntimeParams<'a> {
    LineRuntimeParams::from_line(line).apply_modulation(line_index, mod_values, targets)
}

trait LineFrequencySource {
    fn octave(&self) -> f32;
    fn detune_note(&self) -> f32;
    fn detune_fine(&self) -> f32;
}

impl LineFrequencySource for LineParams {
    fn octave(&self) -> f32 {
        self.octave
    }

    fn detune_note(&self) -> f32 {
        self.detune_note
    }

    fn detune_fine(&self) -> f32 {
        self.detune_fine
    }
}

impl<'a> LineFrequencySource for LineRuntimeParams<'a> {
    fn octave(&self) -> f32 {
        self.octave
    }

    fn detune_note(&self) -> f32 {
        self.detune_note
    }

    fn detune_fine(&self) -> f32 {
        self.detune_fine
    }
}

#[inline]
pub(crate) fn line_modulation_state(matrix: &ModMatrix) -> LineModulationState {
    let mut state = LineModulationState::default();

    for route in &matrix.routes {
        if !route.enabled {
            continue;
        }

        match route.destination {
            ModDestination::Line1AlgoBlend => state.line1.algo_blend = true,
            ModDestination::Line2AlgoBlend => state.line2.algo_blend = true,
            ModDestination::Line1DcoEnvStep1Level
            | ModDestination::Line1DcoEnvStep1Rate
            | ModDestination::Line1DcoEnvStep2Level
            | ModDestination::Line1DcoEnvStep2Rate
            | ModDestination::Line1DcoEnvStep3Level
            | ModDestination::Line1DcoEnvStep3Rate
            | ModDestination::Line1DcoEnvStep4Level
            | ModDestination::Line1DcoEnvStep4Rate
            | ModDestination::Line1DcoEnvStep5Level
            | ModDestination::Line1DcoEnvStep5Rate
            | ModDestination::Line1DcoEnvStep6Level
            | ModDestination::Line1DcoEnvStep6Rate
            | ModDestination::Line1DcoEnvStep7Level
            | ModDestination::Line1DcoEnvStep7Rate
            | ModDestination::Line1DcoEnvStep8Level
            | ModDestination::Line1DcoEnvStep8Rate => state.line1.dco_env = true,
            ModDestination::Line1DcwEnvStep1Level
            | ModDestination::Line1DcwEnvStep1Rate
            | ModDestination::Line1DcwEnvStep2Level
            | ModDestination::Line1DcwEnvStep2Rate
            | ModDestination::Line1DcwEnvStep3Level
            | ModDestination::Line1DcwEnvStep3Rate
            | ModDestination::Line1DcwEnvStep4Level
            | ModDestination::Line1DcwEnvStep4Rate
            | ModDestination::Line1DcwEnvStep5Level
            | ModDestination::Line1DcwEnvStep5Rate
            | ModDestination::Line1DcwEnvStep6Level
            | ModDestination::Line1DcwEnvStep6Rate
            | ModDestination::Line1DcwEnvStep7Level
            | ModDestination::Line1DcwEnvStep7Rate
            | ModDestination::Line1DcwEnvStep8Level
            | ModDestination::Line1DcwEnvStep8Rate => state.line1.dcw_env = true,
            ModDestination::Line1DcaEnvStep1Level
            | ModDestination::Line1DcaEnvStep1Rate
            | ModDestination::Line1DcaEnvStep2Level
            | ModDestination::Line1DcaEnvStep2Rate
            | ModDestination::Line1DcaEnvStep3Level
            | ModDestination::Line1DcaEnvStep3Rate
            | ModDestination::Line1DcaEnvStep4Level
            | ModDestination::Line1DcaEnvStep4Rate
            | ModDestination::Line1DcaEnvStep5Level
            | ModDestination::Line1DcaEnvStep5Rate
            | ModDestination::Line1DcaEnvStep6Level
            | ModDestination::Line1DcaEnvStep6Rate
            | ModDestination::Line1DcaEnvStep7Level
            | ModDestination::Line1DcaEnvStep7Rate
            | ModDestination::Line1DcaEnvStep8Level
            | ModDestination::Line1DcaEnvStep8Rate => state.line1.dca_env = true,
            ModDestination::Line2DcoEnvStep1Level
            | ModDestination::Line2DcoEnvStep1Rate
            | ModDestination::Line2DcoEnvStep2Level
            | ModDestination::Line2DcoEnvStep2Rate
            | ModDestination::Line2DcoEnvStep3Level
            | ModDestination::Line2DcoEnvStep3Rate
            | ModDestination::Line2DcoEnvStep4Level
            | ModDestination::Line2DcoEnvStep4Rate
            | ModDestination::Line2DcoEnvStep5Level
            | ModDestination::Line2DcoEnvStep5Rate
            | ModDestination::Line2DcoEnvStep6Level
            | ModDestination::Line2DcoEnvStep6Rate
            | ModDestination::Line2DcoEnvStep7Level
            | ModDestination::Line2DcoEnvStep7Rate
            | ModDestination::Line2DcoEnvStep8Level
            | ModDestination::Line2DcoEnvStep8Rate => state.line2.dco_env = true,
            ModDestination::Line2DcwEnvStep1Level
            | ModDestination::Line2DcwEnvStep1Rate
            | ModDestination::Line2DcwEnvStep2Level
            | ModDestination::Line2DcwEnvStep2Rate
            | ModDestination::Line2DcwEnvStep3Level
            | ModDestination::Line2DcwEnvStep3Rate
            | ModDestination::Line2DcwEnvStep4Level
            | ModDestination::Line2DcwEnvStep4Rate
            | ModDestination::Line2DcwEnvStep5Level
            | ModDestination::Line2DcwEnvStep5Rate
            | ModDestination::Line2DcwEnvStep6Level
            | ModDestination::Line2DcwEnvStep6Rate
            | ModDestination::Line2DcwEnvStep7Level
            | ModDestination::Line2DcwEnvStep7Rate
            | ModDestination::Line2DcwEnvStep8Level
            | ModDestination::Line2DcwEnvStep8Rate => state.line2.dcw_env = true,
            ModDestination::Line2DcaEnvStep1Level
            | ModDestination::Line2DcaEnvStep1Rate
            | ModDestination::Line2DcaEnvStep2Level
            | ModDestination::Line2DcaEnvStep2Rate
            | ModDestination::Line2DcaEnvStep3Level
            | ModDestination::Line2DcaEnvStep3Rate
            | ModDestination::Line2DcaEnvStep4Level
            | ModDestination::Line2DcaEnvStep4Rate
            | ModDestination::Line2DcaEnvStep5Level
            | ModDestination::Line2DcaEnvStep5Rate
            | ModDestination::Line2DcaEnvStep6Level
            | ModDestination::Line2DcaEnvStep6Rate
            | ModDestination::Line2DcaEnvStep7Level
            | ModDestination::Line2DcaEnvStep7Rate
            | ModDestination::Line2DcaEnvStep8Level
            | ModDestination::Line2DcaEnvStep8Rate => state.line2.dca_env = true,
            _ => {}
        }
    }

    state
}

// ---------------------------------------------------------------------------
// LineEnvs — per-line group of three envelope generators
// ---------------------------------------------------------------------------

/// The three envelope generators for a single oscillator line (DCO, DCW, DCA).
#[derive(Debug, Clone, Default)]
pub struct LineEnvs {
    pub dco: EnvGen,
    pub dcw: EnvGen,
    pub dca: EnvGen,
}

// ---------------------------------------------------------------------------
// Voice
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
pub struct Voice {
    pub phi1: f32,
    pub phi2: f32,
    pub cycle_count1: u32,
    pub cycle_count2: u32,
    pub pm_phi: f32,
    pub vibrato_phase: f32,
    pub vibrato_delay_counter: u32,
    pub current_freq: f32,
    pub target_freq: f32,
    pub glide_progress: f32,
    pub glide_start_freq: f32,
    pub is_releasing: bool,
    pub is_silent: bool,
    pub sustained: bool,
    pub gate_was_open: bool,
    pub note: Option<u8>,
    pub env_note: u8,
    pub frequency: f32,
    pub velocity: f32,

    pub line1_env: LineEnvs,
    pub line2_env: LineEnvs,

    /// ADSR mod envelope used as a modulation source.
    pub mod_env: AdsrEnv,

    /// Counts down remaining fade samples for the anti-click fade-out.
    /// Non-zero while a release fade is in progress.
    pub anti_click_fade: u32,

    /// Total fade length for current anti-click fade (supports adaptive fades).
    pub anti_click_fade_len: u32,

    /// True after fade-out reaches 0 while waiting for a safe zero-cross stop.
    pub zero_cross_stop_pending: bool,

    /// Safety timeout for zero-cross stop pending state.
    pub zero_cross_stop_wait: u32,

    /// Counts down a short note-on ramp used to suppress start transients.
    pub anti_click_attack: u32,

    /// Smoothed DCW values used to de-zipper rapid DCW changes.
    pub smoothed_dcw1: f32,
    pub smoothed_dcw2: f32,

    /// Previous post-modulation sample for one-sample discontinuity suppression.
    pub last_output_sample: f32,

    /// Smoothed absolute output level used to decide when release tail is
    /// truly near silence (avoids false triggers at zero crossings).
    pub release_tail_level: f32,

    /// Per-voice runtime state owned by generator algorithms.
    pub algo_runtime: AlgoRuntimeState,
}

impl Voice {
    pub fn new() -> Self {
        Self {
            phi1: 0.0,
            phi2: 0.0,
            cycle_count1: 0,
            cycle_count2: 0,
            pm_phi: 0.0,
            vibrato_phase: 0.0,
            vibrato_delay_counter: 0,
            current_freq: 0.0,
            target_freq: 0.0,
            glide_progress: 0.0,
            glide_start_freq: 0.0,
            is_releasing: false,
            is_silent: true,
            sustained: false,
            gate_was_open: false,
            env_note: 60,
            note: None,
            frequency: 0.0,
            velocity: 1.0,
            line1_env: LineEnvs::default(),
            line2_env: LineEnvs::default(),
            mod_env: AdsrEnv::default(),
            anti_click_fade: 0,
            anti_click_fade_len: 0,
            zero_cross_stop_pending: false,
            zero_cross_stop_wait: 0,
            anti_click_attack: 0,
            smoothed_dcw1: 0.0,
            smoothed_dcw2: 0.0,
            last_output_sample: 0.0,
            release_tail_level: 0.0,
            algo_runtime: AlgoRuntimeState::default(),
        }
    }

    /// Reset all envelope generators to their initial state.
    pub fn reset_envs(&mut self) {
        self.line1_env.dco.reset();
        self.line1_env.dcw.reset();
        self.line1_env.dca.reset();
        self.line2_env.dco.reset();
        self.line2_env.dcw.reset();
        self.line2_env.dca.reset();
        self.mod_env.reset();
    }
}

impl Default for Voice {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Debug, Clone, Copy)]
struct EnvelopeSnapshot {
    dco1_env: f32,
    dco2_env: f32,
    dca1: f32,
    dca2: f32,
    dcw1: f32,
    dcw2: f32,
}

#[derive(Debug, Clone, Copy)]
struct SignalState {
    effective_freq1: f32,
    effective_freq2: f32,
    final_dcw1: f32,
    final_dcw2: f32,
    final_dca1: f32,
    final_dca2: f32,
}

#[derive(Debug, Clone, Copy)]
struct PhaseFrame {
    phi1: f32,
    phi2: f32,
    pm_delta: f32,
    /// Warp input phase for line 1 (phi1 + pm_mod when pm_pre, else phi1).
    phase_a_post: f32,
    /// Warp input phase for line 2 (phi2 + pm_mod when pm_pre, else phi2).
    phase_b_post: f32,
    /// Post-warp PM offset applied inside render_algo_sample (0 when pm_pre, else pm_mod).
    pm_post_mod: f32,
}

// ---------------------------------------------------------------------------
// render_voice
// ---------------------------------------------------------------------------

/// Render one audio sample from `voice`.
///
/// Returns `0.0` when the voice is silent.
///
/// # Arguments
/// * `voice`       – mutable reference to the voice state
/// * `p`           – current synth parameters
/// * `lfo_mod_val` – pre-computed LFO output value for this sample
/// * `lfo2_mod_val` – pre-computed LFO2 output value for this sample
/// * `sr`          – sample rate in Hz
pub(crate) fn render_voice(
    voice: &mut Voice,
    p: &SynthParams,
    lfo_mod_val: f32,
    lfo2_mod_val: f32,
    random_mod_val: f32,
    sr: f32,
    timing: &EnvelopeTimingCache,
    pitch_bend_ratio: f32,
    mod_wheel: f32,
    aftertouch: f32,
    line_modulation_state: LineModulationState,
    dcw_dezipper_alpha: f32,
    _release_tail_alpha: f32,
) -> f32 {
    let base_freq = base_voice_frequency(voice);

    // Apply per-line modulation destinations before any per-sample envelope/
    // algorithm work so all downstream stages use a consistent modulated view.
    let preview_mod_sources = ModSources::new(
        lfo_mod_val,
        lfo2_mod_val,
        random_mod_val,
        voice.mod_env.output,
        voice.velocity,
        mod_wheel,
        aftertouch,
    );
    let mut mod_values = build_mod_value_cache(&p.mod_matrix, &preview_mod_sources);
    let line1_base = LineRuntimeParams::from_line(&p.line1);
    let line2_base = LineRuntimeParams::from_line(&p.line2);
    let line1_modded_storage;
    let line2_modded_storage;
    let (line1_modded, line2_modded) = if line_modulation_state.has_any() {
        let line1 = if line_modulation_state.line1.has_any() {
            line1_modded_storage =
                line1_base.apply_modulation(1, &mod_values, line_modulation_state.line1);
            &line1_modded_storage
        } else {
            &line1_base
        };
        let line2 = if line_modulation_state.line2.has_any() {
            line2_modded_storage =
                line2_base.apply_modulation(2, &mod_values, line_modulation_state.line2);
            &line2_modded_storage
        } else {
            &line2_base
        };
        (line1, line2)
    } else {
        (&line1_base, &line2_base)
    };

    let env = advance_envelopes(voice, line1_modded, line2_modded, timing);

    if voice.is_silent {
        advance_silent_voice(voice, line1_modded, line2_modded, p, sr, base_freq);
        voice.last_output_sample = 0.0;
        voice.release_tail_level = 0.0;
        voice.anti_click_fade_len = 0;
        voice.zero_cross_stop_pending = false;
        voice.zero_cross_stop_wait = 0;
        return 0.0;
    }

    if voice.is_releasing && should_finalize_release(&env) {
        return finalize_voice_silence(voice);
    }

    // Advance per-voice ADSR mod envelope.
    let mod_env_val = voice.mod_env.advance(&p.mod_env, sr);
    apply_mod_env_delta_to_cache(
        &p.mod_matrix,
        &mut mod_values,
        mod_env_val - preview_mod_sources.mod_env,
    );
    let line1_algo_param_mods = algo_param_slot_mods_for_line(1, &mod_values);
    let line2_algo_param_mods = algo_param_slot_mods_for_line(2, &mod_values);
    let mut signal = build_signal_state(line1_modded, line2_modded, &mod_values, &env, base_freq);
    apply_dcw_dezipper(voice, dcw_dezipper_alpha, &mut signal);
    apply_pitch_and_lfo_modulation(
        voice,
        p,
        sr,
        base_freq,
        pitch_bend_ratio,
        &mod_values,
        &mut signal,
    );

    let phase = build_phase_frame(voice, p, sr, base_freq, &mod_values);
    let (s1, ks_raw1) = voice
        .algo_runtime
        .render_line1(line_render_config_from_runtime(
            line1_modded,
            voice.cycle_count1,
            phase.phi1,
            phase.phase_a_post,
            signal.final_dcw1,
            signal.final_dca1,
            signal.effective_freq1,
            sr,
            line1_algo_param_mods,
            phase.pm_post_mod,
        ));
    let (s2, ks_raw2) = voice
        .algo_runtime
        .render_line2(line_render_config_from_runtime(
            line2_modded,
            voice.cycle_count2,
            phase.phi2,
            phase.phase_b_post,
            signal.final_dcw2,
            signal.final_dca2,
            signal.effective_freq2,
            sr,
            line2_algo_param_mods,
            phase.pm_post_mod,
        ));

    let sample = mix_line_outputs(
        p,
        phase.phi1,
        phase.phi2,
        s1,
        s2,
        line1_modded,
        line2_modded,
        voice.cycle_count1,
        voice.cycle_count2,
        ks_raw1,
        ks_raw2,
        signal.final_dcw1,
        signal.final_dcw2,
        signal.final_dca1,
        signal.final_dca2,
        line1_algo_param_mods,
        line2_algo_param_mods,
    );

    // Apply volume modulation from mod matrix
    let volume_mod = mod_values.get(ModDestination::Volume);
    let mut sample = sample * (1.0 + volume_mod);

    if voice.anti_click_attack > 0 {
        let ramp = 1.0 - (voice.anti_click_attack as f32 / ANTI_CLICK_ATTACK_SAMPLES as f32);
        sample *= ramp;
        voice.anti_click_attack -= 1;
    }

    sample = suppress_sample_discontinuity(voice.last_output_sample, sample);

    advance_voice_phase(
        voice,
        sr,
        signal.effective_freq1,
        signal.effective_freq2,
        phase.pm_delta,
    );

    voice.last_output_sample = sample;
    sample
}

fn finalize_voice_silence(voice: &mut Voice) -> f32 {
    voice.is_silent = true;
    voice.note = None;
    voice.env_note = 60;
    voice.line1_env.dca.output = 0.0;
    voice.line2_env.dca.output = 0.0;
    voice.mod_env.reset();
    voice.last_output_sample = 0.0;
    voice.release_tail_level = 0.0;
    voice.anti_click_fade = 0;
    voice.anti_click_fade_len = 0;
    voice.zero_cross_stop_pending = false;
    voice.zero_cross_stop_wait = 0;
    0.0
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn base_voice_frequency(voice: &Voice) -> f32 {
    if voice.frequency > 0.0 {
        voice.frequency
    } else {
        DEFAULT_BASE_FREQ
    }
}

fn advance_envelopes(
    voice: &mut Voice,
    line1: &LineRuntimeParams<'_>,
    line2: &LineRuntimeParams<'_>,
    timing: &EnvelopeTimingCache,
) -> EnvelopeSnapshot {
    let note = voice.env_note;

    voice.line1_env.dco.advance(
        EnvelopeKind::Dco,
        &line1.dco_env,
        timing,
        line1.key_follow,
        note,
    );
    voice.line1_env.dcw.advance(
        EnvelopeKind::Dcw,
        &line1.dcw_env,
        timing,
        line1.key_follow,
        note,
    );
    voice.line1_env.dca.advance(
        EnvelopeKind::Dca,
        &line1.dca_env,
        timing,
        line1.key_follow,
        note,
    );
    voice.line2_env.dco.advance(
        EnvelopeKind::Dco,
        &line2.dco_env,
        timing,
        line2.key_follow,
        note,
    );
    voice.line2_env.dcw.advance(
        EnvelopeKind::Dcw,
        &line2.dcw_env,
        timing,
        line2.key_follow,
        note,
    );
    voice.line2_env.dca.advance(
        EnvelopeKind::Dca,
        &line2.dca_env,
        timing,
        line2.key_follow,
        note,
    );

    EnvelopeSnapshot {
        dco1_env: voice.line1_env.dco.output,
        dco2_env: voice.line2_env.dco.output,
        dca1: voice.line1_env.dca.output,
        dca2: voice.line2_env.dca.output,
        dcw1: line1.dcw_base * cz_dcw_env_depth(voice.line1_env.dcw.output),
        dcw2: line2.dcw_base * cz_dcw_env_depth(voice.line2_env.dcw.output),
    }
}

fn advance_silent_voice(
    voice: &mut Voice,
    line1: &LineRuntimeParams<'_>,
    line2: &LineRuntimeParams<'_>,
    p: &SynthParams,
    sr: f32,
    base_freq: f32,
) {
    let freq1 = line_frequency(base_freq, line1, 0.0);
    let freq2 = line_frequency(base_freq, line2, 0.0);
    let pm_delta = match p.phase_mod_params() {
        Some(pm) => (base_freq * pm.ratio) / sr,
        None => base_freq / sr,
    };

    advance_voice_phase(voice, sr, freq1, freq2, pm_delta);
}

fn build_signal_state(
    line1: &LineRuntimeParams<'_>,
    line2: &LineRuntimeParams<'_>,
    mod_values: &ModValueCache,
    env: &EnvelopeSnapshot,
    base_freq: f32,
) -> SignalState {
    let dca1_level = line1.dca_base * cz_dca_env_gain(env.dca1);
    let dca2_level = line2.dca_base * cz_dca_env_gain(env.dca2);

    // Mod matrix offsets for DCW/DCA
    let dcw1_mod = mod_values.get(ModDestination::Line1DcwBase);
    let dcw2_mod = mod_values.get(ModDestination::Line2DcwBase);
    let dca1_mod = mod_values.get(ModDestination::Line1DcaBase);
    let dca2_mod = mod_values.get(ModDestination::Line2DcaBase);

    SignalState {
        effective_freq1: line_frequency(base_freq, line1, env.dco1_env),
        effective_freq2: line_frequency(base_freq, line2, env.dco2_env),
        final_dcw1: (env.dcw1 + dcw1_mod).clamp(0.0, 1.0),
        final_dcw2: (env.dcw2 + dcw2_mod).clamp(0.0, 1.0),
        final_dca1: (dca1_level + dca1_mod).max(0.0),
        final_dca2: (dca2_level + dca2_mod).max(0.0),
    }
}

fn apply_dcw_dezipper(voice: &mut Voice, alpha: f32, signal: &mut SignalState) {
    voice.smoothed_dcw1 += (signal.final_dcw1 - voice.smoothed_dcw1) * alpha;
    voice.smoothed_dcw2 += (signal.final_dcw2 - voice.smoothed_dcw2) * alpha;

    signal.final_dcw1 = voice.smoothed_dcw1.clamp(0.0, 1.0);
    signal.final_dcw2 = voice.smoothed_dcw2.clamp(0.0, 1.0);
}

#[inline]
fn suppress_sample_discontinuity(prev_sample: f32, sample: f32) -> f32 {
    let delta = sample - prev_sample;
    let delta_abs = libm::fabsf(delta);
    if delta_abs <= POP_SUPPRESS_DELTA_THRESHOLD {
        return sample;
    }

    let excess = delta_abs - POP_SUPPRESS_DELTA_THRESHOLD;
    let allowed = POP_SUPPRESS_DELTA_THRESHOLD + excess * POP_SUPPRESS_EXCESS_KEEP;
    prev_sample + delta.signum() * allowed
}

/// Maps a normalized DCO envelope output (0.0–1.0) to an absolute semitone
/// offset using the CZ-101 piecewise non-linear pitch curve.
///
/// The CZ-101 display levels 0–99 map to pitch as follows:
///   - Levels  0–64: linear, 1 semitone per 8 levels  (max 8 st)
///   - Levels >64: each increment raises pitch by a whole tone (+2 semitones)
///                 (max 8 + 35*2 = 78 st at level 99)
///
/// This function returns a semitone offset in [0.0, 78.0].
/// The input is clamped to [0.0, 1.0] before conversion.
fn cz_dco_env_semitones(dco_env: f32) -> f32 {
    let level = dco_env.clamp(0.0, 1.0) * 99.0;
    if level <= 64.0 {
        level / 8.0
    } else {
        8.0 + (level - 64.0) * 2.0
    }
}

#[inline]
fn cz_dca_env_gain(dca_env: f32) -> f32 {
    let level = dca_env.clamp(0.0, 1.0);
    libm::powf(level, DCA_LEVEL_CURVE_EXPONENT).clamp(0.0, 1.0)
}

#[inline]
fn cz_dcw_env_depth(dcw_env: f32) -> f32 {
    let level = dcw_env.clamp(0.0, 1.0);
    libm::powf(level, DCW_LEVEL_CURVE_EXPONENT).clamp(0.0, 1.0)
}

fn line_frequency<T: LineFrequencySource>(base_freq: f32, line: &T, dco_env: f32) -> f32 {
    let dco_semitones = cz_dco_env_semitones(dco_env);
    let tuning_ratio =
        libm::exp2f(line.octave() + line.detune_note() / 12.0 + line.detune_fine() / 720.0);
    base_freq * tuning_ratio * libm::exp2f(dco_semitones / 12.0)
}

fn apply_pitch_and_lfo_modulation(
    voice: &mut Voice,
    p: &SynthParams,
    sr: f32,
    base_freq: f32,
    pitch_bend_ratio: f32,
    mod_values: &ModValueCache,
    signal: &mut SignalState,
) {
    apply_portamento(voice, &p.portamento, sr, base_freq, signal);
    apply_pitch_bend_ratio(pitch_bend_ratio, signal);
    apply_vibrato(voice, p, sr, mod_values, signal);
    // Pitch modulation from mod matrix (additive semitone offset via ratio)
    let pitch_mod = mod_values.get(ModDestination::Pitch);
    if pitch_mod != 0.0 {
        let ratio = libm::exp2f(pitch_mod * 2.0 / 12.0); // ±2 semitones max
        signal.effective_freq1 *= ratio;
        signal.effective_freq2 *= ratio;
    }
}

fn apply_portamento(
    voice: &mut Voice,
    port: &crate::params::PortamentoParams,
    sr: f32,
    base_freq: f32,
    signal: &mut SignalState,
) {
    if !port.enabled || (voice.target_freq - voice.current_freq).abs() <= 1e-6 {
        return;
    }

    match port.mode {
        PortamentoMode::Rate => {
            let t = (port.rate / 99.0).clamp(0.0, 1.0);
            let time_const = 3.0 * (1.0 - t) * (1.0 - t) + 0.001;
            let alpha = 1.0 - libm::expf(-1.0 / (time_const * sr));
            voice.current_freq += (voice.target_freq - voice.current_freq) * alpha;
        }
        PortamentoMode::Time => {
            voice.glide_progress += 1.0 / (port.time * sr);
            if voice.glide_progress >= 1.0 {
                voice.current_freq = voice.target_freq;
            } else {
                let t = voice.glide_progress;
                voice.current_freq =
                    voice.glide_start_freq + (voice.target_freq - voice.glide_start_freq) * t;
            }
        }
    }

    let ratio = voice.current_freq / base_freq;
    signal.effective_freq1 *= ratio;
    signal.effective_freq2 *= ratio;
}

fn apply_pitch_bend_ratio(pitch_bend_ratio: f32, signal: &mut SignalState) {
    if pitch_bend_ratio == 1.0 {
        return;
    }

    signal.effective_freq1 *= pitch_bend_ratio;
    signal.effective_freq2 *= pitch_bend_ratio;
}

fn apply_vibrato(
    voice: &mut Voice,
    p: &SynthParams,
    sr: f32,
    mod_values: &ModValueCache,
    signal: &mut SignalState,
) {
    let Some(vibrato) = p.vibrato_params() else {
        return;
    };
    if !vibrato.enabled {
        return;
    }

    if voice.vibrato_delay_counter > 0 {
        voice.vibrato_delay_counter -= 1;
        return;
    }

    let vibrato_rate_mod = mod_values.get(ModDestination::VibratoRate);
    let effective_rate = (vibrato.rate + vibrato_rate_mod * 99.0).clamp(0.1, 200.0);
    voice.vibrato_phase += (effective_rate * 0.1) / sr;
    if voice.vibrato_phase >= 1.0 {
        voice.vibrato_phase -= 1.0;
    }

    let vib_waveform = vibrato_waveform(vibrato.waveform);
    let lfo_val = lfo_output(voice.vibrato_phase, vib_waveform);
    let vibrato_depth_mod = mod_values.get(ModDestination::VibratoDepth);
    let effective_depth = (vibrato.depth + vibrato_depth_mod * 99.0).clamp(0.0, 99.0);
    let pitch_mod = 1.0 + lfo_val * (effective_depth / 1000.0);
    signal.effective_freq1 *= pitch_mod;
    signal.effective_freq2 *= pitch_mod;
}

fn vibrato_waveform(waveform: u8) -> LfoWaveform {
    match waveform {
        2 => LfoWaveform::Triangle,
        3 => LfoWaveform::Square,
        4 => LfoWaveform::Saw,
        _ => LfoWaveform::Sine,
    }
}

fn build_phase_frame(
    voice: &Voice,
    p: &SynthParams,
    sr: f32,
    base_freq: f32,
    mod_values: &ModValueCache,
) -> PhaseFrame {
    let int_pm_ratio_mod = mod_values.get(ModDestination::IntPmRatio);
    let (int_pm_enabled, int_pm_amount_raw, int_pm_ratio_raw, pm_pre) = p
        .phase_mod_params()
        .map(|pm| (pm.enabled, pm.amount, pm.ratio, pm.pm_pre))
        .unwrap_or((false, 0.0, 1.0, false));
    let int_pm_amount = if int_pm_enabled {
        (int_pm_amount_raw).clamp(-1.0, 1.0)
    } else {
        0.0
    };
    let effective_int_pm_ratio = (int_pm_ratio_raw + int_pm_ratio_mod * 7.5).clamp(0.5, 8.0);
    let pm_delta = (base_freq * effective_int_pm_ratio) / sr;
    let phi1 = wrap01(voice.phi1);
    let phi2 = wrap01(voice.phi2);
    let pm_phi = wrap01(voice.pm_phi);
    let pm_mod = int_pm_amount * 10.0 * sinf(TWO_PI * pm_phi);

    // pm_pre=true:  PM applied before warp shaping (phase_a_post = phi+pm_mod, pm_post_mod=0)
    // pm_pre=false: PM applied after warp shaping  (phase_a_post = phi,         pm_post_mod=pm_mod)
    let (phase_a_post, phase_b_post, pm_post_mod) = if pm_pre {
        (wrap01(phi1 + pm_mod), wrap01(phi2 + pm_mod), 0.0_f32)
    } else {
        (phi1, phi2, pm_mod)
    };

    PhaseFrame {
        phi1,
        phi2,
        pm_delta,
        phase_a_post,
        phase_b_post,
        pm_post_mod,
    }
}

fn line_render_config_from_runtime<'a>(
    line: &'a LineRuntimeParams<'a>,
    cycle_count: u32,
    window_phi: f32,
    phase: f32,
    final_dcw: f32,
    final_dca: f32,
    effective_freq: f32,
    sample_rate: f32,
    algo_param_mods: [f32; 8],
    pm_post_mod: f32,
) -> LineRenderConfig<'a> {
    let primary_algo =
        generators::cz101::resolve_algo(line.algo, line.algo_controls_a, cycle_count);
    let secondary_algo = line
        .algo2
        .map(|algo| generators::cz101::resolve_algo(algo, line.algo_controls_b, cycle_count));
    let primary_window_gain = crate::dsp_utils::apply_window(
        window_phi,
        generators::cz101::resolve_window(line.algo, line.algo_controls_a, line.window),
    );
    let secondary_window_gain = line
        .algo2
        .map(|algo| {
            crate::dsp_utils::apply_window(
                window_phi,
                generators::cz101::resolve_window(algo, line.algo_controls_b, line.window),
            )
        })
        .unwrap_or(primary_window_gain);

    LineRenderConfig {
        primary_algo,
        secondary_algo,
        blend: line.algo_blend,
        phase,
        primary_window_gain,
        secondary_window_gain,
        final_dcw,
        final_dca,
        primary_base_waveform: line.base_waveform_a,
        secondary_base_waveform: line.base_waveform_b,
        effective_freq,
        sample_rate,
        primary_algo_controls: line.algo_controls_a,
        secondary_algo_controls: line.algo_controls_b,
        algo_param_mods,
        pm_post_mod,
    }
}

fn mix_line_outputs(
    p: &SynthParams,
    phi1: f32,
    phi2: f32,
    s1: f32,
    s2: f32,
    l1: &LineRuntimeParams<'_>,
    l2: &LineRuntimeParams<'_>,
    cycle_count1: u32,
    cycle_count2: u32,
    ks_raw1: Option<f32>,
    ks_raw2: Option<f32>,
    final_dcw1: f32,
    final_dcw2: f32,
    final_dca1: f32,
    final_dca2: f32,
    line1_algo_param_mods: [f32; 8],
    line2_algo_param_mods: [f32; 8],
) -> f32 {
    let (mix_a, mix_b) = select_line_sources(
        p,
        phi1,
        phi2,
        s1,
        s2,
        l1,
        l2,
        cycle_count1,
        cycle_count2,
        ks_raw1,
        ks_raw2,
        final_dcw1,
        final_dcw2,
        final_dca1,
        final_dca2,
        line1_algo_param_mods,
        line2_algo_param_mods,
    );

    match p.mod_mode {
        ModMode::Ring => mix_a * mix_b * p.ring_gain.max(0.0),
        ModMode::Noise => {
            // Placeholder noise remains deterministic so renders stay repeatable.
            let noise = sinf(phi1 * 12_345.679) * 2.0 - 1.0;
            let mixed = match p.line_select {
                LineSelect::L1 => mix_a,
                LineSelect::L2 => mix_b,
                _ => (mix_a + mix_b) * DUAL_LINE_MIX_GAIN,
            };
            mixed + mixed * noise * 0.5
        }
        ModMode::Normal => match p.line_select {
            LineSelect::L1 => mix_a,
            LineSelect::L2 => mix_b,
            _ => (mix_a + mix_b) * DUAL_LINE_MIX_GAIN,
        },
    }
}

fn select_line_sources(
    p: &SynthParams,
    _phi1: f32,
    phi2: f32,
    s1: f32,
    s2: f32,
    l1: &LineRuntimeParams<'_>,
    l2: &LineRuntimeParams<'_>,
    cycle_count1: u32,
    cycle_count2: u32,
    ks_raw1: Option<f32>,
    ks_raw2: Option<f32>,
    final_dcw1: f32,
    final_dcw2: f32,
    final_dca1: f32,
    final_dca2: f32,
    line1_algo_param_mods: [f32; 8],
    line2_algo_param_mods: [f32; 8],
) -> (f32, f32) {
    match p.line_select {
        LineSelect::L1PlusL1Prime => {
            let cfg = line_render_config_from_runtime(
                l1,
                cycle_count1,
                phi2,
                phi2,
                final_dcw1,
                final_dca1,
                0.0,
                1.0,
                line1_algo_param_mods,
                0.0,
            );
            let s1_prime = render_prime_line_sample(cfg, ks_raw1);
            (s1, s1_prime)
        }
        LineSelect::L1PlusL2Prime => {
            let cfg = line_render_config_from_runtime(
                l2,
                cycle_count2,
                phi2,
                phi2,
                final_dcw2,
                final_dca2,
                0.0,
                1.0,
                line2_algo_param_mods,
                0.0,
            );
            let s2_prime = render_prime_line_sample(cfg, ks_raw2);
            (s1, s2_prime)
        }
        _ => (s1, s2),
    }
}

fn render_prime_line_sample(cfg: LineRenderConfig<'_>, ks_raw: Option<f32>) -> f32 {
    let sample = if let Some(secondary_algo) = cfg.secondary_algo {
        let secondary_dcw = cfg.final_dcw * cfg.blend;
        let primary_dcw = cfg.final_dcw * (1.0 - cfg.blend);
        let primary = generators::render_algo_sample(
            cfg.primary_algo,
            cfg.phase,
            primary_dcw,
            cfg.primary_base_waveform,
            cfg.primary_algo_controls,
            cfg.algo_param_mods,
            ks_raw,
            cfg.pm_post_mod,
        ) * cfg.primary_window_gain;
        let secondary = generators::render_algo_sample(
            secondary_algo,
            cfg.phase,
            secondary_dcw,
            cfg.secondary_base_waveform,
            cfg.secondary_algo_controls,
            cfg.algo_param_mods,
            ks_raw,
            cfg.pm_post_mod,
        ) * cfg.secondary_window_gain;
        generators::blend_line_samples(cfg.primary_algo, primary, secondary, cfg.blend)
    } else {
        generators::render_algo_sample(
            cfg.primary_algo,
            cfg.phase,
            cfg.final_dcw,
            cfg.primary_base_waveform,
            cfg.primary_algo_controls,
            cfg.algo_param_mods,
            ks_raw,
            cfg.pm_post_mod,
        ) * cfg.primary_window_gain
    };

    sample * cfg.final_dca * generators::PER_LINE_HEADROOM
}

fn advance_voice_phase(
    voice: &mut Voice,
    sr: f32,
    effective_freq1: f32,
    effective_freq2: f32,
    pm_delta: f32,
) {
    voice.phi1 += effective_freq1 / sr;
    voice.phi2 += effective_freq2 / sr;
    voice.pm_phi += pm_delta;
    wrap_voice_phase(&mut voice.phi1, &mut voice.cycle_count1);
    wrap_voice_phase(&mut voice.phi2, &mut voice.cycle_count2);
    if voice.pm_phi >= 1.0 {
        voice.pm_phi -= 1.0;
    }
}

fn wrap_voice_phase(phase: &mut f32, cycle_count: &mut u32) {
    while *phase >= 1.0 {
        *phase -= 1.0;
        *cycle_count = cycle_count.wrapping_add(1);
    }
}

#[cfg(test)]
mod tests {
    use super::{
        build_mod_value_cache, cz_dca_env_gain, cz_dco_env_semitones, cz_dcw_env_depth,
        line_frequency, render_voice, should_finalize_release, EnvelopeSnapshot, ModSources, Voice,
    };
    use crate::params::{ModDestination, ModMatrix, ModRoute, ModSource, SynthParams};

    #[test]
    fn dca_gain_uses_gentle_power_taper() {
        assert_eq!(cz_dca_env_gain(0.0), 0.0);
        assert_eq!(cz_dca_env_gain(1.0), 1.0);
        assert!(cz_dca_env_gain(0.5) > 0.5);
        assert!(cz_dca_env_gain(0.75) > 0.75);
    }

    #[test]
    fn dcw_depth_uses_gentle_power_taper() {
        assert_eq!(cz_dcw_env_depth(0.0), 0.0);
        assert_eq!(cz_dcw_env_depth(1.0), 1.0);
        assert!(cz_dcw_env_depth(0.5) > 0.5);
        assert!(cz_dcw_env_depth(0.75) > 0.75);
    }

    #[test]
    fn release_finishes_when_both_dca_envelopes_end() {
        let env = EnvelopeSnapshot {
            dco1_env: 0.5,
            dco2_env: 0.5,
            dca1: 0.0,
            dca2: 0.0,
            dcw1: 0.5,
            dcw2: 0.5,
        };

        assert!(should_finalize_release(&env));

        let env = EnvelopeSnapshot { dca2: 0.1, ..env };

        assert!(!should_finalize_release(&env));
    }

    #[test]
    fn dco_env_matches_cz_reference_semitone_points() {
        let cases = [
            (8_u8, 1.0_f32),
            (16_u8, 2.0_f32),
            (24_u8, 3.0_f32),
            (32_u8, 4.0_f32),
            (40_u8, 5.0_f32),
            (48_u8, 6.0_f32),
            (56_u8, 7.0_f32),
            (64_u8, 8.0_f32),
            (65_u8, 10.0_f32),
            (66_u8, 12.0_f32),
            (72_u8, 24.0_f32),
        ];

        for (level, expected_semitones) in cases {
            let normalized_level = level as f32 / 99.0;
            let got = cz_dco_env_semitones(normalized_level);
            assert!(
                (got - expected_semitones).abs() <= 0.02,
                "level {level}: expected {expected_semitones} st, got {got} st"
            );
        }
    }

    #[test]
    fn dco_env_level_66_is_one_octave_up() {
        let base_freq = 220.0_f32;
        let line = crate::params::LineParams::default();
        let level_66 = 66.0_f32 / 99.0;
        let got = line_frequency(base_freq, &line, level_66);
        let expected = base_freq * 2.0;
        assert!(
            (got - expected).abs() <= expected * 0.02,
            "expected about {expected} Hz at level 66, got {got} Hz"
        );
    }

    fn all_sources() -> [ModSource; 7] {
        [
            ModSource::Lfo1,
            ModSource::Lfo2,
            ModSource::Random,
            ModSource::ModEnv,
            ModSource::Velocity,
            ModSource::ModWheel,
            ModSource::Aftertouch,
        ]
    }

    fn all_destinations() -> [ModDestination; 51] {
        [
            ModDestination::Volume,
            ModDestination::Pitch,
            ModDestination::Line1DcwBase,
            ModDestination::Line1DcaBase,
            ModDestination::Line1AlgoBlend,
            ModDestination::Line2DetuneNote,
            ModDestination::Line1Octave,
            ModDestination::Line1AlgoParam1,
            ModDestination::Line1AlgoParam2,
            ModDestination::Line1AlgoParam3,
            ModDestination::Line1AlgoParam4,
            ModDestination::Line1AlgoParam5,
            ModDestination::Line1AlgoParam6,
            ModDestination::Line1AlgoParam7,
            ModDestination::Line1AlgoParam8,
            ModDestination::Line2DcwBase,
            ModDestination::Line2DcaBase,
            ModDestination::Line2AlgoBlend,
            ModDestination::Line2DetuneFine,
            ModDestination::Line2DetuneOctave,
            ModDestination::Line2AlgoParam1,
            ModDestination::Line2AlgoParam2,
            ModDestination::Line2AlgoParam3,
            ModDestination::Line2AlgoParam4,
            ModDestination::Line2AlgoParam5,
            ModDestination::Line2AlgoParam6,
            ModDestination::Line2AlgoParam7,
            ModDestination::Line2AlgoParam8,
            ModDestination::VibratoDepth,
            ModDestination::VibratoRate,
            ModDestination::IntPmRatio,
            ModDestination::Line1DcoEnvStep1Level,
            ModDestination::Line1DcoEnvStep1Rate,
            ModDestination::Line1DcwEnvStep3Level,
            ModDestination::Line1DcaEnvStep4Rate,
            ModDestination::Line2DcoEnvStep2Level,
            ModDestination::Line2DcwEnvStep6Rate,
            ModDestination::Line2DcaEnvStep8Level,
            ModDestination::PhaserRate,
            ModDestination::PhaserDepth,
            ModDestination::PhaserFeedback,
            ModDestination::PhaserMix,
            ModDestination::Lfo1Rate,
            ModDestination::Lfo1Depth,
            ModDestination::Lfo1Symmetry,
            ModDestination::Lfo1Offset,
            ModDestination::Lfo2Rate,
            ModDestination::Lfo2Depth,
            ModDestination::Lfo2Symmetry,
            ModDestination::Lfo2Offset,
            ModDestination::RandomRate,
        ]
    }

    fn source_value(sources: &ModSources, source: ModSource) -> f32 {
        match source {
            ModSource::Lfo1 => sources.lfo1,
            ModSource::Lfo2 => sources.lfo2,
            ModSource::Velocity => sources.velocity,
            ModSource::ModWheel => sources.mod_wheel,
            ModSource::Aftertouch => sources.aftertouch,
            ModSource::ModEnv => sources.mod_env,
            ModSource::Random => sources.random,
        }
    }

    #[test]
    fn every_source_can_drive_every_destination() {
        let sources = ModSources {
            lfo1: 0.25,
            lfo2: -0.4,
            velocity: 0.8,
            mod_wheel: 0.6,
            aftertouch: 0.3,
            mod_env: 0.5,
            random: -0.2,
        };

        let amount = 0.5;

        for destination in all_destinations() {
            for source in all_sources() {
                let matrix = ModMatrix {
                    routes: vec![ModRoute {
                        source,
                        destination,
                        amount,
                        enabled: true,
                    }],
                };

                let mod_values = build_mod_value_cache(&matrix, &sources);
                let got = mod_values.get(destination);
                let expected = (amount * source_value(&sources, source)).clamp(-1.0, 1.0);
                assert!(
                    (got - expected).abs() < 1e-6,
                    "unexpected route value for source={:?} destination={:?}: got {}, expected {}",
                    source,
                    destination,
                    got,
                    expected
                );
            }
        }
    }

    #[test]
    fn disabled_routes_do_not_contribute() {
        let sources = ModSources {
            lfo1: 0.9,
            lfo2: 0.0,
            velocity: 0.0,
            mod_wheel: 0.0,
            aftertouch: 0.0,
            mod_env: 0.0,
            random: 0.0,
        };
        let destination = ModDestination::Volume;
        let matrix = ModMatrix {
            routes: vec![ModRoute {
                source: ModSource::Lfo1,
                destination,
                amount: 1.0,
                enabled: false,
            }],
        };

        let mod_values = build_mod_value_cache(&matrix, &sources);
        let got = mod_values.get(destination);
        assert_eq!(got, 0.0);
    }

    #[test]
    fn route_sum_is_clamped_to_unit_range() {
        let sources = ModSources {
            lfo1: 1.0,
            lfo2: 1.0,
            velocity: 0.0,
            mod_wheel: 0.0,
            aftertouch: 0.0,
            mod_env: 0.0,
            random: 0.0,
        };
        let destination = ModDestination::Pitch;
        let matrix = ModMatrix {
            routes: vec![
                ModRoute {
                    source: ModSource::Lfo1,
                    destination,
                    amount: 0.9,
                    enabled: true,
                },
                ModRoute {
                    source: ModSource::Lfo2,
                    destination,
                    amount: 0.9,
                    enabled: true,
                },
            ],
        };

        let mod_values = build_mod_value_cache(&matrix, &sources);
        let got = mod_values.get(destination);
        assert_eq!(got, 1.0);
    }

    #[test]
    fn line_algo_blend_destination_modulates_effective_blend() {
        let line = crate::params::LineParams {
            algo_blend: 0.25,
            ..crate::params::LineParams::default()
        };
        let matrix = ModMatrix {
            routes: vec![ModRoute {
                source: ModSource::Lfo1,
                destination: ModDestination::Line1AlgoBlend,
                amount: 0.5,
                enabled: true,
            }],
        };
        let sources = ModSources {
            lfo1: 1.0,
            lfo2: 0.0,
            velocity: 0.0,
            mod_wheel: 0.0,
            aftertouch: 0.0,
            mod_env: 0.0,
            random: 0.0,
        };

        let mod_values = super::build_mod_value_cache(&matrix, &sources);
        let mod_state = super::line_modulation_state(&matrix);
        let modded = super::modulated_line_params(&line, 1, &mod_values, mod_state.line1);
        assert!((modded.algo_blend - 0.75).abs() < 1e-6);
    }

    #[test]
    fn env_step_level_rate_destinations_modulate_step_data() {
        let mut line = crate::params::LineParams::default();
        line.dco_env.steps[0].level = 20;
        line.dco_env.steps[0].rate = 30;

        let matrix = ModMatrix {
            routes: vec![
                ModRoute {
                    source: ModSource::Lfo1,
                    destination: ModDestination::Line1DcoEnvStep1Level,
                    amount: 0.5,
                    enabled: true,
                },
                ModRoute {
                    source: ModSource::Lfo1,
                    destination: ModDestination::Line1DcoEnvStep1Rate,
                    amount: 0.25,
                    enabled: true,
                },
            ],
        };
        let sources = ModSources {
            lfo1: 1.0,
            lfo2: 0.0,
            velocity: 0.0,
            mod_wheel: 0.0,
            aftertouch: 0.0,
            mod_env: 0.0,
            random: 0.0,
        };

        let mod_values = super::build_mod_value_cache(&matrix, &sources);
        let mod_state = super::line_modulation_state(&matrix);
        let modded = super::modulated_line_params(&line, 1, &mod_values, mod_state.line1);
        assert_eq!(modded.dco_env.steps[0].level, 84);
        assert_eq!(modded.dco_env.steps[0].rate, 62);
    }

    #[test]
    fn env_step_modulation_affects_rendered_audio_output() {
        let mut base_params = SynthParams::default();
        base_params.mod_matrix = ModMatrix::default();
        let timing = crate::envelope::EnvelopeTimingCache::new(48_000.0);

        let mut modded_params = base_params.clone();
        modded_params.mod_matrix = ModMatrix {
            routes: vec![ModRoute {
                source: ModSource::ModWheel,
                destination: ModDestination::Line1DcaEnvStep1Level,
                amount: -1.0,
                enabled: true,
            }],
        };

        let mut base_voice = Voice::new();
        base_voice.is_silent = false;
        base_voice.note = Some(60);
        base_voice.env_note = 60;
        base_voice.frequency = 440.0;
        base_voice.current_freq = 440.0;
        base_voice.target_freq = 440.0;
        base_voice.velocity = 1.0;

        let mut modded_voice = base_voice.clone();

        let mut base_energy = 0.0_f32;
        let mut modded_energy = 0.0_f32;
        for _ in 0..256 {
            base_energy += render_voice(
                &mut base_voice,
                &base_params,
                0.0,
                0.0,
                0.0,
                48_000.0,
                &timing,
                1.0,
                1.0,
                0.0,
                super::LineModulationState::default(),
                1.0,
                1.0,
            )
            .abs();
            modded_energy += render_voice(
                &mut modded_voice,
                &modded_params,
                0.0,
                0.0,
                0.0,
                48_000.0,
                &timing,
                1.0,
                1.0,
                0.0,
                super::line_modulation_state(&modded_params.mod_matrix),
                1.0,
                1.0,
            )
            .abs();
        }

        let base_safe = base_energy.max(1.0e-6);
        let relative_delta = (modded_energy - base_energy).abs() / base_safe;
        assert!(
            relative_delta > 0.05,
            "expected env-step modulation to measurably change rendered energy (base={}, modded={}, relative_delta={})",
            base_energy,
            modded_energy,
            relative_delta
        );
    }
}
