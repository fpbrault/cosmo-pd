//! Top-level Cosmo PD-101 synthesizer engine.

extern crate alloc;

mod notes;
mod process;
pub mod state;
pub mod utils;

pub use utils::midi_note_to_freq;

use alloc::sync::Arc;
use arrayvec::ArrayVec;
use core::array;

use crate::dsp_utils::random_hold_value;
use crate::envelope::{normalize_synth_params_envelopes_to_raw_if_human, EnvelopeTimingCache};
use crate::fx::FxChain;
use crate::module_presets;
use crate::params::{FxSlotConfig, FxSlotType, SynthParams, NUM_VOICES};
use crate::simd::{detect_simd_backend, SimdBackend};
use crate::voice::Voice;

use self::state::CzDacColor;
pub use self::state::{
    MonoStackEntry, NoteEntry, RuntimeModSources, RuntimeVoiceDebugState, RuntimeVoiceEnvState,
    RuntimeVoiceLineState,
};

/// The main synthesizer processor, managing voices, FX, modulation sources,
/// and the sample-by-sample audio process loop.
pub struct CosmoProcessor {
    pub voices: [Voice; NUM_VOICES],
    pub fx: FxChain,
    pub(crate) cz_dac_color: CzDacColor,
    pub active_notes: ArrayVec<NoteEntry, NUM_VOICES>,
    pub mono_stack: ArrayVec<MonoStackEntry, NUM_VOICES>,
    pub sustain_on: bool,
    pub lfo_phase: f32,
    pub lfo2_phase: f32,
    pub random_phase: f32,
    pub random_step: i32,
    pub random_hold: f32,
    pub params: Arc<SynthParams>,
    pub sample_rate: f32,
    pub pitch_bend: f32,
    pub mod_wheel: f32,
    pub aftertouch: f32,
    pub last_runtime_mod_sources: RuntimeModSources,
    pub simd_backend: SimdBackend,
    #[allow(dead_code)]
    fx_eco_toggle: bool,
    #[allow(dead_code)]
    fx_last_out: f32,
    envelope_timing: EnvelopeTimingCache,
}

impl CosmoProcessor {
    /// Create a new processor with default parameters and FX state.
    pub fn new(sample_rate: f32) -> Self {
        let mut proc = Self {
            voices: array::from_fn(|_| Voice::new()),
            fx: FxChain::new(sample_rate),
            cz_dac_color: CzDacColor::new(),
            active_notes: ArrayVec::new(),
            mono_stack: ArrayVec::new(),
            sustain_on: false,
            lfo_phase: 0.0,
            lfo2_phase: 0.0,
            random_phase: 0.0,
            random_step: 0,
            random_hold: random_hold_value(0),
            params: Arc::new(SynthParams::default()),
            sample_rate,
            pitch_bend: 0.0,
            mod_wheel: 0.0,
            aftertouch: 0.0,
            last_runtime_mod_sources: RuntimeModSources::default(),
            simd_backend: detect_simd_backend(),
            fx_eco_toggle: false,
            fx_last_out: 0.0,
            envelope_timing: EnvelopeTimingCache::new(sample_rate),
        };
        proc.update_fx();
        proc
    }

    pub fn runtime_mod_sources(&self) -> RuntimeModSources {
        self.last_runtime_mod_sources
    }

