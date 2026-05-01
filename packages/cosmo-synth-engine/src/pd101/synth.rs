use purr_synth_core::engine::SynthDefinition;

use crate::params::{ModDestination, ModSource, SynthParams};

use super::telemetry::Pd101Telemetry;

/// Patch values consumed by PD-101 voices.
///
/// `params` is persistent state; LFO/random outputs are per-frame values set
/// by `CosmoProcessor` before calling into `SynthRuntime::render_frame`.
#[derive(Debug, Clone, Default)]
pub struct Pd101Patch {
    /// Static synth parameters (envelope shapes, oscillator config, etc.).
    pub params: SynthParams,
    /// Pre-computed LFO 1 output for the current frame [-1, 1].
    pub lfo1_out: f32,
    /// Pre-computed LFO 2 output for the current frame [-1, 1].
    pub lfo2_out: f32,
    /// Pre-computed random hold value for the current frame [-1, 1].
    pub random_out: f32,
}

/// Framework boundary marker for the PD-101 phase distortion synthesizer.
///
/// This is an uninhabited marker type — instantiate `Pd101Voice` for the
/// per-voice DSP, and `CosmoProcessor` for the overall engine runtime.
pub enum Pd101Synth {}

impl SynthDefinition for Pd101Synth {
    /// Full patch state bundled with per-frame controller values.
    type Patch = Pd101Patch;
    /// Modulation sources mirrored from `crate::params::ModSource`.
    type ModSource = ModSource;
    /// Modulation destinations mirrored from `crate::params::ModDestination`.
    type ModTarget = ModDestination;
    /// Runtime telemetry: output level meter and scope capture.
    type Telemetry = Pd101Telemetry;
}
