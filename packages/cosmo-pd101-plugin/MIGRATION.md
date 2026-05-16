# nih-plug → truce.audio Migration Plan

## Architecture

```
Before (current):                    After (target):
                                    ┌────────────────────┐
┌────────────────────┐              │  truce.audio       │
│  nih-plug          │              │  VST3 / CLAP       │
│  VST3 / CLAP       │              │  AUv3 (macOS)      │
│  (desktop only)    │              │  wry webview GUI   │
│  wry webview GUI   │              │                    │
│  CzPlugin struct   │              │  PluginLogic impl  │
│  Plugin trait      │              │  #[derive(Params)] │
│  (params via JSON) │              │  (typed params)    │
└──────┬─────────────┘              └──────┬─────────────┘
       │ C FFI (ffi.rs)                    │ C FFI (ffi.rs) — unchanged
       ▼                                   ▼
┌────────────────────┐              ┌────────────────────┐
│  Swift AUv3        │              │  Swift AUv3        │
│  (macOS + iPad)    │              │  (iPad only)       │
│                    │              │  WKWebView UI      │
│  WKWebView UI      │              │                    │
└────────────────────┘              └────────────────────┘
```

- **Desktop**: nih-plug replaced by truce (VST3, CLAP, AUv3 on macOS)
- **iPad**: Existing Swift XCFramework + WKWebView stays (truce has no iOS support)
- **Web/WASM**: Unchanged — uses cosmo-synth-engine directly via wasm-bindgen
- **DSP**: cosmo-synth-engine — completely unchanged across all paths
- **WebView GUI**: Extracted to standalone crate, embedded via `custom_editor()` + `RawWindowHandle`

---

## Phase 0 — Audit Complete ✅

### A. nih-plug surface in `lib.rs`

| Location | What | Notes |
|---|---|---|
| `lib.rs:20` | `use nih_plug::prelude::*` | Removes all re-exported types |
| `lib.rs:280-281` | `#[derive(Params, Default)] pub struct CzParams {}` | Empty placeholder — delete entirely |
| `lib.rs:477-511` | `CzPlugin` struct + `Default` | Replace with truce-style struct |
| `lib.rs:549-740` | `impl Plugin for CzPlugin` | Replace with `impl PluginLogic` |
| `lib.rs:742-753` | `impl ClapPlugin for CzPlugin` | Handled by `truce::plugin!` macro |
| `lib.rs:755-762` | `impl Vst3Plugin for CzPlugin` | Handled by `truce::plugin!` macro |
| `lib.rs:764` | `nih_export_clap!(CzPlugin)` | Replace with `truce::plugin!` |
| `lib.rs:765` | `nih_export_vst3!(CzPlugin)` | Replace with `truce::plugin!` |

**nih-plug types consumed in `process()`** (`lib.rs:620-739`):

| nih-plug type | Replace with truce |
|---|---|
| `Buffer` | `AudioBuffer` |
| `NoteEvent` | `EventBody` (Covers MIDI 1.0 + 2.0) |
| `ProcessContext` | `ProcessContext` |
| `ProcessStatus` | `ProcessStatus` |
| `AuxiliaryBuffers` | Not needed (truce passes buffer directly) |
| `AudioIOLayout` | `BusLayout` |
| `MidiConfig` | Inherent (host provides events) |
| `PortNames` | Not needed |
| `BufferConfig` | Not needed (sample rate from `reset()`) |
| `InitContext` | Not needed |
| `Params` trait | `#[derive(Params)]` |
| `AsyncExecutor` | Not needed |

### B. nih-plug surface in `gui.rs`

| Location | What | Notes |
|---|---|---|
| `gui.rs:32` | `use nih_plug::prelude::*` | Removes `Editor`, `ParentWindowHandle`, `GuiContext` |
| `gui.rs:136-342` | `impl Editor for CzEditor` | Replace with truce's `custom_editor()` + `Editor` trait |
| `gui.rs:256` | `ParentWindowHandle::AppKitNsView(ptr)` | Replace with truce's `RawWindowHandle` |
| `gui.rs:330-341` | `param_value_changed`, `param_modulation_changed`, `param_values_changed` | Not needed (truce params are atomic) |

**What stays**: WebView building, wry IPC, `serve_file`, `plugin_resource_dir()` — all of these are framework-agnostic utility code. Only the `Editor` trait impl changes.

### C. FFI Surface (`ffi.rs`) — 25 functions

**Already nih-plug independent.** Zero changes needed. Consumed by AUv3 Swift via C header.

