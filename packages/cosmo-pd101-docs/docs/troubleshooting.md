---
title: Troubleshooting
description: Common issues and how to resolve them.
---

# Troubleshooting

<!-- IMAGE_PLACEHOLDER: Screenshot of a common error state with annotations -->

## Audio Not Playing

| Symptom | Cause | Solution |
|---------|-------|----------|
| No sound at all | Audio context not started | Click anywhere on the page or press a key to activate the audio context (browser autoplay restriction) |
| No sound on first note | AudioWorklet not loaded yet | Wait 1–2 seconds for the Wasm module to compile and instantiate; then try again |
| No sound in plugin | Plugin not armed | Arm the track for playback in your DAW and ensure monitoring is on |
| Distorted / clipping audio | Volume too high | Reduce the Master Volume slider in Global Controls |

## MIDI Not Working

| Symptom | Cause | Solution |
|---------|-------|----------|
| Controller not detected | Browser MIDI permission not granted | Look for a browser permission prompt and allow MIDI access |
| No response to keyboard | Wrong key mapping | Computer keyboard maps to C4–C5 using **A S D F G H J K** (diatonic C major scale). |
| MIDI device disconnects | USB issue or driver | Reconnect the device, restart the app |
| Aftertouch not working | Controller doesn't support it | Not all MIDI controllers send channel pressure. Check your controller's spec |

## Performance Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| Audio glitches / crackling | CPU overload | Reduce polyphony or close other browser tabs |
| High CPU usage | Too many active effects | Disable unused FX slots |
| UI lag | Heavy modulation routing | Reduce the number of active modulation routes |
| Slow startup | Wasm compilation | Pre-compiled Wasm is cached after first load; subsequent loads are faster |

## Web App Specific

| Symptom | Cause | Solution |
|---------|-------|----------|
| Black screen | WebGL issue | Try a different browser (Chrome/Edge recommended) |
| Presets not saving | Storage quota exceeded | Clear browser cache or use "Export preset" to back up manually |
| Audio crackles | SharedArray timing | Try reducing the number of active voices to 4 |

## Plugin Specific

| Symptom | Cause | Solution |
|---------|-------|----------|
| Plugin doesn't appear in DAW | Wrong plugin format or directory | Ensure the `.vst3`/`.clap`/`.au` is in the correct plugin folder; rescan in DAW |
| Plugin window black | GPU acceleration disabled | Enable GPU acceleration in DAW settings (e.g., in Ableton: Options → Look → GPU Acceleration) |
| Parameter automation not recording | Automation lane not armed | Right-click the parameter → "Show Automation" in your DAW |
| High latency | Buffer size too large | Reduce DAW buffer size (128–256 samples recommended) |

## Factory Reset

If things get stuck, you can reset to factory defaults:

1. Open the preset library.
2. Select **"Factory Reset"** from the menu (hamburger icon).
3. Confirm the reset.

This restores the default preset and clears any user-created patches.

## Getting More Help

| Channel | Link |
|---------|------|
| **GitHub Issues** | [github.com/fpbrault/cosmo-pd/issues](https://github.com/fpbrault/cosmo-pd/issues) |
| **Discussions** | [github.com/fpbrault/cosmo-pd/discussions](https://github.com/fpbrault/cosmo-pd/discussions) |

> **Before opening an issue:** Check the [Engine documentation](https://github.com/fpbrault/cosmo-pd/blob/main/packages/cosmo-synth-engine/COSMO_ENGINE.md) for technical details, and include your OS, browser/DW version, and steps to reproduce.