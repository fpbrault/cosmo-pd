import { describe, expect, it, vi } from "vitest";
import { createWebPresetManagerRepository } from "./createWebPresetManagerRepository";

const mockSaveStoredPreset = vi.hoisted(() => vi.fn());
const mockLoadStoredPreset = vi.hoisted(() => vi.fn());
const mockImportPreset = vi.hoisted(() => vi.fn());

vi.mock("@/lib/synth/presetStorage", async () => {
	const actual = await vi.importActual<
		typeof import("@/lib/synth/presetStorage")
	>("@/lib/synth/presetStorage");
	return {
		...actual,
		listStoredPresets: vi.fn().mockResolvedValue([]),
		listPresetFavorites: vi.fn().mockResolvedValue([]),
		loadStoredPreset: mockLoadStoredPreset,
		saveStoredPreset: mockSaveStoredPreset,
		deletePreset: vi.fn(),
		exportPreset: vi.fn(),
		importPreset: mockImportPreset,
		setPresetFavorite: vi.fn(),
		updatePresetMetadata: vi.fn(),
		updateStoredPreset: vi.fn(),
	};
});

describe("createWebPresetManagerRepository", () => {
	it("defaults new saved user presets to the User author", async () => {
		mockLoadStoredPreset.mockResolvedValue(null);
		mockSaveStoredPreset.mockResolvedValue({
			id: "user-1",
			name: "New Preset",
			source: "user",
			author: "User",
			starred: false,
			tags: [],
			data: { schemaVersion: 1, params: { volume: 0.5 } },
		});

		const repository = createWebPresetManagerRepository({
			applyPreset: vi.fn(),
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 0.5 } }) as never,
			libraryPresets: [],
		});

		await repository.savePreset({
			existingEntry: null,
			name: "New Preset",
			mode: "create",
		});

		expect(mockSaveStoredPreset).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "New Preset",
				author: "User",
				source: "user",
			}),
		);
	});

	it("preserves descriptions when overwriting a user preset", async () => {
		mockLoadStoredPreset.mockResolvedValue({
			id: "user-1",
			name: "Existing",
			source: "user",
			author: "User",
			description: "Warm and wide.",
			starred: false,
			tags: [],
			data: { schemaVersion: 1, params: { volume: 0.5 } },
		});
		mockSaveStoredPreset.mockResolvedValue({
			id: "user-1",
			name: "Existing",
		});

		const repository = createWebPresetManagerRepository({
			applyPreset: vi.fn(),
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 0.5 } }) as never,
			libraryPresets: [],
		});

		await repository.savePreset({
			existingEntry: {
				id: "user-1",
				label: "Existing",
				type: "local",
				source: "user",
				sourceLabel: "User",
				author: "User",
				description: "Warm and wide.",
				starred: false,
				favorite: false,
				tags: [],
			},
			name: "Existing",
			mode: "overwrite",
		});

		expect(mockSaveStoredPreset).toHaveBeenCalledWith(
			expect.objectContaining({ description: "Warm and wide." }),
		);
	});

	it("creates a new preset id for save as while preserving metadata", async () => {
		mockLoadStoredPreset.mockResolvedValue({
			id: "user-1",
			name: "Existing",
			source: "user",
			author: "User",
			description: "Warm and wide.",
			starred: true,
			tags: ["pad"],
			data: { schemaVersion: 1, params: { volume: 0.5 } },
		});
		mockSaveStoredPreset.mockResolvedValue({
			id: "user-2",
			name: "Copy",
		});

		const repository = createWebPresetManagerRepository({
			applyPreset: vi.fn(),
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 0.5 } }) as never,
			libraryPresets: [],
		});

		await repository.savePreset({
			existingEntry: {
				id: "user-1",
				label: "Existing",
				type: "local",
				source: "user",
				sourceLabel: "User",
				author: "User",
				description: "Warm and wide.",
				starred: true,
				favorite: true,
				tags: ["pad"],
			},
			name: "Copy",
			mode: "create",
		});

		expect(mockSaveStoredPreset).toHaveBeenCalledWith(
			expect.objectContaining({
				id: undefined,
				name: "Copy",
				author: "User",
				description: "Warm and wide.",
				starred: true,
				tags: ["pad"],
			}),
		);
	});

	it("defaults imported presets with no author to the User author", async () => {
		mockImportPreset.mockResolvedValue({
			name: "Imported",
			author: "",
			description: "",
			starred: false,
			tags: [],
			favorite: false,
			data: { schemaVersion: 1, params: { volume: 1 } },
		});
		mockSaveStoredPreset.mockResolvedValue({
			id: "user-1",
			name: "Imported Patch",
			data: { schemaVersion: 1, params: { volume: 1 } },
		});

		const repository = createWebPresetManagerRepository({
			applyPreset: vi.fn(),
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 1 } }) as never,
			libraryPresets: [],
		});

		await repository.importPreset("{}", "Imported Patch");

		expect(mockSaveStoredPreset).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "Imported Patch",
				author: "User",
			}),
		);
	});
});
