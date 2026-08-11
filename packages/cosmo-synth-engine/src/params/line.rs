use serde::{Deserialize, Deserializer, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

use super::envelopes::{EnvelopeProgramV1, LineEnvelopeParams, StepEnvData};
use super::synthesis::SynthesisMethod;
use crate::synthesis::pd::default_envelopes::default_line_envelopes;
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

/// Parameters owned by a concrete line synthesis engine.
///
/// The tag is part of the persisted representation so an engine's parameter
/// payload cannot be paired with a different synthesis method by accident.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(tag = "type", content = "params", rename_all = "camelCase")]
pub enum LineEngineParams {
    Pd(PdLineParams),
}

impl LineEngineParams {
    pub fn method(self) -> SynthesisMethod {
        match self {
            Self::Pd(_) => SynthesisMethod::Pd,
        }
    }

    pub fn pd(&self) -> &PdLineParams {
        match self {
            Self::Pd(params) => params,
        }
    }

    pub fn pd_mut(&mut self) -> &mut PdLineParams {
        match self {
            Self::Pd(params) => params,
        }
    }

    pub fn default_for(method: SynthesisMethod) -> Self {
        match method {
            SynthesisMethod::Pd => Self::Pd(PdLineParams::default()),
        }
    }
}

impl Default for LineEngineParams {
    fn default() -> Self {
        Self::default_for(SynthesisMethod::Pd)
    }
}

/// Method-independent line parameters plus the active engine payload.
#[derive(Debug, Clone, Copy, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct LineParams {
    pub envelopes: LineEnvelopeParams,
    pub engine: LineEngineParams,
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
            envelopes: Option<LineEnvelopeParams>,
            #[serde(default)]
            dco_env: Option<StepEnvData>,
            #[serde(default)]
            dcw_env: Option<StepEnvData>,
            #[serde(default)]
            dca_env: Option<StepEnvData>,
            #[serde(default)]
            engine: Option<LineEngineParams>,
            #[serde(default)]
            detune_note: f32,
            #[serde(default)]
            detune_fine: f32,
            #[serde(default)]
            octave: f32,
        }

        let wire = WireLineParams::deserialize(deserializer)?;
        let engine = wire.engine.unwrap_or_default();
        let default_envelopes = match engine.method() {
            SynthesisMethod::Pd => default_line_envelopes(),
        };
        let envelopes = wire.envelopes.unwrap_or_else(|| LineEnvelopeParams {
            pitch: EnvelopeProgramV1::Step(
                wire.dco_env
                    .unwrap_or_else(|| *default_envelopes.pitch.as_step()),
            ),
            timbre: EnvelopeProgramV1::Step(
                wire.dcw_env
                    .unwrap_or_else(|| *default_envelopes.timbre.as_step()),
            ),
            amplitude: EnvelopeProgramV1::Step(
                wire.dca_env
                    .unwrap_or_else(|| *default_envelopes.amplitude.as_step()),
            ),
        });

        Ok(Self {
            envelopes,
            engine,
            detune_note: wire.detune_note,
            detune_fine: wire.detune_fine,
            octave: wire.octave,
        })
    }
}

impl Default for LineParams {
    fn default() -> Self {
        Self::default_for(SynthesisMethod::Pd)
    }
}

impl LineParams {
    pub fn default_for(method: SynthesisMethod) -> Self {
        Self {
            envelopes: match method {
                SynthesisMethod::Pd => default_line_envelopes(),
            },
            engine: LineEngineParams::default_for(method),
            detune_note: 0.0,
            detune_fine: 0.0,
            octave: 0.0,
        }
    }
}
