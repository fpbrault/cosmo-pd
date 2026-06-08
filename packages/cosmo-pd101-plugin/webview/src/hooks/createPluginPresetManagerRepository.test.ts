import { describe, expect, it, vi } from "vitest";
import { createPluginPresetManagerRepository } from "./createPluginPresetManagerRepository";

describe("createPluginPresetManagerRepository", () => {
	it("maps bank metadata from the native library response", async () => {
		window.__czGetPresetLibrary = vi.fn().mockResolvedValue({
			entries: [
				{
					id: "addon-1",
					name: "Addon Pad",
					source: "addon",
					author: "Addon Author",
					starred: false,
					bankId: "addon-bank",
					bankName: "Addon Bank",
					tags: ["pad"],
				},
			],
		});

		const repository = createPluginPresetManagerRepository({
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 0.5 } }) as never,
		});

		const entries = await repository.listEntries();

		expect(entries).toEqual([
			expect.objectContaining({
				id: "addon-1",
				source: "addon",
				sourceLabel: "Add-On Bank",
				bankId: "addon-bank",
				bankName: "Addon Bank",
			}),
		]);
	});

	it("defaults new saved user presets to the User author", async () => {
		const savePreset = vi.fn().mockResolvedValue({
			id: "user-1",
			name: "New Preset",
		});

		window.__czSavePreset = savePreset;

		const repository = createPluginPresetManagerRepository({
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 0.5 } }) as never,
		});

		await repository.savePreset({ existingEntry: null, name: "New Preset" });

		expect(savePreset).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "New Preset",
				author: "User",
			}),
		);
	});

	it("routes preset bank imports through the native plugin bridge", async () => {
		const importPresetBank = vi.fn().mockResolvedValue(undefined);
		window.__czImportPresetBank = importPresetBank;

		const repository = createPluginPresetManagerRepository({
			gatherPresetState: () =>
				({ schemaVersion: 1, params: { volume: 0.5 } }) as never,
		});

		await repository.importPreset(
			JSON.stringify({
				type: "preset-bank",
				schemaVersion: 1,
				bank: {
					id: "addon-bank",
					name: "Addon Bank",
					source: "addon",
				},
				presets: [
					{
						id: "addon-1",
						name: "Addon Pad",
						author: "Addon Author",
						tags: ["pad"],
						data: {
							schemaVersion: 1,
							params: {
								volume: 0.5,
								macroLabels: ["A", "B", "C", "D"],
							},
						},
					},
				],
			}),
			"addon-bank",
		);

		expect(importPresetBank).toHaveBeenCalledWith({
			type: "preset-bank",
			schemaVersion: 1,
			bank: {
				id: "addon-bank",
				name: "Addon Bank",
				source: "addon",
			},
			presets: [
				{
					id: "addon-1",
					name: "Addon Pad",
					author: "Addon Author",
					starred: false,
					tags: ["pad"],
					data: {
						schemaVersion: 1,
						params: {
							volume: 0.5,
							macroLabels: ["A", "B", "C", "D"],
						},
					},
				},
			],
		});
	});
});
