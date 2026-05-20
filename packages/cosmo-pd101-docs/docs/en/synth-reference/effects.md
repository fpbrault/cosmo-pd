---
title: Effects
description: Reference for all 17 effect types and the 6-slot FX chain.
---

# Effects

6-slot serial FX chain processing the final mixed output. Each slot: 1 of 17 effect types or empty.

## FX Chain Signal Flow

Line Mixer Output -> Slot 1 -> Slot 2 -> Slot 3 -> Slot 4 -> Slot 5 -> Slot 6 -> DAC Color -> Soft Clip -> Master Out

## All 17 Effect Types

1. **Chorus** — A modulated time-delay effect that thickens and widens the sound by layering detuned copies. Parameters: Rate (0.1-10 Hz), Depth (0-5), Mix, Programs
2. **Delay** — Echoes the input with adjustable feedback, digital or tape mode, and tape warmth. Parameters: Time (0.01-2.0s), Feedback (0-99%), Mix, Mode (Digital/Tape), Warmth
3. **Reverb** — Simulates acoustic spaces from small rooms to large halls with adjustable character and pre-delay. Parameters: Mix, Space (0-100%), Pre (0-100ms), Dist, Char, Programs
4. **Phaser** — Sweeps phase-cancellation notches through the frequency spectrum for a swirling, whooshing motion. Parameters: Rate (0.1-10 Hz), Depth, Feedback (-90% to +90%), Mix
5. **Vibrato** — Modulates pitch cyclically using LFO waveforms with an adjustable onset delay. Parameters: Wave (Tri/Saw/InvSaw/Sq), Rate (1-200), Depth (0-50), Delay (0-5000ms)
6. **Phase Mod** — Phase modulation synthesis inside the FX chain for complex spectral movement. Parameters: Amount (0-50%), Ratio (0.5-8.0), Pre (On/Off)
7. **Compressor** — Smooths dynamic range with full control over threshold, ratio, attack, release, and makeup gain. Parameters: Threshold (-60 to 0 dB), Ratio (1:1 to 20:1), Attack (0.1-200ms), Release (10-2000ms), Makeup (0-24dB), Mix
8. **5-Band EQ** — Five fixed-frequency bands (80–8000 Hz) for precise tone shaping with ±12 dB per band. Parameters: 80, 240, 750, 2200, 8000 Hz bands; -12 to +12 dB each
9. **Grain Delay** — Granular delay that chops the audio into grains for glitchy, textured, and atmospheric echoes. Parameters: Time (0.01-1.0s), Feedback, Scatter, Density, Mix
10. **Bitcrusher** — Reduces bit depth and sample rate for digital lo-fi crunch and aliasing artefacts. Parameters: Bits (1-16), Rate (1-32x), Mix
11. **Shimmer Verb** — Reverb with a pitch-shifted feedback path that produces ethereal, shimmering tails. Parameters: Shimmer (0-100%), Space (0-100%), Mix
12. **Distortion** — Overdrive, distortion, and fuzz types for everything from warm saturation to aggressive clipping. Parameters: Type (OD/Dist/Fuzz), Drive, Tone, Mix
13. **Juno Chorus** — Emulates the classic Roland Juno chorus circuit. Modes I, II, and I+II offer different stereo width and movement. Parameters: Mode (I/II/I+II), Mix
14. **Ring Mod** — Amplitude modulation between the signal and an internal oscillator for metallic, bell-like, and inharmonic tones. Parameters: Freq (20-4000 Hz), Mix

:::warning
Ring Mod works but its behaviour may change slightly in future updates.
:::
15. **Tremolo** — Cyclical volume modulation with selectable LFO waveform and depth. Parameters: Rate (0.1-20 Hz), Depth (0-100%), Wave (Sine/Tri/Square), Mix
16. **Wavefolder** — Folds the waveform back on itself to generate rich harmonic overtones, from subtle warmth to aggressive buzz. Parameters: Drive (0-100%), Folds (0-100%), Mix
17. **LoFi** — Combines signal degradation, wow & flutter emulation, and tone shaping for vintage vinyl or cassette character. Parameters: Degrade, Wow Depth/Rate, Flutter Depth/Rate, Tone, Mix

## FX Chain Tips

:::tip

- **Bass**: Compressor -> EQ -> Distortion (light)
- **Lead**: Distortion -> Delay -> Reverb
- **Pad**: EQ -> Chorus -> Reverb -> Shimmer Verb
- **Experimental**: Bitcrusher -> Grain Delay -> Ring Mod -> Wavefolder

:::

Next: [Global Controls](/synth-reference/global-controls) | [Presets](/presets/managing) | Previous: [Modulation](/synth-reference/modulation)
