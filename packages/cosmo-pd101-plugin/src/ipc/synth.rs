use cosmo_pd101_bridge_types::ScopeDataResponse;

use super::*;
use crate::runtime_state::drain_and_coalesce_ui_param_changes;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<PluginIpcResponse, String> {
    context.shared_state.telemetry.drain_latest();

    let synth_params = &context.shared_state.synth.synth_params;
    let rt_synth_params = &context.shared_state.synth.rt_synth_params;
    let runtime_mod_sources = &context.shared_state.telemetry.runtime_mod_sources;
    let runtime_voice_states = &context.shared_state.telemetry.runtime_voice_states;
    let transport_snapshot = &context.shared_state.telemetry.transport_snapshot;
    let synth_params_version = &context.shared_state.synth.synth_params_version;
    let scope_buffer = &context.shared_state.telemetry.scope_buffer;
    let params = context.params.as_ref();
    match req {
        PluginIpcRequest::SetParams(new_params) => {
            let new_params = new_params.as_ref();

            sync_all_daw_params_from_synth(params, new_params);

            let rt_params = build_rt_synth_params(new_params);
            synth_params.store(Arc::new(new_params.clone()));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);
            publish_state_snapshot(context.shared_state.as_ref());

            Ok(PluginIpcResponse::SetParams)
        }
        PluginIpcRequest::GetParams => {
            let sp = synth_params.load();
            Ok(PluginIpcResponse::GetParams(Box::new(sp.as_ref().clone())))
        }
        PluginIpcRequest::GetParamsVersion => Ok(PluginIpcResponse::GetParamsVersion(
            synth_params_version.load(Ordering::Acquire) as u32,
        )),
        PluginIpcRequest::GetRuntimeModSources => {
            let sources = runtime_mod_sources.load();
            Ok(PluginIpcResponse::GetRuntimeModSources(*sources.as_ref()))
        }
        PluginIpcRequest::GetRuntimeVoiceStates => {
            let states = runtime_voice_states.load();
            Ok(PluginIpcResponse::GetRuntimeVoiceStates(
                states.as_ref().clone(),
            ))
        }
        PluginIpcRequest::GetTransportInfo => {
            let response = transport_snapshot.to_response();
            Ok(PluginIpcResponse::GetTransportInfo(response))
        }
        PluginIpcRequest::GetScopeData => {
            let scope = scope_buffer
                .lock()
                .map_err(|_| "scope buffer is poisoned".to_string())?;
            let response = if scope.samples().is_empty() {
                ScopeDataResponse {
                    samples: vec![],
                    sample_rate: scope.sample_rate(),
                    hz: 0.0,
                }
            } else {
                ScopeDataResponse {
                    samples: scope.to_linear(),
                    sample_rate: scope.sample_rate(),
                    hz: scope.hz() as f64,
                }
            };
            Ok(PluginIpcResponse::GetScopeData(response))
        }
        PluginIpcRequest::ClientLog { level, message } => {
            match level.as_str() {
                "debug" => append_log_debug(&format!("[webview:{level}] {message}")),
                "warn" => append_log_warn(&format!("[webview:{level}] {message}")),
                "error" => append_log_error(&format!("[webview:{level}] {message}")),
                _ => append_log(&format!("[webview:{level}] {message}")),
            }
            Ok(PluginIpcResponse::ClientLog)
        }
        PluginIpcRequest::GetPendingParamChanges => {
            let changes =
                drain_and_coalesce_ui_param_changes(&context.shared_state.ui.ui_param_change_queue);
            if !changes.is_empty() {
                context
                    .shared_state
                    .ui
                    .pending_param_changes_flushed_via_ipc
                    .store(true, Ordering::Release);
            }
            Ok(PluginIpcResponse::GetPendingParamChanges(changes))
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
