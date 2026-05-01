# PRD: Synth Core Framework

## 1. Product overview

### 1.1 Document title and version

- PRD: Synth Core Framework
- Version: 0.1

### 1.2 Product summary

This project introduces a reusable Rust synth framework that extracts the generic runtime, modulation, voice management, and DSP utility capabilities from the existing `cosmo-synth-engine` package while preserving the current Cosmo PD-101 behavior. The framework must make it practical to migrate the current phase distortion engine without regressions, while also making future synth engines faster to build and easier to maintain.

The framework will support multiple synthesis styles by separating common engine responsibilities from synth-specific DSP implementations. Version 1 must prove that the abstraction is real rather than speculative by delivering three outcomes: a successful migration of the current PD-101 engine onto the framework, a clean and stable API for new synth implementations, and a working Minimoog-style example synth with a simple `egui` UI demonstrating subtractive synthesis on the new core.

## 2. Goals

### 2.1 Business goals

- Reduce the cost and risk of building additional synth products on top of the current Rust audio engine work.
- Preserve existing investment in PD-101 DSP logic, WASM export paths, and plugin integration while improving maintainability.
- Establish a reusable internal platform for future synth development rather than creating one-off engines per instrument.
- Improve engineering velocity for new synth prototyping by providing common runtime, modulation, envelope, and utility building blocks.

### 2.2 User goals

- Let synth engine developers build a new synth by implementing synth-specific DSP logic rather than rebuilding voice allocation, modulation plumbing, and engine lifecycle code.
- Let maintainers migrate PD-101 onto the framework without audible regressions or API churn in downstream consumers.
- Let UI and host integrators continue to use stable bindings and runtime metadata while the engine internals evolve.
- Let developers validate the framework with a second synth example that is structurally different from PD-101.

### 2.3 Non-goals

- Creating a universal parameter schema that forces all synths into the PD-101 model.
- Abstracting every DSP primitive behind traits in v1.
- Rebuilding all frontend synth editors or plugin UX as part of this initiative.
- Shipping a production-ready Minimoog clone with full preset compatibility, exact circuit emulation, or commercial-grade UI polish.
- Solving every future synth requirement upfront before the second implementation exists.

## 3. User personas

### 3.1 Key user types

- Core audio engine maintainer
- Synth implementation developer
- Plugin and host integration developer
- Prototyping and R&D developer

### 3.2 Basic persona details

- **Core audio engine maintainer**: Maintains the Rust DSP engine, ensures migration safety, preserves performance, and manages framework evolution.
- **Synth implementation developer**: Builds new synth engines by composing framework primitives with synth-specific voice DSP, modulation targets, and patch models.
- **Plugin and host integration developer**: Integrates engines with WASM, plugin hosts, editor IPC, and runtime telemetry surfaces.
- **Prototyping and R&D developer**: Uses the framework to quickly stand up and validate new synthesis ideas before productization.

### 3.3 Role-based access

- **Framework maintainer**: Can evolve core traits, shared runtime, migration utilities, and package boundaries.
- **Synth implementer**: Can build a synth on top of the framework using published APIs and extension points.
- **Integration developer**: Can consume framework-compatible engines through supported bindings and telemetry APIs without touching core internals.

## 4. Functional requirements

- **Reusable engine runtime** (Priority: P0)

  - The framework must provide reusable engine lifecycle management for sample-rate initialization, event handling, note on/off, sustain, mono/poly behavior, legato behavior, and render orchestration.
  - The framework must support configurable voice counts and voice stealing policies.
  - The framework must allow synth implementations to override or extend note allocation behavior when required.

- **Voice and modulation framework** (Priority: P0)

  - The framework must provide common modulation source handling for global and per-voice sources.
  - The framework must support synth-defined modulation source and destination identifiers.
  - The framework must support modulation routing, scaling, clamping, polarity handling, and smoothing.
  - The framework must avoid encoding PD-101-specific modulation destinations in core APIs.

- **Reusable DSP utility layer** (Priority: P0)

  - The framework must provide common DSP utilities such as phase wrapping, interpolation, LFOs, sample-and-hold, de-zippering, smoothing, gain helpers, and headroom utilities.
  - The framework must expose reusable envelope runtimes for common cases including ADSR and generic multi-step envelopes.
  - The framework must allow synths to ignore provided utilities and substitute custom DSP behavior when needed.

