---
title: SysEx Import / Export
description: Importing and exporting Casio CZ-101 SysEx dumps.
---

# SysEx Import / Export

The Cosmo PD-101 can import **Casio CZ-101 SysEx patch dumps** into the preset library.

## What is SysEx?

System Exclusive MIDI messages. A canonical CZ-101 patch occupies 264 raw bytes: a 256-byte nibble-encoded payload plus its SysEx framing and header.

## Importing a CZ-101 Patch

- **From files**: Open the preset library and click **Import**, then select one or more `.syx`, `.json`, or `.toml` files.
- **By drag and drop**: Drag files anywhere over the open preset library. Valid files are imported even if another file in the batch is invalid.
- A single `.syx` file may contain multiple concatenated CZ messages; each message becomes its own preset.

## Decoding Process

MIDI SysEx (264 bytes) -> Nibble-pair decode (128 logical bytes) -> Section parser -> Parameter mapping -> Convert to Cosmo format -> Load.

### Internal Representation

Sections 1-2: Patch name. Sections 3-20: Algorithm/waveform. Sections 21-22: Envelope data. Sections 23-24: LFO/modulation. Section 25: Performance settings.

## Compatible Patch Sources

CZ-101 Librarian, SysexData.com, hardware CZ-101 (direct MIDI), CZ-Explorer.

## Known Limitations

:::warning

- Cosmo algorithms have no CZ-101 equivalent -> fallback to closest CZ algo.
- Window function mapping may sound different.
- CZ-101 has no built-in FX -> SysEx patches don't include FX settings.
- Standard MIDI `.mid` files are not currently parsed by the library.

:::

## Quick Reference

| Format | Extension | Contents |
|--------|-----------|----------|
| SysEx dump | `.syx` | Raw MIDI SysEx data |
| Cosmo preset | `.json` | Full preset including FX and modulation |

Next: [Troubleshooting](/troubleshooting) | Previous: [Managing Presets](/presets/managing)
