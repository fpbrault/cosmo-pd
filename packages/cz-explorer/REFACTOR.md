# cz-explorer Refactoring Plan

## Critical

- [ ] **Remove dead component `FilterPanel.tsx`** — `src/components/presets/FilterPanel.tsx` is not imported anywhere except its own test (108 lines of dead code).
- [ ] **Remove hardcoded Postgres credentials** — `src/lib/db/postgresDatabase.ts:5` — `"postgresql://user:password@localhost:5432/presets"` — move to `DATABASE_URL` env var. The `client.connect()` at module import time (line 8) should also be lazy.

## High Priority

- [ ] **Extract SysEx normalization utilities** — `ensureSysexFraming`, `isNibblePayload`, `toCanonicalVoicePacketFromNibblePayload` are triplicated across `presetManager.ts`, `presetFingerprint.ts`, and `czSysexDecoder.ts`. Extract to shared `src/lib/midi/sysexUtils.ts`.
- [ ] **Break up `PresetList.tsx`** (1151 lines) — Extract:
  - [ ] `PresetListTopBar.tsx` — the inline sub-component (~200 lines)
  - [ ] `PresetTable.tsx` — virtualized table body
  - [ ] `usePresetKeyboardHandler.ts` — keyboard event handling hook
  - [ ] `RetrievePresetModal.tsx` — the inline retrieve modal
- [ ] **Break up `SettingsPanel.tsx`** (573 lines) — Extract:
  - [ ] `AccountSyncPanel.tsx` — login UI + sync settings
  - [ ] `DataManagementPanel.tsx` — factory preset loading, workspace backup/export
  - [ ] `ResetDataModal.tsx` — data reset with cloud confirmation
- [ ] **Break up `presetManager.ts`** (1131 lines) — Split into:
  - [ ] `lib/midi/presetMidiOps.ts` — MIDI operations (send, write, retrieve)
  - [ ] `lib/presets/presetNormalization.ts` — SysEx normalization + canonical form
  - [ ] `lib/presets/presetCrud.ts` — CRUD wrappers around PresetDatabase
  - [ ] `lib/presets/onboardingPresets.ts` — factory preset loading / onboarding logic
  - [ ] Keep backup/restore and tag logic in focused files
- [ ] **Deduplicate `AppSidebar.tsx` nav** (lines 190-382) — Collapsed and expanded nav trees are essentially duplicated (~180 lines). Move nav items to a configuration array and map over it.
- [ ] **Add cleanup to `App.tsx` async IIFE** (lines 28-53) — `refreshOnlineAuthSession()` and `ensureFactoryPresetsOnFirstUse()` can call `setShowOnboardingModal` after unmount. Add abort controller or mounted flag.
- [ ] **Add `React.memo()` to list-rendering components:**
  - [ ] `PresetsSidebarContent` — maps over playlists
  - [ ] `SetlistsSidebar` — maps over playlists
  - [ ] `SynthBackupsSidebar` — maps over backups
  - [ ] `SynthBackupEntriesTable` — renders entry rows
  - [ ] `SetlistEntriesTable` — renders table rows

## Medium Priority

- [ ] **Fix `PresetDatabase` interface duplication** — Declared in both `lib/db/PresetDatabase.ts` and `presetManager.ts:1012`. `browserDatabase.ts` imports from `presetManager.ts` instead of `lib/db/PresetDatabase.ts`. Fix the import to use canonical source.
- [ ] **Reduce props drilling in SynthBackupsPageView** (18+ props) — Use context or composition pattern instead of passing everything through layers.
- [ ] **Reduce props drilling in SetlistsPageView** (16 props) — Same pattern as above.
- [ ] **Deduplicate `getSuggestedKeepIndex`** — Identical in `DuplicateReviewModal.tsx:11` and `DuplicateFinderPage.tsx:23`. Extract to shared utility.
- [ ] **Cache `isAvailable()` in Postgres fallback** — `postgresDatabaseWithFallback.ts` calls `await this.isAvailable()` on every CRUD operation, making a failed network call each time Postgres is down. Cache availability with TTL.
- [ ] **Consolidate SetlistManager / SynthBackupManager** — `setlistManager.ts` and `synthBackupManager.ts` share near-identical serialization/deserialization CRUD patterns. Extract a generic `CollectionManager<T>` base.
- [ ] **Break up `PerformanceMode.tsx`** (448 lines) — Extract `BankNumPad.tsx` for the inline numpad selector modal.
- [ ] **Fix `PresetDetails.tsx` form sync pattern** (lines 60-72) — Replace useEffect syncing form data on preset change with `key` prop forcing remount.
- [ ] **Remove duplicate fingerprint logic in AppSidebar** (lines 89-106) — Uses same fingerprinting as `presetFingerprint.ts`. Import and reuse instead.
- [ ] **Consolidate tag count extraction** — `flatMap(p => p.tags).reduce(...)` pattern appears in `FilterPanel.tsx`, `PresetList.tsx`, `TagManagerPage.tsx`, `PerformanceMode.tsx`. Extract `getTagCounts(presets)` utility.
- [ ] **Consolidate bank/slot select modal** — The "pick slot 1-16 + bank" pattern is reimplemented in `PresetList.tsx` (retrieve), `PresetDetails.tsx` (write), and `SendEntryModal.tsx`. Create reusable `SlotPickerModal.tsx`.
- [ ] **Consolidate export file-save pattern** — Tauri `save()` dialog vs blob download branching repeated in `handleExport` and `handleExportWorkspace`. Extract utility.

## Low Priority

- [ ] **Remove commented-out `RatingCell`** in `PresetList.tsx` (lines 84-135 and 632-642) — ~50 lines of dead commented code.
- [ ] **Remove `syncPresets` no-op** — `presetManager.ts:538-546` reads presets from DB and writes them back unchanged.
- [ ] **Clean up `parsePresetNames` async** — `presetManager.ts:906` — function is `async` but only returns a static import synchronously.
- [ ] **Fix wrong file path in comment** — `fakePresetDatabase.ts:1` says `src/lib/` but file is at `src/lib/db/`.
- [ ] **Remove `RouterProvider` re-export** — `router.tsx:137` re-exports from `@tanstack/react-router`. App.tsx can import directly.
- [ ] **Remove unused `React` type import** — `SetlistsPage.tsx:1` imports `React` only for `React.FC` type annotation.

## Test Coverage

- [ ] **Add interaction tests to form components** — `TextInput.test.tsx`, `TextAreaInput.test.tsx`, `SelectInput.test.tsx`, `FileInput.test.tsx` — zero tests for `onChange`, `onBlur`, validation, or focus behavior.
- [ ] **Add modal accessibility tests** — `Modal.test.tsx` — missing escape key, focus trap, backdrop click tests.
- [ ] **Add Button state tests** — `Button.test.tsx` — missing click handler, disabled, loading, icon-only accessibility.
