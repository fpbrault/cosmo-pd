# cz-explorer Test Plan

## Form Components — Interaction Tests (HIGH)

These form components only test rendering and className assertions — zero interaction testing.

### TextInput.test.tsx (39 lines, 4 tests)
- [ ] **Add `onChange` fires with correct value** — type text, assert callback receives it
- [ ] **Add disabled state** — verify `disabled` attr and no `onChange` on interaction
- [ ] **Add placeholder rendering** — verify placeholder text in DOM
- [ ] **Add ref forwarding** — verify `ref.current` is the `<input>` element
- [ ] **Add error/validation styling** — if an `error` prop exists, test visual indicator

### TextAreaInput.test.tsx (44 lines, 4 tests)
- [ ] **Add `onChange` fires with correct value** — type text, assert callback
- [ ] **Add disabled state** — verify disabled attr
- [ ] **Add placeholder rendering** — verify placeholder text
- [ ] **Add rows/cols attr propagation** — if configurable

### SelectInput.test.tsx (74 lines, 5 tests)
- [ ] **Add `onChange` fires with selected value** — change option, assert callback receives that value
- [ ] **Add disabled state** — verify disabled attr
- [ ] **Add empty options list** — verify graceful rendering with no children
- [ ] **Add `multiple` select behavior** — if supported

### FileInput.test.tsx (43 lines, 4 tests)
- [ ] **Add file selection flow** — mock File, simulate selection, assert `onChange` receives it
- [ ] **Add `accept` attribute** — verify MIME filter is set
- [ ] **Add `multiple` files** — verify multiple file selection
- [ ] **Add disabled state** — verify disabled attr

### FormField.test.tsx (50 lines, 3 tests)
- [ ] **Add required indicator** — if `required` prop adds `*` or `aria-required`
- [ ] **Add error state** — test error message rendering and styling
- [ ] **Add help/description text** — test `helpText` prop rendering
- [ ] **Add hidden label** — if label can be visually hidden but accessible

## UI Components — Interaction Tests (HIGH)

### Button.test.tsx (36 lines, 5 tests)
- [ ] **Add `onClick` callback** — click button, assert callback fires (core missing test)
- [ ] **Add disabled state** — verify button is not clickable when disabled
- [ ] **Add `type` attribute** — verify default is `"button"` (not `"submit"`)
- [ ] **Add loading/spinner state** — if loading prop exists, test spinner rendering and disabled behavior
- [ ] **Add keyboard activation** — Enter/Space keydown triggers `onClick`

### Modal.test.tsx (50 lines, 4 tests)
- [ ] **Add escape key closes modal** — press Escape, assert `onClose` fires
- [ ] **Add `isOpen={false}` renders nothing** — verify content is not in DOM
- [ ] **Add focus trapping** — Tab cycles through modal elements, doesn't escape
- [ ] **Add body scroll lock** — verify `overflow: hidden` on body when open
- [ ] **Add multiple modal stack** — verify z-index or backdrop count

### Modal.browser.test.tsx (77 lines, 7 tests)
- [ ] **Add escape key dismissal** — same as unit test but with real browser event simulation

### CollapsibleCard.test.tsx
- [ ] **Add toggle interaction test** — click header, verify content shows/hides
- [ ] **Add controlled mode test** — if `isOpen` prop controls externally

### KeyValueBlock.test.tsx
- [ ] **Add fragile parentElement traversal** — replace `parentElement?.parentElement` with `data-testid` or `role` queries

## Feature Page Tests (HIGH)

