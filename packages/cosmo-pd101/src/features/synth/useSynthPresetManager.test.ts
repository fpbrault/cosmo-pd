import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import * as presetStorage from "@/lib/synth/presetStorage";
import type { FrontendPresetV1 } from "@/lib/synth/presetTypes";
import { useSynthPresetManager } from "./useSynthPresetManager";

vi.mock("@/lib/synth/presetStorage", () => ({
	DEFAULT_PRESET: {} as SynthPresetV1,
	deletePreset: vi.fn(),
	exportPreset: vi.fn(),
	importPreset: vi.fn(),
	listPresetFavorites: vi.fn(),
	listStoredPresets: vi.fn(),
	loadCurrentPresetSession: vi.fn(),
	loadCurrentState: vi.fn(),
	loadPreset: vi.fn(),
	loadStoredPreset: vi.fn(),
	renamePreset: vi.fn(),
	saveCurrentPresetSession: vi.fn(),
	saveCurrentState: vi.fn(),
	saveStoredPreset: vi.fn(),
	setPresetFavorite: vi.fn(),
	updatePresetMetadata: vi.fn(),
}));

describe("useSynthPresetManager", () => {
	const mockBuiltinPresets: Record<string, FrontendPresetV1> = {
		"Preset 1": {
			id: "preset-1",
			name: "Preset 1",
			source: "cosmo-factory",
			author: "Purr Audio",
			starred: true,
			data: {} as SynthPresetV1,
			tags: [],
		},
		"Preset 2": {
			id: "preset-2",
			name: "Preset 2",
			source: "cosmo-factory",
			author: "Purr Audio",
			starred: false,
			data: {} as SynthPresetV1,
			tags: ["bass"],
		},
	};

	const mockGatherState = vi.fn((): SynthPresetV1 => ({}) as SynthPresetV1);
	const mockApplyPreset = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(presetStorage.listStoredPresets).mockReturnValue([]);
		vi.mocked(presetStorage.listPresetFavorites).mockReturnValue([]);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
				shouldLoadCurrentState: () => false,
			}),
		);

		expect(result.current.activePresetNameBase).toBe("Current State");
		expect(result.current.allPresetEntries.length).toBe(2);
		expect(result.current.visiblePresetEntries.length).toBe(2);
	});

	it("loads persisted state if available", () => {
		vi.mocked(presetStorage.loadCurrentState).mockReturnValue({
			some: "persisted",
		} as unknown as SynthPresetV1);
		vi.mocked(presetStorage.loadCurrentPresetSession).mockReturnValue({
			activePresetId: "local-preset",
			activePresetNameBase: "MyPreset",
			loadedPresetFingerprint: JSON.stringify({ some: "persisted" }),
		});

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
			}),
		);

		expect(mockApplyPreset).toHaveBeenCalledWith({ some: "persisted" });
		expect(result.current.activePresetId).toBe("local-preset");
		expect(result.current.activePresetNameBase).toBe("MyPreset");
	});

	it("handles loading a local preset", () => {
		vi.mocked(presetStorage.loadStoredPreset).mockReturnValue({
			id: "local-preset",
			name: "MyLocalPreset",
			source: "user",
			author: "",
			starred: false,
			data: { some: "local-data" } as unknown as SynthPresetV1,
			tags: [],
		});

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
			}),
		);

		act(() => {
			result.current.handleLoadLocal("local-preset");
		});

		expect(mockApplyPreset).toHaveBeenCalledWith({ some: "local-data" });
		expect(result.current.activePresetId).toBe("local-preset");
		expect(result.current.activePresetNameBase).toBe("MyLocalPreset");
	});

	it("handles loading a builtin preset", () => {
		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
			}),
		);

		act(() => {
			result.current.handleLoadBuiltin("Preset 1");
		});

		expect(mockApplyPreset).toHaveBeenCalledWith(
			mockBuiltinPresets["Preset 1"].data,
		);
		expect(result.current.activePresetId).toBe("preset-1");
		expect(result.current.activePresetNameBase).toBe("Preset 1");
	});

	it("detects unsaved changes", () => {
		vi.mocked(presetStorage.loadCurrentPresetSession).mockReturnValue({
			activePresetId: "local-preset",
			activePresetNameBase: "MyPreset",
			loadedPresetFingerprint: JSON.stringify({ a: 1 }),
		});
		mockGatherState.mockReturnValue({ a: 2 } as unknown as SynthPresetV1);

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
			}),
		);

		expect(result.current.activePresetName).toBe("MyPreset *");
	});

	it("handles pending preset change flow", () => {
		vi.mocked(presetStorage.loadCurrentPresetSession).mockReturnValue({
			activePresetId: "local-preset",
			activePresetNameBase: "MyPreset",
			loadedPresetFingerprint: JSON.stringify({ a: 1 }),
		});
		mockGatherState.mockReturnValue({ a: 2 } as unknown as SynthPresetV1);

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
			}),
		);

		act(() => {
			result.current.handleLoadBuiltin("Preset 1");
		});

		expect(result.current.pendingPresetChange).not.toBeNull();
		expect(result.current.pendingPresetChange?.changes[0].path).toBe("a");

		act(() => {
			result.current.handleDiscardPendingPresetChange();
		});

		expect(result.current.pendingPresetChange).toBeNull();
	});

	it("saves a preset", () => {
		vi.mocked(presetStorage.saveStoredPreset).mockReturnValue({
			id: "saved-preset",
			name: "NewPreset",
			source: "user",
			author: "",
			starred: false,
			data: {} as SynthPresetV1,
			tags: [],
		});

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
			}),
		);

		act(() => {
			result.current.handleSavePreset("NewPreset");
		});

		expect(presetStorage.saveStoredPreset).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "NewPreset",
				source: "user",
			}),
		);
	});
});
