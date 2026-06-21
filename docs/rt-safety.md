# Audio-thread realtime safety

`CzPlugin::process()` is a realtime callback. Code reachable from it must have
bounded execution time and must not allocate, block, persist data, mutate preset
sessions, or publish full shared parameter snapshots.

The callback enters `RtContext`, which marks the thread with the debug/test RT
sentinel. Known control-only operations call `assert_not_rt()` and the main
control drain additionally requires a `ControlContext`, so it cannot be called
with an RT token by mistake.

Host automation and mapped MIDI CC input become fixed-size `CosmoInputEvent`
entries. `AudioRuntime::block_input_events` is an `ArrayVec`; excess events are
dropped and counted in `block_event_overflows` rather than growing the heap.
The processor keeps uniquely owned, preallocated parameter storage for scalar
RT changes and bounded full-snapshot copies (up to 256 modulation routes and
256 bytes per macro label). Oversized snapshots are rejected and counted in
`parameter_snapshot_rejections` rather than allocating.

Control/UI mirroring, MIDI learn persistence, preset session mutation, and the
control-side preset/session sync for host program changes belong in
`drain_render_control_events()`. The drain is currently called from control
paths such as `CzEditor::idle()` and `state_changed()`. Host program changes
still apply their factory preset to the processor immediately on the audio
thread via `apply_factory_preset_realtime()`, which uses a bounded preloaded
snapshot copy (`factory_preset_params()` returns a `&'static SynthParams`
preloaded on the control thread via `preload_factory_presets()`). UI/session
mirroring remains eventually consistent until a control drain runs.

Dense host automation and CC traffic is mirrored through fixed atomic
mailboxes. Each DAW parameter and MIDI channel/CC source retains only its
latest value until the next control drain, so repeated writes cannot overflow
or allocate on the audio thread. `coalesced_param_updates` and
`coalesced_cc_updates` count overwritten intermediate values; downstream UI
queue pressure is tracked separately by `ui_queue_overflows`.

The processor retains one private, preallocated `Arc<SynthParams>` root.
Rendering temporarily clones that root to give the optimizer an immutable
snapshot distinct from mutable DSP state. RT writes use `Arc::get_mut` only
after the temporary render clone has been dropped, and the root is never
published or replaced, so those writes cannot clone or free parameter storage.

The existing telemetry writers use nonblocking `try_write()` and skip the
update on contention. Blocking `lock()` or `write()` calls remain forbidden.

## Static scan and runtime tests

`bun run check:rt-safety` scans the direct bodies of declared RT functions for
forbidden operations. The scan is a backstop, not a proof — it only inspects
direct function bodies and is not call-graph aware, so transitive allocations
through helper functions are not detected. Runtime `assert_no_alloc` tests
remain the source of truth for realistic callback paths. Plugin tests cover
empty blocks, note events, `ParamChange`, host parameter polling, UI snapshots,
preset reset, mapped CC, dense mapped CC input, host program changes through
the real callback, and bounded `copy_params_for_realtime` snapshots.

## Audio-thread checklist

- [ ] No heap allocation after initialization.
- [ ] No blocking locks or calls.
- [ ] No filesystem, database, or network access.
- [ ] No preset, session, MIDI settings, or global settings mutation.
- [ ] No `ArcSwap` publication or full `SynthParams` clone.
- [ ] No unbounded `Vec` growth.
- [ ] Fixed buffers have a documented overflow policy and atomic diagnostics.
- [ ] The full process path is covered by debug `assert_no_alloc` tests.
