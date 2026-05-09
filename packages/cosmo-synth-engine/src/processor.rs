/// Top-level Cosmo PD-101 synthesizer engine.
///
/// Ported from `CosmoProcessor` in `pdVisualizerProcessor.js`
/// (lines 542-1293).
extern crate alloc;

use alloc::vec::Vec;
use core::array;
use serde::Serialize;

use crate::batch_cache::RenderBlockCache;
use crate::dsp_utils::{lfo_output_with_symmetry, random_hold_value};
use crate::envelope::{normalize_synth_params_envelopes_to_raw_if_human, EnvelopeTimingCache};
use crate::fx::FxChain;
use crate::generators::PER_LINE_HEADROOM;
use crate::module_presets;
use crate::params::{FxSlotConfig, FxSlotType, ModDestination, PolyMode, SynthParams, NUM_VOICES};
use crate::voice::{
    build_mod_value_cache, line_modulation_state, render_voice, LineModulationState, ModSources,
    ModValueCache, Voice,
};

const SOFT_CLIP_DRIVE: f32 = 1.0;
const SOFT_CLIP_THRESHOLD: f32 = 0.9;
const REFERENCE_LINE_HEADROOM: f32 = 0.75;
const HEADROOM_MAKEUP_EXPONENT: f32 = 0.8;
const MAX_HEADROOM_MAKEUP: f32 = 1.0;
const MONO_RETRIGGER_QUICK_FADE_SAMPLES: u32 = 128;
const ENABLE_CZ_DAC_COLOR: bool = false;
const CZ_DAC_SAMPLE_RATE_HZ: f32 = 40_000.0;
const CZ_DAC_QUANT_STEPS: f32 = 2047.0;
const CZ_DAC_COMPRESS_GAMMA: f32 = 0.78;
const CZ_DAC_EXPAND_GAMMA: f32 = 1.0 / CZ_DAC_COMPRESS_GAMMA;
const CZ_DAC_MISTRACK_MAX: f32 = 0.22;
const CZ_DAC_LOW_BUMP_HZ: f32 = 100.0;
const CZ_DAC_HONK_HP_HZ: f32 = 650.0;
const CZ_DAC_HONK_LP_HZ: f32 = 1_700.0;
const CZ_DAC_AIR_HP_HZ: f32 = 5_500.0;
const CZ_DAC_HF_ROLLOFF_HZ: f32 = 20_000.0;
const DCW_DEZIPPER_TIME_SECONDS: f32 = 0.0015;
const RELEASE_TAIL_LEVEL_TIME_SECONDS: f32 = 0.01;
const DYNAMIC_ECO_VOICE_THRESHOLD: usize = 4;
const DYNAMIC_ECO_FX_SLOT_THRESHOLD: usize = 4;

#[derive(Debug, Clone, Copy)]
struct CzDacColor {
    env: f32,
    slew_env: f32,
    prev_q: f32,
    low_state: f32,
    honk_hp_state: f32,
    honk_lp_state: f32,
    air_hp_state: f32,
    output_lp_state: f32,
}

impl CzDacColor {
    fn new() -> Self {
        Self {
            env: 0.0,
            slew_env: 0.0,
            prev_q: 0.0,
            low_state: 0.0,
            honk_hp_state: 0.0,
            honk_lp_state: 0.0,
            air_hp_state: 0.0,
            output_lp_state: 0.0,
        }
    }

    fn reset(&mut self) {
        *self = Self::new();
    }

    fn process(&mut self, sample: f32, sample_rate: f32) -> f32 {
        let sr = sample_rate.max(1.0);
        let input = sample.clamp(-1.2, 1.2);

        // Approximate CZ compansion: non-linear digital compression into a
        // 12-bit DAC, then imperfect expansion with envelope-dependent tracking.
        let compressed = signed_pow(input, CZ_DAC_COMPRESS_GAMMA);
        let quantized = (compressed * CZ_DAC_QUANT_STEPS).round() / CZ_DAC_QUANT_STEPS;

        let abs_q = libm::fabsf(quantized);
        let env_attack = 1.0 - libm::expf(-1.0 / (0.0015 * sr));
        let env_release = 1.0 - libm::expf(-1.0 / (0.055 * sr));
        let env_alpha = if abs_q > self.env {
            env_attack
        } else {
            env_release
        };
        self.env += (abs_q - self.env) * env_alpha;

        let slew = libm::fabsf(quantized - self.prev_q);
        self.prev_q = quantized;
        let slew_alpha = 1.0 - libm::expf(-1.0 / (0.0075 * sr));
        self.slew_env += (slew - self.slew_env) * slew_alpha;

        let mistrack = ((0.45 - self.env) * 0.18 + self.slew_env * 0.9)
            .clamp(-CZ_DAC_MISTRACK_MAX, CZ_DAC_MISTRACK_MAX);
        let expand_gamma = (CZ_DAC_EXPAND_GAMMA + mistrack).clamp(0.8, 2.0);
        let expanded = signed_pow(quantized, expand_gamma);

        // Spectral color: low-end punch, mid honk and slight breathy top-end.
        let low = one_pole_lp(expanded, &mut self.low_state, CZ_DAC_LOW_BUMP_HZ, sr);
        let honk_hp = one_pole_hp(expanded, &mut self.honk_hp_state, CZ_DAC_HONK_HP_HZ, sr);
        let honk = one_pole_lp(honk_hp, &mut self.honk_lp_state, CZ_DAC_HONK_LP_HZ, sr);
        let air = one_pole_hp(expanded, &mut self.air_hp_state, CZ_DAC_AIR_HP_HZ, sr);

        let shaped = expanded + low * 0.08 + honk * 0.07 + air * (0.03 + self.slew_env * 0.07);

        let effective_sr = sr.min(CZ_DAC_SAMPLE_RATE_HZ);
        let output_cutoff = CZ_DAC_HF_ROLLOFF_HZ.min(effective_sr * 0.49);
        one_pole_lp(shaped, &mut self.output_lp_state, output_cutoff, sr).clamp(-1.2, 1.2)
    }
}

