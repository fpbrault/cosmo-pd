use serde::{Deserialize, Serialize};

use crate::editor::EditorState;
use crate::midi::{MidiLearnBinding, MidiLearnState};
use crate::preset::{
    AddPresetResponse, ExportPresetResponse, FxModulePresetEntry, LoadPresetResponse,
    PresetBankBundle, PresetLibraryActionResponse, PresetLibraryResponse, SavePresetResponse,
};
use crate::runtime::{ScopeDataResponse, TransportInfoResponse};
use crate::session::PresetSession;
use cosmo_synth_engine::params::SynthParams;
use cosmo_synth_engine::processor::state::{RuntimeModSources, RuntimeVoiceDebugState};

#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Tagged IPC request envelope deserialized from `{ method, payload }`.
///
/// Wire format (adjacently tagged by serde):
/// - Unit variant: `{ "method": "getParams" }`
/// - Payload variant: `{ "method": "setPresetSession", "payload": { ... } }`
///
#[derive(Serialize, Deserialize, Clone, Debug)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(
    tag = "method",
    content = "payload",
    rename_all_fields = "camelCase",
    deny_unknown_fields
)]
pub enum PluginIpcRequest {
    // ── Performance ──
    #[serde(rename = "noteOn")]
    NoteOn { note: u8, velocity: f32 },
    #[serde(rename = "noteOff")]
    NoteOff { note: u8 },
    #[serde(rename = "sustain")]
    Sustain { on: bool },
    #[serde(rename = "pitchBend")]
    PitchBend { value: f32 },
    #[serde(rename = "modWheel")]
    ModWheel { value: f32 },
    #[serde(rename = "aftertouch")]
    Aftertouch { value: f32 },
    #[serde(rename = "polyAftertouch")]
    PolyAftertouch { note: u8, value: f32 },
    #[serde(rename = "macroValue")]
    MacroValue { index: u32, value: f32 },
    #[serde(rename = "panic")]
    Panic,

    // ── Synth ──
    #[serde(rename = "getParams")]
    GetParams,
    #[serde(rename = "setParams")]
    SetParams(SynthParams),
    #[serde(rename = "getParamsVersion")]
    GetParamsVersion,
    #[serde(rename = "getRuntimeModSources")]
    GetRuntimeModSources,
    #[serde(rename = "getRuntimeVoiceStates")]
    GetRuntimeVoiceStates,
    #[serde(rename = "getTransportInfo")]
    GetTransportInfo,
    #[serde(rename = "getScopeData")]
    GetScopeData,
    #[serde(rename = "clientLog")]
    ClientLog { level: String, message: String },

    // ── Session ──
    #[serde(rename = "getPresetSession")]
    GetPresetSession,
    #[serde(rename = "setPresetSession")]
    SetPresetSession(PresetSession),
    #[serde(rename = "getPresetName")]
    GetPresetName,
    #[serde(rename = "setPresetName")]
    SetPresetName(String),

    // ── Preset Library ──
    #[serde(rename = "loadPreset")]
    LoadPreset(LoadPresetPayload),
    #[serde(rename = "getPresetLibrary")]
    GetPresetLibrary { source: Option<String> },
    #[serde(rename = "retryPresetLibrary")]
    RetryPresetLibrary,
    #[serde(rename = "repairPresetLibrary")]
    RepairPresetLibrary,
    #[serde(rename = "rebuildPresetLibrary")]
    RebuildPresetLibrary,
    #[serde(rename = "addPreset")]
    AddPreset(AddPresetPayload),
    #[serde(rename = "savePreset")]
    SavePreset(SavePresetPayload),
    #[serde(rename = "deletePreset")]
    DeletePreset { id: String },
    #[serde(rename = "renamePreset")]
    RenamePreset { id: String, new_name: String },
    #[serde(rename = "toggleStarred")]
    ToggleStarred { id: String, starred: bool },
    #[serde(rename = "setPresetAuthor")]
    SetPresetAuthor { id: String, author: String },
    #[serde(rename = "setPresetDescription")]
    SetPresetDescription { id: String, description: String },
    #[serde(rename = "setPresetTags")]
    SetPresetTags { id: String, tags: Vec<String> },
    #[serde(rename = "importPresetBank")]
    ImportPresetBank(PresetBankBundle),
    #[serde(rename = "exportPreset")]
    ExportPreset { id: String },
    #[serde(rename = "listFxModulePresets")]
    ListFxModulePresets { module_type: String },
    #[serde(rename = "saveFxModulePreset")]
    SaveFxModulePreset(SaveFxModulePresetPayload),
    #[serde(rename = "deleteFxModulePreset")]
    DeleteFxModulePreset { id: String },

