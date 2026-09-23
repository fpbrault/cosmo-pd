---
title: Web App
description: Using the Cosmo PD-101 in the browser via the webview.
---

# Web App

The Cosmo PD-101 runs in the browser as a **Web Audio AudioWorklet** module compiled from Rust (via Wasm).

## Opening the Web App

Navigate to `https://cosmo.purraudio.dev` or run locally:

```bash
# From the repository root
bun run dev
```

## Connecting the Synth

The synth renders via an **AudioWorklet** -- an off-main-thread audio processor. When you open the app:

1. The app downloads the compiled Wasm binary (~200 KB gzipped).
2. An `AudioContext` is created and the worklet node is instantiated.
3. All audio rendering happens off the main thread.

:::info
Browsers require a user gesture (click/tap) before creating an `AudioContext`. Click anywhere on the page to start the audio engine.
:::

## Playing with the Computer Keyboard

The default virtual keyboard maps to a **diatonic C major scale**:

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

Press **Space** to toggle sustain pedal.

## Using a Physical MIDI Controller

The web app supports MIDI via the **Web MIDI API**.

:::warning
Safari has limited Web MIDI API support. Chrome or Edge are recommended for the best MIDI experience.
:::

## Synth Panel Layout

Start in **Simple** for macros and the compact Sound, Envelope, and Effects sections. Use the **Simple / Advanced** switch to open the full editor without changing the patch. See [Quick Start](/getting-started/) for a walkthrough.

In **Advanced**:

- **Phase Lines** -- Select algorithms, set pitch/detune, control blend for each line.
- **Step Envelope Editor** -- Visually edit three 8-step envelopes per line.
- **Modulation Matrix** -- Pages with selectable source rows and destination columns; search the pickers and adjust the amount at each intersection.
- **FX Chain** -- Six serial effect slots.

## Saving and Loading Patches

- **Browser presets**: Load demo patches.
- **Custom presets**: Save to IndexedDB (persists across sessions).
- **Export**: Download as JSON.
- **Import**: Load JSON preset or Casio CZ-101 SysEx dump.

Next: [DAW Plugin](/getting-started/plugin)
