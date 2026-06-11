import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCreateWebPresetManagerRepository = vi.hoisted(() => vi.fn());

vi.mock("@cosmo/cosmo-pd101", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@cosmo/cosmo-pd101")>();
	return {
		...actual,
		createWebPresetManagerRepository: mockCreateWebPresetManagerRepository,
	};
});

import { createPluginPresetManagerRepository } from "./createPluginPresetManagerRepository";

describe("createPluginPresetManagerRepository", () => {
	beforeEach(() => {
		mockCreateWebPresetManagerRepository.mockReset();
		delete window.__czHostPlatform;
		delete window.__czSavePreset;
		delete window.__czGetPresetLibrary;
		delete window.__czSetPresetDescription;
	});

	it("uses shared AUv3 fallback presets with authored metadata", async () => {
		const fallbackRepository = {
			listEntries: vi.fn().mockResolvedValue([]),
			loadEntry: vi.fn(),
			savePreset: vi.fn().mockResolvedValue({
				session: {
					activePresetId: "user-1",
					activePresetNameBase: "My Pad",
					isDirty: false,
				},
				stateSync: "immediate",
			}),
			deletePreset: vi.fn(),
			renamePreset: vi.fn(),
			setPresetAuthor: vi.fn(),
			setPresetDescription: vi.fn(),
			setPresetFavorite: vi.fn(),
			setPresetTags: vi.fn(),
			initPreset: vi.fn(),
			exportPreset: vi.fn(),
			importPreset: vi.fn(),
			exportCurrentState: vi.fn(),
		};
		mockCreateWebPresetManagerRepository.mockReturnValue(fallbackRepository);
		window.__czHostPlatform = "ios";
		window.__czSavePreset = vi.fn();

		const applyPreset = vi.fn();
		const onBeforeApplyPreset = vi.fn();
		const repository = createPluginPresetManagerRepository({
			applyPreset,
			gatherPresetState: () => ({ schemaVersion: 1, params: { volume: 1 } }),
			onBeforeApplyPreset,
		});

		expect(mockCreateWebPresetManagerRepository).toHaveBeenCalledTimes(1);
		expect(mockCreateWebPresetManagerRepository).toHaveBeenCalledWith(
			expect.objectContaining({
				applyPreset,
				onBeforeApplyPreset,
				libraryPresets: expect.arrayContaining([
					expect.objectContaining({
						id: "0",
						name: "Blissful Brass",
						author: "Purr Audio",
						starred: true,
					}),
				]),
			}),
		);

		await repository.savePreset({ existingEntry: null, name: "My Pad" });

		expect(fallbackRepository.savePreset).toHaveBeenCalledWith({
			existingEntry: null,
			name: "My Pad",
		});
		expect(window.__czSavePreset).not.toHaveBeenCalled();
	});

	it("maps and updates native preset descriptions", async () => {
		window.__czGetPresetLibrary = vi.fn().mockResolvedValue({
			entries: [
				{
					id: "factory-1",
					name: "Factory Pad",
					source: "cosmo-factory",
					author: "Purr Audio",
					description: "Slow and spacious.",
					starred: false,
					tags: ["pad"],
				},
			],
		});
		window.__czSetPresetDescription = vi.fn().mockResolvedValue(null);

		const repository = createPluginPresetManagerRepository({
			applyPreset: vi.fn(),
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 1 } }) as never,
		});

		await expect(repository.listEntries()).resolves.toEqual([
			expect.objectContaining({
				id: "factory-1",
				description: "Slow and spacious.",
			}),
		]);
		await repository.setPresetDescription("factory-1", "Updated");
		expect(window.__czSetPresetDescription).toHaveBeenCalledWith(
			"factory-1",
			"Updated",
		);
	});
});