    // ── Editor ──
    #[serde(rename = "getEditorState")]
    GetEditorState,
    #[serde(rename = "setEditorState")]
    SetEditorState(EditorState),

    // ── MIDI Learn ──
    #[serde(rename = "getMidiLearnState")]
    GetMidiLearnState,
    #[serde(rename = "setMidiLearnMode")]
    SetMidiLearnMode(bool),
    #[serde(rename = "setPendingMidiLearnParam")]
    SetPendingMidiLearnParam(Option<String>),
    #[serde(rename = "addMidiBinding")]
    AddMidiBinding {
        param_key: String,
        channel: i32,
        cc: i32,
    },
    #[serde(rename = "removeMidiBinding")]
    RemoveMidiBinding(MidiLearnBinding),
    #[serde(rename = "clearMidiLearnBindings")]
    ClearMidiLearnBindings,
}

/// Typed result for each IPC request. The transport serializes only `result`.
#[derive(Serialize, Clone, Debug)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(tag = "method", content = "result")]
pub enum PluginIpcResponse {
    #[serde(rename = "noteOn")]
    NoteOn,
    #[serde(rename = "noteOff")]
    NoteOff,
    #[serde(rename = "sustain")]
    Sustain,
    #[serde(rename = "pitchBend")]
    PitchBend,
    #[serde(rename = "modWheel")]
    ModWheel,
    #[serde(rename = "aftertouch")]
    Aftertouch,
    #[serde(rename = "polyAftertouch")]
    PolyAftertouch,
    #[serde(rename = "macroValue")]
    MacroValue,
    #[serde(rename = "panic")]
    Panic,
    #[serde(rename = "getParams")]
    GetParams(Box<SynthParams>),
    #[serde(rename = "setParams")]
    SetParams,
    #[serde(rename = "getParamsVersion")]
    GetParamsVersion(u32),
    #[serde(rename = "getRuntimeModSources")]
    GetRuntimeModSources(RuntimeModSources),
    #[serde(rename = "getRuntimeVoiceStates")]
    GetRuntimeVoiceStates(Vec<RuntimeVoiceDebugState>),
    #[serde(rename = "getTransportInfo")]
    GetTransportInfo(TransportInfoResponse),
    #[serde(rename = "getScopeData")]
    GetScopeData(ScopeDataResponse),
    #[serde(rename = "clientLog")]
    ClientLog,
    #[serde(rename = "getPresetSession")]
    GetPresetSession(PresetSession),
    #[serde(rename = "setPresetSession")]
    SetPresetSession,
    #[serde(rename = "getPresetName")]
    GetPresetName(String),
    #[serde(rename = "setPresetName")]
    SetPresetName,
    #[serde(rename = "loadPreset")]
    LoadPreset(LoadPresetResponse),
    #[serde(rename = "getPresetLibrary")]
    GetPresetLibrary(PresetLibraryResponse),
    #[serde(rename = "retryPresetLibrary")]
    RetryPresetLibrary(PresetLibraryActionResponse),
    #[serde(rename = "repairPresetLibrary")]
    RepairPresetLibrary(PresetLibraryActionResponse),
    #[serde(rename = "rebuildPresetLibrary")]
    RebuildPresetLibrary(PresetLibraryActionResponse),
    #[serde(rename = "addPreset")]
    AddPreset(AddPresetResponse),
    #[serde(rename = "savePreset")]
    SavePreset(SavePresetResponse),
    #[serde(rename = "deletePreset")]
    DeletePreset,
    #[serde(rename = "renamePreset")]
    RenamePreset,
    #[serde(rename = "toggleStarred")]
    ToggleStarred,
    #[serde(rename = "setPresetAuthor")]
    SetPresetAuthor,
    #[serde(rename = "setPresetDescription")]
    SetPresetDescription,
    #[serde(rename = "setPresetTags")]
    SetPresetTags,
    #[serde(rename = "importPresetBank")]
    ImportPresetBank,
    #[serde(rename = "exportPreset")]
    ExportPreset(ExportPresetResponse),
    #[serde(rename = "listFxModulePresets")]
    ListFxModulePresets(Vec<FxModulePresetEntry>),
    #[serde(rename = "saveFxModulePreset")]
    SaveFxModulePreset(FxModulePresetEntry),
    #[serde(rename = "deleteFxModulePreset")]
    DeleteFxModulePreset,
    #[serde(rename = "getEditorState")]
    GetEditorState(Option<EditorState>),
    #[serde(rename = "setEditorState")]
    SetEditorState,
    #[serde(rename = "getMidiLearnState")]
    GetMidiLearnState(MidiLearnState),
    #[serde(rename = "setMidiLearnMode")]
    SetMidiLearnMode,
    #[serde(rename = "setPendingMidiLearnParam")]
    SetPendingMidiLearnParam,
    #[serde(rename = "addMidiBinding")]
    AddMidiBinding,
    #[serde(rename = "removeMidiBinding")]
    RemoveMidiBinding,
    #[serde(rename = "clearMidiLearnBindings")]
    ClearMidiLearnBindings,
}

