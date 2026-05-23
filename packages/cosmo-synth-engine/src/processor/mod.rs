//! Top-level Cosmo PD-101 synthesizer engine.

extern crate alloc;

mod cz_dac;
mod notes;
mod process;
pub mod state;
pub mod utils;

pub use utils::midi_note_to_freq;

use alloc::sync::Arc;
use arrayvec::ArrayVec;
use core::array;

use crate::dsp_utils::random_hold_value;
use crate::envelope::{EnvelopeTimingCache, normalize_synth_params_envelopes_to_raw_if_human};
use crate::fx::FxChain;
use crate::module_presets;
use crate::params::{FxSlotConfig, FxSlotType, LineParams, NUM_VOICES, SynthParams};
use crate::render_cache::CompiledSynthParams;
use crate::simd::{SimdBackend, detect_simd_backend};
use crate::voice::Voice;

use self::cz_dac::CzDacColor;
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
    pub macro1: f32,
    pub macro2: f32,
    pub macro3: f32,
    pub macro4: f32,
    pub last_runtime_mod_sources: RuntimeModSources,
    pub simd_backend: SimdBackend,
    host_transport_tempo_bpm: Option<f32>,
    host_transport_playing: bool,
    host_transport_position_beats: f64,
    compiled_params: CompiledSynthParams,
    compiled_params_dirty: bool,
    line1_scratch: LineParams,
    line2_scratch: LineParams,
    envelope_timing: EnvelopeTimingCache,
}

