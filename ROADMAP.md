# Cosmo PD: Feature Roadmap

Current development status and planned features.

## Status Key

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete |
| 🚧 | In Progress |
| 🔵 | Planned |

---

## Synth Engine (Rust/DSP)

| Feature | Status |
|---------|--------|
| Core Phase Distortion engine | ✅ |
| CZ envelope (ADSR + 8-stage MSEG) | ✅ |
| Polyphonic voice management | ✅ |
| Variable voice count for polyphony | 🔵 |
| Additional synthesis algorithms (incl. subtractive) | 🔵 |
| Alternative ADSR envelope shapes | 🔵 |
| Additional mod sources (functions, etc.) | 🔵 |
| Migrate to nih-plug | 🔵 |
| Ring mod matching CZ-101 behaviour | 🔵 |
| Saveable per-FX module presets | 🔵 |
| Window functions for all algos | 🔵 |
| Ability to change the carrier wave | 🔵 |

---

## Synth UI Library (`cosmo-pd101`)

| Feature | Status |
|---------|--------|
| Core synth UI components | ✅ |
| Interactive envelope editors | 🚧 |
| SysEx decoder (CZ-101 format) | ✅ |
| Preset conversion utilities | ✅ |
| Shared hooks (`useAudioEngine`, `useSynthState`) | ✅ |
| Visual waveform scope | ✅ |
| CZ Direct Control Mode | 🔵 |
| CZ101 mode (only features on real hardware) | 🔵 |
| UI layout: support > 1280×800 | 🔵 |
| UI layout: support < 1280×800 | 🔵 |
| Live display for LFOs / Random / Mod envelope | 🔵 |
| Improved mod matrix UI | 🔵 |
| Standalone app (Tauri) | 🔵 |

---

## Plugin (`cosmo-pd101-plugin`)

| Feature | Status |
|---------|--------|
| VST3 plugin build | ✅ |
| CLAP plugin build | 🚧 |
| AUv2 plugin build | ✅ |
| WebView IPC bridge | ✅ |
| Installer packaging | 🚧 |
| MIDI CC mapping | 🔵 |
| Better integration between in-app and VST presets | 🔵 |


---

## Known Issues

| Issue | Status |
|-------|--------|
| Single Cycle display not accurate | 🔵 |
| Noise mod not working correctly | 🔵 |
| Audio glitches when changing presets during playback | 🔵 |
| DCO speeds up as level increases | 🔵 |
| Envelope editor behaves unexpectedly | 🔵 |