#[derive(Debug, Clone, Copy, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeModSources {
    pub lfo1: f32,
    pub lfo2: f32,
    pub random: f32,
    pub mod_env: f32,
    pub velocity: f32,
    pub mod_wheel: f32,
    pub aftertouch: f32,
}

#[derive(Debug, Clone, Copy, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeVoiceEnvState {
    pub value: f32,
    pub step: usize,
    pub releasing: bool,
    pub step_pos: u32,
    pub prev_level: f32,
}

#[derive(Debug, Clone, Copy, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeVoiceLineState {
    pub dco: RuntimeVoiceEnvState,
    pub dcw: RuntimeVoiceEnvState,
    pub dca: RuntimeVoiceEnvState,
}

#[derive(Debug, Clone, Copy, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeVoiceDebugState {
    pub index: usize,
    pub active: bool,
    pub is_releasing: bool,
    pub sustained: bool,
    pub note: Option<u8>,
    pub env_note: u8,
    pub velocity: f32,
    pub frequency: f32,
    pub current_freq: f32,
    pub target_freq: f32,
    pub phase1: f32,
    pub phase2: f32,
    pub anti_click_fade: u32,
    pub anti_click_attack: u32,
    pub release_tail_level: f32,
    pub line1: RuntimeVoiceLineState,
    pub line2: RuntimeVoiceLineState,
}

// ---------------------------------------------------------------------------
// NoteEntry — maps a MIDI note to a voice index
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
pub struct NoteEntry {
    pub note: u8,
    pub voice_idx: usize,
}

/// Full voice state saved when switching notes in mono mode.
#[derive(Debug, Clone)]
pub struct MonoStackEntry {
    note: u8,
    voice: Voice,
}

// ---------------------------------------------------------------------------
// CosmoProcessor
// ---------------------------------------------------------------------------

