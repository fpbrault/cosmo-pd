use super::*;

pub(super) fn handle(
    context: &IpcContext,
    method: &str,
    args: &[serde_json::Value],
) -> Result<serde_json::Value, String> {
    let editor_state = &context.shared_state.editor.editor_state;
    match method {
        "setEditorState" => {
            let payload = args
                .first()
                .ok_or_else(|| "setEditorState expects an object payload".to_string())?;
            let state: crate::session_state::EditorState = serde_json::from_value(payload.clone())
                .map_err(|e| format!("invalid EditorState: {e}"))?;
            if let Ok(mut stored) = editor_state.lock() {
                *stored = Some(state);
            }
            Ok(serde_json::Value::Null)
        }
        "getEditorState" => {
            let state = editor_state.lock().map(|s| s.clone()).unwrap_or(None);
            serde_json::to_value(state).map_err(|e| e.to_string())
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
