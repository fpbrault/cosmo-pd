# ADR 0001: Layered synth core architecture

## Status

Accepted

## Date

2026-05-01

## Context

The current `cosmo-synth-engine` package combines reusable engine runtime concerns with PD-101-specific synthesis semantics. This makes it difficult to add new synths without either duplicating infrastructure or extending PD-101-shaped code into areas that should remain generic.

The project needs an architecture that supports migration of the existing PD-101 engine while creating a stable foundation for future synth implementations with substantially different signal flows.

## Decision

Adopt a layered architecture with a small reusable synth core and separate synth-specific implementations.

The reusable synth core will own:

- engine lifecycle and render orchestration
- note and voice allocation runtime
- modulation routing infrastructure
- reusable envelope runtimes and DSP utilities
- optional telemetry and debug surfaces

Synth-specific implementations will own:

- patch and parameter models
- voice-local DSP state and render logic
- synth-specific modulation target vocabularies
- synth-specific envelope semantics and curves
- synth-specific algorithm families and mixing behavior

For v1, the first implementation on this architecture will be the migrated PD-101 engine. A Minimoog-style example synth will validate that the boundary supports a different synthesis topology.

## Consequences

### Positive

- The framework can be reused without imposing PD-101 vocabulary on all synths.
- PD-101 migration can proceed incrementally by moving generic concerns behind clear boundaries.
- A second synth implementation can validate the architecture with real code rather than theoretical abstraction.

### Negative

- The migration introduces short-term structural complexity while old and new boundaries coexist.
- Some currently convenient direct access paths will need to be replaced by intentional interfaces.
- Documentation burden increases because architectural boundaries must be explicit.

## Alternatives considered

### Keep a single engine and add more synth-specific branches

Rejected because this would continue coupling future synths to PD-101-oriented structures and increase maintenance cost.

### Design a fully universal synth model first

Rejected because it would likely overfit speculation, delay migration, and create abstractions not grounded in real implementations.

### Extract a new crate immediately before internal migration

Rejected for v1 because it increases disruption before the core boundary has been validated inside the current engine.

## Implementation notes

- Start by separating `core` and `pd101` modules inside the existing engine package.
- Extract a dedicated reusable crate only after the internal boundary is working and documented.
- Treat the example synth as a validation artifact for the architecture, not as optional polish.