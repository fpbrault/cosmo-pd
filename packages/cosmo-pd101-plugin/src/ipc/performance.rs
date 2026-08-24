use super::*;

pub(super) fn handle(
    context: &IpcContext,
    req: &PluginIpcRequest,
) -> Result<PluginIpcResponse, String> {
    let ui_input_queue = &context.shared_state.ui.ui_input_queue;
    match req {
        PluginIpcRequest::NoteOn { note, velocity } => {
            ui_input_queue
                .push(CosmoInputEvent::NoteOn {
                    note: *note,
                    velocity: *velocity,
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::NoteOn)
        }
        PluginIpcRequest::NoteOff { note } => {
            ui_input_queue
                .push(CosmoInputEvent::NoteOff { note: *note })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::NoteOff)
        }
        PluginIpcRequest::Sustain { on } => {
            ui_input_queue
                .push(CosmoInputEvent::ControlChange {
                    channel: 0,
                    cc: 64,
                    value: if *on { 127 } else { 0 },
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::Sustain)
        }
        PluginIpcRequest::PitchBend { value } => {
            ui_input_queue
                .push(CosmoInputEvent::PitchBend { value: *value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::PitchBend)
        }
        PluginIpcRequest::ModWheel { value } => {
            ui_input_queue
                .push(CosmoInputEvent::ControlChange {
                    channel: 0,
                    cc: 1,
                    value: denorm_midi_7bit(*value),
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::ModWheel)
        }
        PluginIpcRequest::Aftertouch { value } => {
            ui_input_queue
                .push(CosmoInputEvent::Aftertouch { value: *value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::Aftertouch)
        }
        PluginIpcRequest::PolyAftertouch { note, value } => {
            ui_input_queue
                .push(CosmoInputEvent::PolyAftertouch {
                    note: *note,
                    value: *value,
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::PolyAftertouch)
        }
        PluginIpcRequest::MacroValue { index, value } => {
            ui_input_queue
                .push(CosmoInputEvent::Macro {
                    index: *index as usize,
                    value: *value,
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::MacroValue)
        }
        PluginIpcRequest::Panic => {
            ui_input_queue
                .push(CosmoInputEvent::Panic)
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(PluginIpcResponse::Panic)
        }
        PluginIpcRequest::SetPerformanceMonitorEnabled(enabled) => {
            context.shared_state.performance.set_enabled(*enabled);
            Ok(PluginIpcResponse::SetPerformanceMonitorEnabled)
        }
        PluginIpcRequest::GetPerformanceMetrics => Ok(PluginIpcResponse::GetPerformanceMetrics(
            context.shared_state.performance.snapshot(),
        )),
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
