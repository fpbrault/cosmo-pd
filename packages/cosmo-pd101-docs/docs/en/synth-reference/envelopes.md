---
title: Envelopes
description: Deep-dive into the 8-step CZ-style step envelopes.
---

# Envelopes

8-step step-function envelopes -- a distinctive feature from the Casio CZ-101. Each envelope has 8 discrete steps, each with level and rate.

## Envelope Types (per line)

| Envelope | Controls | Parameter ID |
|----------|---------|-------------|
| **DCO Envelope** | Pitch (frequency) | `dcoEnv` |
| **DCW Envelope** | DCW amount | `dcwEnv` |
| **DCA Envelope** | Amplitude (volume) | `dcaEnv` |

Plus a separate **Mod Envelope** (4-stage ADSR) for modulation routing.

## Step Envelope Structure

- 8 steps, each with **Level** (0-127) and **Rate** (0-127)
- **Sustain Step** -- which step is held while key is pressed
- **Loop** toggle -- restart from step 1 after step 8
- **Step Count** -- how many of the 8 steps are active

## Classic ADSR Approximation

Steps 1-2 = attack, 3-4 = decay, 5 = sustain, 6-8 = release hold.

## Editing in the UI

Click to select a step, drag vertically for level, horizontally for rate. Set sustain point with "S" button. Toggle loop icon.

## DCO Envelope -- Pitch

Level 0 = base pitch, Level 127 = +12 semitones.

## DCW Envelope -- Waveshape

Level 0 = no distortion (raw waveform), Level 127 = maximum distortion. The most expressive envelope.

## DCA Envelope -- Amplitude

Level 0 = silence, Level 127 = max volume.

## Envelope Tips

:::tip

- **Long pad/slow attack**: L=0,R=60 -> L=100,R=80, sustain step 2, loop off
- **Percussive pluck**: L=0,R=2 -> L=127,R=5, sustain step 2, short DCA release
- **Arpeggiated pitch**: alternating L=0/L=30, loop on
- **Vibrato via looping DCO**: L=120,R=30 -> L=132,R=30, loop on

:::

Next: [Modulation](/synth-reference/modulation) | Previous: [Overview](/synth-reference/overview) | [Algorithms](/synth-reference/algorithms)