pub struct CosmoProcessor {
    pub voices: [Voice; NUM_VOICES],
    pub fx: FxChain,
    cz_dac_color: CzDacColor,
    /// Active note → voice mapping (replaces JS `activeNoteMap`).
    pub active_notes: Vec<NoteEntry>,
    /// Note stack for mono mode (last-note priority), stores full voice state.
    pub mono_stack: Vec<MonoStackEntry>,
    pub sustain_on: bool,
    pub lfo_phase: f32,
    pub lfo2_phase: f32,
    /// Phase accumulator for the random mod source (seconds elapsed * rate).
    pub random_phase: f32,
    /// Step counter for the random mod source used as the hash seed.
    pub random_step: i32,
    /// Current held value of the random mod source in [-1, 1].
    pub random_hold: f32,
    pub params: SynthParams,
    pub sample_rate: f32,
    /// Normalised pitch bend value in [-1.0, 1.0].
    /// Multiplied by `params.pitch_bend_range` semitones in voice render.
    pub pitch_bend: f32,
    /// Normalised mod wheel value in [0.0, 1.0].
    /// Boosts vibrato depth by `params.mod_wheel_vibrato_depth * mod_wheel`.
    pub mod_wheel: f32,
    /// Normalised aftertouch/channel pressure value in [0.0, 1.0].
    pub aftertouch: f32,
    /// Latest modulation-source snapshot for UI telemetry.
    pub last_runtime_mod_sources: RuntimeModSources,
    /// Dynamic quality mode toggle for load-shedding FX under heavy runtime cost.
    fx_eco_toggle: bool,
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
            active_notes: Vec::with_capacity(NUM_VOICES),
            mono_stack: Vec::with_capacity(NUM_VOICES),
            sustain_on: false,
            lfo_phase: 0.0,
            lfo2_phase: 0.0,
            random_phase: 0.0,
            random_step: 0,
            random_hold: random_hold_value(0),
            params: SynthParams::default(),
            sample_rate,
            pitch_bend: 0.0,
            mod_wheel: 0.0,
            aftertouch: 0.0,
            last_runtime_mod_sources: RuntimeModSources::default(),
            fx_eco_toggle: false,
            fx_last_out: 0.0,
            envelope_timing: EnvelopeTimingCache::new(sample_rate),
        };
        proc.update_fx();
        proc
    }

    fn runtime_mod_source_voice_index(&self) -> Option<usize> {
        self.active_notes
            .last()
            .map(|entry| entry.voice_idx)
            .filter(|voice_idx| *voice_idx < NUM_VOICES)
            .or_else(|| {
                self.voices.iter().position(|voice| {
                    voice.note.is_some() && (!voice.is_silent || voice.mod_env.output > 0.0)
                })
            })
            .or_else(|| {
                self.voices
                    .iter()
                    .position(|voice| voice.mod_env.output > 0.0)
            })
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

    // -----------------------------------------------------------------------
    // FX parameter sync
    // -----------------------------------------------------------------------

    /// Copy FX-relevant fields from `self.params` into the `FxChain`.
    pub fn update_fx(&mut self) {
        self.fx.sync_from_params(&self.params);
    }

    // -----------------------------------------------------------------------
    // Params
    // -----------------------------------------------------------------------

    /// Replace the entire parameter set and re-sync FX.
    pub fn set_params(&mut self, mut params: SynthParams) {
        normalize_synth_params_envelopes_to_raw_if_human(&mut params);
        self.params = params;
        self.update_fx();
    }

    /// Copy parameter values into the processor while reusing existing heap storage.
    pub fn set_params_from_ref(&mut self, params: &SynthParams) {
        self.params.clone_from(params);
        normalize_synth_params_envelopes_to_raw_if_human(&mut self.params);
        self.update_fx();
    }

    /// Hard reset runtime voice/FX state while keeping current parameters.
    ///
    /// Used when loading a new preset so held notes and effect tails are cut
    /// immediately before rendering the new sound.
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
    }

    /// Set which effect type occupies a given FX slot (0–5).
    /// Resets to default params with enabled=true for non-empty types.
    pub fn set_fx_slot_type(&mut self, slot: usize, slot_type: FxSlotType) {
        if slot < 6 {
            self.params.fx_slots[slot] = FxSlotConfig::default_for_type(slot_type);
            self.update_fx();
        }
    }

    /// Return the current FX slot type layout.
    pub fn get_fx_slot_types(&self) -> [FxSlotType; 6] {
        core::array::from_fn(|i| self.params.fx_slots[i].slot_type())
    }

    /// Apply a named module preset to the current parameters.
    ///
    /// Returns `true` when the module/preset pair is recognized.
    pub fn apply_module_preset(&mut self, module: &str, preset: &str) -> bool {
        let applied = module_presets::apply_module_preset(&mut self.params, module, preset);
        if applied {
            self.update_fx();
        }
        applied
    }

    /// Reset all envelope generators for the selected voice.
    fn reset_voice_envs(&mut self, voice_idx: usize) {
        self.voices[voice_idx].reset_envs();
    }

    /// Start the release stage for all envelopes on a voice.
    fn start_env_release_for_voice(&mut self, voice_idx: usize) {
        let p = &self.params;
        let voice = &mut self.voices[voice_idx];
        voice.line1_env.dco.start_release(&p.line1.dco_env);
        voice.line1_env.dcw.start_release(&p.line1.dcw_env);
        voice.line1_env.dca.start_release(&p.line1.dca_env);
        voice.line2_env.dco.start_release(&p.line2.dco_env);
        voice.line2_env.dcw.start_release(&p.line2.dcw_env);
        voice.line2_env.dca.start_release(&p.line2.dca_env);
        voice.mod_env.note_off();
    }

    /// Mark a voice as releasing and switch all envelopes to release mode.
    fn start_release(&mut self, voice_idx: usize) {
        self.voices[voice_idx].is_releasing = true;
        self.start_env_release_for_voice(voice_idx);
    }

    /// Start release and force a short anti-click fade for mono overlap retriggers.
    fn start_quick_release(&mut self, voice_idx: usize) {
        if self.voices[voice_idx].is_silent {
            return;
        }

        self.start_release(voice_idx);
        let voice = &mut self.voices[voice_idx];
        voice.anti_click_fade = MONO_RETRIGGER_QUICK_FADE_SAMPLES;
        voice.anti_click_fade_len = MONO_RETRIGGER_QUICK_FADE_SAMPLES;
        voice.zero_cross_stop_pending = false;
        voice.zero_cross_stop_wait = 0;
    }

    /// Reset transient oscillator and gate state before starting a fresh note.
    fn reset_voice_runtime(&mut self, voice_idx: usize) {
        let voice = &mut self.voices[voice_idx];
        let was_active = !voice.is_silent;
        let prev_output_sample = voice.last_output_sample;
        voice.phi1 = 0.0;
        voice.phi2 = 0.0;
        voice.cycle_count1 = 0;
        voice.cycle_count2 = 0;
        voice.pm_phi = 0.0;
        voice.is_releasing = false;
        voice.is_silent = false;
        voice.sustained = false;
        voice.gate_was_open = false;
        voice.anti_click_fade = 0;
        voice.anti_click_fade_len = 0;
        voice.zero_cross_stop_pending = false;
        voice.zero_cross_stop_wait = 0;
        voice.anti_click_attack = crate::voice::ANTI_CLICK_ATTACK_SAMPLES;
        // Preserve continuity on retrigger so sample-discontinuity suppression
        // can smooth the transition from the previous sounding note.
        voice.last_output_sample = if was_active { prev_output_sample } else { 0.0 };
        voice.release_tail_level = 0.0;
        // Reset DCW dezipper state so a new note always starts slewing from 0
        // rather than inheriting the previous note's smoothed DCW value.
        voice.smoothed_dcw1 = 0.0;
        voice.smoothed_dcw2 = 0.0;

        if let Some(vib) = self.params.vibrato_params() {
            if vib.enabled {
                voice.vibrato_phase = 0.0;
                let delay_ms = vib.delay;
                voice.vibrato_delay_counter =
                    libm::roundf(delay_ms * self.sample_rate / 1000.0) as u32;
            }
        }
    }

    /// Update note and glide-related pitch fields for a voice.
    fn configure_voice_pitch(&mut self, voice_idx: usize, note: u8, frequency: f32) {
        let voice = &mut self.voices[voice_idx];
        voice.note = Some(note);
        voice.env_note = note;
        voice.frequency = frequency;
        voice.target_freq = frequency;

        if self.params.portamento.enabled && !voice.is_silent {
            voice.glide_start_freq = voice.current_freq;
            voice.glide_progress = 0.0;
        } else {
            voice.current_freq = frequency;
            voice.glide_start_freq = frequency;
            voice.glide_progress = 0.0;
        }
    }

    /// Fully prepare a voice slot for a new note-on event.
    fn initialize_voice_for_note(
        &mut self,
        voice_idx: usize,
        note: u8,
        frequency: f32,
        velocity: f32,
    ) {
        self.configure_voice_pitch(voice_idx, note, frequency);
        self.voices[voice_idx].velocity = velocity;
        self.reset_voice_runtime(voice_idx);
        self.reset_voice_envs(voice_idx);
        self.reset_generator_runtime_for_note(voice_idx, note);
        // Trigger mod envelope attack after reset.
        self.voices[voice_idx].mod_env.note_on();
    }

    /// Reset generator-owned per-voice runtime state for a new note-on event.
    fn reset_generator_runtime_for_note(&mut self, voice_idx: usize, note: u8) {
        let voice = &mut self.voices[voice_idx];
        voice.algo_runtime.note_on(note);
    }

    /// Replace any previous active-note mapping for a voice slot.
    fn replace_active_note_entry(&mut self, voice_idx: usize, note: u8) {
        self.active_notes.retain(|e| e.voice_idx != voice_idx);
        self.active_notes.push(NoteEntry { note, voice_idx });
    }

    /// Push a note snapshot onto the mono stack, deduplicating by note number.
    fn push_mono_stack_entry(&mut self, entry: MonoStackEntry) {
        self.mono_stack.retain(|e| e.note != entry.note);
        self.mono_stack.push(entry);
    }

    /// Return the current mono lead voice index, if one is actively sounding.
    fn mono_active_voice_index(&self) -> Option<usize> {
        self.active_notes
            .last()
            .map(|entry| entry.voice_idx)
            .filter(|idx| {
                *idx < NUM_VOICES
                    && !self.voices[*idx].is_silent
                    && !self.voices[*idx].is_releasing
                    && self.voices[*idx].note.is_some()
            })
            .or_else(|| {
                self.voices
                    .iter()
                    .enumerate()
                    .find(|(_, voice)| {
                        !voice.is_silent && !voice.is_releasing && voice.note.is_some()
                    })
                    .map(|(idx, _)| idx)
            })
    }

    /// Force a short fade on every sounding mono voice except the newly-triggered one.
    fn quick_fade_other_mono_voices(&mut self, keep_voice_idx: usize) {
        for idx in 0..NUM_VOICES {
            if idx != keep_voice_idx && !self.voices[idx].is_silent {
                self.start_quick_release(idx);
            }
        }
    }

    /// Handle mono note changes without retriggering envelopes.
    fn try_handle_mono_note_change_no_retrigger(
        &mut self,
        note: u8,
        frequency: f32,
        velocity: f32,
    ) -> bool {
        let Some(voice_idx) = self.mono_active_voice_index() else {
            return false;
        };

        let prev_entry = self.voices[voice_idx].note.map(|prev_note| MonoStackEntry {
            note: prev_note,
            voice: self.voices[voice_idx].clone(),
        });

        if let Some(entry) = prev_entry {
            self.push_mono_stack_entry(entry);
        }

        let voice = &mut self.voices[voice_idx];
        if voice.is_releasing || voice.is_silent || voice.note == Some(note) {
            return false;
        }

        voice.target_freq = frequency;
        if self.params.portamento.enabled {
            voice.glide_start_freq = voice.current_freq;
            voice.glide_progress = 0.0;
        } else {
            voice.current_freq = frequency;
        }

        voice.note = Some(note);
        voice.frequency = frequency;
        voice.velocity = velocity;
        voice.is_releasing = false;

        self.replace_active_note_entry(voice_idx, note);
        true
    }

    /// Choose the best poly voice slot for a new note-on event.
    fn find_poly_voice_for_note_on(&self) -> usize {
        if let Some(voice_idx) = self.voices.iter().position(|v| v.is_silent) {
            return voice_idx;
        }

        let mut min_amp = f32::INFINITY;
        let mut min_idx = 0usize;
        for (idx, voice) in self.voices.iter().enumerate() {
            if voice.is_releasing {
                let amp = voice.line1_env.dca.output.max(voice.line2_env.dca.output);
                if amp < min_amp {
                    min_amp = amp;
                    min_idx = idx;
                }
            }
        }

        min_idx
    }

    /// Route a note-on through mono mode rules, including legato and stack restore.
    fn handle_mono_note_on(&mut self, note: u8, frequency: f32, velocity: f32) {
        if self.params.portamento.enabled
            && self.try_handle_mono_note_change_no_retrigger(note, frequency, velocity)
        {
            return;
        }

        // Fresh mono trigger: allocate a voice for the new note, then quickly
        // fade any residual tails from previous mono notes to avoid clicks.
        let new_voice_idx = self.find_poly_voice_for_note_on();
        self.initialize_voice_for_note(new_voice_idx, note, frequency, velocity);
        self.replace_active_note_entry(new_voice_idx, note);
        self.mono_stack.clear();
        self.quick_fade_other_mono_voices(new_voice_idx);
    }

    /// Route a note-on through poly mode rules, including voice reuse and stealing.
    fn handle_poly_note_on(&mut self, note: u8, frequency: f32, velocity: f32) {
        if let Some(entry) = self.active_notes.iter().find(|e| e.note == note).cloned() {
            let voice = &mut self.voices[entry.voice_idx];
            if voice.note == Some(note) {
                voice.frequency = frequency;
                voice.target_freq = frequency;
                voice.velocity = velocity;
                return;
            }
        }

        let voice_idx = self.find_poly_voice_for_note_on();
        self.initialize_voice_for_note(voice_idx, note, frequency, velocity);
        self.replace_active_note_entry(voice_idx, note);
    }

    // -----------------------------------------------------------------------
    // Note-on
    // -----------------------------------------------------------------------

    /// Handle a note-on event.
    ///
    /// * `note`      – MIDI note number [0, 127]
    /// * `frequency` – corresponding frequency in Hz
    /// * `velocity`  – normalised velocity [0.0, 1.0]
    pub fn note_on(&mut self, note: u8, frequency: f32, velocity: f32) {
        let vel = if velocity <= 0.0 { 1.0 } else { velocity };
        let vel = {
            let curve = self.params.velocity_curve;
            if curve.abs() < 0.001 {
                vel
            } else {
                let exponent = libm::powf(2.0_f32, -curve * 2.5);
                vel.clamp(0.0, 1.0).powf(exponent)
            }
        };

        if self.params.lfo.retrigger {
            self.lfo_phase = 0.0;
        }
        if self.params.lfo2.retrigger {
            self.lfo2_phase = 0.0;
        }

        if self.params.poly_mode == PolyMode::Mono {
            self.handle_mono_note_on(note, frequency, vel);
        } else {
            self.handle_poly_note_on(note, frequency, vel);
        }
    }

    /// Handle a note-off event, including mono stack restore and sustain logic.
    pub fn note_off(&mut self, note: u8) {
        if self.params.poly_mode == PolyMode::Mono {
            self.mono_stack.retain(|e| e.note != note);
        }

        let entry = match self.active_notes.iter().find(|e| e.note == note).cloned() {
            Some(e) => e,
            None => return,
        };
        self.active_notes.retain(|e| e.note != note);

        let voice_idx = entry.voice_idx;
        if self.voices[voice_idx].note != Some(note) {
            return;
        }

        if self.sustain_on {
            self.voices[voice_idx].sustained = true;
            // Sustain holds the amplitude envelopes, but key release should still
            // let the modulation ADSR leave attack/sustain so pedal-up does not
            // introduce a sudden modulation jump.
            self.voices[voice_idx].mod_env.note_off();
            return;
        }

        if self.params.poly_mode == PolyMode::Mono {
            if let Some(prev) = self.mono_stack.last() {
                let voice = &mut self.voices[voice_idx];
                *voice = prev.voice.clone();
                voice.note = Some(prev.note);
                self.replace_active_note_entry(voice_idx, prev.note);
            } else {
                self.start_release(voice_idx);
            }
        } else {
            self.start_release(voice_idx);
        }
    }

    /// Update sustain-pedal state and release any voices no longer physically held.
    pub fn set_sustain(&mut self, on: bool) {
        self.sustain_on = on;
        if !on {
            for i in 0..NUM_VOICES {
                let sustained = self.voices[i].sustained;
                if sustained {
                    let still_held = self.active_notes.iter().any(|e| e.voice_idx == i);
                    if !still_held {
                        self.voices[i].sustained = false;
                        self.start_release(i);
                    } else {
                        self.voices[i].sustained = false;
                    }
                }
            }
        }
    }

    // -----------------------------------------------------------------------
    // Pitch bend & mod wheel
    // -----------------------------------------------------------------------

    /// Set pitch bend. `value` is normalised [-1.0, 1.0] (from MIDI 14-bit).
    /// The actual semitone shift = value * params.pitch_bend_range.
    pub fn set_pitch_bend(&mut self, value: f32) {
        self.pitch_bend = value.clamp(-1.0, 1.0);
    }

    /// Set mod wheel. `value` is normalised [0.0, 1.0] (CC1 / 127).
    pub fn set_mod_wheel(&mut self, value: f32) {
        self.mod_wheel = value.clamp(0.0, 1.0);
    }

    /// Set aftertouch/channel pressure. `value` is normalised [0.0, 1.0].
    pub fn set_aftertouch(&mut self, value: f32) {
        self.aftertouch = value.clamp(0.0, 1.0);
    }

    // -----------------------------------------------------------------------
    // Audio process loop
    // -----------------------------------------------------------------------

    /// Fill `output` with mono samples.
    ///
    /// The caller is responsible for distributing these samples to stereo
    /// channels if required.
    pub fn process(&mut self, output: &mut [f32]) {
        let p = &self.params;
        let base_lfo1_rate = p.lfo.rate;
        let lfo1_waveform = p.lfo.waveform;
        let base_lfo1_symmetry = p.lfo.symmetry;
        let base_lfo1_depth = p.lfo.depth;
        let base_lfo1_offset = p.lfo.offset;
        let base_lfo2_rate = p.lfo2.rate;
        let lfo2_waveform = p.lfo2.waveform;
        let base_lfo2_symmetry = p.lfo2.symmetry;
        let base_lfo2_depth = p.lfo2.depth;
        let base_lfo2_offset = p.lfo2.offset;
        let base_random_rate = p.random.rate;
        let sr = self.sample_rate;
        let headroom_ratio = REFERENCE_LINE_HEADROOM / PER_LINE_HEADROOM.max(0.01);
        let headroom_makeup =
            libm::powf(headroom_ratio, HEADROOM_MAKEUP_EXPONENT).clamp(1.0, MAX_HEADROOM_MAKEUP);
        let render_cache = RenderBlockCache::from_params(p);
        let norm = render_cache.volume * headroom_makeup / libm::sqrtf(NUM_VOICES as f32);
        let matrix = &p.mod_matrix;
        let line_modulation_state: LineModulationState = line_modulation_state(matrix);
        let safe_sr = sr.max(1.0);
        let dcw_dezipper_alpha = 1.0 - libm::expf(-1.0 / (DCW_DEZIPPER_TIME_SECONDS * safe_sr));
        let release_tail_alpha =
            1.0 - libm::expf(-1.0 / (RELEASE_TAIL_LEVEL_TIME_SECONDS * safe_sr));

        let mut prev_lfo1 = self.last_runtime_mod_sources.lfo1;
        let mut prev_lfo2 = self.last_runtime_mod_sources.lfo2;
        let mut prev_random = self.last_runtime_mod_sources.random;
        let active_fx_slots = render_cache.active_fx_slots;

        for sample_out in output.iter_mut() {
            let mod_source_voice_idx = self.runtime_mod_source_voice_index();
            let (source_mod_env, source_velocity) = mod_source_voice_idx
                .map(|voice_idx| {
                    let voice = &self.voices[voice_idx];
                    (voice.mod_env.output, voice.velocity)
                })
                .unwrap_or((0.0, 0.0));

            let pre_sources = ModSources::new(
                prev_lfo1,
                prev_lfo2,
                prev_random,
                source_mod_env,
                source_velocity,
                self.mod_wheel,
                self.aftertouch,
            );
            let pre_mod_values = if render_cache.has_modulation() {
                build_mod_value_cache(matrix, &pre_sources)
            } else {
                ModValueCache::default()
            };

            let lfo1_rate_mod = pre_mod_values.get(ModDestination::Lfo1Rate);
            let lfo1_depth_mod = pre_mod_values.get(ModDestination::Lfo1Depth);
            let lfo1_symmetry_mod = pre_mod_values.get(ModDestination::Lfo1Symmetry);
            let lfo1_offset_mod = pre_mod_values.get(ModDestination::Lfo1Offset);

            let lfo2_rate_mod = pre_mod_values.get(ModDestination::Lfo2Rate);
            let lfo2_depth_mod = pre_mod_values.get(ModDestination::Lfo2Depth);
            let lfo2_symmetry_mod = pre_mod_values.get(ModDestination::Lfo2Symmetry);
            let lfo2_offset_mod = pre_mod_values.get(ModDestination::Lfo2Offset);
            let random_rate_mod = pre_mod_values.get(ModDestination::RandomRate);

            let lfo1_rate = (base_lfo1_rate + lfo1_rate_mod * 20.0).clamp(0.01, 40.0);
            let lfo1_depth = (base_lfo1_depth + lfo1_depth_mod).clamp(0.0, 1.0);
            let lfo1_symmetry = (base_lfo1_symmetry + lfo1_symmetry_mod).clamp(0.0, 1.0);
            let lfo1_offset = (base_lfo1_offset + lfo1_offset_mod).clamp(-1.0, 1.0);

            let lfo2_rate = (base_lfo2_rate + lfo2_rate_mod * 20.0).clamp(0.01, 40.0);
            let lfo2_depth = (base_lfo2_depth + lfo2_depth_mod).clamp(0.0, 1.0);
            let lfo2_symmetry = (base_lfo2_symmetry + lfo2_symmetry_mod).clamp(0.0, 1.0);
            let lfo2_offset = (base_lfo2_offset + lfo2_offset_mod).clamp(-1.0, 1.0);

            self.lfo_phase += lfo1_rate / sr;
            if self.lfo_phase >= 1.0 {
                self.lfo_phase -= 1.0;
            }
            let lfo1_mod_val =
                lfo_output_with_symmetry(self.lfo_phase, lfo1_waveform, lfo1_symmetry) * lfo1_depth
                    + lfo1_offset;

            self.lfo2_phase += lfo2_rate / sr;
            if self.lfo2_phase >= 1.0 {
                self.lfo2_phase -= 1.0;
            }
            let lfo2_mod_val =
                lfo_output_with_symmetry(self.lfo2_phase, lfo2_waveform, lfo2_symmetry)
                    * lfo2_depth
                    + lfo2_offset;

            // Advance the random (sample-and-hold) mod source.
            let random_rate = (base_random_rate + random_rate_mod * 20.0).clamp(0.0, 200.0);
            self.random_phase += random_rate / sr;
            if self.random_phase >= 1.0 {
                self.random_phase -= 1.0;
                self.random_step = self.random_step.wrapping_add(1);
                self.random_hold = random_hold_value(self.random_step);
            }
            let random_mod_val = self.random_hold;
            let mod_wheel = self.mod_wheel;
            let aftertouch = self.aftertouch;

            let mut mixed = 0.0_f32;
            // SAFETY: `voices` and `params` are separate fields; we use raw pointer to avoid
            // simultaneous mutable + immutable borrow of `self`.
            let params_ptr: *const SynthParams = &self.params;
            let pitch_bend_semitones = self.pitch_bend * self.params.pitch_bend_range;
            let pitch_bend_ratio = if pitch_bend_semitones == 0.0 {
                1.0
            } else {
                libm::exp2f(pitch_bend_semitones / 12.0)
            };
            let mut active_voice_count = 0usize;
            for v in 0..NUM_VOICES {
                if self.voices[v].is_silent && self.voices[v].note.is_none() {
                    continue;
                }
                active_voice_count += 1;
                // SAFETY: params is read-only here and voices[v] is the only mutated field.
                let p_ref: &SynthParams = unsafe { &*params_ptr };
                mixed += render_voice(
                    &mut self.voices[v],
                    p_ref,
                    lfo1_mod_val,
                    lfo2_mod_val,
                    random_mod_val,
                    sr,
                    &self.envelope_timing,
                    pitch_bend_ratio,
                    mod_wheel,
                    aftertouch,
                    line_modulation_state,
                    dcw_dezipper_alpha,
                    release_tail_alpha,
                );
            }

            let (mod_env, velocity) = mod_source_voice_idx
                .map(|voice_idx| {
                    let voice = &self.voices[voice_idx];
                    (voice.mod_env.output, voice.velocity)
                })
                .unwrap_or((0.0, 0.0));
            self.last_runtime_mod_sources = RuntimeModSources {
                lfo1: lfo1_mod_val,
                lfo2: lfo2_mod_val,
                random: random_mod_val,
                mod_env,
                velocity,
                mod_wheel,
                aftertouch,
            };
            prev_lfo1 = lfo1_mod_val;
            prev_lfo2 = lfo2_mod_val;
            prev_random = random_mod_val;

            mixed *= norm;

            let dynamic_eco_active = active_voice_count >= DYNAMIC_ECO_VOICE_THRESHOLD
                && active_fx_slots >= DYNAMIC_ECO_FX_SLOT_THRESHOLD;
            let fx_out = if dynamic_eco_active {
                if self.fx_eco_toggle {
                    self.fx_last_out
                } else {
                    let out = self.fx.process(mixed);
                    self.fx_last_out = out;
                    out
                }
            } else {
                let out = self.fx.process(mixed);
                self.fx_eco_toggle = false;
                self.fx_last_out = out;
                out
            };
            if dynamic_eco_active {
                self.fx_eco_toggle = !self.fx_eco_toggle;
            }

            let colored = if ENABLE_CZ_DAC_COLOR {
                self.cz_dac_color.process(fx_out, sr)
            } else {
                fx_out
            };
            let soft_limited = soft_clip_tanh(colored, SOFT_CLIP_DRIVE);
            *sample_out = soft_limited.clamp(-1.0, 1.0);
        }
    }

    /// Find the active voice index currently assigned to a MIDI note.
    pub fn find_voice_for_note(&self, note: u8) -> Option<usize> {
        self.active_notes
            .iter()
            .find(|e| e.note == note)
            .map(|e| e.voice_idx)
    }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/// Standard MIDI note → frequency conversion.
