---
title: Algorithms
description: Complete reference of all 25 phase distortion algorithms.
---

# Algorithms

The Cosmo PD-101 offers **25 phase distortion algorithms** — 8 inherited from the Casio CZ-101 and 16 original warp algorithms. Each algorithm is a different mathematical function that reshapes the oscillator's phase before it reads the base waveform, producing a unique timbral character.

<!-- IMAGE_PLACEHOLDER: Screenshot of the algorithm picker/grid in the Phase Lines panel -->

## How to Read This Reference

Each algorithm entry includes:

- **Name** — the label shown in the UI
- **Category** — CZ-101 Legacy or Cosmo Original
- **Default Base Waveform** — the carrier that sounds best with this algo
- **Controls** — the adjustable parameters (knobs/dropdowns)
- **Audio Character** — what the algorithm sounds like at default settings

---

## CZ-101 Legacy Algorithms

These are faithful recreations of the original Casio CZ-101 phase distortion algorithms. Select them by choosing the **CZ101** algorithm and picking a **CZ Preset** from the dropdown.

### CZ Saw
| Parameters | Default | Range |
|-----------|---------|-------|
| Waveform 1 | Saw | Saw, Square, Pulse, Null, Sine Pulse, Saw Pulse, Multi Sine, Pulse 2 |
| Waveform 2 | Saw | (same options) |
| Window | Off | Off, Saw, Triangle, Trapezoid, Pulse, Double Saw |

> **Sound:** Classic bright sawtooth. The foundation of most CZ patches.

### CZ Square
| Parameters | Default | Range |
|-----------|---------|-------|
| Waveform 1 | Square | (same options as above) |
| Waveform 2 | Square | (same options) |
| Window | Off | (same options) |

> **Sound:** Hollow, reedy square wave. Good for thin leads and retro basses.

### CZ Pulse
| Parameters | Default | Range |
|-----------|---------|-------|
| Waveform 1 | Pulse | (same options) |
| Waveform 2 | Pulse | (same options) |
| Window | Off | (same options) |

> **Sound:** Narrower than saw, with a buzzy quality. Brass-like tones.

### CZ Double Sine
| Parameters | Default | Range |
|-----------|---------|-------|
| Waveform 1 | Sine Pulse | (same options) |
| Waveform 2 | Sine Pulse | (same options) |
| Window | Off | (same options) |

> **Sound:** Soft, rounded. Two sine-like components for gentle pads.

### CZ Saw Pulse
| Parameters | Default | Range |
|-----------|---------|-------|
| Waveform 1 | Saw Pulse | (same options) |
| Waveform 2 | Saw Pulse | (same options) |
| Window | Off | (same options) |

> **Sound:** Combination of saw brightness with pulse-width character.

### CZ Reso 1 – 3
| Parameter | Reso 1 | Reso 2 | Reso 3 |
|-----------|--------|--------|--------|
| Waveform 1/2 | Multi Sine | Multi Sine | Multi Sine |
| Window | Saw | Triangle | Trapezoid |

> **Sound:** Resonant, metallic tones. The window function sweeps the resonance character from bright (Saw) to warm (Triangle) to hollow (Trapezoid).

---

## Cosmo Original Warp Algorithms

These 16 algorithms are unique to the Cosmo PD-101 and expand well beyond the original CZ palette.

### Bend
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Bend Curve | 50% | 0–100% | Curvature of the bend |
| Bend Bias | 0% | -100% to +100% | Asymmetric offset |
| Bend Knee | 50% | 0–100% | Softness of the bend point |

> **Audio:** Pitch-dependent timbral shift. Creates expressive, vocal-like tones that change character across the keyboard.

### Sync
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Sync Ratio | 50% | 0–100% | Ratio of synced to master frequency |
| Sync Phase | 0° | 0°–360° | Phase offset on reset |
| Sync Curve | 50% | 0–100% | Shape of the sync waveform |
| Sync Window | 50% | 0–100% | Windowing of the sync region |

> **Audio:** Hard-sync style. Metallic, screaming leads. Classic sync-sweep sounds when modulated by an envelope.

### Pinch
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Pinch Focus | 50% | 0–100% | Center point of the pinch |
| Pinch Asym | 0% | -100% to +100% | Asymmetry |
| Pinch Curve | 50% | 0–100% | Curve shape |
| Pinch Drive | 50% | 0–100% | Intensity |

> **Audio:** Squeezed, nasal tones. Can range from subtle formant-like shifts to aggressive distortion.

### Fold
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Fold Stages | 50% | 0–100% | Number of folding stages |
| Fold Tilt | 0% | -100% to +100% | Asymmetric tilt |
| Fold Symmetry | 0% | -100% to +100% | Symmetry of folding |
| Fold Softness | 0% | 0–100% | Smoothing |

> **Audio:** Wavefolder. Subtle folds add harmonics; extreme settings create chaotic, noisy textures.

### Skew
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Skew Bias | 20% | 0–100% | Bias point |
| Skew Curve | 50% | 0–100% | Curve intensity |
| Skew Spread | 0% | -100% to +100% | Stereo spread |
| Skew Tilt | 0% | -100% to +100% | Asymmetry |

