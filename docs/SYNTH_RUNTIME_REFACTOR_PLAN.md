# Synth Runtime Refactor Plan

## Summary

Refactor the synth stack to three layers:

1. `Synth UI`
2. `Synth Runtime`
3. `Platform Backend`

The goal is to remove MIDI, note transport, engine transport, and bridge ownership from shared React code and centralize runtime behavior behind one sturdy shared runtime seam.

This is intended to be implemented in one go, but the design still preserves clear subsystem boundaries so the work can be validated incrementally during execution.

## Target Architecture

### 1. Synth UI

`@cosmo/cosmo-pd101` becomes a pure UI package.

It is responsible for:

- rendering synth state
- rendering learn state and binding UI
- rendering keyboard and preset UI
- emitting user intent such as parameter gestures, learn actions, and UI note gestures

It is not responsible for:

- browser MIDI APIs
- custom MIDI window events
- host/plugin runtime detection
- note transport execution
- CC binding lookup
- mapped MIDI application
- direct worklet or plugin bridge transport

### 2. Synth Runtime

Introduce one shared non-UI runtime layer that owns:

- normalized input events
- note/control semantics
- MIDI learn capture semantics
- binding schema and lookup
- target metadata and value scaling
- runtime state aggregation for the UI
- command routing to the active backend

The runtime is the only thing the UI talks to for runtime behavior.

### 3. Platform Backend

Introduce thin backend implementations under the runtime:

- `Web backend`
- `Plugin backend`

The backend owns transport and platform integration only.

Web backend responsibilities:

- `requestMIDIAccess`
- device subscription and reconnect handling
- worklet/audio transport
- browser-specific lifecycle

Plugin backend responsibilities:

- bridge connection setup
- editor-state and mapping sync transport
- param/state exchange with Rust
- plugin-specific lifecycle

Rust remains the execution authority for plugin-side MIDI and host behavior.

## Design Rule

Keep policy in `SynthRuntime`, keep transport in `PlatformBackend`.

That means:

- learn semantics live once
- binding lookup rules live once
- target scaling rules live once
- browser APIs live only in the web backend
- plugin bridge APIs live only in the plugin backend
- shared UI only sees runtime state and runtime actions

For plugin mode specifically:

- Rust is authoritative for host MIDI execution
- the runtime owns the contract and state flow
- React must not re-implement plugin MIDI behavior

## Public Interface Changes

### Shared UI package

Replace runtime-heavy hooks with runtime-facing contracts.

The shared UI should consume a runtime surface conceptually shaped like:

- `connect()`
- `dispose()`
- `subscribeState(listener)`
- `sendUiIntent(intent)`
- `beginLearn(targetKey)`
- `clearBinding(targetKey)`

The shared UI package should no longer expose or rely on hooks that imply direct MIDI or transport ownership, especially:

- `useMidiLearnBindings`
- browser-MIDI note handling in `useNoteHandling`
- custom `cz-midi-cc` execution paths

### Runtime contracts

Add shared runtime-neutral types for:

- normalized input events
- runtime commands
- runtime state updates
- binding records
- target metadata
- capability flags

### Backend contracts

Backends should implement a narrow transport interface used by the runtime, with responsibilities such as:

- connect/disconnect
- send engine commands
- emit normalized input events
- emit authoritative state updates
- persist or retrieve runtime-owned bridge state where needed

## Implementation Changes

### Shared runtime extraction

Create a new runtime module that centralizes:

- note on/off
- sustain
- pitch bend
- mod wheel
- aftertouch
- poly aftertouch
- macro input
- MIDI learn capture
- CC binding resolution
- parameter target scaling
- edge-trigger/toggle behavior

This module should be independent of React rendering concerns.

### Shared UI refactor

Refactor `SynthRenderer` and related shared UI so they no longer mount or execute runtime hooks directly.

Move shared ownership out of:

- `useMidiLearnBindings`
- `useNoteHandling`
- direct browser MIDI access
- custom window MIDI event listeners
- direct plugin runtime detection

The UI should receive runtime state and callbacks through a provider or injected runtime object.

### Web backend refactor

Move browser-side runtime behavior into a web backend that:

- opens Web MIDI
- normalizes browser MIDI into runtime input events
- connects runtime output to the worklet engine path
- handles device reconnect and missing-device behavior

The web backend should be the only place that touches browser MIDI APIs.

### Plugin backend refactor

Move plugin-side JS integration into a plugin backend that:

- installs the native bridge
- synchronizes editor state and MIDI mappings
- transports runtime commands to Rust
- receives authoritative state and param updates from Rust

The plugin backend should not execute mapped MIDI behavior in React.

### Rust/plugin refactor

Keep Rust as the canonical plugin execution engine for:

- host MIDI ingress
- learn capture semantics if learn is host-driven
- binding application
- parameter updates
- authoritative state publication back to the webview

Any shared runtime spec must conform to Rust semantics for the plugin path.

### Legacy path removal

Delete legacy paths once the new runtime is wired:

- `cz-midi-cc` as a shared execution contract
- shared React-owned mapped MIDI execution
- shared React-owned browser MIDI note ingestion
- direct transport logic embedded in shared UI hooks

## One-Go Execution Strategy

Even though this will be implemented in one go, the work should proceed in this order inside the same change:

1. introduce runtime types and backend contracts
2. wire web backend and plugin backend behind those contracts
3. move shared note handling into the runtime
4. move shared MIDI learn and mapped CC behavior into the runtime/backend split
5. refactor shared UI to consume runtime only
6. delete legacy hooks and custom-event execution paths
7. tighten plugin backend so Rust remains authoritative for plugin execution

This ordering reduces the chance of breaking both web and plugin at the same time without a stable seam.

## Test Plan

### Runtime tests

Add shared tests for:

- channel matching
- binding resolution
- target scaling and clamping
- edge-trigger behavior
- toggle behavior
- unsupported target handling
- note/control command generation

### Web backend tests

Add tests for:

- browser MIDI normalization
- worklet transport integration
- reconnect behavior
- no-device behavior
- web note and CC application through the runtime

### Plugin backend tests

Add tests for:

- bridge setup
- initial mapping sync
- initial editor-state sync
- subsequent binding updates
- param/state exchange with Rust
- absence of JS-side mapped MIDI execution

### Rust/plugin tests

Keep or extend tests for:

- host note ingress
- host CC ingress
- binding lookup
- mapped CC application
- state updates emitted back to the UI

### Shared UI tests

Update tests so the UI is validated with an injected runtime and does not depend on:

- `navigator.requestMIDIAccess`
- custom MIDI window events
- direct plugin runtime detection

### Acceptance scenarios

Web:

- learn a CC
- reload
- move the controller
- correct target changes

Plugin:

- learn a CC
- reload the plugin instance or session
- move the controller
- correct target changes

Cross-runtime:

- the same binding semantics produce the same effective behavior in web and plugin

## Validation

After implementation, run the required validation order from repo instructions:

1. `bun run lint`
2. `bun run build`
3. `bun run test`

If plugin webview user flows or bridge behavior change materially, also run:

- `cd packages/cosmo-pd101-plugin/webview && bun run test:e2e`

## Assumptions

- Fewer layers are preferable as long as the UI remains runtime-agnostic.
- `SynthRuntime` replaces a separate MIDI layer and a separate engine orchestration layer.
- Web and plugin share one runtime contract, but not identical transport implementations.
- Plugin Rust remains the authority for plugin-side execution semantics.
- Session/editor-state sync belongs in the plugin backend because it is host integration state, not shared UI behavior.
