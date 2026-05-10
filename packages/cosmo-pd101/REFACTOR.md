# cosmo-pd101 Refactoring Plan

## High Priority

- [ ] **Break up `PresetLibrary.tsx`** (1185 lines, largest file) — Extract:
  - [ ] `PresetLibraryRow.tsx` — individual row rendering
  - [ ] `PresetLibraryToolbar.tsx` — search, filter, sort controls
  - [ ] `PresetDialogs.tsx` — all 5 modal dialogs (rename, delete, metadata, save-as, import)
  - [ ] `hooks/usePresetFilterSort.ts` — sort + filter logic
  - [ ] `hooks/usePresetLibraryKeyboard.ts` — keyboard navigation hook
- [ ] **Break up `StepEnvelopeEditor.tsx`** (710 lines) — Extract:
  - [ ] `lib/envelope/envelopeCanvas.ts` — pure canvas drawing functions (`drawEnvPreview` etc.)
  - [ ] `lib/envelope/envelopeGeometry.ts` — pure math helpers (`buildEnvelopePoints`, `editorStepDuration`, `findClosestPoint`)
  - [ ] `StepEnvelopePreview.tsx` — display-only preview component
  - [ ] `StepEnvelopeEditor.tsx` — editor component (should be leaner)
- [ ] **Break up `PerLineWarpBlock.tsx`** (640 lines, 37 props) — Extract:
  - [ ] `usePerLineWarp.ts` hook — encapsulates algo control binding + voice marker logic (lines 293-513)
  - [ ] Then component becomes mainly JSX composition
- [ ] **Deduplicate custom FX renderers** — `DelayModuleRenderer.tsx`, `PhaseModModuleRenderer.tsx`, `TremoloModuleRenderer.tsx`, `VibratoModuleRenderer.tsx` are ~85% identical (~200 duplicated lines). Extract:
  - [ ] `useFxModuleController.ts` — shared hook for `handlePresetChange`, params extraction, mutation
  - [ ] Each renderer then only needs JSX-specific parts
- [ ] **Replace IIFEs in `GenericFxSlotModule.tsx`** (lines 195-308) — ~105 lines of control rendering inside two IIFEs. Extract:
  - [ ] `KnobControlRenderer.tsx` — knob branch (~35 lines)
  - [ ] `ButtonGroupControlRenderer.tsx` — button group branch (~70 lines)
- [ ] **Fix unsafe type assertions on FX slot params** — Present in `GenericFxSlotModule.tsx:128` and all 4 custom renderers. `(rawSlot as { params: Record<string, unknown> }).params` eliminates type safety. Add a proper type guard function.

## Medium Priority

- [ ] **Memoize `FxSlotFrame` context value** — `FxSlotFrame.tsx:308-317` creates a new context object every render. Wrap in `useMemo`.
- [ ] **Optimize LFO RAF loop** — `LFOModule.tsx:163-176` — 60fps `requestAnimationFrame` calls `setPlayheadPhase` every frame, causing 60 re-renders/sec. Use `ref` + direct canvas manipulation instead.
- [ ] **Fix derived state antipattern in SynthRenderer** — `SynthRenderer.tsx:222-236` — `activeDrawerPanel` is state + useEffect sync. Should be derived directly from `mainPanelMode`.
- [ ] **Break up `useSynthPresetManager.ts`** (871 lines) — Extract:
  - [ ] `lib/synth/presetDiff.ts` — `collectPresetDiffs()` deep-diff utility (lines 200-267)
  - [ ] `lib/synth/presetTagMappings.ts` — `PRESET_TAG_MAPPINGS` constants (lines 106-133)
  - [ ] `hooks/usePresetNavigation.ts` — keyboard step navigation
  - [ ] `hooks/usePresetPersistence.ts` — save/load/import/export
- [ ] **Create batch param hooks for PhaseLinesSection** — Replace 33 individual `useSynthParam()` calls (`PhaseLinesSection.tsx:32-85`) with `useLineParams(lineIndex: 1 | 2)` that returns grouped config from a single store selector.
- [ ] **Remove `useSynthState.ts` shim** — Just calls `useSynthStore()`. Migrate all consumers to `useSynthStore` directly and delete file.
- [ ] **Fix `useFxSlotContext()` inconsistency** — `FxSlotContext.ts:22-24` returns `null` instead of throwing (unlike every other context in the codebase). Follow established pattern: `useFxSlotContext()` (throws) + `useOptionalFxSlotContext()` (returns `null`).
- [ ] **Document `getParam()` reactivity** — `SynthParamController.tsx:163` — `useSynthStore.getState()` returns latest value but does NOT subscribe. Rename to `getParamSnapshot()` to make clear it's for imperative use only.
- [ ] **Fix filename typo** — Rename `ModEnveloppeModule.tsx` to `ModEnvelopeModule.tsx` and update all imports.

## Low Priority

- [ ] **Make default columns data-driven** — `GenericFxSlotModule.tsx:130` — magic number `4` fallback for `config.columns`. Derive from number of controls or make required.
- [ ] **Fix fragile `sourceIndex`** — `fxSlotModuleConfig.ts:450` — `Array.indexOf(ctrl)` on flatMapped iterable — breaks if controls are mapped/filtered first.
- [ ] **Remove empty `<div>` for grid spacing** — `LFOModule.tsx:352` — `className="col-span-4 h-0"` is a layout hack. Use CSS `column-end` or explicit grid row endings.
- [ ] **Add throttle to canvas repaints** — `StepEnvelopeEditor.tsx:352` — `useEffect` redraws canvas on every dependency change. Consider RAF-coalescing.
- [ ] **Extract game keyboard handling** — `ScopeVisualizationDisplay.tsx:79-118` — game keyboard handling for asteroids/travel modes embedded in scope component. Extract `useGameKeys()` hook.
- [ ] **Add `FnSlotTuple` constant** — `synthStore.ts:88-95` — `FxSlotTuple` fixed at 6 elements. Extract `SLOT_COUNT = 6` and use mapped tuple type.
- [ ] **Add `displayName` to dynamic FX slot panels** — `FxSlotPanel.tsx:9` — `Object.assign` on function component loses DevTools name.
- [ ] **Add comment on history optimization** — `PerformanceMonitor.tsx:129-136` — returning `current` (same ref) from functional updater is correct but unusual.
- [ ] **Move `collectPresetDiffs` to lib** — Pure utility with no React dependencies, currently in `useSynthPresetManager.ts:200-267`.

## Test Coverage

- [ ] **Add unit tests for extracted `presetDiff.ts`** — Test deep-diff utility in isolation.
- [ ] **Add unit tests for extracted `envelopeGeometry.ts`** — Math helpers are pure and easily testable.
