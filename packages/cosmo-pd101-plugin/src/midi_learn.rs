use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};
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

/// Sentinel value packed into `pending_capture` meaning "no pending capture".
/// A valid CC is 0-127 (7 bits), so channel (0-127) and cc (0-127) fit in
/// 14 bits; `u32::MAX`/`u16::MAX`+1 is unreachable in normal flow.
const NO_PENDING_CAPTURE: u32 = u32::MAX;

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

    fn bindings(&self) -> arc_swap::Guard<Arc<Vec<MidiLearnBinding>>> {
        self.snapshot.load()
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
    /// RT-safe pending MIDI-learn capture slot. Written by the audio thread in
    /// `capture_pending_binding_rt` (atomics only — no alloc, no lock, no
    /// persistence). Drained by the control thread (snapshots, drain, or
    /// editor idle) via `commit_pending_capture`, which performs the actual
    /// in-memory `replace_binding` and global-settings persistence.
    ///
    /// Semantics: `u32::MAX` (NO_PENDING_CAPTURE) means no pending capture.
    /// Otherwise the packed value is `(channel << 7) | cc` (both ≤ 127).
    pending_capture: Arc<AtomicU32>,
    /// Handshake between audio-thread write and control-thread commit. Set to
    /// `true` by `capture_pending_binding_rt` when learn mode is active and a
    /// capture was stashed. Cleared (back to `false`) by
    /// `commit_pending_capture` after draining the slot.
    pending_capture_present: Arc<AtomicBool>,
}

impl MidiLearnService {
    pub fn new(mut state: MidiLearnState) -> Self {
        let bindings = global_midi_bindings(std::mem::take(&mut state.bindings));
        Self {
            editor_state: Arc::new(Mutex::new(state)),
            bindings,
            pending_capture: Arc::new(AtomicU32::new(NO_PENDING_CAPTURE)),
            pending_capture_present: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn snapshot(&self) -> MidiLearnState {
        // Commit any RT-stashed pending capture before returning the snapshot.
        // This guarantees editor/editor-less paths that read `snapshot()` see a
        // capture performed by the audio thread without needing an explicit
        // drain of `render_control_queue`. Persistence happens on the control
        // thread (here), never on RT.
        self.commit_pending_capture();
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

    /// RT-safe accessor: returns a non-allocating `Guard` to the current bindings.
    /// Use instead of `bindings_snapshot()` on the audio thread.
    pub fn bindings(&self) -> arc_swap::Guard<Arc<Vec<MidiLearnBinding>>> {
        self.bindings.bindings()
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

    /// RT-safe: stash `(channel, cc)` into the pending-capture slot so the
    /// control thread can commit it later (`snapshot()` or `drain_render_control_events`).
    ///
    /// Alloc/lock/persistence-free. Called from `handle_cc_side_effects` on RT.
    /// No-op when learn mode is off or no pending param key is set. Stashing
    /// overwrites any older pending capture (last-writer-wins is the intended
    /// MIDI-learn UX).
    pub fn capture_pending_binding_rt(&self, channel: u8, cc: u8) {
        // Cheap atomic check: skip Mutex lock entirely when learn mode is off.
        // The `editor_state` Mutex is NOT held here on RT — this check is
        // best-effort and stale reads just mean an extra pending slot write
        // that `commit_pending_capture` will discard if learn mode flipped off.
        if !self.pending_capture_present.load(Ordering::Relaxed)
            && !self.editor_state_try_learn_mode()
        {
            return;
        }
        let packed = u32::from(channel) << 7 | u32::from(cc);
        self.pending_capture.store(packed, Ordering::Release);
        self.pending_capture_present.store(true, Ordering::Release);
    }

    /// Control thread: drain any RT-stashed pending capture, perform the
    /// in-memory `replace_binding`, and persist to global settings.
    /// Returns `Some(binding)` when a binding was captured and committed.
    ///
    /// NOT RT-safe — takes the editor Mutex, may allocate the binding String,
    /// may persist. Called from `snapshot()` and from the ObservedCc handler
    /// in `drain_render_control_events`.
    pub fn commit_pending_capture(&self) -> Option<MidiLearnBinding> {
        if !self.pending_capture_present.swap(false, Ordering::AcqRel) {
            return None;
        }
        let packed = self
            .pending_capture
            .swap(NO_PENDING_CAPTURE, Ordering::AcqRel);
        // Valid packed value is `(channel << 7) | cc` with both ≤ 127.
        // That keeps the high 18 bits of u32 clear.
        if packed > u32::from(u16::MAX) {
            // Stale or corrupt packed value (shouldn't happen). Treat as no-op.
            return None;
        }
        let channel = ((packed >> 7) & 0x7F) as u8;
        let cc = (packed & 0x7F) as u8;
        let pending = self.editor_state.lock().ok().and_then(|state| {
            state
                .learn_mode
                .then(|| state.pending_param_key.clone())
                .flatten()
        });
        let param_key = pending?;
        let binding = MidiLearnBinding {
            param_key,
            channel: i32::from(channel),
            cc: i32::from(cc),
        };
        if self.bindings.replace_binding(binding.clone()) {
            self.persist();
        }
        Some(binding)
    }

    /// Best-effort non-blocking learn-mode probe for the RT path. Returns
    /// `false` when the lock is contended or learn mode is off.
    fn editor_state_try_learn_mode(&self) -> bool {
        self.editor_state
            .try_lock()
            .map(|state| state.learn_mode)
            .unwrap_or(true)
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
