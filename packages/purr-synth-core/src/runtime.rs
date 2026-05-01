extern crate alloc;

use alloc::vec;
use alloc::vec::Vec;

use crate::engine::{Frame, RenderContext, SynthDefinition, VoiceContext, VoiceDsp};
use crate::event::{NoteId, SynthEvent};
use crate::modulation::ModMatrix;
use crate::voice::{VoiceRuntime, VoiceStatus};
use crate::voice_allocator::{DefaultVoiceStealer, VoiceAllocator, VoiceStealingPolicy};

/// Voice scheduling mode for the reusable runtime.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum VoiceMode {
    Polyphonic,
    Monophonic { legato: bool },
}

impl Default for VoiceMode {
    fn default() -> Self {
        Self::Polyphonic
    }
}

/// Reusable owning runtime for event handling, voice allocation, and frame mixing.
#[derive(Debug, Clone)]
pub struct SynthRuntime<T, V, P = DefaultVoiceStealer>
where
    T: SynthDefinition,
{
    patch: T::Patch,
    voices: Vec<V>,
    voice_runtimes: Vec<VoiceRuntime>,
    modulation: ModMatrix<T::ModSource, T::ModTarget>,
    allocator: VoiceAllocator<P>,
    sample_rate: f32,
    sample_clock: u64,
    sustain_down: bool,
    voice_mode: VoiceMode,
    mono_note_stack: Vec<NoteId>,
}

impl<T, V> SynthRuntime<T, V, DefaultVoiceStealer>
where
    T: SynthDefinition,
{
    pub fn new(patch: T::Patch, voices: Vec<V>, sample_rate: f32) -> Self {
        Self::with_allocator(patch, voices, sample_rate, VoiceAllocator::default())
    }
}

impl<T, V, P> SynthRuntime<T, V, P>
where
    T: SynthDefinition,
    P: VoiceStealingPolicy,
{
    pub fn with_allocator(
        patch: T::Patch,
        voices: Vec<V>,
        sample_rate: f32,
        allocator: VoiceAllocator<P>,
    ) -> Self {
        let voice_count = voices.len();

        Self {
            patch,
            voices,
            voice_runtimes: vec![VoiceRuntime::default(); voice_count],
            modulation: ModMatrix::new(),
            allocator,
            sample_rate: sample_rate.max(1.0),
            sample_clock: 0,
            sustain_down: false,
            voice_mode: VoiceMode::Polyphonic,
            mono_note_stack: Vec::new(),
        }
    }

    pub fn patch(&self) -> &T::Patch {
        &self.patch
    }

    pub fn patch_mut(&mut self) -> &mut T::Patch {
        &mut self.patch
    }

    pub fn voices(&self) -> &[V] {
        &self.voices
    }

    pub fn voices_mut(&mut self) -> &mut [V] {
        &mut self.voices
    }

    pub fn voice_runtimes(&self) -> &[VoiceRuntime] {
        &self.voice_runtimes
    }

    pub fn modulation(&self) -> &ModMatrix<T::ModSource, T::ModTarget> {
        &self.modulation
    }

    pub fn modulation_mut(&mut self) -> &mut ModMatrix<T::ModSource, T::ModTarget> {
        &mut self.modulation
    }

    pub fn sample_rate(&self) -> f32 {
        self.sample_rate
    }

    pub fn set_sample_rate(&mut self, sample_rate: f32) {
        self.sample_rate = sample_rate.max(1.0);
    }

    pub fn sample_clock(&self) -> u64 {
        self.sample_clock
    }

    pub fn voice_mode(&self) -> VoiceMode {
        self.voice_mode
    }

    pub fn set_voice_mode(&mut self, voice_mode: VoiceMode) {
        self.voice_mode = voice_mode;
        self.mono_note_stack.clear();
    }

    pub fn sustain_down(&self) -> bool {
        self.sustain_down
    }
}