impl PluginIpcResponse {
    pub fn into_result(self) -> Result<serde_json::Value, serde_json::Error> {
        let value = serde_json::to_value(self)?;
        Ok(value
            .as_object()
            .and_then(|object| object.get("result"))
            .cloned()
            .unwrap_or(serde_json::Value::Null))
    }
}

/// Payload for `addPreset` IPC method.
#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct AddPresetPayload {
    pub name: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub macro_labels: Option<Vec<String>>,
}

/// Payload for `savePreset` IPC method.
#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct SavePresetPayload {
    #[serde(default)]
    pub id: Option<String>,
    pub name: String,
    #[serde(default)]
    pub author: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub macro_labels: Option<Vec<String>>,
    #[serde(default)]
    #[cfg_attr(
        feature = "specta-bindings",
        specta(type = Option<crate::BridgeJsonValue>)
    )]
    pub data: Option<serde_json::Value>,
}

/// Payload for `saveFxModulePreset` IPC method.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct SaveFxModulePresetPayload {
    pub name: String,
    pub module_type: String,
    #[cfg_attr(feature = "specta-bindings", specta(type = crate::BridgeJsonValue))]
    pub patch: serde_json::Value,
}

impl PluginIpcRequest {
    /// Test-only adapter for pre-migration positional fixtures.
    #[cfg(test)]
    pub fn from_legacy(method: &str, args: &[serde_json::Value]) -> Result<Self, String> {
        Ok(match method {
            // ── Performance ──
            "noteOn" => {
                let obj = first_object(method, args)?;
                Self::NoteOn {
                    note: get_u8(obj, "note")?,
                    velocity: get_f32_opt(obj, "velocity").unwrap_or(0.8),
                }
            }
            "noteOff" => {
                let obj = first_object(method, args)?;
                Self::NoteOff {
                    note: get_u8(obj, "note")?,
                }
            }
            "sustain" => {
                let obj = first_object(method, args)?;
                Self::Sustain {
                    on: get_bool(obj, "on")?,
                }
            }
            "pitchBend" => {
                let obj = first_object(method, args)?;
                Self::PitchBend {
                    value: get_f32(obj, "value")?,
                }
            }
            "modWheel" => {
                let obj = first_object(method, args)?;
                Self::ModWheel {
                    value: get_f32(obj, "value")?,
                }
            }
            "aftertouch" => {
                let obj = first_object(method, args)?;
                Self::Aftertouch {
                    value: get_f32(obj, "value")?,
                }
            }
            "polyAftertouch" => {
                let obj = first_object(method, args)?;
                Self::PolyAftertouch {
                    note: get_u8(obj, "note")?,
                    value: get_f32(obj, "value")?,
                }
            }
            "macroValue" => {
                let obj = first_object(method, args)?;
                Self::MacroValue {
                    index: get_u32(obj, "index")?,
                    value: get_f32(obj, "value")?,
                }
            }
            "panic" => Self::Panic,

            // ── Synth ──
            "getParams" => Self::GetParams,
            "setParams" => Self::SetParams(
                serde_json::from_value(
                    args.first()
                        .ok_or_else(|| "setParams expects a payload".to_string())?
                        .clone(),
                )
                .or_else(|_| {
                    // Fallback: TS sends a JSON string inside args[0]
                    let s = args.first().and_then(|v| v.as_str()).ok_or_else(|| {
                        "setParams expects a SynthParams object or JSON string".to_string()
                    })?;
                    serde_json::from_str(s).map_err(|e| format!("invalid SynthParams: {e}"))
                })
                .map_err(|e| format!("invalid SynthParams: {e}"))?,
            ),
            "getParamsVersion" => Self::GetParamsVersion,
            "getRuntimeModSources" => Self::GetRuntimeModSources,
            "getRuntimeVoiceStates" => Self::GetRuntimeVoiceStates,
            "getTransportInfo" => Self::GetTransportInfo,
            "getScopeData" => Self::GetScopeData,
            "clientLog" => Self::ClientLog {
                level: args
                    .first()
                    .and_then(|v| v.as_str())
                    .unwrap_or("info")
                    .to_string(),
                message: args
                    .get(1)
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string(),
            },

            // ── Session ──
            "getPresetSession" => Self::GetPresetSession,
            "setPresetSession" => Self::SetPresetSession(
                serde_json::from_value(
                    args.first()
                        .ok_or_else(|| "setPresetSession expects an object payload".to_string())?
                        .clone(),
                )
                .map_err(|e| format!("invalid PresetSession: {e}"))?,
            ),
            "getPresetName" => Self::GetPresetName,
            "setPresetName" => Self::SetPresetName(
                args.first()
                    .and_then(|v| v.as_str())
                    .ok_or_else(|| "setPresetName expects a string argument".to_string())?
                    .to_string(),
            ),

            // ── Preset Library ──
            "loadPresetData" | "loadPreset" => {
                let first = args
                    .first()
                    .ok_or_else(|| format!("{method} expects a payload argument"))?;
                Self::LoadPreset(match serde_json::from_value(first.clone()) {
                    Ok(payload) => payload,
                    Err(_) => {
                        let obj = first_object(method, args)?;
                        LoadPresetPayload {
                            preset_id: get_string(obj, "id")?,
                        }
                    }
                })
            }
            "getPresetLibrary" => Self::GetPresetLibrary {
                source: args
                    .first()
                    .and_then(|v| v.as_object())
                    .and_then(|o| o.get("source"))
                    .and_then(|v| v.as_str())
                    .map(String::from),
            },
            "retryPresetLibrary" => Self::RetryPresetLibrary,
            "repairPresetLibrary" => Self::RepairPresetLibrary,
            "rebuildPresetLibrary" => Self::RebuildPresetLibrary,
            "addPreset" => Self::AddPreset(
                serde_json::from_value(
                    args.first()
                        .ok_or_else(|| "addPreset expects a payload".to_string())?
                        .clone(),
                )
                .map_err(|e| format!("invalid AddPresetPayload: {e}"))?,
            ),
            "savePreset" => Self::SavePreset(
                serde_json::from_value(
                    args.first()
                        .ok_or_else(|| "savePreset expects a payload".to_string())?
                        .clone(),
                )
                .map_err(|e| format!("invalid SavePresetPayload: {e}"))?,
            ),
            "deletePreset" => {
                let obj = first_object(method, args)?;
                Self::DeletePreset {
                    id: get_string(obj, "id")?,
                }
            }
            "renamePreset" => {
                let obj = first_object(method, args)?;
                Self::RenamePreset {
                    id: get_string(obj, "id")?,
                    new_name: get_string(obj, "newName")?,
                }
            }
            "toggleStarred" => {
                let obj = first_object(method, args)?;
                Self::ToggleStarred {
                    id: get_string(obj, "id")?,
                    starred: get_bool(obj, "starred")?,
                }
            }
            "setPresetAuthor" => {
                let obj = first_object(method, args)?;
                Self::SetPresetAuthor {
                    id: get_string(obj, "id")?,
                    author: get_string(obj, "author")?,
                }
            }
            "setPresetDescription" => {
                let obj = first_object(method, args)?;
                Self::SetPresetDescription {
                    id: get_string(obj, "id")?,
                    description: get_string(obj, "description")?,
                }
            }
            "setPresetTags" => {
                let obj = first_object(method, args)?;
                Self::SetPresetTags {
                    id: get_string(obj, "id")?,
                    tags: get_string_vec(obj, "tags")?,
                }
            }
            "importPresetBank" => Self::ImportPresetBank(
                serde_json::from_value(
                    args.first()
                        .ok_or_else(|| "importPresetBank expects a payload".to_string())?
                        .clone(),
                )
                .map_err(|e| format!("invalid PresetBankBundle: {e}"))?,
            ),
            "exportPreset" => {
                let obj = first_object(method, args)?;
                Self::ExportPreset {
                    id: get_string(obj, "id")?,
                }
            }
            "listFxModulePresets" => {
                let obj = first_object(method, args)?;
                Self::ListFxModulePresets {
                    module_type: get_string(obj, "moduleType")?,
                }
            }
            "saveFxModulePreset" => Self::SaveFxModulePreset(
                serde_json::from_value(
                    args.first()
                        .ok_or_else(|| "saveFxModulePreset expects a payload".to_string())?
                        .clone(),
                )
                .map_err(|e| format!("invalid SaveFxModulePresetPayload: {e}"))?,
            ),
            "deleteFxModulePreset" => {
                let obj = first_object(method, args)?;
                Self::DeleteFxModulePreset {
                    id: get_string(obj, "id")?,
                }
            }

            // ── Editor ──
            "getEditorState" => Self::GetEditorState,
            "setEditorState" => Self::SetEditorState(
                serde_json::from_value(
                    args.first()
                        .ok_or_else(|| "setEditorState expects a payload".to_string())?
                        .clone(),
                )
                .map_err(|e| format!("invalid EditorState: {e}"))?,
            ),

            // ── MIDI Learn ──
            "getMidiLearnState" => Self::GetMidiLearnState,
            "setMidiLearnMode" => Self::SetMidiLearnMode(
                args.first()
                    .and_then(|v| v.as_bool())
                    .ok_or_else(|| "setMidiLearnMode expects a boolean".to_string())?,
            ),
            "setPendingMidiLearnParam" => Self::SetPendingMidiLearnParam(
                args.first()
                    .and_then(|v| v.as_str())
                    .filter(|s| !s.is_empty())
                    .map(String::from),
            ),
            "addMidiBinding" => {
                // Accept both positional [key, channel, cc] and object {paramKey, channel, cc}
                if let Some(obj) = args.first().and_then(|v| v.as_object()) {
                    Self::AddMidiBinding {
                        param_key: get_string(obj, "paramKey")?,
                        channel: get_i32(obj, "channel")?,
                        cc: get_i32(obj, "cc")?,
                    }
                } else {
                    Self::AddMidiBinding {
                        param_key: args
                            .first()
                            .and_then(|v| v.as_str())
                            .ok_or_else(|| "addMidiBinding expects param_key".to_string())?
                            .to_string(),
                        channel: args
                            .get(1)
                            .and_then(|v| v.as_i64())
                            .ok_or_else(|| "addMidiBinding expects channel".to_string())?
                            as i32,
                        cc: args
                            .get(2)
                            .and_then(|v| v.as_i64())
                            .ok_or_else(|| "addMidiBinding expects cc".to_string())?
                            as i32,
                    }
                }
            }
            "removeMidiBinding" => Self::RemoveMidiBinding(
                serde_json::from_value(
                    args.first()
                        .ok_or_else(|| "removeMidiBinding expects a binding object".to_string())?
                        .clone(),
                )
                .map_err(|e| format!("invalid MidiLearnBinding: {e}"))?,
            ),
            "clearMidiLearnBindings" => Self::ClearMidiLearnBindings,

            _ => return Err(format!("unknown method: {method}")),
        })
    }
}