| # | Function | Purpose |
|---|---|---|
| 1 | `cosmo_pd101_ffi_engine_create` | Creates DSP engine |
| 2 | `cosmo_pd101_ffi_engine_destroy` | Destroys DSP engine |
| 3 | `cosmo_pd101_ffi_reset_audio_state` | Audio state reset |
| 4 | `cosmo_pd101_ffi_set_params_json` | Set full SynthParams via JSON |
| 5 | `cosmo_pd101_ffi_get_params_json` | Get full SynthParams as JSON |
| 6-8 | `get_factory_preset_count/name/params_json` | Factory preset queries |
| 9 | `cosmo_pd101_ffi_get_runtime_voice_states_json` | Runtime voice state (debug) |
| 10 | `cosmo_pd101_ffi_get_runtime_mod_sources_json` | Runtime mod sources (debug) |
| 11-14 | `get_parameter_count/info/value/set_value` | 26 automatable params |
| 15-16 | `note_on/note_off` | MIDI note events |
| 17 | `all_notes_off` | Panic |
| 18-21 | `set_sustain/pitch_bend/mod_wheel/aftertouch` | Performance controls |
| 22-23 | `render_mono/render_stereo` | Audio rendering |
| 24-25 | `copy_scope_i8/f32` | Oscilloscope data |

### D. 26 Existing Automatable Params

Used by both FFI (AUv3 Swift) and future truce typed params:

| ID | Key | Min | Max | SynthParams Field |
|---|---|---|---|---|
| 1 | `volume` | 0.0 | 1.0 | `params.volume` |
| 2 | `warpAAmount` | 0.0 | 1.0 | `params.line1.dcw_base` |
| 3 | `warpBAmount` | 0.0 | 1.0 | `params.line2.dcw_base` |
| 4 | `algoBlendA` | 0.0 | 1.0 | `params.line1.algo_blend` |
| 5 | `algoBlendB` | 0.0 | 1.0 | `params.line2.algo_blend` |
| 6 | `line1Level` | 0.0 | 1.0 | `params.line1.dca_base` |
| 7 | `line2Level` | 0.0 | 1.0 | `params.line2.dca_base` |
| 8 | `line1Octave` | -2.0 | 2.0 | `params.line1.octave` |
| 9 | `line2Octave` | -2.0 | 2.0 | `params.line2.octave` |
| 10 | `line2DetuneNote` | -11.0 | 11.0 | `params.line2.detune_note` |
| 11 | `line2DetuneFine` | -60.0 | 60.0 | `params.line2.detune_fine` |
| 12 | `velocityCurve` | -1.0 | 1.0 | `params.velocity_curve` |
| 13 | `pitchBendRange` | 1.0 | 24.0 | `params.pitch_bend_range` |
| 14 | `portamentoRate` | 0.0 | 127.0 | `params.portamento.rate` |
| 15 | `portamentoTime` | 0.0 | 5.0 | `params.portamento.time` |
| 16 | `lfoRate` | 0.01 | 30.0 | `params.lfo.rate` |
| 17 | `lfoDepth` | 0.0 | 1.0 | `params.lfo.depth` |
| 18 | `lfoOffset` | -1.0 | 1.0 | `params.lfo.offset` |
| 19 | `lfo2Rate` | 0.01 | 30.0 | `params.lfo2.rate` |
| 20 | `lfo2Depth` | 0.0 | 1.0 | `params.lfo2.depth` |
| 21 | `lfo2Offset` | -1.0 | 1.0 | `params.lfo2.offset` |
| 22 | `randomRate` | 0.01 | 30.0 | `params.random.rate` |
| 23 | `modEnvAttack` | 0.0 | 10.0 | `params.mod_env.attack` |
| 24 | `modEnvDecay` | 0.0 | 10.0 | `params.mod_env.decay` |
| 25 | `modEnvSustain` | 0.0 | 1.0 | `params.mod_env.sustain` |
| 26 | `modEnvRelease` | 0.0 | 10.0 | `params.mod_env.release` |

### E. JSON State (non-automatable params)

The following SynthParams fields remain purely in JSON state, modelled as a `#[derive(State)]` struct:

- `line_select: LineSelect` (line1/line2/mix/ring — choice of oscillator routing)
- `mod_mode: ModMode` (ring mod mode)
- `ring_gain: f32`
- `poly_mode: PolyMode`
- `legato: bool`
- `line1.algo: u8`, `line2.algo: u8` (algorithm selection)
- `line1.shape: WaveformKind`, `line2.shape: WaveformKind`
- Line-specific envelope params (`line1.eg_*`, `line2.eg_*`: attack, decay, sustain, release, rate, level)
- `mod_matrix: ModMatrix` (complex vec-of-routes)
- `fx_slots: [FxSlotConfig; 6]` (complex enum per slot)
- Line-specific `dcw_env_amount`, `dcw_key_amount`, `dca_env_amount`, `dca_key_amount`, `pitch_env_amount`, `pitch_key_amount`
- LFO target, mode, waveform
- Random mode

