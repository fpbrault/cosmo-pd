use crate::engine::{Frame, RenderContext, VoiceContext, VoiceDsp};
use crate::envelope::{AdsrEnvelope, AdsrPhase};
use crate::event::NoteId;
use crate::filter::{FilterMode, StateVariableFilter};
use crate::lfo::Lfo;
use crate::modulation::ModSourceValues;
use crate::oscillator::BasicOscillator;

use super::patch::{MiniModSource, MiniModTarget};
use super::synth::MiniSynth;

/// Per-frame snapshot of live modulation source values.
struct MiniSources {
    filter_env: f32,
    lfo: f32,
}

impl ModSourceValues<MiniModSource> for MiniSources {
    fn value_for(&self, source: MiniModSource) -> f32 {
        match source {
            MiniModSource::FilterEnvelope => self.filter_env,
            MiniModSource::Lfo => self.lfo,
        }
    }
}

/// Per-voice state for the Minimoog example synth.
///
/// Signal flow:
/// 1. Three oscillators are mixed into a mono signal.
/// 2. The mixed signal passes through the state-variable filter (low-pass).
/// 3. The filter envelope opens the filter cutoff over time.
/// 4. The amplitude envelope shapes the overall volume.
/// 5. The LFO can modulate oscillator pitch and filter cutoff.
#[derive(Debug, Clone, PartialEq)]
pub struct MiniVoice {
    note: u8,
    osc1: BasicOscillator,
    osc2: BasicOscillator,
    osc3: BasicOscillator,
    filter: StateVariableFilter,
    amp_env: AdsrEnvelope,
    filter_env: AdsrEnvelope,
    lfo: Lfo,
    pitch_bend_semitones: f32,
}

impl MiniVoice {
    pub fn new(sample_rate: f32) -> Self {
        Self {
            note: 60,
            osc1: BasicOscillator::default(),
            osc2: BasicOscillator::default(),
            osc3: BasicOscillator::default(),
            filter: StateVariableFilter::new(sample_rate),
            amp_env: AdsrEnvelope::default(),
            filter_env: AdsrEnvelope::default(),
            // Distinct seed per voice keeps sample-hold LFO interesting.
            lfo: Lfo::new(0xdeadbeef),
            pitch_bend_semitones: 0.0,
        }
    }

    /// Compute the Hz value for an oscillator after applying semitone and cent offsets.
    fn osc_hz(
        note: u8,
        pitch_bend_semitones: f32,
        semitones: i8,
        cents: f32,
        kbd_track: bool,
    ) -> f32 {
        let base_note = if kbd_track { note as f32 } else { 60.0 };
        let offset = pitch_bend_semitones + semitones as f32 + cents / 100.0;
        let fractional_note = (base_note + offset).clamp(0.0, 127.0);
        440.0 * libm::powf(2.0, (fractional_note - 69.0) / 12.0)
    }
}

#[cfg(test)]
mod tests {
    use super::MiniVoice;

    #[test]
    fn osc_hz_preserves_fine_detune_direction_and_amount() {
        let neutral = MiniVoice::osc_hz(60, 0.0, 0, 0.0, true);
        let sharp = MiniVoice::osc_hz(60, 0.0, 0, 25.0, true);
        let flat = MiniVoice::osc_hz(60, 0.0, 0, -25.0, true);

        assert!(sharp > neutral);
        assert!(flat < neutral);
        assert!((sharp - neutral) < (neutral - flat) * 1.2);
        assert!((neutral - flat) < (sharp - neutral) * 1.2);
    }
}

impl VoiceDsp<MiniSynth> for MiniVoice {
    fn note_on(&mut self, note: NoteId, context: &VoiceContext<MiniSynth>) {
        self.note = note.midi_note;
        self.amp_env.reset();
        self.filter_env.reset();
        self.amp_env.note_on();
        self.filter_env.note_on();
        self.filter.set_sample_rate(context.sample_rate);
    }

    /// Legato: retrigger envelopes only if not already in sustain/release.
    fn note_change(&mut self, note: NoteId, context: &VoiceContext<MiniSynth>) {
        self.note = note.midi_note;
        if self.amp_env.phase() == AdsrPhase::Idle {
            self.amp_env.note_on();
            self.filter_env.note_on();
        }
        self.filter.set_sample_rate(context.sample_rate);
    }

    fn note_off(&mut self, _context: &VoiceContext<MiniSynth>) {
        self.amp_env.note_off();
        self.filter_env.note_off();
    }

    fn render(&mut self, context: &mut RenderContext<MiniSynth>) -> Frame {
        let patch = context.patch;
        let sr = context.sample_rate;

        // --- Advance envelopes ---
        let amp_level = self.amp_env.advance(patch.amp_env, sr);
        let filter_level = self.filter_env.advance(patch.filter_env, sr);

        // --- Advance LFO ---
        let lfo_out = self.lfo.next(patch.lfo.waveform, patch.lfo.rate_hz, sr);
        let lfo_mod = lfo_out * patch.lfo.depth;

        // --- Modulation matrix (framework) ---
        let sources = MiniSources {
            filter_env: filter_level,
            lfo: lfo_mod,
        };

        let filter_env_mod = context
            .modulation
            .value_for(MiniModTarget::FilterCutoff, &sources);
        let lfo_osc1_mod = context
            .modulation
            .value_for(MiniModTarget::Osc1Pitch, &sources);
        let lfo_osc2_mod = context
            .modulation
            .value_for(MiniModTarget::Osc2Pitch, &sources);
        let lfo_osc3_mod = context
            .modulation
            .value_for(MiniModTarget::Osc3Pitch, &sources);

        // --- Oscillators ---
        let note = self.note;
        let pb = self.pitch_bend_semitones;

        let o1 = &patch.osc1;
        let o2 = &patch.osc2;
        let o3 = &patch.osc3;

        let hz1 = Self::osc_hz(
            note,
            pb + lfo_osc1_mod,
            o1.semitones,
            o1.cents,
            o1.kbd_track,
        );
        let hz2 = Self::osc_hz(
            note,
            pb + lfo_osc2_mod,
            o2.semitones,
            o2.cents,
            o2.kbd_track,
        );
        let hz3 = Self::osc_hz(
            note,
            pb + lfo_osc3_mod,
            o3.semitones,
            o3.cents,
            o3.kbd_track,
        );

        let s1 = self.osc1.next(o1.waveform, hz1, sr) * o1.level;
        let s2 = self.osc2.next(o2.waveform, hz2, sr) * o2.level;
        let s3 = self.osc3.next(o3.waveform, hz3, sr) * o3.level;

        let mixed = (s1 + s2 + s3) * (1.0 / 3.0);

        // --- Filter ---
        let keyboard_shift = (note as f32 - 60.0) * patch.filter.keyboard_track * 20.0;
        let cutoff = (patch.filter.cutoff_hz
            + patch.filter.envelope_amount * filter_level
            + filter_env_mod * patch.filter.envelope_amount
            + keyboard_shift)
            .max(20.0);

        self.filter.set_cutoff(cutoff);
        self.filter.set_resonance(patch.filter.resonance);
        let filtered = self.filter.process(mixed, FilterMode::LowPass);

        // --- Amplitude ---
        let out = filtered * amp_level * patch.volume;
        Frame::mono(out)
    }

    fn is_active(&self) -> bool {
        self.amp_env.phase() != AdsrPhase::Idle
    }
}
