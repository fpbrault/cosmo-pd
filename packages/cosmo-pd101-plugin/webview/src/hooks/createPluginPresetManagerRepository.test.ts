import { describe, expect, it, vi } from "vitest";
import { createPluginPresetManagerRepository } from "./createPluginPresetManagerRepository";

describe("createPluginPresetManagerRepository", () => {
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
});
