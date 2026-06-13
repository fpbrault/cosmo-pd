use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<PluginIpcResponse, String> {
    let editor_state = &context.shared_state.editor.editor_state;
    match req {
        PluginIpcRequest::SetEditorState(state) => {
            if let Ok(mut stored) = editor_state.lock() {
                *stored = Some(state.clone());
            }
            Ok(PluginIpcResponse::SetEditorState)
        }
        PluginIpcRequest::GetEditorState => {
            let state = editor_state.lock().map(|s| s.clone()).unwrap_or(None);
            Ok(PluginIpcResponse::GetEditorState(state))
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