// ─── Payload extractors ────────────────────────────────────────────────────────

#[cfg(test)]
fn first_object<'a>(
    method: &str,
    args: &'a [serde_json::Value],
) -> Result<&'a serde_json::Map<String, serde_json::Value>, String> {
    args.first()
        .and_then(|v| v.as_object())
        .ok_or_else(|| format!("{method} expects an object payload as first argument"))
}

#[cfg(test)]
fn get_u8(obj: &serde_json::Map<String, serde_json::Value>, key: &str) -> Result<u8, String> {
    obj.get(key)
        .and_then(|v| v.as_u64())
        .and_then(|n| u8::try_from(n).ok())
        .ok_or_else(|| format!("payload missing {key}"))
}

#[cfg(test)]
fn get_string(
    obj: &serde_json::Map<String, serde_json::Value>,
    key: &str,
) -> Result<String, String> {
    obj.get(key)
        .and_then(|v| v.as_str())
        .map(String::from)
        .ok_or_else(|| format!("payload missing {key}"))
}

#[cfg(test)]
fn get_bool(obj: &serde_json::Map<String, serde_json::Value>, key: &str) -> Result<bool, String> {
    obj.get(key)
        .and_then(|v| v.as_bool())
        .ok_or_else(|| format!("payload missing {key}"))
}

