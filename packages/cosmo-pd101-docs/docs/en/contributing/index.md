---
title: Building from Source
description: Build the Cosmo PD-101 synth engine, web app, and plugin from source.
---

# Building from Source

## Prerequisites

- **Rust**
- **Bun**
- **wasm-pack**

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

## Build the plugins

```bash
bun run build:plugin
```

## Installing the plugins

```bash
bun run plugin:install
```

## Project Structure

| Package | Description |
|---------|-------------|
| `packages/cosmo-synth-engine` | Rust/WASM phase distortion audio engine |
| `packages/cosmo-pd101` | Shared synth UI library (React components, hooks) |
| `packages/cosmo-pd101-plugin` | VST3/CLAP/AUv2 plugins with webview |
| `packages/cosmo-pd101-docs` | This documentation site |
| `packages/xtask` | Build tooling |

## Troubleshooting

- **wasm-pack not found**: Install via `cargo install wasm-pack`
- **Rust nightly not installed**: Run `rustup toolchain install nightly`

Next: [Quick Start](/getting-started/)
