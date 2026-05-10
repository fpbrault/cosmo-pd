# cosmo-pd101-plugin Test Plan

## App.test.tsx (59 lines, 2 tests — CRITICAL gap)

A 241-line component with 4 useEffect hooks, 3 pieces of state, performance monitor polling, update checking, and 2 IPC channels.

### High Priority
- [ ] **Add component renders with default state** — verify basic rendering without crashes
- [ ] **Add build label rendering** — verify `__CZ_APP_VERSION__` appears in DOM
- [ ] **Add performance monitor toggle on** — enable, verify polling starts
- [ ] **Add performance monitor toggle off** — disable, verify polling stops
- [ ] **Add performance metrics display** — mock `__czGetPerformanceMetrics` returns data, verify it renders
- [ ] **Add `checkForPluginUpdate` called on mount** — verify fetch is initiated
- [ ] **Add `checkForPluginUpdate` network failure** — fetch rejects, verify no crash
- [ ] **Add `checkForPluginUpdate` newer version** — newer version available, verify notification shown
- [ ] **Add `VITE_FORCE_UPDATE_NOTIFIER=1` behavior** — env var set, verify update notification forced
- [ ] **Add cleanup on unmount** — verify polling stops, no state updates after unmount
- [ ] **Add error boundary** — child throws, verify fallback renders

### Medium Priority
- [ ] **Add `normalizeBenchmarkMetrics` unit tests** — extract to utility, test parsing edge cases
- [ ] **Add race condition test** — rapid toggle performance monitor on/off
- [ ] **Add duplicate `normalizePerformanceMetrics` removal** — verify same function not duplicated in PluginPage

## PluginPage.test.tsx (128 lines — tests mock call signatures, not rendered output)

### High Priority
- [ ] **Add component renders with default state** — verify basic rendering
- [ ] **Add preset list renders** — mock presets, verify they appear in DOM
- [ ] **Add active preset highlighted** — verify selected preset has visual indicator
- [ ] **Add empty preset list** — empty array, verify "no presets" message
- [ ] **Add preset selection changes active** — click preset, verify `onSelectPreset` fires
- [ ] **Add scope subscription lifecycle** — subscribe → render → unsubscribe on unmount
- [ ] **Add `benchmarkApi` installation mock** — verify `installBenchmarkApi` is configured
- [ ] **Add `sendNativeEngineEvent` with IPC present** — `window.ipc` exists, verify message sent
- [ ] **Add `sendNativeEngineEvent` without IPC** — `window.ipc` absent, verify graceful skip
- [ ] **Add `loadedPresetFingerprint` is null** — fingerprint null when IPC present, verify behavior
- [ ] **Add error state during preset load** — preset load fails, verify error shown

### Medium Priority
- [ ] **Reduce over-mocking** — 7+ hooks mocked from `@cosmo/cosmo-pd101`. Mock fewer, integration-test more.
- [ ] **Replace mock-call-signature assertions with DOM assertions** — tests currently verify mock was called with args (`mock.calls[0]?.[0]`), should assert DOM changed

## nihPlugBridge.test.ts

### New test file needed
- [ ] **Add RPC invocation and response** — `invokeRust` sends message, response handler resolves promise
- [ ] **Add RPC timeout** — no response received within timeout, promise rejects
- [ ] **Add scope polling start/stop** — install polling, verify RAF loop starts; stop, verify loop ends
- [ ] **Add scope polling cleanup on React unmount** — simulate unmount, verify RAF callback stops
- [ ] **Add IPC response handler** — malformed response, unexpected msg type
- [ ] **Add `nextRpcId` increment** — consecutive calls get increasing IDs
- [ ] **Add pending RPC cleanup** — verify pending promises are stored and retrievable

## mockPluginBridge.test.ts (257 lines — tests mock internals, not consumer behavior)

### High Priority
- [ ] **Add consumer-focused tests** — test the public `MockBridgeHandle` API, not `window.__czIpcResponse`
- [ ] **Add `setParameter` with valid param** — set a param, verify `setParam` callback fires
- [ ] **Add `setParameter` with invalid param ID** — unknown param, verify error handling
- [ ] **Add `setParameter` with duplicated param ID** — same param set twice, verify last wins
- [ ] **Add `setParameter` with null/undefined** — edge case, verify graceful
- [ ] **Add concurrent invocations** — call multiple RPCs in parallel, verify ordering
- [ ] **Add rapid `setParameter` calls** — same param changed rapidly, verify no lost updates
- [ ] **Add malformed JSON in `setParams`** — invalid JSON payload, verify error
- [ ] **Add `getParams` returns current state** — set then get, verify consistency
- [ ] **Add begin/end transaction pairs** — begin → set → end, verify the triple behavior
- [ ] **Add begin without end** — begin called but no end, verify state (potential leak)

### Fixes
- [ ] **Replace internal-state assertions with behavior assertions** — tests touch `window.__czIpcResponse`, `window.ipc.postMessage`. Exercise the handle API instead.

## mockPluginBridge.browser.test.ts (50 lines — doesn't test browser features)

### High Priority
- [ ] **Add DOM interaction** — render a component using the bridge, click a button, verify param changes
- [ ] **Add remove `.browser.test.ts` or add real browser tests** — currently identical to unit test logic
- [ ] **Add replace `expect.poll` with sync assertions** — 1s poll adds 2s latency for synchronous operations

## usePluginParamBridge.test.ts

### New test file needed
- [ ] **Add bridge ready state** — bridge initializes, verify `ensureNihPlugBridge` resolves
- [ ] **Add bridge not available** — bridge never initializes, verify timeout/error
- [ ] **Add retry with backoff** — first few polls fail, verify it retries
- [ ] **Add StrictMode double-fire guard** — verify `bridgeReadyRef` prevents double setup

## checkPluginUpdate.test.ts (78 lines)

### Expand coverage
- [ ] **Add draft releases skipped** — GitHub returns draft release, verify it's ignored
- [ ] **Add network failure** — fetch rejects (`fetch = vi.fn().mockRejectedValue(...)`)
- [ ] **Add `VITE_FORCE_UPDATE_NOTIFIER=1` path** — env var set, verify notification forced
- [ ] **Add same version returned** — current version matches latest release, verify no "new version" shown
- [ ] **Add older version returned** — current version > latest release, verify no notification
- [ ] **Add `__CZ_APP_VERSION__` stubbed** — test requires Vite global to be `"0.0.0"`, stub explicitly

## TestHarness.test.tsx

### Basic coverage if used beyond dev
- [ ] **Add harness renders with messages** — feed messages, verify they display in debug panel
- [ ] **Add filter messages** — filter input, verify list filters
- [ ] **Add clear messages** — clear button empties message list
- [ ] **Add error boundary inside harness** — harness wraps App, verify crash doesn't break all UI

## Infrastructure

- [ ] **Add `vi.stubEnv` for `VITE_FORCE_UPDATE_NOTIFIER`** — standardize env var stubbing
- [ ] **Add factory functions for test data** — create `makeParam()`, `makePreset()` factories like cz-explorer does
- [ ] **Standardize `window.ipc` mock pattern** — currently inconsistent between tests
