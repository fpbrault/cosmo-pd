# cosmo-synth-engine Refactoring Plan

## High Priority

- [ ] **Remove unsafe block in `process.rs`** (lines 113, 118) — Raw pointer `&self.params` dereferenced inside NUM_VOICES loop. Likely unnecessary with NLL borrow checker since `self.params` and `self.voices[v]` are different fields. Replace with safe borrows.
- [ ] **Break up `render_voice()`** — `render.rs:63-265` (~200 lines, 9 parameters, `#[allow(clippy::too_many_arguments)]`). Split into phases:
  - [ ] `compute_modulation()`
  - [ ] `render_lines()`
  - [ ] `finalize_output()`
- [ ] **Reduce parameters on `mix_line_outputs()`** (18 params) and `select_line_sources()` (16 params) — Both have lint suppression at `render.rs:618-733`. Group related parameters into structs.
- [ ] **Replace 48-arm match statements in `modulation.rs`** (lines 107-163, 165-221) — Both `env_step_level_destination` and `env_step_rate_destination` have manual 48-arm matches mapping `(line, env_kind, step_index)` to `ModDestination`. Replace with arithmetic or lookup table.
- [ ] **Eliminate 17-arm boilerplate in `fx_params.rs`** — `slot_type()`, `is_enabled()`, `default_for_type()` all have full 17-arm matches. Use a derive macro or helper trait to collapse to ~5 lines per method.
- [ ] **Eliminate 17-arm field copy in `fx/chain.rs`** (lines 64-175) — `sync_from_config()` copies fields from each params struct to processor individually for all 17 variants. Create trait `SyncFromParams` to automate.
- [ ] **Remove dead `render_direct_algo_sample()`** — `generators/mod.rs:383-386` — always returns `None`. Either implement or remove.

## Medium Priority

- [ ] **Fix duplicated computation in `envelope.rs::advance()`** (lines 51-181) — Releasing and normal paths both read identical step data (`step_data2`, `step_rate2`, `target_level2`, `frozen_step2`, `duration2`) independently. Extract `compute_step()` helper.
- [ ] **Replace verbose `Voice::new()` with `#[derive(Default)]`** — `voice/mod.rs:79-114` — all fields explicitly initialized to `0.0`/`false`/`None` which are already defaults. Derive `Default` instead (~35 lines saved, except `env_note: 60`).
- [ ] **Consolidate duplicated render logic in Karpunk** — `generators/karpunk.rs:224-259` duplicates blending logic from `render_line_stateless` in `mod.rs:150-189`. Add optional `runtime_sample` parameter to `render_line_stateless` instead.
- [ ] **Extract `warp_phase()` dispatch** — `generators/mod.rs:262-381` — 22-arm match for algorithm dispatch. Consider `HashMap<Algo, fn>` dispatch table or per-module `warp_phase()` method.
- [ ] **Fix `export_specta_bindings.rs` boilerplate** — 60 consecutive `export::<Type>()` calls (lines 51-181). A macro would reduce from 180+ lines to ~30.
- [ ] **Reduce repetitive field copying in `processor/mod.rs`** (lines 79-147) — Manual field-by-field copy from `Voice` to `RuntimeVoiceDebugState`. Derive `Into<RuntimeVoiceDebugState>` for `Voice`.
- [ ] **Optimize `Voice` clone on mono note change** — `processor/notes.rs:177` — full `Voice` (`env_gen`, 20+ fields) cloned on every mono note change. Consider saving only the subset needed by `MonoStackEntry`.

## Low Priority

- [ ] **Extract `FX_SLOT_COUNT` constant** — Hardcoded as `6` in multiple locations: `params/synth_params.rs:86`, `processor/mod.rs:183,190`, `fx/chain.rs:207`. Define once.
- [ ] **Refactor `engine_param_default_v1()`** — `params/ui_meta.rs:511-582` — 50+ arm match creating 9 full default structs just to read single fields. Add trait `fn default_for_key(key: &str) -> Option<f32>`.
- [ ] **Feature-gate `libm` usage** — Throughout codebase: `libm::powf`, `libm::expf`, `libm::sinf` etc. Used for `no_std` compat, but `libm` is slower than std intrinsics. Feature-gate: use std methods when `feature = "std"`.
- [ ] **Fix dead code warning in `render-bench.rs:894`** — `benchmark_case` hidden with `#[cfg_attr(not(test), allow(dead_code))]`. If test-only, use `#[cfg(test)]`.
- [ ] **Fix nightly feature in `render-bench.rs`** — `#![feature(test)]` on line 1 — requires nightly. Gate behind `#[cfg(not(stable))]` or move benchmark to a separate crate.

## Rust Build / Lint

- [ ] **Run `cargo fmt` on unformatted files** — 17 files in `src/` have formatting differences (trailing commas, import grouping, line breaks).
- [ ] **Remove unused imports in test config** — `params/mod.rs:38` — `default_dca_env`, `default_dco_env`, `default_dcw_env` imported but never used (test cfg block).
