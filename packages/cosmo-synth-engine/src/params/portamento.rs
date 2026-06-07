use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Portamento mode
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum PortamentoMode {
    Rate,
    #[default]
    Time,
}

/// Portamento parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
pub struct PortamentoParams {
    pub enabled: bool,
    pub mode: PortamentoMode,
    pub rate: f32,
    pub time: f32,
}

impl Default for PortamentoParams {
    fn default() -> Self {
        Self {
            enabled: false,
            mode: PortamentoMode::Time,
            rate: 85.0,
            time: 0.1,
        }
    }
}
