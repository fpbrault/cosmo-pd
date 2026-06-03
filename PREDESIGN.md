# Preset Ownership + State Reload — Predesign (v3)

## Goals

1. **Rust owns all factory presets** — cosmo factory + CZ factory in a single canonical JSON embedded at build time. Web imports the same JSON. Remove ~52K lines of TypeScript preset constants.

2. **Plugin state survives GUI close/reopen** — Rust stores synth params + preset name + loaded preset ID in the DAW's `save_state`/`load_state`. Webview hydrates via `__czGetParams` retry loop (up to 10 attempts × 500ms, 10s fallback) + `__czGetPresetName()` — no `getSessionState`.

3. **Canonical float serialization** — snap floats to fixed precision at serialization boundaries so fingerprint comparison never falsely shows dirty state.

4. **Rust is the true owner of preset loading** — the webview is a pure View layer. When a user selects a preset, JS sends `loadPresetData(id)` to Rust, which loads the preset internally, applies it to the engine, and pushes the resulting params to JS via the existing `__czOnParams` callback. JS never holds full preset data.

---

## Architectural Principle: Pure View

### The Pattern

```
TypeScript (View)                 Rust (Model + Controller)
╔══════════════════════╗         ╔══════════════════════════════╗
║  Preset browser      ║         ║  PresetLibrary (disk I/O)   ║
║  (renders metadata)  ║◄────────║  Factory + user presets     ║
║                      ║  meta   ║                              ║
║  Knobs, sliders      ║◄────────║  PluginSessionState         ║
║  (renders params)    ║  state  ║  (params + session meta)    ║
║                      ║         ║                              ║
║  User clicks preset  ║────────►║  loadPresetData(id)         ║
║                      ║  cmd    ║  → deserialize entry.data   ║
║                      ║         ║  → sync_all_daw_params()    ║
║                      ║         ║  → push_params() → JS      ║
║                      ║         ║                              ║
║  User saves preset   ║────────►║  addPreset({name, tags})    ║
║                      ║  cmd    ║  → reads current SynthParams║
║                      ║         ║  → wraps in entry          ║
║                      ║         ║  → UUID for id             ║
║                      ║         ║  → atomic write to disk    ║
╚══════════════════════╝         ╚══════════════════════════════╝
```

### Why

- **DAW state restore**: the DAW asks Rust for state (not JS). If Rust owns the active preset, it can restore it synchronously without the webview.
- **Multi-frontend future**: egui, headless CLI, or any other frontend just sends the same commands.
- **Headless testing**: real factory presets can be loaded in Rust benchmarks and integration tests.
- **Crash isolation**: if the webview crashes, the synth engine keeps running with the correct preset. When the webview re-opens, the `__czGetParams` retry loop hydrates from Rust's internal state.

### Web Mode Divergence

In web/standalone mode (no native IPC bridge), the WASM engine can't access the filesystem. The architecture necessarily diverges:

- **Factory presets**: imported from `factory_presets.json` at build time by JS
- **User presets**: stored in IndexedDB by JS
- **Loading a preset**: JS reads preset data from storage → calls `wasmEngine.setParams(json)` → the WASM (Rust) engine applies it
- JS still orchestrates the library, but the WASM engine owns the actual parameter application

This is an accepted platform constraint. The important thing is the plugin path is pure View. The JSON file remains the single shared artifact between both modes.

---

## File Inventory

### New Files

| File | Purpose |
|------|---------|
| `packages/cosmo-pd101/scripts/convert-presets.ts` | One-time script: reads `defaultPresets.ts` + `factoryCzPresetDefinitions.ts`, runs CZ SysEx→SynthPresetV1 conversion, writes `factory_presets.json` |
| `packages/cosmo-pd101/src/lib/synth/factory_presets.json` | Canonical factory preset bank (pretty, human-editable). Contains all 129 presets pre-converted to SynthPresetV1. |
| `packages/cosmo-pd101/src/lib/synth/canonicalSerialize.ts` | Float-snapping serializer for stable fingerprints |
| `packages/cosmo-pd101-plugin/src/preset_library.rs` | `PresetLibrary` — on-disk library (atomic writes, factory/user split, multi-instance safe) |
| `packages/cosmo-pd101-plugin/src/session_state.rs` | `PluginSessionState` struct + IPC helpers |
| `packages/cosmo-pd101-plugin/src/preset_library_path.rs` | Platform-aware preset library path resolution incl. AUv3 App Group support |

