# cosmo-pd101 Test Plan

## PresetLibrary.test.tsx (263 lines, 10 tests — best coverage in project)

### Filter/Search (missing entirely)
- [ ] **Add search filtering** — type in search box, verify list filters to matching entries
- [ ] **Add category/tag filtering** — click category filter, verify list changes
- [ ] **Add `showLibraryPresets` toggle** — toggle visibility of library presets, verify `onToggleLibraryPresets` fires

### Metadata operations (missing)
- [ ] **Add star/unstar preset** — click star, verify `onSetPresetFavorite` fires with correct value
- [ ] **Add category change** — change category dropdown, verify `onSetPresetCategory` fires
- [ ] **Add tag change** — add/remove tags, verify `onSetPresetTags` fires

### Export (missing)
- [ ] **Add single preset export** — export one preset, verify `onExportPreset` fires with data

### Pending changes (missing)
- [ ] **Add save pending** — `onSavePendingPresetChange` fires on save
- [ ] **Add discard pending** — `onDiscardPendingPresetChange` fires on discard
- [ ] **Add cancel pending** — `onCancelPendingPresetChange` fires on cancel

### Edge cases
- [ ] **Add empty library** — `allEntries` is empty, verify empty state
- [ ] **Add import with invalid JSON** — paste bad data, verify error shown
- [ ] **Add error on save failure** — mock save to reject, verify error state
- [ ] **Add keyboard navigation edge cases** — Home/End at boundaries, Shift+arrow

### Cleanup
- [ ] **Replace `fireEvent` with `userEvent`** — all tests use `fireEvent` (lower fidelity), migrate to `@testing-library/user-event`

## KnobView.test.tsx (66 lines, 5 tests)

