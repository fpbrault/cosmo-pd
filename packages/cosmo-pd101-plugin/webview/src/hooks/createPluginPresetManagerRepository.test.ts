import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCreateWebPresetManagerRepository = vi.hoisted(() => vi.fn());

vi.mock("@cosmo/cosmo-pd101", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@cosmo/cosmo-pd101")>();
	return {
		...actual,
		createWebPresetManagerRepository: mockCreateWebPresetManagerRepository,
	};
});

import type { SynthPresetV1 } from "@cosmo/cosmo-pd101";
import { createPluginPresetManagerRepository } from "./createPluginPresetManagerRepository";

describe("createPluginPresetManagerRepository", () => {
	beforeEach(() => {
		mockCreateWebPresetManagerRepository.mockReset();
		delete window.__czHostPlatform;
		delete window.__czSavePreset;
		delete window.__czGetPresetLibrary;
		delete window.__czSetPresetDescription;
		delete window.__czRetryPresetLibrary;
		delete window.__czRepairPresetLibrary;
		delete window.__czRebuildPresetLibrary;
	});

	it("uses shared AUv3 fallback presets with authored metadata", async () => {
		const fallbackRepository = {
			listEntries: vi.fn().mockResolvedValue({
				entries: [],
				status: { state: "ready" },
			}),
			loadEntry: vi.fn(),
			savePreset: vi.fn().mockResolvedValue({
				session: {
					activePresetId: "user-1",
					activePresetNameBase: "My Pad",
					isDirty: false,
				},
				stateSync: "immediate",
			}),
			savePresetAs: vi.fn(),
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
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 1 } }) as SynthPresetV1,
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

		await repository.savePreset({
			existingEntry: null,
			name: "My Pad",
			mode: "create",
		});

		expect(fallbackRepository.savePreset).toHaveBeenCalledWith({
			existingEntry: null,
			name: "My Pad",
			mode: "create",
		});
		expect(window.__czSavePreset).not.toHaveBeenCalled();
	});

	it("sends null id for save as and the active id for overwrite", async () => {
		window.__czSavePreset = vi.fn().mockResolvedValue({
			id: "user-2",
			name: "Copied Pad",
		});

		const repository = createPluginPresetManagerRepository({
			applyPreset: vi.fn(),
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 1 } }) as never,
		});

		await repository.savePreset({
			existingEntry: {
				id: "user-1",
				label: "Source Pad",
				type: "local",
				source: "user",
				sourceLabel: "User",
				author: "User",
				description: "Warm and wide.",
				starred: false,
				favorite: false,
				tags: ["pad"],
			},
			name: "Copied Pad",
			mode: "create",
		});
		await repository.savePreset({
			existingEntry: {
				id: "user-1",
				label: "Source Pad",
				type: "local",
				source: "user",
				sourceLabel: "User",
				author: "User",
				description: "Warm and wide.",
				starred: false,
				favorite: false,
				tags: ["pad"],
			},
			name: "Source Pad",
			mode: "overwrite",
		});

		expect(window.__czSavePreset).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ id: null, name: "Copied Pad" }),
		);
		expect(window.__czSavePreset).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ id: "user-1", name: "Source Pad" }),
		);
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

		await expect(repository.listEntries()).resolves.toEqual({
			entries: [
				expect.objectContaining({
					id: "factory-1",
					description: "Slow and spacious.",
				}),
			],
			status: { state: "ready" },
		});
		await repository.setPresetDescription("factory-1", "Updated");
		expect(window.__czGetPresetLibrary).toHaveBeenCalledWith();
		expect(window.__czSetPresetDescription).toHaveBeenCalledWith(
			"factory-1",
			"Updated",
		);
	});

	it("invokes native preset library recovery methods", async () => {
		window.__czRetryPresetLibrary = vi.fn().mockResolvedValue(null);
		window.__czRepairPresetLibrary = vi.fn().mockResolvedValue(null);
		window.__czRebuildPresetLibrary = vi.fn().mockResolvedValue(null);
		const repository = createPluginPresetManagerRepository({
			applyPreset: vi.fn(),
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 1 } }) as never,
		});

		await repository.retryLibrary?.();
		await repository.repairLibrary?.();
		await repository.rebuildLibrary?.();

		expect(window.__czRetryPresetLibrary).toHaveBeenCalledOnce();
		expect(window.__czRepairPresetLibrary).toHaveBeenCalledOnce();
		expect(window.__czRebuildPresetLibrary).toHaveBeenCalledOnce();
	});

	it("reports a missing native preset library rebuild method", async () => {
		const repository = createPluginPresetManagerRepository({
			applyPreset: vi.fn(),
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 1 } }) as never,
		});

		await expect(repository.rebuildLibrary?.()).rejects.toThrow(
			"Plugin host does not provide preset library rebuild",
		);
	});
});
