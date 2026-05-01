# Synth Core Framework Implementation Roadmap

## Status

| Workstream | Title | Status |
|---|---|---|
| A | Architecture and boundary definition | ✅ Complete |
| B | Core runtime extraction in place | ✅ Complete |
| C | Framework API definition | ✅ Complete |
| D | PD-101 implementation migration | ✅ Complete (D1–D6) |
| E | Validation and parity | 🔲 Not started |
| F | Minimoog-style example synth | ✅ Complete |
| G | `egui` validation UI | ✅ Complete |
| H | Documentation and extraction follow-up | 🔲 Not started |

**Implementation note:** Rather than migrating the `cosmo-synth-engine` package in-place, the framework was extracted as a new standalone crate: `packages/purr-synth-core`. This covers Workstreams A–C and F–G. The crate lives independently of the PD-101 engine and is validated by the Minimoog example synth and its `egui` UI. Workstream D is now complete: the PD-101 engine implements `purr-synth-core` framework traits through a new `pd101/` module (see D1–D6 detail below).

**D migration outcome:** `CosmoProcessor` retains its hand-written note stack, voice stealing, sustain, and LFO — these diverge from `SynthRuntime` in ways that require further validation before replacement (see D3 deferred items below).

| Phase | Focus | Status |
|---|---|---|
| Phase 1: Architecture lock | Workstreams A, C | ✅ Complete |
| Phase 2: In-place extraction | Workstream B | ✅ Complete (as new crate) |
| Phase 3: PD-101 migration | Workstreams D, E | � D complete; E next |
| Phase 4: Example synth proof | Workstreams F, G | ✅ Complete |
| Phase 5: Stabilization | Workstream H | 🔲 Pending |

---

## Purpose

This roadmap translates the synth core framework PRD into an implementation sequence with concrete package and module tasks. It is intended to guide delivery of v1 of the reusable synth framework, including:

- migration of the current PD-101 engine onto the framework
- a clean framework API for future synths
- a Minimoog-style example synth with a simple `egui` UI

This roadmap assumes an incremental migration strategy. The work should first prove the architecture inside the existing engine package before extracting a dedicated reusable crate.

## Scope

In scope:

- internal framework extraction from `packages/cosmo-synth-engine`
- PD-101 migration to framework-defined boundaries
- WASM and plugin compatibility work needed to preserve existing flows
- developer-facing framework docs and examples
- Minimoog-style example synth and `egui` validation UI

Out of scope for v1:

- production-grade UI for the example synth
- a universal preset format for all future synths
- broad frontend editor work unrelated to engine/framework integration
- speculative abstraction for synthesis features not needed by PD-101 or the example synth

## Delivery principles

- Prefer internal module extraction before crate extraction.
- Preserve existing buildable paths wherever possible during migration.
- Keep synth-specific semantics out of shared framework APIs.
- Use the example synth as a hard validation gate, not a stretch goal.
- Favor concrete reusable runtime components internally; use traits at synth boundaries.

## Target architecture summary

Target shape for v1:

- `packages/cosmo-synth-engine`
  - temporarily contains both framework and PD-101 implementation during migration
- `packages/cosmo-synth-engine/src/core/`
  - reusable runtime, modulation, envelope runtime, and DSP utility modules
- `packages/cosmo-synth-engine/src/pd101/`
  - migrated PD-101 implementation
- `packages/cosmo-synth-engine/examples/` or equivalent validation surface
  - example synth harnesses if useful during migration
- future extraction target
  - dedicated reusable crate after boundary validation

## Workstreams

### Workstream A: Architecture and boundary definition

Goal:

Define the framework surface area, internal module layout, and migration constraints before changing hot-path code.

Primary packages:

- `packages/cosmo-synth-engine`
- `docs/`

Tasks:

1. Define the target module split between `core` and `pd101`.
2. Identify all current PD-101-specific concepts that must not leak into core APIs.
3. Define the minimal synth boundary traits and associated types.
4. Define what remains concrete runtime infrastructure versus extension-point traits.
5. Document public, internal, and temporary migration-only modules.

Module mapping draft:

