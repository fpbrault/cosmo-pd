# ADR 0007: Effects boundary for purr-synth-core

## Status

Accepted

## Date

2026-05-01

## Context

Many synths include effects such as chorus, delay, reverb, distortion, EQ, compression, and modulation effects. Effects are reusable in principle, but effect chains, parameter models, preset semantics, modulation targets, and host exposure often vary by product.

The framework needs to support effects reuse without forcing one global effects architecture onto every synth.

## Decision

Keep effects as optional reusable DSP components and chain helpers in `purr-synth-core`, while leaving product-specific effect racks and parameter schemas to synth implementations.

The core may provide reusable primitives such as delay lines, all-pass filters, saturators, gain helpers, simple dynamics, and eventually small reference effects. Synths own effect ordering, bypass semantics, modulation destinations, preset serialization, UI metadata, and any product-specific effect character.

## Consequences

### Positive

- Shared effects plumbing can be reused across synths and plugin/web builds.
- Product-specific effect racks stay flexible.
- PD-101's current FX surface can migrate incrementally instead of being redesigned up front.

### Negative

- There may be some duplication until common effect primitives are proven reusable.
- A full generic effect host is deferred and may be needed later.

## Alternatives considered

### Define a universal framework effect rack

Rejected for v1 because it would couple synth products to one routing and preset model before the framework has enough examples.

### Keep all effects outside the framework

Rejected because low-level DSP pieces like delay lines and saturators are broadly reusable.

## Implementation notes

- Start with primitives before full effects.
- Avoid exposing unstable internal effect details through host-facing wrappers.
- Revisit a generic effect-chain API after PD-101 and the example synth both exercise effects.