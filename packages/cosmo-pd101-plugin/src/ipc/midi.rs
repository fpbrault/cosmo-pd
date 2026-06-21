use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<PluginIpcResponse, String> {
    let midi_learn = &context.shared_state.midi_learn;
    match req {
        PluginIpcRequest::SetMidiLearnMode(mode) => {
            // TODO: remove this diagnostic once cross-format MIDI learn mode behavior is verified.
            append_log_debug(&format!("ipc_set_midi_learn_mode mode={}", mode));
            midi_learn.set_learn_mode(*mode);
            Ok(PluginIpcResponse::SetMidiLearnMode)
        }
        PluginIpcRequest::SetPendingMidiLearnParam(param_key) => {
            midi_learn.set_pending_param_key(param_key.clone());
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
            midi_learn.replace_binding(crate::session_state::MidiLearnBinding {
                param_key: param_key.clone(),
                channel: *channel,
                cc: *cc,
            });
            Ok(PluginIpcResponse::AddMidiBinding)
        }
        PluginIpcRequest::RemoveMidiBinding(binding) => {
            midi_learn.remove_binding(binding);
            Ok(PluginIpcResponse::RemoveMidiBinding)
        }
        PluginIpcRequest::ClearMidiLearnBindings => {
            midi_learn.clear_bindings();
            Ok(PluginIpcResponse::ClearMidiLearnBindings)
        }
        PluginIpcRequest::GetMidiLearnState => {
            Ok(PluginIpcResponse::GetMidiLearnState(midi_learn.snapshot()))
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
