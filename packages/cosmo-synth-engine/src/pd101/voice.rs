use purr_synth_core::engine::{Frame, RenderContext, VoiceContext, VoiceDsp};
use purr_synth_core::event::NoteId;

use crate::params::StepEnvData;
use crate::processor::midi_note_to_freq;
use crate::voice::{render_voice, Voice, ANTI_CLICK_ATTACK_SAMPLES};

use super::synth::Pd101Synth;

/// Per-voice DSP wrapper for the PD-101 engine.
///
/// Wraps the engine's `Voice` state and implements `VoiceDsp<Pd101Synth>`,
/// providing the architectural seam between the `purr-synth-core` framework
/// and the existing CZ voice rendering code.
///
/// # LFO behaviour
/// The original `CosmoProcessor` maintains global LFO phases shared across all
/// voices. `Pd101Voice` reads pre-computed LFO outputs from `Pd101Patch`
/// (`lfo1_out`, `lfo2_out`, `random_out`) which the processor populates before
/// each render frame.
#[derive(Debug, Clone)]
pub struct Pd101Voice {
    inner: Voice,
}

impl Pd101Voice {
    pub fn new() -> Self {
        Self {
            inner: Voice::new(),
        }
    }

    /// Expose an immutable reference to the underlying voice state.
    pub fn inner(&self) -> &Voice {
        &self.inner
    }

    /// Expose a mutable reference to the underlying voice state.
    pub fn inner_mut(&mut self) -> &mut Voice {
        &mut self.inner
    }
}

impl Default for Pd101Voice {
    fn default() -> Self {
        Self::new()
    }
}

impl VoiceDsp<Pd101Synth> for Pd101Voice {
    /// Initialise the voice for a new note.
    ///
    /// Replicates the behaviour of `CosmoProcessor::initialize_voice_for_note`:
    /// sets pitch, velocity, resets oscillator phases, resets all envelope
    /// generators, and triggers the mod-envelope attack.
    ///
    /// Portamento (glide) is applied when `patch.params.portamento.enabled` is
    /// true and the voice is not currently silent.
    fn note_on(&mut self, note: NoteId, context: &VoiceContext<Pd101Synth>) {
        let p = &context.patch.params;
        let freq = midi_note_to_freq(note.midi_note);
        let v = &mut self.inner;

        // Pitch / glide -------------------------------------------------------
        v.note = Some(note.midi_note);
        v.env_note = note.midi_note;
        v.frequency = freq;
        v.target_freq = freq;

        if p.portamento.enabled && !v.is_silent {
            v.glide_start_freq = v.current_freq;
            v.glide_progress = 0.0;
        } else {
            v.current_freq = freq;
            v.glide_start_freq = freq;
            v.glide_progress = 0.0;
        }

        // Velocity ------------------------------------------------------------
        v.velocity = note.velocity;

        // Oscillator / gate state reset ---------------------------------------
        v.phi1 = 0.0;
        v.phi2 = 0.0;
        v.cycle_count1 = 0;
        v.cycle_count2 = 0;
        v.pm_phi = 0.0;
        v.is_releasing = false;
        v.is_silent = false;
        v.sustained = false;
        v.gate_was_open = false;
        v.anti_click_fade = 0;
        v.anti_click_fade_len = 0;
        v.zero_cross_stop_pending = false;
        v.zero_cross_stop_wait = 0;
        v.anti_click_attack = ANTI_CLICK_ATTACK_SAMPLES;
        v.last_output_sample = 0.0;
        v.release_tail_level = 0.0;
        v.smoothed_dcw1 = 0.0;
        v.smoothed_dcw2 = 0.0;

        if let Some(vib) = p.vibrato_params() {
            if vib.enabled {
                v.vibrato_phase = 0.0;
            }
        }

        // Envelope reset & trigger --------------------------------------------
        v.reset_envs();
        v.algo_runtime.note_on(note.midi_note);
        v.mod_env.note_on();
    }

    /// Begin the release stage for all envelopes.
    ///
    /// Mirrors `CosmoProcessor::start_release`.
    fn note_off(&mut self, context: &VoiceContext<Pd101Synth>) {
        let p = &context.patch.params;
        let v = &mut self.inner;

        v.is_releasing = true;

        // Release all step envelopes for each line.
        fn release_line_envs(
            envs: &mut crate::voice::LineEnvs,
            dco_env: &StepEnvData,
            dcw_env: &StepEnvData,
            dca_env: &StepEnvData,
        ) {
            envs.dco.start_release(dco_env);
            envs.dcw.start_release(dcw_env);
            envs.dca.start_release(dca_env);
        }

        release_line_envs(
            &mut v.line1_env,
            &p.line1.dco_env,
            &p.line1.dcw_env,
            &p.line1.dca_env,
        );
        release_line_envs(
            &mut v.line2_env,
            &p.line2.dco_env,
            &p.line2.dcw_env,
            &p.line2.dca_env,
        );

        v.mod_env.note_off();
    }

    /// Render one audio sample.
    ///
    /// Reads pre-computed LFO/random outputs from `context.patch` and runtime
    /// controller values from `context`, then delegates to `render_voice`.
    fn render(&mut self, context: &mut RenderContext<Pd101Synth>) -> Frame {
        let patch = context.patch;
        let sample = render_voice(
            &mut self.inner,
            &patch.params,
            patch.lfo1_out,
            patch.lfo2_out,
            patch.random_out,
            context.sample_rate,
            context.pitch_bend * patch.params.pitch_bend_range,
            context.mod_wheel,
            context.aftertouch,
        );
        Frame::mono(sample)
    }

    /// Returns `false` when the voice has finished its release tail and is
    /// fully silent (safe to steal).
    fn is_active(&self) -> bool {
        !self.inner.is_silent
    }

    /// Restore full DSP state from a snapshot taken at an earlier point.
    ///
    /// Used by `SynthRuntime`'s monophonic note-stack restore: when a held note
    /// is unpeeled from the stack, this brings back the oscillator phases and
    /// envelope state from the moment that note was last active, resuming it
    /// without retriggering the envelopes.
    fn restore_snapshot(&mut self, snapshot: &Self) {
        self.inner = snapshot.inner.clone();
    }
}