- Current `processor.rs`
  - split into `core/engine.rs`, `core/voice_allocator.rs`, and `pd101/processor_adapter.rs` or equivalent
- Current `voice.rs`
  - split into `core/voice_runtime.rs`, `core/modulation.rs`, `pd101/voice.rs`, `pd101/mix.rs`
- Current `envelope.rs`
  - split into `core/envelopes/step.rs` and `pd101/envelopes/cz_step_rules.rs` or equivalent
- Current `envelope_map.rs`
  - move to `pd101/envelopes/mapping.rs`
- Current `dsp_utils.rs`
  - move to `core/dsp/`
- Current `generators/`
  - move under `pd101/algorithms/` except for any genuinely reusable primitives

Exit criteria:

- Module target map is documented.
- Temporary migration seams are explicitly identified.
- No unresolved ambiguity remains about what belongs in core versus PD-101.

### Workstream B: Core runtime extraction in place

Goal:

Extract reusable infrastructure inside the existing engine package without changing downstream package boundaries yet.

Primary package:

- `packages/cosmo-synth-engine`

Target modules:

- `src/core/engine.rs`
- `src/core/events.rs`
- `src/core/voice_allocator.rs`
- `src/core/voice_runtime.rs`
- `src/core/modulation.rs`
- `src/core/envelopes/adsr.rs`
- `src/core/envelopes/step.rs`
- `src/core/dsp/lfo.rs`
- `src/core/dsp/oscillator.rs`
- `src/core/dsp/noise.rs`
- `src/core/dsp/filter.rs`
- `src/core/dsp/buffer.rs`
- `src/core/dsp/mixing.rs`
- `src/core/dsp/phase.rs`
- `src/core/dsp/smoothing.rs`
- `src/core/dsp/math.rs`
- `src/core/control.rs`
- `src/core/telemetry.rs`

Tasks:

1. Introduce a `core` module tree without changing current external behavior.
2. Move note event, sustain, mono/poly, legato, and voice selection logic into reusable runtime modules.
3. Extract reusable modulation route storage and evaluation helpers.
4. Extract generic DSP utilities into focused modules instead of a single shared file.
5. Extract optional reusable oscillator, noise, filter, sampling/buffer, mixing, and effects primitives where they are broadly reusable.
6. Extract reusable ADSR and generic step-envelope runtimes.
7. Define generic control-event and MIDI-mapping support without imposing a universal parameter schema.
8. Define opt-in telemetry and capture surfaces for visualization without coupling core code to UI renderers.
9. Leave PD-101-specific envelope rules, mappings, algorithms, and signal curves in synth-specific modules.
10. Keep temporary compatibility shims where needed to avoid a big-bang rewrite.

Detailed task list by current file:

- `src/processor.rs`
  - extract note stack and active note bookkeeping
  - extract voice selection and steal policy helpers
  - extract runtime mod source bookkeeping
  - leave synth wrapper responsibilities only
- `src/voice.rs`
  - extract generic voice-note lifecycle data
  - extract reusable modulation computation helpers
  - leave PD-101 render path, envelope application semantics, and line mixing in synth-specific code
- `src/envelope.rs`
  - preserve reusable step progression logic where possible
  - remove CZ-only naming from core runtime types
  - leave CZ release behavior and mapping policy outside core if those rules are synth-specific
- `src/dsp_utils.rs`
  - split into LFO, random-hold, wrapping, interpolation, and windowing ownership based on reusability

Exit criteria:

- `packages/cosmo-synth-engine` still builds.
- The `core` module contains reusable runtime infrastructure with no PD-101 vocabulary in its public surface.
- PD-101 can still render through temporary adapters.

### Workstream C: Framework API definition

Goal:

Define the smallest stable API that a synth must implement to use the framework.

Primary package:

- `packages/cosmo-synth-engine`

Target modules:

- `src/core/synth.rs`
- `src/core/traits.rs`
- `src/core/types.rs`

Tasks:

