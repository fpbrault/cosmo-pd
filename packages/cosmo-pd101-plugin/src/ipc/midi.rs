use super::*;

pub(super) fn handle(
    context: &IpcContext,
    method: &str,
    args: &[serde_json::Value],
) -> Result<serde_json::Value, String> {
    let midi_learn_state = &context.shared_state.midi_learn.state;
    match method {
        "setMidiLearnMode" => {
            let mode = args
                .first()
                .and_then(|v| v.as_bool())
                .ok_or_else(|| "setMidiLearnMode expects a boolean".to_string())?;
            // TODO: remove this diagnostic once cross-format MIDI learn mode behavior is verified.
            append_log_debug(&format!("ipc_set_midi_learn_mode mode={}", mode));
            if let Ok(mut state) = midi_learn_state.lock() {
                state.learn_mode = mode;
                state.version += 1;
                append_log_debug(&format!(
                    "ipc_set_midi_learn_mode_applied mode={} version={} pending={:?}",
                    state.learn_mode, state.version, state.pending_param_key
                ));
            }
            Ok(serde_json::Value::Null)
        }
        "setPendingMidiLearnParam" => {
            let param_key = args.first().cloned().unwrap_or(serde_json::Value::Null);
            if let Ok(mut state) = midi_learn_state.lock() {
                state.pending_param_key = param_key
                    .as_str()
                    .filter(|value| !value.is_empty())
                    .map(|value| value.to_string());
                state.version += 1;
            }
            Ok(serde_json::Value::Null)
        }
        "addMidiBinding" => {
            let param_key = args
                .first()
                .and_then(|v| v.as_str())
                .ok_or_else(|| "addMidiBinding expects param_key".to_string())?;
            let channel = args
                .get(1)
                .and_then(|v| v.as_i64())
                .ok_or_else(|| "addMidiBinding expects channel".to_string())?
                as i32;
            let cc =
                args.get(2)
                    .and_then(|v| v.as_i64())
                    .ok_or_else(|| "addMidiBinding expects cc".to_string())? as i32;
            // TODO: remove this diagnostic once cross-format MIDI binding RPC flow is verified.
            append_log_debug(&format!(
                "ipc_add_midi_binding param_key={} channel={} cc={}",
                param_key, channel, cc
            ));
            if let Ok(mut state) = midi_learn_state.lock() {
                state
                    .bindings
                    .retain(|binding| binding.param_key != param_key);
                state.bindings.push(crate::session_state::MidiLearnBinding {
                    param_key: param_key.to_string(),
                    channel,
                    cc,
                });
                state.version += 1;
                append_log_debug(&format!(
                    "ipc_add_midi_binding_applied version={} bindings_count={} latest={{param_key:{},channel:{},cc:{}}}",
                    state.version,
                    state.bindings.len(),
                    param_key,
                    channel,
                    cc
                ));
            }
            persist_midi_learn_bindings(midi_learn_state);
            Ok(serde_json::Value::Null)
        }
        "removeMidiBinding" => {
            let binding = args
                .first()
                .cloned()
                .ok_or_else(|| "removeMidiBinding expects a binding object".to_string())?;
            let binding: crate::session_state::MidiLearnBinding =
                serde_json::from_value(binding)
                    .map_err(|e| format!("invalid MidiLearnBinding: {e}"))?;
            if let Ok(mut state) = midi_learn_state.lock() {
                state.bindings.retain(|existing| existing != &binding);
                state.version += 1;
            }
            persist_midi_learn_bindings(midi_learn_state);
            Ok(serde_json::Value::Null)
        }
        "clearMidiLearnBindings" => {
            if let Ok(mut state) = midi_learn_state.lock() {
                state.bindings.clear();
                state.version += 1;
            }
            persist_midi_learn_bindings(midi_learn_state);
            Ok(serde_json::Value::Null)
        }
        "getMidiLearnState" => {
            let state = midi_learn_state
                .lock()
                .map(|s| s.clone())
                .unwrap_or_default();
            serde_json::to_value(state).map_err(|e| e.to_string())
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
