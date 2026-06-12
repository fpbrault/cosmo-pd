use serde::{Deserialize, Serialize};

#[cfg(feature = "specta-bindings")]
use specta::Type;

/// UI editor state persisted across DAW sessions.
/// All fields are optional so partial updates work from the webview.
#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[cfg_attr(feature = "specta-bindings", derive(Type))]
#[serde(rename_all = "camelCase")]
pub struct EditorState {
    pub main_panel_mode: Option<String>,
    pub phase_line_panel_tab: Option<String>,
    pub active_env_tab: Option<String>,
    pub keyboard_visible: Option<bool>,
    pub keyboard_octaves: Option<i32>,
    pub keyboard_range: Option<i32>,
    pub keyboard_height: Option<i32>,
    pub keyboard_input_mode: Option<String>,
    pub library_mode_open: Option<bool>,
    pub scope_cycles: Option<f64>,
    pub scope_vertical_zoom: Option<f64>,
    pub scope_trigger_level: Option<i32>,
    pub scope_visualization_mode: Option<String>,
    pub scope_color_theme: Option<String>,
}
