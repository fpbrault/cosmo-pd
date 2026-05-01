# ADR 0008: Sampling and buffer primitives in purr-synth-core

## Status

Accepted

## Date

2026-05-01

## Context

Sampling can mean several different things in synth engines: delay buffers, wavetable playback, sample playback, granular buffers, capture buffers for visualization, or external audio input. These uses share low-level buffer concerns but differ greatly in product behavior and data ownership.

The framework should support reusable buffer and interpolation primitives without becoming a sampler engine in v1.

## Decision

Add sampling-related support to `purr-synth-core` as low-level buffer utilities rather than a universal sampler model.

The framework may provide ring buffers, delay lines, interpolation helpers, windowing helpers, read cursors, and simple sample-rate conversion utilities. Synth implementations own sample asset formats, streaming policy, voice playback semantics, loop modes, slicing, granular behavior, and persistence.

## Consequences

### Positive

- Effects, visualization, wavetable, and future sample-based synths can reuse safe buffer primitives.
- The framework avoids premature commitment to a full sampler architecture.
- Host integrations retain control over asset loading and memory policy.

### Negative

- A production sampler will still require substantial synth-specific work.
- Buffer APIs must be designed carefully for no-std and allocation-sensitive contexts.

## Alternatives considered

### Build a full sampler abstraction immediately

Rejected because sampling workflows vary too much and are outside the v1 framework proof.

### Leave buffers entirely synth-local

Rejected because delay lines, capture buffers, and interpolation are common across effects and synth voices.

## Implementation notes

- Keep buffer primitives independent from file formats and host I/O.
- Make allocation behavior explicit.
- Treat asset loading and streaming as host or synth concerns, not core runtime concerns.