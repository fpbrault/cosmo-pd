use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::{Arc, Mutex, RwLock};

use arc_swap::ArcSwap;

use crate::diagnostics::append_log_warn;
use crate::runtime_state::SharedMidiMappings;
use crate::session_state::{MidiLearnBinding, MidiLearnState};

static GLOBAL_MIDI_BINDINGS: RwLock<Option<Arc<SharedMidiBindings>>> = RwLock::new(None);

struct SharedMidiBindings {
    values: Mutex<Vec<MidiLearnBinding>>,
    snapshot: ArcSwap<Vec<MidiLearnBinding>>,
    version: AtomicU32,
}

impl SharedMidiBindings {
    fn new(bindings: Vec<MidiLearnBinding>) -> Self {
        Self {
            values: Mutex::new(bindings.clone()),
            snapshot: ArcSwap::from_pointee(bindings),
            version: AtomicU32::new(0),
        }
    }

    fn replace_binding(&self, binding: MidiLearnBinding) -> bool {
        self.mutate(|bindings| {
            bindings.retain(|existing| existing.param_key != binding.param_key);
            bindings.push(binding);
        })
    }

    fn remove_binding(&self, binding: &MidiLearnBinding) -> bool {
        self.mutate(|bindings| bindings.retain(|existing| existing != binding))
    }

    fn clear(&self) -> bool {
        self.mutate(Vec::clear)
    }

    fn mutate(&self, update: impl FnOnce(&mut Vec<MidiLearnBinding>)) -> bool {
        let mut bindings = self.values.lock().unwrap();
        let previous = bindings.clone();
        update(&mut bindings);
        if *bindings == previous {
            return false;
        }
        self.snapshot.store(Arc::new(bindings.clone()));
        self.version.fetch_add(1, Ordering::Release);
        true
    }
}

fn global_midi_bindings(initial: Vec<MidiLearnBinding>) -> Arc<SharedMidiBindings> {
    if let Some(bindings) = GLOBAL_MIDI_BINDINGS.read().unwrap().as_ref() {
        return bindings.clone();
    }

    let mut global = GLOBAL_MIDI_BINDINGS.write().unwrap();
    global
        .get_or_insert_with(|| Arc::new(SharedMidiBindings::new(initial)))
        .clone()
}

#[derive(Clone)]
pub struct MidiLearnService {
    editor_state: SharedMidiMappings,
    bindings: Arc<SharedMidiBindings>,
}

impl MidiLearnService {
    pub fn new(mut state: MidiLearnState) -> Self {
        let bindings = global_midi_bindings(std::mem::take(&mut state.bindings));
        Self {
            editor_state: Arc::new(Mutex::new(state)),
            bindings,
        }
    }

    pub fn snapshot(&self) -> MidiLearnState {
        let mut state = self
            .editor_state
            .lock()
            .map(|state| state.clone())
            .unwrap_or_default();
        state.bindings = self.bindings.snapshot.load_full().as_ref().clone();
        state.version = state
            .version
            .wrapping_add(self.bindings.version.load(Ordering::Acquire));
        state
    }

    pub fn bindings_snapshot(&self) -> Arc<Vec<MidiLearnBinding>> {
        self.bindings.snapshot.load_full()
    }

    pub fn version(&self) -> u32 {
        let editor_version = self
            .editor_state
            .lock()
            .map(|state| state.version)
            .unwrap_or_default();
        editor_version.wrapping_add(self.bindings.version.load(Ordering::Acquire))
    }

    pub fn set_learn_mode(&self, mode: bool) {
        if let Ok(mut state) = self.editor_state.lock() {
            state.learn_mode = mode;
            state.version = state.version.wrapping_add(1);
        }
    }

    pub fn set_pending_param_key(&self, param_key: Option<String>) {
        if let Ok(mut state) = self.editor_state.lock() {
            state.pending_param_key = param_key;
            state.version = state.version.wrapping_add(1);
        }
    }

    pub fn replace_binding(&self, binding: MidiLearnBinding) {
        if self.bindings.replace_binding(binding) {
            self.persist();
        }
    }

    pub fn remove_binding(&self, binding: &MidiLearnBinding) {
        if self.bindings.remove_binding(binding) {
            self.persist();
        }
    }

    pub fn clear_bindings(&self) {
        if self.bindings.clear() {
            self.persist();
        }
    }

    pub fn capture_pending_binding(&self, channel: u8, cc: u8) -> bool {
        let pending = self.editor_state.lock().ok().and_then(|state| {
            state
                .learn_mode
                .then(|| state.pending_param_key.clone())
                .flatten()
        });
        let Some(param_key) = pending else {
            return false;
        };
        self.replace_binding(MidiLearnBinding {
            param_key,
            channel: i32::from(channel),
            cc: i32::from(cc),
        });
        true
    }

    fn persist(&self) {
        let bindings = self.bindings.snapshot.load_full().as_ref().clone();
        if let Err(error) = crate::global_settings::save_midi_learn_bindings(bindings) {
            append_log_warn(&format!(
                "failed to persist global midi learn bindings: {}",
                error
            ));
        }
    }

    #[cfg(test)]
    pub fn replace_bindings_for_test(&self, bindings: Vec<MidiLearnBinding>) {
        let _ = self.bindings.mutate(|current| *current = bindings);
    }
}

#[cfg(test)]
pub(crate) fn reset_global_midi_bindings() {
    *GLOBAL_MIDI_BINDINGS.write().unwrap() = None;
}