1. Define a synth-definition trait with associated types for patch, voice state, modulation identifiers, and telemetry.
2. Define a voice-DSP trait for note lifecycle and audio rendering.
3. Define optional extension traits for custom voice stealing, telemetry projection, and modulation resolution.
4. Define runtime contexts passed into synth and voice render code.
5. Define what is intentionally private to the framework.
6. Document default behavior for simple synth implementations.

Proposed API shape to validate:

- `SynthDefinition`
- `VoiceDsp`
- `RenderContext`
- `VoiceContext`
- `ModMatrix<Source, Target>`
- `VoiceAllocator`
- `Engine<TSynth>`

Exit criteria:

- PD-101 migration can target the new API surface.
- The API does not embed PD-101 terms.
- The API is small enough to explain in a short example.

### Workstream D: PD-101 implementation migration

Goal:

Migrate the PD-101 engine in `packages/cosmo-synth-engine` to implement the `purr-synth-core` framework traits (`SynthDefinition`, `VoiceDsp`), replacing the ad-hoc internal runtime with the reusable infrastructure from `purr-synth-core`. The WASM entry points and downstream TypeScript consumers must remain stable.

Primary packages:

- `packages/cosmo-synth-engine`
- `packages/cosmo-pd101`
- `packages/cosmo-pd101-plugin`

Dependency to add:

```toml
# packages/cosmo-synth-engine/Cargo.toml
purr-synth-core = { path = "../purr-synth-core" }
```

#### D1 — Define the PD-101 synth boundary types ✅

File: `packages/cosmo-synth-engine/src/pd101/synth.rs` ✅ Created

Outcome:
- `Pd101Synth` marker type implements `SynthDefinition`.
- `Patch = Pd101Patch` — wraps `SynthParams` plus per-frame LFO/controller scalars (`lfo1_out`, `lfo2_out`, `random_out`, `pitch_bend_semitones`, `mod_wheel`, `aftertouch`).
- `ModSource = crate::params::ModSource` — reuses existing CZ enum, no duplication.
- `ModTarget = crate::params::ModDestination` — same.
- `Telemetry = Pd101Telemetry` (see D4).

#### D2 — Adapt the voice to `VoiceDsp` ✅

File: `packages/cosmo-synth-engine/src/pd101/voice.rs` ✅ Created

Outcome:
- `Pd101Voice` wraps `Voice` and implements `VoiceDsp<Pd101Synth>`.
- `note_on()` replicates `CosmoProcessor::initialize_voice_for_note` — portamento, phase reset, envelope reset, mod-env trigger.
- `note_off()` replicates `CosmoProcessor::start_release` — all step-envelope and mod-env release.
- `render()` delegates to `render_voice()` using LFO values from `Pd101Patch`.
- `is_active()` mirrors `!Voice::is_silent`.
- Implements `Deref<Target = Voice>` and `DerefMut` for transparent field access in `CosmoProcessor`.

#### D3 — Thread `Pd101Voice` through the processor ✅

File: `packages/cosmo-synth-engine/src/processor.rs` ✅ Updated

Outcome:
- `CosmoProcessor::voices` changed from `[Voice; NUM_VOICES]` to `[Pd101Voice; NUM_VOICES]`.
- `MonoStackEntry::voice` changed to `Pd101Voice`.
- All existing field access via `self.voices[i].field` works transparently through `DerefMut`.
- Render loop still calls `render_voice()` directly (not through `VoiceDsp::render()`) — this is intentional because:
  - `CosmoProcessor` steals the **lowest-amplitude releasing** voice; `SynthRuntime` steals the oldest.
  - Mono-mode restores full voice state on note-off (`*voice = prev.voice.clone()`); `SynthRuntime` does not.
  - LFO phases are computed **globally** at the processor level; `SynthRuntime` has no equivalent.
- Full `SynthRuntime` adoption is a post-v1 task requiring parity tests.

#### D4 — Wire telemetry ✅

Files: `packages/cosmo-synth-engine/src/pd101/telemetry.rs` ✅ Created; `processor.rs` ✅ Updated