### SetlistsPage.test.tsx (42 lines, 2 tests — 14 callbacks, 0 exercised)
- [ ] **Add selecting a setlist** — click sidebar item, assert `onSelectPlaylist` fires
- [ ] **Add creating a setlist** — type name, click create, assert `onCreatePlaylist` fires
- [ ] **Add renaming a setlist** — right-click/context, rename, assert callback
- [ ] **Add deleting a setlist** — delete action, assert `onDeletePlaylist` fires
- [ ] **Add creating entries** — add preset to setlist, assert callback
- [ ] **Add removing entries** — remove entry, assert `onRemoveEntries` fires
- [ ] **Add empty entries list** — verify message shown when setlist has no entries
- [ ] **Add reordering entries** — drag-and-drop reorder (if supported)
- [ ] **Add quick-send flow** — initiate, step through, stop — assert callbacks

### SetlistsPage.browser.test.tsx (141 lines, 6 tests)
- [ ] **Add setlist creation E2E** — browser-level create → see it in sidebar
- [ ] **Add entry creation E2E** — add a preset → see it in entries table
- [ ] **Add entry removal E2E** — remove entry → it disappears

### SynthBackupsPage.test.tsx (41 lines, 2 tests — worst coverage in project)
- [ ] **Add backup list rendering** — verify backups are displayed
- [ ] **Add backup selection** — click backup, assert `onSelectBackup` fires
- [ ] **Add creating a backup** — click create, assert `onCreateBackup` fires
- [ ] **Add deleting a backup** — delete, assert `onDeleteBackup` fires
- [ ] **Add entry table rendering** — verify entries for selected backup
- [ ] **Add sending entry to synth** — send action, assert `onSendEntry` fires
- [ ] **Add saving entry as preset** — save action, assert callback
- [ ] **Add importing backup** — file import, assert `onImportBackup` fires
- [ ] **Add exporting backup** — export action, assert `onExportBackup` fires
- [ ] **Add progress indicator during backup** — verify loading state while operation runs
- [ ] **Add empty state** — no backups selected message already tested, add no backups at all
- [ ] **Add error handling** — mock a callback to reject, verify error state

### PerformanceMode.test.tsx
- [ ] **Add numpad interaction** — type digits, verify slot selection
- [ ] **Add bank navigation** — next/prev bank, verify current bank changes
- [ ] **Add fullscreen toggle** — enter/exit fullscreen
- [ ] **Add MIDI CC handling** — if CC handler changes preset, verify it works
- [ ] **Add filter tags interaction** — toggle tags, verify preset list filters

## Duplicate Review (Moderate coverage)

### DuplicateReviewModal.test.tsx (157 lines, 3 tests)
- [ ] **Add manual checkbox toggle** — check individual preset, verify delete button enables
- [ ] **Add error handling** — `onDeletePresets` rejects, verify error shown
- [ ] **Add multiple duplicate groups** — groups with different sizes, verify counts
- [ ] **Add `isOpen={false}` renders nothing** — already in browser test, add to unit

### DuplicateReviewModal.browser.test.tsx (233 lines, 9 tests)
- [ ] **Add individual checkbox toggle E2E** — toggle a single checkbox
- [ ] **Add error handling E2E** — make `onDeletePresets` reject, verify UI feedback
- [ ] **Add keyboard navigation** — Tab order through modal

## Presets Page / PresetList

- [ ] **Add search/filter behavior** — type in search, verify rendered list changes
- [ ] **Add preset selection** — click preset, verify `onSelect` fires
- [ ] **Add preset activation/send** — send action, verify callback
- [ ] **Add tag filtering** — toggle tags, verify list filters
- [ ] **Add scroll-to-bottom loading more** — if virtualized, verify more items load on scroll
- [ ] **Add empty search results** — search for nonexistent preset, verify message

## App.tsx (MIDI setup, onboarding modal)

- [ ] **Add onboarding modal appears on first visit** — mock first-visit state, verify modal renders
- [ ] **Add onboarding does not appear on return visit** — mock returning user
- [ ] **Add MIDI port auto-connection** — if MIDI context, verify auto-connect

## SettingsPanel

- [ ] **Add sync toggle** — enable/disable cloud sync, verify state persists
- [ ] **Add workspace export flow** — click export, verify file save
- [ ] **Add workspace import flow** — import file, verify restore
- [ ] **Add factory presets loading** — load factory presets, verify they appear
- [ ] **Add data reset flow** — reset, verify confirmation, then reset executes
- [ ] **Add error handling** — network failure during sync, verify error shown

