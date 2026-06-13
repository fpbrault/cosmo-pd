use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<PluginIpcResponse, String> {
    let midi_learn_state = &context.shared_state.midi_learn.state;
    match req {
        PluginIpcRequest::SetMidiLearnMode(mode) => {
            // TODO: remove this diagnostic once cross-format MIDI learn mode behavior is verified.
            append_log_debug(&format!("ipc_set_midi_learn_mode mode={}", mode));
            if let Ok(mut state) = midi_learn_state.lock() {
                state.learn_mode = *mode;
                state.version += 1;
                append_log_debug(&format!(
                    "ipc_set_midi_learn_mode_applied mode={} version={} pending={:?}",
                    state.learn_mode, state.version, state.pending_param_key
                ));
            }
            Ok(PluginIpcResponse::SetMidiLearnMode)
        }
        PluginIpcRequest::SetPendingMidiLearnParam(param_key) => {
            if let Ok(mut state) = midi_learn_state.lock() {
                state.pending_param_key = param_key.clone();
                state.version += 1;
            }
            Ok(PluginIpcResponse::SetPendingMidiLearnParam)
        }
        PluginIpcRequest::AddMidiBinding {
            param_key,
            channel,
            cc,
        } => {
            // TODO: remove this diagnostic once cross-format MIDI binding RPC flow is verified.
            append_log_debug(&format!(
                "ipc_add_midi_binding param_key={} channel={} cc={}",
                param_key, channel, cc
            ));
            if let Ok(mut state) = midi_learn_state.lock() {
                state
                    .bindings
                    .retain(|binding| binding.param_key != *param_key);
                state.bindings.push(crate::session_state::MidiLearnBinding {
                    param_key: param_key.clone(),
                    channel: *channel,
                    cc: *cc,
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
            Ok(PluginIpcResponse::AddMidiBinding)
        }
        PluginIpcRequest::RemoveMidiBinding(binding) => {
            if let Ok(mut state) = midi_learn_state.lock() {
                state.bindings.retain(|existing| existing != binding);
                state.version += 1;
            }
            persist_midi_learn_bindings(midi_learn_state);
            Ok(PluginIpcResponse::RemoveMidiBinding)
        }
        PluginIpcRequest::ClearMidiLearnBindings => {
            if let Ok(mut state) = midi_learn_state.lock() {
                state.bindings.clear();
                state.version += 1;
            }
            persist_midi_learn_bindings(midi_learn_state);
            Ok(PluginIpcResponse::ClearMidiLearnBindings)
        }
        PluginIpcRequest::GetMidiLearnState => {
            let state = midi_learn_state
                .lock()
                .map(|s| s.clone())
                .unwrap_or_default();
            Ok(PluginIpcResponse::GetMidiLearnState(state))
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
