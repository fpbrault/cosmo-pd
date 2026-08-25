import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSynthStore } from "@/features/synth/synthStore";
import type {
	PresetImportBatchResult,
	PresetManagerRepository,
} from "./presetManagerRepository";
import type { PresetEntry } from "./types/presetEntry";
import { useSynthPresetManager } from "./useSynthPresetManager";

const entries: PresetEntry[] = [
	{
		id: "preset-1",
		label: "Preset 1",
		type: "library",
		source: "cosmo-factory",
		sourceLabel: "Cosmo Factory Library",
		author: "Purr Audio",
		description: "",
		starred: false,
		favorite: false,
		tags: [],
		preset: {
			id: "preset-1",
			name: "Preset 1",
			source: "cosmo-factory",
			author: "Purr Audio",
			description: "",
			starred: false,
		},
	},
	{
		id: "local-1",
		label: "Local 1",
		type: "local",
		source: "user",
		sourceLabel: "User",
		author: "",
		description: "",
		starred: false,
		favorite: false,
		tags: [],
	},
];

function createRepository(): PresetManagerRepository {
	return {
		listEntries: vi.fn().mockResolvedValue({
			entries,
			status: { state: "ready" },
		}),
		loadEntry: vi.fn(async (entry) => ({
			session: {
				activePresetId: entry.id,
				activePresetNameBase: entry.label,
				isDirty: false,
			},
			stateSync: "immediate" as const,
		})),
		savePreset: vi.fn(async () => ({
			session: {
				activePresetId: "local-1",
				activePresetNameBase: "Local 1",
				isDirty: false,
			},
			stateSync: "immediate" as const,
		})),
		deletePreset: vi.fn().mockResolvedValue(undefined),
		renamePreset: vi.fn().mockResolvedValue(undefined),
		setPresetAuthor: vi.fn().mockResolvedValue(undefined),
		setPresetDescription: vi.fn().mockResolvedValue(undefined),
		setPresetFavorite: vi.fn().mockResolvedValue(undefined),
		setPresetTags: vi.fn().mockResolvedValue(undefined),
		initPreset: vi.fn().mockResolvedValue({
			session: {
				activePresetId: null,
				activePresetNameBase: "Current State",
				isDirty: false,
			},
			stateSync: "immediate" as const,
		}),
		exportPreset: vi.fn().mockResolvedValue(null),
		importPreset: vi.fn().mockResolvedValue(null),
		exportCurrentState: vi.fn().mockResolvedValue({
			filename: "Current State.json",
			json: "{}",
		}),
	};
}

