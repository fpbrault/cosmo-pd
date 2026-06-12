use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<serde_json::Value, String> {
    let editor_state = &context.shared_state.editor.editor_state;
    match req {
        PluginIpcRequest::SetEditorState(state) => {
            if let Ok(mut stored) = editor_state.lock() {
                *stored = Some(state.clone());
            }
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::GetEditorState => {
            let state = editor_state.lock().map(|s| s.clone()).unwrap_or(None);
            serde_json::to_value(state).map_err(|e| e.to_string())
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
