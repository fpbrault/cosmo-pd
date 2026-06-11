import { describe, expect, it, vi } from "vitest";
import { createWebPresetManagerRepository } from "./createWebPresetManagerRepository";

const mockSaveStoredPreset = vi.hoisted(() => vi.fn());
const mockLoadStoredPreset = vi.hoisted(() => vi.fn());

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
		importPreset: vi.fn(),
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

		await repository.savePreset({ existingEntry: null, name: "New Preset" });

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
		});

		expect(mockSaveStoredPreset).toHaveBeenCalledWith(
			expect.objectContaining({ description: "Warm and wide." }),
		);
	});
});
