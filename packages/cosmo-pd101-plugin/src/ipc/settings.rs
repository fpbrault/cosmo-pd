use std::sync::atomic::Ordering;

use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<PluginIpcResponse, String> {
    match req {
        PluginIpcRequest::GetVoiceLimit => {
            let limit = context.shared_state.voice_limit.load(Ordering::Relaxed);
            Ok(PluginIpcResponse::GetVoiceLimit(limit))
        }
        PluginIpcRequest::SetVoiceLimit(limit) => {
            let clamped = (*limit).clamp(
                crate::global_settings::MIN_VOICE_LIMIT,
                crate::global_settings::MAX_VOICE_LIMIT,
            );
            context
                .shared_state
                .voice_limit
                .store(clamped, Ordering::Relaxed);
            Ok(PluginIpcResponse::SetVoiceLimit)
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
