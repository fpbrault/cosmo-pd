---
title: Effects
description: Reference for all 17 effect types and the 6-slot FX chain.
---

# Effects

The Cosmo PD-101 has a **6-slot serial FX chain** that processes the final mixed output before the master output. Each slot can be set to one of **17 effect types**, or left empty. Effects are processed in order — the output of slot 1 feeds into slot 2, and so on.

<!-- IMAGE_PLACEHOLDER: Screenshot of the FX Console drawer showing all 6 slots -->

## FX Chain Signal Flow

```
Line Mixer Output → Slot 1 → Slot 2 → Slot 3 → Slot 4 → Slot 5 → Slot 6 → DAC Color → Soft Clip → Master Out
```

### Adding an Effect

1. Click on an FX slot in the **FX Console** drawer panel.
2. Select an effect type from the dropdown.
3. Adjust the effect's parameters with the knobs that appear.
4. Set the **Mix** knob to control the wet/dry balance.

## All 17 Effect Types

---

### 1. Chorus

A classic chorus that adds thickness and movement by duplicating and modulating the signal.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Rate | 0.1 – 10 Hz | 0.8 Hz | LFO rate for pitch modulation |
| Depth | 0 – 5 | 0.003 | Modulation depth |
| Mix | 0 – 100% | 0% | Wet/dry blend |
| ~~Program~~ | Classic Wide, Slow Shimmer, Ensemble Thick | — | Preset programs |

> **Best for:** Thickening pads, adding shimmer to leads, widening the stereo image.

---

### 2. Delay

A flexible delay with digital and tape modes.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Time | 0.01 – 2.0 s | 0.3 s | Delay time |
| Feedback | 0 – 99% | 35% | Repeat amount |
| Mix | 0 – 100% | 0% | Wet/dry blend |
| Mode | Digital / Tape | Digital | Tape mode adds warmth and saturation |
| Warmth | 0 – 100% | 50% | High-frequency roll-off (Tape mode only) |
| ~~Program~~ | Digital Slap, Tape Echo, Dub Feedback | — | Preset programs |

> **Best for:** Echoes, dub effects, rhythmic ping-pong delays.

---

### 3. Reverb

A full reverb with multiple parameters for space simulation.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Mix | 0 – 100% | 0% | Wet/dry blend |
| Space | 0 – 100% | 50% | Room size |
| Pre | 0 – 100 ms | 0 ms | Pre-delay before reverb onset |
| Dist | 0 – 100% | 30% | Distance / damping |
| Char | 0 – 100% | 65% | Character / brightness |
| ~~Program~~ | Small Room, Plate Air, Cathedral | — | Preset programs |

> **Best for:** Adding space, creating ambience, making sounds feel "in a room."

---

### 4. Phaser

A sweeping notch filter that creates a classic phaser effect.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Rate | 0.1 – 10 Hz | 0.5 Hz | Sweep speed |
| Depth | 0 – 100% | 100% | Intensity of the notches |
| Feedback | -90% – +90% | 50% | Regeneration |
| Mix | 0 – 100% | 0% | Wet/dry blend |
| ~~Program~~ | Gentle Sweep, Jet Wash, Wide Notch | — | Preset programs |

> **Best for:** Sweeping tonal effects, vintage phaser sounds, sci-fi textures.

---

### 5. Vibrato

A dedicated vibrato effect with selectable waveform shapes.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Wave | Tri / Saw / Inv Saw / Sq | Tri | Modulation shape |
| Rate | 1 – 200 | 55 | Vibrato rate (effective frequency = value × 0.1 Hz) |
| Depth | 0 – 50 | 8 | Intensity |
| Delay | 0 – 5000 ms | 120 ms | Time before vibrato starts |

> **Best for:** Adding gentle pitch wobble, Leslie-style rotary effects.

---

### 6. Phase Mod

Internal phase modulation — adds a second oscillator ring-modulated onto the signal.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Amount | 0 – 50% | 0% | Modulation intensity |
| Ratio | 0.5 – 8.0 | 2.0 | Frequency ratio of modulator |
| Pre | On / Off | On | Apply before (pre) or after (post) the main algorithm |

> **Best for:** Bell-like tones, metallic harmonics, clangorous textures.

---

### 7. Compressor

A full-featured compressor/limiter for dynamics control.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Threshold | -60 – 0 dB | -12 dB | Compression onset level |
| Ratio | 1:1 – 20:1 | 4:1 | Compression ratio |
| Attack | 0.1 – 200 ms | 5 ms | Attack time |
| Release | 10 – 2000 ms | 100 ms | Release time |
| Makeup | 0 – 24 dB | 6 dB | Output gain compensation |
| Mix | 0 – 100% | 100% | Dry/wet blend |
| ~~Program~~ | Gentle, Punchy, Limiter | — | Preset programs |

> **Best for:** Leveling dynamics, taming peaks, adding punch.

---

### 8. 5-Band EQ

A parametric equalizer with 5 selectable frequency bands.

| Band | Frequency | Range | Default |
|------|-----------|-------|---------|
| 1 | 80 Hz | -12 – +12 dB | 0 dB |
| 2 | 240 Hz | -12 – +12 dB | 0 dB |
| 3 | 750 Hz | -12 – +12 dB | 0 dB |
| 4 | 2.2 kHz | -12 – +12 dB | 0 dB |
| 5 | 8 kHz | -12 – +12 dB | 0 dB |

