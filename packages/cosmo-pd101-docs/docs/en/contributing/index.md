---
title: Building from Source
description: Build the Cosmo PD-101 synth engine, web app, and plugin from source.
---

# Building from Source

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Rust** | nightly | Rust/WASM synth engine (`cosmo-synth-engine`) |
| **Bun** | latest | JS toolchain, workspace management, build scripts |
| **wasm-pack** | latest | Compile Rust to WebAssembly |

## Clone

```bash
git clone https://github.com/fpbrault/cosmo-pd.git
cd cosmo-pd
```

## Install Dependencies

```bash
bun install
```

## Build the Synth Engine (Rust/WASM)

```bash
bun run build
```

This runs `wasm-pack` to compile the Rust engine (`packages/cosmo-synth-engine`) into WebAssembly, then Vite builds the web app.

## Dev Server

```bash
bun run dev
```

Starts the Vite dev server for local development.

## Build the DAW Plugins

The plugin build uses a separate process via the `xtask` package:

```bash
bun run --filter=xtask build-plugin
```

This compiles the nih-plug host (`packages/cosmo-pd101-plugin`) and packages the webview into VST3, CLAP, and AUv2 formats.

## Project Structure

| Package | Description |
|---------|-------------|
| `packages/cosmo-synth-engine` | Rust/WASM phase distortion audio engine |
| `packages/cosmo-pd101` | Shared synth UI library (React components, hooks) |
| `packages/cosmo-pd101-plugin` | nih-plug VST3/CLAP/AUv2 host with webview |
| `packages/cosmo-pd101-docs` | This documentation site |
| `packages/xtask` | Build tooling |

## Troubleshooting

- **wasm-pack not found**: Install via `cargo install wasm-pack`
- **Rust nightly not installed**: Run `rustup toolchain install nightly`
- **Plugin build fails**: Ensure you have the platform-specific dependencies (see [nih-plug docs](https://github.com/robbert-vdh/nih-plug))

Next: [Quick Start](/getting-started/)
