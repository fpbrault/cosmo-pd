//! Minimoog-style example synth.
//!
//! This module demonstrates how to implement a complete subtractive synth using
//! the `purr-synth-core` framework primitives. It is intentionally simple but
//! complete enough to validate the framework API with a synthesis architecture
//! that is materially different from PD-101.
//!
//! # Signal flow
//!
//! ```text
//! Osc 1 ─┐
//! Osc 2 ─┼─ Mixer ─► SVF (low-pass) ─► Amp env ─► Out
//! Osc 3 ─┘              ▲                  ▲
//!                    Filter env           Amp env
//!                        ▲                  ▲
//!                       LFO               LFO
//! ```
//!
//! # Example
//!
//! ```rust
//! use purr_synth_core::examples::minimoog::{MiniSynth, MiniVoice, MiniPatch};
//! use purr_synth_core::runtime::{SynthRuntime, VoiceMode};
//! use purr_synth_core::event::SynthEvent;
//!
//! let voices: Vec<MiniVoice> = (0..1).map(|_| MiniVoice::new(44_100.0)).collect();
//! let mut engine: SynthRuntime<MiniSynth, MiniVoice> =
//!     SynthRuntime::new(MiniPatch::default(), voices, 44_100.0);
//! engine.set_voice_mode(VoiceMode::Monophonic { legato: true });
//!
//! engine.handle_event(SynthEvent::NoteOn(purr_synth_core::event::NoteId::new(60, 1.0)));
//! let frame = engine.render_frame();
//! assert!(frame.left != 0.0 || frame.right != 0.0);
//! ```

pub mod patch;
pub mod synth;
pub mod voice;

pub use patch::MiniPatch;
pub use synth::{MiniSynth, MiniTelemetry};
pub use voice::MiniVoice;
