# ADR 0003: Incremental migration and validation plan

## Status

Accepted

## Date

2026-05-01

## Context

The framework must be adopted by the existing PD-101 engine without destabilizing current builds or integrations. A big-bang rewrite would carry high regression risk. At the same time, the framework cannot be considered successful unless it supports a second synth with a genuinely different architecture.

The project needs a migration and validation strategy that is low risk and evidence-driven.

## Decision

Adopt an incremental migration plan with two validation tracks: PD-101 parity and second-synth proof.

The migration will proceed in stages:

1. Document target architecture and boundaries.
2. Extract reusable core modules inside the existing engine package.
3. Migrate PD-101 to the new framework APIs while preserving current build targets.
4. Validate integration with WASM and plugin consumers.
5. Implement a Minimoog-style example synth using the framework.
6. Extract a dedicated core crate only after the internal architecture is proven.

The Minimoog-style example synth will include a simple `egui` UI to validate that the framework is usable end to end by a developer who is not relying on PD-101-specific editor assumptions.

## Consequences

### Positive

- Migration risk is reduced by preserving a working path during architectural refactors.
- The second synth provides a concrete test of versatility.
- Crate extraction happens after the architecture is proven rather than before.

### Negative

- Temporary duplication or bridging layers may exist during migration.
- Internal structure may be in flux until the framework boundary stabilizes.

## Alternatives considered

### Big-bang framework rewrite before migration

Rejected because it maximizes regression risk and delays proof that the framework can preserve current behavior.

### Migrate PD-101 only and defer second synth validation

Rejected because a framework proven only against its source implementation is not sufficiently validated.

### Build the second synth first

Rejected because the current production engine still needs a safe migration path and defines the most immediate constraints.

## Implementation notes

- Prefer internal module extraction before crate extraction.
- Maintain explicit parity checks for PD-101 during migration.
- Treat the example synth and `egui` UI as required validation deliverables for v1, not optional follow-up work.