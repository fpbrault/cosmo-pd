# Synth Core Framework Implementation Roadmap

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

Move the current engine onto the framework boundary without breaking audio behavior or downstream consumers.

Primary packages:

- `packages/cosmo-synth-engine`
- `packages/cosmo-pd101`
- `packages/cosmo-pd101-plugin`

Target modules:

- `packages/cosmo-synth-engine/src/pd101/patch.rs`
- `packages/cosmo-synth-engine/src/pd101/voice.rs`
- `packages/cosmo-synth-engine/src/pd101/envelopes/`
- `packages/cosmo-synth-engine/src/pd101/algorithms/`
- `packages/cosmo-synth-engine/src/pd101/modulation.rs`
- `packages/cosmo-synth-engine/src/pd101/telemetry.rs`

Tasks:

1. Move PD-101 patch and parameter types behind a synth-specific boundary.
2. Move CZ envelope mapping and behavior into PD-101 modules.
3. Move phase distortion algorithms and line-select logic into PD-101 modules.
4. Implement the framework synth-definition and voice-DSP traits for PD-101.
5. Preserve runtime telemetry needed by existing UI or host surfaces.
6. Keep WASM-facing entry points stable or version them deliberately.

Concrete file migration tasks:

- `src/params.rs`
  - split reusable concepts from PD-101 parameter schema
  - keep PD-101 patch and algorithm-control structures in synth-specific modules
- `src/preset_wire.rs`
  - keep PD-101-only serialization in synth-specific code
- `src/wasm.rs`
  - adapt wrapper to instantiate framework-backed PD-101 engine
- `src/lib.rs`
  - publish intentional public modules only

Downstream tasks:

- `packages/cosmo-pd101`
  - update bindings if engine-facing type names or runtime surfaces change
  - verify no accidental dependency on engine-internal layout
- `packages/cosmo-pd101-plugin`
  - verify plugin still instantiates engine and receives expected telemetry or control surfaces

Exit criteria:

- PD-101 builds on the framework boundary.
- Existing web and plugin flows continue to work or have documented migration changes.
- PD-101-specific logic is no longer mixed into shared runtime modules.

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

- complete Workstream D
- run Workstream E continuously

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