### Modified Files

| File | Changes |
|------|---------|
| `packages/cosmo-pd101-plugin/Cargo.toml` | Add `serde` (derive); add `serde_json` (already present); add `uuid` (v4 feature); add `cfg-if`; **no `dirs` on macOS targets** |
| `packages/cosmo-pd101-plugin/build.rs` | Minifies `factory_presets.json` → writes `minified_presets.json` to `OUT_DIR` |
| `packages/cosmo-pd101-plugin/src/lib.rs` | New IPC methods (`getPresetLibrary`, `loadPresetData`, `addPreset`, `deletePreset`, `renamePreset`, `toggleStarred`). Keep existing `getParams`/`setParams`/`getPresetName`/`setPresetName`. Update `save_state`/`load_state`; wrap `PresetLibrary` in `Arc<Mutex<...>>`; update `push_params` to include loaded preset metadata |
| `packages/cosmo-pd101-plugin/src/ffi.rs` | Load factory presets from `PresetLibrary`; update DAW program list mapping (128 factory presets max) |
| `packages/cosmo-pd101-plugin/webview/src/lib/IPCBridge.ts` | Add `__czGetPresetLibrary`, `__czLoadPresetData`, `__czAddPreset`, `__czDeletePreset`, `__czRenamePreset`, `__czToggleStarred`. **Keep** `__czGetParams`/`__czSetParams` for live param sync; keep `__czOnParams` for DAW automation push. **Keep** `__czGetPresetName`/`__czSetPresetName` for DAW preset name persistence. |
| `packages/cosmo-pd101/src/features/synth/engine/pluginBridgeSynthEngineAdapter.ts` | Hydration via `__czGetParams` retry loop (10×500ms + 10s fallback) + `__czGetPresetName()`. No `getSessionState`. Keep inbound `__czOnParams` for real-time DAW automation. Add `loadPresetData(id)` bridge method. |
| `packages/cosmo-pd101-plugin/webview/src/pages/PluginPage.tsx` | No `DEFAULT_SYNTH_PRESETS` import. Factory + user metadata from `getPresetLibrary()` only. Preset selection calls `loadPresetData(id)` — no data flows back. |
| `packages/cosmo-pd101/site/src/LivePage.tsx` | Web mode only: debounced autosave (2s) for session metadata. No unified session state — keep existing `saveCurrentState`/`saveCurrentPresetSession`. |
| `packages/cosmo-pd101/src/lib/synth/presetStorage.ts` | Web mode: keep `saveCurrentState`+`saveCurrentPresetSession` (no unified session state in target architecture). Web mode keeps IndexedDB for user presets. Plugin mode does NOT use this module. |
| `packages/cosmo-pd101/src/lib/synth/presetTypes.ts` | Update `FrontendPresetV1` to reflect that plugin mode never holds `data` on the JS side. Remove `SynthSessionState` type (no `getSessionState` in target architecture). |
| `packages/cosmo-pd101/src/features/synth/useSynthPresetManager.ts` | Plugin mode: accept `onLoadPresetData(id)` callback instead of `builtinPresets`/`libraryPresets`. Web mode: keep existing data-loading paths. |
| `packages/cosmo-pd101/src/index.ts` | Update exports (remove `DEFAULT_SYNTH_PRESETS`, `FACTORY_PRESETS`) |
| `packages/cosmo-pd101-plugin-auv3/CosmoPD101Host/CosmoPD101AUv3Ext-macOSExtension/...entitlements` | Add `com.apple.security.application-groups` |
| `packages/cosmo-pd101-plugin-auv3/Sources/CosmoPd101AUv3/Resources/appex.entitlements` | Add `com.apple.security.application-groups` |

### Deleted Files