## Lib Tests

### storage/storage.test.ts (168 lines)
- [ ] **Add `getItem` with corrupted JSON** — store raw string, verify default returned and console.warn called (current code swallows silently)
- [ ] **Add Unicode/special characters** — store/retrieve Unicode strings
- [ ] **Add extremely large values** — test quota handling
- [ ] **Add `null` vs missing key** — verify distinction between null value and absent key

### lib/db/postgresDatabaseWithFallback.ts
- [ ] **Add fallback activates when Postgres unavailable** — mock isAvailable() → false, verify browser DB used
- [ ] **Add fallback deactivates when Postgres recovers** — mock isAvailable() → false then true

### lib/collections/setlistManager.ts
- [ ] **Add legacy migration test** — if old-format data exists, verify it migrates
- [ ] **Add import with merge** — import setlists that overlap existing ones
- [ ] **Add export round-trip** — export → import → verify contents match

### lib/collections/synthBackupManager.ts
- [ ] **Same round-trip tests** — export → import → verify
- [ ] **Add legacy key migration** — `CZ101_SETLISTS` → `SYNTH_BACKUPS`

### lib/midi/czSysexDecoder.test.ts
- [ ] **Add malformed SysEx** — truncated, missing end-byte, invalid framing
- [ ] **Add empty payload** — empty SysEx message
- [ ] **Add maximum-size payload** — test large packets

### lib/presets/presetFingerprint.test.ts
- [ ] **Add collision test** — generate fingerprints for similar-but-different presets, verify no false collisions
- [ ] **Add round-trip consistency** — encode → decode → encode, verify fingerprints match

### lib/presets/presetManager.spec.ts
- [ ] **Add duplicate preset detection** — add duplicate, verify dedup logic fires
- [ ] **Add preset CRUD operations** — create, read, update, delete round-trip
- [ ] **Add factory preset loading** — load factory presets, verify they populate correctly

### auth/onlineAuthSession.test.ts
- [ ] **Add session expiry** — expired session, verify `loadOnlineAuthSession` returns null
- [ ] **Add popup cancellation** — user closes popup without authenticating, verify graceful handling
- [ ] **Add SSR guard** — `typeof window === "undefined"` path

### auth/neonAuthClient.test.ts
- [ ] **Add network failure** — fetch rejects, verify null returned (not throw)
- [ ] **Add malformed session response** — server returns unexpected shape
- [ ] **Add `signInWithNeonProvider` returns URL** — verify redirect URL is well-formed

### sync/remotePresetSyncAdapter.test.ts (169 lines)
- [ ] **Add decryption failure** — `decryptPresetData` throws, verify graceful handling
- [ ] **Add push failure** — `upsert` errors, verify error surface
- [ ] **Add large payload** — push many presets, verify btoa limit isn't hit
- [ ] **Add network retry** — if retry exists, test retry behavior

### sync/onlineSyncSettings.test.ts (26 lines)
- [ ] **Add SSR guard path** — `typeof window === "undefined"` returns defaults
- [ ] **Add corrupted localStorage** — stored as raw string, not valid JSON
- [ ] **Add save/load round-trip** — save settings, reload, verify they match

### backup/workspaceBackup.test.ts (27 lines — severely under-tested)
- [ ] **Add `exportWorkspaceBackup()`** — export, verify envelope shape and sections present
- [ ] **Add `importWorkspaceBackup()`** — import valid backup, verify data restored
- [ ] **Add legacy format import** — old-format backup, verify migration
- [ ] **Add malformed backup** — corrupted JSON, verify error handling
- [ ] **Add version check** — backup with future version, verify graceful handling
- [ ] **Add `parseJsonSafely`** — valid JSON, invalid JSON, raw string edge cases
