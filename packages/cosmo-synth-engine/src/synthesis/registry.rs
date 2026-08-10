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
pub struct EngineDefinitionV1 {
    pub id: &'static str,
    pub name: &'static str,
    pub method: SynthesisMethod,
    pub primary_page_label: &'static str,
    pub secondary_page_label: &'static str,
    pub capabilities: EngineCapabilitiesV1,
}

pub const ENGINE_DEFINITIONS_V1: [EngineDefinitionV1; 1] = [EngineDefinitionV1 {
    id: "pd",
    name: "PD / Warp",
    method: SynthesisMethod::Pd,
    primary_page_label: "WAVE FORM",
    secondary_page_label: "ENV",
    capabilities: EngineCapabilitiesV1 {
        oscillator_count: 1,
        envelope_count: 3,
        has_voice_filter: false,
        has_internal_tail: true,
    },
}];

pub fn engine_definitions_v1() -> &'static [EngineDefinitionV1] {
    &ENGINE_DEFINITIONS_V1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn registry_has_unique_stable_ids_and_methods() {
        assert_eq!(ENGINE_DEFINITIONS_V1[0].id, "pd");
        assert_eq!(ENGINE_DEFINITIONS_V1[0].method, SynthesisMethod::Pd);

        for (index, definition) in ENGINE_DEFINITIONS_V1.iter().enumerate() {
            assert!(!definition.id.is_empty());
            assert!(!definition.name.is_empty());
            assert!(!definition.primary_page_label.is_empty());
            assert!(!definition.secondary_page_label.is_empty());
            for other in ENGINE_DEFINITIONS_V1.iter().skip(index + 1) {
                assert_ne!(definition.id, other.id);
                assert_ne!(definition.method, other.method);
            }
        }
    }
}
