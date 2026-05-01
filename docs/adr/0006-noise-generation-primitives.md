# ADR 0006: Reusable noise generation primitives in purr-synth-core

## Status

Accepted

## Date

2026-05-01

## Context

Noise sources are common across subtractive synths, percussion, sample-and-hold modulation, texture generators, and effects. Noise behavior must be deterministic when used in tests, preset rendering, or offline bounces, but may also need runtime seeding for natural variation.

The framework needs reusable noise generation without imposing a particular musical interpretation.

## Decision

Provide deterministic noise primitives in `purr-synth-core` as optional DSP utilities.

The framework should support seedable white noise, simple colored-noise helpers where useful, sample-and-hold sources, and reproducible pseudo-random utilities for modulation. Synth implementations decide how noise is routed, filtered, mixed, and exposed as parameters.

## Consequences

### Positive

- Tests and offline rendering can rely on reproducible noise behavior.
- Synths avoid duplicating common PRNG and sample-and-hold plumbing.
- Noise remains an optional utility rather than a required synth feature.

### Negative

- Seed handling must be explicit to avoid surprising changes in rendered output.
- More advanced noise colors or stochastic processes may still belong in synth-specific code.

## Alternatives considered

### Use host randomness directly

Rejected because it makes tests and offline parity harder to reproduce.

### Treat noise only as an oscillator variant

Rejected because noise is also useful for modulation and effects, not only audio-rate sound generation.

## Implementation notes

- Prefer small seedable generators with predictable output.
- Keep sample-and-hold utilities separate from synth-specific modulation vocabularies.
- Avoid depending on platform randomness in hot render paths.