use serde::{Deserialize, Serialize};

#[cfg(feature = "specta-bindings")]
use specta::Type;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct PresetLibraryEntry {
    pub id: String,
    pub name: String,
    pub source: String,
    pub author: String,
    #[serde(default)]
    pub description: String,
    pub starred: bool,
    pub sort_index: u32,
    pub bank_id: Option<String>,
    pub bank_name: Option<String>,
    pub tags: Vec<String>,
    pub macro_labels: [String; 4],
    pub factory_version: u32,
    pub data: serde_json::Value,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct FxModulePresetEntry {
    pub id: String,
    pub name: String,
    pub module_type: String,
    pub patch: serde_json::Value,
    pub updated_at_unix_ms: i64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct PresetBankBundle {
    pub r#type: String,
    pub schema_version: u32,
    pub bank: PresetBankMetadata,
    pub presets: Vec<PresetBankEntry>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct PresetBankMetadata {
    pub id: String,
    pub name: String,
    pub source: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct PresetBankEntry {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub author: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub starred: bool,
    #[serde(default)]
    pub tags: Vec<String>,
    pub data: serde_json::Value,
}