- **Synth implementation boundary** (Priority: P0)

  - The framework must define a clean synth implementation API centered on synth-specific patch data, voice state, DSP render logic, and optional telemetry.
  - The framework must support synth-specific voice DSP that can be substantially different from PD-101, including subtractive synth architectures.
  - The framework must keep synth semantics such as PD-101 DCO/DCW/DCA, 8-step envelopes, and line select logic outside core abstractions.

- **PD-101 migration support** (Priority: P0)

  - The framework must support migration of the existing `cosmo-synth-engine` implementation with no intentional audio behavior regressions.
  - The migration must preserve existing downstream integration expectations for WASM builds, TypeScript bindings, and plugin embedding to the extent feasible in v1.
  - The project must define compatibility boundaries, expected internal refactors, and acceptable API changes.

- **Example synth implementation** (Priority: P1)

  - The project must include a Minimoog-style example synth that exercises the framework with a different synthesis topology.
  - The example synth must demonstrate oscillators, mixer, filter, amplifier, ADSR-style envelopes, modulation, and voice allocation using framework APIs.
  - The example synth must include a simple `egui` UI sufficient to prove end-to-end usability and inspect key parameters and runtime behavior.

- **Observability and developer ergonomics** (Priority: P1)

  - The framework should provide optional runtime telemetry and debug state surfaces for voices, modulators, and synth-specific state.
  - The framework should provide documentation and example code for common synth construction patterns.
  - The framework should provide sensible defaults so simple synths require minimal boilerplate.

- **Package and repository integration** (Priority: P1)

  - The project must define a package structure that supports reuse across Rust-native, WASM, and plugin-host contexts.
  - The framework must fit within the current monorepo build system and avoid unnecessary disruption to Bun, Cargo workspace, and plugin build flows.

## 5. User experience

### 5.1 Entry points & first-time user flow

- A maintainer creates or migrates a synth by depending on the framework and implementing the required synth boundary traits and types.
- A developer can start from the example synth or a template implementation rather than reading PD-101 internals first.
- A host integrator can continue to instantiate a compatible engine through a stable wrapper layer.
- A contributor can inspect ADRs and docs to understand where generic code ends and synth-specific logic begins.

### 5.2 Core experience

- **Define a synth boundary**: A developer defines synth-specific patch, voice state, modulation identifiers, and render logic.

  - This ensures the framework is flexible without forcing a universal synth model.

- **Use the runtime and utilities**: A developer reuses built-in engine lifecycle, modulation routing, envelopes, and DSP helpers.

  - This reduces repeated infrastructure work and keeps new synth implementation effort focused on musical behavior.

- **Integrate with hosts**: A developer exposes the synth to WASM, plugin, or desktop contexts through a thin compatibility layer.

  - This ensures downstream integration stays practical during and after migration.

- **Validate with examples and tests**: A maintainer verifies PD-101 parity and confirms the Minimoog-style synth works naturally on the same framework.

  - This ensures the abstraction has practical value beyond the original synth.

### 5.3 Advanced features & edge cases

- Support synth-specific voice stealing or note priority rules.
- Support synths that need custom envelope types or bypass framework envelopes entirely.
- Support per-voice stateful algorithms and unusual DSP graphs.
- Support modulation targets that are not simple parameter writes.
- Support no-std or constrained runtime considerations where feasible within current project requirements.
- Support optional debug telemetry without imposing runtime overhead on release paths.

### 5.4 UI/UX highlights

- Documentation should clearly separate core APIs from synth-specific implementation surfaces.
- The example synth UI should prioritize inspectability and clarity over visual polish.
- Runtime telemetry surfaces should be easy to consume in a debug UI or host wrapper.
- Default APIs should minimize generic complexity for straightforward synth implementations.

## 6. Narrative

The team currently has a working PD-101 engine, but much of the runtime, modulation, and voice orchestration logic is entangled with synth-specific behavior. This project creates a practical synth framework by extracting the reusable runtime kernel, keeping PD-101-specific semantics in a dedicated implementation layer, and proving the design with a second synth that uses a different architecture. The result is a codebase where future synths can be built faster, with less duplicated infrastructure and with fewer migration risks to existing products.

## 7. Success metrics

### 7.1 User-centric metrics

- A developer can create a basic new synth implementation on the framework without modifying framework internals.
- A maintainer can understand the core-vs-synth boundary from the docs and ADRs without reading all PD-101 DSP code.
- A host integrator can continue to build and run the migrated PD-101 engine with no major workflow regressions.

