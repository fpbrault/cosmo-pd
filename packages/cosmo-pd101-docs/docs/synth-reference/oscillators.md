---
title: Oscillators
description: Dual oscillator lines, base waveforms, detune, and blending.
---

# Oscillators

The Cosmo PD-101 features **two independent oscillator lines** (Line 1 and Line 2). Each line generates sound through a phase distortion process: a phase accumulator is warped by an algorithm, then used to index into a base waveform.

<!-- IMAGE_PLACEHOLDER: Screenshot of the Phase Lines panel showing both oscillator sections -->

## Dual Line Architecture

Each line operates independently with its own:

- **Algorithm** — the phase distortion function (see [Algorithms](algorithms.md))
- **Base Waveform** — the carrier wave that the warped phase indexes into
- **Octave** — pitch offset in octaves
- **Detune** — fine and coarse pitch offset for stereo width / chorus effect
- **Envelope** — 8-step step-function for pitch (DCO), warp (DCW), and amplitude (DCA)
- **Algo Blend** — mix between the primary algorithm and a secondary algorithm

## Line Select

The **Line Select** control (labeled `L1`, `L2`, `L1+L1'`, `L1+L2'`) determines which outputs are summed to the final audio:

| Setting | What It Does |
|---------|-------------|
| **L1** | Only Line 1 audible |
| **L2** | Only Line 2 audible |
| **L1 + L1'** | Line 1 + Line 1 with its secondary (blended) algorithm |
| **L1 + L2'** | Line 1 + Line 2 with its secondary (blended) algorithm |

## Base Waveforms

Each line selects a **base waveform** — the raw carrier that the warped phase indexes into:

| Waveform | Character |
|----------|-----------|
| **Cosine** | Smooth, even harmonics. Default for CZ-101 algorithm. |
| **Sine** | Pure fundamental. Clean, hollow tones. |
| **Triangle** | Odd harmonics, softer than saw. |
| **Saw** | Full harmonic series. Bright, buzzy. |
| **Square** | Odd harmonics only. Hollow, reedy. |

> **Tip:** The base waveform has a dramatic effect on the final sound, especially with subtler warp algorithms. Try `saw` for bright leads, `sine` for deep basses, and `square` for hollow pad characters.

## Detune

Detune adds a slight pitch offset between the two lines, creating a **chorus effect** or **stereo width**:

- **Detune (Coarse)** — shifts Line 2's pitch by whole semitones (set via `detuneNote`)
- **Detune (Fine)** — shifts Line 2's pitch by sub-semitone cents (set via `detuneFine`)

| Detune Amount | Effect |
|---------------|--------|
| 0 cents | Mono, no detune |
| 5–15 cents | Subtle stereo shimmer |
| 20–50 cents | Obvious chorus effect |
| 100+ cents | Distinct interval (harmony / dissonance) |

## Algo Blend

Each line has a **secondary algorithm** that can be **blended** with the primary. The `Algo Blend` knob (0–100%) crossfades between:

- **0%** — Only the primary algorithm
- **50%** — Equal mix of primary and secondary
- **100%** — Only the secondary algorithm

This effectively doubles the available timbral palette. For example:

- Primary: `Bend` + Secondary: `Fold` = a pitch-bend with wavefolding character
- Primary: `CZ101` + Secondary: `Sync` = classic CZ tone with sync-style edge

## Modulation Mode

The **Mod Mode** switch controls how the two lines interact at the mixer stage:

| Mode | Behavior |
|------|----------|
| **Normal** | Standard additive mixing (L1, L2, or L1+L2) |
| **Ring** | Ring modulation: `L1 × L2 × ringGain` — produces sum/difference frequencies, metallic tones |
| **Noise** | Adds a noise component scaled by the signal level — textured, lo-fi character |

Next: [Algorithms →](algorithms.md) | Previous: [Overview →](overview.md)