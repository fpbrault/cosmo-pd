# Real-time audio testing

The native Rust engine and plugin unit-test binaries install the
`assert_no_alloc` allocator in builds with debug assertions. The allocator
rejects heap allocation and deallocation on the guarded thread. The plugin
suite runs a negative control in a child process and requires an allocator
failure from a deliberate 4096-byte allocation.

| Build | Checks |
| --- | --- |
| Native debug | The engine renders a timed MIDI block under the guard. The plugin runs its full processing callback with note-on and note-off events and publishes telemetry under the guard. The negative control runs by default. |
| Native release (`cargo test --release`) | The allocation tests and checking allocator are compiled out with the standard release profile. Behavioral tests still run. |
| Linux CI | The Rust Tests job runs both native debug suites, including the negative control. Its diagnostic step runs the strict automation and factory program change checks separately so either abort leaves the other scenario runnable. |

Run the default checks with `cargo test -p cosmo-synth-engine` and
`cargo test -p cosmo-pd101-plugin -- --test-threads=1`. Both of these
commands run a native harness directly. DAW wrappers, hosted audio timing and
WASM are outside the allocation coverage of these tests.

## Known callback allocations

Run these strict checks separately. Both currently abort on allocation, so
they are ignored by the default suite and run in a non-blocking diagnostic
step in CI. When [issue #410](https://github.com/fpbrault/cosmo-pd/issues/410)
fixes these paths, remove the ignore attributes and the diagnostic step to
make them required in the default suite.

```sh
cargo test -p cosmo-pd101-plugin --lib automation_does_not_allocate -- --ignored --nocapture
cargo test -p cosmo-pd101-plugin --lib program_change_does_not_allocate -- --ignored --nocapture
```

## Blocking and file access

The allocation guard has no visibility into mutex waits or filesystem calls.
The separate `midi_learn_currently_writes_settings_from_the_callback` test
sends a CC with MIDI Learn armed and reads the temporary settings file
immediately after the callback returns to confirm the synchronous write.
This behavioral test runs in debug and release. Code inspection also finds
that `MidiLearnService::capture_pending_binding` takes the editor state mutex
and that binding updates take the bindings mutex. Issue #410 tracks removing
those callback dependencies and verifying their absence.