#[inline]
pub fn midi_note_to_freq(note: u8) -> f32 {
    440.0 * libm::powf(2.0, (note as f32 - 69.0) / 12.0)
}

#[inline]
fn soft_clip_tanh(sample: f32, drive: f32) -> f32 {
    if drive <= 0.0 {
        return sample;
    }

    let abs_sample = libm::fabsf(sample);
    if abs_sample <= SOFT_CLIP_THRESHOLD {
        return sample;
    }

    let norm = libm::tanhf(drive);
    if norm <= 0.0 {
        return sample;
    }

    let clipped = libm::tanhf(sample * drive) / norm;
    let blend = ((abs_sample - SOFT_CLIP_THRESHOLD) / (1.0 - SOFT_CLIP_THRESHOLD)).clamp(0.0, 1.0);
    sample + (clipped - sample) * blend
}

#[inline]
fn signed_pow(value: f32, gamma: f32) -> f32 {
    value.signum() * libm::powf(libm::fabsf(value), gamma.max(0.0001))
}

#[inline]
fn one_pole_lp(input: f32, state: &mut f32, cutoff_hz: f32, sample_rate: f32) -> f32 {
    let safe_cutoff = cutoff_hz.clamp(1.0, sample_rate * 0.49);
    let g = 1.0 - libm::expf(-2.0 * core::f32::consts::PI * safe_cutoff / sample_rate.max(1.0));
    *state += (input - *state) * g;
    *state
}

