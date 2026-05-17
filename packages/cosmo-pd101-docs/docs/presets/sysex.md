---
title: SysEx Import / Export
description: Importing and exporting Casio CZ-101 SysEx dumps.
---

# SysEx Import / Export

The Cosmo PD-101 can import **Casio CZ-101 SysEx patch dumps**, allowing you to use patches from the original hardware or from online CZ-101 libraries.

<!-- IMAGE_PLACEHOLDER: Diagram showing the SysEx decode pipeline — MIDI In → SysEx Capture → Nibble Decode → Patch Data → Convert to Engine Preset -->

## What is SysEx?

**System Exclusive (SysEx)** is a MIDI message format for sending proprietary data between devices. The CZ-101 stores each patch as a 464-byte SysEx dump containing all synthesis parameters.

## Importing a CZ-101 Patch

### From a MIDI File

1. Connect a MIDI device or load a `.mid` file containing SysEx data.
2. The synth captures incoming SysEx messages.
3. The **SysEx decoder** parses the 256-byte nibble-encoded patch data into the internal preset format.

### From a File

1. Open the preset library.
2. Click **"Import SysEx"**.
3. Select a `.syx` or `.mid` file.
4. The decoder processes the data and the patch is loaded.

### Via the Mod Matrix

For advanced users: route the decoded patch data through the modulation matrix to remap parameters during import.

## Decoding Process

The import path runs through several stages:

```
MIDI SysEx Bytes (464 bytes)
    → Nibble-pair decode (256 bytes)
    → Section parser (25 sections of patch data)
    → Parameter mapping (waveform, envelope, modulation, etc.)
    → Convert to Cosmo PD-101 preset format
    → Load into synth engine
```

### Internal Representation

The decoder (in `src/lib/midi/czSysexDecoder.ts`) handles:

| Section | Data |
|---------|------|
| Sections 1–2 | Patch name (22 characters) |
| Sections 3–20 | Algorithm and waveform parameters |
| Sections 21–22 | Envelope data (pitch, DCW, DCA per line) |
| Sections 23–24 | LFO and modulation settings |
| Section 25 | Performance settings (portamento, velocity, etc.) |

> **Note:** The CZ-101 uses a **nibble-pair encoding** scheme where each byte contains two 4-bit values. The first 80 bytes of the 256-byte payload are parity-checked and decoded.

## Exporting Presets

Export your own patches in a format compatible with other CZ-101 software:

1. Open the preset library.
2. Select a preset.
3. Click **"Export as SysEx"** (if the full SysEx export feature is enabled).
4. Save as a `.syx` file.

## Compatible Patch Sources

| Source | Format | Notes |
|--------|--------|-------|
| **CZ-101 Librarian** | `.syx` | Standard SysEx dumps |
| **SysexData.com** | `.syx`, `.mid` | Large patch libraries |
| **Hardware CZ-101** | MIDI SysEx | Direct transfer via MIDI cable |
| **CZ-Explorer** | JSON / SysEx | Converts between formats |

## Known Limitations

| Limitation | Details |
|-----------|---------|
| **Algorithm mapping** | The 16 original Cosmo algorithms have no direct CZ-101 equivalent. When a SysEx patch references a Cosmo algorithm, it falls back to the closest CZ-101 algorithm. |
| **Window function** | The CZ-101 window options map to Cosmo's Window function. Some combinations may sound different. |
| **Polyphony** | The original CZ-101 is 8-voice polyphonic. Cosmo matches this. |
| **FX** | The CZ-101 has no built-in FX. SysEx patches do not include effect settings. |

## Quick Reference: File Formats

| Format | Extension | Contents |
|--------|-----------|----------|
| SysEx dump | `.syx` | Raw MIDI SysEx data (1 or more patches) |
| MIDI file | `.mid` | Standard MIDI with embedded SysEx |
| Cosmo preset | `.json` | Full preset including FX and modulation |

Next: [Troubleshooting →](troubleshooting.md) | Previous: [Managing Presets →](managing.md)