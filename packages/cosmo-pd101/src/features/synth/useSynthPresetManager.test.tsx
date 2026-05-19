import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { createPresetId } from "@/lib/synth/presetIdentity";
import {
	DEFAULT_PRESET,
	loadCurrentPresetSession,
	loadCurrentState,
	loadStoredPreset,
	saveCurrentPresetSession,
	saveCurrentState,
	saveStoredPreset,
} from "@/lib/synth/presetStorage";
import type { FrontendPresetV1 } from "@/lib/synth/presetTypes";
import { useSynthPresetManager } from "./useSynthPresetManager";

const clonePreset = (): SynthPresetV1 =>
	JSON.parse(JSON.stringify(DEFAULT_PRESET)) as SynthPresetV1;

const makePreset = (volume: number): SynthPresetV1 => {
	const preset = clonePreset();
	preset.params.volume = volume;
	return preset;
};

describe.skip("useSynthPresetManager", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("hydrates saved current state and preset session on mount", () => {
		const savedState = makePreset(0.33);
		let currentState = savedState;
		const applyPreset = vi.fn((preset: SynthPresetV1) => {
			currentState = preset;
		});

		const zulu = saveStoredPreset({ name: "Zulu", data: makePreset(0.8) });
		const alpha = saveStoredPreset({ name: "Alpha", data: makePreset(0.2) });
		saveCurrentState(savedState);
		saveCurrentPresetSession({
			activePresetId: createPresetId({
				name: "Factory Brass",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: makePreset(0.7),
			}),
			activePresetNameBase: "Factory Brass",
			loadedPresetFingerprint: JSON.stringify(savedState),
		});

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: makeBuiltinPresets({
					"Init Bass": makePreset(0.5),
					"Factory Brass": makePreset(0.7),
				}),
				gatherState: () => currentState,
				applyPreset,
			}),
		);

		expect(applyPreset).toHaveBeenCalledWith(savedState);
		expect(result.current.activePresetId).toBe(
			createPresetId({
				name: "Factory Brass",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: makePreset(0.7),
			}),
		);
		expect(result.current.activePresetName).toBe("Factory Brass");
		expect(result.current.allPresetEntries.map((entry) => entry.id)).toEqual([
			createPresetId({
				name: "Factory Brass",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: makePreset(0.7),
			}),
			createPresetId({
				name: "Init Bass",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: makePreset(0.5),
			}),
			alpha.id,
			zulu.id,
		]);
	});

	it("skips preset session hydration when current state hydration is disabled", () => {
		const savedState = makePreset(0.33);
		let currentState = clonePreset();
		const applyPreset = vi.fn((preset: SynthPresetV1) => {
			currentState = preset;
		});

		saveCurrentState(savedState);
		saveCurrentPresetSession({
			activePresetId: createPresetId({
				name: "Factory Brass",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: makePreset(0.7),
			}),
			activePresetNameBase: "Factory Brass",
			loadedPresetFingerprint: JSON.stringify(savedState),
		});

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: makeBuiltinPresets({
					"Factory Brass": makePreset(0.7),
					Beta: makePreset(0.9),
				}),
				gatherState: () => currentState,
				applyPreset,
				shouldLoadCurrentState: () => false,
			}),
		);

		expect(applyPreset).not.toHaveBeenCalled();
		expect(result.current.activePresetId).toBeNull();
		expect(result.current.activePresetName).toBe("Current State");

		act(() => {
			result.current.handleLoadBuiltin("Beta");
		});

		expect(result.current.pendingPresetChange).toBeNull();
		expect(result.current.activePresetId).toBe(
			createPresetId({
				name: "Beta",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: makePreset(0.9),
			}),
		);
		expect(result.current.activePresetName).toBe("Beta");
	});

	it("queues pending navigation when switching presets with unsaved changes", () => {
		const alphaPreset = makePreset(0.1);
		const betaPreset = makePreset(0.9);
		let currentState = clonePreset();
		const applyPreset = vi.fn((preset: SynthPresetV1) => {
			currentState = preset;
		});

		const { result, rerender } = renderHook(
			({ presetStateKey }: { presetStateKey: string }) =>
				useSynthPresetManager({
					builtinPresets: makeBuiltinPresets({
						Alpha: alphaPreset,
						Beta: betaPreset,
					}),
					gatherState: () => currentState,
					applyPreset,
					presetStateKey,
				}),
			{ initialProps: { presetStateKey: JSON.stringify(currentState) } },
		);

		act(() => {
			result.current.handleLoadBuiltin("Alpha");
		});

		const editedState = makePreset(0.45);
		currentState = editedState;
		rerender({ presetStateKey: JSON.stringify(editedState) });

		act(() => {
			result.current.handleLoadBuiltin("Beta");
		});

		expect(applyPreset).toHaveBeenCalledTimes(1);
		expect(result.current.activePresetId).toBe(
			createPresetId({
				name: "Alpha",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: alphaPreset,
			}),
		);
		expect(result.current.activePresetName).toBe("Alpha *");
		expect(result.current.pendingPresetChange).toEqual(
			expect.objectContaining({
				activePresetName: "Alpha",
				activeLocalName: null,
				suggestedName: "Alpha",
			}),
		);
		expect(result.current.pendingPresetChange?.changes.length).toBeGreaterThan(
			0,
		);
	});

	it("saves the active local preset before completing a pending navigation", () => {
		const localPreset = makePreset(0.25);
		const editedLocalPreset = makePreset(0.6);
		const betaPreset = makePreset(0.85);
		let currentState = clonePreset();
		const applyPreset = vi.fn((preset: SynthPresetV1) => {
			currentState = preset;
		});

		const mine = saveStoredPreset({ name: "Mine", data: localPreset });

		const { result, rerender } = renderHook(
			({ presetStateKey }: { presetStateKey: string }) =>
				useSynthPresetManager({
					builtinPresets: makeBuiltinPresets({
						Beta: betaPreset,
					}),
					gatherState: () => currentState,
					applyPreset,
					presetStateKey,
				}),
			{ initialProps: { presetStateKey: JSON.stringify(currentState) } },
		);

		act(() => {
			result.current.handleLoadLocal(mine.id);
		});

		currentState = editedLocalPreset;
		rerender({ presetStateKey: JSON.stringify(editedLocalPreset) });

		act(() => {
			result.current.handleLoadBuiltin("Beta");
		});

		act(() => {
			result.current.handleSavePendingPresetChange();
		});
		rerender({ presetStateKey: JSON.stringify(currentState) });

		expect(loadStoredPreset(mine.id)?.data).toEqual(editedLocalPreset);
		expect(result.current.pendingPresetChange).toBeNull();
		expect(result.current.activePresetId).toBe(
			createPresetId({
				name: "Beta",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: betaPreset,
			}),
		);
		expect(result.current.activePresetName).toBe("Beta");
		expect(applyPreset).toHaveBeenLastCalledWith(betaPreset);
	});

	it("persists current state and preset session after the debounce", () => {
		vi.useFakeTimers();

		const alphaPreset = makePreset(0.2);
		const editedAlpha = makePreset(0.51);
		let currentState = clonePreset();
		const applyPreset = vi.fn((preset: SynthPresetV1) => {
			currentState = preset;
		});

		const { result, rerender } = renderHook(
			({ presetStateKey }: { presetStateKey: string }) =>
				useSynthPresetManager({
					builtinPresets: makeBuiltinPresets({
						Alpha: alphaPreset,
					}),
					gatherState: () => currentState,
					applyPreset,
					presetStateKey,
				}),
			{ initialProps: { presetStateKey: JSON.stringify(currentState) } },
		);

		act(() => {
			result.current.handleLoadBuiltin("Alpha");
		});

		currentState = editedAlpha;
		rerender({ presetStateKey: JSON.stringify(editedAlpha) });

		act(() => {
			vi.runAllTimers();
		});

		expect(loadCurrentState()).toEqual(editedAlpha);
		expect(loadCurrentPresetSession()).toEqual({
			activePresetId: createPresetId({
				name: "Alpha",
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				tags: [],
				data: alphaPreset,
			}),
			activePresetNameBase: "Alpha",
			loadedPresetFingerprint: JSON.stringify(alphaPreset),
		});
	});
});

const makeBuiltinPresets = (
	presets: Record<string, SynthPresetV1>,
): Record<string, FrontendPresetV1> =>
	Object.fromEntries(
		Object.entries(presets).map(([name, data]) => [
			name,
			{
				id: createPresetId({
					name,
					source: "built-in",
					author: "Purr Audio",
					starred: false,
					tags: [],
					data,
				}),
				name,
				source: "built-in",
				author: "Purr Audio",
				starred: false,
				data,
				tags: [],
			},
		]),
	);