impl<T, V, P> SynthRuntime<T, V, P>
where
    T: SynthDefinition,
    V: VoiceDsp<T>,
    P: VoiceStealingPolicy,
{
    pub fn handle_event(&mut self, event: SynthEvent) {
        match event {
            SynthEvent::NoteOn(note) => self.note_on(note),
            SynthEvent::NoteOff { midi_note } => self.note_off(midi_note),
            SynthEvent::Sustain(down) => self.set_sustain(down),
            SynthEvent::AllNotesOff => self.all_notes_off(),
            SynthEvent::PitchBend(_)
            | SynthEvent::ModWheel(_)
            | SynthEvent::Aftertouch(_)
            | SynthEvent::MidiControl(_) => {}
        }
    }

    pub fn note_on(&mut self, note: NoteId) {
        match self.voice_mode {
            VoiceMode::Polyphonic => self.note_on_polyphonic(note),
            VoiceMode::Monophonic { legato } => self.note_on_monophonic(note, legato),
        }
    }

    pub fn note_off(&mut self, midi_note: u8) {
        match self.voice_mode {
            VoiceMode::Polyphonic => self.note_off_polyphonic(midi_note),
            VoiceMode::Monophonic { legato } => self.note_off_monophonic(midi_note, legato),
        }
    }

    pub fn set_sustain(&mut self, down: bool) {
        if self.sustain_down == down {
            return;
        }

        self.sustain_down = down;

        if down {
            return;
        }

        let context = VoiceContext {
            sample_rate: self.sample_rate,
            patch: &self.patch,
        };
        let sample_clock = self.sample_clock;
        for (runtime, voice) in self.voice_runtimes.iter_mut().zip(self.voices.iter_mut()) {
            if runtime.status == VoiceStatus::Sustained {
                runtime.release_sustain(sample_clock);
                voice.note_off(&context);
            }
        }
    }

    pub fn all_notes_off(&mut self) {
        self.mono_note_stack.clear();
        let context = VoiceContext {
            sample_rate: self.sample_rate,
            patch: &self.patch,
        };
        let sample_clock = self.sample_clock;

        for (runtime, voice) in self.voice_runtimes.iter_mut().zip(self.voices.iter_mut()) {
            if runtime.is_active() {
                runtime.note_off(sample_clock);
                voice.note_off(&context);
            }
        }
    }

    pub fn render_frame(&mut self) -> Frame {
        let mut frame = Frame::SILENCE;

        for index in 0..self.voices.len() {
            if !self.voice_runtimes[index].is_active() {
                continue;
            }

            let mut context = RenderContext {
                sample_rate: self.sample_rate,
                patch: &self.patch,
                modulation: &self.modulation,
                telemetry: None,
            };
            frame = frame.add(self.voices[index].render(&mut context));

            if !self.voices[index].is_active() {
                self.voice_runtimes[index].clear();
            }
        }

        self.sample_clock = self.sample_clock.saturating_add(1);
        frame
    }

    fn note_on_polyphonic(&mut self, note: NoteId) {
        let Some(voice_id) = self.allocator.allocate(&self.voice_runtimes) else {
            return;
        };
        let index = voice_id.0;
        let context = VoiceContext {
            sample_rate: self.sample_rate,
            patch: &self.patch,
        };

        self.voice_runtimes[index].note_on(note, self.sample_clock);
        self.voices[index].note_on(note, &context);
    }

    fn note_off_polyphonic(&mut self, midi_note: u8) {
        let context = VoiceContext {
            sample_rate: self.sample_rate,
            patch: &self.patch,
        };
        let sample_clock = self.sample_clock;

        for (runtime, voice) in self.voice_runtimes.iter_mut().zip(self.voices.iter_mut()) {
            if runtime.note.is_some_and(|note| note.midi_note == midi_note) {
                if self.sustain_down {
                    runtime.hold_with_sustain();
                } else {
                    runtime.note_off(sample_clock);
                    voice.note_off(&context);
                }
            }
        }
    }

    fn note_on_monophonic(&mut self, note: NoteId, legato: bool) {
        if self.voices.is_empty() {
            return;
        }

        let had_held_note = !self.mono_note_stack.is_empty();
        self.mono_note_stack
            .retain(|stacked_note| stacked_note.midi_note != note.midi_note);
        self.mono_note_stack.push(note);

        let was_active = self.voice_runtimes[0].is_active();
        let context = VoiceContext {
            sample_rate: self.sample_rate,
            patch: &self.patch,
        };
        self.voice_runtimes[0].note_on(note, self.sample_clock);

        if legato && was_active && had_held_note {
            self.voices[0].note_change(note, &context);
        } else {
            self.voices[0].note_on(note, &context);
        }
    }

    fn note_off_monophonic(&mut self, midi_note: u8, legato: bool) {
        if self.voices.is_empty() {
            return;
        }

        let released_current = self
            .mono_note_stack
            .last()
            .is_some_and(|note| note.midi_note == midi_note);
        self.mono_note_stack
            .retain(|note| note.midi_note != midi_note);

        if released_current {
            if let Some(note) = self.mono_note_stack.last().copied() {
                let context = VoiceContext {
                    sample_rate: self.sample_rate,
                    patch: &self.patch,
                };
                self.voice_runtimes[0].note_on(note, self.sample_clock);
                if legato {
                    self.voices[0].note_change(note, &context);
                } else {
                    self.voices[0].note_on(note, &context);
                }
                return;
            }

            if self.sustain_down {
                self.voice_runtimes[0].hold_with_sustain();
            } else {
                let context = VoiceContext {
                    sample_rate: self.sample_rate,
                    patch: &self.patch,
                };
                self.voice_runtimes[0].note_off(self.sample_clock);
                self.voices[0].note_off(&context);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    enum Source {}

    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    enum Target {}

    struct TestSynth;

    impl SynthDefinition for TestSynth {
        type Patch = ();
        type ModSource = Source;
        type ModTarget = Target;
        type Telemetry = ();
    }

    #[derive(Debug, Default, Clone, PartialEq)]
    struct TestVoice {
        note: Option<NoteId>,
        active: bool,
        note_on_count: u32,
        note_change_count: u32,
        note_off_count: u32,
    }

    impl VoiceDsp<TestSynth> for TestVoice {
        fn note_on(&mut self, note: NoteId, _context: &VoiceContext<TestSynth>) {
            self.note = Some(note);
            self.active = true;
            self.note_on_count += 1;
        }

        fn note_change(&mut self, note: NoteId, _context: &VoiceContext<TestSynth>) {
            self.note = Some(note);
            self.note_change_count += 1;
        }

        fn note_off(&mut self, _context: &VoiceContext<TestSynth>) {
            self.active = false;
            self.note_off_count += 1;
        }

        fn render(&mut self, _context: &mut RenderContext<TestSynth>) -> Frame {
            Frame::mono(self.note.map_or(0.0, |note| note.midi_note as f32))
        }

        fn is_active(&self) -> bool {
            self.active
        }
    }

    #[test]
    fn polyphonic_runtime_allocates_and_mixes_voices() {
        let mut runtime = SynthRuntime::<TestSynth, TestVoice>::new(
            (),
            vec![TestVoice::default(), TestVoice::default()],
            1_000.0,
        );

        runtime.note_on(NoteId::new(60, 1.0));
        runtime.note_on(NoteId::new(64, 1.0));

        let frame = runtime.render_frame();

        assert_eq!(frame, Frame::mono(124.0));
        assert_eq!(runtime.sample_clock(), 1);
    }

    #[test]
    fn sustain_holds_note_off_until_pedal_releases() {
        let mut runtime =
            SynthRuntime::<TestSynth, TestVoice>::new((), vec![TestVoice::default()], 1_000.0);

        runtime.note_on(NoteId::new(60, 1.0));
        runtime.set_sustain(true);
        runtime.note_off(60);

        assert_eq!(runtime.voice_runtimes()[0].status, VoiceStatus::Sustained);
        assert_eq!(runtime.voices()[0].note_off_count, 0);

        runtime.set_sustain(false);

        assert_eq!(runtime.voice_runtimes()[0].status, VoiceStatus::Releasing);
        assert_eq!(runtime.voices()[0].note_off_count, 1);
    }

    #[test]
    fn monophonic_legato_uses_note_change_for_held_voice() {
        let mut runtime = SynthRuntime::<TestSynth, TestVoice>::new(
            (),
            vec![TestVoice::default(), TestVoice::default()],
            1_000.0,
        );
        runtime.set_voice_mode(VoiceMode::Monophonic { legato: true });

        runtime.note_on(NoteId::new(60, 1.0));
        runtime.note_on(NoteId::new(64, 1.0));
        runtime.note_off(64);

        assert_eq!(runtime.voices()[0].note_on_count, 1);
        assert_eq!(runtime.voices()[0].note_change_count, 2);
        assert_eq!(runtime.voices()[0].note, Some(NoteId::new(60, 1.0)));
        assert!(!runtime.voice_runtimes()[1].is_active());
    }

    #[test]
    fn monophonic_new_note_after_release_retriggers_note_on() {
        let mut runtime =
            SynthRuntime::<TestSynth, TestVoice>::new((), vec![TestVoice::default()], 1_000.0);
        runtime.set_voice_mode(VoiceMode::Monophonic { legato: true });

        runtime.note_on(NoteId::new(60, 1.0));
        runtime.note_off(60);
        runtime.voice_runtimes[0].status = VoiceStatus::Releasing;
        runtime.voices[0].active = true;
        runtime.note_on(NoteId::new(64, 1.0));

        assert_eq!(runtime.voices()[0].note_on_count, 2);
        assert_eq!(runtime.voices()[0].note_change_count, 0);
        assert_eq!(runtime.voices()[0].note, Some(NoteId::new(64, 1.0)));
    }
}
