---
title: Web App
description: Using the Cosmo PD-101 in the browser via cz-explorer.
---

# Web App

The Cosmo PD-101 runs in the browser as a **Web Audio AudioWorklet** module compiled from Rust (via Wasm). This means near-native audio performance with no plugins required.

<!-- IMAGE_PLACEHOLDER: Screenshot of cz-explorer with the synth panel visible and preset library sidebar -->

## Opening the Web App

Navigate to the deployed URL (or your local dev server during development):

```
https://fpbrault.github.io/cosmo-pd/
```

Or run locally:

```bash
cd packages/cz-explorer
bun run dev
```

## Connecting the Synth

The synth renders via an **AudioWorklet** — an off-main-thread audio processor in the Web Audio API. When you open the app:

1. The app downloads the compiled Wasm binary (typically ~200 KB gzipped).
2. An `AudioContext` is created and the worklet node is instantiated.
3. All audio rendering happens off the main thread for glitch-free performance.

## Playing with the Computer Keyboard

The default virtual keyboard maps to a **diatonic C major scale** using letter keys on a QWERTY layout:

| Keyboard Key | Note | MIDI Note |
|-------------|------|-----------|
| A | C4 | 60 |
| S | D4 | 62 |
| D | E4 | 64 |
| F | F4 | 65 |
| G | G4 | 67 |
| H | A4 | 69 |
| J | B4 | 71 |
| K | C5 | 72 |

Press **Space** to toggle the sustain pedal on/off.

## Using a Physical MIDI Controller

The cz-explorer web app supports MIDI via the **Web MIDI API**. Most modern browsers (Chrome, Edge) support this natively:

1. Open the browser's MIDI permission prompt (usually appears automatically, or navigate to browser settings).
2. Grant permission to your MIDI device.
3. The synth will begin receiving MIDI note on/off, pitch bend, modulation wheel, and aftertouch messages.

> **Note:** Safari on macOS has limited Web MIDI support. Chrome or Edge are recommended.

## Synth Panel Layout

The main synth panel (`SynthRenderer`) presents these interactive areas:

<!-- IMAGE_PLACEHOLDER: Annotated screenshot of synths panel areas — Phase Lines, Envelopes, Modulation, FX, Global -->

### Phase Lines (Top Area)
Select algorithms, set pitch/detune, control blend amount for each of the two oscillator lines.

### Step Envelope Editor (Left Panel)
Visually edit three 8-step envelopes per line (DCO pitch, DCW waveshape, DCA amplitude). Click steps to adjust level and rate.

### Modulation Matrix (Right Panel)
A 7×51 grid to route modulation sources (LFOs, envelopes, velocity, etc.) to any parameter.

### FX Chain (Bottom Panel)
Six serial effect slots. Click each slot to choose from 17 effect algorithms.

## Saving and Loading Patches

From the preset sidebar:

- **Browser presets**: Load demo patches included in the app.
- **Custom presets**: Click "Save preset" to store your patch in the browser's **IndexedDB** (persists across sessions).
- **Export**: Download a preset as a JSON file for backup or sharing.
- **Import**: Load a JSON preset file or import a Casio CZ-101 SysEx dump.

## Performance

The Web App targets **60 FPS** audio rendering. You can monitor CPU usage via the performance overlay (toggle with the "Perf" button). Typical CPU usage on a modern machine:

| Voices | CPU Usage (typical) |
|--------|-------------------|
| 1–2 | <1% |
| 4 | ~2% |
| 8 (max) | ~5% |

> **Tip:** If you hear audio glitches, try reducing the polyphony or closing other browser tabs. The AudioWorklet runs off the main thread but shares system resources.

Next: [Desktop App →](desktop-app.md)