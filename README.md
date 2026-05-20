# cosmo-pd

A monorepo for Casio CZ-101 phase distortion synthesis — including a preset manager web/desktop app, an in-browser phase distortion synthesizer, and a VST3/CLAP/AUv2 plugin.

## Overview

This is a **Bun monorepo** containing:

| Package | Description |
|---------|-------------|
| `packages/cosmo-synth-engine` | Rust WebAssembly phase distortion synth engine |
| `packages/cosmo-pd101` | Reusable library: synth-specific React components, hooks, preset utilities, and SysEx utilities consumed by the plugin webview |
| `packages/cosmo-pd101-plugin` | nih-plug-based VST3/CLAP/AUv2 plugin host with a thin React/Vite WebView shell |
| `packages/xtask` | Build automation (xtask pattern) |

## Setup

### Prerequisites

- [Bun](https://bun.sh/)
- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/) (auto-installed via `postinstall`)

### Installation

```bash
bun install
```

## Commands

### Development

```bash
# Use bun run dev for relevant packages
```

### Build

```bash
bun run build            # Full build: plugin + desktop
bun run build:plugin     # Build VST3/CLAP/AUv2 plugin (macOS, current arch)
```

### Testing

```bash
bun run test             # All tests across all packages (JS + Rust) — root-level
```

### Lint & Format

```bash
bun run lint             # Biome + cargo fmt/clippy check
bun run lint:fix         # Biome auto-fix + cargo fmt
```

## Architecture

### Synth Engine (`packages/cosmo-synth-engine`)

- Rust compiled to **WebAssembly** via wasm-pack.
- Phase distortion oscillators, CZ envelopes, polyphonic voice management.
- Bindings exported to TypeScript via Specta.

### Synth Library (`packages/cosmo-pd101`)

- Reusable React/TypeScript synth UI and domain library.
- `packages/cosmo-pd101/src/index.ts` exports synth-specific React components (`SynthRenderer`), hooks (`useAudioEngine`, `useSynthState`, etc.), SysEx decoder utilities, preset storage/conversion utilities, and shared types consumed by the plugin webview.

### Plugin (`packages/cosmo-pd101-plugin`)

- **nih-plug** framework: VST3 + CLAP + AUv2 from a single Rust codebase.
- Embeds the cosmo-synth-engine and a thin React/Vite WebView app via WebView IPC.
- The plugin `webview/` stays as a direct child of the Rust crate for plugin webview integration and imports reusable UI from `@cosmo/cosmo-pd101`.

### Database

- **Drizzle ORM** with **PostgreSQL** (Neon hosted or local).
- Browser fallback uses **IndexedDB**.

## Development Tools

- **Bun**: Package manager and script runner.
- **Biome**: Linter and formatter (tabs, double quotes).
- **Vitest**: Unit and browser tests.
- **Playwright**: Browser test runner.

## Testing

Two Vitest projects: `unit` (Happy DOM) and `browser` (Playwright/Chromium).

- Unit test files: `*.{test,spec}.{ts,tsx}` (excluding `.browser.test.`)
- Browser test files: `*.browser.test.{ts,tsx}`

For detailed testing patterns, see [docs/component-testing.md](docs/component-testing.md).

## Licensing

Cosmo PD-101 is **dual-licensed**:

| Channel | License | Applies To |
|---------|---------|------------|
| GitHub (source) | **GPL-3.0-only** — see [`LICENSE`](LICENSE) | Source code, forks, and self-compiled builds |
| Gumroad (binaries) | **Commercial EULA** — see [`LICENSE-COMMERCIAL`](LICENSE-COMMERCIAL) | Pre-compiled signed installers |

**Source code** on GitHub is free to view, fork, and compile via `cargo build`.
**Pre-compiled binaries** sold on Gumroad are distributed under a standard
commercial end-user license agreement that prohibits re-distribution of the
installer files.

Third-party dependency licenses are documented in
[`THIRD_PARTY_LICENSES`](THIRD_PARTY_LICENSES).

## SysEx Reference

CZ-101 patch format documentation: [docs/CZ101_SYSEX_FORMAT.md](docs/CZ101_SYSEX_FORMAT.md).