| File | Reason |
|------|--------|
| `packages/cosmo-pd101/src/lib/synth/defaultPresets.ts` | Factory presets moved to JSON |
| `packages/cosmo-pd101/src/lib/synth/factoryCzPresetDefinitions.ts` | Factory presets moved to JSON |
| `packages/cosmo-pd101/src/lib/synth/factoryCzPresets.ts` | Factory presets moved to JSON |
| `packages/cosmo-pd101-plugin/src/factory_presets.json` | Superseded by shared `factory_presets.json` — Rust uses `build.rs`-minified copy of the shared file |

---

## Data Formats

### `factory_presets.json` — Canonical Format

```json
[
  {
    "id": "preset_<fnv1a_hex>",
    "name": "Bliss",
    "source": "cosmo-factory",
    "author": "Purr Audio",
    "starred": true,
    "tags": ["brass"],
    "macroLabels": ["Brightness", "Timbre", "Time", "Movement"],
    "factoryVersion": 1,
    "data": { "schemaVersion": 1, "params": { ... } }
  },
  {
    "id": "preset_<fnv1a_hex>",
    "name": "2L PLUCK+BRSS",
    "source": "cz-factory",
    "author": "Temple of CZ",
    "starred": false,
    "tags": ["brass"],
    "macroLabels": ["Brightness", "Timbre", "Time", "Movement"],
    "factoryVersion": 1,
    "data": { "schemaVersion": 1, "params": { ... } }
  }
]
```

- **`data`** contains finalized `SynthPresetV1` — CZ presets are run through `convertDecodedPatchToSynthPreset()` during conversion
- IDs are **pre-computed** by the conversion script using TypeScript `createPresetId()` (FNV-1a 64-bit of canonical identity). Rust reads these as opaque strings — never needs to generate FNV-1a hashes.

### Conversion Script (`convert-presets.ts`)

1. Reads `defaultPresets.ts` — extracts `FrontendPresetV1.data` as-is (already SynthPresetV1)
2. Reads `factoryCzPresetDefinitions.ts` — each definition is raw decoded SysEx. Runs through `convertDecodedPatchToSynthPreset()` to produce SynthPresetV1.
3. Calls `createPresetId()` on each to produce stable IDs
4. Outputs sorted: cosmo-factory first (alphabetical by name), then cz-factory (alphabetical by name)

### `PluginSessionState` — Rust Struct (DAW save_state/load_state only — not an IPC method)

```rust
#[derive(Serialize, Deserialize)]
struct PluginSessionState {
    synth_params: SynthParams,
    preset_name: String,
    loaded_preset_id: Option<String>,   // which preset is loaded (if any)
}
```

`save_state()` serializes `PluginSessionState`. `load_state()` has 3-tier fallback:

```rust
fn load_state(&mut self, data: &[u8]) -> Result<(), StateLoadError> {
    // Tier 1: PluginSessionState (the only write format going forward)
    if let Ok(session) = serde_json::from_slice::<PluginSessionState>(data) {
        // restore all fields
        return Ok(());
    }
    // Tier 2: wrapped { synth_params, preset_name } (current format)
    if let Ok(obj) = serde_json::from_slice::<serde_json::Value>(data) {
        if obj.is_object() && obj.get("synth_params").is_some() {
            // Extract params + name, use defaults for new fields
            return Ok(());
        }
    }
    // Tier 3: flat SynthParams (legacy format)
    if let Ok(params) = serde_json::from_slice::<SynthParams>(data) {
        // construct default session: params, name="Init", no ID, default labels
        return Ok(());
    }
    Err(StateLoadError::Malformed("invalid state"))
}
```

**Test requirement**: Unit tests for all 3 deserialization paths.

No `getSessionState` or `setSessionState` IPC methods in target architecture (DATAFLOW — hydration uses existing `__czGetParams` retry loop + `__czGetPresetName()`).

### `PresetLibrary` — Rust Struct + On-Disk File