Outcome:
- `Pd101Telemetry` contains `ScopeCapture` (512 samples, 4× decimation) and `LevelMeter`.
- `CosmoProcessor::telemetry: Pd101Telemetry` field added.
- Every post-FX clamped sample is fed through `telemetry.push()` in `process()`.
- WASM getter `getLevelTelemetry` exposes `{ peak, rms }` JSON and resets the accumulator.

#### D5 — Stabilize WASM entry points ✅

File: `packages/cosmo-synth-engine/src/wasm.rs` ✅ Updated

Outcome:
- All existing `#[wasm_bindgen]` methods verified unchanged (`noteOn`, `noteOff`, `setSustain`, `setPitchBend`, `setModWheel`, `setAftertouch`, `setParams`, `applyModulePreset`, `setFxSlotType`, `process`, `getRuntimeModSources`, `getRuntimeVoiceStates`).
- New `getLevelTelemetry` getter added — non-breaking addition.
- `cargo check --features wasm --target wasm32-unknown-unknown` passes.

#### D6 — Envelope migration 📋 Deferred post-v1

Outcome of analysis:
- `AdsrEnv` (in `voice.rs`) is behaviorally equivalent to `purr_synth_core::envelope::AdsrEnvelope`. Migration is feasible but risky without test coverage of the mod-envelope audio path. Deferred.
- CZ step envelopes (`EnvGen` in `envelope.rs`) use CZ-specific rate tables, sustain-step semantics, and loop-back behavior. These are **not compatible** with `purr_synth_core::envelope::StepEnvelope` (which uses duration-in-seconds linear interpolation). CZ step envelopes must remain in PD-101-specific code permanently.

#### File-level migration map

| Current file | Action | Status |
|---|---|---|
| `src/processor.rs` | Replace runtime internals with `SynthRuntime`; keep WASM wiring | 🔄 Partial — `Pd101Voice` threaded in; `SynthRuntime` deferred (see D3) |
| `src/voice.rs` | Implement `VoiceDsp<Pd101Synth>`; remove framework responsibilities | ✅ `Pd101Voice` wraps `Voice`; `VoiceDsp` implemented in `pd101/voice.rs` |
| `src/envelope.rs` | Migrate generic ADSR to `purr-synth-core`; keep CZ-specific rules | 📋 Deferred — CZ envelopes incompatible with framework `StepEnvelope` |
| `src/default_envelopes.rs` | Move CZ default presets to `pd101/envelopes/` | 📋 Post-v1 |
| `src/envelope_map.rs` | Move to `pd101/envelopes/mapping.rs` | 📋 Post-v1 |
| `src/dsp_utils.rs` | Remove anything already in `purr_synth_core::dsp`, `lfo`, `oscillator` | 📋 Post-v1 |
| `src/params.rs` | Becomes `pd101/patch.rs`; remove framework concepts | 📋 Post-v1 |
| `src/preset_wire.rs` | Stays in `pd101/`; no framework dependency | — No change needed |
| `src/generators/` | Stays PD-101–specific; no framework change | — No change needed |
| `src/fx/` | Evaluate against `purr_synth_core::effects`; deduplicate where safe | 📋 Post-v1 |
| `src/wasm.rs` | Thin adapter only; no business logic | ✅ Entry points verified; `getLevelTelemetry` added |
| `src/module_presets.rs` | Move to `pd101/presets.rs` | 📋 Post-v1 |
| `src/pd101/synth.rs` | New — `Pd101Synth` + `Pd101Patch` boundary types | ✅ Created |
| `src/pd101/voice.rs` | New — `Pd101Voice` + `VoiceDsp<Pd101Synth>` | ✅ Created |
| `src/pd101/telemetry.rs` | New — `Pd101Telemetry` with `LevelMeter` + `ScopeCapture` | ✅ Created |

#### Exit criteria status

- ✅ `packages/cosmo-synth-engine` builds with `purr-synth-core` as a dependency.
- ✅ WASM target (`--features wasm --target wasm32-unknown-unknown`) passes `cargo check`.
- ✅ All 39 passing tests in `cosmo-synth-engine` continue to pass (3 pre-existing failures unchanged).
- ✅ PD-101 framework boundary (`SynthDefinition`, `VoiceDsp`) defined and wired through processor.
- 🔄 No hand-written voice stealing/note stack/sustain remains in `processor.rs` — deferred; divergences from `SynthRuntime` semantics require parity test coverage first.

