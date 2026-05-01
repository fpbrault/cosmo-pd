//! Reusable synth runtime primitives for Cosmo synth engines.
//!
//! `purr-synth-core` owns generic engine contracts, MIDI control mapping,
//! modulation plumbing, voice lifecycle helpers, envelope runtimes, and DSP
//! utilities. Synth-specific code owns patch models, render topology, parameter
//! vocabularies, and musical behavior.

#![cfg_attr(not(feature = "std"), no_std)]

extern crate alloc;

pub mod buffer;
pub mod control;
pub mod dsp;
pub mod effects;
pub mod engine;
pub mod envelope;
pub mod event;
pub mod filter;
pub mod lfo;
pub mod midi_mapping;
pub mod mixing;
pub mod modulation;
pub mod noise;
pub mod oscillator;
pub mod runtime;
pub mod telemetry;
pub mod voice;
pub mod voice_allocator;

#[cfg(feature = "std")]
pub mod examples;

pub mod prelude {
    pub use crate::buffer::{DelayLine, RingBuffer};
    pub use crate::control::{ControlDescriptor, ControlEvent};
    pub use crate::dsp::{clamp_unit, lerp, midi_note_to_hz, PanLaw, Phase, Smoother};
    pub use crate::effects::DelayTap;
    pub use crate::engine::{Frame, RenderContext, SynthDefinition, VoiceContext, VoiceDsp};
    pub use crate::envelope::{
        AdsrEnvelope, AdsrParams, AdsrPhase, StepEnvelope, StepEnvelopeStep,
    };
    pub use crate::event::{NoteId, SynthEvent};
    pub use crate::filter::{FilterMode, OnePoleLowPass, StateVariableFilter};
    pub use crate::lfo::{lfo_sample, Lfo, LfoWaveform};
    pub use crate::midi_mapping::{
        ControlChange, MidiControlEvent, MidiControlSource, MidiLearnState, MidiMapping,
        MidiMappingCurve, MidiMappingTable,
    };
    pub use crate::mixing::{
        dry_wet, equal_power_crossfade, gain, normalize_voice_sum, soft_clip, sum_frames,
    };
    pub use crate::modulation::{ModMatrix, ModRoute, ModSourceValues};
    pub use crate::noise::{NoiseGenerator, SampleHold};
    pub use crate::oscillator::{waveform_sample, BasicOscillator, BasicWaveform, Wavetable};
    pub use crate::runtime::{ControllerState, SynthRuntime, VoiceMode};
    pub use crate::telemetry::{LevelMeter, ScopeCapture};
    pub use crate::voice::{VoiceId, VoiceRuntime, VoiceStatus};
    pub use crate::voice_allocator::{
        DefaultVoiceStealer, HighestVoiceStealer, LastVoiceStealer, LowestVoiceStealer,
        VoiceAllocator, VoiceStealingPolicy, VoiceStealingPolicyExt,
    };
}
