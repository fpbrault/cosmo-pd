# cosmo-pd101-plugin Refactoring Plan

## High Priority

- [ ] **Deduplicate `normalizeBenchmarkMetrics`** — Identical function in `PluginPage.tsx:23-50` and `App.tsx:15-44`. Extract to shared utility (e.g., `src/lib/benchmarkMetrics.ts`).
- [ ] **Add timeout for pending RPC promises** — `nihPlugBridge.ts:48-51` — if Rust never responds to `invokeRust`, the Promise stays pending indefinitely. Add timeout (e.g., 10s) that rejects the promise.
- [ ] **Fix scope polling cleanup on React unmount** — `nihPlugBridge.ts:217-278` — only listens to `pagehide` to stop polling. If React unmounts the component, `requestAnimationFrame` loop continues until page unload. Add React effect cleanup via returned callback.
- [ ] **Expand `App.test.tsx` coverage** — Currently 2 tests for a 241-line component with 4 effects. Missing: performance monitor toggle, build label rendering, network failure, forced update by env var, error states.
- [ ] **Expand `PluginPage.test.tsx` coverage** — Tests only check mock call signatures, not rendered output. Missing: empty preset list, scope subscription lifecycle, benchmark API failure, edge cases with null `loadedPresetFingerprint`.

## Medium Priority

- [ ] **Clean up test over-mocking** — `PluginPage.test.tsx` mocks 7+ hooks from `@cosmo/cosmo-pd101`. Each API change breaks tests. Consider integration-level tests or focused mock contracts.
- [ ] **Fix fragile `delete` pattern** — `PluginPage.test.tsx:72` — `delete (window as Window & { ipc?: unknown }).ipc` uses type assertion hack.
- [ ] **Consolidate duplicate param definitions** — `mockPluginBridge.ts:204-335` — `DEFAULT_PARAMS` duplicates param metadata from engine. Will drift. Consider generating from source of truth.
- [ ] **Fix mockPluginBridge.browser.test.ts** — Despite being `.browser.test.ts`, exercises no browser-specific APIs. Same sync logic as unit test. Either remove file or add real browser tests (DOM interaction, IPC, etc.).
- [ ] **Add error handling tests for `checkPluginUpdate.test.ts`** — Missing: draft releases, network failure (fetch rejection), `VITE_FORCE_UPDATE_NOTIFIER=1` path, same-version edge case.
- [ ] **Fix `__CZ_APP_VERSION__` unstubbed** — `checkPluginUpdate.test.ts` relies on Vite build-time global being `"0.0.0"`. If Vite define changes, tests break silently.
- [ ] **Fix stale `sessionStorage` side-effect** — `checkPluginUpdate.ts:105-112` — function is impure (reads and writes sessionStorage). Makes reasoning harder and breaks SSR.

## Low Priority

- [ ] **Move `isLikelyIosDevice` to module-level constant** — `PluginPage.tsx:72-75` — computed on every render but never changes.
- [ ] **Standardize IPC guard** — `PluginPage.tsx` uses `window.ipc?.postMessage` (optional chaining) at line 93 but `if (!window.ipc || ...)` guard at line 268. Pick one pattern.
- [ ] **Reduce benchmark polling interval** — `App.tsx:154` — 250ms polling for performance metrics. Consider 500ms-1000ms for battery life.
- [ ] **Fix 50ms retry in usePluginParamBridge** — `usePluginParamBridge.ts:27-32` — polls every 50ms with no backoff. Add incremental backoff (e.g., 50ms → 100ms → 200ms → 500ms max).
- [ ] **Remove stale TODO guards** — `mockPluginBridge.ts:11`, `TestHarness.tsx:13`, `TestHarness.tsx:38` — temporary guards that are still in place.
- [ ] **Remove array index key** — `TestHarness.tsx:262-264` — `key={i}` in `messages.map` suppressed with biome-ignore.
