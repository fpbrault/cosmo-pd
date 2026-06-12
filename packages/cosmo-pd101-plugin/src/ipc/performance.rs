use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<serde_json::Value, String> {
    let ui_input_queue = &context.shared_state.ui.ui_input_queue;
    match req {
        PluginIpcRequest::NoteOn { note, velocity } => {
            ui_input_queue
                .push(CosmoInputEvent::NoteOn {
                    note: *note,
                    velocity: *velocity,
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::NoteOff { note } => {
            ui_input_queue
                .push(CosmoInputEvent::NoteOff { note: *note })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::Sustain { on } => {
            ui_input_queue
                .push(CosmoInputEvent::ControlChange {
                    channel: 0,
                    cc: 64,
                    value: if *on { 127 } else { 0 },
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::PitchBend { value } => {
            ui_input_queue
                .push(CosmoInputEvent::PitchBend { value: *value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::ModWheel { value } => {
            ui_input_queue
                .push(CosmoInputEvent::ControlChange {
                    channel: 0,
                    cc: 1,
                    value: denorm_midi_7bit(*value),
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::Aftertouch { value } => {
            ui_input_queue
                .push(CosmoInputEvent::Aftertouch { value: *value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::PolyAftertouch { note, value } => {
            ui_input_queue
                .push(CosmoInputEvent::PolyAftertouch {
                    note: *note,
                    value: *value,
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::MacroValue { index, value } => {
            ui_input_queue
                .push(CosmoInputEvent::Macro {
                    index: *index as usize,
                    value: *value,
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        PluginIpcRequest::Panic => {
            ui_input_queue
                .push(CosmoInputEvent::Panic)
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
