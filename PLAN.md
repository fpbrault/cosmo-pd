# MIDI Learn Refactor + DAW→Webview Sync Plan

## Overview

Two workstreams:

1. **DAW → Webview Param Sync** — fix a gap where DAW automation changes never reach the webview
2. **MIDI Learn Refactor** — move MIDI learn authority from JS (Zustand) to Rust (engine), breaking backward compat

---

## A) DAW → Webview Param Sync

### Problem

When the DAW automates a parameter, `apply_rt_param_change()` in `process()` updates `cached_rt_synth_params` + processor but **not** the `synth_params` ArcSwap. The idle loop reads `synth_params`, so the webview never sees DAW automation.

### Fix

| File | Change |
|------|--------|
| `lib.rs` | At end of `process()` event processing, store `cached_rt_synth_params` into `synth_params` / `rt_synth_params` ArcSwaps |
| `gui.rs` | Add `last_sent_params_json: Mutex<String>` to `CzEditor`, dedup in `push_params_to_webview()` |

- **No version counter increment** — the JSON dedup cache prevents infinite push loops.
- `synth_params_version` stays unchanged, so `process()` does not re-enter the merge path every block.

---

## B) MIDI Learn Refactor

Move MIDI learn storage, capture logic, and apply logic from the JS Zustand store into the Rust engine. Clean break — no backward compat.

### B1. `session_state.rs`

| Action |
|--------|
| Remove `MidiMapping` struct and `midi_mappings` field from `PluginSessionState` |
| Add new types: `MidiLearnBinding { param_key, channel, cc }`, `MidiLearnState { learn_mode, pending_param_key, bindings, version }` |
| Replace `midi_mappings` field with `midi_learn_state: MidiLearnState` |

### B2. `lib.rs`

| Action |
|--------|
| Remove `SharedMidiMappings`, add `SharedMidiLearnState` |
| New IPC handlers: `setMidiLearnMode`, `setPendingMidiLearnParam`, `addMidiBinding`, `removeMidiBinding`, `updateMidiBinding`, `getMidiLearnState` |
| Remove `setMidiMappings` / `getMidiMappings` IPC handlers |
| Rewrite `handle_host_event()` catch-all: learn mode + pending → capture binding, else → apply |
| Rewrite `apply_midi_mapping()` and `mapped_param_key_for_cc()` to read from `SharedMidiLearnState` |
| Update `save_state()` / `load_state()` for the new `MidiLearnState` type |
| Thread `SharedMidiLearnState` through `handle_ipc_invoke` + `CzPlugin::editor()` |

### B3. `gui.rs`

| Action |
|--------|
| Replace `midi_learn_bindings: SharedMidiMappings` → `midi_learn_state: SharedMidiLearnState` |
| Add version-check in idle loop → push state to webview via `__czOnMidiLearnState` |

### B4. `IPCBridge.ts` / `auv3Bridge.ts`

| Action |
|--------|
| Add: `__czSetMidiLearnMode`, `__czSetPendingMidiLearnParam`, `__czAddMidiBinding`, `__czRemoveMidiBinding`, `__czUpdateMidiBinding`, `__czGetMidiLearnState`, `__czOnMidiLearnState` |
| Remove: `__czSetMidiMappings`, `__czGetMidiMappings` |

### B5. `usePluginSynthRuntime.ts`

| Action |
|--------|
| Replace `loadInitialMidiMappings` / `subscribeMidiMappings` with midi learn state push subscription |

### B6. `midiLearnStore.ts`

| Action |
|--------|
| Strip `persist`, `lastCapturedCc`, `captureMidiCc`, `DEFAULT_BINDINGS`, `removeBindingsForParam` |
| Actions become thin IPC calls: `setLearnMode` → `__czSetMidiLearnMode`, etc. |
| State populated from `__czOnMidiLearnState` Rust pushes |

### B7. `useMidiLearnBindings.ts`

| Action |
|--------|
| Remove entirely from plugin path (keep file if needed for web/site runtime) |

### B8. Tests

| Action |
|--------|
| Update test helpers + all midi test functions for new types |
| Add tests: learn capture creates binding, binding persisted round-trip, etc. |

---

## Out of Scope

- **Web/site runtime** — MIDI learn in the browser-only mode is untouched. Future PR.
- **CC queue** — `flush_midi_cc_queue_to_webview` / `__czOnMidiCc` stays as-is (useful for debugging).
