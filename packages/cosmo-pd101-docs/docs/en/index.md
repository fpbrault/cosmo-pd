---
title: Cosmo PD-101 User Manual
description: A phase distortion synthesizer inspired by the Casio CZ-101.
---

# Cosmo PD-101

> A phase distortion synthesizer inspired but also expanding on the concept of the legendary Casio CZ-101, built in Rust and running on WebAssembly, desktop, and as a DAW plugin.

## Quick Links

- **[Getting Started](/getting-started/)** -- Install, connect MIDI, and play your first note.
- **[Web App](/getting-started/web-app)** -- Use the synth in your browser -- no installation needed.
- **[Synth Reference](/synth-reference/overview)** -- Deep-dive into oscillators, algorithms, envelopes, modulation, and FX.
- **[Presets](/presets/managing)** -- Load, save, organize, and share your sounds.
- **[Troubleshooting](/troubleshooting)** -- Common issues and how to fix them.

## About This Synth

**Cosmo PD-101** is inspired by the Casio CZ-101's phase distortion engine but goes further with:

- **14 sound generation algorithms** -- bend, sync, pinch, fold, skew, twist, clip, ripple, mirror, fof, terrain, stutter, cheby, plus the classic CZ-101 algorithm
- **Dual oscillator lines** with independent envelopes, detune, and the possibility to blend a secondary algorithm
- **8-step step-function envelopes** -- pitch, waveshape, and amplitude per line
- **Modulation matrix** -- 11 sources routing to most synth parameters
- **6-slot FX chain** -- 17 effect types including chorus, delay, reverb, phaser, distortion, bitcrusher, and lo-fi
- **8-voice polyphony** rendered in SIMD-4 batches for maximum performance
- Runs as a **Web Audio AudioWorklet** (Wasm) or **VST3/CLAP/AUv2 plugin**

## Support the Project

Cosmo PD-101 is **free** and open source under the GPLv3 license. If you find it useful, financial support helps cover hosting, development tools, and future features — and is deeply appreciated.

[**purraudio.dev/store**](https://store.purraudio.dev/)

## Project Links

| Resource | Link |
|----------|------|
| **Store** | [store.purraudio.dev](https://store.purraudio.dev/) |
| **Source code** | github.com/fpbrault/cosmo-pd |
| **Releases** | github.com/fpbrault/cosmo-pd/releases |
| **Engine docs** | COSMO_ENGINE.md |
| **Issues** | github.com/fpbrault/cosmo-pd/issues |
| **Discussions** | github.com/fpbrault/cosmo-pd/discussions |