> **Best for:** Tonal shaping, cutting muddiness, adding brightness.

---

### 9. Grain Delay

A granular delay that chops the audio into grains.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Time | 0.01 – 1.0 s | 0.25 s | Grain spacing |
| Feedback | 0 – 85% | 0% | Repeat amount |
| Scatter | 0 – 100% | 0% | Random offset of grains |
| Density | 0 – 100% | 50% | Grain density |
| Mix | 0 – 100% | 0% | Wet/dry blend |
| ~~Program~~ | Cloud Echo, Glitch Delay, Shimmer Echo | — | Preset programs |

> **Best for:** Granular textures, glitchy delays, cloud-like reverb alternatives.

---

### 10. Bitcrusher

Bit-depth and sample-rate reduction for lo-fi digital grit.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Bits | 1 – 16 bit | 8 bit | Bit depth reduction |
| Rate | 1 – 32× | 1× | Sample rate reduction factor |
| Mix | 0 – 100% | 100% | Wet/dry blend |
| ~~Program~~ | Retro Game, Grunge, Subtle | — | Preset programs |

> **Best for:** Lo-fi aesthetics, chiptune sounds, aggressive digital distortion.

---

### 11. Shimmer Verb

A shimmer reverb that pitches the reverb tail up for an ethereal quality.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Shimmer | 0 – 100% | 40% | Pitch-shift amount of the reverb tail |
| Space | 0 – 100% | 70% | Reverb size |
| Mix | 0 – 100% | 0% | Wet/dry blend |
| ~~Program~~ | Crystal Hall, Ethereal, Subtle Shimmer | — | Preset programs |

> **Best for:** Ethereal pads, ambient textures, dreamy soundscapes.

---

### 12. Distortion

Three modes of distortion: overdrive, distortion, and fuzz.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Type | OD / Dist / Fuzz | OD | Distortion character |
| Drive | 0 – 100% | 50% | Input drive |
| Tone | 0 – 100% | 50% | High-frequency content |
| Mix | 0 – 100% | 100% | Wet/dry blend |
| ~~Program~~ | Warm Overdrive, Gritty Fuzz, Biting Clip | — | Preset programs |

> **Best for:** Aggressive leads, dirty bass, rock/metal tones.

---

### 13. Juno Chorus

Emulates the classic Roland Juno chorus circuit.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Mode | I / II / I+II | I | Chorus mode selection |
| Mix | 0 – 100% | 50% | Wet/dry blend |
| ~~Program~~ | Juno I, Juno II, Juno Full | — | Preset programs |

> **Best for:** Classic Juno pads, lush string-like textures.

---

### 14. Ring Mod

Ring modulation — multiplies the signal with a carrier frequency.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Freq | 20 – 4000 Hz | 440 Hz | Carrier frequency |
| Mix | 0 – 100% | 100% | Wet/dry blend |
| ~~Program~~ | Metallic, Bell, Alien | — | Preset programs |

> **Best for:** Metallic bell tones, inharmonic sounds, experimental textures.

---

### 15. Tremolo

Amplitude modulation with selectable waveform.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Rate | 0.1 – 20 Hz | 4 Hz | Tremolo speed |
| Depth | 0 – 100% | 50% | Volume modulation depth |
| Wave | Sine / Tri / Square | Sine | Modulation shape |
| Mix | 0 – 100% | 100% | Wet/dry blend |
| ~~Program~~ | Slow Wave, Fast Chop, Tri Pulse | — | Preset programs |

> **Best for:** Rhythmic volume effects, vintage organ tremolo.

---

### 16. Wavefolder

Folds the waveform at a threshold, adding harmonics.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Drive | 0 – 100% | 50% | Input signal level |
| Folds | 0 – 100% | 50% | Number of folding points |
| Mix | 0 – 100% | 100% | Wet/dry blend |
| ~~Program~~ | Gentle, Aggressive, Harmonic | — | Preset programs |

> **Best for:** Adding harmonics without harsh clipping, organ-like timbres.

---

### 17. LoFi

Degradation effect simulating vinyl, tape, and cheap speakers.

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Degrade | 0 – 100% | 25% | Overall degradation amount |
| Wow Depth | 0 – 20% | 7% | Wow (slow pitch variation) depth |
| Wow Rate | 0.03 – 2.5 Hz | 0.42 Hz | Wow speed |
| Flutter Depth | 0 – 20% | 3.6% | Flutter (fast pitch variation) depth |
| Flutter Rate | 0.5 – 18 Hz | 6.7 Hz | Flutter speed |
| Tone | 0 – 100% | 45% | High-frequency roll-off |
| Mix | 0 – 100% | 100% | Wet/dry blend |
| ~~Program~~ | Warped Cassette, Dusty Keys, Cheap Speaker | — | Preset programs |

> **Best for:** Vintage aesthetics, lo-fi hip-hop, retro game sounds.

## FX Chain Tips

| Chain Order | Suggested Setup |
|-------------|-----------------|
| **Bass** | Compressor → EQ → (light) Distortion |
| **Lead** | Distortion → Delay → Reverb |
| **Pad** | EQ → Chorus → Reverb → Shimmer Verb |
| **Experimental** | Bitcrusher → Grain Delay → Ring Mod → Wavefolder |

Next: [Global Controls →](global-controls.md) | [Presets →](presets/managing.md) | Previous: [Modulation →](modulation.md)