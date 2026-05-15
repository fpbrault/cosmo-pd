---
title: Quick Start
description: Get up and running with the Cosmo PD-101 in minutes.
---

# Getting Started

Welcome to the **Cosmo PD-101** — a phase distortion synthesizer inspired by the legendary Casio CZ-101, extended with modern synthesis capabilities and available as a web app, desktop app, and DAW plugin.

<!-- IMAGE_PLACEHOLDER: Screenshot of the full SynthRenderer UI with all panels visible -->

## What You Need

- A computer (Windows, macOS, or Linux)
- A web browser (Chrome, Firefox, Edge — latest versions)
- A MIDI keyboard or controller (optional but recommended)

## First Sound

### Web App (Fastest Way)

Open [cosmo-pd.app](https://fpbrault.github.io/cosmo-pd/) — you'll see the full synth interface. Press keys on your computer keyboard (**A S D F G H J K** for a C major scale) or connect a MIDI controller.

### Desktop App

Download the latest release for your platform:

| Platform | Download |
|----------|----------|
| macOS | `cosmo-pd101-standalone-x64.dmg` |
| Windows | `cosmo-pd101-standalone-setup.exe` |
| Linux | `cosmo-pd101-standalone.AppImage` |

### DAW Plugin

Install `cosmo-pd101.vst3` (or `.clap`, `.au`) into your DAW's plugin directory and instantiate it on a MIDI track.

## The Interface at a Glance

The synth UI is organized into sections:

| Section | What It Controls |
|---------|-----------------|
| **Phase Lines** | Two oscillator lines — each with its own algorithm, envelope, and pitch settings |
| **Envelope Editor** | 8-step step-function envelopes for pitch, waveshape, and amplitude per line |
| **Modulation Matrix** | Route 7 modulation sources to 51 destinations with adjustable depth |
| **FX Chain** | 6 serial effect slots with 17 effect types |
| **Global Controls** | Polyphony, portamento, volume, pitch bend range, velocity sensitivity |

> **Tip:** Start with the preset browser (click the preset icon in the top bar) and select a sound you like. Then tweak individual parameters to understand what each one does.

## Connecting a MIDI Controller

1. Open the browser's **MIDI settings** (usually under Settings → MIDI or via the browser's permission prompt).
2. Allow access to your MIDI device when prompted.
3. Select your controller from the MIDI input dropdown.
4. Play — your controller notes should now trigger the synth.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| A S D F G H J K | Play notes (C major scale: C4–C5) |
| Space | Toggle sustain pedal |

Next: [Web App →](web-app.md) | [Desktop App →](desktop-app.md) | [DAW Plugin →](plugin.md)