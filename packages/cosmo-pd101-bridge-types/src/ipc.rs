use serde::{Deserialize, Serialize};

use crate::editor::EditorState;
use crate::session::PresetSession;

#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Tagged IPC request envelope deserialized from `{ method, payload }`.
///
/// Wire format (adjacently tagged by serde):
/// - Unit variant: `{ "method": "getParams" }`
/// - Payload variant: `{ "method": "setPresetSession", "payload": { ... } }`
#[derive(Serialize, Deserialize, Clone, Debug)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(tag = "method", content = "payload")]
pub enum PluginIpcRequest {
    // ── Session ──
    #[serde(rename = "getParams")]
    GetParams,
    #[serde(rename = "getPresetSession")]
    GetPresetSession,
    #[serde(rename = "setPresetSession")]
    SetPresetSession(PresetSession),
    #[serde(rename = "loadPreset")]
    LoadPreset(LoadPresetPayload),
    // ── Editor ──
    #[serde(rename = "getEditorState")]
    GetEditorState,
    #[serde(rename = "setEditorState")]
    SetEditorState(EditorState),
    // ── MIDI learn ──
    #[serde(rename = "getMidiLearnState")]
    GetMidiLearnState,
    // ── Runtime ──
    #[serde(rename = "getScopeData")]
    GetScopeData,
    #[serde(rename = "getTransportInfo")]
    GetTransportInfo,
}

/// Outer envelope wrapping `id` + the tagged IPC request.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PluginIpcEnvelope {
    pub id: u32,
    #[serde(flatten)]
    pub request: PluginIpcRequest,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct LoadPresetPayload {
    pub preset_id: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn unit_variant_omits_payload_key() {
        let env = PluginIpcEnvelope {
            id: 5,
            request: PluginIpcRequest::GetParams,
        };
        let json = serde_json::to_string(&env).unwrap();
        assert!(
            !json.contains("payload"),
            "Unit variant should not have payload key: {json}"
        );
        assert!(
            json.contains("\"method\":\"getParams\""),
            "Should contain method tag: {json}"
        );
    }

    #[test]
    fn payload_variant_includes_payload_key() {
        let session = PresetSession {
            active_preset_name_base: "Test".into(),
            loaded_preset_id: Some("abc".into()),
            is_dirty: true,
        };
        let env = PluginIpcEnvelope {
            id: 6,
            request: PluginIpcRequest::SetPresetSession(session),
        };
        let json = serde_json::to_string(&env).unwrap();
        assert!(
            json.contains("\"payload\""),
            "Payload variant should have payload key: {json}"
        );
        assert!(
            json.contains("activePresetNameBase"),
            "Should contain session fields: {json}"
        );
    }

    #[test]
    fn deserialize_unit_variant() {
        let input = r#"{"id":5,"method":"getParams"}"#;
        let env: PluginIpcEnvelope = serde_json::from_str(input).unwrap();
        assert_eq!(env.id, 5);
        assert!(matches!(env.request, PluginIpcRequest::GetParams));
    }

    #[test]
    fn deserialize_payload_variant() {
        let input = r#"{"id":6,"method":"setPresetSession","payload":{"activePresetNameBase":"Test","loadedPresetId":"abc","isDirty":true}}"#;
        let env: PluginIpcEnvelope = serde_json::from_str(input).unwrap();
        assert_eq!(env.id, 6);
        match env.request {
            PluginIpcRequest::SetPresetSession(s) => {
                assert_eq!(s.active_preset_name_base, "Test");
                assert_eq!(s.loaded_preset_id, Some("abc".to_string()));
                assert!(s.is_dirty);
            }
            _ => panic!("Expected SetPresetSession"),
        }
    }

    #[test]
    fn deserialize_load_preset() {
        let input = r#"{"id":7,"method":"loadPreset","payload":{"presetId":"xyz"}}"#;
        let env: PluginIpcEnvelope = serde_json::from_str(input).unwrap();
        assert_eq!(env.id, 7);
        match env.request {
            PluginIpcRequest::LoadPreset(p) => {
                assert_eq!(p.preset_id, "xyz");
            }
            _ => panic!("Expected LoadPreset"),
        }
    }

    #[test]
    fn roundtrip_all_variants() {
        let cases: Vec<PluginIpcEnvelope> = vec![
            PluginIpcEnvelope {
                id: 1,
                request: PluginIpcRequest::GetParams,
            },
            PluginIpcEnvelope {
                id: 2,
                request: PluginIpcRequest::SetPresetSession(PresetSession {
                    active_preset_name_base: "A".into(),
                    loaded_preset_id: None,
                    is_dirty: false,
                }),
            },
            PluginIpcEnvelope {
                id: 3,
                request: PluginIpcRequest::LoadPreset(LoadPresetPayload {
                    preset_id: "b".into(),
                }),
            },
            PluginIpcEnvelope {
                id: 4,
                request: PluginIpcRequest::GetPresetSession,
            },
            PluginIpcEnvelope {
                id: 5,
                request: PluginIpcRequest::GetEditorState,
            },
            PluginIpcEnvelope {
                id: 6,
                request: PluginIpcRequest::SetEditorState(EditorState::default()),
            },
            PluginIpcEnvelope {
                id: 7,
                request: PluginIpcRequest::GetMidiLearnState,
            },
            PluginIpcEnvelope {
                id: 8,
                request: PluginIpcRequest::GetScopeData,
            },
            PluginIpcEnvelope {
                id: 9,
                request: PluginIpcRequest::GetTransportInfo,
            },
        ];
        for env in cases {
            let json = serde_json::to_string(&env).unwrap();
            let back: PluginIpcEnvelope = serde_json::from_str(&json).unwrap();
            match (&env.request, &back.request) {
                (PluginIpcRequest::GetParams, PluginIpcRequest::GetParams) => {}
                (PluginIpcRequest::GetPresetSession, PluginIpcRequest::GetPresetSession) => {}
                (PluginIpcRequest::SetPresetSession(a), PluginIpcRequest::SetPresetSession(b)) => {
                    assert_eq!(a.active_preset_name_base, b.active_preset_name_base);
                }
                (PluginIpcRequest::LoadPreset(a), PluginIpcRequest::LoadPreset(b)) => {
                    assert_eq!(a.preset_id, b.preset_id);
                }
                (PluginIpcRequest::GetEditorState, PluginIpcRequest::GetEditorState) => {}
                (PluginIpcRequest::SetEditorState(_), PluginIpcRequest::SetEditorState(_)) => {}
                (PluginIpcRequest::GetMidiLearnState, PluginIpcRequest::GetMidiLearnState) => {}
                (PluginIpcRequest::GetScopeData, PluginIpcRequest::GetScopeData) => {}
                (PluginIpcRequest::GetTransportInfo, PluginIpcRequest::GetTransportInfo) => {}
                _ => panic!("Variant mismatch after roundtrip"),
            }
        }
    }
}
