# truce-vst3

VST3 format wrapper for the truce audio plugin framework.

## Overview

Bridges a truce `PluginExport` implementation to the VST3 plugin API. Uses a
C++ shim that implements the real VST3 COM interfaces with correct vtable
layout, ensuring binary compatibility with all VST3 hosts. All plugin logic is
delegated to Rust via C FFI callbacks.

User plugins typically take a direct optional dep on this crate
(`truce-vst3 = { workspace = true, optional = true }`) gated behind a
`vst3` Cargo feature; `cargo truce build --vst3` / `install --vst3` /
`package --formats vst3` selects it at the CLI.

## What it handles

- COM class factory and module entry point
- `IEditController` -- parameter editing and GUI
- `IAudioProcessor` -- audio processing callbacks
- `IPlugView` -- platform-native editor window embedding
- State persistence via `IBStream`
- Bus arrangement and channel layout negotiation

## Architecture

The C++ shim (compiled via `cc`) owns the COM objects and forwards every call
to Rust through a C FFI boundary. This avoids reimplementing COM vtables in
Rust while keeping all plugin logic in safe Rust code.

Part of [truce](https://github.com/truce-audio/truce). [Docs](https://truce.audio/docs/).
