use std::sync::Arc;

use arc_swap::ArcSwap;
use cosmo_synth_engine::params::{canonical_parameter_key, parameter_range_for_key};

use crate::diagnostics::append_log_warn;
use crate::runtime_state::{SharedMidiMappingSnapshot, SharedMidiMappings};

#[derive(Clone)]
pub struct MidiMappingSnapshotEntry {
    pub param_key: &'static str,
    pub channel: i32,
    pub cc: i32,
    pub min: f32,
    pub max: f32,
}

#[derive(Default)]
pub struct MidiMappingSnapshot {
    pub entries: Vec<MidiMappingSnapshotEntry>,
}

impl MidiMappingSnapshot {
    pub fn from_bindings(bindings: &[crate::session_state::MidiLearnBinding]) -> Self {
        let entries = bindings
            .iter()
            .filter_map(|binding| {
                let param_key = canonical_parameter_key(&binding.param_key)?;
                let (min, max) = parameter_range_for_key(&binding.param_key)?;
                Some(MidiMappingSnapshotEntry {
                    param_key,
                    channel: binding.channel,
                    cc: binding.cc,
                    min,
                    max,
                })
            })
            .collect();
        Self { entries }
    }
}

#[derive(Clone)]
pub struct MidiLearnService {
    pub state: SharedMidiMappings,
    pub mapping_snapshot: SharedMidiMappingSnapshot,
}

impl MidiLearnService {
    pub fn new(state: SharedMidiMappings, mapping_snapshot: SharedMidiMappingSnapshot) -> Self {
        Self {
            state,
            mapping_snapshot,
        }
    }

    pub fn persist(&self) {
        crate::rt_safety::assert_not_rt("persist MIDI learn bindings");
        persist_midi_learn_bindings(&self.state);
    }

    pub fn publish_mapping_snapshot(&self) {
        crate::rt_safety::assert_not_rt("publish MIDI mapping snapshot");
        if let Ok(state) = self.state.lock() {
            self.mapping_snapshot
                .store(Arc::new(MidiMappingSnapshot::from_bindings(
                    &state.bindings,
                )));
        }
    }
}

pub fn new_shared_mapping_snapshot(
    state: &crate::session_state::MidiLearnState,
) -> SharedMidiMappingSnapshot {
    Arc::new(ArcSwap::new(Arc::new(MidiMappingSnapshot::from_bindings(
        &state.bindings,
    ))))
}

pub fn persist_midi_learn_bindings(midi_learn_state: &SharedMidiMappings) {
    crate::rt_safety::assert_not_rt("persist MIDI learn bindings");
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
