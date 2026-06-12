use crate::diagnostics::append_log_warn;
use crate::runtime_state::SharedMidiMappings;

#[derive(Clone)]
pub struct MidiLearnService {
    pub state: SharedMidiMappings,
}

impl MidiLearnService {
    pub fn new(state: SharedMidiMappings) -> Self {
        Self { state }
    }

    pub fn persist(&self) {
        persist_midi_learn_bindings(&self.state);
    }
}

pub fn persist_midi_learn_bindings(midi_learn_state: &SharedMidiMappings) {
    let bindings = midi_learn_state
        .lock()
        .map(|state| state.bindings.clone())
        .unwrap_or_else(|_| crate::session_state::default_midi_bindings());

    if let Err(error) = crate::global_settings::save_midi_learn_bindings(bindings) {
        append_log_warn(&format!(
            "failed to persist global midi learn bindings: {}",
            error
        ));
    }
}
