use super::{CosmoProcessor, midi_note_to_freq};

#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub struct CosmoTransportState {
    pub tempo_bpm: Option<f32>,
    pub playing: bool,
    pub position_beats: f64,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum CosmoInputEvent {
    NoteOn { note: u8, velocity: f32 },
    NoteOff { note: u8 },
    ControlChange { channel: u8, cc: u8, value: u8 },
    PitchBend { value: f32 },
    Aftertouch { value: f32 },
    PolyAftertouch { note: u8, value: f32 },
    Macro { index: usize, value: f32 },
    Panic,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct CosmoTimedInputEvent {
    pub sample_offset: usize,
    pub event: CosmoInputEvent,
}

pub fn apply_input_event(processor: &mut CosmoProcessor, event: CosmoInputEvent) {
    match event {
        CosmoInputEvent::NoteOn { note, velocity } => {
            if velocity <= 0.0 {
                processor.note_off(note);
            } else {
                processor.note_on(note, midi_note_to_freq(note), velocity);
            }
        }
        CosmoInputEvent::NoteOff { note } => processor.note_off(note),
        CosmoInputEvent::ControlChange { cc, value, .. } => match cc {
            1 => processor.set_mod_wheel(f32::from(value) / 127.0),
            64 => processor.set_sustain(value >= 64),
            120 | 123 => processor.all_notes_off(),
            _ => {}
        },
        CosmoInputEvent::PitchBend { value } => processor.set_pitch_bend(value),
        CosmoInputEvent::Aftertouch { value } => processor.set_aftertouch(value),
        CosmoInputEvent::PolyAftertouch { note, value } => {
            processor.set_poly_aftertouch(note, value);
        }
        CosmoInputEvent::Macro { index, value } => processor.set_macro(index, value),
        CosmoInputEvent::Panic => processor.all_notes_off(),
    }
}

pub fn apply_transport_state(processor: &mut CosmoProcessor, transport: CosmoTransportState) {
    if processor.host_transport_playing && !transport.playing {
        processor.all_notes_off();
    }

    if let Some(tempo_bpm) = transport.tempo_bpm.filter(|tempo| *tempo > 0.0 && tempo.is_finite())
    {
        processor.set_host_transport(tempo_bpm, transport.playing, transport.position_beats);
    } else {
        processor.clear_host_transport();
    }
}

pub fn process_block(
    processor: &mut CosmoProcessor,
    output: &mut [f32],
    events: &[CosmoTimedInputEvent],
    transport: CosmoTransportState,
) {
    apply_transport_state(processor, transport);

    let mut rendered = 0usize;

    for timed_event in events {
        let event_offset = timed_event.sample_offset.min(output.len());
        if event_offset > rendered {
            processor.process(&mut output[rendered..event_offset]);
            rendered = event_offset;
        }
        apply_input_event(processor, timed_event.event);
    }

    if rendered < output.len() {
        processor.process(&mut output[rendered..]);
    }
}
