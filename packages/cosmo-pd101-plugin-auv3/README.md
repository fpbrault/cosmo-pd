# Cosmo PD-101 AUv3

AUv3 app/extension workspace for the Rust `cosmo-pd101-plugin` DSP FFI.

The canonical AUv3 build targets are in the Xcode project at
`CosmoPD101Host/CosmoPD101Host.xcodeproj`.

CLI commands stage shared assets and invoke Xcode so Bun and Xcode build the same app/extension outputs.

## Build Assets

From the repository root:

```sh
bun run build:plugin:auv3
```

This builds the shared webview, copies the UI bundle into Swift resources, and stages the macOS Rust library/header in `Artifacts/`.

To create a local AUv3 containing app bundle:

```sh
bun run bundle:plugin:auv3
```

This command uses `xcodebuild` against `CosmoPD101Host.xcodeproj` and writes the staged app to `packages/cosmo-pd101-plugin-auv3/Build/Cosmo PD-101.app`.

To install and register the AUv3 for local testing:

```sh
bun run install:plugin:auv3
```

This installs a containing app at `~/Applications/Cosmo PD-101.app` and registers the embedded `.appex` with `pluginkit`.

The AUv3 uses subtype `Cpd3` so it can coexist with the existing AUv2 component, which uses subtype `Copd`.

The AUv3 bridge throttles analyzer/scope polling to keep host UI threads responsive while testing in DAWs.

Then validate the registered Audio Unit:

```sh
auval -v aumu Cpd3 PurA
```

## iPad / iOS Simulator Assets

Build the shared webview plus Rust static libraries for iPad device and Apple Silicon iOS Simulator, then package them as an XCFramework:

```sh
bun run build:plugin:auv3:ios
```

This stages:

- `CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/UI` — bundled React plugin UI consumed by the extension target.
- `Artifacts/libcosmo_pd101_plugin.a` and `Artifacts/au_shim_types.h` for the macOS containing app flow.
- `Artifacts/CosmoPd101Plugin.xcframework` — Rust DSP FFI library for `aarch64-apple-ios` and `aarch64-apple-ios-sim`.
- `Artifacts/au_shim_types.h` — Truce AU callback ABI header used by the Swift runtime.

To run on iPad or iPad Simulator from Xcode, open `CosmoPD101Host.xcodeproj`, ensure the extension target links `Artifacts/CosmoPd101Plugin.xcframework`, then build/run the containing app and extension schemes.

## Xcode Target Wiring

The extension target should:

- Use the Xcode target plist and source tree under `CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension`.
- Link `Artifacts/libcosmo_pd101_plugin.a` for macOS or `Artifacts/CosmoPd101Plugin.xcframework` for iOS/iPadOS.
- Add `Artifacts/` to header search paths for `au_shim_types.h`.
- Copy `CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/UI` into the extension bundle resources.
