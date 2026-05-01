use crate::event::NoteId;
use crate::modulation::ModMatrix;

/// A stereo audio frame.
#[derive(Debug, Default, Clone, Copy, PartialEq)]
pub struct Frame {
    pub left: f32,
    pub right: f32,
}

impl Frame {
    pub const SILENCE: Self = Self {
        left: 0.0,
        right: 0.0,
    };

    pub fn mono(sample: f32) -> Self {
        Self {
            left: sample,
            right: sample,
        }
    }

    pub fn add(self, other: Self) -> Self {
        Self {
            left: self.left + other.left,
            right: self.right + other.right,
        }
    }
}

/// The synth-specific type boundary consumed by reusable framework code.
pub trait SynthDefinition {
    type Patch;
    type ModSource: Copy + Eq;
    type ModTarget: Copy + Eq;
    type Telemetry;
}

/// Immutable context passed to voice lifecycle operations.
pub struct VoiceContext<'a, T: SynthDefinition> {
    pub sample_rate: f32,
    pub patch: &'a T::Patch,
}

/// Render context passed to synth-specific voice DSP.
pub struct RenderContext<'a, T: SynthDefinition> {
    pub sample_rate: f32,
    pub patch: &'a T::Patch,
    pub pitch_bend: f32,
    pub mod_wheel: f32,
    pub aftertouch: f32,
    pub modulation: &'a ModMatrix<T::ModSource, T::ModTarget>,
    pub telemetry: Option<&'a mut T::Telemetry>,
}

/// Per-voice DSP implementation supplied by each synth.
pub trait VoiceDsp<T: SynthDefinition> {
    fn note_on(&mut self, note: NoteId, context: &VoiceContext<T>);

    fn note_change(&mut self, note: NoteId, context: &VoiceContext<T>) {
        self.note_on(note, context);
    }

    fn note_off(&mut self, context: &VoiceContext<T>);

    fn render(&mut self, context: &mut RenderContext<T>) -> Frame;

    fn is_active(&self) -> bool;

    /// Restore full DSP state from a snapshot taken at an earlier point.
    /// Used by monophonic note-stack restore to resume a previous note without
    /// re-triggering envelopes. Default implementation is a no-op.
    fn restore_snapshot(&mut self, snapshot: &Self) {
        let _ = snapshot;
    }
}