```rust
#[derive(Serialize, Deserialize)]
struct PresetLibraryEntry {
    id: String,
    name: String,
    source: String,            // "cosmo-factory" | "cz-factory" | "user"
    author: String,
    starred: bool,
    tags: Vec<String>,
    macro_labels: [String; 4],
    factory_version: u32,      // 0 for user presets
    data: serde_json::Value,   // the full SynthPresetV1 as opaque JSON
}

#[derive(Serialize, Deserialize)]
struct PresetLibrary {
    version: u32,               // file format version, currently 1
    entries: Vec<PresetLibraryEntry>,
}
```

**On-disk file path resolution** (see: Platform Path Strategy section):

| Platform | Path |
|----------|------|
| macOS VST3/CLAP | `~/Library/Application Support/com.cosmo-pd101/preset_library.json` |
| macOS AUv3 | `~/Library/Group Containers/<TEAM_ID>.group.com.purraudio.cosmo-pd101/preset_library.json` |
| Linux | `$XDG_DATA_HOME/cosmo-pd101/preset_library.json` or `~/.local/share/cosmo-pd101/preset_library.json` |
| Windows | `{FOLDERID_RoamingAppData}\Cosmo PD101\preset_library.json` |

**Initialization:**
1. On first run (no file exists), create library from embedded factory presets
2. On subsequent runs, load file and merge factory presets:
   - Entry-by-entry merge keyed on `id`
   - If `factory_version` in file < embedded factory_version → overwrite factory entries
   - Prune: any factory entry whose `id` no longer exists in the embedded list is removed
   - Preserve all user entries (`source: "user"`)

**CRUD:**
- `add_entry(entry)` — append user preset (ID generated by Rust via UUID v4)
- `delete_entry(id)` — remove by id
- `get_entry(id)` — lookup by id
- `list_entries(source_filter?)` — list all entries (metadata only), optionally filtered by source

**Multi-instance safety:**
- `addPreset` and `deletePreset`: re-read library from disk into temp struct, apply mutation to fresh data, write back. Do NOT rely on cached in-memory `PresetLibrary` for writes.
- `getPresetLibrary`: may serve from in-memory cache (staleness acceptable for list display).
- Atomic writes: write to temp file, then rename.

**Concurrency:**
- `PresetLibrary` wrapped in `Arc<Mutex<PresetLibrary>>`
- `getPresetLibrary` holds lock just long enough to serialize the metadata
- `loadPresetData` holds lock just long enough to read one entry's data, then releases before touching engine state
- `addPreset`/`deletePreset` release lock during disk I/O

---

## Platform Path Strategy (AUv3 Sandbox)

### Problem

macOS AUv3 extensions run in app sandboxes. `dirs::home_dir()` resolves to a temporary container path, not the user's home. VST3, CLAP, and AUv3 would each get isolated preset libraries.

### Solution

1. **App Group**: `group.com.purraudio.cosmo-pd101` in Apple Developer Portal
2. **Entitlements**: Add `com.apple.security.application-groups` to both AUv3 entitlement files
3. **Rust path resolution** (`preset_library_path.rs`):
   - macOS: check `COSMO_PD101_DATA_DIR` env var first (set by Swift host for AUv3). Fall back to `dirs::data_dir().join("com.cosmo-pd101")`.
   - Linux: `dirs::data_dir().join("cosmo-pd101")`
   - Windows: `dirs::data_dir().join("Cosmo PD101")`
4. **Swift-side** (AUv3 host extension startup):
   ```swift
   if let container = FileManager.default.containerURL(
       forSecurityApplicationGroupIdentifier: "group.com.purraudio.cosmo-pd101"
   ) {
       setenv("COSMO_PD101_DATA_DIR", container.path, 1)
   }
   ```

### Cargo.toml

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
uuid = { version = "1", features = ["v4"] }
cfg-if = "1"

