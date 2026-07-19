use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<PluginIpcResponse, String> {
    let editor_state = &context.shared_state.editor.editor_state;
    match req {
        PluginIpcRequest::SetEditorState(state) => {
            editor_state.store(Some(Arc::new(state.clone())));
            publish_state_snapshot(context.shared_state.as_ref());
            Ok(PluginIpcResponse::SetEditorState)
        }
        PluginIpcRequest::GetEditorState => {
            let state = editor_state.load_full().map(|state| (*state).clone());
            Ok(PluginIpcResponse::GetEditorState(state))
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