describe("useSynthPresetManager", () => {
	let repository: PresetManagerRepository;

	beforeEach(() => {
		repository = createRepository();
		useSynthStore.setState({ presetEditVersion: 0 });
	});

	it("hydrates entries from the injected repository", async () => {
		const { result } = renderHook(() => useSynthPresetManager({ repository }));

		await vi.waitFor(() => {
			expect(result.current.allPresetEntries).toHaveLength(2);
		});
		expect(repository.listEntries).toHaveBeenCalled();
	});

	it("loads entries through the repository", async () => {
		const { result } = renderHook(() => useSynthPresetManager({ repository }));

		await vi.waitFor(() => {
			expect(result.current.allPresetEntries).toHaveLength(2);
		});

		await act(async () => {
			await result.current.activatePreset({ entryId: "preset-1" });
		});

		expect(repository.loadEntry).toHaveBeenCalledWith(
			expect.objectContaining({ id: "preset-1" }),
		);
		expect(result.current.activePresetId).toBe("preset-1");
		expect(result.current.activePresetNameBase).toBe("Preset 1");
	});

	it("imports a batch and activates the last successful preset", async () => {
		const { result } = renderHook(() => useSynthPresetManager({ repository }));

		await vi.waitFor(() => {
			expect(result.current.allPresetEntries).toHaveLength(2);
		});

		vi.mocked(repository.importPreset)
			.mockResolvedValueOnce({
				session: {
					activePresetId: "imported-1",
					activePresetNameBase: "One",
					isDirty: false,
				},
				stateSync: "immediate",
			})
			.mockResolvedValueOnce({
				session: {
					activePresetId: "imported-2",
					activePresetNameBase: "Two",
					isDirty: false,
				},
				stateSync: "immediate",
			});

		let batchResult: PresetImportBatchResult | undefined;
		await act(async () => {
			batchResult = await result.current.importPresetFiles([
				{
					filename: "one.json",
					data: new TextEncoder().encode('{"schemaVersion":1}'),
				},
				{
					filename: "two.json",
					data: new TextEncoder().encode('{"schemaVersion":1}'),
				},
			]);
		});

		expect(batchResult).toEqual({ importedCount: 2, failures: [] });
		expect(result.current.activePresetId).toBe("imported-2");
		expect(result.current.activePresetNameBase).toBe("Two");
	});

	it("supports identity-preserving external synchronization", async () => {
		const { result } = renderHook(() => useSynthPresetManager({ repository }));

		act(() => {
			result.current.syncExternalSelection({
				activePresetId: "restored-id",
				activePresetNameBase: "Warm Pad",
				isDirty: true,
			});
		});

		expect(result.current.activePresetId).toBe("restored-id");
		expect(result.current.activePresetName).toBe("Warm Pad *");
	});

	it("marks the active preset dirty after synth edits", async () => {
		const { result } = renderHook(() => useSynthPresetManager({ repository }));

		act(() => {
			result.current.syncExternalSelection({
				activePresetId: "preset-1",
				activePresetNameBase: "Preset 1",
				isDirty: false,
			});
		});

		act(() => {
			useSynthStore.getState().setVolume(0.25);
		});

		expect(result.current.activePresetName).toBe("Preset 1 *");
	});

	it("keeps deferred preset activation clean until the next edit", async () => {
		const deferredRepository = createRepository();
		deferredRepository.loadEntry = vi.fn(async (entry) => ({
			session: {
				activePresetId: entry.id,
				activePresetNameBase: entry.label,
				isDirty: false,
			},
			stateSync: "deferred" as const,
		}));

		const { result } = renderHook(() =>
			useSynthPresetManager({ repository: deferredRepository }),
		);

		await vi.waitFor(() => {
			expect(result.current.allPresetEntries).toHaveLength(2);
		});

		act(() => {
			useSynthStore.getState().setVolume(0.8);
		});

		await act(async () => {
			await result.current.activatePreset({ entryId: "preset-1" });
		});

		expect(result.current.isPresetDirty).toBe(false);

		act(() => {
			useSynthStore.getState().applyPreset({
				schemaVersion: 1,
				params: {
					...useSynthStore.getState().gatherPresetState().params,
					volume: 0.25,
				},
			});
			result.current.recomputeDirtyState();
		});

		expect(result.current.isPresetDirty).toBe(false);

		act(() => {
			useSynthStore.getState().setVolume(0.5);
		});

		await vi.waitFor(() => {
			expect(result.current.isPresetDirty).toBe(true);
		});
	});

	it("refreshes entries after metadata updates", async () => {
		const { result } = renderHook(() => useSynthPresetManager({ repository }));

		await vi.waitFor(() => {
			expect(result.current.allPresetEntries).toHaveLength(2);
		});

		await act(async () => {
			await result.current.setPresetFavorite("local-1", true);
		});

		expect(repository.setPresetFavorite).toHaveBeenCalledWith("local-1", true);
		expect(repository.listEntries).toHaveBeenCalledTimes(2);

		await act(async () => {
			await result.current.setPresetDescription("local-1", "  Warm and wide  ");
		});

		expect(repository.setPresetDescription).toHaveBeenCalledWith(
			"local-1",
			"Warm and wide",
		);
		expect(repository.listEntries).toHaveBeenCalledTimes(3);
	});

	it("uses User when a user preset author is cleared", async () => {
		const { result } = renderHook(() => useSynthPresetManager({ repository }));

		await vi.waitFor(() => {
			expect(result.current.allPresetEntries).toHaveLength(2);
		});

		await act(async () => {
			await result.current.setPresetAuthor("local-1", "   ");
		});

		expect(repository.setPresetAuthor).toHaveBeenCalledWith("local-1", "User");
	});

	it("uses overwrite for save and create for save as", async () => {
		const { result } = renderHook(() => useSynthPresetManager({ repository }));

		await vi.waitFor(() => {
			expect(result.current.allPresetEntries).toHaveLength(2);
		});

		act(() => {
			result.current.syncExternalSelection({
				activePresetId: "local-1",
				activePresetNameBase: "Local 1",
				isDirty: true,
			});
		});

		await act(async () => {
			await result.current.savePreset("Local 1");
			await result.current.savePresetAs("Local 1 Copy");
		});

		expect(repository.savePreset).toHaveBeenNthCalledWith(1, {
			existingEntry: expect.objectContaining({ id: "local-1" }),
			name: "Local 1",
			mode: "overwrite",
		});
		expect(repository.savePreset).toHaveBeenNthCalledWith(2, {
			existingEntry: expect.objectContaining({ id: "local-1" }),
			name: "Local 1 Copy",
			mode: "create",
		});
	});
});