#[inline]
fn one_pole_hp(input: f32, state: &mut f32, cutoff_hz: f32, sample_rate: f32) -> f32 {
    let low = one_pole_lp(input, state, cutoff_hz, sample_rate);
    input - low
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::params::{ModDestination, ModRoute, ModSource, PolyMode};

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
        let freq = midi_note_to_freq(note);

        proc.note_on(note, freq, 1.0);
        proc.set_sustain(true);
        proc.note_off(note);

        // Re-strike the same note while pedal is still down.
        proc.note_on(note, freq, 1.0);

        // Releasing sustain should release the older sustained voice.
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
        proc.params.mod_matrix.routes = vec![ModRoute {
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
        proc.params.mod_matrix.routes = vec![ModRoute {
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
        proc.params.poly_mode = PolyMode::Mono;

        let note_a = 60_u8;
        let note_b = 64_u8;
        let freq_a = midi_note_to_freq(note_a);
        let freq_b = midi_note_to_freq(note_b);

        // Start A, then release it so voice enters envelope release.
        proc.note_on(note_a, freq_a, 1.0);
        proc.note_off(note_a);
        assert!(proc.voices[0].is_releasing);

        // Strike B while A is still releasing: B should be a fresh note.
        proc.note_on(note_b, freq_b, 1.0);
        let active_b = active_voice_indices_for_note(&proc, note_b);
        assert_eq!(active_b.len(), 1, "expected one active voice for note B");
        let b_idx = active_b[0];
        assert!(!proc.voices[b_idx].is_releasing);

        // Releasing B must not restore old A from a release-phase snapshot.
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
        proc.params.mod_matrix.routes = vec![ModRoute {
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
    fn cz_dac_color_output_is_finite_and_bounded() {
        let mut color = CzDacColor::new();
        for n in 0..4096 {
            let input = libm::sinf(n as f32 * 0.013) * 1.25;
            let out = color.process(input, 48_000.0);
            assert!(out.is_finite(), "colored sample should be finite");
            assert!(
                libm::fabsf(out) <= 1.2,
                "colored sample should stay within stage bounds",
            );
        }
    }

    #[test]
    fn cz_dac_color_transient_differs_from_steady_state() {
        let mut steady = CzDacColor::new();
        let mut transient = CzDacColor::new();

        // Warm both instances with low-level steady signal.
        for _ in 0..1024 {
            let _ = steady.process(0.12, 48_000.0);
            let _ = transient.process(0.12, 48_000.0);
        }

        let steady_out = steady.process(0.12, 48_000.0);
        let transient_out = transient.process(0.78, 48_000.0);
        let delta = libm::fabsf(transient_out - steady_out);

        assert!(
            delta > 0.1,
            "expected transient mistracking color to alter output (delta={})",
            delta,
        );
    }
}
