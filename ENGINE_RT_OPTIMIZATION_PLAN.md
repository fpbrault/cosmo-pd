# Cosmo Synth Engine Real-Time Optimization Plan

> Research cross-references: OctaSine SIMD architecture, awesome-audio-dsp RT-safe library patterns.

## Phase 1: Eliminate Per-Sample Heap Allocations (CRITICAL)

**Problem:** `modulated_line_params()` (`voice/modulation.rs:331-356`) clones `LineParams` every sample. `LineParams` contains `Option<Vec<AlgoControlValueV1>>` where `AlgoControlValueV1` has a `String` field. At 48kHz x 2 lines = **96,000+ heap allocs/sec**. When env-step modulation is active, `apply_env_step_modulation()` also clones `StepEnvData` up to 6 times per sample.

**Strategy:** Convert `AlgoControlValueV1` from `Vec<String>`-based to a fixed-size array, and make `modulated_line_params` mutate a pre-allocated scratch buffer instead of cloning.

**Changes:**

1. **Replace `Option<Vec<AlgoControlValueV1>>` with `[Option<AlgoControlValueV1>; MAX_ALGO_CONTROLS]`** in `params/line.rs`
   - `AlgoControlValueV1.id: String` becomes `AlgoControlId` (a `Copy` enum or `CompactString`) + `value: f32`
   - Define `MAX_ALGO_CONTROLS = 8` (already resolved to `[f32; 8]` at runtime)
   - This makes `LineParams` a **fixed-size, `Copy`-able struct** with zero heap allocation on clone

2. **Replace `modulated_line_params` cloning with in-place mutation** using a pre-allocated scratch `LineParams` on `CosmoProcessor`:
   - Add `line1_scratch: LineParams` and `line2_scratch: LineParams` fields to `CosmoProcessor`
   - Change `modulated_line_params` to `apply_modulation(&self, line: &LineParams, scratch: &mut LineParams, ...) -> &LineParams` — copies scalar fields, applies modulation to scratch, returns reference
   - Since `LineParams` is now `Copy` (fixed-size), the "copy" is a single memcpy, no heap alloc

3. **Similarly fix `apply_env_step_modulation`** — once `StepEnvData.steps` is already a fixed `[EnvStep; 8]` array (it already is), the clone is just a memcpy. Verify `StepEnvData` is `Copy` or make it so.

4. **Add `assert_no_alloc` guard** in `process()` (debug builds) to catch future regressions:
   - Add `assert_no_alloc` dev dependency
   - Wrap the per-sample loop body in `assert_no_alloc(|| { ... })`

**Files:** `params/line.rs`, `voice/modulation.rs`, `processor/process.rs`, `processor/mod.rs`, `generators/mod.rs` (pre_resolve_controls), `params/synth_params.rs`, `wasm.rs` (wire format compatibility)

**Risk:** Wire format change for `AlgoControlValueV1`. Since the WASM bridge sends JSON, the `Serialize`/`Deserialize` impls need to handle both old (`Vec`) and new (`array`) formats, or break compat with a version bump in `SynthPresetV1`.

---

## Phase 2: Real-Time Safety Foundation (HIGH)

**Problem:** No tooling to detect RT violations, no denormal protection, and raw pointer workaround in process loop.

**Changes:**

1. **Add `no_denormals` guard** to `process()`:
   - `unsafe { no_denormals(|| { /* entire process loop */ }) }`
   - Prevents ~100x slowdowns from denormal floats in IIR/feedback paths

2. **Replace raw pointer with `Arc::clone`** in `process.rs` lines 133/140/226:
   - `let params = Arc::clone(&self.params);` at top, use `&*params` throughout
   - Eliminates all `unsafe` from the hot path

3. **Add `rtsan-standalone` `#[nonblocking]`** to `process()`:
   - Marks the function for RealtimeSanitizer
   - Add as dev dependency with `RTSAN_ENABLE=1` test CI job

**Files:** `processor/process.rs`, `processor/mod.rs`

---

## Phase 3: Block-Level Modulation Cache (HIGH)

**Problem:** `mod_cache.compute()` iterates all routes and fills the entire values array **every single sample** (`process.rs:66`). Mod matrix routes rarely change between samples — only the source values (LFO, etc.) change.

**Strategy:** Move `ModMatrixCache` from per-sample to block-level caching.

**Changes:**

1. **Separate route structure from values** in `params/cache.rs`:
   - `ModMatrixCache` becomes `ModMatrixRouteCache` (precomputed route->destination mapping) + `ModMatrixValueCache` (per-sample values)
   - Route cache is rebuilt only when `SynthParams` change (via `set_shared_params`)
   - Value cache is updated per-sample but only needs to recompute `f32` multiplications, no route iteration

2. **Pre-compute `pre_resolve_controls` at block boundaries** when algo controls don't change:
   - Cache the `[f32; 8]` control arrays on `CosmoProcessor`
   - Invalidate only when `SynthParams` change

**Files:** `params/cache.rs`, `processor/process.rs`, `processor/mod.rs`

