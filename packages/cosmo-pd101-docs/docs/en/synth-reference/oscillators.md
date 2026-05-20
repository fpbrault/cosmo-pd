---
title: Oscillators
description: Dual oscillator lines, base waveforms, detune, and blending.
---

# Oscillators

Two independent oscillator lines, each with its own algorithm, base waveform, octave, detune (fine + coarse), envelope, and algo blend.

## Line Select

| Setting | What It Does |
|---------|-------------|
| **L1** | Only Line 1 audible |
| **L2** | Only Line 2 audible |
| **L1 + L1'** | Line 1 + Detuned copy of Line 1 |
| **L1 + L2'** | Line 1 + Detuned Line 2 |

## Base Waveforms

| Waveform | Character |
|----------|-----------|
| **Cosine** | Smooth, even harmonics |
| **Sine** | Pure fundamental, clean hollow tones |
| **Triangle** | Odd harmonics, softer than saw |
| **Saw** | Full harmonic series, bright and buzzy |
| **Square** | Odd harmonics only, hollow and reedy |

## Detune

- Detune (Octave) -- whole octaves
- Detune (Coarse) -- whole semitones
- Detune (Fine) -- sub-semitone cents

:::warning
Detune (Octave) does not support modulation yet. It is listed as a modulation destination for future use.
:::

## Algo Blend

Each line has a secondary algorithm crossfaded via `Algo Blend` knob (0-100%).

:::warning
Algo Blend does not support modulation yet. It is listed as a modulation destination for future use.
:::

## Modulation Mode

| Mode | Behavior |
|------|----------|
| **Normal** | Standard additive mixing |
| **Ring** | Ring modulation: L1 x L2 x ringGain |
| **Noise** | Noise component scaled by signal level |

:::warning
Noise modulation does not work as intended. Expect changes in a future version.
:::

:::warning
Ring modulation works but its behaviour may change slightly in future updates.
:::

Next: [Algorithms](/synth-reference/algorithms) | Previous: [Overview](/synth-reference/overview)
