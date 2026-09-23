---
title: Modulation Matrix
description: Routing modulation sources to destinations.
---

# Modulation Matrix

Routes modulation sources to parameters across the entire synth with adjustable depth.

## Using the Matrix

In **Advanced**, open the modulation matrix. It has three pages, each with eight source rows and eight destination columns.

1. Select a source row header and choose a source; use search to narrow the list.
2. Select a destination column header and browse the parameter groups or search by name.
3. Adjust the amount in the cell where that row and column meet. Positive and negative amounts give opposite modulation directions.
4. Use another page when you need more room to organize your routes.

## Sources

| Source | Description |
|--------|-------------|
| **LFO 1** | Sine, triangle, square, saw, inverted saw |
| **LFO 2** | Same waveforms as LFO 1 |
| **Random** | Sample-and-hold random value |
| **Mod Env** | 4-stage ADSR modulation envelope |
| **Velocity** | MIDI note-on velocity (0-127) |
| **Mod Wheel** | MIDI CC 1 |
| **Aftertouch** | Channel pressure or poly aftertouch |
| **Macro 1-4** | User-assignable macro knobs (MIDI CC 8, 41, 42, 43) |

## Destinations (195 total)

| Category | Count | Examples |
|----------|-------|----------|
| **Global** | 2 | Volume, Pitch |
| **Line 1** | 13 | DcwBase, DcaBase, AlgoBlend, Octave, AlgoControl1-8 |
| **Line 2** | 12 | DcwBase, DcaBase, AlgoBlend, Detune, AlgoControl1-8 |

:::warning
AlgoBlend and Octave/Detune are listed as modulation destinations but do not currently modulate the signal. Modulation support for these destinations is planned for a future update.
:::
| **Filter** | 3 | Cutoff, Resonance, EnvAmount |
| **FX** | 41 | All effect slot parameters |
| **Modulation** | 13 | LFO rate/depth/symmetry/offset, RandomRate |
| **Envelopes** | 96 | 2 lines x 3 env types x 8 steps x 2 fields |
| **Total** | **195** | |

## MIDI Learn

Bind any MIDI CC to any modulatable parameter for tactile control.

1. **Right-click** (or **Alt-click**) a parameter.
2. **Move** a knob or fader on your MIDI controller.
3. The binding is stored with your preset.

:::info
Not all controls support MIDI Learn yet. Blend, Octave, and the 12-octave range controls do not currently accept MIDI bindings.
:::

## Routing

Each route: Source + Destination + Depth (positive or negative).

### Quick Tips

:::tip

- **Vibrato**: LFO 1 -> Vibrato Depth
- **Tremolo**: LFO 2 -> Volume
- **Expressive filter**: Mod Wheel -> FilterCutoff
- **Auto-wah**: Aftertouch -> FilterCutoff
- **Rising pad**: Mod Env -> DCW Envelope depth

:::

Next: [Effects](/synth-reference/effects) | Previous: [Envelopes](/synth-reference/envelopes)
