---
title: Overview
description: Architecture and signal flow of the Cosmo PD-101 synthesizer.
---

# Synth Overview

The **Cosmo PD-101** is a phase distortion (PD) synthesizer inspired by the Casio CZ series. It generates sound by warping the phase of an oscillator before sampling a base waveform.

## Signal Flow

:::details{title="Signal Flow Diagram"}

```
MIDI Input
    |
    v
Modulation Sources (LFO 1, LFO 2, Random S&H, ADSR Mod Env, Velocity, Mod Wheel, Aftertouch)
    |
    v
Modulation Matrix (11 sources -> 195+ destinations, each with depth)
    |
    v
Voice (x8 polyphony)
  Line 1 (DCO Env -> Algorithm + DCW Env -> Base Wave -> DCA Env)
  Line 2 (same structure)
    |
    v
Line Mixer (Normal / Ring Mod / Noise / L1 / L2 / L1+L1' / L1+L2')
    |
    v
Output Stage: Volume + Mod -> FX Chain (6 slots) -> Soft Clip (tanh) -> Audio Out
```

:::

## Phase Distortion -- How It Works

Normal: Phase -> Wavetable -> Output
PD:     Phase -> [WARP ALGORITHM] -> Wavetable -> Output

The warp algorithm reshapes the phase curve, changing the harmonic content in real time.

### The Two Oscillator Lines

Each line has its own algorithm, three 8-step envelopes (DCO/DCW/DCA), independent pitch/detune/octave, and base waveform selector.

## Key Concepts

| Term | Meaning |
|------|---------|
| **DCO** | Digitally Controlled Oscillator -- pitch/frequency |
| **DCW** | Digitally Controlled Waveshaper -- DCW amount |
| **DCA** | Digitally Controlled Amplifier -- amplitude |
| **Algorithm** | The mathematical function that warps the phase |
| **Envelope** | An 8-step step-function controlling a parameter over time |
| **Modulation Matrix** | Routes any of 11 sources to any of 195+ destinations |
| **FX Chain** | 6 serial effect slots processing the final audio |

Next: [Oscillators](/synth-reference/oscillators) | [Algorithms](/synth-reference/algorithms) | [Envelopes](/synth-reference/envelopes)
