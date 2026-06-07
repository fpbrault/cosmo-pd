import { afterEach, describe, expect, it, vi } from "vitest";
import {
	deleteFxModulePreset,
	listFxModulePresets,
	saveFxModulePreset,
} from "./fxModulePresetStorage";

declare global {
	interface Window {
		__czListFxModulePresets?: (moduleType: string) => Promise<unknown>;
		__czSaveFxModulePreset?: (payload: {
			name: string;
			moduleType: string;
			patch: Record<string, unknown>;
		}) => Promise<unknown>;
		__czDeleteFxModulePreset?: (id: string) => Promise<unknown>;
	}
}

describe("fxModulePresetStorage", () => {
	afterEach(() => {
		delete window.__czListFxModulePresets;
		delete window.__czSaveFxModulePreset;
		delete window.__czDeleteFxModulePreset;
	});

	it("uses the native bridge when available", async () => {
		window.__czListFxModulePresets = vi.fn().mockResolvedValue([
			{
				id: "fx-1",
				name: "Wide Delay",
				moduleType: "delay",
				patch: { mix: 0.4 },
				updatedAtUnixMs: 123,
			},
		]);
		window.__czSaveFxModulePreset = vi.fn().mockResolvedValue({
			id: "fx-2",
			name: "Bright Delay",
			moduleType: "delay",
			patch: { mix: 0.6 },
			updatedAtUnixMs: 456,
		});
		window.__czDeleteFxModulePreset = vi.fn().mockResolvedValue(undefined);

		const saved = await saveFxModulePreset({
			name: "  Bright Delay  ",
			moduleType: "delay",
			patch: { mix: 0.6 },
		});
		const listed = await listFxModulePresets("delay");
		await deleteFxModulePreset("fx-2");

		expect(window.__czSaveFxModulePreset).toHaveBeenCalledWith({
			name: "Bright Delay",
			moduleType: "delay",
			patch: { mix: 0.6 },
		});
		expect(saved).toEqual({
			id: "fx-2",
			name: "Bright Delay",
			moduleType: "delay",
			patch: { mix: 0.6 },
			createdAt: 456,
		});
		expect(window.__czListFxModulePresets).toHaveBeenCalledWith("delay");
		expect(listed).toEqual([
			{
				id: "fx-1",
				name: "Wide Delay",
				moduleType: "delay",
				patch: { mix: 0.4 },
				createdAt: 123,
			},
		]);
		expect(window.__czDeleteFxModulePreset).toHaveBeenCalledWith("fx-2");
	});

	it("falls back to indexeddb when the native bridge is unavailable", async () => {
		const saved = await saveFxModulePreset({
			name: "  Web Chorus  ",
			moduleType: "chorus",
			patch: { mix: 0.25 },
		});

		const listed = await listFxModulePresets("chorus");
		await deleteFxModulePreset(saved.id);
		const afterDelete = await listFxModulePresets("chorus");

		expect(saved.name).toBe("Web Chorus");
		expect(listed).toEqual([
			expect.objectContaining({
				id: saved.id,
				name: "Web Chorus",
				moduleType: "chorus",
				patch: { mix: 0.25 },
			}),
		]);
		expect(afterDelete).toEqual([]);
	});
});