impl CosmoProcessor {
    /// Create a new processor with default parameters and FX state.
    pub fn new(sample_rate: f32) -> Self {
        let params = Arc::new(SynthParams::default());
        let compiled_params = CompiledSynthParams::from_params(params.as_ref());
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
            params,
            sample_rate,
            pitch_bend: 0.0,
            mod_wheel: 0.0,
            aftertouch: 0.0,
            macro1: 0.0,
            macro2: 0.0,
            macro3: 0.0,
            macro4: 0.0,
            last_runtime_mod_sources: RuntimeModSources::default(),
            simd_backend: detect_simd_backend(),
            host_transport_tempo_bpm: None,
            host_transport_playing: false,
            host_transport_position_beats: 0.0,
            compiled_params,
            compiled_params_dirty: false,
            line1_scratch: LineParams::default(),
            line2_scratch: LineParams::default(),
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

    pub(crate) fn rebuild_compiled_params(&mut self) {
        self.compiled_params = CompiledSynthParams::from_params(self.params.as_ref());
        self.compiled_params_dirty = false;
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
        self.macro1 = params.macro1;
        self.macro2 = params.macro2;
        self.macro3 = params.macro3;
        self.macro4 = params.macro4;
        self.line1_scratch = params.line1;
        self.line2_scratch = params.line2;
        self.params = params;
        self.rebuild_compiled_params();
        self.update_fx();
    }

    /// Mutable parameter access for non-real-time mutation paths and tests.
    pub fn params_mut(&mut self) -> &mut SynthParams {
        self.compiled_params_dirty = true;
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
        self.macro1 = 0.0;
        self.macro2 = 0.0;
        self.macro3 = 0.0;
        self.macro4 = 0.0;
        self.last_runtime_mod_sources = RuntimeModSources::default();
        self.simd_backend = detect_simd_backend();
        self.host_transport_tempo_bpm = None;
        self.host_transport_playing = false;
        self.host_transport_position_beats = 0.0;
        self.line1_scratch = self.params.line1;
        self.line2_scratch = self.params.line2;
        self.envelope_timing = EnvelopeTimingCache::new(self.sample_rate);
        self.rebuild_compiled_params();
    }

    /// Set which effect type occupies a given FX slot (0–5).
    pub fn set_fx_slot_type(&mut self, slot: usize, slot_type: FxSlotType) {
        if slot < 6 {
            self.params_mut().fx_slots[slot] = FxSlotConfig::default_for_type(slot_type);
            self.update_fx();
            self.rebuild_compiled_params();
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
            self.rebuild_compiled_params();
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
        for voice in &mut self.voices {
            if voice.note.is_some() {
                voice.aftertouch = self.aftertouch;
            }
        }
    }

    /// Set polyphonic aftertouch for a specific MIDI note.
    /// `value` is normalised [0.0, 1.0].
    /// Also updates global aftertouch so the per-block mod matrix cache reflects the value.
    pub fn set_poly_aftertouch(&mut self, note: u8, value: f32) {
        let clamped = value.clamp(0.0, 1.0);
        for voice in &mut self.voices {
            if voice.note == Some(note) {
                voice.aftertouch = clamped;
            }
        }
        self.aftertouch = clamped;
    }

    /// Apply host transport timing for BPM-synced modulation.
    pub fn set_host_transport(&mut self, tempo_bpm: f32, playing: bool, position_beats: f64) {
        self.host_transport_tempo_bpm = tempo_bpm.is_finite().then_some(tempo_bpm.max(0.0));
        self.host_transport_playing = playing;
        if position_beats.is_finite() {
            self.host_transport_position_beats = position_beats;
        }
    }

    /// Clear any active host transport override and fall back to manual tempo.
    pub fn clear_host_transport(&mut self) {
        self.host_transport_tempo_bpm = None;
        self.host_transport_playing = false;
    }

    /// Set a macro knob value. `value` is normalised [0.0, 1.0].
    pub fn set_macro(&mut self, index: usize, value: f32) {
        let clamped = value.clamp(0.0, 1.0);
        match index {
            0 => self.macro1 = clamped,
            1 => self.macro2 = clamped,
            2 => self.macro3 = clamped,
            3 => self.macro4 = clamped,
            _ => {}
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::envelope_map::{EnvelopeKind, human_level_to_raw, human_rate_to_raw};
    use crate::params::{
        Algo, AlgoControlId, AlgoControlValueV1, DelayParams, EnvStep, FxSlotConfig, LineSelect,
        ModDestination, ModRoute, ModSource, PolyMode, ShimmerVerbParams, StepEnvData,
        VibratoParams,
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
    fn sync_lfo_uses_manual_tempo_when_host_transport_is_absent() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.params_mut().tempo_bpm = 120.0;
        proc.params_mut().lfo.rate_mode = crate::params::LfoRateMode::Sync;
        proc.params_mut().lfo.sync_division = crate::params::LfoSyncDivision::Quarter;

        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        let expected_phase = 2.0 / 48_000.0;
        assert!((proc.lfo_phase - expected_phase).abs() < 1.0e-6);
    }

    #[test]
    fn sync_lfo_prefers_host_transport_tempo_when_available() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.params_mut().tempo_bpm = 120.0;
        proc.params_mut().lfo.rate_mode = crate::params::LfoRateMode::Sync;
        proc.params_mut().lfo.sync_division = crate::params::LfoSyncDivision::Quarter;
        proc.set_host_transport(60.0, false, 0.0);

        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        let expected_phase = 1.0 / 48_000.0;
        assert!((proc.lfo_phase - expected_phase).abs() < 1.0e-6);
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
    fn no_mod_matrix_rendering_remains_finite_and_nonzero() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.params_mut().mod_matrix.routes.clear();
        proc.note_on(60, utils::midi_note_to_freq(60), 1.0);

        let mut out = [0.0_f32; 256];
        proc.process(&mut out);

        assert!(out.iter().all(|sample| sample.is_finite()));
        assert!(out.iter().any(|sample| sample.abs() > 1e-6));
    }

    #[test]
    fn params_mut_fx_changes_sync_on_next_process() {
        let mut proc = CosmoProcessor::new(48_000.0);
        assert_eq!(proc.fx.slot_types[0], FxSlotType::Empty);

        proc.params_mut().fx_slots[0] = FxSlotConfig::Delay(DelayParams {
            enabled: true,
            time: 0.25,
            feedback: 0.4,
            mix: 0.5,
            tape_mode: false,
            warmth: 0.5,
        });

        assert_eq!(proc.fx.slot_types[0], FxSlotType::Empty);

        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        assert_eq!(proc.fx.slot_types[0], FxSlotType::Delay);
    }

    #[test]
    fn set_shared_params_rebuilds_compiled_cz_controls() {
        let mut proc = CosmoProcessor::new(48_000.0);
        let mut params = SynthParams::default();
        params.line1.algo = Algo::Cz101;
        params.line1.algo_controls_a[0] = Some(AlgoControlValueV1 {
            id: AlgoControlId::Waveform1,
            value: 1.0,
        });
        params.line1.algo_controls_a[1] = Some(AlgoControlValueV1 {
            id: AlgoControlId::Waveform2,
            value: 2.0,
        });

        proc.set_shared_params(Arc::new(params));

        assert_eq!(
            proc.compiled_params.line1.primary.algo_for_cycle(0),
            Algo::Square
        );
        assert_eq!(
            proc.compiled_params.line1.primary.algo_for_cycle(1),
            Algo::Pulse
        );
    }

    #[test]
    fn modulated_algo_blend_changes_rendered_audio() {
        fn render_sum(mut params: SynthParams) -> f32 {
            let mut proc = CosmoProcessor::new(48_000.0);
            params.line_select = LineSelect::L1;
            params.line1.algo = Algo::Skew;
            params.line1.algo2 = Some(Algo::Saw);
            params.line1.algo_blend = 0.0;
            params.line1.dca_base = 0.9;
            params.line1.dcw_base = 0.7;
            proc.set_params(params);
            proc.set_mod_wheel(1.0);
            proc.note_on(60, utils::midi_note_to_freq(60), 1.0);

            let mut out = [0.0_f32; 512];
            proc.process(&mut out);
            out.iter().map(|sample| sample.abs()).sum()
        }

        let dry = SynthParams::default();
        let mut modded = SynthParams::default();
        modded.mod_matrix.routes = vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::Line1AlgoBlend,
            amount: 1.0,
            enabled: true,
        }];

        let dry_sum = render_sum(dry);
        let modded_sum = render_sum(modded);

        assert!(
            (dry_sum - modded_sum).abs() > 1e-4,
            "expected line blend modulation to affect rendered audio"
        );
    }

    #[test]
    fn line2_detune_note_modulation_reaches_full_span() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.set_mod_wheel(1.0);
        proc.params_mut().mod_matrix.routes = vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::Line2DetuneNote,
            amount: 1.0,
            enabled: true,
        }];
        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        assert_eq!(
            proc.line2_scratch.detune_note, 11.0,
            "line2 detune note should reach full +11 semitone span at 100% modulation",
        );
    }

    #[test]
    fn line2_detune_fine_modulation_reaches_full_span() {
        let mut proc = CosmoProcessor::new(48_000.0);
        proc.set_mod_wheel(1.0);
        proc.params_mut().mod_matrix.routes = vec![ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::Line2DetuneFine,
            amount: 1.0,
            enabled: true,
        }];
        let mut out = [0.0_f32; 1];
        proc.process(&mut out);

        assert_eq!(
            proc.line2_scratch.detune_fine, 60.0,
            "line2 detune fine should reach full +60 span at 100% modulation",
        );
    }

    #[test]
    fn modulated_delay_mix_changes_rendered_audio_when_base_mix_is_zero() {
        fn render_sum(with_route: bool) -> f32 {
            let mut proc = CosmoProcessor::new(48_000.0);
            proc.params_mut().line_select = LineSelect::L1;
            proc.params_mut().line1.dca_base = 1.0;
            proc.params_mut().line1.dcw_base = 0.8;
            proc.params_mut().line1.algo = Algo::Skew;
            proc.params_mut().fx_slots[0] = FxSlotConfig::Delay(DelayParams {
                enabled: true,
                time: 0.1,
                feedback: 0.6,
                mix: 0.0,
                tape_mode: false,
                warmth: 0.5,
            });
            if with_route {
                proc.params_mut().mod_matrix.routes = vec![ModRoute {
                    source: ModSource::ModWheel,
                    destination: ModDestination::DelayMix,
                    amount: 1.0,
                    enabled: true,
                }];
                proc.set_mod_wheel(1.0);
            }
            proc.update_fx();
            proc.note_on(60, utils::midi_note_to_freq(60), 1.0);
            let mut out = [0.0_f32; 1024];
            proc.process(&mut out);
            out.iter().map(|sample| sample.abs()).sum()
        }

        let dry = render_sum(false);
        let modded = render_sum(true);
        assert!(
            (modded - dry).abs() > 1e-3,
            "delay mix modulation should alter rendered output when base mix is zero",
        );
    }

    #[test]
    fn modulated_reverb_mix_changes_rendered_audio_when_base_mix_is_zero() {
        fn render_sum(with_route: bool) -> f32 {
            let mut proc = CosmoProcessor::new(48_000.0);
            proc.params_mut().line_select = LineSelect::L1;
            proc.params_mut().line1.dca_base = 1.0;
            proc.params_mut().line1.dcw_base = 0.8;
            proc.params_mut().line1.algo = Algo::Skew;
            proc.params_mut().fx_slots[0] = FxSlotConfig::Reverb(crate::params::ReverbParams {
                enabled: true,
                mix: 0.0,
                space: 0.8,
                predelay: 0.02,
                distance: 0.3,
                character: 0.65,
            });
            if with_route {
                proc.params_mut().mod_matrix.routes = vec![ModRoute {
                    source: ModSource::ModWheel,
                    destination: ModDestination::ReverbMix,
                    amount: 1.0,
                    enabled: true,
                }];
                proc.set_mod_wheel(1.0);
            }
            proc.update_fx();
            proc.note_on(60, utils::midi_note_to_freq(60), 1.0);
            let mut out = [0.0_f32; 1024];
            proc.process(&mut out);
            out.iter().map(|sample| sample.abs()).sum()
        }

        let dry = render_sum(false);
        let modded = render_sum(true);
        assert!(
            (modded - dry).abs() > 1e-3,
            "reverb mix modulation should alter rendered output when base mix is zero",
        );
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
    fn mini_keyboard_drag_note_switch_keeps_peak_delta_bounded() {
        fn dca_step(level: u8, rate: u8) -> EnvStep {
            EnvStep {
                level: human_level_to_raw(EnvelopeKind::Dca, level),
                rate: human_rate_to_raw(EnvelopeKind::Dca, rate),
                level_norm: level as f32 / 99.0,
            }
        }

        fn dcw_step(level: u8, rate: u8) -> EnvStep {
            EnvStep {
                level: human_level_to_raw(EnvelopeKind::Dcw, level),
                rate: human_rate_to_raw(EnvelopeKind::Dcw, rate),
                level_norm: level as f32 / 99.0,
            }
        }

        let mut proc = CosmoProcessor::new(48_000.0);
        proc.params_mut().line_select = LineSelect::L2;
        proc.params_mut().line2.dcw_key_follow = 2.0;
        proc.params_mut().line2.dca_key_follow = 2.0;
        proc.params_mut().line2.dca_env = StepEnvData {
            steps: [
                dca_step(99, 99),
                dca_step(99, 99),
                dca_step(99, 99),
                dca_step(99, 99),
                dca_step(99, 99),
                dca_step(99, 99),
                dca_step(99, 99),
                dca_step(99, 99),
            ],
            sustain_step: 0,
            step_count: 2,
            loop_: false,
        };
        proc.params_mut().line2.dcw_env = StepEnvData {
            steps: [
                dcw_step(80, 99),
                dcw_step(80, 99),
                dcw_step(80, 99),
                dcw_step(80, 99),
                dcw_step(80, 99),
                dcw_step(80, 99),
                dcw_step(80, 99),
                dcw_step(80, 99),
            ],
            sustain_step: 0,
            step_count: 2,
            loop_: false,
        };

        proc.params_mut().portamento.enabled = true;
        proc.params_mut().portamento.time = 0.1;
        proc.params_mut().fx_slots = [
            FxSlotConfig::Vibrato(VibratoParams {
                enabled: true,
                waveform: 1,
                rate: 40.0,
                depth: 5.895899,
                delay: 600.0,
            }),
            FxSlotConfig::Empty,
            FxSlotConfig::Empty,
            FxSlotConfig::Empty,
            FxSlotConfig::Delay(DelayParams {
                enabled: true,
                time: 0.5151404,
                feedback: 0.46,
                mix: 0.34496948,
                tape_mode: true,
                warmth: 0.72,
            }),
            FxSlotConfig::ShimmerVerb(ShimmerVerbParams {
                enabled: true,
                shimmer: 0.85,
                space: 0.95,
                mix: 0.1144397,
            }),
        ];
        proc.update_fx();

        let mut peak_delta = 0.0_f32;
        let mut peak_curvature = 0.0_f32;
        let mut prev = 0.0_f32;
        let mut prev_delta = 0.0_f32;
        let mut block = [0.0_f32; 1];

        let mut current_note = 60_u8;
        proc.note_on(current_note, utils::midi_note_to_freq(current_note), 1.0);
        for _ in 0..32 {
            proc.process(&mut block);
            let delta = block[0] - prev;
            peak_delta = peak_delta.max((delta).abs());
            peak_curvature = peak_curvature.max((delta - prev_delta).abs());
            prev_delta = delta;
            prev = block[0];
        }

        for step in 0..192 {
            let next_note = 48 + (step % 24) as u8;
            if next_note != current_note {
                // Mirror mini-keyboard drag behavior: release old note and
                // trigger the new one in immediate succession.
                proc.note_off(current_note);
                proc.note_on(next_note, utils::midi_note_to_freq(next_note), 1.0);
                current_note = next_note;
            }

            proc.process(&mut block);
            let delta = block[0] - prev;
            peak_delta = peak_delta.max((delta).abs());
            peak_curvature = peak_curvature.max((delta - prev_delta).abs());
            prev_delta = delta;
            prev = block[0];
        }

        proc.note_off(current_note);
        for _ in 0..64 {
            proc.process(&mut block);
            let delta = block[0] - prev;
            peak_delta = peak_delta.max((delta).abs());
            peak_curvature = peak_curvature.max((delta - prev_delta).abs());
            prev_delta = delta;
            prev = block[0];
        }

        assert!(peak_delta.is_finite());
        assert!(peak_curvature.is_finite());
        assert!(
            peak_delta < 0.02,
            "mini-keyboard drag transient too sharp (peak delta = {peak_delta})"
        );
        assert!(
            peak_curvature < 0.03,
            "mini-keyboard drag click-like curvature too high (peak curvature = {peak_curvature})"
        );
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