### Interaction (missing)
- [ ] **Add mouse drag changes value** — mousedown → mousemove → mouseup, verify `onChange` fires with value
- [ ] **Add keyboard interaction** — ArrowUp/ArrowDown/PgUp/PgDn/Home/End, verify value changes
- [ ] **Add `aria` attributes** — verify `role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [ ] **Add value clamping** — drag beyond min/max, verify value is clamped
- [ ] **Add focus/blur visual state** — tab to knob, verify focus ring/outline
- [ ] **Add double-click reset** — double-click returns to default value
- [ ] **Add disabled state** — knob is not interactive when disabled

### Fragile selectors
- [ ] **Replace SVG querySelector with role tests** — current tests use `container.querySelector("path[stroke=...]")`. Switch to `getByRole` or `data-testid` for SVG elements.

## ModulatableControl.test.tsx (121 lines, 2 tests — heavy mocking)

### Reduce mock dependency
- [ ] **Add test with real children** — render a real inner control, verify it's visible
- [ ] **Add empty route list visual** — 0 active routes, verify icon shows "no routes" state
- [ ] **Add icon button click with routes** — click with routes present, verify menu opens
- [ ] **Add icon button click without routes** — click without routes, verify behavior is different
- [ ] **Add multiple open/close cycles** — open → close → reopen, verify state resets
- [ ] **Add unmount cleanup** — unmount while menu is open, verify no crash

## ModulationMenu.test.tsx (102 lines, 3 tests)

### Missing scenarios
- [ ] **Add empty routes visual** — empty array, verify "no routes" message rendered
- [ ] **Add maximum routes** — try to add beyond limit, verify enforcement
- [ ] **Add disabled route visual** — toggled-off route, verify visual difference
- [ ] **Add amount change via slider** — simulate slider drag (not just keyboard)
- [ ] **Add negative amount display** — negative value rendering verified
- [ ] **Add keyboard navigation** — Tab order through routes, focus management
- [ ] **Add route with duplicate source** — add same source twice, verify behavior

### Fixes
- [ ] **Replace `fireEvent` with `userEvent`** — `getAllByRole("spinbutton")` fragile, use `userEvent.tab()` etc.

## StepEnvelopeEditor.test.tsx

- [ ] **Add drag point to new position** — grab envelope point, drag, verify shape changes
- [ ] **Add click to add point** — click on envelope, verify new point created
- [ ] **Add double-click to remove point** — double-click existing point, verify removed
- [ ] **Add step level slider** — drag step level, verify value changes
- [ ] **Add step duration slider** — drag step duration, verify value changes
- [ ] **Add keyboard navigation** — Tab through steps, arrow keys adjust values
- [ ] **Add undo/redo** — if supported
- [ ] **Add canvas preview matching editor** — editor changes reflected in preview

## PerLineWarpBlock.test.tsx

- [ ] **Add algo dropdown selection** — select algorithm, verify `onAlgoChange` fires
- [ ] **Add line parameter change** — adjust warp amount, verify callback fires
- [ ] **Add waveform selection** — select base waveform, verify callback
- [ ] **Add voice marker toggle** — toggle voice marker, verify callback
- [ ] **Add envelope editing** — drag envelope point, verify value updates

## PhaseLinesSection.test.tsx

- [ ] **Add parameter change via individual control** — change one of 33 params, verify store updates
- [ ] **Add line 1 vs line 2 distinction** — verify line 1 controls affect line 1 params only
- [ ] **Add modulation indicator** — if a param is modulated, verify indicator

## GenericFxSlotModule.test.tsx

- [ ] **Add knob interaction** — turn knob, verify param value changes
- [ ] **Add button group selection** — click button option, verify selection
- [ ] **Add preset load** — load module preset, verify params update
- [ ] **Add enable/disable toggle** — toggle the module on/off, verify behavior
- [ ] **Add control layout grid** — verify controls render in correct columns

## Custom FX Renderer Tests (DelayModuleRenderer, VibratoModuleRenderer, etc.)

- [ ] **Add shared test suite** — create `useFxModuleController` hook, then test it once
- [ ] **Add per-renderer visual test** — each renderer renders its unique controls
- [ ] **Add preset load flow** — click preset, verify all params update
- [ ] **Add enable/disable toggle** — toggle FX on/off

## FxSlotFrame.test.tsx

- [ ] **Add context value stability** — render with state change that doesn't change context, verify children don't re-render
- [ ] **Add slot type selection** — change FX type, verify slot updates
- [ ] **Add drag-and-drop reorder** — if supported

## LFOModule.test.tsx

- [ ] **Add RAF loop cleanup on unmount** — render, unmount, verify `cancelAnimationFrame` was called
- [ ] **Add rate change updates playhead speed** — change rate, verify visual changes
- [ ] **Add waveform selection** — change LFO waveform, verify visual

## SynthRenderer.test.tsx

- [ ] **Add panel switching** — switch panels, verify correct panel renders
- [ ] **Add drawer open/close** — open drawer panel, verify it renders
- [ ] **Add derived state correctness** — `activeDrawerPanel` matches `mainPanelMode`

## useSynthPresetManager tests

- [ ] **Add `collectPresetDiffs`** — compare two presets, verify diff is accurate
- [ ] **Add pending change detection** — modify a param, verify pending change is detected
- [ ] **Add save/load round-trip** — save preset state, load it back, verify matches

## PerformanceMonitor.test.tsx

- [ ] **Add metrics rendering** — feed mock metrics, verify they display
- [ ] **Add history accumulation** — feed multiple samples, verify history grows
- [ ] **Add history max size** — feed 200+ samples, verify it caps at 120

## ScopeVisualizationDisplay tests

- [ ] **Add rendering for each visualization type** — asteroids, travel, orbital, spectrogram, waterfall
- [ ] **Add game keyboard handling** — arrow keys in asteroids mode, verify movement
- [ ] **Add audio data flow** — provide audio buffer, verify visualization updates
- [ ] **Add resize handling** — resize container, verify visualization adapts