[target.'cfg(not(target_os = "macos"))'.dependencies]
dirs = "5"
```

On macOS, `dirs` is not a dep. The fallback path uses a hardcoded `Library/Application Support` resolution (or an inline check).

---

## IPC Contract

### Design Principles

- **JS sends commands, Rust owns state**. JS never holds preset data (param blobs).
- **Hydration** uses the existing `__czGetParams` retry loop + `__czGetPresetName()` — no `getSessionState`.
- **`getParams`/`setParams`** live sync path is kept for high-frequency param changes.
- **`__czOnParams`** runtime push from Rust DAW automation is kept.
- **`loadPresetData(id)`** tells Rust to load internally — no preset data returned to JS.
- **`addPreset`** accepts metadata only — Rust reads current params internally.

### IPC Methods

| Method | Args | Returns | Notes |
|--------|------|---------|-------|
| `getParams` | `{}` | `SynthParams` JSON | Retry loop on webview mount for hydration (up to 10×500ms, 10s fallback). No `getSessionState`. |
| `setParams` | `SynthParams` JSON | `{}` | Live param sync from JS to Rust (on user edit). |
| `getPresetName` | `{}` | `{ name: string }` | Restore DAW-persisted preset name into UI on mount. |
| `setPresetName` | `{ name }` | `{}` | Stores preset name for DAW persistence on preset load/save. |
| `getPresetLibrary` | `{ source? }` | `PresetLibrarySummary` | Metadata-only list: `{ entries: [{ id, name, source, author, starred, tags }] }`. No `data` field. Optional source filter. |
| `loadPresetData` | `{ id }` | `{ preset_name }` | Rust loads internally: deserializes data → applies to engine → syncs DAW params → pushes params to webview via `__czOnParams`. Returns preset name so JS can update session UI. |
| `addPreset` | `{ name, tags }` | `{ id }` | Saves current synth state as a new user preset. Rust reads `self.synth_params`, generates UUID, wraps in entry, writes to disk. |
| `deletePreset` | `{ id: string }` | `{}` | Removes preset from library. Re-reads disk, applies mutation, writes back. |
| `renamePreset` | `{ id, newName }` | `{}` | Updates preset name in metadata + file. |
| `toggleStarred` | `{ id, starred }` | `{}` | Updates starred flag in metadata + file. |

### Flow: `loadPresetData` in detail

```
JS: useSynthPresetManager.handleLoadPresetData(id)
  └── bridge.loadPresetData(id)
       └── IPC: __czLoadPresetData({ id })

Rust: handle_load_preset_data(id)
  ├── preset_library.lock()
  ├── library.get_entry(id)
  ├── serde_json::from_value(entry.data) → SynthParams
  ├── drop(library)
  ├── sync_all_daw_params_from_synth(&self.params, &params)
  ├── self.synth_params.store(Arc::new(params))
  ├── self.processor.set_synth_params(rt_params)
  ├── *self.preset_name.lock() = entry.name.clone()
  ├── push_params() → sends updated SynthParams to webview via __czOnParams
  └── returns { preset_name: entry.name }

JS: receives __czOnParams(params_json) → existing code path
  └── applyPreset({ schemaVersion: 1, params: params_json })

JS: receives __czLoadPresetData response → updates session UI
  ├── store.setPresetName(response.preset_name)
  └── window.__czSetPresetName(response.preset_name)
```

**Result**: zero double-bridge. Preset data flows Rust→Rust internally. JS receives params via the existing `__czOnParams` push (same code path as DAW automation). The `loadPresetData` response just carries the display metadata.

### Flow: `addPreset` in detail

```
JS: user clicks "Save Preset"
  └── bridge.addPreset({ name: "My Preset", tags: ["bass"] })
       └── IPC: __czAddPreset({ name, tags })

Rust: handle_add_preset(args)
  ├── let params = self.synth_params.load()   // current engine state
  ├── let id = Uuid::new_v4()                  // user preset ID
  ├── preset_library.lock()
  ├── re-read library from disk
  ├── append new entry with id, name, tags, serde_json::to_value(&params)
  ├── atomic write (temp → rename)
  └── returns { id }

JS: receives { id }
  └── adds to local metadata cache for UI