### 7.2 Business metrics

- PD-101 migration completes without requiring a rollback to the pre-framework architecture.
- The code required to bootstrap a second synth is materially smaller than building from scratch on the current engine.
- Future synth exploration can begin from a stable internal platform rather than a one-off fork.

### 7.3 Technical metrics

- Existing PD-101 build targets continue to pass relevant build, lint, and test checks after migration.
- Audio behavior parity tests or golden comparisons show no material regressions for PD-101 across agreed coverage areas.
- Framework APIs remain small and stable enough that the example synth does not require framework-internal patches for routine functionality.
- The Minimoog-style example synth renders audio correctly and exposes a working `egui` interface for parameter control.

## 8. Technical considerations

### 8.1 Integration points

- `packages/cosmo-synth-engine` as the current migration source.
- WASM export and binding surfaces used by the web app and shared synth library.
- Plugin embedding via `packages/cosmo-pd101-plugin` and Beamer integration.
- Cargo workspace and Bun build scripts at the repo root.

### 8.2 Data storage & privacy

- No new user data model is required for v1.
- PD-101 preset serialization and transport formats must remain compatible unless explicitly versioned.
- Example synth patch data may be local and internal-only for v1.

### 8.3 Scalability & performance

- Core abstractions must not introduce avoidable per-sample dynamic dispatch in hot audio paths.
- The framework should favor concrete reusable components internally and use traits at the synth boundary.
- The architecture should allow synths with materially different DSP graphs and state needs.
- The framework should keep memory allocation and per-voice runtime predictable.

### 8.4 Potential challenges

- Overfitting the framework to PD-101 semantics during extraction.
- Over-abstracting DSP paths and harming ergonomics or performance.
- Breaking WASM or plugin integration while changing internal package boundaries.
- Designing modulation and parameter APIs that are generic enough without becoming vague or overly complex.
- Under-scoping the Minimoog-style example and failing to validate the framework with a genuinely different synth.

## 9. Milestones & sequencing

### 9.1 Project estimate

- Large: 6-10 weeks

### 9.2 Team size & composition

- 2-3 engineers: Rust DSP/framework engineer, integration engineer, optional UI/tooling support for `egui` example and host validation

### 9.3 Suggested phases

- **Phase 1**: Define architecture and package boundaries (1-2 weeks)

  - Key deliverables.
  - ADR set approved.
  - Module and crate target structure documented.
  - Migration constraints and compatibility assumptions documented.

- **Phase 2**: Extract internal core runtime in-place (2-3 weeks)

  - Key deliverables.
  - Shared runtime modules separated from PD-101-specific code within the current engine package.
  - Core trait and utility APIs introduced.
  - PD-101 compiles on the new internal boundaries.

- **Phase 3**: Migrate PD-101 to the framework API (2-3 weeks)

  - Key deliverables.
  - PD-101 implementation uses the framework boundary rather than old direct coupling.
  - Build and parity validation completed.
  - WASM and plugin integration verified.

- **Phase 4**: Build example subtractive synth and `egui` UI (1-2 weeks)

  - Key deliverables.
  - Minimoog-style example synth implemented.
  - Simple `egui` interface wired to parameters and runtime state.
  - Framework gaps identified and resolved.

- **Phase 5**: Stabilize documentation and developer onboarding (1 week)

  - Key deliverables.
  - Usage docs, examples, and migration notes completed.
  - Remaining framework follow-up items captured for post-v1 work.

## 10. User stories

### 10.1 Extract reusable engine runtime

- **ID**: SCF-001
- **Description**: As a framework maintainer, I want reusable engine lifecycle and voice management APIs so that synth implementations do not need to rebuild common note and render orchestration.
- **Acceptance criteria**:

  - The framework exposes reusable note event and render orchestration interfaces.
  - Mono, poly, sustain, and legato behaviors are available through framework runtime components.
  - Voice allocation behavior can be configured or overridden without editing framework internals.

### 10.2 Preserve PD-101 behavior during migration

- **ID**: SCF-002
- **Description**: As a maintainer, I want to migrate PD-101 onto the new framework so that existing functionality is preserved while internal architecture improves.
- **Acceptance criteria**:

  - The migrated PD-101 engine builds successfully in the current workspace.
  - Agreed PD-101 parity checks pass after migration.
  - PD-101-specific DSP logic remains outside the generic framework layer.

### 10.3 Provide synth-specific implementation boundaries

