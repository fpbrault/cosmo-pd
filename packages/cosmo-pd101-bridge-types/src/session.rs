use serde::{Deserialize, Serialize};

#[cfg(feature = "specta-bindings")]
use specta::Type;

/// DAW-serializable session state for the currently loaded preset.
#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct PresetSession {
    pub active_preset_name_base: String,
    pub loaded_preset_id: Option<String>,
    #[serde(default)]
    pub is_dirty: bool,
}
