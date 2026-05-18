extern crate alloc;

use crate::params::{NUM_VOICES, PolyMode};

use super::CosmoProcessor;
use super::state::{MonoStackEntry, NoteEntry};

impl CosmoProcessor {
    pub(crate) fn reset_voice_envs(&mut self, voice_idx: usize) {
        self.voices[voice_idx].reset_envs();
    }

    pub(crate) fn start_env_release_for_voice(&mut self, voice_idx: usize) {
        let p = self.params.as_ref();
        let voice = &mut self.voices[voice_idx];
        voice.line1_env.dco.start_release(&p.line1.dco_env);
        voice.line1_env.dcw.start_release(&p.line1.dcw_env);
        voice.line1_env.dca.start_release(&p.line1.dca_env);
        voice.line2_env.dco.start_release(&p.line2.dco_env);
        voice.line2_env.dcw.start_release(&p.line2.dcw_env);
        voice.line2_env.dca.start_release(&p.line2.dca_env);
        voice.mod_env.note_off();
    }

    pub(crate) fn start_release(&mut self, voice_idx: usize) {
        self.voices[voice_idx].is_releasing = true;
        self.start_env_release_for_voice(voice_idx);
    }

    pub(crate) fn start_quick_release(&mut self, voice_idx: usize) {
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

    pub(crate) fn reset_voice_runtime(&mut self, voice_idx: usize) {
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
        voice.last_output_sample = if was_active { prev_output_sample } else { 0.0 };
        voice.release_tail_level = 0.0;
        voice.smoothed_dcw1 = 0.0;
        voice.smoothed_dcw2 = 0.0;

        if let Some(vib) = self.params.vibrato_params()
            && vib.enabled {
                voice.vibrato_phase = 0.0;
                let delay_ms = vib.delay;
                voice.vibrato_delay_counter = (delay_ms * self.sample_rate / 1000.0).round() as u32;
            }
    }
    pub(crate) fn configure_voice_pitch(&mut self, voice_idx: usize, note: u8, frequency: f32) {
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

    pub(crate) fn initialize_voice_for_note(
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
        self.voices[voice_idx].mod_env.note_on();
    }

    pub(crate) fn reset_generator_runtime_for_note(&mut self, voice_idx: usize, note: u8) {
        let voice = &mut self.voices[voice_idx];
        voice.algo_runtime.note_on(note);
    }

    pub(crate) fn replace_active_note_entry(&mut self, voice_idx: usize, note: u8) {
        self.active_notes.retain(|e| e.voice_idx != voice_idx);
        debug_assert!(self.active_notes.len() < NUM_VOICES);
        self.active_notes
            .try_push(NoteEntry { note, voice_idx })
            .expect("active_notes exceeded voice capacity");
        self.debug_assert_note_storage_bounds();
    }

    pub(crate) fn push_mono_stack_entry(&mut self, entry: MonoStackEntry) {
        self.mono_stack.retain(|e| e.note != entry.note);
        debug_assert!(self.mono_stack.len() < NUM_VOICES);
        self.mono_stack
            .try_push(entry)
            .expect("mono_stack exceeded voice capacity");
        self.debug_assert_note_storage_bounds();
    }

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

    fn quick_fade_other_mono_voices(&mut self, keep_voice_idx: usize) {
        for idx in 0..NUM_VOICES {
            if idx != keep_voice_idx && !self.voices[idx].is_silent {
                self.start_quick_release(idx);
            }
        }
    }

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

        if let Some(entry) = prev_entry
            && !entry.voice.is_silent
        {
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

    fn find_poly_voice_for_note_on(&self) -> usize {
        if let Some(voice_idx) = self.voices.iter().position(|v| v.is_silent) {
            return voice_idx;
        }

        let mut min_releasing_amp = f32::INFINITY;
        let mut min_releasing_idx: Option<usize> = None;
        for (idx, voice) in self.voices.iter().enumerate() {
            if voice.is_releasing {
                let amp = voice.line1_env.dca.output.max(voice.line2_env.dca.output);
                if amp < min_releasing_amp {
                    min_releasing_amp = amp;
                    min_releasing_idx = Some(idx);
                }
            }
        }

        if let Some(idx) = min_releasing_idx {
            return idx;
        }

        let mut min_sustained_amp = f32::INFINITY;
        let mut min_sustained_idx: Option<usize> = None;
        for (idx, voice) in self.voices.iter().enumerate() {
            if !voice.is_releasing && self.voice_has_reached_sustain(idx) {
                let amp = voice.line1_env.dca.output.max(voice.line2_env.dca.output);
                if amp < min_sustained_amp {
                    min_sustained_amp = amp;
                    min_sustained_idx = Some(idx);
                }
            }
        }

        if let Some(idx) = min_sustained_idx {
            return idx;
        }

        // If every voice is currently active, steal the quietest one instead
        // of always voice 0 to reduce audible discontinuities.
        let mut min_active_amp = f32::INFINITY;
        let mut min_active_idx = 0usize;
        for (idx, voice) in self.voices.iter().enumerate() {
            let amp = voice.line1_env.dca.output.max(voice.line2_env.dca.output);
            if amp < min_active_amp {
                min_active_amp = amp;
                min_active_idx = idx;
            }
        }

        min_active_idx
    }

    fn voice_has_reached_sustain(&self, voice_idx: usize) -> bool {
        let voice = &self.voices[voice_idx];
        let p = self.params.as_ref();

        let line1_active = matches!(
            p.line_select,
            crate::params::LineSelect::L1
                | crate::params::LineSelect::L1PlusL1Prime
                | crate::params::LineSelect::L1PlusL2Prime
        );
        let line2_active = matches!(
            p.line_select,
            crate::params::LineSelect::L2 | crate::params::LineSelect::L1PlusL2Prime
        );

        let line1_reached =
            !line1_active || voice.line1_env.dca.step >= p.line1.dca_env.sustain_step;
        let line2_reached =
            !line2_active || voice.line2_env.dca.step >= p.line2.dca_env.sustain_step;

        line1_reached && line2_reached
    }

    fn handle_mono_note_on(&mut self, note: u8, frequency: f32, velocity: f32) {
        if let Some(entry) = self.active_notes.iter().find(|e| e.note == note)
            && self.voices[entry.voice_idx].note == Some(note)
        {
            let voice = &mut self.voices[entry.voice_idx];
            voice.frequency = frequency;
            voice.target_freq = frequency;
            voice.velocity = velocity;
            return;
        }

        if self.params.portamento.enabled
            && self.try_handle_mono_note_change_no_retrigger(note, frequency, velocity)
        {
            return;
        }

        let new_voice_idx = self.find_poly_voice_for_note_on();
        self.initialize_voice_for_note(new_voice_idx, note, frequency, velocity);
        self.replace_active_note_entry(new_voice_idx, note);
        self.mono_stack.clear();
        self.quick_fade_other_mono_voices(new_voice_idx);
    }

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

    /// Handle a note-on event.
    pub fn note_on(&mut self, note: u8, frequency: f32, velocity: f32) {
        let vel = if velocity <= 0.0 { 1.0 } else { velocity };
        let vel = {
            let curve = self.params.velocity_curve;
            if curve.abs() < 0.001 {
                vel
            } else {
                let exponent = (2.0_f32).powf(-curve * 2.5);
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

    /// Handle a note-off event.
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
            self.voices[voice_idx].mod_env.note_off();
            return;
        }

        if self.params.poly_mode == PolyMode::Mono {
            if let Some(prev) = self.mono_stack.last() {
                if prev.voice.is_silent {
                    self.mono_stack.pop();
                    self.start_release(voice_idx);
                } else {
                    let voice = &mut self.voices[voice_idx];
                    *voice = prev.voice.clone();
                    voice.note = Some(prev.note);
                    self.replace_active_note_entry(voice_idx, prev.note);
                }
            } else {
                self.start_release(voice_idx);
            }
        } else {
            self.start_release(voice_idx);
        }
    }

    /// Update sustain-pedal state and release voices no longer held.
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

    /// Find the active voice index currently assigned to a MIDI note.
    pub fn find_voice_for_note(&self, note: u8) -> Option<usize> {
        self.active_notes
            .iter()
            .find(|e| e.note == note)
            .map(|e| e.voice_idx)
    }
}

const MONO_RETRIGGER_QUICK_FADE_SAMPLES: u32 = 128;