- **ID**: SCF-003
- **Description**: As a synth developer, I want a clear synth implementation API so that I can build a new synth without changing framework code for basic use cases.
- **Acceptance criteria**:

  - The framework defines synth-specific extension points for patch data, voice state, modulation identifiers, and render logic.
  - A new synth can be instantiated using documented framework APIs.
  - Core APIs do not require PD-101 terms such as DCO, DCW, DCA, or line select.

### 10.4 Reuse common modulation infrastructure

- **ID**: SCF-004
- **Description**: As a synth developer, I want reusable modulation routing and utility primitives so that I can focus on synth behavior instead of plumbing.
- **Acceptance criteria**:

  - The framework supports synth-defined modulation sources and targets.
  - Modulation routing includes enablement, amount, clamping, and smoothing behavior.
  - A synth can route modulation to custom destinations without framework source edits.

### 10.5 Provide common envelope and DSP utilities

- **ID**: SCF-005
- **Description**: As a synth developer, I want reusable envelopes and DSP helpers so that common synth elements are easy to implement.
- **Acceptance criteria**:

  - The framework provides reusable ADSR and generic step-envelope runtime support.
  - The framework provides reusable LFO, smoothing, phase, and interpolation utilities.
  - A synth can opt out of framework-provided envelope implementations where needed.

### 10.6 Keep hot-path performance practical

- **ID**: SCF-006
- **Description**: As a maintainer, I want the framework to avoid avoidable hot-path overhead so that reuse does not compromise DSP performance.
- **Acceptance criteria**:

  - Framework design documentation explicitly limits dynamic dispatch in hot render paths.
  - The implementation uses concrete reusable components internally unless extension requires a trait boundary.
  - Migration validation does not identify unacceptable regressions attributable to framework overhead.

### 10.7 Maintain downstream integration compatibility

- **ID**: SCF-007
- **Description**: As an integration developer, I want the migrated engine to remain usable from current WASM and plugin contexts so that framework adoption does not break delivery pipelines.
- **Acceptance criteria**:

  - Existing build flows for relevant engine consumers remain operational or are updated with documented migration steps.
  - WASM-facing and plugin-facing wrappers remain available for PD-101 in v1.
  - Any intentional integration changes are documented and versioned.

### 10.8 Validate with a structurally different synth

- **ID**: SCF-008
- **Description**: As a framework maintainer, I want a Minimoog-style example synth so that the framework proves it can support a different synthesis architecture.
- **Acceptance criteria**:

  - The example synth uses the shared framework rather than private one-off infrastructure.
  - The example synth includes subtractive-synthesis elements such as oscillators, mixer, filter, envelopes, and amplifier flow.
  - The example implementation identifies any framework gaps discovered during real usage.

### 10.9 Provide a simple inspection UI for the example synth

- **ID**: SCF-009
- **Description**: As a developer evaluating the framework, I want a simple `egui` UI for the example synth so that I can verify usability and parameter wiring end to end.
- **Acceptance criteria**:

  - The example synth includes a working `egui` interface.
  - The UI can modify core synth parameters and trigger audible changes.
  - The UI is sufficient for engineering validation even if it is not production-polished.

### 10.10 Document the architecture and decisions

- **ID**: SCF-010
- **Description**: As a contributor, I want clear documentation and ADRs so that I can understand framework goals, constraints, and extension patterns quickly.
- **Acceptance criteria**:

  - The repository contains a PRD covering scope, goals, and success criteria.
  - The repository contains ADRs for major architectural decisions.
  - The documentation explains migration boundaries and how to implement a new synth on the framework.

### 10.11 Support security and safe integration boundaries

- **ID**: SCF-011
- **Description**: As a maintainer, I want clear API and module boundaries so that synth implementations and host integrations do not bypass validated engine surfaces or accidentally expose unstable internals.
- **Acceptance criteria**:

  - Public framework APIs are intentionally scoped and documented.
  - Internal-only modules are not required for routine synth implementation.
  - Host-facing wrappers avoid exposing unstable implementation details by default.

### 10.12 Enable incremental adoption

- **ID**: SCF-012
- **Description**: As a maintainer, I want an incremental migration path so that the team can adopt the framework without a risky big-bang rewrite.
- **Acceptance criteria**:

  - The migration plan supports extracting common code in place before crate separation if needed.
  - PD-101 can continue to run during intermediate migration stages.
  - The project documents which milestones must be completed before extracting a dedicated core crate.