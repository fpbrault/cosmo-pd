---
title: Managing Presets
description: How to save, load, organize, and share presets.
---

# Managing Presets

<!-- IMAGE_PLACEHOLDER: Screenshot of the Preset Library browser with preset cards -->

## Where Presets Live

Presets are stored in the browser's **IndexedDB** (web app) or in a local **presets directory** (desktop/plugin). They are exportable as plain **JSON** files for sharing or backup.

## Loading a Preset

1. Click the **preset icon** in the top bar to open the preset library.
2. Browse or search for a preset by name.
3. Scroll through the list or use the sidebar categories.
4. Click a preset to **load** it into the synth — it replaces the current settings.

## Saving a Preset

1. Adjust the synth controls to create your sound.
2. Click **"Save preset"** in the preset panel.
3. Enter a **name** for the preset.
4. Optionally add a **category** and **tags** for organization.
5. The preset is saved as JSON and appears in the library.

## Preset File Format

Presets use a versioned JSON schema (currently `v1`):

```json
{
  "schemaVersion": 1,
  "params": {
    "lineSelect": "L1+L2",
    "modMode": "normal",
    "octave": 0,
    "volume": 0.8,
    "polyMode": "poly8",
    "legato": false,
    "portamento": {
      "enabled": false,
      "mode": "rate",
      "rate": 0.5,
      "time": 200
    },
    "line1": {
      "algo": "bend",
      "algo2": "fold",
      "algoBlend": 0.3,
      "baseWaveformA": "sine",
      "baseWaveformB": "sine",
      "window": "off",
      "dcaBase": 0.8,
      "dcwBase": 0.5,
      "modulation": 0.0,
      "detuneNote": 0,
      "detuneFine": 0,
      "octave": 0,
      "dcoEnv": {
        "steps": [
          { "level": 0, "rate": 5 },
          { "level": 100, "rate": 15 },
          { "level": 60, "rate": 20 },
          { "level": 60, "rate": 0 },
          { "level": 60, "rate": 0 },
          { "level": 60, "rate": 0 },
          { "level": 60, "rate": 0 },
          { "level": 60, "rate": 0 }
        ],
        "sustainStep": 3,
        "stepCount": 8,
        "loop": false
      },
      "dcwEnv": { "<dcw_steps>": "..." },
      "dcaEnv": { "<dca_steps>": "..." },
      "keyFollow": 0,
      "algoControlsA": [],
      "algoControlsB": []
    },
    "line2": { "<same structure as line1>" },
    "modMatrix": {
      "routes": [
        { "source": "lfo1", "destination": "pitch", "amount": 0.2, "enabled": true }
      ]
    },
    "fxSlots": [
      { "type": "reverb", "params": { "mix": 0.4, "space": 0.6, ... } },
      { "type": "empty" },
      ...
    ]
  }
}
```

## Importing / Exporting Presets

### Export (Download)

1. Open the preset library.
2. Hover over a saved preset and click the **download icon**.
3. The preset is saved as `preset-name.json` to your computer.

### Import (Load from file)

1. Open the preset library.
2. Click **"Import preset"**.
3. Select a `.json` file.
4. The preset loads into the synth.

### Drag & Drop

You can also **drag a `.json` preset file** directly onto the browser window to import it.

## Sharing Presets

Preset JSON files are portable across all platforms:

- **Web ↔ Desktop ↔ Plugin**: A preset saved from the web app will load identically in the desktop or plugin version.
- **Git / Version control**: Preset JSON files diff well and can be stored in a Git repository.

## Importing Casio CZ-101 SysEx

See [SysEx Import / Export](sysex.md) for details on loading original CZ-101 patch dumps.

## Organizing Presets

| Method | How |
|--------|-----|
| **Search** | Type in the search bar to filter presets by name |
| **Categories** | Assign presets to categories when saving |
| **Tags** | Add free-form tags for flexible grouping |
| **Favorites** | Star presets for quick access |

## Factory Presets

The synth ships with a set of **factory presets** covering a range of classic and experimental sounds:

- **Lead** — Bright, cutting monophonic sounds
- **Bass** — Deep, punchy low-end
- **Pad** — Wide, evolving polyphonic textures
- **FX** — Experimental and textural patches

> **Tip:** Use the factory presets as starting points. Load one, then tweak knobs to make it your own.

Next: [SysEx Import / Export →](sysex.md) | Previous: [Effects →](effects.md)