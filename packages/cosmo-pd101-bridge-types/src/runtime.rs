use serde::Serialize;

#[cfg(feature = "specta-bindings")]
use specta::Type;

/// Scope data response sent from Rust to the webview.
#[derive(Serialize, Clone, Debug)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct ScopeDataResponse {
    pub samples: Vec<f32>,
    pub sample_rate: f32,
    pub hz: f64,
}

/// Transport info snapshot sent from Rust to the webview.
#[derive(Serialize, Clone, Debug)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct TransportInfoResponse {
    pub playing: bool,
    pub recording: bool,
    pub tempo: f64,
    pub time_sig_num: u8,
    pub time_sig_den: u8,
    pub position_samples: f64,
    pub position_seconds: f64,
    pub position_beats: f64,
    pub bar_start_beats: f64,
    pub loop_active: bool,
    pub loop_start_beats: f64,
    pub loop_end_beats: f64,
}
