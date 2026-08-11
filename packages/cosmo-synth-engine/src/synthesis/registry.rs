use serde::Serialize;
#[cfg(feature = "specta-bindings")]
use specta::Type;

use crate::params::SynthesisMethod;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct EngineCapabilitiesV1 {
    pub oscillator_count: u8,
    pub envelope_count: u8,
    pub has_voice_filter: bool,
    pub has_internal_tail: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum EnvelopeTargetRole {
    Pitch,
    Warp,
    Tone,
    Amplitude,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct EnvelopeTargetDefinitionV1 {
    pub slot: u8,
    pub role: EnvelopeTargetRole,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct EngineDefinitionV1 {
    pub method: SynthesisMethod,
    pub capabilities: EngineCapabilitiesV1,
    pub envelope_targets: [EnvelopeTargetDefinitionV1; 3],
}

pub const ENGINE_DEFINITIONS_V1: [EngineDefinitionV1; 1] = [EngineDefinitionV1 {
    method: SynthesisMethod::Pd,
    capabilities: EngineCapabilitiesV1 {
        oscillator_count: 1,
        envelope_count: 3,
        has_voice_filter: false,
        has_internal_tail: true,
    },
    envelope_targets: [
        EnvelopeTargetDefinitionV1 {
            slot: 0,
            role: EnvelopeTargetRole::Pitch,
        },
        EnvelopeTargetDefinitionV1 {
            slot: 1,
            role: EnvelopeTargetRole::Warp,
        },
        EnvelopeTargetDefinitionV1 {
            slot: 2,
            role: EnvelopeTargetRole::Amplitude,
        },
    ],
}];

pub fn engine_definitions_v1() -> &'static [EngineDefinitionV1] {
    &ENGINE_DEFINITIONS_V1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn registry_has_unique_methods() {
        assert_eq!(ENGINE_DEFINITIONS_V1[0].method, SynthesisMethod::Pd);

        for (index, definition) in ENGINE_DEFINITIONS_V1.iter().enumerate() {
            for other in ENGINE_DEFINITIONS_V1.iter().skip(index + 1) {
                assert_ne!(definition.method, other.method);
            }
        }
    }
}
