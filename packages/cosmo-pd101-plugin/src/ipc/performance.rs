use super::*;

pub(super) fn handle(
    context: &IpcContext,
    method: &str,
    args: &[serde_json::Value],
) -> Result<serde_json::Value, String> {
    let ui_input_queue = &context.shared_state.ui.ui_input_queue;
    match method {
        "noteOn" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| "noteOn expects an object payload as first argument".to_string())?;
            let note = payload
                .get("note")
                .and_then(serde_json::Value::as_u64)
                .ok_or_else(|| "noteOn payload missing note".to_string())?;
            let velocity = payload
                .get("velocity")
                .and_then(serde_json::Value::as_f64)
                .unwrap_or(0.8_f64) as f32;
            let note = u8::try_from(note).map_err(|_| "noteOn note out of range".to_string())?;

            ui_input_queue
                .push(CosmoInputEvent::NoteOn { note, velocity })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "noteOff" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| "noteOff expects an object payload as first argument".to_string())?;
            let note = payload
                .get("note")
                .and_then(serde_json::Value::as_u64)
                .ok_or_else(|| "noteOff payload missing note".to_string())?;
            let note = u8::try_from(note).map_err(|_| "noteOff note out of range".to_string())?;

            ui_input_queue
                .push(CosmoInputEvent::NoteOff { note })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "sustain" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| "sustain expects an object payload as first argument".to_string())?;
            let on = payload
                .get("on")
                .and_then(serde_json::Value::as_bool)
                .ok_or_else(|| "sustain payload missing on".to_string())?;

            ui_input_queue
                .push(CosmoInputEvent::ControlChange {
                    channel: 0,
                    cc: 64,
                    value: if on { 127 } else { 0 },
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "pitchBend" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "pitchBend expects an object payload as first argument".to_string()
                })?;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "pitchBend payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(CosmoInputEvent::PitchBend { value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "modWheel" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "modWheel expects an object payload as first argument".to_string()
                })?;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "modWheel payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(CosmoInputEvent::ControlChange {
                    channel: 0,
                    cc: 1,
                    value: denorm_midi_7bit(value),
                })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "aftertouch" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "aftertouch expects an object payload as first argument".to_string()
                })?;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "aftertouch payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(CosmoInputEvent::Aftertouch { value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "polyAftertouch" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "polyAftertouch expects an object payload as first argument".to_string()
                })?;
            let note = payload
                .get("note")
                .and_then(serde_json::Value::as_u64)
                .ok_or_else(|| "polyAftertouch payload missing note".to_string())?;
            let note =
                u8::try_from(note).map_err(|_| "polyAftertouch note out of range".to_string())?;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "polyAftertouch payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(CosmoInputEvent::PolyAftertouch { note, value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "macroValue" => {
            let payload = args
                .first()
                .and_then(serde_json::Value::as_object)
                .ok_or_else(|| {
                    "macroValue expects an object payload as first argument".to_string()
                })?;
            let index = payload
                .get("index")
                .and_then(serde_json::Value::as_u64)
                .ok_or_else(|| "macroValue payload missing index".to_string())?
                as usize;
            let value = payload
                .get("value")
                .and_then(serde_json::Value::as_f64)
                .ok_or_else(|| "macroValue payload missing value".to_string())?
                as f32;

            ui_input_queue
                .push(CosmoInputEvent::Macro { index, value })
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        "panic" => {
            ui_input_queue
                .push(CosmoInputEvent::Panic)
                .map_err(|_| "ui input queue is full".to_string())?;
            Ok(serde_json::Value::Null)
        }
        _ => unreachable!("method routed to wrong IPC domain"),
    }
}
