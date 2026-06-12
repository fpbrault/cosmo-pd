use super::*;

pub(super) fn handle(
    context: &IpcContext,
    method: &str,
    args: &[serde_json::Value],
) -> Result<serde_json::Value, String> {
    let synth_params = &context.shared_state.synth.synth_params;
    let rt_synth_params = &context.shared_state.synth.rt_synth_params;
    let runtime_mod_sources = &context.shared_state.telemetry.runtime_mod_sources;
    let runtime_voice_states = &context.shared_state.telemetry.runtime_voice_states;
    let transport_snapshot = &context.shared_state.telemetry.transport_snapshot;
    let synth_params_version = &context.shared_state.synth.synth_params_version;
    let scope_buffer = &context.shared_state.telemetry.scope_buffer;
    let params = context.params.as_ref();
    match method {
        "setParams" => {
            let json_str = args
                .first()
                .and_then(serde_json::Value::as_str)
                .ok_or_else(|| "setParams expects a JSON string as first argument".to_string())?;
            let new_params: SynthParams = serde_json::from_str(json_str)
                .map_err(|e| format!("invalid SynthParams payload: {e}"))?;

            // Keep truce FloatParams aligned with the nested SynthParams payload so
            // the next process() block does not overwrite preset state with stale
            // default automation values.
            sync_all_daw_params_from_synth(params, &new_params);

            let rt_params = build_rt_synth_params(&new_params);
            synth_params.store(Arc::new(new_params));
            rt_synth_params.store(Arc::new(rt_params));
            synth_params_version.fetch_add(1, Ordering::Release);
            Ok(serde_json::Value::Null)
        }
        "getParams" => {
            let sp = synth_params.load();
            serde_json::to_value(sp.as_ref()).map_err(|e| e.to_string())
        }
        "getParamsVersion" => Ok(serde_json::Value::from(
            synth_params_version.load(Ordering::Acquire),
        )),
        "getRuntimeModSources" => {
            let sources = runtime_mod_sources.load();
            serde_json::to_value(sources.as_ref()).map_err(|e| e.to_string())
        }
        "getRuntimeVoiceStates" => {
            let states = runtime_voice_states.load();
            serde_json::to_value(states.as_ref()).map_err(|e| e.to_string())
        }
        "getTransportInfo" => Ok(transport_snapshot.snapshot_json()),
        "getScopeData" => {
            let scope = scope_buffer
                .lock()
                .map_err(|_| "scope buffer is poisoned".to_string())?;
            if scope.samples().is_empty() {
                return Ok(
                    serde_json::json!({ "samples": [], "sampleRate": scope.sample_rate(), "hz": 0.0_f64 }),
                );
            }
            let linear = scope.to_linear();
            Ok(
                serde_json::json!({ "samples": linear, "sampleRate": scope.sample_rate(), "hz": scope.hz() }),
            )
        }
        "clientLog" => {
            let level = args
                .first()
                .and_then(serde_json::Value::as_str)
                .unwrap_or("info");
            let message = args
                .get(1)
                .and_then(serde_json::Value::as_str)
                .unwrap_or("");
            match level {
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