---

## Phase 4: True SIMD Voice Rendering (HIGH)

**Problem:** Only final voice-sum accumulation uses SIMD (`add4`). Each `render_voice` call is entirely scalar. The `SimdBackend` match dispatch on every operation prevents LLVM from specializing.

**Strategy (inspired by OctaSine):** Use `duplicate` crate to generate SIMD-specialized render functions that process 2 or 4 samples through the entire voice pipeline at once.

**Changes:**

1. **Introduce `duplicate` crate** and create `voice/render_simd.rs` that generates `render_voice_batch<S: SimdType>` functions

2. **Extend `SimdType` trait** with DSP operations needed for voice rendering:
   - `fast_sin`, `fast_cos` (via `sleef-trig` for SIMD, `libm` for scalar)
   - `clamp`, `abs`, `min`, `max`, `select` (mask-based conditional)
   - `mul_add` (FMA)

3. **Block-process voices**: Instead of `render_voice` returning one `f32`, compute N voices at once using SIMD registers — this is the OctaSine pattern where `AudioGenData<W>` holds `[VoiceData<W>; N]` and SIMD operations process W samples simultaneously

4. **Add `sleef-trig` dependency** for SIMD-optimized sine/cosine (avoids scalar `libm::sinf` in the hot path)

5. **Fix AVX2 backend** to use `__m256` (256-bit, 8xf32) instead of `__m128` (128-bit, 4xf32)

**Implement incrementally:**

- **Phase 4a:** Add `sleef-trig` + `mul_add` to `SimdType` trait, fix AVX2
- **Phase 4b:** Batch envelope advance (N voices at once)
- **Phase 4c:** Batch phase/waveform generation (the big win)

**Files:** `simd/mod.rs`, `simd/sse2.rs`, `simd/avx2.rs`, `simd/wasm_simd.rs`, `voice/render.rs`, `voice/modulation.rs`, new `voice/render_simd.rs`

---

## Phase 5: Voice Clone Optimization (MEDIUM)

**Problem:** `Voice::clone()` on mono note changes copies ~200+ bytes including two `[f32; 2048]` Karpunk buffers (16KB per clone).

**Changes:**

1. **Use `KarpunkState` sharing** via `Arc<[f32; 2048]>` or `basedrop::Shared`:
   - Karpunk buffers are reset on note-off; they don't need deep copies during mono note stacking
   - `Voice::clone()` can share the buffers via `Arc` and only allocate new ones when the voice is actually triggered

2. **Or simpler:** share the buffer reference and clear-on-write (COW):
   - Add a `karpunk_generation: u32` counter; clone shares the same `Arc<[f32; 2048]>`, increments generation on mutation

**Files:** `voice/mod.rs`, `generators/karpunk.rs`

---

## Phase 6: WASM Bridge Parameter Update Optimization (MEDIUM)

**Problem:** Every parameter change triggers `JSON.stringify(params)` comparison in `WorkletSynthEngineAdapter`. Also, `set_params()` parses full JSON on every update.

**Changes (in `cosmo-pd101`):**

1. **Replace JSON dedup with dirty-flag tracking:** Each Zustand field sets a dirty flag; worklet adapter sends only changed fields
2. **Or use `triple_buffer`** for sharing `SynthParams` between threads:
   - Main thread writes to triple buffer; worklet reads latest without allocation
   - Eliminates `JSON.stringify` entirely

**Files:** `packages/cosmo-pd101/features/synth/engine/workletSynthEngineAdapter.ts`, `packages/cosmo-pd101/features/synth/hooks/useSynthParamsToWorklet.ts`

---

## Phase 7: Build & Release Optimizations (LOW)

1. **Enable LTO in release profile** — `Cargo.toml [profile.release] lto = true` -> significant WASM size reduction
2. **Re-enable `wasm-opt`** with `wasm-opt = true` in `[package.metadata.wasm-pack.profile.release]`
3. **Remove dead code:** `lookup_tables.rs` (unused `Log10Table`, `ConstantPowerPanTable`, `SineApproximationTable`), `batch_cache.rs` (unused), `modulation.rs` dead SIMD functions (`mod_values_for_destinations4/8`)
4. **Add `#[inline]` hints** on hot-path functions in `generators/*.rs` (`warp_phase`, `sample_base_wave`)

---

## Implementation Order

| Phase | Impact | Effort | Depends On |
|-------|--------|--------|------------|
| Phase 1 | Critical | Medium | — |
| Phase 2 | High (safety) | Low | — |
| Phase 3 | High (perf) | Medium | — |
| Phase 4a | High (perf) | Medium | Phase 2 |
| Phase 4b | High (perf) | Large | Phase 4a |
| Phase 4c | Very High | Large | Phase 4b |
| Phase 5 | Medium | Small | — |
| Phase 6 | Medium | Medium | Phase 1 |
| Phase 7 | Low | Small | — |

**Phases 1, 2, and 7 can run in parallel. Phase 3 is independent. Phase 4 is sequential. Phases 5-6 are independent.**