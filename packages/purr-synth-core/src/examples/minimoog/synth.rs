use crate::engine::SynthDefinition;

use super::patch::{MiniModSource, MiniModTarget, MiniPatch};

/// Telemetry placeholder for the Minimoog example (empty for now).
#[derive(Debug, Default, Clone)]
pub struct MiniTelemetry {}

/// Framework glue type for the Minimoog example synth.
///
/// Implements [`SynthDefinition`] to wire the patch, modulation identifiers,
/// and telemetry types into the reusable [`crate::runtime::SynthRuntime`].
pub struct MiniSynth;

impl SynthDefinition for MiniSynth {
    type Patch = MiniPatch;
    type ModSource = MiniModSource;
    type ModTarget = MiniModTarget;
    type Telemetry = MiniTelemetry;
}
