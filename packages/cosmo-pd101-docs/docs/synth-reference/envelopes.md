---
title: Envelopes
description: Deep-dive into the 8-step CZ-style step envelopes.
---

# Envelopes

The Cosmo PD-101 uses **8-step step-function envelopes** — a distinctive feature inherited from the Casio CZ-101. Unlike traditional ADSR envelopes, each envelope consists of **8 discrete steps**, each with its own **level** and **rate** (duration). This gives you precise, complex control over how a parameter evolves over time.

<!-- IMAGE_PLACEHOLDER: Screenshot of the Step Envelope Editor showing all 8 steps with level/rate values -->

## Envelope Types

Each oscillator line has **three independent envelopes**:

| Envelope | Controls | Parameter ID |
|----------|---------|-------------|
| **DCO Envelope** | Pitch (frequency) of the oscillator | `dcoEnv` |
| **DCW Envelope** | Warp depth — how much the algorithm distorts the phase | `dcwEnv` |
| **DCA Envelope** | Amplitude (volume) of the oscillator | `dcaEnv` |

There is also a separate **Mod Envelope** (ADSR) used for modulation routing (see [Modulation](modulation.md)).

## Step Envelope Structure

Each envelope has:

- **8 steps** (numbered 1–8)
- Each step has a **Level** (0–127) and a **Rate** (0–127)
- A **Sustain Step** — which step to hold on while a key is pressed
- A **Loop** toggle — whether the envelope restarts from step 1 after reaching step 8
- A **Step Count** — how many of the 8 steps are active

### Understanding Level and Rate

| Concept | Range | Meaning |
|---------|-------|---------|
| **Level** | 0 – 127 | The output value of this step. For DCO, this is pitch offset (in semitones from base). For DCW, it's warp depth. For DCA, it's amplitude. |
| **Rate** | 0 – 127 | How long this step takes to reach the next level. Higher = slower. |

Think of it like an ADSR, but with **8 points** instead of 4:

```
Level ───────────────────────────────────
      │    ┌─Step1─┐
      │   ╱        ╲  ┌─Step2─┐
      │  ╱          ╲╱        ╲
      │ ╱                       ╲──── Sustain (Step 5)
      │╱                                ╲
      └─────────────────────────────────── Rate (time)
```

## The 8 Steps in Practice

### Classic Attack–Decay–Sustain–Release (ADSR) Approximation

To recreate a traditional ADSR:

| Step | Level | Rate | Purpose |
|------|-------|------|---------|
| 1 | 0 | Fast | Attack start |
| 2 | 127 | Fast | Attack peak |
| 3 | 127 | Medium | Decay start |
| 4 | 80 | Medium | Decay to sustain |
| 5 | 80 | – | **Sustain step** (held while key is down) |
| 6 | 80 | – | |
| 7 | 80 | – | |
| 8 | 80 | – | |

With **loop off**, the envelope continues through steps 6–8 even during sustain. With **loop on**, it cycles back to step 1, creating a **LFO-like effect**.

### Creating a "Bounce" Envelope

| Step | Level | Rate | Purpose |
|------|-------|------|---------|
| 1 | 0 | 10 | Quick attack |
| 2 | 100 | 20 | Overshoot |
| 3 | 40 | 15 | Drop back |
| 4 | 80 | 10 | Rise again |
| 5 | 60 | – | Sustain |
| 6–8 | 60 | – | Hold |

This creates a pitch envelope that "bounces" before settling — great for pluck sounds.

## Editing Envelopes

In the UI, the **Step Envelope Editor** panel displays all three envelopes for the selected line:

- **Click** on a step to select it
- **Drag vertically** to adjust level
- **Drag horizontally** or use the numeric field to adjust rate
- **Click the "S" button** on a step to set it as the sustain point
- **Toggle the loop icon** to enable/disable looping

<!-- IMAGE_PLACEHOLDER: Close-up of the Step Envelope Editor UI with annotations -->

## DCO Envelope — Pitch

The DCO envelope controls **pitch offset** in semitones:

- Level **0** = base pitch (no offset)
- Level **127** = +12 semitones (one octave up)
- Negative values are not supported directly — use the global pitch controls or detune instead

> **Tip:** Use the DCO envelope for pitch sweeps, dive bombs, and expressive lead sounds.

## DCW Envelope — Waveshape

The DCW envelope controls **how much the phase distortion algorithm affects the sound**:

- Level **0** = no distortion (raw base waveform)
- Level **127** = maximum distortion

This is the most expressive envelope — it morphs the timbre over time. With `Fold` algorithm, for example:
- DCW 0 = clean sine
- DCW 64 = subtle harmonic richness
- DCW 127 = aggressive, chaotic folding

## DCA Envelope — Amplitude

The DCA envelope controls **volume** over time — functionally similar to a traditional amplitude envelope:

- Level **0** = silence
- Level **127** = maximum volume

## Pop Suppression

When switching between notes, the engine applies **automatic pop suppression** — a short fade at transition boundaries to prevent clicks and pops. This is handled transparently and requires no user configuration.

## Envelope Tips and Tricks

| Technique | Steps to Set Up |
|-----------|----------------|
| **Long pad, slow attack** | Step 1: L=0, R=60 → Step 2: L=100, R=80 → Sustain on step 2, loop off |
| **Percussive pluck** | Step 1: L=0, R=2 → Step 2: L=127, R=5 → Sustain on step 2, loop off → Short DCA release |
| **Arpeggiated pitch** | Step 1–8: alternating L=0 and L=30, loop on, moderate rates |
| **Vibrato via looping DCO** | Step 1: L=120, R=30 → Step 2: L=132, R=30 → Loop on, sustain on step 1 |

Next: [Modulation →](modulation.md) | Previous: [Overview →](overview.md) | [Algorithms →](algorithms.md)