```

**Result**: Rust snapshots current engine params without them ever crossing the bridge.

---

## DAW Program Change

The current Rust code maps factory presets to DAW programs. With the unified 129-preset library:

1. First 128 factory presets map to DAW programs 0-127 (by index in sorted library).
2. User presets are NOT program-change accessible.
3. ProgramChange handler in `ffi.rs` looks up preset by index in factory-only subset.
4. DAW program name list returns factory preset names only.

---

## Plugin Init Flow (Before vs After)

### Before (current — 3-way race + 60fps outbound)

```
Webview mounts
  ├── usePluginBridgeSynthEngine mount
  │     ├── __czOnParams = (json) => applyPreset(json)    ← Rust push (used for init hydration)
  │     ├── subscribe to Zustand → sync → __czSetParams() ← outbound (full speed)
  │     └── getParams() retry loop (10x @ 500ms)          ← poll
  │           └── on success: applyPreset(result)
  └── PluginPage mount
        └── __czGetPresetName() → syncInstanceBRef(name)  ← separate fetch
```

### After (retry hydration + pure View)

```
Webview mounts
  └── usePluginBridgeSynthEngine mount
        ├── keep __czOnParams for DAW automation push (runtime only, not init)
        │
        ├── Hydration via __czGetParams retry loop:
        │   ├── Up to 10 attempts × 500ms
        │   ├── 10s safety timer fallback
        │   ├── On success → applyPreset(synthParams)
        │   └── Opens outbound gate
        │
        ├── __czGetPresetName()
        │   └── Restore DAW-persisted preset name into UI
        │
        └── Zustand subscribe → __czSetParams()
              └── loadPresetData(id) called on: user selects preset from browser
              └── addPreset({name, tags}) called on: user saves new preset
```

No getSessionState. No fingerprint tracking. No macro_labels in session state. Preset data never in JS.

---

## Web Init Flow (Before vs After)

### Before (current — split load + separate session)

```typescript
useEffect(() => {
  const saved = await loadCurrentState();
  const session = await loadCurrentPresetSession();
  if (saved) applyPreset(saved);
  if (session?.activePresetNameBase !== "Current State") {
    syncBuiltinSelectionRef.current?.(session.activePresetNameBase);
  } else {
    applyPreset(firstBuiltin);
  }
}, []);

useEffect(() => {
  const handle = () => {
    const state = useSynthStore.getState().gatherState();
    await saveCurrentState(state);
  };
  window.addEventListener("beforeunload", handle);
  return () => window.removeEventListener("beforeunload", handle);
}, []);
```

### After (web mode — keeps existing split-load pattern)

```typescript
// Web mode only: no unified session state (DATAFLOW §12 divergence)
useEffect(() => {
  const saved = await loadCurrentState();
  const session = await loadCurrentPresetSession();
  if (saved) applyPreset(saved);
  if (session?.activePresetNameBase !== "Current State") {
    syncBuiltinSelectionRef.current?.(session.activePresetNameBase);
  } else {
    applyPreset(firstBuiltin);
  }
}, []);

// Debounced autosave (2s) — session metadata only, not live param tweaks
useEffect(() => {
  const unsub = useSynthStore.subscribe(
    debounce(() => {
      const state = useSynthStore.getState();
      if (state.activePresetId !== previousPresetId) {
        // Save both params and session metadata separately
        saveCurrentState(gatherCurrentState(state));
        saveCurrentPresetSession(gatherSessionMeta(state));
      }
    }, 2000)
  );
  return unsub;
}, []);

