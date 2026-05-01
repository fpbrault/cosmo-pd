# ADR 0004: Reusable filter primitives in purr-synth-core

## Status

Accepted

## Date

2026-05-01

## Context

Cosmo PD-101 does not use a traditional subtractive synth filter in its main voice architecture, but many future synth implementations will. The framework needs to support those synths without forcing filter assumptions into PD-101 or into every synth boundary trait.

Filters are common enough to be worth providing as reusable DSP utilities, but filter topology and character are often central to a synth's identity. A Minimoog-style synth may want ladder behavior, while another synth may need state-variable, one-pole, comb, or entirely custom filtering.

## Decision

Add reusable filter primitives to `purr-synth-core` as optional DSP utilities, not as required framework extension traits.

The initial framework filter layer includes:

- a one-pole low-pass filter for smoothing and lightweight tone shaping
- a topology-preserving state-variable filter with low-pass, high-pass, band-pass, and notch outputs

Synth implementations can use these primitives directly, wrap them in synth-specific voice code, or ignore them and provide custom filter DSP.

## Consequences

### Positive

- Future subtractive synths have a practical starting point without rebuilding basic filters.
- PD-101 remains free of subtractive-synth assumptions.
- Filter character remains synth-owned rather than imposed by the framework.

### Negative

- The framework now owns more DSP utility surface area that must be tested and maintained.
- More specialized filters may still need to be added or implemented synth-locally later.

## Alternatives considered

### Add filter methods to the synth boundary traits

Rejected because not all synths need filters, and requiring filter concepts in the boundary would make the framework more subtractive-synth-shaped than necessary.

### Do not include filter utilities in the framework

Rejected because the Minimoog-style validation synth and many future synths would otherwise duplicate common filter infrastructure.

### Add only a ladder filter immediately

Rejected for v1 because ladder character is synth-specific. A state-variable filter and one-pole filter provide broader reusable coverage while leaving room for a synth-specific ladder later.

## Implementation notes

- Keep filters as concrete reusable types under `purr-synth-core::filter`.
- Avoid dynamic dispatch in per-sample filter paths.
- Treat circuit-modeled filters as synth-specific unless they prove broadly reusable across implementations.