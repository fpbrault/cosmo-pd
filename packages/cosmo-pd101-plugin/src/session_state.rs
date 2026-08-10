pub use cosmo_pd101_bridge_types::{EditorState, MidiLearnBinding, MidiLearnState, PresetSession};

use cosmo_synth_engine::params::SynthParams;
use serde::{Deserialize, Serialize};

/// DAW-serializable session state.
/// Written by `save_state()` and read by `load_state()`.
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PluginSessionState {
    pub synth_params: SynthParams,
    pub preset_session: PresetSession,
    /// UI editor state (tab selections, scope settings, keyboard prefs, etc.)
    #[serde(default)]
    pub editor_state: Option<EditorState>,
}

pub fn default_midi_bindings() -> Vec<MidiLearnBinding> {
    vec![
        MidiLearnBinding {
            param_key: "macro1".into(),
            channel: 0,
            cc: 8,
        },
        MidiLearnBinding {
            param_key: "macro2".into(),
            channel: 0,
            cc: 41,
        },
        MidiLearnBinding {
            param_key: "macro3".into(),
            channel: 0,
            cc: 42,
        },
        MidiLearnBinding {
            param_key: "macro4".into(),
            channel: 0,
            cc: 43,
        },
    ]
}

/// 3-tier fallback deserialization for backward-compatible `load_state`.
///
/// | Tier | Format | Source |
/// |------|--------|--------|
/// | 1 | `PluginSessionState` (new) | Forward‑looking write format |
/// | 2 | `{ synth_params, preset_name }` (current wrapper) | Pre‑dirty-session |
/// | 3 | Flat `SynthParams` (legacy) | Very first releases |
pub fn deserialize_state(data: &[u8]) -> Result<PluginSessionState, String> {
    // Tier 1: PluginSessionState (new format)
    if let Ok(session) = serde_json::from_slice::<PluginSessionState>(data) {
        return Ok(session);
    }

    // Tier 2: wrapped { synth_params, preset_name } (current format)
    if let Ok(obj) = serde_json::from_slice::<serde_json::Value>(data)
        && obj.is_object()
        && obj.get("synth_params").is_some()
    {
        let synth_params = obj
            .get("synth_params")
            .and_then(|v| serde_json::from_value::<SynthParams>(v.clone()).ok())
            .ok_or_else(|| "Tier 2: invalid synth_params".to_string())?;
        let preset_name = obj
            .get("preset_name")
            .and_then(|v| v.as_str())
            .unwrap_or_default()
            .to_string();
        return Ok(PluginSessionState {
            synth_params,
            preset_session: PresetSession {
                active_preset_name_base: preset_name,
                loaded_preset_id: None,
                is_dirty: false,
            },
            editor_state: None,
        });
    }

    // Tier 3: flat SynthParams (legacy format)
    if let Ok(synth_params) = serde_json::from_slice::<SynthParams>(data) {
        return Ok(PluginSessionState {
            synth_params,
            preset_session: PresetSession::default(),
            editor_state: None,
        });
    }

    Err(
        "unknown state format — expected PluginSessionState, wrapped object, or flat SynthParams"
            .to_string(),
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmo_synth_engine::params::SynthParams;

    #[test]
    fn deserialize_tier1_plugin_session_state() {
        let state = PluginSessionState {
            synth_params: SynthParams {
                volume: 0.42,
                ..Default::default()
            },
            preset_session: PresetSession {
                active_preset_name_base: "Test".to_string(),
                loaded_preset_id: Some("abc-123".to_string()),
                is_dirty: true,
            },
            editor_state: None,
        };
        let data = serde_json::to_vec(&state).unwrap();
        let result = deserialize_state(&data).unwrap();
        assert_eq!(result.synth_params.volume, 0.42);
        assert_eq!(result.preset_session.active_preset_name_base, "Test");
        assert_eq!(
            result.preset_session.loaded_preset_id.as_deref(),
            Some("abc-123")
        );
        assert!(result.preset_session.is_dirty);
    }

    #[test]
    fn deserialize_tier2_wrapped_object() {
        let data = serde_json::json!({
            "synth_params": SynthParams {
                volume: 0.33,
                ..Default::default()
            },
            "preset_name": "Warm Pad",
        });
        let bytes = serde_json::to_vec(&data).unwrap();
        let result = deserialize_state(&bytes).unwrap();
        assert_eq!(result.synth_params.volume, 0.33);
        assert_eq!(result.preset_session.active_preset_name_base, "Warm Pad");
        assert!(result.preset_session.loaded_preset_id.is_none());
        assert!(!result.preset_session.is_dirty);
    }

    #[test]
    fn deserialize_tier3_flat_synth_params() {
        let params = SynthParams {
            volume: 0.77,
            line1: cosmo_synth_engine::params::LineParams {
                dcw_base: 0.5,
                ..Default::default()
            },
            ..Default::default()
        };
        let bytes = serde_json::to_vec(&params).unwrap();
        let result = deserialize_state(&bytes).unwrap();
        assert_eq!(result.synth_params.volume, 0.77);
        assert_eq!(result.synth_params.line1.dcw_base, 0.5);
        assert_eq!(result.preset_session.active_preset_name_base, "");
        assert!(result.preset_session.loaded_preset_id.is_none());
        assert!(!result.preset_session.is_dirty);
    }

    #[test]
    fn legacy_session_lines_default_synthesis_method_to_pd() {
        let mut value = serde_json::to_value(PluginSessionState {
            synth_params: SynthParams::default(),
            preset_session: PresetSession::default(),
            editor_state: None,
        })
        .unwrap();
        let synth_params = value
            .get_mut("synthParams")
            .and_then(serde_json::Value::as_object_mut)
            .unwrap();
        for line_key in ["line1", "line2"] {
            synth_params
                .get_mut(line_key)
                .and_then(serde_json::Value::as_object_mut)
                .unwrap()
                .remove("synthesisMethod");
        }

        let result = deserialize_state(&serde_json::to_vec(&value).unwrap()).unwrap();
        assert_eq!(
            result.synth_params.line1.synthesis_method,
            cosmo_synth_engine::params::SynthesisMethod::Pd
        );
        assert_eq!(
            result.synth_params.line2.synthesis_method,
            cosmo_synth_engine::params::SynthesisMethod::Pd
        );
    }

    #[test]
    fn midi_learn_state_roundtrip() {
        let state = MidiLearnState {
            learn_mode: true,
            pending_param_key: Some("volume".to_string()),
            bindings: vec![MidiLearnBinding {
                param_key: "volume".to_string(),
                channel: 0,
                cc: 7,
            }],
            version: 1,
        };
        let json = serde_json::to_string(&state).unwrap();
        let back: MidiLearnState = serde_json::from_str(&json).unwrap();
        assert_eq!(state, back);
    }

    #[test]
    fn deserialize_invalid_data_returns_err() {
        let result = deserialize_state(b"not valid json");
        assert!(result.is_err());

        let result = deserialize_state(b"\"just a string\"");
        assert!(result.is_err());

        let result = deserialize_state(b"[]");
        assert!(result.is_err());
    }
}