// beforeunload safety net
useEffect(() => {
  const handle = () => { saveCurrentState(useSynthStore.getState()); };
  window.addEventListener("beforeunload", handle);
  return () => window.removeEventListener("beforeunload", handle);
}, []);
```

---

## Dirty Detection

- **Fingerprint**: canonical JSON (floats snapped to 6 decimal places, strict key ordering, default-value injection for missing keys) of current `SynthParams`.
- **Comparison**: `getPresetFingerprint(params)` vs stored `loadedPresetFingerprint`.
- **Stable**: canonical serialization guarantees no drift from float round-trips. Handles schema evolution.
- **Plugin**: fingerprint computed locally in JS from params pushed by Rust (`__czOnParams`). NOT stored in Rust `PluginSessionState` — it's a UI-only concern. Re-computed on each `__czOnParams` push. No fingerprint IPC.
- **Web**: fingerprint computed locally in JS from WASM engine state. Persisted in IndexedDB alongside existing session data.

---

## Macro Labels

- Labels are UI-only, NOT in Rust `SynthParams`.
- NOT stored in Rust `PluginSessionState` (DATAFLOW architecture — no `setSessionState` IPC).
- Plugin: macro labels arrive as part of `loadPresetData` response metadata (`{ preset_name }` extended to include labels). On label edit, JS calls a lightweight `setMacroLabels(...)` RPC if persistence is needed.
- Web: saved alongside existing session data in IndexedDB.
- Default labels: `["Brightness", "Timbre", "Time", "Movement"]`.
- Factory JSON includes `macroLabels` for each preset — restored on preset load.

---

## Build Process

### Rust (`build.rs`)

Writes minified JSON directly to `OUT_DIR`:

```rust
fn main() {
    let json_path = "../../cosmo-pd101/src/lib/synth/factory_presets.json";
    let pretty = std::fs::read_to_string(json_path).unwrap();
    let value: serde_json::Value = serde_json::from_str(&pretty).unwrap();
    let minified = serde_json::to_string(&value).unwrap();
    let out_dir = std::env::var("OUT_DIR").unwrap();
    std::fs::write(
        std::path::Path::new(&out_dir).join("minified_presets.json"),
        &minified,
    ).unwrap();
    println!("cargo::rerun-if-changed=../../cosmo-pd101/src/lib/synth/factory_presets.json");
}
```

Rust code:

```rust
pub(crate) const FACTORY_PRESETS_JSON: &str =
    include_str!(concat!(env!("OUT_DIR"), "/minified_presets.json"));
