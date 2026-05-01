//! Minimoog example synth validation harness.
//!
//! Renders 1 second of audio (at 44 100 Hz) for a C4 note and prints peak
//! amplitude to stdout. This proves the framework compiles and produces
//! non-silent output for a subtractive synth architecture.
//!
//! Run with:
//!   cargo run -p purr-synth-core --example minimoog_render --features std

use purr_synth_core::event::SynthEvent;
use purr_synth_core::examples::minimoog::{MiniPatch, MiniSynth, MiniVoice};
use purr_synth_core::runtime::{SynthRuntime, VoiceMode};

fn main() {
    const SAMPLE_RATE: f32 = 44_100.0;
    const NOTE_ON_FRAME: usize = 0;
    const NOTE_OFF_FRAME: usize = (SAMPLE_RATE * 0.6) as usize;
    const TOTAL_FRAMES: usize = SAMPLE_RATE as usize;

    let voices: Vec<MiniVoice> = (0..1).map(|_| MiniVoice::new(SAMPLE_RATE)).collect();
    let mut engine: SynthRuntime<MiniSynth, MiniVoice> =
        SynthRuntime::new(MiniPatch::default(), voices, SAMPLE_RATE);
    engine.set_voice_mode(VoiceMode::Monophonic { legato: true });

    let mut peak: f32 = 0.0;
    let mut silent_frames = 0usize;

    for i in 0..TOTAL_FRAMES {
        if i == NOTE_ON_FRAME {
            engine.handle_event(SynthEvent::NoteOn(purr_synth_core::event::NoteId::new(
                60, 0.787,
            )));
        }
        if i == NOTE_OFF_FRAME {
            engine.handle_event(SynthEvent::NoteOff { midi_note: 60 });
        }

        let frame = engine.render_frame();
        let sample = frame.left.abs().max(frame.right.abs());
        if sample == 0.0 {
            silent_frames += 1;
        }
        if sample > peak {
            peak = sample;
        }
    }

    println!("Minimoog render complete.");
    println!("  Peak amplitude : {:.6}", peak);
    println!("  Silent frames  : {}/{}", silent_frames, TOTAL_FRAMES);

    assert!(peak > 0.0, "expected non-silent output");
}