    pub fn runtime_voice_debug_state(&self) -> Vec<RuntimeVoiceDebugState> {
        self.voices
            .iter()
            .enumerate()
            .map(|(index, voice)| RuntimeVoiceDebugState {
                index,
                active: !voice.is_silent,
                is_releasing: voice.is_releasing,
                sustained: voice.sustained,
                note: voice.note,
                env_note: voice.env_note,
                velocity: voice.velocity,
                frequency: voice.frequency,
                current_freq: voice.current_freq,
                target_freq: voice.target_freq,
                phase1: voice.phi1,
                phase2: voice.phi2,
                anti_click_fade: voice.anti_click_fade,
                anti_click_attack: voice.anti_click_attack,
                release_tail_level: voice.release_tail_level,
                line1: RuntimeVoiceLineState {
                    dco: RuntimeVoiceEnvState {
                        value: voice.line1_env.dco.output,
                        step: voice.line1_env.dco.step,
                        releasing: voice.line1_env.dco.releasing,
                        step_pos: voice.line1_env.dco.step_pos,
                        prev_level: voice.line1_env.dco.prev_level,
                    },
                    dcw: RuntimeVoiceEnvState {
                        value: voice.line1_env.dcw.output,
                        step: voice.line1_env.dcw.step,
                        releasing: voice.line1_env.dcw.releasing,
                        step_pos: voice.line1_env.dcw.step_pos,
                        prev_level: voice.line1_env.dcw.prev_level,
                    },
                    dca: RuntimeVoiceEnvState {
                        value: voice.line1_env.dca.output,
                        step: voice.line1_env.dca.step,
                        releasing: voice.line1_env.dca.releasing,
                        step_pos: voice.line1_env.dca.step_pos,
                        prev_level: voice.line1_env.dca.prev_level,
                    },
                },
                line2: RuntimeVoiceLineState {
                    dco: RuntimeVoiceEnvState {
                        value: voice.line2_env.dco.output,
                        step: voice.line2_env.dco.step,
                        releasing: voice.line2_env.dco.releasing,
                        step_pos: voice.line2_env.dco.step_pos,
                        prev_level: voice.line2_env.dco.prev_level,
                    },
                    dcw: RuntimeVoiceEnvState {
                        value: voice.line2_env.dcw.output,
                        step: voice.line2_env.dcw.step,
                        releasing: voice.line2_env.dcw.releasing,
                        step_pos: voice.line2_env.dcw.step_pos,
                        prev_level: voice.line2_env.dcw.prev_level,
                    },
                    dca: RuntimeVoiceEnvState {
                        value: voice.line2_env.dca.output,
                        step: voice.line2_env.dca.step,
                        releasing: voice.line2_env.dca.releasing,
                        step_pos: voice.line2_env.dca.step_pos,
                        prev_level: voice.line2_env.dca.prev_level,
                    },
                },
            })
            .collect()
    }

    /// Copy FX-relevant fields from `self.params` into the `FxChain`.
    pub fn update_fx(&mut self) {
        self.fx.sync_from_params(self.params.as_ref());
    }

    /// Copy a `SynthParams` snapshot into the processor.
    pub fn set_params(&mut self, mut params: SynthParams) {
        normalize_synth_params_envelopes_to_raw_if_human(&mut params);
        self.set_shared_params(Arc::new(params));
    }

    /// Clone parameter values into the processor for non-real-time callers.
    pub fn set_params_from_ref(&mut self, params: &SynthParams) {
        self.set_params(params.clone());
    }

    /// Swap in a pre-normalized shared parameter snapshot without cloning.
    pub fn set_shared_params(&mut self, params: Arc<SynthParams>) {
        self.params = params;
        self.update_fx();
    }

    /// Mutable parameter access for non-real-time mutation paths and tests.
    pub fn params_mut(&mut self) -> &mut SynthParams {
        Arc::make_mut(&mut self.params)
    }

    fn debug_assert_note_storage_bounds(&self) {
        debug_assert!(self.active_notes.len() <= NUM_VOICES);
        debug_assert!(self.mono_stack.len() <= NUM_VOICES);
        debug_assert_eq!(self.active_notes.capacity(), NUM_VOICES);
        debug_assert_eq!(self.mono_stack.capacity(), NUM_VOICES);
    }

    /// Hard reset runtime voice/FX state while keeping current parameters.
    pub fn reset_audio_state(&mut self) {
        self.voices = array::from_fn(|_| Voice::new());
        self.fx = FxChain::new(self.sample_rate);
        self.cz_dac_color.reset();
        self.update_fx();
        self.active_notes.clear();
        self.mono_stack.clear();
        self.sustain_on = false;
        self.lfo_phase = 0.0;
        self.lfo2_phase = 0.0;
        self.random_phase = 0.0;
        self.random_step = 0;
        self.random_hold = random_hold_value(0);
        self.pitch_bend = 0.0;
        self.mod_wheel = 0.0;
        self.aftertouch = 0.0;
        self.last_runtime_mod_sources = RuntimeModSources::default();
        self.simd_backend = detect_simd_backend();
        self.envelope_timing = EnvelopeTimingCache::new(self.sample_rate);
    }

