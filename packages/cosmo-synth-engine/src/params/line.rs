use serde::{Deserialize, Deserializer, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::envelopes::{EnvelopeProgramV1, LineEnvelopeParams, StepEnvData};
use super::synthesis::SynthesisMethod;
use crate::synthesis::pd::parameters::PdLineParams;

/// Line select
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub enum LineSelect {
    #[serde(rename = "L1")]
    L1,
    #[serde(rename = "L2")]
    L2,
    #[serde(rename = "L1+L1'")]
    L1PlusL1Prime,
    #[serde(rename = "L1+L2'")]
    #[default]
    L1PlusL2Prime,
}

/// Modulation mode
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum ModMode {
    #[default]
    Normal,
    Ring,
    Noise,
}

/// Polyphony mode
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum PolyMode {
    #[default]
    #[serde(rename = "poly8")]
    Poly8,
    Mono,
}

pub use crate::synthesis::pd::parameters::{
    AlgoControlId, AlgoControlSlots, AlgoControlValueV1, MAX_ALGO_CONTROLS,
};

/// Method-independent line parameters plus the active engine payload.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct LineParams {
    #[serde(default)]
    pub synthesis_method: SynthesisMethod,
    pub envelopes: LineEnvelopeParams,
    /// Parameters owned by the selected line synthesis engine.
    ///
    /// The field remains named `pd` internally while the wire format exposes
    /// it as `engine`, keeping the runtime boundary explicit without making
    /// the core line schema a flat list of PD controls.
    #[serde(rename = "engine")]
    pub pd: PdLineParams,
    #[serde(default)]
    pub detune_note: f32,
    #[serde(default)]
    pub detune_fine: f32,
    pub octave: f32,
}

impl<'de> Deserialize<'de> for LineParams {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        #[derive(Deserialize)]
        #[serde(rename_all = "camelCase")]
        struct WireLineParams {
            #[serde(default)]
            synthesis_method: SynthesisMethod,
            #[serde(default)]
            envelopes: Option<LineEnvelopeParams>,
            #[serde(default)]
            dco_env: Option<StepEnvData>,
            #[serde(default)]
            dcw_env: Option<StepEnvData>,
            #[serde(default)]
            dca_env: Option<StepEnvData>,
            #[serde(default)]
            engine: Option<PdLineParams>,
            #[serde(flatten)]
            pd: Option<PdLineParams>,
            #[serde(default)]
            detune_note: f32,
            #[serde(default)]
            detune_fine: f32,
            #[serde(default)]
            octave: f32,
        }

        let wire = WireLineParams::deserialize(deserializer)?;
        let envelopes = wire.envelopes.unwrap_or_else(|| LineEnvelopeParams {
            pitch: EnvelopeProgramV1::Step(wire.dco_env.unwrap_or_default()),
            timbre: EnvelopeProgramV1::Step(wire.dcw_env.unwrap_or_default()),
            amplitude: EnvelopeProgramV1::Step(wire.dca_env.unwrap_or_default()),
        });

        Ok(Self {
            synthesis_method: wire.synthesis_method,
            envelopes,
            pd: wire.engine.unwrap_or_else(|| wire.pd.unwrap_or_default()),
            detune_note: wire.detune_note,
            detune_fine: wire.detune_fine,
            octave: wire.octave,
        })
    }
}

impl Default for LineParams {
    fn default() -> Self {
        Self {
            synthesis_method: SynthesisMethod::default(),
            envelopes: LineEnvelopeParams::default(),
            pd: PdLineParams::default(),
            detune_note: 0.0,
            detune_fine: 0.0,
            octave: 0.0,
        }
    }
}
