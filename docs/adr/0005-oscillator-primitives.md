# ADR 0005: Reusable oscillator primitives in purr-synth-core

## Status

Accepted

## Date

2026-05-01

## Context

Most synths need oscillators, but oscillator identity varies widely. PD-101 uses phase distortion algorithms, a Minimoog-style synth needs subtractive waveforms, wavetable synths need table readers, and sample-based instruments may not use classic oscillators at all.

The framework should reduce repeated oscillator plumbing without forcing every synth into one oscillator model.

## Decision

Provide reusable oscillator primitives in `purr-synth-core` as optional DSP utilities, not as required synth-boundary traits.

The framework should own small, concrete building blocks such as phase accumulators, sine/saw/square/triangle helpers, anti-aliasing helpers where practical, wavetable readers, oscillator sync utilities, and unison detune helpers.

Synth implementations remain responsible for oscillator topology, voice allocation, tuning policy, waveform selection semantics, algorithm-specific behavior, and any circuit- or instrument-specific character.

## Consequences

### Positive

- New synths can start from tested oscillator utilities instead of rebuilding fundamentals.
- PD-101 phase distortion algorithms remain synth-specific.
- Future synths can use or ignore oscillator utilities based on their architecture.

### Negative

- Oscillator utilities can become a broad surface area if not kept focused.
- High-quality anti-aliasing and wavetable support may require iterative refinement.

## Alternatives considered

### Define a universal oscillator trait

Rejected because oscillator behavior is often central to a synth's identity, and a universal trait would either be too vague or too restrictive.

### Keep all oscillator code synth-local

Rejected because phase accumulation, basic waveform generation, unison support, and wavetable reading are common enough to justify reuse.

## Implementation notes

- Keep oscillator utilities concrete and allocation-free in hot paths.
- Do not move PD-101 algorithm families into core unless a primitive is truly reusable outside PD-101.
- Validate the API with the Minimoog-style example before broadening it.