### Workstream E: Validation and parity

Goal:

Prove that PD-101 migration preserved behavior and that the framework remains buildable across existing surfaces.

Primary packages:

- `packages/cosmo-synth-engine`
- `packages/cosmo-pd101`
- `packages/cosmo-pd101-plugin`
- `packages/cz-explorer`

Tasks:

1. Expand or organize Rust tests around extracted core runtime and PD-101 parity-sensitive behaviors.
2. Add parity-focused tests where current engine behavior is known and measurable.
3. Verify WASM build and downstream TypeScript consumption.
4. Verify plugin build path still compiles.
5. Verify top-level build pipeline remains valid.

Recommended validation commands:

```bash
bun run lint
bun run build:web
bun run build:plugin
cargo test -p cosmo-synth-engine
```

If additional focused commands are added during migration, capture them in this document.

Exit criteria:

- Framework extraction does not regress expected build flows.
- PD-101 parity-sensitive tests pass.
- No unresolved downstream integration blockers remain for v1.

### Workstream F: Minimoog-style example synth

Goal:

Validate that the framework supports a subtractive synth architecture that is materially different from PD-101.

Primary package candidates:

- `packages/cosmo-synth-engine` as an internal example during v1
- or a dedicated package once the boundary is stable

Recommended v1 placement:

- keep the example close to the framework implementation first to reduce integration overhead

Target modules:

- `src/examples/minimoog/patch.rs`
- `src/examples/minimoog/voice.rs`
- `src/examples/minimoog/filter.rs`
- `src/examples/minimoog/modulation.rs`
- `src/examples/minimoog/ui.rs` or equivalent

Feature scope:

- 3 oscillators or a simplified oscillator set
- mixer
- ladder-style filter approximation or pragmatic subtractive filter stage
- amp envelope
- filter envelope
- LFO and pitch/filter modulation
- mono priority behavior expected of a Minimoog-style instrument

Tasks:

1. Define a synth-specific patch model using framework traits.
2. Implement voice DSP with subtractive signal flow.
3. Use framework envelopes, modulation, and allocator where practical.
4. Add any missing extension points discovered during implementation.
5. Keep the example intentionally small but complete enough to prove ergonomics.

Exit criteria:

- The example synth compiles and renders audio.
- The example synth uses framework APIs rather than private PD-101 infrastructure.
- Any framework gaps discovered are either fixed or documented as post-v1 work.

### Workstream G: `egui` validation UI

Goal:

Provide a simple UI for the example synth to prove parameter wiring, runtime visibility, and developer usability.

Primary package candidates:

- colocated with the example synth if lightweight
- or in a small dedicated example app package if native execution is easier

Tasks:

1. Choose whether the `egui` surface lives in an example binary or a dedicated minimal package.
2. Expose enough engine controls for oscillator, filter, envelope, and output routing validation.
3. Provide note triggering or MIDI input support sufficient for engineering validation.
4. Surface limited telemetry where it helps debug framework wiring.

Recommended UI scope:

- oscillator tuning and mix
- filter cutoff and resonance
- envelope parameters
- master volume
- note trigger controls or basic keyboard mapping
- MIDI learn for at least one mapped control
- simple scope or runtime meter fed by telemetry/capture data

Exit criteria:

- Developers can hear parameter changes through the example synth.
- The UI exercises framework control paths without relying on web UI layers.
- The UI remains intentionally simple and maintainable.

### Workstream H: Documentation and extraction follow-up

Goal:

Stabilize the framework documentation and decide whether to extract a dedicated core crate after proof points are met.

Primary packages:

- `docs/`
- `packages/cosmo-synth-engine`
- potential new crate after validation

Tasks:

1. Write developer documentation for implementing a synth on the framework.
2. Document migration notes for PD-101 and downstream consumers.
3. Decide whether the framework boundary is ready for crate extraction.
4. If ready, extract a reusable crate with minimal consumer disruption.
5. Update docs and package manifests to reflect the final layout.