### F. IPC Dispatch (`handle_ipc_invoke`)

| Method | Handler | Purpose |
|---|---|---|
| `noteOn` | Enqueue `UiInputEvent::NoteOn` | GUI keyboard/mouse note |
| `noteOff` | Enqueue `UiInputEvent::NoteOff` | GUI keyboard/mouse note |
| `sustain` | Enqueue `UiInputEvent::Sustain` | Sustain pedal from UI |
| `pitchBend` | Enqueue `UiInputEvent::PitchBend` | Pitch wheel from UI |
| `modWheel` | Enqueue `UiInputEvent::ModWheel` | Mod wheel from UI |
| `aftertouch` | Enqueue `UiInputEvent::Aftertouch` | Aftertouch from UI |
| `panic` | Enqueue `UiInputEvent::Panic` | All notes off |
| `setParams` | JSON → `ArcSwap<SynthParams>` | Full param update from UI |
| `getParams` | `ArcSwap<SynthParams>` → JSON | Full param snapshot |
| `getScopeData` | Read `ScopeFrame` buffer | Oscilloscope data (polled ~30fps) |
| `setPerformanceMonitorEnabled` | Toggle atomic counter | Performance monitoring |
| `getPerformanceMetrics` | Read atomic counters | Performance monitoring |
| `clientLog` | Forward to file | JS console log relay |

The IPC dispatch and ArcSwap sharing are framework-agnostic and move unchanged to the truce-based plugin.

---

## Phase 1 — Package Restructure

### 1a. Root `Cargo.toml`

Changes:
- Remove `nih_plug` from workspace dependencies
- Add `truce` workspace dependency
- Keep `wry`, `raw-window-handle`, `rwh_06`
- Consider if the wry fork patch is still needed (truce uses `baseview` for its own GUI, not wry)

```toml
[workspace.dependencies]
# Remove:
# nih_plug = { ... }

# Add:
truce = { git = "https://github.com/truce-audio/truce.git" }

# Keep:
wry = "0.47"
raw-window-handle = "0.5"
```

### 1b. `packages/cosmo-pd101-plugin/Cargo.toml`

```toml
[package]
name = "cosmo-pd101-plugin"
version = "0.1.0"
edition = "2021"
description = "Cosmo PD-101 synthesizer VST3/CLAP/AUv3 plugin"

[lib]
crate-type = ["staticlib", "cdylib"]

[features]
default = ["clap", "vst3", "au"]
clap = ["truce/clap"]
vst3 = ["truce/vst3"]
au = ["truce/au"]
debug_gui = []

[dependencies]
cosmo-synth-engine = { path = "../cosmo-synth-engine" }
arc-swap = "1.7"
crossbeam-queue = "0.3"
serde_json = "1.0"
libm = "0.2"
libc = "0.2"

# WebView editor
wry = { workspace = true }
raw-window-handle = { workspace = true }
rwh_06 = { package = "raw-window-handle", version = "0.6" }

# Plugin framework
truce = { workspace = true }

[target.'cfg(target_os = "macos")'.dependencies]
cocoa = "0.26"
objc = "0.2"
```

### 1c. Feature Mapping

| nih-plug feature | truce feature |
|---|---|
| `vst3` → `nih_plug/vst3` | `vst3` → `truce/vst3` |
| (no CLAP feature — always on) | `clap` → `truce/clap` |
| (no AU) | `au` → `truce/au` |

### 1d. New File Structure

```
packages/cosmo-pd101-plugin/
  src/
    lib.rs          — PluginLogic impl, #[derive(Params)], truce::plugin! macro
    gui.rs          — Editor impl via custom_editor() + wry WebView (minor changes)
    ffi.rs          — UNCHANGED (C ABI for AUv3 Swift)
  include/
    cosmo_pd101_ffi.h  — UNCHANGED
```

---

## Phase 2 — PluginLogic Implementation

### 2a. `CzPluginParams` — Truce Typed Params

Represent the 26 automatable params as truce `#[derive(Params)]`:

```rust
use truce::prelude::*;

#[derive(Params)]
struct CzPluginParams {
    #[id = "volume"]
    #[range = "0.0..=1.0"]
    #[default = 0.7]
    #[smoothing = "exp(50)"]
    volume: FloatParam,

    #[id = "warpAAmount"]
    #[range = "0.0..=1.0"]
    #[default = 0.5]
    warp_a_amount: FloatParam,

    // ... remaining 24 params ...
}
```

