# Cosmo PD-101 Data Flow Architecture

> **Companion to**: `PREDESIGN.md` (implementation plan)
> **Status**: Design document — reflects *target* architecture after preset ownership overhaul (PREDESIGN v3)
> **Scope**: All data crossing the Rust↔JS boundary (plugin IPC bridge + web WASM)

---

## Table of Contents

1. [Core Principle: Control State vs. DSP State](#1-core-principle)
2. [Architecture Overview](#2-architecture-overview)
3. [Data Flow Category Reference](#3-data-flow-category-reference)
    - [3.1 Control State: Param Target Values](#31-control-state-param-target-values)
    - [3.2 Control State: Preset Metadata](#32-control-state-preset-metadata-library)
    - [3.3 Control State: Preset Payload](#33-control-state-preset-payload-full-load)
    - [3.4 Control State: Host Context](#34-control-state-host-context)
    - [3.5 DSP State (Never Crosses Bridge)](#35-dsp-state-never-crosses-bridge)
    - [3.6 Visualizer Data (Grey Area)](#36-visualizer-data-grey-area--pull-based)
    - [3.7 Visualizer: Envelope Voice Markers](#37-visualizer-envelope-voice-markers)
    - [3.8 Visualizer: Modulated Value Indicators](#38-visualizer-modulated-value-indicators)
4. [Flow Diagrams](#4-flow-diagrams)
    - [4.1 Init / Hydration Sequence](#41-init--hydration-sequence)
    - [4.2 User Edits a Knob](#42-user-edits-a-knob)
    - [4.3 User Loads a Preset](#43-user-loads-a-preset-plugin-mode)
    - [4.4 User Saves a Preset](#44-user-saves-a-preset-plugin-mode)
    - [4.5 DAW Restores State](#45-daw-restores-state)
    - [4.6 DAW Program Change](#46-daw-program-change)
    - [4.7 Scope Polling (Visualizer)](#47-scope-polling-visualizer)
    - [4.8 DAW Param Automation](#48-daw-param-automation)
5. [IPC Method Reference](#5-ipc-method-reference)
6. [Payload Size Analysis](#6-payload-size-analysis)
7. [Performance & Reliability](#7-performance--reliability-analysis)
8. [Instance Isolation](#8-instance-isolation)
9. [Undo/Redo](#9-undoredo)
10. [Web vs Plugin Divergence](#10-web-vs-plugin-divergence-matrix)
11. [Testing Coverage](#11-testing-coverage)
12. [Web Mode (WASM) Divergence](#12-web-mode-wasm-divergence)

---

## 1. Core Principle

> **Push Control State (JSON, on change). Never push DSP State. Pull Visualizer Data (binary, on demand).**

| Category | What | How | Frequency | Direction |
|----------|------|-----|-----------|-----------|
| **Control State** | Param target values, preset metadata, macro labels, host context | JSON `evaluate_script` | On change only (not per-frame) | Bidirectional |
| **DSP State** | Audio-rate smoothing, per-voice states, envelope outputs, phase accumulators, delay line contents | **Never crosses bridge** | — | — |
| **Visualizer Data** | Scope samples, voice count, LFO indicators | Pull-based binary buffer `↶` | ~30fps on demand | Rust → JS (pull) |
| **Preset Data (plugin)** | Full preset JSON payloads | JSON `evaluate_script` (as response, not push) | On preset load only | Bundled `.json` → Rust → JS params push |
| **Preset Metadata (plugin)** | Library listing (id, name, tags, author, starred) | JSON `evaluate_script` | On library open + on change | Rust → JS (response to pull) |
| **Preset Data (web)** | Full frontend preset objects | Direct JS import | At app init + on load | JS memory → WASM via `setParams(json)` |
| **Host Context** | Tempo, transport, time sig | JSON `evaluate_script` | ~10fps (transport polling) | Rust → JS |

### Why This Matters

The wry IPC bridge (`evaluate_script`) injects JavaScript into the WKWebView synchronously. Sending a large JSON blob for every scope frame (4096 floats × 30fps = 122,880 floats/sec ≈ 500KB/s just in scope data) causes:

- **Bridge saturation**: `evaluate_script` blocks the Rust IPC handler until JS finishes parsing
- **GC pressure**: JS allocates and frees large arrays every 33ms
- **Frame drops**: The ~30fps scope poll already has an in-flight guard to prevent concurrent requests

The solution: **scope data is pulled via binary fetch** through wry's custom protocol (`fetch("/__scope__")` directly to Rust), bypassing JSON entirely. The binary response packs sample_rate + hz + 4096 f32 samples as raw LE bytes (~16 KB per frame, zero-copy on the JS side). The key design rule is that scope data must always be *pulled*, never pushed.

---

## 2. Architecture Overview

### 2.1 Plugin Mode (truce.audio)

```
┌─────────────────────────────────────────────────────────────┐
│                        DAW Host                             │
│  Program Change, save_state/load_state, automation, tempo   │
└──────────────┬──────────────────────────────────┬───────────┘
               │ truce callbacks                  │ native params
               ▼                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                   Rust Plugin (lib.rs)                       │
│                                                              │
│  ┌────────────────────┐    ┌──────────────────────────────┐  │
│  │   CosmoProcessor    │    │   PresetLibrary (disk I/O)   │  │
│  │   (audio thread)    │    │                              │  │
│  │                     │    │  • reads/writes .preset      │  │
│  │  • SynthParams Arc  │    │    files on separate thread  │  │
│  │  • ScopeFrame buf   │    │  • caches metadata in RAM   │  │
│  │  • voice state      │    │  • factory_presets.json     │  │
│  └──────┬──────────────┘    │    (compiled into binary)    │  │
│         │                   └──────────────┬───────────────┘  │
│         │ set_params()                     │ load/save        │
│         ▼                                  ▼                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              IPC Dispatcher (gui.rs)                     │ │
│  │                                                          │ │
│  │  • handle_ipc_invoke() ← wry ipc_handler                 │ │
│  │  • evaluate_script() → JS eval in WKWebView              │ │
│  │  • push_params() → __czOnParams(json) on param change     │ │
│  │  • push_state_to_webview() → full state on init          │ │
│  └──────────────────────────┬───────────────────────────────┘ │
└─────────────────────────────┼─────────────────────────────────┘
                              │ evaluate_script (JSON)
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  WebView (React/TS)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    IPCBridge.ts                         │  │
│  │                                                         │  │
│  │  • invokeRust(method, args) → Promise                    │  │
│  │  • installScopePolling() → rAF @30fps → binary fetch or JSON RPC    │  │
│  │  • window.__czOnParams → preset load handler              │  │
│  │  • window.__czOnScope → scope frame handler              │  │
│  │  • window.__czOnPresetLibrary → metadata cache           │  │
│  │  • window.__czGetParamAutomation → FloatParam targets     │  │
│  │  • window.__czGetRuntimeModSources → mod viz              │  │
│  └──────────────────┬─────────────────────────────────────┘  │
│                     │                                         │
│                     ▼                                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 Zustand Store                          │  │
│  │                                                         │  │
│  │  • synthStore: flat param state (60+ fields)            │  │
│  │  • UI actively reads from here                          │  │
│  │  • Outbound adapter syncing is                         │  │
│  │    DISABLED in pure-View architecture                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │       Pure View Layer (preset-blind)                   │  │
│  │                                                         │  │
│  │  • Never holds full preset data                         │  │
│  │  • Gets params only via __czOnParams                    │  │
│  │  • Library = metadata-only from                         │  │
│  │    __czOnPresetLibrary                                  │  │
│  │  • Load = sends ID, gets params back                    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Web Mode (WASM in browser)

```
┌──────────────────────────────────────────────────────────────┐
│                  Browser Main Thread                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    JS Code                             │  │
│  │                                                         │  │
│  │  • DEFAULT_SYNTH_PRESETS (Record<string, FrontendV1>)  │  │
│  │  • FACTORY_CZ_PRESETS (LibraryPreset[])                 │  │
│  │  • IndexedDB (user presets)                             │  │
│  │  • useSynthPresetManager orchestrates all three         │  │
│  │  • Creates SynthParams JSON, posts to AudioWorklet      │  │
│  └───────────────────────┬─────────────────────────────────┘  │
│                          │ postMessage({type:"setParams",...}) │
│                          ▼                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               AudioWorklet (cosmoSynthWorklet.js)      │  │
│  │                                                         │  │
│  │  • _params = deep-merged state                          │  │
│  │  • Calls wasm.synthesizer.setParams(JSON.stringify(p))  │  │
│  │  • Calls getRuntimeScopeData() for scope frames          │  │
│  └───────────────────────┬─────────────────────────────────┘  │
│                          │ direct function call               │
│                          ▼                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               WASM (CzSynthProcessor)                   │  │
│  │                                                         │  │
│  │  • serde_json::from_str<SynthParams>                    │  │
│  │  • CosmoProcessor::set_params(p)                        │  │
│  │  • Audio processing in RingBuffer                       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Web mode cannot do file I/O** (WASM limitation). The JS layer owns library orchestration. This is an accepted divergence from the pure-View architecture.

### 2.3 Key: Shared Code Consumption

The shared `@cosmo/cosmo-pd101` library exports **both** engine hooks — consumers choose at composition time:

- **Web mode**: `useAudioEngine` + `useSynthParamsToWorklet` (worklet adapter)
- **Plugin mode**: `usePluginBridgeSynthEngine` (bridge adapter)

There is **no global `isPlugin` flag**. Mode detection occurs ad-hoc via `typeof window.__czSetParams === 'function'` in individual hooks. This is fragile — a formal mode property (`window.__czHostPlatform`) is partially used for iOS detection but not formalized.

---

## 3. Data Flow Category Reference

### 3.1 Control State: Param Target Values

| Aspect | Detail |
|--------|--------|
| **Direction** | Bidirectional (Rust↔JS) |
| **Format** | `SynthParams` as JSON string |
| **Trigger** | User moves knob, DAW automation writes, preset loads |
| **Push or Pull?** | **Push** (Rust→JS via `__czOnParams` on EVERY `idle()` cycle — see §8.1; JS→Rust via `setParams` RPC) |
| **What it is** | The *target* value of each param — not intermediate smoothed values |
| **What it is NOT** | Audio-rate smoothing (1-pole filter running inside DSP), envelope outputs, phase accumulators |
| **Frequency cap** | On the Rust side: `push_params()` fires every `idle()` cycle (up to ~60fps on main thread) regardless of whether params changed. On change from JS: debounced to ~60fps by React render cycle (no explicit debounce). DAW FloatParams merged at audio block rate. |
| **Size** | ~2.5 KB JSON (full `SynthParams`) |
| **Key rule** | JS sets `macro1: 0.5` → DSP may smooth from 0 to 0.5 over 10ms. JS never sees the intermediate values. |

### 3.2 Control State: Preset Metadata (Library)

| Aspect | Detail |
|--------|--------|
| **Direction** | Rust → JS (response to pull) |
| **Format** | JSON array of `{id, name, tags, author, starred, source}` |
| **Trigger** | User opens preset browser |
| **Push or Pull?** | **Pull** — JS calls `getPresetLibrary` on demand |
| **What it includes** | All presets from factory + user library (metadata only). Factory IDs pre-computed. User IDs from UUID v4. |
| **What it EXCLUDES** | Full `SynthParams` — those are loaded lazily via `loadPresetData(id)` |
| **Frequency** | Once on browser open, refreshed after add/delete/rename |
| **Size target** | ~25 KB for ~200 presets (id + name + tags + source only) |

### 3.3 Control State: Preset Payload (Full Load)

| Aspect | Detail |
|--------|--------|
| **Direction** | Rust → JS (via `__czOnParams` after Rust applies internally) |
| **Format** | Full `SynthParams` JSON (~2.5 KB) |
| **Trigger** | User clicks preset in browser |
| **Push or Pull?** | **Push** (indirect — JS requests load, Rust loads and resolves internally, then pushes params) |
| **What happens** | `loadPresetData(id)` RPC → Rust deserializes `.preset` file → applies to engine → `__czOnParams(paramsJson)` fires. JS never holds the file data. |
| **Size** | ~2.5 KB (just the params, not the file. File may contain metadata Rust strips before forwarding) |

### 3.4 Control State: Host Context

| Aspect | Detail |
|--------|--------|
| **Direction** | Rust → JS (push) |
| **Format** | JSON `{bpm, isPlaying, timeSignature, timePosition}` |
| **Trigger** | Transport polling (~10fps) |
| **Push or Pull?** | **Push** — currently polled at 10fps via `getTransportInfo` RPC |
| **What it is** | DAW tempo, play/stop state, current position |
| **What it is NOT** | Per-block timing data, PPQ position at sample accuracy |

### 3.5 DSP State (Never Crosses Bridge)

| Data | Why Not Needed |
|------|----------------|
| Audio-rate smoothing values | UI only needs target (0.5). The 10ms 1-pole ramp is purely auditory |
| Per-voice envelope phases | 8-stage PD envelope shapes are drawn from Rate/Level params, not from realtime DSP output |
| Per-voice DCO phase accumulators | Oscilloscope shows the summed audio output, not individual oscillator phases |
| Per-voice filter state | Cascade filter coefficients change on param change, not per-sample |
| Delay line read/write heads | Feedback creates a time-offset copy of audio; UI has no reason to inspect delay buffers |
| LFO phase for mod sources | UI draws LFO waveform from config params; it does not need the realtime phase position (see grey area) |

### 3.6 Visualizer Data (Grey Area — Pull-based)

| Data | Current Strategy | Future Binary Strategy |
|------|-----------------|----------------------|
| **Scope waveform** | Pull via `getScopeData` RPC at ~30fps. Returns `{samples: number[], sampleRate, hz}` as JSON. 4096 floats → ~30 KB per frame (~900 KB/s) | Binary fetch via wry custom protocol (`/__scope__`). Returns raw f32 bytes as `ArrayBuffer`. ~16 KB per frame, zero-copy `Float32Array` view on JS side. Falls back to JSON RPC when fetch unavailable (AUv3). |
| **Runtime mod sources** | Pull via `getRuntimeModSources` RPC at ~60fps. Returns JSON of all mod source values. | Already JSON; size is small (<1 KB). Fine to keep as JSON. |
| **Voice count** | Not currently exposed. Could be added as a simple `{activeVoiceCount: number}` field in mod sources response or via `getTransportInfo`. | Tiny payload. Keep as JSON field. |
| **LFO/LFO2 visual indicators** | Not currently exposed. Could be part of mod sources data (LFO phase output is already a mod source). | Include in existing `getRuntimeModSources` JSON. |

**Rule**: Scope data uses a dedicated polling loop (rAF + 33ms throttle + in-flight guard). All other visualizer data piggybacks on existing RPC calls to avoid extra bridge round-trips.

### 3.7 Visualizer: Envelope Voice Markers

The envelope editors display vertical "voice markers" showing where each active voice is in its envelope (step position + release state). These are **not** driven by note-on/off events — they are computed from **polled voice state data**.

| Aspect | Detail |
|--------|--------|
| **Direction** | Rust → JS (push via CustomEvent) |
| **Data source** | `RuntimeVoiceDebugState` — per-voice snapshot: `{ active, step, value, releasing, line1/2 envelope state }` |
| **Trigger** | Worklet pushes `runtimeVoiceStates` on request; plugin polls via `getRuntimeVoiceStates` RPC |
| **Push or Pull?** | **Polled push** — JS requests at ~30-60fps, engine responds, dispatched as `cz-runtime-voice-states` CustomEvent |
| **UI path** | `window` CustomEvent → `SynthParamControllerProvider` stores in ref → `usePerLineWarp` reads via `getLiveVoiceStates()` at ~60fps tick → `activeVoiceMarkers` memo → `StepEnvelopeEditor` canvas draw |
| **Plugin RPC** | `getRuntimeVoiceStates` polled at ~60fps via IPCBridge/auv3Bridge `installRuntimeVoiceStatesPolling()` |
| **Web path** | AudioWorklet pushes at ~30fps via telemetry polling (`requestRuntimeTelemetry` interval in `useAudioEngine`) |
| **Size** | ~2 KB JSON for active voice states (depends on polyphony) |
| **Key insight** | Voice markers are **decoupled from MIDI note events**. Notes are pushed synchronously to engine; voice states are polled asynchronously. UI never receives "note-on at time X" — only current snapshot. |

### 3.8 Visualizer: Modulated Value Indicators

Knobs show a modulated value indicator (second dot on the arc trail) when the parameter has active modulation routes and the sources are producing non-zero output.

| Aspect | Detail |
|--------|--------|
| **Direction** | Rust → JS (push via CustomEvent) |
| **Data source** | `RuntimeModSources` — current output of LFO1/2, mod envelope, velocity, mod wheel, aftertouch, macros |
| **Trigger** | Same polling loop as scope (~60fps via `getRuntimeModSources` RPC) |
| **Push or Pull?** | **Polled push** — mod sources arrive via `cz-runtime-mod-sources` CustomEvent, stored in `SynthParamController.liveSourcesRef` |
| **UI path** | Each `ControlKnob` subscribes per-destination: checks `hasActiveRoutes(destination)`, listens for `cz-runtime-mod-sources`, bumps `modulationTick` → `getModulatedValue()` sums `route.amount × sourceValue` → `KnobView` renders indicator dot + arc trail |
| **Filter** | Knobs without active modulation routes do NOT subscribe — no unnecessary re-renders |
| **Performance concern** | Knobs with active modulation re-render on EVERY mod source update (~60fps). Could be optimized for complex patches with many active routes. |
| **Web path** | AudioWorklet pushes `runtimeModSources` via telemetry at ~30fps → same CustomEvent dispatch |
| **Plugin RPC** | `getRuntimeModSources` polled at ~60fps via IPCBridge/auv3Bridge `installRuntimeModSourcesPolling()` |

---

## 4. Flow Diagrams

### 4.1 Init / Hydration Sequence

```
Plugin Init (DawPlugin::new)
│
├── Create CosmoProcessor (audio thread)
├── Load factory_presets.json from compiled binary
├── Initialize PresetLibrary (scan disk for .preset files)
├── Set initial params = first factory preset's SynthParams
│
▼
WebView loads index.html
│
▼
PluginPage.tsx mount
│
├── usePluginParamBridge()
│   └── ensurePluginBridge() → polls bridge readiness
│       └── window.__czOnParams, __czGetParams, __czSetParams installed
│
├── useSynthPresetManager({...})  [unchanged interface, but stub-like in plugin]
│   └── bridge → Rust mode detected: most methods are no-ops
│       (preset browser reads metadata-only library)
│
├── Hydration via __czGetParams
│   ├── Retry loop: up to 10 attempts × 500ms, fallback at 10s
│   └── On success → __czOnParams(json) → React store applyPreset
│
├── __czGetPresetName()
│   └── Restore DAW-persisted preset name into UI
│
└── installScopePolling()
    └── rAF loop @30fps, pulls getScopeData
```

### 4.2 User Edits a Knob

```
Knob drag (React)
│
├── WRITE: Zustand store updates param value immediately
│   (UI feels instant — optimistic update)
│
├── READ: New param value enters render cycle
│   (Visual feedback from store, not from Rust)
│
├── DEBOUNCE (~16ms): Accumulate pending param changes
│
├── CALL: window.__czSetParams(JSON.stringify(synthParams))
│   └── IPCBridge → invokeRust("setParams", params)
│       └── Rust: serde_json::from_str<SynthParams>
│           └── CosmoProcessor::set_params(p)
│               └── Arc<SynthParams> swap (RT-safe)
│                   └── rebuild_compiled_params()
│                       └── update_fx()
│
└── Rust detects param change
    └── push_params() → window.__czOnParams(json)
        └── JS: normalize raw envelope values → store.set()
            (confirms param change reached engine)
```

### 4.3 User Loads a Preset (Plugin Mode)

```
User clicks "Bliss" in preset browser
│
├── JS: invokeRust("loadPresetData", { id: "preset_abc123" })
│
├── Rust PresetLibrary:
│   ├── Look up path: presets/preset_abc123.preset
│   ├── Deserialize JSON file
│   ├── Validate schema version
│   ├── Extract SynthParams from file
│   ├── Apply to CosmoProcessor::set_params(p)
│   └── Return { success: true, presetName: "Bliss" }
│
├── Rust push_params() → window.__czOnParams(json)
│   └── JS: applyPreset to Zustand store
│
├── JS: window.__czSetPresetName("Bliss")
│   └── Rust stores preset_name for DAW persistence
│
├── JS: UI highlights "Bliss" in browser
│
└── Rust: Internal loaded_preset_id updated
    (used by save_state and DAW restore)
```

**JS never holds the preset file.** The only data crossing the bridge is:
1. Outbound: `{ id: "preset_abc123" }` — ~40 bytes
2. Inbound: `__czOnParams(paramsJson)` — ~2.5 KB (same as any param change)

### 4.4 User Saves a Preset (Plugin Mode)

```
User clicks "Save As..." in preset browser
│
├── Modal asks for name + tags
│
├── JS: invokeRust("addPreset", { name: "My Sound", tags: ["bass"] })
│
├── Rust PresetLibrary:
│   ├── Generate UUID v4 as preset ID
│   ├── Snapshot current SynthParams from CosmoProcessor
│   ├── Wrap as PresetFile { id, name, tags, author:"user",
│   │     source:"user", starred:false, data: {schemaVersion:1, params} }
│   ├── Serialize to JSON
│   ├── Write to presets/<uuid>.preset (atomic write)
│   │   (note: re-read-before-write for multi-instance safety)
│   ├── Add to in-memory metadata cache
│   └── Return { success: true, id: "<uuid>", name: "My Sound" }
│
├── JS: window.__czSetPresetName("My Sound")
│
├── PresetLibrary sends updated metadata list
│   └── window.__czOnPresetLibrary(updatedLibraryJson)
│       └── JS: replace library cache in browser state
│
└── User sees "My Sound" in library without page reload
```

**Key**: No `SynthParams` crosses the bridge during save. Rust snapshots internally. The disk write (`presets/<uuid>.preset`) is the only file operation.

### 4.5 DAW Restores State

```
DAW loads project (or undo/redo)
│
├── truce callback: load_state(&data: &[u8])
│
├── Rust lib.rs: 
│   ├── Parse JSON: { "synth_params": {...}, "preset_name": "..." }
│   │
│   ├── Tier 1: Parse as new wrapper format
│   │   ├── Extract SynthParams
│   │   ├── Extract preset_name
│   │   ├── Apply to CosmoProcessor
│   │   ├── push_params() → webview hydrates
│   │   ├── push preset name → webview
│   │   └── Set loaded_preset_id = restored (if matches library)
│   │
│   ├── Tier 2: Parse as old flat SynthParams (backward compat)
│   │   ├── Apply directly
│   │   ├── push_params() → webview
│   │   └── Leave preset_name alone (or set empty)
│   │
│   └── Tier 3: Invalid → keep current state, log warning
│
└── WebView remains fully loaded (already running)
    └── Receives __czOnParams(json) as normal
```

### 4.6 DAW Program Change

```
DAW sends MIDI Program Change (e.g., PC #3)
│
├── truce callback: CzPlugin::on_program_change(program: u8)
│
├── Rust:
│   ├── Clamp to factory preset count (0..N-1)
│   ├── Get preset from compiled factory_presets
│   ├── Apply to CosmoProcessor
│   ├── push_params() → webview
│   ├── Set preset_name to factory preset name
│   └── Update loaded_preset_id
│
└── WebView: params updated via __czOnParams (same path as user load)
```

### 4.7 Scope Polling (Visualizer)

```
requestAnimationFrame tick (every 16.6ms, but throttled to 33ms)
│
├── Check: lastScheduled + 33ms < now?
│   └── No → skip frame (throttle)
│
├── Check: pollInFlight?
│   └── Yes → skip frame (concurrency guard)
│
├── pollInFlight = true
│
├── PRIMARY PATH (wry plugin): fetch("/__scope__")
│   ├── wry custom protocol routes to serve_scope_buffer()
│   ├── Rust: scope_buffer.try_lock()
│   │   ├── Success → to_linear() → binary: [rate: f32 LE][hz: f32 LE][samples: f32 LE × 4096]
│   │   └── Busy   → return empty 8-byte header
│   ├── Binary response arrives as ArrayBuffer
│   ├── Float32Array view created at offset 8 (zero-copy)
│   └── currentScopeHandler(samples: Float32Array, sampleRate, hz)
│
├── FALLBACK PATH (AUv3 / dev): invokeRust("getScopeData")
│   ├── Rust: scope_buffer.try_lock() → to_linear() → JSON {samples, sampleRate, hz}
│   ├── Response via __czIpcResponse → promise resolves
│   └── currentScopeHandler(samples: number[], sampleRate, hz)
│
├── window.__czOnScope(samples, sampleRate, hz)
│   ├── samples instanceof Float32Array → use directly (skip copy)
│   └── else → Float32Array.from(samples)
│
├── onFrame({ samples: Float32Array, sampleRate, hz })
│
├── pollInFlight = false
│
└── scheduleNextFrame() (requestAnimationFrame)
```

### 4.8 DAW Param Automation

```
DAW writes automation to FloatParam (25 DAW-automatable params)
│
├── EventBody::ParamChange arrives in process() audio block
│
├── Rust lib.rs merge logic (executed once per block):
│   ├── Check synth_params_version (atomic counter) for JS-side changes
│   ├── If JS changed: start from JS preset, overlay ALL DAW FloatParams
│   │   via apply_daw_params()
│   ├── If JS unchanged: start from previous RT params, overlay FloatParams
│   ├── For params with BOTH ParamChange event + FloatParam overlay:
│   │   revert to pre-change value (tracked_param_changes prevention)
│   └── proc.set_shared_params(merged) → engine applies once per block
│
├── On next idle() cycle: push_params() → __czOnParams(json)
│   └── NO batching on Rust side — fires unconditionally
│
└── JS: applyPreset to Zustand store

---
JS sends automation to DAW:
├── User moves knob → __czSetParams(json) → Rust
├── Rust: serde_json -> SynthParams
├── sync_all_daw_params_from_synth(&synth)
│   └── For each FloatParam: set_value(new_val)
└── DAW records automation lane
```

**Race condition**: When UI knob and DAW automation write the same param simultaneously:

1. UI `setParams` arrives → increments `synth_params_version` → calls `sync_all_daw_params_from_synth()` which copies UI values into DAW FloatParams
2. Next `process()` block: merge logic detects version change, starts from UI preset, overlays **all** DAW FloatParams — **DAW FloatParam value wins** for any param the DAW wrote since the sync
3. `EventBody::ParamChange` protection: if the DAW sends both a FloatParam write AND a ParamChange event for the same param in the same block, the **pre-change value** is preserved to prevent double-apply

There is **no explicit conflict resolution** (no timestamps, no "from_host" flag). The merge is **last-write-wins** with DAW FloatParams always having final say after sync. This is acceptable because `sync_all_daw_params_from_synth` on every UI write ensures the DAW params are never stale for long.

---

## 5. IPC Method Reference

### 5.1 Current + Proposed Methods (Plugin)

| Method | Direction | Payload | Frequency | Category | Notes |
|--------|-----------|---------|-----------|----------|-------|
| `setParams` | JS→Rust | Full `SynthParams` JSON (~2.5 KB) | On user edit (debounced ~16ms) | Control | Mutates engine state |
| `getParams` | JS→Rust (pull) | Returns `SynthParams` JSON | Once on init | Control | Hydration |
| `__czOnParams` | Rust→JS (push) | Full `SynthParams` JSON | On any param change | Control | eval_script callback |
| `setPresetName` | JS→Rust | `{ name: string }` | On preset load/save | Control | DAW state persistence |
| `getPresetName` | JS→Rust (pull) | `{ name: string }` | Once on init | Control | Hydration |
| `getPresetLibrary` | JS→Rust (pull) | Metadata array JSON (~25 KB) | On browser open, after add/delete | Control | **Metadata only** — no SynthParams |
| `loadPresetData` | JS→Rust | `{ id: string }` (~40 B) | On user preset click | Control | Triggers internal load + `__czOnParams` |
| `addPreset` | JS→Rust | `{ name, tags }` | On user "Save As" | Control | Rust snapshots internally |
| `deletePreset` | JS→Rust | `{ id: string }` | On user delete | Control | Removes file + metadata |
| `renamePreset` | JS→Rust | `{ id, newName }` | On user rename | Control | Updates metadata + file |
| `toggleStarred` | JS→Rust | `{ id, starred }` | On user star toggle | Control | Updates metadata + file |
| `getScopeData` | JS→Rust (pull) | Binary f32 via `/__scope__` custom protocol (~16 KB) or JSON RPC fallback (~30 KB) | ~30fps (rAF poll) | Visualizer | Primary: fetch → ArrayBuffer → zero-copy Float32Array. Fallback: invokeRust JSON (AUv3/dev). `binaryScopeSupported` auto-detects. |
| `getRuntimeModSources` | JS→Rust (pull) | Mod sources JSON (<1 KB) | ~60fps (scope poll) | Visualizer | Alongside scope data |
| `getTransportInfo` | JS→Rust (pull) | `{ bpm, isPlaying, timeSig, position }` | ~10fps | Control | DAW context |
| `getPerformanceMetrics` | JS→Rust (pull) | CPU/RT metrics | On demand | Debug | Benchmark API |
| `setPerformanceMonitorEnabled` | JS→Rust | `{ enabled: boolean }` | On toggle | Debug | |
| `noteOn` / `noteOff` | JS→Rust | Note + velocity | On MIDI input | Control | UI keyboard events |
| `macroValue` | JS→Rust | `{ index, value }` | On macro drag | Control | |
| `clientLog` | JS→Rust | `{ level, message }` | On error/console | Debug | |

### 5.2 Removed Methods (pure-View architecture)

| Method | Previously | Why Removed |
|--------|-----------|-------------|
| `importPreset` | JS→Rust (full JSON file) | Plugin doesn't need JSON import — presets are .preset files managed by Rust |
| `exportPreset` | JS→Rust→JS (full JSON) | Plugin doesn't need export; web mode uses IndexedDB |
| `getSessionState` | JS→Rust→JS (full state) | Replaced by `_getStateFromDisk` on DAW `load_state` |
| `setSessionState` | JS→Rust (full state) | Replaced by Rust-internal snapshot on `addPreset` |

### 5.3 AUv3 FFI Methods

The AUv3 path uses a separate FFI layer (`ffi.rs` + Swift). Each method is callable via `window.webkit.messageHandlers.cosmoPd101.postMessage(...)`.

| Method | Direction | Payload | Notes |
|--------|-----------|---------|-------|
| `getParams` | Swift→Rust→Swift | SynthParams JSON | Returns via FFI bridge |
| `setParams` | Swift→Rust | SynthParams JSON | Applied to engine |
| `getScopeData` | Swift→Rust (pull) | f32 array via `cosmo_pd101_ffi_copy_scope_f32` | Binary copy via pointer |
| `getRuntimeModSources` | Swift→Rust (pull) | JSON string via FFI | |
| `getTransportInfo` | Swift→Rust (pull) | JSON string via FFI | |
| Same preset methods | Swift→Rust | Same payloads | |

---

## 6. Payload Size Analysis

### 6.1 Param Data

| Item | Raw Size | JSON Size | Notes |
|------|----------|-----------|-------|
| Full `SynthParams` | ~1,200 bytes | ~2,500 bytes | 160+ fields including envelope steps and mod matrix (only 25 are DAW-automatable FloatParams) |
| `SynthParams` delta (single knob) | ~12 bytes | ~60 bytes | `{"macro1":0.75}` |
| Scope frame (4096 f32) | 16,384 bytes | ~16,392 bytes (binary) / ~30,000+ bytes (JSON fallback) | Binary: fetch via custom protocol. JSON: `number[]` for AUv3 fallback. Binary is ~46% smaller and avoids evaluate_script roundtrip. |
| Voice states (max poly) | ~500 bytes | ~2,000 bytes | Per-voice debug state; varies with active voice count |
| Runtime mod sources | ~200 bytes | ~1,000 bytes | LFO1/2, mod env, velocity, wheel, aftertouch, macros |
| Preset file on disk | — | ~3–4 KB | Metadata + SynthParams |
| Preset library metadata | — | ~25 KB for ~200 presets | id + name + tags + source only |
| State save blob | — | ~2.6 KB | `{synth_params, preset_name}` |

### 6.2 Bandwidth Budget

| Data Stream | Frequency | Per Frame | Per Second | Notes |
|------------|-----------|-----------|------------|-------|
| Param changes | ~10/sec avg | 2.5 KB | ~25 KB/s | Spike to ~150 KB/s on preset load |
| Scope polling | 30 fps | 16 KB (binary) / 30 KB (JSON fallback) | ~480 KB/s (binary) / ~900 KB/s (JSON) | Largest consumer. Binary fetch via custom protocol cuts bandwidth by ~46% and eliminates evaluate_script roundtrip. |
| Mod sources | 60 fps | 1 KB | ~60 KB/s | |
| Transport info | 10 fps | 0.3 KB | ~3 KB/s | |
| Preset library | Once + on change | 25 KB | ~0.02 KB/s avg | Negligible |
| Preset load (spike) | Rare | 2.5 KB | — | ~100ms round-trip |

**Total steady-state**: ~540 KB/s (binary scope) / ~1 MB/s (JSON fallback scope). Without scope: ~100 KB/s.

### 6.3 Optimization Priorities

1. **Scope data** is ~90% of bridge traffic. JSON serialization of 4096 floats is wasteful. Now served as binary via wry custom protocol (`/__scope__`) — ~16 KB/frame, zero-copy `Float32Array` on JS side. AUv3 path still uses JSON RPC fallback.
2. **Full SynthParams pushes** on every param change are wasteful for single-knob edits. Could use delta patches, but the current approach (always full params) is simpler and well under budget. ~2.5 KB at 10 edits/second is negligible.
3. **Library metadata** should never include SynthParams — this was the major v1→v2 insight.

---

## 7. Performance & Reliability Analysis

### 7.1 push_params() Fires Unconditionally

**Current behavior**: `CzEditor::push_params()` (gui.rs) is called on **every** `Editor::idle()` cycle — typically ~60fps on the main thread. It serializes the **entire** `SynthParams` struct (~2.5 KB JSON) and calls `evaluate_script()` to inject `window.__czOnParams(json)`.

There is **no check** for whether params actually changed — it pushes regardless. This means:

- Even when the synth is idle (no user input, no automation), the bridge is saturated with full JSON pushes at ~150 KB/s
- When params ARE changing (knob drag, automation), the cost is the same — already paying the worst case
- The `_ = wv.evaluate_script(&script)` pattern (gui.rs:259) **silently discards all errors** — no crash detection, no retry, no fallback

**Implication for target architecture**: The PREDESIGN pure-View architecture does not change this pattern. Rust will still call `push_params()` on every `idle()` cycle. Consider adding a dirty-flag check: only push if `synth_params_version` has changed since last push, or if a preset load occurred. This would eliminate ~95% of idle pushes.

### 7.2 No Priority System for IPC

All IPC messages travel through the **same channel** — `evaluate_script`:
- Scope polling (30fps), mod sources (60fps), transport (10fps), param sets, note events — all share the same `window.__czIpcResponse` callback
- There is **no priority queue, no channel isolation, no message scheduling**
- A slow `evaluate_script` response (large scope frame) can **delay** a critical param set or note event

**Mitigation**: The scope polling has an in-flight guard (`pollInFlight`, IPCBridge.ts) that prevents concurrent requests. But this is self-limiting, not prioritization. If the bridge is busy with a large scope response, note events from the UI keyboard may be delayed by up to ~30ms.

**Implication**: This is acceptable for the current architecture because:
- Note events are queued in `UiInputQueue` and processed on the audio thread — they don't depend on the IPC response
- Scope polling naturally throttles itself
- Param pushes are idempotent (next push overwrites last)

### 7.3 No Batching or Debouncing on Rust Side

- **No debounce**: `push_params()` fires on every `idle()` call with no timing buffer
- **No batching**: if 25 DAW FloatParams change in the same audio block, they are merged into a single `set_shared_params()` call — but the subsequent `push_params()` still sends the full JSON
- **Single merge per block**: The `process()` callback runs the merge logic (`params vs FloatParams` race resolution) at most once per audio block, regardless of how many individual FloatParam changes occurred

**Implication**: The only batching is natural — all param changes converge into the single `Arc<SynthParams>` swap and the single `push_params()` per idle cycle. This is fine for 25 DAW FloatParams. For the full 160+ field `SynthParams` sent via JS `setParams`, the entire payload is replaced atomically.

### 7.4 Dead Bridge / WebView Crash

**Current state**: **No crash detection or recovery exists.** All `evaluate_script` calls in gui.rs discard their result with `let _ = wv.evaluate_script(&script);`. If the webview:

- **Crashes**: `evaluate_script` returns an error → silently ignored
- **Is suspended** (DAW suspends plugin, window occluded): `evaluate_script` may succeed (JS runs when unfrozen) or fail silently
- **Has a slow response**: `evaluate_script` is synchronous — it blocks the main thread until JS completes

There is:
- **No `on_page_load` callback** in the wry builder — no ready signal from Rust side
- **No crash detection** — no way to know if the webview is alive
- **No webview re-creation** — if it dies, the UI is gone forever
- **No suspension state tracking** — no `suspended` flag, no `resume()` callback

**JS-side mitigation**: The hydration retry loop (10 attempts × 500ms + 10s safety timeout) covers the initial load race, but there is no recovery if the webview crashes after hydration.

### 7.5 Hydration Handshake

Three **concurrent** mechanisms ensure the webview reaches the correct state after init:

| Mechanism | Timing | What It Does |
|-----------|--------|-------------|
| **`__czGetParams` retry** | 10 attempts × 500ms | JS polls Rust for current params; opens outbound gate on success |
| **10-second safety timer** | Fires 10s after mount | Opens outbound gate regardless of hydration status — warning logged |
| **Rust auto-push** | On `try_create_webview()` + on first IPC call | `push_params()` fires immediately after webview creation AND re-pushes on the first IPC interaction from JS |

This is **resilient** — at least one of the three will ensure the UI is synced. The Rust auto-push on first IPC call (gui.rs:847-862) is a particularly robust pattern: as soon as the JS bridge sends its first RPC, Rust pushes current state back. This means the UI is never more than one IPC round-trip behind even if the initial push was lost.

**What's missing**: There is no "ready" acknowledgement from the UI back to Rust. The Rust side never knows if the webview has successfully applied state. Adding a `__czIpcReady` callback from JS would enable Rust to defer param changes until the UI confirms readiness.

### 7.6 Thread Safety Assessment

| Concern | Rating | Detail |
|---------|--------|--------|
| Audio thread lock safety | 🟢 **Excellent** | Lock-free `ArcSwap` for hot params; `try_lock` on scope buffer (NEVER blocks) |
| Main thread IPC safety | 🟢 **Good** | `Mutex::lock` on webview ref (brief, no contention) and preset_name (infrequent) |
| Deadlock risk | 🟢 **None** | No cross-mutex dependencies. Each mutex is held independently and briefly |
| Race condition: UI vs DAW | 🟡 **Adequate** | Last-write-wins with no explicit arbitration. `sync_all_daw_params_from_synth` on every UI write keeps DAW params aligned. Brief inconsistency possible under rapid concurrent writes. |
| Webview crash resilience | 🔴 **None** | All errors silently discarded. No recovery path. |

---

## 8. Instance Isolation

### 8.1 Per-Instance State

Each DAW plugin instance gets a **fresh `CzPlugin` struct** (`CzPlugin::new()` at lib.rs:929). All `Arc<>` fields are independently allocated:

| Field | Type | Isolated? |
|-------|------|-----------|
| `synth_params` | `Arc<ArcSwap<SynthParams>>` | ✅ Per-instance |
| `rt_synth_params` | `Arc<ArcSwap<SynthParams>>` | ✅ Per-instance |
| `scope_buffer` | `Arc<Mutex<ScopeFrame>>` | ✅ Per-instance |
| `ui_input_queue` | `Arc<ArrayQueue<UiInputEvent>>` | ✅ Per-instance |
| `midi_cc_queue` | `Arc<ArrayQueue<(u8,u8,u8)>>` | ✅ Per-instance |
| `preset_name` | `Arc<Mutex<String>>` | ✅ Per-instance |
| `synth_params_version` | `Arc<AtomicU64>` | ✅ Per-instance |
| `performance_counters` | `Arc<PerformanceCounters>` | ✅ Per-instance |

### 8.2 Globals (Shared Across Instances)

| Symbol | Type | Reason Shared | Safe? |
|--------|------|---------------|-------|
| `FACTORY_PRESETS` (ffi.rs) | `OnceLock<Vec<FactoryPresetEntry>>` | Read-only factory presets | ✅ **Safe** — no mutable access after init |
| `PANIC_HOOK_INIT` (lib.rs) | `std::sync::Once` | Process-level panic hook | ✅ **Safe** — runs once |
| `PLUGIN_LOG_PATH` (lib.rs:25) | `&str` const | All instances log to `/tmp/cosmo-plugin.log` | ✅ **Safe** — log lines prefixed with PID+timestamp |
| `EMBEDDED_WEBVIEW_DIST` (gui.rs) | `Dir<'static>` | Compiled-in web assets | ✅ **Safe** — read-only |
| `WEBVIEW_SCHEME_COUNTER` (gui.rs) | `AtomicU64` | **Intentionally shared** to generate unique scheme names per instance | ✅ **Safe** — atomic increment, generates unique scheme like `cz-PID-ID-TIMESTAMP` |
| `CLASS` (gui.rs) | `OnceLock<Class>` | Lazy-init objc class for standalone window | ✅ **Safe** — once, read-only after |

### 8.3 Instance Uniqueness

- **No explicit `instance_id`** field exists on `CzPlugin` — the truce framework manages per-instance dispatch internally
- **No instance-specific file paths** are created — the only file path is the shared log
- **WebView is per-instance** with a unique custom protocol scheme (`cz-PID-ID-TIMESTAMP` via `WEBVIEW_SCHEME_COUNTER`)
- **IPC channels are per-instance** (`scope_buffer`, `ui_input_queue`, etc. are cloned from `CzPlugin` to `CzEditor` during `editor()` construction)

### 8.4 Multi-Instance File Safety (Proposed)

For the proposed shared `PresetLibrary` file (PREDESIGN.md:250-259):

> "addPreset and deletePreset: re-read library from disk into temp struct, apply mutation to fresh data, write back. Do NOT rely on cached in-memory PresetLibrary for writes."

Atomic write strategy: write to temp file then rename (`rename()` is atomic on the same filesystem). This prevents partial writes even if two instances write simultaneously.

**Known limitation**: This handles file-level atomicity but does NOT prevent data loss from concurrent add+delete racing (instance A adds preset X, instance B deletes preset Y — both re-read the same base file, apply their mutation, write back; instance B's write overwrites instance A's add). This is a rare edge case acceptable for v1.

---

## 9. Undo/Redo

### 9.1 DAW-Managed Only

**The plugin does NOT maintain its own undo stack.** All undo/redo is handled by the DAW host via the standard truce `save_state`/`load_state` lifecycle:

1. DAW calls `save_state()` → returns `Vec<u8>` (JSON blob of `{ synth_params, preset_name }`)
2. DAW stores the blob in its undo history
3. User triggers Undo → DAW calls `load_state(previous_blob)` → plugin restores state
4. WebView receives updated params via `push_params()` on the next `idle()` cycle

### 9.2 No Internal Undo History

- **Zustand stores have zero undo/redo infrastructure** — no history middleware, no snapshots, no undo stacks
- **No `push_history` / `snapshot_for_undo` / `undo_stack`** exists in any TypeScript or Rust code
- **WebView does NOT reload** on `load_state()` — it stays alive and receives delta (full push) params
- **No undo for internal UI state** (knob focus, browser scroll position, open panels) — this state is lost on DAW undo/redo

### 9.3 Implications for Pure-View Architecture

With the pure-View architecture (Rust owns preset loading):
- `save_state()` would include `loaded_preset_id` instead of full `SynthParams`
- `load_state()` would call `PresetLibrary::load_by_id()` instead of deserializing embedded params
- The WebView would still receive params via `__czOnParams` — no change to the UI flow

---

## 10. Web vs Plugin Divergence Matrix

### 10.1 Complete Divergence

| Concern | Web / Standalone | Plugin (truce.audio) | Shared? |
|---------|------------------|---------------------|---------|
| **Engine communication** | AudioWorklet port messages | `window.__czSetParams` / `__czOnParams` | No |
| **Audio init** | `useAudioEngine`: AudioContext + WASM fetch + AudioWorkletNode | None (Rust host handles audio) | No |
| **Param sync hook** | `useSynthParamsToWorklet` (worklet adapter) | `usePluginBridgeSynthEngine` (bridge adapter) | No |
| **Note output** | `workletNode.port.postMessage` | `window.ipc.postMessage({id, method, args})` | No (but `useNoteHandling` accepts both via `eventSink`) |
| **Scope/oscilloscope** | `AnalyserNode` in AudioContext | RPC polling to Rust (`getScopeData`) | No |
| **Performance metrics** | Worklet `performanceMetrics` messages | `window.__czGetPerformanceMetrics` RPC | No |
| **PC keyboard notes** | Enabled | Disabled (host owns keyboard) | Conditional in `useNoteHandling` |
| **Preset session persist** | `localStorage` (save/loadCurrentState) | `window.__czSetPresetName` / `__czGetPresetName` | No |
| **Hydration on mount** | Load from localStorage | `__czGetParams()` with retry + 10s timeout | No |
| **beforeunload** | Save current state to localStorage | Not needed | No |
| **Error boundary** | None | `PluginErrorBoundary` + `postHostLog` | No |
| **Fullscreen** | requestFullscreen button | Not available (no browser chrome) | No |
| **Build integration** | Direct source imports | Built `lib-dist/` artifact | No — different consumption modes |
| **Audio gate** | Normal (wait for AudioContext) | `disableAudioGate` bypassed | No |
| **Aspect ratio** | `SYNTH_RENDERER_MAX_ASPECT_RATIO` | min (desktop) or none (iOS) | No |
| **Envelope normalization** | None (values in engine range) | Raw (0-127) → UI (0-99) conversion | Plugin only |
| **Adapter interface** | Formal `SynthEngineAdapter` | Standalone hook (does NOT implement adapter interface) | Divergent |

### 10.2 Adapter Path Divergence

The `pluginBridgeSynthEngineAdapter.ts` is **not** a `SynthEngineAdapter` implementation — it's a standalone React hook with different semantics:

| Aspect | Worklet Adapter | Plugin Bridge Adapter |
|--------|----------------|---------------------|
| Interface | `SynthEngineAdapter` (formal) | None (bare hook) |
| Sync direction | One-way: React → Worklet | Bidirectional: React ↔ Host |
| Dedup | JSON string comparison | JSON string comparison |
| Hydration | N/A (no prior state) | `getParams()` with retry + 10s fallback |
| Envelope normalization | None (engine-range values) | Raw (0-127) → UI (0-99) |
| Cleanup | Adapter dispose pattern | `useEffect` cleanup functions |

### 10.3 Mode Detection Fragility

There is **no global `isPlugin` flag**. Mode detection relies on:

```typescript
const pluginBridgeRuntime = window.__czSetParams;
const isPluginRuntime = typeof pluginBridgeRuntime === "function";
```

This is implicit and fragile — if the bridge API changes (e.g., `__czSetParams` is renamed or removed), the detection silently fails. The `window.__czHostPlatform` property partially used for iOS detection is a better pattern but not formalized for all mode detection.

---

## 11. Testing Coverage

### 11.1 Unit Tests

| Test File | Coverage | Status |
|-----------|----------|--------|
| `pluginBridgeSynthEngineAdapter.test.tsx` | 7 tests: hydration, envelope conversion, FX sanitization, disabled mode | ✅ Active |
| `pluginBridgeSynthEngineAdapter.browser.test.tsx` | FX smoke test — every FX control patch through bridge | ✅ Active |
| `workletSynthEngineAdapter.test.ts` | Adapter creation, sync dedup, null worklet guard | ✅ Active |
| `synthEngineAdapter.test.ts` | Controller lifecycle, connect/sync/dispose | ✅ Active |
| `useSynthPresetManager.test.tsx` | Entire suite `describe.skip` — **no active tests** | ❌ **Skipped** |

### 11.2 Plugin Webview Tests

| Category | Count | Description |
|----------|-------|-------------|
| Unit (`vitest --project unit`) | 1 file, 3 tests | PluginPage renders, calls `__czGetPresetName`, clamps keyboard height |
| Browser (`vitest --project browser`) | — | Browser-level component tests |
| E2E (Playwright) | 11 spec files | Preset loading/saving, UI↔Host sync, mod matrix, algo controls, visual shell, update notification |

All E2E tests use `VITE_TEST_HARNESS=1` and a mock bridge — they test the webview in isolation, not the actual Rust plugin.

### 11.3 Coverage Gaps

| Gap | Impact | Mitigation |
|-----|--------|-----------|
| **Preset manager: zero active tests** | All preset browser logic is untested | High priority for implementation — add before deleting factory presets source |
| **No E2E tests for web mode** | LivePage standalone mode has no automated tests | Manual testing only |
| **No cross-mode integration tests** | Shared library changes could break one mode without detection | Run both web and plugin test suites on every change |
| **No bridge crash/recovery tests** | Dead bridge path is entirely untested | Hard to test without real crash — at minimum, verify error handling logging |

---

The web mode cannot use the pure-View architecture (WASM has no file I/O, no disk access). The divergence is:

| Concern | Plugin Mode | Web Mode |
|---------|-------------|----------|
| **Preset storage** | `.preset` files on disk managed by Rust | IndexedDB managed by JS |
| **Preset loading** | Rust deserializes + applies internally | JS reads from IndexedDB → calls `setParams(json)` via worklet |
| **Preset saving** | Rust snapshots params internally, writes file | JS gathers state via `gatherState()`, writes to IndexedDB |
| **Library metadata** | Rust scans disk, returns metadata-only | JS reads IndexedDB + hardcoded presets, manages in memory |
| **Preset IDs** | Factory: pre-computed FNV-1a. User: UUID v4 in Rust | All via `createPresetId()` (FNV-1a) — unchanged |
| **Param bridge** | `__czOnParams` / `__czSetParams` via IPC | Worklet `postMessage` → WASM `setParams(json)` |
| **Scope data** | Binary fetch via wry custom protocol (`/__scope__`) from Rust ring buffer (falls back to `getScopeData` RPC for AUv3) | `AnalyserNode.getFloatTimeDomainData()` from Web Audio API |
| **Hydration** | `__czGetParams` retry loop | Direct WASM param query (not needed — JS has the data) |

### 12.1 Web Mode Data Flow for Preset Load

```
User clicks "Bliss"
│
├── useSynthPresetManager:
│   ├── Finds preset in DEFAULT_SYNTH_PRESETS (hardcoded JS object)
│   ├── store.applyPreset(preset.data) → Zustand set()
│   └── This triggers:
│       ├── React re-render (UI updates)
│       └── createSynthEngineSnapshot() → workletSynthEngineAdapter.sync()
│           └── workletNode.port.postMessage({ type: "setParams", params })
│               └── AudioWorklet _dispatch("setParams")
│                   └── synth.setParams(JSON.stringify(this._params))
│                       └── WASM CzSynthProcessor::set_params(json)
│
└── No Rust preset file involved — JS owns the entire flow
```

### 12.2 Web Mode Data Flow for Preset Save

```
User clicks "Save" → name: "My Sound"
│
├── useSynthPresetManager.handleSavePreset("My Sound")
│   ├── Gather current state via gatherState()
│   ├── Create StoredPreset object { id: createPresetId(), name, data, ... }
│   └── saveStoredPreset(storedPreset) → IndexedDB
│
└── All in JS — no Rust involvement for the save operation
```

### 12.3 When Web Mode Behaves the Same

These flows are identical to plugin mode (at the abstraction level), differing only in transport:
- User moving a knob → param value lands in engine
- Scope visualization → 30fps buffer polling (AnalyserNode instead of Rust ring buffer)
- Transport display → AudioContext state instead of DAW callbacks

### 12.4 Shared Code Paths

The `useSynthPresetManager` hook is shared but adapts via its options:
- Plugin mode: `gatherPresetState` reads from `__czGetParams`, `applyPreset` pushes via `__czSetParams`
- Web mode: `gatherPresetState` reads from Zustand store, `applyPreset` writes to Zustand store (which flows to worklet)

The hook detects which mode it's in via the bridge's presence.

---

## Appendix: Key Files

| File | Role in Data Flow |
|------|-------------------|
| `packages/cosmo-pd101-plugin/src/lib.rs` | Rust plugin: `CzPlugin`, `ScopeFrame`, `PresetLibrary`, IPC handlers |
| `packages/cosmo-pd101-plugin/src/ffi.rs` | AUv3 FFI: C exports for param/scope data |
| `packages/cosmo-pd101-plugin/src/gui.rs` | WebView setup, IPC dispatcher, `push_params()`, binary scope via `/__scope__` custom protocol route |
| `packages/cosmo-pd101-plugin/webview/src/lib/IPCBridge.ts` | JS bridge: `invokeRust()`, binary scope fetch via `/__scope__` with JSON fallback, bridge setup |
| `packages/cosmo-pd101-plugin/webview/src/hooks/usePluginParamBridge.ts` | Bridge readiness + `usePluginBridgeSynthEngine` |
| `packages/cosmo-pd101/src/features/synth/engine/pluginBridgeSynthEngineAdapter.ts` | Plugin adapter: maps bridge ↔ store |
| `packages/cosmo-pd101/src/features/synth/engine/workletSynthEngineAdapter.ts` | Web adapter: worklet postMessage |
| `packages/cosmo-pd101/src/features/synth/synthStore.ts` | Zustand store: all param state |
| `packages/cosmo-pd101/src/lib/synth/presetTypes.ts` | Type hierarchy: `FrontendPresetV1`, `StoredPreset`, etc. |
| `packages/cosmo-pd101/src/lib/synth/presetStorage.ts` | IndexedDB persistence (web mode only) |
| `packages/cosmo-synth-engine/src/wasm.rs` | WASM exports: `setParams(json)`, `getRuntimeModSources`, etc. |
| `packages/cosmo-pd101/site/src/LivePage.tsx` | Web app shell: init flow, IndexedDB restore |
| `packages/cosmo-pd101-plugin/webview/src/PluginPage.tsx` | Plugin app shell: bridge init, scope subscription |
