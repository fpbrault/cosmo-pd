# Cosmo PD-101 AUv3

Custom Swift AUv3 host for the Rust `cosmo-pd101-plugin` DSP FFI.

This package contains the native AUv3 implementation pieces:

- `CosmoPd101AudioUnit`: `AUAudioUnit` subclass that owns the Rust FFI engine, AU parameter tree, MIDI event handling, render block, and scope data access.
- `CosmoPd101ViewController`: `AUAudioUnitViewController` with `WKWebView` and a `cosmoPd101` script message bridge for the shared React UI.
- `CosmoPd101Ffi`: Swift declarations for the exported Rust C ABI.
- `Resources/Info-Extension.plist`: AUv3 component metadata using type `aumu`, subtype `Cpd3`, and manufacturer `PurA`.
- `Artifacts/`: generated native static library and C header copied by the build script.

## Build Assets

From the repository root:

```sh
bun run build:plugin:auv3
```

This builds the shared webview, builds the Rust `staticlib`, copies the UI bundle into Swift resources, and stages the Rust library/header in `Artifacts/`.

To create a local AUv3 containing app bundle:

```sh
bun run bundle:plugin:auv3
```

The app is written to `packages/cosmo-pd101-plugin-auv3/Build/Cosmo PD-101.app`.

To install and register the AUv3 for local testing:

```sh
bun run install:plugin:auv3
```

This installs a containing app at `~/Applications/Cosmo PD-101.app`. Launching that app opens the shared webview synth UI in standalone UI mode. The AUv3 plugin UI opens inside an AUv3 host such as Logic Pro, GarageBand, MainStage, or another AUv3-compatible host.

The AUv3 uses subtype `Cpd3` so it can coexist with the existing AUv2 component, which uses subtype `Copd`.

The AUv3 bridge throttles analyzer/scope polling to keep host UI threads responsive while testing in DAWs.

Then validate the registered Audio Unit:

```sh
auval -v aumu Cpd3 PurA
```

For a Swift syntax build as part of the same step:

```sh
bun run build:plugin:auv3 -- --swift-build
```

For a specific Rust target:

```sh
bun run build:plugin:auv3 -- --target=aarch64-apple-darwin
```

## iPad / iOS Simulator Assets

Build the shared webview plus Rust static libraries for iPad device and Apple Silicon iOS Simulator, then package them as an XCFramework:

```sh
bun run build:plugin:auv3:ios
```

This stages:

- `Sources/CosmoPd101AUv3/Resources/ui` — the bundled React plugin UI for Xcode to copy into the extension resources.
- `Artifacts/CosmoPd101Plugin.xcframework` — the Rust DSP FFI library for `aarch64-apple-ios` and `aarch64-apple-ios-sim`.
- `Artifacts/cosmo_pd101_ffi.h` — the C ABI header for reference or bridge-header workflows.

To run on iPad or iPad Simulator from Xcode, create an iOS containing app target plus an Audio Unit Extension target. Add this package as a local Swift package or add the Swift files directly to the extension target, then link `Artifacts/CosmoPd101Plugin.xcframework` from the extension target. Run the containing app once to install the AUv3, then open it from an AUv3 host. Real iPads can use hosts such as GarageBand or AUM; the simulator needs a simulator-capable AUv3 host app.

## Xcode Target Wiring

Create an app target plus Audio Unit Extension target and add this package as local source. The extension target should:

- Use `Resources/Info-Extension.plist` as the extension info plist.
- Embed the Swift sources from `Sources/CosmoPd101AUv3`.
- Link `Artifacts/libcosmo_pd101_plugin.a` for macOS or `Artifacts/CosmoPd101Plugin.xcframework` for iOS/iPadOS.
- Add `Artifacts/` to header search paths for `cosmo_pd101_ffi.h` if a C bridge is preferred.
- Copy `Sources/CosmoPd101AUv3/Resources/ui` into the extension bundle resources.

The existing `nih-plug` VST3/CLAP path remains separate and unchanged.