**Generated `ParamId` enum** (truce-typed — no string IDs):

```rust
enum CzPluginParamsParamId {
    Volume,
    WarpAAmount,
    WarpBAmount,
    // ... etc
}
```

### 2b. CzPlugin Struct

```rust
struct CzPlugin {
    params: Arc<CzPluginParams>,
    /// Full state (non-automatable params) as JSON State
    state: StateBinding<CzPluginState>,
    /// DSP engine (present after reset)
    processor: Option<CosmoProcessor>,
    /// Full SynthParams shared with GUI thread (includes both typed params + state)
    synth_params: Arc<ArcSwap<SynthParams>>,
    rt_synth_params: Arc<ArcSwap<SynthParams>>,
    synth_params_version: Arc<AtomicU64>,
    cached_rt_synth_params: Arc<SynthParams>,
    cached_synth_params_version: u64,
    scope_buffer: ScopeBuffer,
    ui_input_queue: UiInputQueue,
    mono_output: Vec<f32>,
    performance_counters: PerformanceCountersHandle,
}
```

### 2c. Bidirectional Param Sync

```
Truce typed param change (DAW automation)
    │
    ▼
Param callback: params → SynthParams field → ArcSwap<SynthParams>
    │
    ▼
audio thread reads ArcSwap
```

```
WebView param change (via IPC setParams)
    │
    ▼
ArcSwap<SynthParams>.store() → extract typed param value → TruceFloatParam.set()
    │
    ▼
DAW shows updated automation value
```

The bridge between truce typed params and `SynthParams` JSON:

- **DAW → DSP**: Truce `FloatParam` change → callback copies value to `ArcSwap<SynthParams>` → audio thread picks it up
- **DSP → DAW**: Audio thread writes to `ArcSwap` → periodic callback reads and calls `context.set_param()` on truce params
- **WebView → truce params**: IPC `setParams` writes `ArcSwap` + calls `context.set_param()` for each typed param

### 2d. Pluglogic Impl

```rust
impl PluginLogic for CzPlugin {
    fn reset(&mut self, sample_rate: f64, max_block_size: usize) {
        // Initialize CosmoProcessor, set params
    }

    fn process(
        &mut self,
        buffer: &mut AudioBuffer,
        events: &EventList,
        context: &mut ProcessContext,
    ) -> ProcessStatus {
        // Handle MIDI from events.iter() instead of context.next_event()
        // Sync params, render audio
    }

    fn layout(&self) -> GridLayout {
        // Return empty — we use custom_editor
        GridLayout::new("Cosmo PD-101", vec![])
    }

    fn custom_editor(&self) -> Option<Box<dyn Editor>> {
        // Return our wry WebView editor
        Some(Box::new(CzEditor::new(...)))
    }

    fn save_state(&self) -> Vec<u8> {
        // Serialize JSON state (non-automatable params)
        serde_json::to_vec(&*self.state.sync()).ok().unwrap_or_default()
    }

    fn load_state(&mut self, data: &[u8]) -> Result<(), StateLoadError> {
        // Deserialize JSON state
        let state: CzPluginState = serde_json::from_slice(data)
            .map_err(|_| StateLoadError::InvalidData)?;
        self.state.update(|s| *s = state);
        Ok(())
    }
}
```

### 2e. Export Macro

```rust
truce::plugin! {
    logic: CzPlugin,
    params: CzPluginParams,
}
```

---

## Phase 3 — Event Handling Translation

### nih-plug → truce Event Mapping

| nih-plug `NoteEvent` | truce `EventBody` |
|---|---|
| `NoteEvent::NoteOn { note, velocity, .. }` | `EventBody::NoteOn(NoteOn { note, velocity })` |
| `NoteEvent::NoteOff { note, .. }` | `EventBody::NoteOff(NoteOff { note })` |
| `NoteEvent::Choke { note, .. }` | Handled by NoteOff |
| `NoteEvent::MidiCC { cc, value, .. }` | `EventBody::ControlChange(ControlChange { controller, value })` |
| `NoteEvent::MidiPitchBend { value, .. }` | `EventBody::PitchBend(PitchBend { value })` |
| `NoteEvent::MidiChannelPressure { pressure, .. }` | Not currently used (ignore) |
| `NoteEvent::MidiPolyPressure { note, pressure, .. }` | Not currently used (ignore) |

### Key API Differences

