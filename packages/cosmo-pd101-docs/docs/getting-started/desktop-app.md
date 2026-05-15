---
title: Desktop App
description: Using the Cosmo PD-101 as a standalone desktopapplication via Tauri.
---

# Desktop App

The **Cosmo PD-101 Desktop** is a standalone application built with **Tauri 2**, wrapping the same Web UI in a native desktop shell with Rust audio backend support.

<!-- IMAGE_PLACEHOLDER: Screenshot of Tauri desktop app window with title bar and synth UI -->

## Download

Download the latest installer from the [releases page](https://github.com/fpbrault/cosmo-pd/releases):

| Platform | File |
|----------|------|
| macOS (.dmg) | `cosmo-pd101-desktop-x64.dmg` |
| Windows (.exe) | `cosmo-pd101-desktop-setup.exe` |
| Linux (.AppImage) | `cosmo-pd101-desktop.AppImage` |

## Installation

### macOS

1. Open the `.dmg` file.
2. Drag **Cosmo PD-101** into your Applications folder.
3. On first launch, you may need to right-click → "Open" to bypass Gatekeeper.

### Windows

1. Run the `.exe` installer.
2. Follow the setup wizard (accept license → choose location → install).
3. Launch from the Start menu or desktop shortcut.

### Linux

```bash
chmod +x cosmo-pd101-desktop.AppImage
./cosmo-pd101-desktop.AppImage
```

## MIDI Setup

The desktop app has direct access to system MIDI devices (no browser permissions required):

1. Connect your MIDI controller via USB or Bluetooth.
2. Open Cosmo PD-101.
3. Go to **Settings → MIDI Input** and select your device.
4. The synth will begin receiving MIDI immediately.

## Audio Output

Unlike the browser version (which uses Web Audio), the desktop app uses **CPAL** (Cross-Platform Audio Library) for low-latency audio:

- **macOS**: CoreAudio (10–20 ms latency typical)
- **Windows**: WASAPI (10–30 ms latency)
- **Linux**: ALSA / PulseAudio / PipeWire (10–20 ms latency)

To reduce latency, decrease the **Audio Buffer Size** in Settings → Audio.

## Features vs. Web App

| Feature | Web App | Desktop App |
|---------|---------|-------------|
| MIDI support | Web MIDI API (Chrome only) | System MIDI (all platforms) |
| Audio latency | Browser-dependent | Native low-latency |
| File system access | IndexedDB only | Full filesystem (save/load presets anywhere) |
| AudioWorklet | ✅ | N/A (uses Rust engine directly) |

> **Tip:** The desktop app sounds slightly different from the web version because it runs the Rust synth engine natively rather than in a WebAssembly AudioWorklet. The algorithms and parameters are identical, but the audio path differs.

Next: [DAW Plugin →](plugin.md)