    /// Set which effect type occupies a given FX slot (0–5).
    pub fn set_fx_slot_type(&mut self, slot: usize, slot_type: FxSlotType) {
        if slot < 6 {
            self.params_mut().fx_slots[slot] = FxSlotConfig::default_for_type(slot_type);
            self.update_fx();
        }
    }

    /// Return the current FX slot type layout.
    pub fn get_fx_slot_types(&self) -> [FxSlotType; 6] {
        core::array::from_fn(|i| self.params.fx_slots[i].slot_type())
    }

    /// Apply a named module preset to the current parameters.
    pub fn apply_module_preset(&mut self, module: &str, preset: &str) -> bool {
        let applied = module_presets::apply_module_preset(self.params_mut(), module, preset);
        if applied {
            self.update_fx();
        }
        applied
    }

    /// Set pitch bend. `value` is normalised [-1.0, 1.0].
    pub fn set_pitch_bend(&mut self, value: f32) {
        self.pitch_bend = value.clamp(-1.0, 1.0);
    }

    /// Set mod wheel. `value` is normalised [0.0, 1.0].
    pub fn set_mod_wheel(&mut self, value: f32) {
        self.mod_wheel = value.clamp(0.0, 1.0);
    }

    /// Set aftertouch/channel pressure. `value` is normalised [0.0, 1.0].
    pub fn set_aftertouch(&mut self, value: f32) {
        self.aftertouch = value.clamp(0.0, 1.0);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::envelope_map::{human_level_to_raw, human_rate_to_raw, EnvelopeKind};
    use crate::params::{
        EnvStep, LineSelect, ModDestination, ModRoute, ModSource, PolyMode, StepEnvData,
    };

    fn active_voice_indices_for_note(proc: &CosmoProcessor, note: u8) -> Vec<usize> {
        proc.voices
            .iter()
            .enumerate()
            .filter_map(|(idx, voice)| {
                (voice.note == Some(note) && !voice.is_releasing && !voice.is_silent).then_some(idx)
            })
            .collect()
    }

    #[test]
    fn releasing_sustain_does_not_latch_old_voice_on_same_note_retrigger() {
        let mut proc = CosmoProcessor::new(48_000.0);
        let note = 60_u8;
        let freq = utils::midi_note_to_freq(note);

        proc.note_on(note, freq, 1.0);
        proc.set_sustain(true);
        proc.note_off(note);

        proc.note_on(note, freq, 1.0);

        proc.set_sustain(false);

        let active_voice_indices = active_voice_indices_for_note(&proc, note);
        assert_eq!(
            active_voice_indices.len(),
            1,
            "expected only the latest retriggered voice to remain active",
        );

        proc.note_off(note);
        let mut scratch = [0.0_f32; 128];
        for _ in 0..400 {
            proc.process(&mut scratch);
        }

        let lingering = active_voice_indices_for_note(&proc, note);
        assert!(
            lingering.is_empty(),
            "note should fully release after note-off and enough process cycles",
        );
    }

    #[test]
    fn lfo_rate_destination_changes_runtime_lfo_phase_advance() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.set_mod_wheel(1.0);
        proc.params_mut().mod_matrix.routes = vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::Lfo1Rate,
            amount: 1.0,
            enabled: true,
        }];

        let base_rate = proc.params.lfo.rate;
        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        let expected_without_mod = base_rate / proc.sample_rate;
        assert!(proc.lfo_phase > expected_without_mod);
    }

    #[test]
    fn fx_destination_route_does_not_break_processing() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.set_mod_wheel(1.0);
        proc.params_mut().mod_matrix.routes = vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::ChorusRate,
            amount: 1.0,
            enabled: true,
        }];
        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        assert!(out[0].is_finite());
    }

    #[test]
    fn mono_releasing_previous_note_is_not_restored_after_new_note_off() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.params_mut().poly_mode = PolyMode::Mono;

        let note_a = 60_u8;
        let note_b = 64_u8;
        let freq_a = utils::midi_note_to_freq(note_a);
        let freq_b = utils::midi_note_to_freq(note_b);

        proc.note_on(note_a, freq_a, 1.0);
        proc.note_off(note_a);
        assert!(proc.voices[0].is_releasing);

        proc.note_on(note_b, freq_b, 1.0);
        let active_b = active_voice_indices_for_note(&proc, note_b);
        assert_eq!(active_b.len(), 1, "expected one active voice for note B");
        let b_idx = active_b[0];
        assert!(!proc.voices[b_idx].is_releasing);

        proc.note_off(note_b);
        assert!(proc.voices[b_idx].is_releasing);

        let active_a = active_voice_indices_for_note(&proc, note_a);
        assert!(
            active_a.is_empty(),
            "old note A should not be restored as an active note after releasing B"
        );
    }

    #[test]
    fn random_rate_destination_changes_random_phase_advance() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.set_mod_wheel(1.0);
        proc.params_mut().mod_matrix.routes = vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::RandomRate,
            amount: 1.0,
            enabled: true,
        }];

        let base_rate = proc.params.random.rate;
        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        let expected_without_mod = base_rate / proc.sample_rate;
        assert!(proc.random_phase > expected_without_mod);
    }

    #[test]
    fn one_shot_envelope_voice_auto_releases_without_note_off() {
        fn dca_step(level: u8, rate: u8) -> EnvStep {
            EnvStep {
                level: human_level_to_raw(EnvelopeKind::Dca, level),
                rate: human_rate_to_raw(EnvelopeKind::Dca, rate),
                level_norm: level as f32 / 99.0,
            }
        }

        let mut proc = CosmoProcessor::new(48_000.0);
        proc.params_mut().line_select = LineSelect::L1;
        proc.params_mut().line1.dca_env = StepEnvData {
            steps: [
                dca_step(99, 99),
                dca_step(0, 99),
                dca_step(0, 99),
                dca_step(0, 99),
                dca_step(0, 99),
                dca_step(0, 99),
                dca_step(0, 99),
                dca_step(0, 99),
            ],
            sustain_step: 1,
            step_count: 2,
            loop_: false,
        };

        let note = 60_u8;
        let freq = utils::midi_note_to_freq(note);
        proc.note_on(note, freq, 1.0);

        let mut scratch = [0.0_f32; 128];
        for _ in 0..128 {
            proc.process(&mut scratch);
        }

        let still_active = proc.voices.iter().any(|voice| !voice.is_silent);
        assert!(
            !still_active,
            "one-shot voice should auto-release at envelope end"
        );
    }

    #[test]
    fn note_storage_remains_bounded_after_repeated_retriggers() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.params_mut().poly_mode = PolyMode::Mono;

        for step in 0..256 {
            let note = 60_u8 + (step % 8) as u8;
            let freq = utils::midi_note_to_freq(note);
            proc.note_on(note, freq, 1.0);
            if step % 2 == 0 {
                proc.note_off(note);
            }
        }

        assert!(proc.active_notes.len() <= NUM_VOICES);
        assert!(proc.mono_stack.len() <= NUM_VOICES);
        assert!(proc.active_notes.capacity() >= NUM_VOICES);
        assert!(proc.mono_stack.capacity() >= NUM_VOICES);
    }

    #[test]
    fn cz_dac_color_output_is_finite_and_bounded() {
        let mut color = CzDacColor::new();
        for n in 0..4096 {
            let input = (n as f32 * 0.013).sin() * 1.25;
            let out = color.process(input, 48_000.0);
            assert!(out.is_finite(), "colored sample should be finite");
            assert!(
                (out).abs() <= 1.2,
                "colored sample should stay within stage bounds",
            );
        }
    }

    #[test]
    fn cz_dac_color_transient_differs_from_steady_state() {
        let mut steady = CzDacColor::new();
        let mut transient = CzDacColor::new();

        for _ in 0..1024 {
            let _ = steady.process(0.12, 48_000.0);
            let _ = transient.process(0.12, 48_000.0);
        }

        let steady_out = steady.process(0.12, 48_000.0);
        let transient_out = transient.process(0.78, 48_000.0);
        let delta = (transient_out - steady_out).abs();

        assert!(
            delta > 0.1,
            "expected transient mistracking color to alter output (delta={})",
            delta,
        );
    }
}
