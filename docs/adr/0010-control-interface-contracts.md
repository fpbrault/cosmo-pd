# ADR 0010: Control interface contracts for purr-synth-core

## Status

Accepted

## Date

2026-05-01

## Context

Synth engines need to be controlled by web UIs, plugin hosts, MIDI devices, automation lanes, presets, and debugging tools. The framework already needs dynamic MIDI mapping, but MIDI is only one control path.

The core must support predictable control updates without imposing a specific UI toolkit, host API, or universal parameter schema.

## Decision

Define framework-level control contracts around typed events, normalized values, smoothing utilities, and synth-defined target identifiers.

The framework should provide generic control event types, MIDI mapping utilities, value normalization helpers, optional smoothing/de-zippering tools, and metadata-friendly target identifiers where useful. Synths own their parameter model, UI metadata, preset schema, host automation IDs, and how control changes are applied to patches or runtime state.

## Consequences

### Positive

- Web, plugin, MIDI, and automation paths can share a common control vocabulary shape.
- Synth-specific parameter models remain free to differ.
- Dynamic MIDI mapping fits cleanly beside other control paths.

### Negative

- Some duplication may remain between synth-specific parameter schemas until more examples exist.
- Host automation stability still requires synth-specific versioning discipline.

## Alternatives considered

### Create one universal parameter schema

Rejected because it would likely overfit PD-101 or subtractive synth assumptions and conflict with future synth designs.

### Leave controls entirely to host wrappers

Rejected because MIDI mapping, smoothing, and normalized control updates are reusable runtime concerns.

## Implementation notes

- Keep target identifiers synth-defined.
- Support normalized values and explicit min/max scaling.
- Do not couple core controls to React, egui, Beamer, VST, AU, or WebAudio APIs.