> **Audio:** Skews the phase curve, producing asymmetric waveforms. Great for evolving pad timbres.

### Twist
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Twist Harmonics | 50% | 0–100% | Harmonic content |
| Twist Depth | 50% | 0–100% | Intensity of twist |
| Twist Phase | 0° | 0°–360° | Phase rotation |
| Twist Shape | 50% | 0–100% | Shape of the twist curve |

> **Audio:** Spiraling, vortex-like timbres. Can sound like a slow phaser at low settings, aggressive at high.

### Clip
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Clip Drive | 50% | 0–100% | Drive amount |
| Clip Shape | 50% | 0–100% | Hardness of clipping |
| Clip Bias | 0% | -100% to +100% | DC offset bias |
| Clip Soft | 0% | 0–100% | Soft clipping blend |

> **Audio:** Distortion-style clipping. Ranges from warm tube saturation to hard digital clipping.

### Ripple
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Ripple Freq | 50% | 0–100% | Ripple frequency |
| Ripple Depth | 50% | 0–100% | Depth of modulation |
| Ripple Phase | 0° | 0°–360° | Phase offset |
| Ripple Shape | 50% | 0–100% | Shape of ripples |

> **Audio:** Undulating, watery textures. Multiple ripples create complex interference patterns.

### Mirror
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Mirror Center | 50% | 0–100% | Center point |
| Mirror Blend | 50% | 0–100% | Dry/wet mix |
| Mirror Clip | 0% | 0–100% | Clipping at mirror point |
| Mirror Skew | 0% | -100% to +100% | Asymmetry |

> **Audio:** Mirrors the phase curve around a center point. Creates metallic, bell-like tones.

### Karpunk
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Karpunk Damp | 50% | 0–100% | Damping factor |
| Karpunk Bright | 50% | 0–100% | Brightness |
| Karpunk Decay | 50% | 0–100% | Decay character |
| Karpunk Excite | 0% | 0–100% | Excitation amount |

> **Audio:** Noisy, chaotic. Named for its karplus-strong-like pluck quality with added grit.

### FOF (Formant)
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| FOF Ratio | 50% | 0–100% | Formant ratio |
| FOF Tightness | 50% | 0–100% | Spectral tightness |
| FOF Offset | 0% | -100% to +100% | Formant offset |
| FOF Skew | 0% | -100% to +100% | Asymmetry |

> **Audio:** Vocal/formant-like. Can produce vowel-like timbres and talking-bass effects.

### Terrain
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Terrain Ratio | 2.0 | 1.0–8.0 | Terrain frequency ratio |
| Terrain Depth | 50% | 0–100% | Depth of terrain features |
| Terrain FM Phase | 0° | 0°–360° | FM phase offset |
| Terrain Shape | 0% | 0–100% | Shape complexity |

> **Audio:** Organic, terrain-like textures. Evolving, landscape-inspired timbres.

### Stutter
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Stutter Segs | 25% | 0–100% | Number of segments |
| Stutter Reverse | 100% | 0–100% | Reversal amount |
| Stutter Slip | 0% | 0–100% | Time displacement |
| Stutter Spacing | 0% | 0–100% | Spacing between stutters |

> **Audio:** Granular stutter effect. Rhythmic gating and glitch textures.

### Cheby (Chebyshev)
| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Cheby Order | 20% | 0–100% | Polynomial order |
| Cheby Tilt | 0% | -100% to +100% | Spectral tilt |
| Cheby Warp | 0% | 0–100% | Chebyshev warping |

> **Audio:** Polynomial-based distortion. Clean at low orders, increasingly complex harmonics as order rises.

---

## Algorithm Quick Reference

| Algorithm | Category | Best For | Default Waveform |
|-----------|----------|----------|-----------------|
| CZ Saw | CZ Legacy | Classic synth leads | Saw |
| CZ Square | CZ Legacy | Retro / hollow tones | Square |
| CZ Pulse | CZ Legacy | Brass / reeds | Pulse |
| CZ Double Sine | CZ Legacy | Soft pads | Sine Pulse |
| CZ Saw Pulse | CZ Legacy | Bright + narrow | Saw Pulse |
| CZ Reso 1–3 | CZ Legacy | Metallic resonance | Multi Sine |
| Bend | Cosmo | Expressive / vocal | Sine |
| Sync | Cosmo | Screaming leads | Sine |
| Pinch | Cosmo | Nasal / formant | Sine |
| Fold | Cosmo | Wavefolding grit | Sine |
| Skew | Cosmo | Evolving pads | Sine |
| Twist | Cosmo | Spiral / vortex | Sine |
| Clip | Cosmo | Distortion | Sine |
| Ripple | Cosmo | Watery textures | Sine |
| Mirror | Cosmo | Metallic / bells | Sine |
| Karpunk | Cosmo | Noisy / plucky | Sine |
| FOF | Cosmo | Vocal formants | Sine |
| Terrain | Cosmo | Organic textures | Sine |
| Stutter | Cosmo | Granular glitch | Sine |
| Cheby | Cosmo | Polynomial distortion | Sine |

Next: [Envelopes →](envelopes.md) | Previous: [Oscillators →](oscillators.md)