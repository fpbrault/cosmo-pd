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

Control/UI mirroring, MIDI learn persistence, factory preset application, and
preset session mutation belong in `drain_render_control_events()`. The drain is
called from control paths such as `CzEditor::idle()` and does not depend on the
editor being open for audio correctness. Audio changes can therefore be
eventually consistent in UI/DAW mirrors without compromising rendering.

The existing telemetry writers use nonblocking `try_write()` and skip the
update on contention. Blocking `lock()` or `write()` calls remain forbidden.

## Audio-thread checklist

- [ ] No heap allocation after initialization.
- [ ] No blocking locks or calls.
- [ ] No filesystem, database, or network access.
- [ ] No preset, session, MIDI settings, or global settings mutation.
- [ ] No `ArcSwap` publication or full `SynthParams` clone.
- [ ] No unbounded `Vec` growth.
- [ ] Fixed buffers have a documented overflow policy and atomic diagnostics.
- [ ] The full process path is covered by debug `assert_no_alloc` tests.

Run `bun run check:rt-safety` for the static forbidden-operation scan. The
normal `bun run lint` command runs it automatically. Plugin tests cover empty
blocks, note events, `ParamChange`, host parameter polling, UI snapshots,
preset reset, mapped CC, and dense mapped CC input through the real callback.
