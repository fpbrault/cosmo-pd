# ADR 0002: Trait boundaries and extensibility strategy

## Status

Accepted

## Date

2026-05-01

## Context

The framework must support synths with very different DSP requirements while remaining easy to use and efficient in hot render paths. Overusing traits and generics can make DSP code difficult to read, hard to debug, and awkward for implementers. Underusing them can hard-code PD-101 assumptions into the framework.

The project needs a practical rule for where traits and generics belong.

## Decision

Use traits and generics at the synth boundary, and prefer concrete reusable components inside the shared runtime.

The framework will define trait-based extension points for:

- synth definition and associated types
- voice DSP implementation
- optional modulation target resolution
- optional voice stealing policy overrides
- optional host-facing telemetry adapters

The framework will prefer concrete reusable types for:

- LFOs
- ADSR envelopes
- generic step-envelope runtimes
- smoothers and slew utilities
- phase accumulators
- voice allocation helpers
- modulation matrices and route storage

Dynamic dispatch in hot audio paths should be avoided unless a specific extension need justifies it. Public APIs should make simple synths easy to implement with defaults, while allowing advanced synths to override behavior where necessary.

## Consequences

### Positive

- The framework remains performant and readable in DSP-critical code.
- New synths can customize meaningful behavior without modifying core internals.
- Common infrastructure remains ergonomic for straightforward synths.

### Negative

- Some advanced synth use cases may require new extension points over time.
- Generic trait design must be kept intentionally small to avoid API sprawl.

## Alternatives considered

### Trait-abstract all DSP primitives

Rejected because it would make the framework harder to use and maintain, especially in render-path code.

### Use only concrete types and no extension traits

Rejected because it would make the framework brittle and force new synths to conform too tightly to the first implementation.

### Rely primarily on trait objects and plugin-style registration

Rejected for hot-path components because it adds overhead and obscures type relationships that should remain static.

## Implementation notes

- Define the smallest synth-boundary trait set that can migrate PD-101 and support the example synth.
- Use the example synth to identify missing extension points before stabilizing the API.
- Keep synth-specific terminology out of trait names and associated types.