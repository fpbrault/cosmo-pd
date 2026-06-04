# Truce AUv3 Migration Plan

## Target Architecture

The AUv3 extension keeps the custom Swift `WKWebView` controller as its principal class while replacing the custom Swift/Cosmo DSP runtime with Truce's AU callback runtime.

```text
AU host
|- render, MIDI, automation, state
|  `- TruceAUAudioUnit -> truce-au callbacks -> CzPlugin
`- custom GUI
   `- AudioUnitViewController -> WKWebView
      `- custom_editor_request -> CzEditor::custom_request -> handle_ipc_invoke
```

This is a hard cutover. The active AUv3 target must not retain the old `CosmoPd101FfiEngine`, duplicated Swift RPC implementations, or mirrored Swift Package runtime.

## Migration Work

### Truce Fork

- Add opaque custom editor request/response callbacks to `truce-core`, `truce-shim-types`, and `truce-au`.
- Lazily create and retain the plugin editor per AU instance.
- Expose latency and tail callbacks.
- Fix the generated Swift runtime for current Xcode callback ABIs.
- Pin all patched Truce crates to one immutable fork commit through Cargo patches.

### AU Runtime

- Create and destroy one Truce Rust context per AU instance.
- Build buses and the AU parameter tree from Truce descriptors.
- Route audio, MIDI 1, MIDI 2, SysEx, transport, automation, and plugin MIDI output through Truce callbacks.
- Persist only `truce_state`, including document state.
- Resolve the app-group data directory before creating the Rust instance.
- Expose native factory presets through `getPresetLibrary` and apply them through `loadPresetData`.

### Custom Webview

- Keep `AudioUnitViewController` as `NSExtensionPrincipalClass`.
- Forward ordinary RPC envelopes unchanged through `custom_editor_request`.
- Keep only subscription lifecycle controls in Swift.
- Poll authoritative Rust parameter and MIDI-learn state while visible.
- Drain raw MIDI CC events from Rust and dispatch `__czOnMidiCc`.
- Poll voice states, modulation sources, and transport only while subscribed.
- Keep scope polling in the existing AUv3 web bridge.

### Cleanup

- Remove the mirrored Swift Package implementation and `Package.swift`.
- Remove obsolete Swift FFI, parameter, DSP-helper, and template UI sources.
- Stage only `libcosmo_pd101_plugin.a`/XCFramework and `au_shim_types.h`.
- Keep the general Rust FFI module only for remaining non-AUv3 helpers and tests.

## Validation

Run the mandatory repository sequence:

1. `bun run lint`
2. `bun run build`
3. `bun run test`

Then validate:

- Plugin Rust tests and AUv3 bridge contract tests.
- Signed macOS containing app build/install and `auval`.
- iOS XCFramework and signed connected-iPad build/install.
- Custom webview rather than Truce's minimal GUI.
- Audio, host MIDI, MIDI CC mappings, automation, state restoration, factory presets, scope, modulation, voice state, and transport.
- Multiple instances and app-group preset/global-setting sharing.
