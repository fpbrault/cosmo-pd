---
title: Cosmo PD-101 User Manual
description: A phase distortion synthesizer inspired by the Casio CZ-101.
---

# Cosmo PD-101

> A phase distortion synthesizer inspired by the legendary Casio CZ-101, built in Rust and running on WebAssembly, desktop, and as a DAW plugin.

## Quick Links

<div class="grid cards" markdown>

-   ![Getting Started](https://via.placeholder.com/48x48/1a1a2e/64748b?text=🎹)

    ### [Getting Started](getting-started/index.md)
    Install, connect MIDI, and play your first note.

-   ![Web App](https://via.placeholder.com/48x48/1a1a2e/64748b?text=🌐)
    ### [Web App](getting-started/web-app.md)
    Use the synth in your browser — no installation needed.

-   ![Synth Reference](https://via.placeholder.com/48x48/1a1a2e/64748b?text=🔬)
    ### [Synth Reference](synth-reference/overview.md)
    Deep-dive into oscillators, algorithms, envelopes, modulation, and FX.

-   ![Presets](https://via.placeholder.com/48x48/1a1a2e/64748b?text=💾)
    ### [Presets](presets/managing.md)
    Load, save, organize, and share your sounds.

-   ![Troubleshooting](https://via.placeholder.com/48x48/1a1a2e/64748b?text=🔧)
    ### [Troubleshooting](troubleshooting.md)
    Common issues and how to fix them.

</div>

## About This Synth

**Cosmo PD-101** extends the Casio CZ-101's phase distortion engine with:

- **16 original warp algorithms** — bend, sync, pinch, fold, skew, twist, clip, ripple, mirror, karpunk, fof, terrain, stutter, cheby, plus the classic 8 CZ-101 algorithms
- **Dual oscillator lines** with independent envelopes, detune, and algorithm blending
- **8-step step-function envelopes** — pitch, waveshape, and amplitude per line
- **Modulation matrix** — 7 sources routing to 195 destinations
- **6-slot FX chain** — 17 effect types including chorus, delay, reverb, phaser, distortion, bitcrusher, and lo-fi
- **8-voice polyphony** rendered in SIMD-4 batches for maximum performance
- Runs as a **Web Audio AudioWorklet** (Wasm), **Tauri desktop app**, or **VST3/CLAP/AUv2 plugin**

## Project Links

| Resource | Link |
|----------|------|
| **Source code** | [github.com/fpbrault/cosmo-pd](https://github.com/fpbrault/cosmo-pd) |
| **Releases** | [github.com/fpbrault/cosmo-pd/releases](https://github.com/fpbrault/cosmo-pd/releases) |
| **Engine docs** | [`COSMO_ENGINE.md`](https://github.com/fpbrault/cosmo-pd/blob/main/packages/cosmo-synth-engine/COSMO_ENGINE.md) |
| **Issues** | [github.com/fpbrault/cosmo-pd/issues](https://github.com/fpbrault/cosmo-pd/issues) |
| **Discussions** | [github.com/fpbrault/cosmo-pd/discussions](https://github.com/fpbrault/cosmo-pd/discussions) |