---
title: Troubleshooting
description: Common issues and how to resolve them.
---

# Troubleshooting

## Audio Not Playing

:::danger
**No sound**: Click the page to start the AudioContext (browser autoplay restriction).
:::

- No sound on first note: Wait 1-2s for Wasm module to load.
- Distorted audio: Reduce Master Volume.

## MIDI Not Working

- Controller not detected: Grant MIDI permission in browser.
- Wrong keys: A S D F G H J K = C4-C5 diatonic C major.
- Aftertouch not working: Controller may not support it.

:::info
Web MIDI API requires HTTPS (or localhost). If testing locally, ensure you're using `localhost` rather than `127.0.0.1`.
:::

## Performance Issues

- Audio glitches: Reduce polyphony or close tabs.
- High CPU: Disable unused FX slots.
- UI lag: Reduce modulation routes.

## Web App Specific

- Black screen: Try Chrome/Edge.
- Presets not saving: Clear cache or export manually.

## Plugin Specific

- Not in DAW: Wrong format/directory, rescan.
- Black window: Enable GPU acceleration in DAW.
- High latency: Reduce buffer size to 128-256 samples.

## Factory Reset

Preset library menu -> "Factory Reset" -> Confirm.

## Getting More Help

GitHub Issues and Discussions links provided.
