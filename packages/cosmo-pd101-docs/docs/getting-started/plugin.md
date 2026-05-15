---
title: DAW Plugin
description: Using the Cosmo PD-101 as a VST3, CLAP, or AUv2 plugin in your DAW.
---

# DAW Plugin

The **Cosmo PD-101 Plugin** runs as a **VST3**, **CLAP**, or **AUv2** plugin inside your DAW. It uses the native Rust synth engine via **nih-plug** and an embedded webview for the UI.

<!-- IMAGE_PLACEHOLDER: Screenshot of the plugin inside a DAW (e.g., Ableton Live, Bitwig, Reaper) -->

## Supported Formats

| Format | Platform | DAW Compatibility |
|--------|----------|-------------------|
| **VST3** | Windows, macOS | Ableton Live, FL Studio, Bitwig, Reaper, Cubase, Logic (via Blue Cat), etc. |
| **CLAP** | Windows, macOS, Linux | Any CLAP-compatible host (Bitwig 5+, Waveform 12+, Reaper 7+) |
| **AUv2** | macOS only | Logic Pro, Ableton Live (macOS), MainStage, etc. |

## Installation

1. **Download** the latest plugin package from [releases](https://github.com/fpbrault/cosmo-pd/releases).
2. **Extract** the archive.
3. **Copy** the plugin to your DAW's plugin directory:

| DAW | Plugin Directory |
|-----|-----------------|
| Ableton Live | `~/Music/Ableton/User Library/Plugins/` (macOS) or `%USERPROFILE%\Music\Ableton\User Library\Plugins\` (Windows) |
| FL Studio | `C:\Program Files\Image-Line\FL Studio\Plugins\` |
| Bitwig | `%USERPROFILE%\Documents\Bitwig Studio\content\` |
| Logic / MainStage | `~/Library/Audio/Plug-Ins/` |

> After copying, rescan your plugins in the DAW (usually a rescan option in the plugin browser).

## Using the Plugin

### Loading in Your DAW

1. Create a MIDI track in your DAW.
2. Insert **Cosmo PD-101** as an instrument plugin on that track.
3. Arm the track for MIDI input (connect your controller or use the DAW's virtual keyboard).
4. Play!

### Plugin Window

The plugin opens as a **resizable floating window** containing the same SynthRenderer UI as the web/desktop versions. Resize by dragging the corner. The webview scales proportionally.

<!-- IMAGE_PLACEHOLDER: Screenshot of the plugin UI floating in a DAW, with parameter knobs visible -->

### Automation

All parameters are automatable. In your DAW:

1. Right-click any knob → "Show Automation" (DAW-dependent).
2. Draw automation lanes as you would for any VST/CLAP parameter.

The parameter list available for automation matches the full parameter set — see the [Algorithms](algorithms.md), [Envelopes](envelopes.md), [Modulation](modulation.md), and [Effects](effects.md) pages for parameter details.

### Presets in the Plugin

The plugin stores presets within its own state. To save/load:

- Click the **preset icon** in the top bar of the plugin window.
- **Factory presets** are pre-loaded with the plugin.
- **User presets** are saved via the preset browser and stored in the DAW's plugin data directory.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Plugin doesn't appear in DAW | Rescan plugins; check the correct plugin folder for your format |
| Black screen in plugin window | Ensure GPU acceleration is enabled in your DAW; try a different UI scale |
| No audio output | Check DAW track routing; ensure the plugin is armed and monitoring is on |
| CPU spikes | Reduce polyphony in Global Controls; disable unused effects |

See [Troubleshooting](troubleshooting.md) for more help.

Previous: [Web App](web-app.md) | Next: [Overview →](overview.md)