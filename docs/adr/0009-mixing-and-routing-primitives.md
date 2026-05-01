# ADR 0009: Mixing and routing primitives in purr-synth-core

## Status

Accepted

## Date

2026-05-01

## Context

Every synth needs some form of mixing: voice summing, oscillator mixing, stereo panning, gain staging, headroom management, dry/wet blending, and sometimes buses or sends. The exact routing graph, however, is synth-specific.

The framework should help synths avoid repeated gain and summing mistakes while not forcing a universal audio graph.

## Decision

Provide small mixing and routing primitives in `purr-synth-core`, but leave full signal graph ownership to synth implementations.

The core should include reusable stereo frame types, gain helpers, pan laws, dry/wet blending, soft limiting, equal-power crossfades, headroom helpers, and simple summing utilities. Synths define their own oscillator mixers, voice mixers, bus topology, send routing, and product-specific gain staging.

## Consequences

### Positive

- Common mix math becomes tested and consistent.
- Synths can preserve distinct routing architectures.
- The framework can support both simple examples and more complex products incrementally.

### Negative

- Without a universal graph, each synth still needs routing code.
- Shared helpers must be carefully named to avoid implying one canonical mix architecture.

## Alternatives considered

### Add a full audio graph to the framework

Rejected for v1 because it would be a large abstraction that may not match PD-101, subtractive examples, plugin constraints, or future synths.

### Keep all mixing code synth-local

Rejected because pan laws, gain helpers, frame math, and headroom utilities are low-risk reusable components.

## Implementation notes

- Keep hot-path helpers concrete and inline-friendly.
- Add graph abstractions only after multiple synths show the same routing needs.
- Treat clipping, headroom, and output limiting as explicit design choices, not hidden framework behavior.