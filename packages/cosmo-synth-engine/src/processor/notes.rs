extern crate alloc;

use crate::params::{MAX_VOICES, ModEnvMode, ModEnvRetrigMode, PolyMode};

use super::CosmoProcessor;
use super::state::{MonoStackEntry, NoteEntry};

const MONO_RETRIGGER_TIMEOUT_SAMPLES: u32 = 512;
const MONO_RETRIGGER_ZERO_THRESHOLD: f32 = 0.0005;

impl CosmoProcessor {
    pub(crate) fn reset_voice_envs(&mut self, voice_idx: usize) {
        self.voices[voice_idx].reset_envs();
    }

    pub(crate) fn start_env_release_for_voice(&mut self, voice_idx: usize) {
        self.start_line_env_release_for_voice(voice_idx);
        self.start_mod_env_release_for_voice(voice_idx);
    }

    pub(crate) fn start_line_env_release_for_voice(&mut self, voice_idx: usize) {
        let p = self.params.as_ref();
        let voice = &mut self.voices[voice_idx];
        voice
            .line1_synthesis
            .start_envelope_release(&p.line1, &mut voice.line1_envelopes);
        voice
            .line2_synthesis
            .start_envelope_release(&p.line2, &mut voice.line2_envelopes);
        voice.line1_synthesis.note_off(&p.line1);
        voice.line2_synthesis.note_off(&p.line2);
    }

    pub(crate) fn start_mod_env_release_for_voice(&mut self, voice_idx: usize) {
        let p = self.params.as_ref();
        let voice = &mut self.voices[voice_idx];
        if p.mod_env.retrig_mode == ModEnvRetrigMode::Poly && p.mod_env.mode == ModEnvMode::Adsr {
            voice.mod_env.note_off();
        }
    }

    pub(crate) fn start_release(&mut self, voice_idx: usize) {
        self.voices[voice_idx].is_releasing = true;
        self.start_env_release_for_voice(voice_idx);
    }

