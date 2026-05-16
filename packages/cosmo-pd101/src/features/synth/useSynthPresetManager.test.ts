import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import * as presetStorage from "@/lib/synth/presetStorage";
import { useSynthPresetManager } from "./useSynthPresetManager";

vi.mock("@/lib/synth/presetStorage", () => ({
	DEFAULT_PRESET: {} as SynthPresetV1,
	deletePreset: vi.fn(),
	exportPreset: vi.fn(),
	getPresetMetadata: vi.fn(),
	importPreset: vi.fn(),
	listPresets: vi.fn(),
	loadCurrentPresetSession: vi.fn(),
	loadCurrentState: vi.fn(),
	loadPreset: vi.fn(),
	loadShowLibraryPresets: vi.fn(),
	renamePreset: vi.fn(),
	saveCurrentPresetSession: vi.fn(),
	saveCurrentState: vi.fn(),
	savePreset: vi.fn(),
	saveShowLibraryPresets: vi.fn(),
	updatePresetMetadata: vi.fn(),
}));

describe("useSynthPresetManager", () => {
	const mockBuiltinPresets: Record<
		string,
		{ data: SynthPresetV1; favorite: boolean; category: string; tags: string[] }
	> = {
		"Preset 1": {
			data: {} as SynthPresetV1,
			favorite: false,
			category: "Synth",
			tags: [],
		},
		"Preset 2": {
			data: {} as SynthPresetV1,
			favorite: true,
			category: "Bass",
			tags: ["bass"],
		},
	};

	const mockGatherState = vi.fn((): SynthPresetV1 => ({}) as SynthPresetV1);
	const mockApplyPreset = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(presetStorage.listPresets).mockReturnValue([]);
		vi.mocked(presetStorage.getPresetMetadata).mockReturnValue({
			favorite: false,
			category: "",
			tags: [],
		});
		vi.mocked(presetStorage.loadShowLibraryPresets).mockReturnValue(false);
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
		expect(result.current.showLibraryPresets).toBe(false);
		expect(result.current.allPresetEntries.length).toBe(2);
	});

	it("loads persisted state if available", () => {
		vi.mocked(presetStorage.loadCurrentState).mockReturnValue({
			some: "persisted",
		} as unknown as SynthPresetV1);
		vi.mocked(presetStorage.loadCurrentPresetSession).mockReturnValue({
			activePresetId: "local:MyPreset",
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
		expect(result.current.activePresetId).toBe("local:MyPreset");
		expect(result.current.activePresetNameBase).toBe("MyPreset");
	});

	it("handles loading a local preset", () => {
		vi.mocked(presetStorage.loadPreset).mockReturnValue({
			some: "local-data",
		} as unknown as SynthPresetV1);

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
			}),
		);

		act(() => {
			result.current.handleLoadLocal("MyLocalPreset");
		});

		expect(mockApplyPreset).toHaveBeenCalledWith({ some: "local-data" });
		expect(result.current.activePresetId).toBe("local:MyLocalPreset");
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
		expect(result.current.activePresetId).toBe("builtin:Preset 1");
		expect(result.current.activePresetNameBase).toBe("Preset 1");
	});

	it("detects unsaved changes", () => {
		vi.mocked(presetStorage.loadCurrentPresetSession).mockReturnValue({
			activePresetId: "local:MyPreset",
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
			activePresetId: "local:MyPreset",
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
			result.current.handleLoadLocal("AnotherPreset");
		});

		expect(result.current.pendingPresetChange).not.toBeNull();
		expect(result.current.pendingPresetChange?.changes[0].path).toBe("a");

		act(() => {
			result.current.handleDiscardPendingPresetChange();
		});

		expect(result.current.pendingPresetChange).toBeNull();
	});

	it("saves a preset", () => {
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

		expect(presetStorage.savePreset).toHaveBeenCalledWith(
			"NewPreset",
			mockGatherState(),
			expect.any(Object),
		);
	});

	it("toggles library presets", () => {
		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherState: mockGatherState,
				applyPreset: mockApplyPreset,
			}),
		);

		act(() => {
			result.current.handleToggleLibraryPresets();
		});

		expect(result.current.showLibraryPresets).toBe(true);
		expect(presetStorage.saveShowLibraryPresets).toHaveBeenCalledWith(true);
	});
});
