# Cosmo PD: Feature Roadmap

Status for the 0.8.0 codebase, reviewed on 2026-09-23. Complete means implemented in this checkout; proposed changes and open PRs are listed separately.

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
| Adjustable polyphony (1–16 voices; default 8) | ✅ |
| Additional synthesis algorithms (incl. subtractive) | 🔵 |
| Alternative ADSR envelope shapes | 🔵 |
| Additional mod sources (functions, etc.) | 🔵 |
| Ring mod matching CZ-101 behaviour | 🔵 |
| Saveable per-FX module presets | ✅ |
| Window functions for all algos | ✅ |
| Ability to change the carrier wave | ✅ |

---

## Synth UI Library (`cosmo-pd101`)

| Feature | Status |
|---------|--------|
| Core synth UI components | ✅ |
| Simple workspace (default for new sessions) and Advanced editor | ✅ |
| Compact Sound, Envelope, and Effects sections | ✅ |
| Reusable envelope presets and copying | ✅ |
| Multi-file JSON and CZ SysEx preset import | ✅ |
| Interactive envelope editors | ✅ |
| SysEx decoder (CZ-101 format) | ✅ |
| Preset conversion utilities | ✅ |
| Shared hooks (`useAudioEngine`, `useSynthState`) | ✅ |
| Visual waveform scope | ✅ |
| CZ Direct Control Mode | 🔵 |
| CZ101 mode (only features on real hardware) | 🔵 |
| UI layout: support > 1280×800 | ✅ |
| UI layout: support < 1280×800 | ✅ |
| Live display for LFOs / Random / Mod envelope | ✅ |
| Improved mod matrix UI | ✅ |
| Standalone app | ✅ |

---

## Plugin (`cosmo-pd101-plugin`)

| Feature | Status |
|---------|--------|
| VST3 plugin build | ✅ |
| CLAP plugin build | ✅ |
| AUv2 plugin build | ✅ |
| WebView IPC bridge | ✅ |
| Installer packaging | ✅ |
| MIDI CC mapping | ✅ |
| Better integration between in-app and VST presets | 🔵 |

---

## Follow-up Work

These items are not included in the completed features above. PR status is a snapshot from 2026-09-23.

| Work | Status / next step |
|------|--------------------|
| Tempo and voice allocation accessible in Simple mode | [PR #391](https://github.com/fpbrault/cosmo-pd/pull/391); resolve failing lint and unit checks |
| Shared quick-picker/library filters | [PR #370](https://github.com/fpbrault/cosmo-pd/pull/370); resolve merge conflicts |
| Web display performance regression checks | Benchmark tooling exists, but the CI job is disabled; stabilize and re-enable it |
| Debug diagnostics | Reconcile [draft PR #376](https://github.com/fpbrault/cosmo-pd/pull/376) with current code |
| Consistent DCW amount terminology | [PR #352](https://github.com/fpbrault/cosmo-pd/pull/352); resolve merge conflicts and preserve compatibility |
| DAW preset integration | [Issue #51](https://github.com/fpbrault/cosmo-pd/issues/51) |
| Complete CZ SysEx compatibility | [Issue #52](https://github.com/fpbrault/cosmo-pd/issues/52) |
| Hardware-limited CZ101 mode | [Issue #53](https://github.com/fpbrault/cosmo-pd/issues/53) |
| Live CZ hardware editing | [Issue #55](https://github.com/fpbrault/cosmo-pd/issues/55) |
| Alternate envelopes | [Issue #56](https://github.com/fpbrault/cosmo-pd/issues/56) |
| AUv3 migration to truce | Existing separate AUv3 implementation is deprecated; verify host/session compatibility before replacement |
| VZ / iPD synthesis | Design proposal exists under `plans/`; its prerequisite engine abstractions are absent from this checkout |