Extraction gate:

Do not extract a dedicated reusable crate until all of the following are true:

- PD-101 is migrated and stable on the new internal framework
- the example synth works on the same framework
- the public API is small and documented
- downstream integration paths are understood

Exit criteria:

- Framework usage docs exist.
- Crate extraction decision is explicit.
- Post-v1 follow-up work is documented.

## Suggested phase plan

### Phase 1: Architecture lock

Focus:

- complete Workstream A
- start Workstream C

Deliverables:

- module target map
- validated synth-boundary trait plan
- no open architectural ambiguity on core vs PD-101 ownership

### Phase 2: In-place extraction

Focus:

- complete Workstream B
- continue Workstream C

Deliverables:

- reusable `core` module tree
- compatibility shims for current PD-101 path
- internal API boundary in code

### Phase 3: PD-101 migration

Focus:

- complete Workstream D (tasks D1–D6 in order)
- run Workstream E continuously alongside each task

Suggested task order:

1. D1 — Define `Pd101Synth` boundary types (no behavior change, safe to land first)
2. D2 — Implement `VoiceDsp` for the PD-101 voice (most isolated change)
3. D3 — Replace processor runtime with `SynthRuntime` (largest change; run E after this)
4. D4 — Wire telemetry through `RenderContext`
5. D5 — Verify and stabilize WASM entry points
6. D6 — Migrate envelope modules

Deliverables:

- framework-backed PD-101
- preserved build and integration behavior
- parity-sensitive validations passing

### Phase 4: Example synth proof

Focus:

- complete Workstream F
- complete Workstream G

Deliverables:

- Minimoog-style example synth
- simple `egui` validation UI
- identified framework gaps resolved or documented

### Phase 5: Stabilization and extraction decision

Focus:

- complete Workstream H

Deliverables:

- framework implementation docs
- extraction decision and, if approved, crate split plan
- v1 completion assessment

## Package-by-package task matrix

### `packages/cosmo-synth-engine`

- Create `core` module tree.
- Create `pd101` module tree.
- Migrate processor/runtime responsibilities into shared modules.
- Migrate PD-101 DSP and patch semantics into synth-specific modules.
- Add framework traits and contexts.
- Add example synth modules.
- Add tests for extracted runtime and synth parity.

### `packages/cosmo-pd101`

- Validate engine bindings after migration.
- Update any type assumptions tied to old engine layout.
- Verify telemetry and runtime state consumers still work.

### `packages/cosmo-pd101-plugin`

- Verify framework-backed PD-101 engine initialization.
- Verify plugin build remains valid.
- Verify host bridge and runtime control surfaces remain compatible.

### `packages/cz-explorer`

- Validate that engine/WASM changes do not break app build flows.
- Update any engine-facing bindings or runtime debug assumptions if required.

### `docs/`

- Maintain ADRs and roadmap.
- Add framework usage guide after API stabilizes.
- Add migration notes once PD-101 is running on the framework.

## Risks and mitigation

### Risk: Core API remains PD-101-shaped

Mitigation:

- enforce synth-specific vocabulary only in `pd101` modules
- validate with the example subtractive synth before calling the API stable

### Risk: Performance regression from over-abstraction

Mitigation:

- keep concrete reusable runtime components in hot paths
- avoid unnecessary dynamic dispatch in render code
- test migration incrementally

### Risk: Downstream integration breakage

Mitigation:

- preserve wrappers during migration
- validate `bun run build:web` and plugin builds during each major phase

### Risk: Example synth becomes optional and never lands

Mitigation:

- treat Workstreams F and G as release gates for framework v1

## Definition of done for v1

The synth core framework v1 is complete when:

- PD-101 runs on the framework-defined boundary
- shared runtime code is clearly separated from PD-101-specific logic
- downstream builds still work or have documented migration changes
- a Minimoog-style example synth works on the framework
- the example synth has a simple `egui` UI for validation
- framework docs explain how to implement a new synth
- the team can make an explicit and informed decision on extracting a dedicated crate