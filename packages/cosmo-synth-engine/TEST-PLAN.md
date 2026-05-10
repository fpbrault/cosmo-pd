# cosmo-synth-engine Test Plan

Current: **45 `#[test]` functions across 11 files** — strong core, identifiable gaps.

## Voice & Rendering

### `render.rs` — Hot-path rendering (799 lines, 0 tests)
- [ ] **Add `render_voice()` unit tests** — feed known params, verify output sample for each algorithm
- [ ] **Add zero-cross detection** — verify anti-click logic prevents discontinuities
- [ ] **Add `mix_line_outputs()` edge cases** — line1-only, line2-only, both mixed at various levels
- [ ] **Add `select_line_sources()` tests** — verify correct line routing for each algo
- [ ] **Add envelope advancement** — verify DCO/DCW/DCA envelopes advance correctly for both lines
- [ ] **Add noisy/overloaded output clamping** — push gain to max, verify output doesn't exceed ±1.0

### `modulation.rs` — Modulation computation (0 specific unit tests for helper functions)
- [ ] **Add `env_step_level_destination` arithmetic refactor** — test that refactored version matches current 48-arm table (all 48 combinations)
- [ ] **Add `env_step_rate_destination` same** — test all 48 combinations
- [ ] **Add modulation matrix application** — apply a known modulation route, verify parameter is modulated correctly
- [ ] **Add multiple overlapping modulations** — two sources modulate same destination, verify summation
- [ ] **Add modulation amount clamping** — modulation pushes beyond range, verify clamped

### `voice/mod.rs` — Voice lifecycle (8 tests exist)
- [ ] **Add voice note-on → note-off → release** — full lifecycle test with envelope tracking
- [ ] **Add voice stealing** — 9 notes triggered with 8 voices, verify oldest voice stolen
- [ ] **Add priority (legacy/overlap) modes** — test each priority mode
- [ ] **Add mono mode stack behavior** — mono mode, note changes, verify `MonoStackEntry` management
- [ ] **Add voice reset** — note-off → note-on same voice, verify envelope resets correctly

## Envelope

### `envelope.rs` (450 lines, 8 tests exist at bottom)
Current tests cover: level indexing, sub-level computation, duration edge cases.
- [ ] **Add `advance()` both paths** — releasing path + normal path, verify step transitions
- [ ] **Add envelope sustain phase** — hold at sustain level, advance doesn't move past it
- [ ] **Add envelope release from each phase** — attack → release, decay → release, sustain → release
- [ ] **Add envelope rate = 0** — at release, verify it stays forever
- [ ] **Add repeated `advance()` at audio rate** — call 1000 times, verify envelope converges
- [ ] **Add refactored `compute_step()`** — test that extracted helper produces same results

## Generators

### `generators/mod.rs` (448 lines, 1 test exists — algo name round-trip)
- [ ] **Add `warp_phase()` for each algorithm** — test all 22 algorithms at known phase inputs
- [ ] **Add `resolve_algo_control_value()` bounds** — test control values at min, max, middle
- [ ] **Add sample generation for each algo** — render one sample per algo, verify non-NaN, in-range
- [ ] **Add `render_line_stateless()` edge cases** — zero frequency, DC input, extreme modulation
- [ ] **Add algorithm switching consistency** — same phase/freq → different algo → different output (or same for identity algos)

### `generators/karpunk.rs` (286 lines)
- [ ] **Add Karpunk-specific rendering** — test `render_with_state` produces different output than stateless
- [ ] **Add `requires_state_tick`** — verify state tracking across consecutive samples
- [ ] **Add state reset on note-on** — new note resets any accumulated Karpunk state

## Params

### `params/synth_params.rs` (135 lines, 0 tests)
- [ ] **Add `vibrato_params()` search** — verify finds correct FX slot
- [ ] **Add `phase_mod_params()` search** — verify finds correct FX slot
- [ ] **Add no matching slot** — fixture without vibrato, verify returns None
- [ ] **Add `Default` impl** — if `Default` derived, verify initial state matches expectations

