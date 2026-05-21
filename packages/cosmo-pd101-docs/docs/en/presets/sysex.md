---
title: SysEx Import / Export
description: Importing and exporting Casio CZ-101 SysEx dumps.
---

# SysEx Import / Export

The Cosmo PD-101 can import **Casio CZ-101 SysEx patch dumps**.

## What is SysEx?

System Exclusive MIDI messages. CZ-101 stores each patch as a 464-byte SysEx dump (256-byte nibble-encoded payload).

## Importing a CZ-101 Patch

- **From MIDI**: Connect device or load `.mid` file with SysEx.
- **From File**: Click "Import SysEx", select `.syx` or `.mid`.

## Decoding Process

MIDI SysEx (464 bytes) -> Nibble-pair decode (256 bytes) -> Section parser (25 sections) -> Parameter mapping -> Convert to Cosmo format -> Load.

### Internal Representation

Sections 1-2: Patch name. Sections 3-20: Algorithm/waveform. Sections 21-22: Envelope data. Sections 23-24: LFO/modulation. Section 25: Performance settings.

## Exporting Presets

Select preset, click "Export as SysEx", save as `.syx`.

## Compatible Patch Sources

CZ-101 Librarian, SysexData.com, hardware CZ-101 (direct MIDI), CZ-Explorer.

## Known Limitations

:::warning

- Cosmo algorithms have no CZ-101 equivalent -> fallback to closest CZ algo.
- Window function mapping may sound different.
- CZ-101 has no built-in FX -> SysEx patches don't include FX settings.

:::

## Quick Reference

| Format | Extension | Contents |
|--------|-----------|----------|
| SysEx dump | `.syx` | Raw MIDI SysEx data |
| MIDI file | `.mid` | Standard MIDI with embedded SysEx |
| Cosmo preset | `.json` | Full preset including FX and modulation |

Next: [Troubleshooting](/troubleshooting) | Previous: [Managing Presets](/presets/managing)
