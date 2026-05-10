# Cross-Cutting Test Improvement Plan

## Testing Antipatterns to Fix (ALL packages)

- [ ] **Replace `toBeTruthy()` with `toBeInTheDocument()` or `toBeVisible()`** — ubiquitous across all test files. `toBeTruthy()` passes on any truthy value including detached DOM nodes. This gives false confidence.
- [ ] **Replace `className` assertions with behavioral assertions** — many tests assert specific Tailwind/DaisyUI class names (`input-md`, `btn-error`, `select-lg`). These couple tests to implementation details. Use `getComputedStyle`, `toHaveClass` sparingly, or test the actual visual/behavioral effect.
- [ ] **Standardize on `@testing-library/user-event`** — cz-explorer uses `userEvent` (high fidelity), cosmo-pd101 uses `fireEvent` (low fidelity). Use `userEvent` everywhere.
- [ ] **Remove dead mock weight** — SetlistsPage and SynthBackupsPage tests define all 14/13 callbacks as `vi.fn()` but never invoke them. Remove unused mocks.
- [ ] **Add `jest-dom` matchers consistently** — use `toBeInTheDocument()`, `toBeVisible()`, `toHaveAttribute()`, `toBeEnabled()`, `toBeDisabled()` instead of manual DOM queries.

## Common Missing Patterns

- [ ] **Test error states systematically** — most components only test happy path. Every component with async operations should test: loading → success, loading → error, error → retry.
- [ ] **Test empty states systematically** — every list/table component should test: empty (no items), no results (filter/search yields nothing), no selection.
- [ ] **Test keyboard accessibility** — Tab order, Enter/Space activation, Escape to dismiss, Arrow navigation. Currently only tested in PresetLibrary.
- [ ] **Test unmount cleanup** — effects that poll, subscribe, or have async operations should test that cleanup runs and no state updates happen after unmount.
- [ ] **Test SSR safety** — components using `window`, `localStorage`, `document` should test they don't crash when those globals are undefined.

## Infrastructure Improvements

- [x] **Test data factories exist in DuplicateReviewModal tests** (`makeDuplicateGroup`, `makePreset`) — good pattern, replicate to other packages.
- [ ] **Create shared test utilities package** — test data factories (`makePreset()`, `makeSetlist()`, `makeSynthBackup()`) are duplicated or absent per-package. Export from a shared test lib.
- [ ] **Standardize mock patterns** — some files use `vi.mock(module, factory)`, others use `vi.mock(module, () => ({ default: ... }))`, others use module-level `vi.hoisted()`. Pick one pattern.
- [ ] **Add test for `toBeEmptyDOMElement`** — more specific than checking `innerHTML === ""`.
- [ ] **Add `axe` accessibility testing to browser test suites** — only present in unit tests, browser suites skip it. Browser is where real accessibility (focus management, keyboard nav) matters.

## Cross-Package Integration Tests (NEW)

These don't exist yet — would catch regressions in the shared library boundary.

- [ ] **Add `cosmo-pd101` → `cz-explorer` integration test** — render a `cosmo-pd101` component inside `cz-explorer` test providers, verify it works
- [ ] **Add `cosmo-pd101` → plugin webview integration test** — render `SynthRenderer` inside plugin webview test harness
- [ ] **Add MIDI data round-trip** — encode preset as SysEx → decode → verify fields match original
- [ ] **Add storage round-trip** — save preset to IndexedDB/mock → reload → verify fields match

## CI / Automation

- [ ] **Add test coverage thresholds** — set minimum coverage per package (30% for now, increase over time)
- [ ] **Add `--coverage` to CI test run** — currently only local, surface coverage in PR comments
- [ ] **Add test file linting** — ensure no `test.only` or `test.skip` committed (use `eslint-plugin-jest` or custom check)
- [ ] **Add slow test detection** — flag tests that take > 1s
- [ ] **Add `bun run test:all` to pre-commit hook** — prevent broken tests from reaching PR

## Test File Checklist by Package

| Package | Files | Tests | Est. Missing | Coverage Health |
|---------|-------|-------|-------------|-----------------|
| cz-explorer | 20 test files | ~75 tests | ~80 missing | 40% |
| cosmo-pd101 | 14 test files | ~45 tests | ~60 missing | 35% |
| cosmo-pd101-plugin | 8 test files | ~18 tests | ~40 missing | 20% |
| cosmo-synth-engine | 11 test files | 45 tests | ~40 missing | 50% |
