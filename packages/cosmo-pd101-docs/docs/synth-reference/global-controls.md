---
title: Global Controls
description: Polyphony, portamento, pitch bend, velocity, and other global settings.
---

# Global Controls

These settings affect the entire synth globally, not individual oscillator lines. Access them via the **Global Voice Panel** and the top-level controls.

<!-- IMAGE_PLACEHOLDER: Screenshot of the Global Voice Panel -->

## Voice

### Polyphony Mode

| Setting | Effect |
|---------|--------|
| **Poly 8** | Up to 8 voices sound simultaneously. New notes steal the oldest voice. |
| **Mono** | Only one note sounds at a time. Each new note retriggers the envelopes. |

### Legato

When **off**, each new note triggers all envelopes from the beginning (attack from zero).

When **on** (legato), new notes while a key is held do not retrigger the envelope — the pitch smoothly transitions to the new note. This creates connected, smooth melodic lines.

### Volume

Master output volume for the synth, range **0 – 100%**. Applied after the FX chain, before the soft clip limiter.

## Portamento (Glide)

Portamento creates a **pitch slide** between consecutive notes.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Mode | Rate / Time | Time | How the portamento speed is defined (see below) |
| Rate | 0 – 99 | 85 | In Rate mode: higher = faster glide |
| Time | 0.01 – 1.00 s | 0.10 s | In Time mode: duration of the pitch slide |

### Rate Mode vs. Time Mode

- **Rate mode**: Exponential pitch glide controlled by the Rate parameter (0–99). Higher values = faster glide. The slide time depends on the interval and the Rate value.
- **Time mode**: The entire slide takes a fixed duration specified by the Time parameter. A 5-semitone slide and a 2-semitone slide both complete in the same time.

### Portamento Tips

| Sound | Suggested Setting |
|-------|-------------------|
| Subtle legato | Rate = 20 |
| Synth slide (bass) | Time = 0.30 s |
| Whistle-like lead | Rate = 60 |

> **Note:** Portamento only applies when legato mode is enabled, or when the new note starts while the previous key is still held.

## Pitch Bend

Controls the **pitch bend range** — how far the pitch moves when the pitch bend wheel is pushed.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Range | ±1 – ±24 semitones | ±2 semitones | Maximum pitch deviation from the bend wheel |

The pitch bend is applied globally to all voices simultaneously.

## Velocity

Controls how **note velocity** (MIDI 0–127) affects synth parameters.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Curve | 0 – 100% | 50% | Adjusts the velocity response curve |
| Amount | 0 – 100% | 100% | Overall velocity sensitivity |

Lower values make the synth less sensitive to how hard you strike a key; higher values increase the dynamic range.

> **Tip:** Route Velocity as a modulation source to `line1DcaBase` for expressive, velocity-sensitive volume, or to `filterCutoff` for brighter notes on harder strikes.

## Mod Wheel

Sends **MIDI CC 1** values (0–1). By default routed in the modulation matrix, but can be reassigned to any destination.

## Aftertouch

**Channel pressure** messages (0–1). On controllers that support poly aftertouch, each note can send independent pressure values.

## DAC Color

An optional **non-linear DAC emulation** that adds subtle harmonic distortion reminiscent of vintage Casio hardware.

| Setting | Effect |
|---------|--------|
| Off (default) | Clean digital output |
| On | Adds lo-fi character with subtle aliasing and quantization artifacts |

> **Tip:** Use sparingly. DAC Color shines on pad and bass sounds where a touch of digital grit adds warmth.

## CZ DAC Emulation

When using the **CZ-101 algorithm** with the **Window** function set to non-off values, the synth can approximate the **non-linear output stage** of the original Casio CZ-101's D/A converter. This produces the characteristic "gritty" quality of early digital synthesizers.

## Performance Monitor

A **performance overlay** (toggle via the Perf button) shows real-time stats:

| Metric | Description |
|--------|-------------|
| FPS | Frame rate of the UI |
| Voices | Number of currently active voices |
| CPU % | Estimated CPU usage of the audio engine |

> **Tip:** If CPU usage is high, try reducing polyphony, disabling unused FX slots, or simplifying modulation matrix routes.

## Quick Reference: Global Parameters at a Glance

| Parameter | Range | Modulatable? |
|-----------|-------|-------------|
| Polyphony | Poly 8 / Mono | No |
| Legato | On / Off | No |
| Portamento Mode | Rate | Time | No |
| Portamento Rate | 0 – 99 | Yes |
| Portamento Time | 0.01 – 1.00 s | Yes |
| Volume | 0 – 100% | Yes |
| Pitch Bend Range | ±1 – ±24 st | No |
| Velocity Curve | 0 – 100% | No |
| Velocity Amount | 0 – 100% | No |
| DAC Color | Off / On | No |

Next: [Presets →](presets/managing.md) | Previous: [Effects →](effects.md)