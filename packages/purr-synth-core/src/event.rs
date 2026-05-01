use crate::midi_mapping::MidiControlEvent;

/// A note identity used by reusable runtime code.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct NoteId {
    pub midi_note: u8,
    pub velocity: f32,
}

impl NoteId {
    pub fn new(midi_note: u8, velocity: f32) -> Self {
        Self {
            midi_note,
            velocity: velocity.clamp(0.0, 1.0),
        }
    }
}

/// Host or MIDI events understood by the generic runtime layer.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SynthEvent {
    NoteOn(NoteId),
    NoteOff { midi_note: u8 },
    Sustain(bool),
    PitchBend(f32),
    ModWheel(f32),
    Aftertouch(f32),
    MidiControl(MidiControlEvent),
    AllNotesOff,
}

impl SynthEvent {
    pub fn normalized_value(value: f32) -> f32 {
        value.clamp(0.0, 1.0)
    }
}
