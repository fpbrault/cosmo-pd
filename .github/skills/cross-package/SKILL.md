---
name: cross-package
description: "Work across multiple packages in the cosmo-pd monorepo. Use when: adding a new export to cosmo-pd101's public API (index.ts); tracing how a feature flows from Rust DSP through WASM bindings to React UI; understanding data flow between packages; synchronizing types across package boundaries; managing shared dependencies."
---

# Cross-Package Workflows

Guide for working across packages in the cosmo-pd monorepo.

## Package Dependency Graph

```
cosmo-synth-engine (Rust/WASM)
        ↓ compiled to WASM + TS bindings
cosmo-pd101 (React/TS synth lib)
        ↓ exported via index.ts → lib-dist/
cosmo-pd101-plugin (VST3/CLAP/AUv2)
```

## Adding a Parameter End-to-End

New synth parameter from DSP to UI:

| Step | Location | Action |
|------|----------|--------|
| 1 | `cosmo-synth-engine/src/params.rs` | Add Rust parameter |
| 2 | `cosmo-synth-engine/src/wasm.rs` | Expose via wasm-bindgen |
| 3 | `cosmo-pd101/src/lib/synth/bindings/synth.ts` | Add TypeScript binding type |
| 4 | `cosmo-pd101/src/features/synth/hooks/useSynthParamsToWorklet.ts` | Pass to worklet |
| 5 | `cosmo-pd101/src/lib/synth/czPresetConverter.ts` | Map from SysEx if applicable |
| 6 | `cosmo-pd101/src/components/panels/` | Add UI control |
| 7 | `cosmo-pd101/src/index.ts` | Export for use in plugin webview |

## Tracing a Feature Across Packages

To understand how a feature flows (e.g., a knob change):

1. **UI** → `packages/cosmo-pd101/src/components/controls/ControlKnob.tsx`
2. **State** → `packages/cosmo-pd101/src/features/synth/useSynthState.ts`
3. **Worklet bridge** → `packages/cosmo-pd101/src/features/synth/hooks/useSynthParamsToWorklet.ts`
4. **DSP** → `packages/cosmo-synth-engine/src/processor.rs` → `voice.rs`

## Validation Checklist (after cross-package changes)

```bash
bun run lint          # Biome lint
bun run build         # TypeScript check + Vite build (catches type errors)
bun run test:unit     # Unit tests
bun run test:browser  # Browser tests
```
