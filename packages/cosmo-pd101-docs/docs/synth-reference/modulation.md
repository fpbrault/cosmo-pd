---
title: Modulation Matrix
description: Routing modulation sources to destinations, including the mod envelope and routing configuration.
---

# Modulation Matrix

The **Modulation Matrix** routes modulation sources to parameters across the entire synth, allowing any source to control almost any parameter with adjustable depth.

## Signal Flow

```
Mod Sources                    Modulation Matrix                Destinations
─────────────                  ──────────────────────           ────────────
LFO 1  ─┐
LFO 2  ─┤
Random ─┤                    ┌───────────────────┐            ┌──────────────┐
ModEnv ─┼──── depth ────────▶│  7 × 195 Matrix   │──────────▶│  Global       │
Veloc ─┤                     │  (per-route depth)│            │  Filter       │
ModWhl ─┤                    └───────────────────┘            │  FX params    │
Aftert ─┘                                                      │  LFO params   │
                                                               │  Envelope     │
                                                               │  parameters   │
                                                               └──────────────┘
```

## Sources

| Source | Description |
|--------|-------------|
| **LFO 1** | Low-Frequency Oscillator 1 (sine, triangle, square, saw, inverted saw) |
| **LFO 2** | Low-Frequency Oscillator 2 (same waveforms as LFO 1) |
| **Random** | Sample-and-hold random value |
| **Mod Env** | 4-stage ADSR modulation envelope (separate from the 8-step step envelopes) |
| **Velocity** | MIDI note-on velocity (0–127, normalized 0–1) |
| **Mod Wheel** | MIDI CC 1 (modulation wheel) |
| **Aftertouch** | MIDI channel pressure or poly aftertouch |

## Destinations

There are **195 destinations** organized by category:

| Category | Count | Examples |
|----------|-------|----------|
| **Global** | 2 | Volume, Pitch |
| **Line 1 parameters** | 13 | Line1DcwBase, Line1DcaBase, Line1AlgoBlend, Line1Octave, Line1AlgoParam1–8 |
| **Line 2 parameters** | 12 | Line2DcwBase, Line2DcaBase, Line2AlgoBlend, Line2DetuneNote/DetuneFine/DetuneOctave, Line2AlgoParam1–8 |
| **Filter** | 3 | FilterCutoff, FilterResonance, FilterEnvAmount |
| **FX parameters** | 41 | All effect slot parameters (rate, depth, mix, etc.) |
| **Modulation** | 13 | LFO 1/2 rate/depth/symmetry/offset, RandomRate |
| **Envelopes** | 96 | 2 lines × 3 env types (DCO/DCW/DCA) × 8 steps × 2 fields (Level/Rate) |
| **Total** | **195** | |

## Routing

Each routing point has three components:

- **Source** — which modulation source outputs the signal
- **Destination** — which parameter receives the modulation
- **Depth** — the amount of modulation applied (can be positive or negative for some destinations)

### Mod Envelope

The **Mod Envelope** is a 4-stage ADSR envelope (Attack, Decay, Sustain, Release) dedicated to modulation routing. It is separate from the 8-step step envelopes used for DCO/DCW/DCA per line. The Mod Envelope:

- Has its own **Depth** control that scales the envelope's output
- Outputs a unipolar signal (0 to 1) that multiplies the depth for each route where it's selected
- Is useful for creating time-varying modulation — e.g., a slow LFO tremolo that fades in over time

### Quick Tips

| Goal | Suggested Routing |
|------|-------------------|
| Vibrato via LFO | LFO 1 → Vibrato Depth (Line 1 + Line 2) |
| Tremolo via LFO | LFO 2 → Volume |
| Expressive filter | Mod Wheel → FilterCutoff |
| Auto-wah | Aftertouch → FilterCutoff |
| Rising pad | Mod Env → DCW Envelope depth |

Next: [Effects →](effects.md) | Previous: [Envelopes →](envelopes.md) | [Overview →](overview.md) | [Algorithms →](algorithms.md)