#[cfg(test)]
fn get_f32(obj: &serde_json::Map<String, serde_json::Value>, key: &str) -> Result<f32, String> {
    obj.get(key)
        .and_then(|v| v.as_f64())
        .map(|v| v as f32)
        .ok_or_else(|| format!("payload missing {key}"))
}

#[cfg(test)]
fn get_f32_opt(obj: &serde_json::Map<String, serde_json::Value>, key: &str) -> Option<f32> {
    obj.get(key).and_then(|v| v.as_f64()).map(|v| v as f32)
}

#[cfg(test)]
fn get_i32(obj: &serde_json::Map<String, serde_json::Value>, key: &str) -> Result<i32, String> {
    obj.get(key)
        .and_then(|v| v.as_i64())
        .and_then(|v| i32::try_from(v).ok())
        .ok_or_else(|| format!("payload missing {key}"))
}

#[cfg(test)]
fn get_u32(obj: &serde_json::Map<String, serde_json::Value>, key: &str) -> Result<u32, String> {
    obj.get(key)
        .and_then(|v| v.as_u64())
        .and_then(|v| u32::try_from(v).ok())
        .ok_or_else(|| format!("payload missing {key}"))
}

#[cfg(test)]
fn get_string_vec(
    obj: &serde_json::Map<String, serde_json::Value>,
    key: &str,
) -> Result<Vec<String>, String> {
    obj.get(key)
        .and_then(|v| v.as_array())
        .map(|a| {
            a.iter()
                .filter_map(|v| v.as_str().map(String::from))
                .collect()
        })
        .ok_or_else(|| format!("payload missing {key}"))
}