### `params/fx_params.rs` (737 lines, 0 tests)
- [ ] **Add `default_for_type()` for each type** — all 17 variants, verify defaults are sensible (enabled state, reasonable values)
- [ ] **Add `is_enabled()` for each type** — all 17, verify enabled/disabled states
- [ ] **Add `slot_type()` mapping** — all 17 test that type matches expected variant
- [ ] **Add serialization round-trip** — create → serialize → deserialize → verify identical

### `params/ui_meta.rs` (586 lines, 0 tests)
- [ ] **Add `engine_param_default_v1()` for each param** — verify default values are non-NaN, within range
- [ ] **Add `ENGINE_PARAM_UI_META_V1` completeness** — verify all synth params have metadata entries

## FX Processors

### `fx/chain.rs` (240 lines, 0 tests)
- [ ] **Add `sync_from_config()` round-trip** — create config → sync → process sample → verify
- [ ] **Add `process()` for each FX type** — all 17, verify sample passes through (even if identity)
- [ ] **Add FX bypass** — test enabled=false passes sample through unchanged
- [ ] **Add `reset()`** — reset, verify processors return to initial state

### Individual FX modules (delay, distortion, chorus, etc.)
Current: 1 test each for delay, distortion, grain_delay, lofi (2), shimmer_verb — 7 total.
- [ ] **Add chorus test** — missing entirely (0 tests)
- [ ] **Add phaser test** — missing entirely
- [ ] **Add reverb test** — missing entirely
- [ ] **Add FX parameter change during processing** — change params mid-stream, verify no glitch
- [ ] **Add extreme parameter values** — each FX at min/max params, verify stable

## Processor

### `processor/mod.rs` (386 lines, 8 tests exist)
- [ ] **Add `process()` buffer** — feed 64-sample buffer, verify correct number of samples written
- [ ] **Add MIDI note-on/off processing** — send MIDI events through process, verify voices activated/released
- [ ] **Add pitch bend processing** — send pitch bend, verify output pitch shifts
- [ ] **Add modulation wheel processing** — send mod wheel, verify modulation applied
- [ ] **Add poly/mono mode switching** — switch modes during playback, verify correct behavior
- [ ] **Add `runtime_voice_debug_state()` completeness** — verify all voice fields are copied
- [ ] **Add parameter change during processing** — change param while voices are active, verify smooth transition

### `processor/notes.rs` (348 lines, 0 tests)
- [ ] **Add mono stack push/pop** — note-on → note-on → note-off, verify voice stack unwinds correctly
- [ ] **Add `Voice` clone on mono change** — benchmark or assert that clone does not alloc unexpectedly
- [ ] **Add note priority modes** — highest/lowest/most-recent note priority

### `processor/process.rs` (unsafe block)
- [ ] **Add safe refactor test** — replace unsafe pointer deref with safe borrows, verify output matches byte-exact

## DSP Utilities

### `dsp_utils.rs` (2 tests exist)
- [ ] **Add `soft_clip()` edge cases** — 0.0, 1.0, -1.0, very large inputs
- [ ] **Add `db_to_gain()` / `gain_to_db()` round-trip** — known values round-trip correctly
- [ ] **Add interpolation helpers** — linear, cubic at boundaries

## Integration / Perf

### `render-bench.rs` (906 lines bench file, no real tests)
- [ ] **Convert benchmark scenarios to test cases** — extract scenario definitions, run them as assertions instead of benchmarks
- [ ] **Add sanity check for all scenario matrix entries** — each scenario renders without NaN/inf
- [ ] **Add `benchmark_case()` implementation or removal** — currently dead code

## Dead Code

### `generators/mod.rs`
- [ ] **Add test for removed `render_direct_algo_sample()`** — if removed, verify callers still work; if kept, implement and test

## Rust Build / Tooling

- [ ] **Add `cargo test` to CI** — verify it's included in the `test` or `ci` workflow
- [ ] **Add property-based tests** — use `quickcheck` or `proptest` for envelope advancement, modulation matrix, rendering (don't crash on any valid input)
- [ ] **Add `no_std` test profile** — if `no_std` is a build target, run tests in a `no_std` environment