```

### Web (bun/vite)

Web imports the pretty JSON directly:

```typescript
import factoryPresets from "../../lib/synth/factory_presets.json" with { type: "json" };
```

Bundler handles minification in production builds. Web mode uses this for factory preset metadata + data since WASM has no filesystem access.

---

## Implementation Order

1. **Write conversion script** → generate `factory_presets.json`
   - Run `convertDecodedPatchToSynthPreset()` for CZ presets
   - IDs pre-computed by TypeScript `createPresetId()`
   - Verify output: 23 cosmo + 106 CZ = 129 presets total

2. **Create `canonicalSerialize.ts`** — float snapping, strict key ordering, default-value injection

3. **Create Rust `session_state.rs`** — `PluginSessionState` struct, serde, `save_state`/`load_state` with 3-tier fallback

4. **Create Rust `preset_library_path.rs`** — platform path resolution incl. AUv3 App Group

5. **Update AUv3 entitlements** — add `com.apple.security.application-groups` to both entitlement files

6. **Update AUv3 Swift code** — resolve App Group container, set `COSMO_PD101_DATA_DIR` env var

7. **Create Rust `preset_library.rs` + update `build.rs`**
   - `PresetLibrary` struct with metadata-only + full entry access
   - `loadPresetData(id)` — deserialize, apply to engine, push to webview
   - `addPreset({ name, tags })` — snapshot current params, wrap + UUID, write
   - `deletePreset(id)` — re-read disk, mutate, write
   - `renamePreset(id, newName)` — update metadata + file
   - `toggleStarred(id, starred)` — update starred flag + file
   - Multi-instance safe: re-read from disk on every mutation
   - Factory version merge with prune for deleted/renamed presets
   - `Arc<Mutex<...>>` wrapping
   - Build: minify shared JSON into `OUT_DIR` as `.json` file

8. **Update `lib.rs`** — IPC handlers for `getPresetLibrary`, `loadPresetData`, `addPreset`, `deletePreset`, `renamePreset`, `toggleStarred`
   - Keep existing `getParams`/`setParams`/`getPresetName`/`setPresetName` (DATAFLOW hydration path)
   - `handle_load_preset_data`: look up → deserialize → apply to engine → push to webview → return metadata
   - `handle_add_preset`: read current params from engine → wrap → write → return id
   - Update `save_state` to write `PluginSessionState`
   - Update `load_state` with 3-tier fallback + unit tests for all tiers

9. **Update `ffi.rs`** — factory presets from `PresetLibrary` (not standalone file); update program change mapping (128 factory presets max)

10. **Update tests** — `presetIdentity`, `useSynthPresetManager`: replace builtin preset references with JSON imports (before deleting source files)

11. **Update `IPCBridge.ts`** — add `__czGetPresetLibrary`, `__czLoadPresetData`, `__czAddPreset`, `__czDeletePreset`, `__czRenamePreset`, `__czToggleStarred`. Keep existing `__czGetParams`/`__czSetParams`/`__czOnParams`/`__czGetPresetName`/`__czSetPresetName`.

12. **Refactor `usePluginBridgeSynthEngine`** — hydration via `__czGetParams` retry loop (10×500ms + 10s fallback) + `__czGetPresetName()`. Add `loadPresetData(id)` bridge proxy.

13. **Refactor `useSynthPresetManager`** — plugin mode: accept `onLoadPresetData(id)` callback, no builtin/library presets. Web mode: keep existing data flow.

14. **Update `PluginPage.tsx`** — preset list from `getPresetLibrary()` (metadata only), selection calls `loadPresetData(id)`, no factory preset imports

15. **Update `presetStorage.ts`** — web mode only: keep existing `saveCurrentState`+`saveCurrentPresetSession`. Plugin mode does not use this module.

16. **Update `LivePage.tsx`** — web mode only: debounced autosave for session metadata (not live param tweaks)

17. **Remove old TS preset files** — `defaultPresets.ts`, `factoryCzPresetDefinitions.ts`, `factoryCzPresets.ts`, plugin's own `factory_presets.json`

18. **Update `index.ts` exports** — remove `DEFAULT_SYNTH_PRESETS`, `FACTORY_PRESETS`

19. **Lint + Test + Build**

---

## Dependencies to Add

| Crate | Why |
|-------|-----|
| `serde` (with `derive` feature) | Serialize/deserialize `PluginSessionState` and `PresetLibrary` |
| `uuid` (with `v4` feature) | Generate IDs for user-created presets in Rust |
| `cfg-if = "1"` | Conditional compilation for platform path resolution |

`dirs` is only on non-macOS targets:

```toml
[target.'cfg(not(target_os = "macos"))'.dependencies]
dirs = "5"
```

---

## Open Questions (resolved)

- **Q**: Where should `factory_presets.json` live? → `packages/cosmo-pd101/src/lib/synth/` (shared between Rust and web)
- **Q**: Minified or pretty? → Pretty source, minified at Rust build time via `build.rs` writing to `OUT_DIR`; web imports pretty JSON
- **Q**: Backward compat for `load_state`? → Yes: 3-tier fallback with unit tests
- **Q**: Legacy/compat layers? → No breaking changes between shipped versions are fine. The 3-tier fallback covers old project files.
- **Q**: How to handle AUv3 sandbox paths? → App Group entitlements + `COSMO_PD101_DATA_DIR` env var
- **Q**: How to prevent multi-instance preset overwrites? → Re-read library from disk before every mutation write
- **Q**: IPC payload too large for 129 presets? → Metadata-only list (`getPresetLibrary`), no full data ever crosses bridge
- **Q**: IPC flooding from 60fps param automation? → Keep `setParams` for live sync (no `setSessionState` in target architecture). Hydration uses `__czGetParams` retry loop.
- **Q**: FNV-1a in Rust? → Not needed. Factory IDs pre-computed in conversion script. User presets use UUID v4 (generated by Rust).
- **Q**: `__czOnParams` — keep or remove? → Keep for runtime DAW automation push. Remove from init hydration.
- **Q**: Who owns preset loading? → **Rust**. `loadPresetData(id)` deserializes internally, applies to engine, pushes resulting params to JS via `__czOnParams`. JS never holds preset data in plugin mode.
- **Q**: How does JS get preset data when saving? → **It doesn't.** `addPreset` accepts metadata only. Rust reads current engine params internally.
- **Q**: What about web mode? → Divergent architecture accepted. JS imports factory JSON + IndexedDB for user presets. WASM engine receives params via `setParams(json)`.
- **Q**: What if factory presets conflict with existing Rust `factory_presets.json`? → Delete the Rust-specific copy. Shared JSON is single source. `ffi.rs` loads from `PresetLibrary`.