| Operation | nih-plug | truce |
|---|---|---|
| Iterate events | `context.next_event()` | `events.iter()` |
| Audio output | `buffer.as_slice()` | `buffer.io(ch)` / `buffer.slice()` |
| Mono to stereo | Copy mono → each channel | `buffer.io_pair(0, 1)` + `buffer.io_pair(0, 2)` |
| Process status | `ProcessStatus::Normal` | `ProcessStatus::Normal` |
| Sample rate access | `buffer_config.sample_rate` | Stored from `reset()` |
| MIDI input | `MidiConfig::Basic` | Inherent (always receives MIDI events if host sends them) |

---

## Phase 4 — Editor / GUI Adaptation

### Before (nih-plug `Editor` trait):

```rust
impl Editor for CzEditor {
    fn spawn(&self, parent: ParentWindowHandle, context: Arc<dyn GuiContext>)
        -> Box<dyn Any + Send> { ... }
    fn size(&self) -> (u32, u32) { ... }
    fn set_scale_factor(&self, factor: f32) -> bool { ... }
    fn param_value_changed(&self, id: &str, normalized_value: f32) { ... }
}
```

### After (truce `custom_editor` + `Editor` trait):

```rust
impl Editor for CzEditor {
    fn spawn(
        &self,
        parent: RawWindowHandle,
        context: Arc<PluginContext<CzPluginParams>>,
    ) -> Box<dyn Any + Send> { ... }
    fn size(&self) -> (u32, u32) { ... }
}
```

**Key changes:**
- `ParentWindowHandle` → `RawWindowHandle` (rwh 0.6)
- `GuiContext` → `PluginContext<CzPluginParams>`
- No `set_scale_factor` — truce handles scaling
- No `param_value_changed` — truce params are atomic, use `context.get_param()` if needed
- Remove nih_plug import from gui.rs

---

## Phase 5 — macOS AUv3 Consolidation

### Current State
- Desktop: VST3/CLAP via nih-plug + separate AUv3 via Swift (`packages/cosmo-pd101-plugin-auv3/`)
- iPad: AUv3 via Swift + XCFramework (stays)

### After Migration
- Desktop: VST3/CLAP/AUv3 all via truce (single `truce::plugin!` macro)
- iPad: Swift AUv3 stays unchanged (truce has no iOS support)

### What changes for macOS AUv3
- The Swift-based macOS AUv3 (`CosmoPd101AudioUnit.swift` with `#if os(iOS)` branching) is no longer needed on desktop
- Remove macOS-specific branches from the Swift package
- Remove the macOS AUv3 Xcode target/build from build scripts

### Build Script Updates
- Remove `build-plugin-auv3.mjs` macOS branches (keep iOS parts)
- Remove `[profile.auv3]` from root `Cargo.toml`
- Remove Xcode project-based macOS AUv3 build steps

---

## Phase 6 — Build Script & Config Updates

| File | Change |
|---|---|
| `Cargo.toml` (root) | Remove nih_plug dep, add truce dep, remove `[profile.auv3]` |
| `packages/cosmo-pd101-plugin/Cargo.toml` | Remove nih_plug dep, add truce dep, change features |
| `scripts/build-plugin-auv3.mjs` | Remove macOS AUv3 workflow (keep iOS) |
| `package.json` (root) | Update `build:plugin:*` scripts |
| `packages/cosmo-pd101-plugin-auv3/CosmoPd101AudioUnit.swift` | Remove macOS branches (`#if os(iOS)` → no-conditional) |

---

## Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| truce's `Editor` `RawWindowHandle` doesn't match wry's expectations | GUI fails to embed | Test with a minimal wry+NSView embedding before production |
| truce `EventBody` enum differences from nih-plug `NoteEvent` | MIDI handling broken | Thorough MIDI event mapping in Phase 3 |
| Param sync latency (typed params ↔ ArcSwap) | Automation feels sluggish | Benchmark sync path; use `exp(50)` smoothing |
| truce's AUv3 format wrapper produces different bundle structure than current Xcode project | macOS AUv3 distribution broken | Test `cargo truce package --auv3` early |
| Serialized state format change | User presets invalidated | Ensure `save_state()` output matches existing full JSON format |
| truce's `PluginContext` API unstable pre-1.0 | Code churn | Pin truce to specific git rev, test after upgrades |

---

## Implementation Order

1. **Phase 1** — Package restructure (Cargo.toml, deps)
2. **Phase 2** — PluginLogic + Params implementation (core migration)
3. **Phase 3** — Event handling translation (MIDI, audio buffer)
4. **Phase 4** — Editor/GUI adaptation (custom_editor + wry)
5. **Phase 5** — macOS AUv3 consolidation (Swift → truce)
6. **Phase 6** — Build script cleanup, verification, testing
