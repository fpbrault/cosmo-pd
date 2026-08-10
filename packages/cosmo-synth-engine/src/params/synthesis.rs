use serde::{Deserialize, Serialize};
#[cfg(feature = "specta-bindings")]
use specta::Type;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub enum SynthesisMethod {
    #[default]
    Pd,
    Karpunk,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct KarpunkParams {
    pub damping: f32,
    pub brightness: f32,
    pub decay: f32,
    pub excitation: f32,
}

impl Default for KarpunkParams {
    fn default() -> Self {
        Self {
            damping: 0.5,
            brightness: 0.5,
            decay: 0.5,
            excitation: 0.0,
        }
    }
}