    pub(crate) fn start_release_without_mod_env(&mut self, voice_idx: usize) {
        self.voices[voice_idx].is_releasing = true;
        self.start_line_env_release_for_voice(voice_idx);
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
        let prev_smoothed_dcw1 = voice.smoothed_dcw1;
        let prev_smoothed_dcw2 = voice.smoothed_dcw2;
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
        if was_active {
            voice.voice_steal_fade_sample = prev_output_sample;
            voice.voice_steal_fade = crate::voice::POLY_VOICE_STEAL_FADE_SAMPLES;
            voice.voice_steal_fade_len = crate::voice::POLY_VOICE_STEAL_FADE_SAMPLES;
        } else {
            voice.voice_steal_fade_sample = 0.0;
            voice.voice_steal_fade = 0;
            voice.voice_steal_fade_len = 0;
        }
        voice.last_output_sample = if was_active { prev_output_sample } else { 0.0 };
        voice.release_tail_level = 0.0;
        voice.aftertouch = 0.0;
        voice.smoothed_dcw1 = if was_active { prev_smoothed_dcw1 } else { 0.0 };
        voice.smoothed_dcw2 = if was_active { prev_smoothed_dcw2 } else { 0.0 };
        let identity_base = (voice_idx as u64) * 2;
        voice.line1_synthesis.reset(self.sample_rate, identity_base);
        voice
            .line2_synthesis
            .reset(self.sample_rate, identity_base + 1);

        if let Some(vib) = self.params.vibrato_params()
            && vib.enabled
        {
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
        self.voices[voice_idx].note_on_sequence = self.next_note_on_sequence();
        self.voices[voice_idx].noise_step = 0;
        self.reset_voice_envs(voice_idx);
        self.reset_generator_runtime_for_note(voice_idx, note);

        if self.params.mod_env.retrig_mode == ModEnvRetrigMode::Poly {
            self.voices[voice_idx].mod_env.note_on();
        } else {
            self.voices[voice_idx].mod_env = self.shared_mod_env.clone();
        }
    }

    pub(crate) fn reset_generator_runtime_for_note(&mut self, voice_idx: usize, note: u8) {
        let voice = &mut self.voices[voice_idx];
        voice
            .line1_synthesis
            .note_on(&self.params.line1, note, voice.velocity);
        voice
            .line2_synthesis
            .note_on(&self.params.line2, note, voice.velocity);
    }

    pub(crate) fn replace_active_note_entry(&mut self, voice_idx: usize, note: u8) {
        self.active_notes.retain(|e| e.voice_idx != voice_idx);
        debug_assert!(self.active_notes.len() < MAX_VOICES);
        self.active_notes
            .try_push(NoteEntry { note, voice_idx })
            .expect("active_notes exceeded voice capacity");
        self.debug_assert_note_storage_bounds();
    }

    pub(crate) fn push_mono_stack_entry(&mut self, entry: MonoStackEntry) {
        self.mono_stack.retain(|e| e.note != entry.note);
        debug_assert!(self.mono_stack.len() < MAX_VOICES);
        self.mono_stack
            .try_push(entry)
            .expect("mono_stack exceeded voice capacity");
        self.debug_assert_note_storage_bounds();
    }

    fn next_note_on_sequence(&mut self) -> u64 {
        let sequence = self.note_on_counter;
        self.note_on_counter = self.note_on_counter.wrapping_add(1);
        sequence
    }

    fn track_mono_held_note(&mut self, note: u8) {
        self.mono_held_notes.retain(|held_note| *held_note != note);
        debug_assert!(self.mono_held_notes.len() < MAX_VOICES);
        self.mono_held_notes
            .try_push(note)
            .expect("mono_held_notes exceeded voice capacity");
        self.debug_assert_note_storage_bounds();
    }

    fn release_mono_held_note(&mut self, note: u8) {
        self.mono_held_notes.retain(|held_note| *held_note != note);
    }

    fn clear_pending_mono_retrigger(&mut self) {
        self.pending_mono_retrigger = None;
    }

    fn queue_pending_mono_retrigger(
        &mut self,
        note: u8,
        frequency: f32,
        velocity: f32,
        source_voice_idx: usize,
    ) {
        let previous_sample = self.voices[source_voice_idx].last_output_sample;
        self.pending_mono_retrigger = Some(super::PendingMonoRetrigger {
            note,
            frequency,
            velocity,
            source_voice_idx,
            timeout_samples: MONO_RETRIGGER_TIMEOUT_SAMPLES,
            previous_sample,
        });
    }

    fn queue_mono_retrigger_from_voice(
        &mut self,
        note: u8,
        frequency: f32,
        velocity: f32,
        source_voice_idx: usize,
    ) {
        if source_voice_idx >= MAX_VOICES {
            self.initialize_voice_for_note(
                self.find_poly_voice_for_note_on(),
                note,
                frequency,
                velocity,
            );
            return;
        }

        let should_capture_resume = self.voices[source_voice_idx].note != Some(note)
            && !self.voices[source_voice_idx].sustained;
        if should_capture_resume {
            self.capture_mono_resume_state(source_voice_idx);
        }

        self.active_notes
            .retain(|entry| entry.voice_idx != source_voice_idx);
        self.voices[source_voice_idx].sustained = false;

        if !self.voices[source_voice_idx].is_releasing {
            self.start_release(source_voice_idx);
        }

        self.queue_pending_mono_retrigger(note, frequency, velocity, source_voice_idx);
    }

    fn mono_note_is_physically_held(&self, note: u8) -> bool {
        self.mono_held_notes.contains(&note)
    }

    fn remove_mono_stack_note(&mut self, note: u8) {
        self.mono_stack.retain(|entry| entry.note != note);
    }

    fn mono_stack_entry(&self, note: u8) -> Option<&MonoStackEntry> {
        self.mono_stack
            .iter()
            .rev()
            .find(|entry| entry.note == note)
    }

    fn capture_mono_resume_state(&mut self, voice_idx: usize) {
        let Some(note) = self.voices[voice_idx].note else {
            return;
        };
        if !self.mono_note_is_physically_held(note) || self.voices[voice_idx].is_silent {
            return;
        }
        self.push_mono_stack_entry(MonoStackEntry {
            note,
            voice: self.voices[voice_idx].clone(),
        });
    }

    fn retire_duplicate_note_voices(&mut self, note: u8, keep_voice_idx: usize) {
        self.active_notes
            .retain(|entry| entry.note != note || entry.voice_idx == keep_voice_idx);
        self.remove_mono_stack_note(note);

        for idx in 0..MAX_VOICES {
            if idx == keep_voice_idx {
                continue;
            }
            if self.voices[idx].note == Some(note) && !self.voices[idx].is_silent {
                self.start_quick_release(idx);
            }
        }
    }

    fn mono_active_voice_index(&self) -> Option<usize> {
        self.active_notes
            .last()
            .map(|entry| entry.voice_idx)
            .filter(|idx| {
                *idx < MAX_VOICES
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

    fn sustained_voice_index_for_note(&self, note: u8) -> Option<usize> {
        self.voices.iter().enumerate().find_map(|(idx, voice)| {
            (voice.note == Some(note) && voice.sustained && !voice.is_silent).then_some(idx)
        })
    }

    fn queue_mono_resume_previous_held_note(&mut self, voice_idx: usize) -> bool {
        let Some(prev_note) = self.mono_held_notes.last().copied() else {
            return false;
        };

        let Some(prev_voice) = self
            .mono_stack_entry(prev_note)
            .map(|entry| entry.voice.clone())
        else {
            return false;
        };

        self.remove_mono_stack_note(prev_note);
        self.voices[voice_idx].sustained = false;
        if !self.voices[voice_idx].is_releasing {
            self.start_release(voice_idx);
        }
        self.queue_pending_mono_retrigger(
            prev_note,
            prev_voice.frequency,
            prev_voice.velocity,
            voice_idx,
        );
        true
    }

    pub(crate) fn process_pending_mono_retrigger_after_sample(&mut self) {
        let Some(mut pending) = self.pending_mono_retrigger else {
            return;
        };

        if pending.source_voice_idx >= MAX_VOICES {
            self.initialize_voice_for_note(
                self.find_poly_voice_for_note_on(),
                pending.note,
                pending.frequency,
                pending.velocity,
            );
            return self.clear_pending_mono_retrigger();
        }

        let voice = &self.voices[pending.source_voice_idx];
        let current_sample = voice.last_output_sample;
        let near_zero = current_sample.abs() <= MONO_RETRIGGER_ZERO_THRESHOLD;
        let crossed_zero = (pending.previous_sample > 0.0 && current_sample <= 0.0)
            || (pending.previous_sample < 0.0 && current_sample >= 0.0);
        let should_trigger =
            voice.is_silent || near_zero || crossed_zero || pending.timeout_samples == 0;

        if should_trigger {
            let keep_voice_idx = pending.source_voice_idx.min(MAX_VOICES - 1);
            self.initialize_voice_for_note(
                keep_voice_idx,
                pending.note,
                pending.frequency,
                pending.velocity,
            );
            self.replace_active_note_entry(keep_voice_idx, pending.note);
            self.quick_fade_other_mono_voices(keep_voice_idx);
            self.clear_pending_mono_retrigger();
            return;
        }

        pending.timeout_samples = pending.timeout_samples.saturating_sub(1);
        pending.previous_sample = current_sample;
        self.pending_mono_retrigger = Some(pending);
    }

    fn quick_fade_other_mono_voices(&mut self, keep_voice_idx: usize) {
        for idx in 0..MAX_VOICES {
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

        {
            let voice = &self.voices[voice_idx];
            if voice.is_releasing || voice.is_silent || voice.note == Some(note) {
                return false;
            }
        }

        self.capture_mono_resume_state(voice_idx);
        let next_sequence = self.next_note_on_sequence();

        let voice = &mut self.voices[voice_idx];
        voice.target_freq = frequency;
        voice.glide_start_freq = voice.current_freq;
        voice.glide_progress = 0.0;

        voice.note = Some(note);
        voice.frequency = frequency;
        voice.velocity = velocity;
        voice.is_releasing = false;
        voice.sustained = false;
        voice.note_on_sequence = next_sequence;

        self.replace_active_note_entry(voice_idx, note);
        self.retire_duplicate_note_voices(note, voice_idx);
        true
    }

    fn find_poly_voice_for_note_on(&self) -> usize {
        self.find_poly_voice_for_note_on_excluding(None)
    }

    fn find_poly_voice_for_note_on_excluding(&self, excluded_voice_idx: Option<usize>) -> usize {
        let limit = self.active_voice_limit();
        if let Some(voice_idx) = self.voices[..limit].iter().position(|v| v.is_silent)
            && Some(voice_idx) != excluded_voice_idx
        {
            return voice_idx;
        }

        self.voices[..limit]
            .iter()
            .enumerate()
            .filter(|(idx, _)| Some(*idx) != excluded_voice_idx)
            .filter(|(_, voice)| !voice.is_silent && voice.note.is_some())
            .min_by_key(|(_, voice)| voice.note_on_sequence)
            .map(|(idx, _)| idx)
            .or(excluded_voice_idx)
            .unwrap_or(0)
    }

    fn handle_mono_note_on(&mut self, note: u8, frequency: f32, velocity: f32) {
        self.track_mono_held_note(note);

        if let Some(pending) = self.pending_mono_retrigger {
            self.queue_pending_mono_retrigger(note, frequency, velocity, pending.source_voice_idx);
            return;
        }

        if let Some(entry) = self.active_notes.iter().find(|e| e.note == note).cloned()
            && self.voices[entry.voice_idx].note == Some(note)
        {
            self.queue_mono_retrigger_from_voice(note, frequency, velocity, entry.voice_idx);
            return;
        }

        if let Some(voice_idx) = self.sustained_voice_index_for_note(note) {
            self.queue_mono_retrigger_from_voice(note, frequency, velocity, voice_idx);
            return;
        }

        if self.params.portamento.enabled
            && self.try_handle_mono_note_change_no_retrigger(note, frequency, velocity)
        {
            return;
        }

        let source_voice_idx = self.mono_active_voice_index().or_else(|| {
            self.voices
                .iter()
                .position(|voice| !voice.is_silent && voice.note.is_some())
        });
        if let Some(source_voice_idx) = source_voice_idx {
            self.queue_mono_retrigger_from_voice(note, frequency, velocity, source_voice_idx);
            return;
        }

        let new_voice_idx = self.find_poly_voice_for_note_on();
        self.initialize_voice_for_note(new_voice_idx, note, frequency, velocity);
        self.replace_active_note_entry(new_voice_idx, note);
        self.retire_duplicate_note_voices(note, new_voice_idx);
    }

    fn handle_poly_note_on(&mut self, note: u8, frequency: f32, velocity: f32) {
        if let Some(entry) = self.active_notes.iter().find(|e| e.note == note).cloned()
            && self.voices[entry.voice_idx].note == Some(note)
        {
            self.initialize_voice_for_note(entry.voice_idx, note, frequency, velocity);
            self.replace_active_note_entry(entry.voice_idx, note);
            self.retire_duplicate_note_voices(note, entry.voice_idx);
            return;
        }

        if let Some(voice_idx) = self.sustained_voice_index_for_note(note) {
            let new_voice_idx = self.find_poly_voice_for_note_on_excluding(Some(voice_idx));
            self.initialize_voice_for_note(new_voice_idx, note, frequency, velocity);
            self.replace_active_note_entry(new_voice_idx, note);
            return;
        }

        let voice_idx = self.find_poly_voice_for_note_on();
        self.initialize_voice_for_note(voice_idx, note, frequency, velocity);
        self.replace_active_note_entry(voice_idx, note);
        self.retire_duplicate_note_voices(note, voice_idx);
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

        match self.params.mod_env.retrig_mode {
            ModEnvRetrigMode::Poly => {}
            ModEnvRetrigMode::Mono => {
                self.shared_mod_env.note_on();
            }
            ModEnvRetrigMode::Legato => {
                if self.active_notes.is_empty() {
                    self.shared_mod_env.note_on();
                }
            }
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
            self.release_mono_held_note(note);
            self.remove_mono_stack_note(note);
            if self
                .pending_mono_retrigger
                .is_some_and(|pending| pending.note == note)
            {
                self.clear_pending_mono_retrigger();
            }
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
            if self.params.poly_mode == PolyMode::Mono {
                self.mono_stack.clear();
            }
            return;
        }

        let will_release = if self.params.poly_mode == PolyMode::Mono {
            !self.queue_mono_resume_previous_held_note(voice_idx)
        } else {
            true
        };

        if will_release {
            self.start_release(voice_idx);
            if self.params.mod_env.retrig_mode != ModEnvRetrigMode::Poly
                && self.params.mod_env.mode == ModEnvMode::Adsr
                && self.active_notes.is_empty()
            {
                self.shared_mod_env.note_off();
            }
        }
    }

    /// Update sustain-pedal state and release voices no longer held.
    pub fn set_sustain(&mut self, on: bool) {
        self.sustain_on = on;
        if !on {
            for i in 0..MAX_VOICES {
                let sustained = self.voices[i].sustained;
                if sustained {
                    let still_held = self.active_notes.iter().any(|e| e.voice_idx == i);
                    if !still_held {
                        self.voices[i].sustained = false;
                        self.start_release_without_mod_env(i);
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
