# ADR 0011: Visualization and telemetry surfaces in purr-synth-core

## Status

Accepted

## Date

2026-05-01

## Context

Synth products often need visualization: oscilloscopes, spectrum views, envelope displays, modulation meters, voice debug panels, tuning views, and performance telemetry. These features are valuable for development and UI feedback, but they must not add avoidable overhead to the audio hot path.

The framework needs a way to support visualization without making UI concerns part of the DSP core.

## Decision

Provide optional telemetry and capture surfaces in `purr-synth-core`, while keeping visualization rendering outside the core.

The framework may provide lightweight ring buffers, downsampled capture helpers, runtime snapshots, voice telemetry adapters, and explicit opt-in debug surfaces. UI layers such as React, egui, plugin webviews, or native hosts are responsible for rendering scopes, meters, charts, and inspectors.

## Consequences

### Positive

- Debugging and UI visualization get stable data surfaces without reaching into synth internals.
- Audio rendering remains decoupled from UI rendering.
- Telemetry can be disabled or minimized in performance-sensitive contexts.

### Negative

- Visualization features require careful allocation and threading boundaries.
- Each host still needs its own renderer and transport glue.

## Alternatives considered

### Put visualization renderers in the framework

Rejected because rendering belongs to host/UI layers and would couple the core to specific frontend technologies.

### Expose arbitrary internal state to UI code

Rejected because it would make migration harder and leak unstable implementation details.

## Implementation notes

- Make telemetry opt-in and explicit.
- Prefer snapshots and bounded buffers over direct references into voice internals.
- Keep capture data formats simple enough for WASM, plugin, and native debug consumers.