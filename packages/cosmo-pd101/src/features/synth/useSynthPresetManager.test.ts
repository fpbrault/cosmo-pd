import { act, renderHook, waitFor } from "@testing-library/react";
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

	const mockGatherPresetState = vi.fn(
		(): SynthPresetV1 => ({}) as SynthPresetV1,
	);
	const mockApplyPreset = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
		mockGatherPresetState.mockReturnValue({} as SynthPresetV1);
		vi.mocked(presetStorage.listStoredPresets).mockResolvedValue([]);
		vi.mocked(presetStorage.listPresetFavorites).mockResolvedValue([]);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		expect(result.current.activePresetNameBase).toBe("Current State");
		expect(result.current.allPresetEntries.length).toBe(2);
		expect(result.current.visiblePresetEntries.length).toBe(2);
	});

	it("loads persisted state if available", async () => {
		vi.mocked(presetStorage.loadCurrentState).mockResolvedValue({
			some: "persisted",
		} as unknown as SynthPresetV1);
		vi.mocked(presetStorage.loadCurrentPresetSession).mockResolvedValue({
			activePresetId: "local-preset",
			activePresetNameBase: "MyPreset",
			loadedPresetFingerprint: JSON.stringify({ some: "persisted" }),
		});

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		await waitFor(() => {
			expect(mockApplyPreset).toHaveBeenCalledWith({ some: "persisted" });
		});
		expect(result.current.activePresetId).toBe("local-preset");
		expect(result.current.activePresetNameBase).toBe("MyPreset");
	});

	it("handles loading a local preset", async () => {
		vi.mocked(presetStorage.loadStoredPreset).mockResolvedValue({
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
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		await act(async () => {
			await result.current.handleLoadLocal("local-preset");
		});

		expect(mockApplyPreset).toHaveBeenCalledWith({ some: "local-data" });
		expect(result.current.activePresetId).toBe("local-preset");
		expect(result.current.activePresetNameBase).toBe("MyLocalPreset");
	});

	it("handles loading a builtin preset", () => {
		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherPresetState: mockGatherPresetState,
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

	it("detects unsaved changes", async () => {
		vi.mocked(presetStorage.loadCurrentPresetSession).mockResolvedValue({
			activePresetId: "local-preset",
			activePresetNameBase: "MyPreset",
			loadedPresetFingerprint: JSON.stringify({ a: 1 }),
		});
		mockGatherPresetState.mockReturnValue({ a: 2 } as unknown as SynthPresetV1);

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		await waitFor(() => {
			expect(result.current.activePresetName).toBe("MyPreset *");
		});
	});

	it("handles pending preset change flow", async () => {
		vi.mocked(presetStorage.loadCurrentPresetSession).mockResolvedValue({
			activePresetId: "local-preset",
			activePresetNameBase: "MyPreset",
			loadedPresetFingerprint: JSON.stringify({ a: 1 }),
		});
		mockGatherPresetState.mockReturnValue({ a: 2 } as unknown as SynthPresetV1);

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		await waitFor(() => {
			expect(result.current.activePresetName).toBe("MyPreset *");
		});

		act(() => {
			result.current.handleLoadBuiltin("Preset 1");
		});

		expect(result.current.pendingPresetChange).not.toBeNull();
		expect(result.current.pendingPresetChange?.changes[0].path).toBe("a");

		await act(async () => {
			await result.current.handleDiscardPendingPresetChange();
		});

		expect(result.current.pendingPresetChange).toBeNull();
	});

	it("saves a preset", async () => {
		vi.mocked(presetStorage.saveStoredPreset).mockResolvedValue({
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
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		await act(async () => {
			await result.current.handleSavePreset("NewPreset");
		});

		expect(presetStorage.saveStoredPreset).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "NewPreset",
				source: "user",
			}),
		);
	});

	it("handles empty builtins without crashing", () => {
		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: {},
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		expect(result.current.allPresetEntries).toEqual([]);
		expect(result.current.visiblePresetEntries).toEqual([]);
	});

	it("sorts duplicate names deterministically by id", async () => {
		vi.mocked(presetStorage.listStoredPresets).mockResolvedValue([
			{
				id: "z-2",
				name: "Dup",
				source: "user",
				author: "",
				starred: false,
				data: {} as SynthPresetV1,
				tags: [],
			},
			{
				id: "a-1",
				name: "Dup",
				source: "user",
				author: "",
				starred: false,
				data: {} as SynthPresetV1,
				tags: [],
			},
		]);

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: {},
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		await waitFor(() => {
			expect(result.current.allPresetEntries.length).toBe(2);
		});
		expect(result.current.allPresetEntries.map((entry) => entry.id)).toEqual([
			"a-1",
			"z-2",
		]);
	});

	it("toggles favorites through storage API", async () => {
		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: mockBuiltinPresets,
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		await act(async () => {
			await result.current.handleSetPresetFavorite("preset-1", true);
		});
		expect(presetStorage.setPresetFavorite).toHaveBeenCalledWith(
			"preset-1",
			true,
		);
		expect(presetStorage.listPresetFavorites).toHaveBeenCalled();
	});

	it("imports a preset and disambiguates duplicate names", async () => {
		vi.mocked(presetStorage.listStoredPresets).mockResolvedValue([
			{
				id: "id-1",
				name: "Imported Name",
				source: "user",
				author: "",
				starred: false,
				data: {} as SynthPresetV1,
				tags: [],
			},
		]);
		vi.mocked(presetStorage.importPreset).mockResolvedValue({
			id: "x",
			name: "Imported Name",
			source: "user",
			author: "A",
			starred: false,
			data: { imported: true } as unknown as SynthPresetV1,
			tags: ["bass"],
		});
		vi.mocked(presetStorage.saveStoredPreset).mockResolvedValue({
			id: "id-2",
			name: "Imported Name 2",
			source: "user",
			author: "A",
			starred: false,
			data: { imported: true } as unknown as SynthPresetV1,
			tags: ["bass"],
		});

		const { result } = renderHook(() =>
			useSynthPresetManager({
				builtinPresets: {},
				gatherPresetState: mockGatherPresetState,
				applyPreset: mockApplyPreset,
			}),
		);

		await waitFor(() => {
			expect(presetStorage.listStoredPresets).toHaveBeenCalled();
		});

		await act(async () => {
			await result.current.handleImportPreset("{}", "Imported Name");
		});

		expect(presetStorage.importPreset).toHaveBeenCalledWith("{}");
		expect(presetStorage.saveStoredPreset).toHaveBeenCalledWith(
			expect.objectContaining({ name: "Imported Name 2", source: "user" }),
		);
		expect(mockApplyPreset).toHaveBeenCalledWith({ imported: true });
		expect(result.current.activePresetNameBase).toBe("Imported Name 2");
	});
});
