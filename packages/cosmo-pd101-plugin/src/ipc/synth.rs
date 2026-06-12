use cosmo_pd101_bridge_types::ScopeDataResponse;

use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<serde_json::Value, String> {
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
            sync_all_daw_params_from_synth(params, new_params);

            let rt_params = build_rt_synth_params(new_params);
            synth_params.store(Arc::new(new_params.clone()));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::GetParams => {
            let sp = synth_params.load();
            serde_json::to_value(sp.as_ref()).map_err(|e| e.to_string())
        }
        PluginIpcRequest::GetParamsVersion => Ok(serde_json::Value::from(
            synth_params_version.load(Ordering::Acquire),
        )),
        PluginIpcRequest::GetRuntimeModSources => {
            let sources = runtime_mod_sources.load();
            serde_json::to_value(sources.as_ref()).map_err(|e| e.to_string())
        }
        PluginIpcRequest::GetRuntimeVoiceStates => {
            let states = runtime_voice_states.load();
            serde_json::to_value(states.as_ref()).map_err(|e| e.to_string())
        }
        PluginIpcRequest::GetTransportInfo => {
            let response = transport_snapshot.to_response();
            serde_json::to_value(response).map_err(|e| e.to_string())
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
            serde_json::to_value(response).map_err(|e| e.to_string())
        }
        PluginIpcRequest::ClientLog { level, message } => {
            match level.as_str() {
                "debug" => append_log_debug(&format!("[webview:{level}] {message}")),
                "warn" => append_log_warn(&format!("[webview:{level}] {message}")),
                "error" => append_log_error(&format!("[webview:{level}] {message}")),
                _ => append_log(&format!("[webview:{level}] {message}")),
            }
            Ok(serde_json::Value::Null)
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