/// Outer envelope wrapping `id` + the tagged IPC request.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
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
    fn from_legacy_get_params() {
        let req = PluginIpcRequest::from_legacy("getParams", &[]).unwrap();
        assert!(matches!(req, PluginIpcRequest::GetParams));
    }

    #[test]
    fn from_legacy_note_on() {
        let args = [serde_json::json!({"note": 60, "velocity": 0.75})];
        let req = PluginIpcRequest::from_legacy("noteOn", &args).unwrap();
        assert!(matches!(
            req,
            PluginIpcRequest::NoteOn {
                note: 60,
                velocity: 0.75
            }
        ));
    }

    #[test]
    fn from_legacy_note_on_default_velocity() {
        let args = [serde_json::json!({"note": 60})];
        let req = PluginIpcRequest::from_legacy("noteOn", &args).unwrap();
        assert!(matches!(
            req,
            PluginIpcRequest::NoteOn {
                note: 60,
                velocity: 0.8
            }
        ));
    }

    #[test]
    fn from_legacy_set_preset_session() {
        let args = [serde_json::json!({
            "activePresetNameBase": "Test",
            "loadedPresetId": null,
            "isDirty": false,
        })];
        let req = PluginIpcRequest::from_legacy("setPresetSession", &args).unwrap();
        match req {
            PluginIpcRequest::SetPresetSession(s) => {
                assert_eq!(s.active_preset_name_base, "Test");
            }
            _ => panic!("unexpected variant"),
        }
    }

    #[test]
    fn from_legacy_add_midi_binding() {
        let args = [
            serde_json::json!("cutoff"),
            serde_json::json!(1),
            serde_json::json!(74),
        ];
        let req = PluginIpcRequest::from_legacy("addMidiBinding", &args).unwrap();
        match req {
            PluginIpcRequest::AddMidiBinding {
                param_key,
                channel,
                cc,
            } => {
                assert_eq!(param_key, "cutoff");
                assert_eq!(channel, 1);
                assert_eq!(cc, 74);
            }
            _ => panic!("unexpected variant"),
        }
    }

    #[test]
    fn from_legacy_add_midi_binding_object() {
        let args = [serde_json::json!({
            "paramKey": "cutoff",
            "channel": 1,
            "cc": 74,
        })];
        let req = PluginIpcRequest::from_legacy("addMidiBinding", &args).unwrap();
        match req {
            PluginIpcRequest::AddMidiBinding {
                param_key,
                channel,
                cc,
            } => {
                assert_eq!(param_key, "cutoff");
                assert_eq!(channel, 1);
                assert_eq!(cc, 74);
            }
            _ => panic!("unexpected variant"),
        }
    }

    #[test]
    fn from_legacy_client_log() {
        let args = [
            serde_json::json!("warn"),
            serde_json::json!("something happened"),
        ];
        let req = PluginIpcRequest::from_legacy("clientLog", &args).unwrap();
        match req {
            PluginIpcRequest::ClientLog { level, message } => {
                assert_eq!(level, "warn");
                assert_eq!(message, "something happened");
            }
            _ => panic!("unexpected variant"),
        }
    }

    #[test]
    fn from_legacy_unknown_method() {
        let err = PluginIpcRequest::from_legacy("bogus", &[]).unwrap_err();
        assert!(err.contains("unknown method"));
    }

    #[test]
    fn from_legacy_missing_args() {
        let err = PluginIpcRequest::from_legacy("noteOn", &[]).unwrap_err();
        assert!(err.contains("expects an object payload"));
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
            PluginIpcEnvelope {
                id: 10,
                request: PluginIpcRequest::NoteOn {
                    note: 60,
                    velocity: 0.5,
                },
            },
            PluginIpcEnvelope {
                id: 11,
                request: PluginIpcRequest::Panic,
            },
            PluginIpcEnvelope {
                id: 12,
                request: PluginIpcRequest::SetMidiLearnMode(true),
            },
            PluginIpcEnvelope {
                id: 13,
                request: PluginIpcRequest::ClientLog {
                    level: "info".into(),
                    message: "test".into(),
                },
            },
            PluginIpcEnvelope {
                id: 14,
                request: PluginIpcRequest::GetPresetName,
            },
            PluginIpcEnvelope {
                id: 15,
                request: PluginIpcRequest::SetPresetName("foo".into()),
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
                (
                    PluginIpcRequest::NoteOn {
                        note: a,
                        velocity: va,
                    },
                    PluginIpcRequest::NoteOn {
                        note: b,
                        velocity: vb,
                    },
                ) => {
                    assert_eq!(a, b);
                    assert!((va - vb).abs() < f32::EPSILON);
                }
                (PluginIpcRequest::Panic, PluginIpcRequest::Panic) => {}
                (PluginIpcRequest::SetMidiLearnMode(a), PluginIpcRequest::SetMidiLearnMode(b)) => {
                    assert_eq!(a, b);
                }
                (
                    PluginIpcRequest::ClientLog {
                        level: la,
                        message: ma,
                    },
                    PluginIpcRequest::ClientLog {
                        level: lb,
                        message: mb,
                    },
                ) => {
                    assert_eq!(la, lb);
                    assert_eq!(ma, mb);
                }
                (PluginIpcRequest::GetPresetName, PluginIpcRequest::GetPresetName) => {}
                (PluginIpcRequest::SetPresetName(a), PluginIpcRequest::SetPresetName(b)) => {
                    assert_eq!(a, b);
                }
                _ => panic!(
                    "Variant mismatch after roundtrip: {:?} vs {:?}",
                    env.request, back.request
                ),
            }
        }
    }

    #[test]
    fn envelope_unknown_method_fails() {
        let input = r#"{"id":1,"method":"doesNotExist","payload":{}}"#;
        let err = serde_json::from_str::<PluginIpcEnvelope>(input).unwrap_err();
        assert!(err.is_data(), "expected data error for unknown method");
    }

    #[test]
    fn envelope_missing_payload_on_payload_variant_fails() {
        let input = r#"{"id":2,"method":"setParams"}"#;
        let err = serde_json::from_str::<PluginIpcEnvelope>(input).unwrap_err();
        assert!(err.is_data(), "expected data error for missing payload");
    }

    #[test]
    fn envelope_wrong_payload_type_fails() {
        let input = r#"{"id":3,"method":"setParams","payload":"notAnObject"}"#;
        let err = serde_json::from_str::<PluginIpcEnvelope>(input).unwrap_err();
        assert!(err.is_data(), "expected data error for wrong payload type");
    }

    #[test]
    fn envelope_rejects_legacy_args_key() {
        let input = r#"{"id":4,"method":"getParams","args":[]}"#;
        assert!(serde_json::from_str::<PluginIpcEnvelope>(input).is_err());
    }

    #[test]
    fn typed_response_serializes_only_its_result() {
        let value = PluginIpcResponse::LoadPreset(LoadPresetResponse {
            preset_name: "Warm Pad".to_string(),
        })
        .into_result()
        .unwrap();
        assert_eq!(value, serde_json::json!({ "presetName": "Warm Pad" }));
    }
}
