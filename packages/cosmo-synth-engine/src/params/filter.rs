use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Filter type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum FilterType {
    #[default]
    #[serde(rename = "lp")]
    Lp,
    #[serde(rename = "hp")]
    Hp,
    #[serde(rename = "bp")]
    Bp,
}

/// Filter parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct FilterParams {
    pub enabled: bool,
    #[serde(rename = "type")]
    pub filter_type: FilterType,
    pub cutoff: f32,
    pub resonance: f32,
    pub env_amount: f32,
}

impl Default for FilterParams {
    fn default() -> Self {
        Self {
            enabled: false,
            filter_type: FilterType::Lp,
            cutoff: 5000.0,
            resonance: 0.0,
            env_amount: 0.0,
        }
    }
}
