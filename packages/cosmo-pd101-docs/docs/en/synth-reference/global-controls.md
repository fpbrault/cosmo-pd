---
title: Global Controls
description: Polyphony, portamento, pitch bend, velocity, and other global settings.
---

# Global Controls

## Voice

- **Poly** -- Play multiple notes, up to the selected voice limit.
- **Mono** -- Play one note at a time.

In **Advanced**, open **Global** to set the voice allocation limit from **1 to 16** (default **8**). This is a remembered global preference, separate from the patch’s Poly/Mono mode. Lower limits can reduce processing load.

## Tempo

The **Global** panel also provides manual tempo from **20 to 300 BPM**. When host transport is available, tempo follows the host and the manual field is disabled.

## Volume

Master output 0-100%, applied after FX chain, before soft clip limiter.

## Portamento (Glide)

Enable portamento to glide between notes. In **Simple → Sound**, use the portamento On/Off control and open **Time** to choose the mode:

- **Time** sets the glide duration from **0 to 10 seconds**.
- **Rate** adjusts the glide rate from **0.01× to 100×**.

## Pitch Bend

Range: +/-1 to +/-24 semitones (default: +/-2).

## Velocity

Curve (0-100%) and Amount (0-100%) for velocity sensitivity.

## DAC Color

Optional non-linear DAC emulation adding subtle harmonic distortion.

:::info
The CZ DAC Emulation approximates the non-linear output stage of the original Casio CZ-101's DAC when used with the CZ-101 algorithm and Window function.
:::

## Performance Monitor

Toggle via Perf button: FPS, Voices, CPU%.

Next: [Presets](/presets/managing) | Previous: [Effects](/synth-reference/effects)
