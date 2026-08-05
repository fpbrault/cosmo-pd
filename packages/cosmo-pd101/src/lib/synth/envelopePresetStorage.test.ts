import { afterEach, describe, expect, it, vi } from "vitest";
import type { StepEnvData } from "./bindings/synth";
import {
	deleteEnvelopePreset,
	getEnvelopePresetEnvelope,
	listEnvelopePresets,
	saveEnvelopePreset,
} from "./envelopePresetStorage";

const makeEnvelope = (): StepEnvData => ({
	steps: Array.from({ length: 8 }, (_, index) => ({
		level: index * 10,
		rate: index + 1,
	})),
	sustainStep: 1,
	stepCount: 3,
	loop: false,
});

describe("envelopePresetStorage", () => {
	afterEach(() => {
		delete window.__czListFxModulePresets;
		delete window.__czSaveFxModulePreset;
		delete window.__czDeleteFxModulePreset;
	});

	it("uses the FX module bridge with the shared envelope module type", async () => {
		window.__czSaveFxModulePreset = vi.fn().mockResolvedValue({
			id: "env-1",
			name: "  Pluck  ",
			moduleType: "envelope",
			patch: {
				envelope: makeEnvelope(),
			},
			updatedAtUnixMs: 123,
		});
		window.__czListFxModulePresets = vi.fn().mockResolvedValue([
			{
				id: "env-1",
				name: "Pluck",
				moduleType: "envelope",
				patch: { envelope: makeEnvelope() },
				updatedAtUnixMs: 123,
			},
			{
				id: "bad-1",
				name: "Bad",
				moduleType: "envelope",
				patch: { envelope: { steps: [] } },
				updatedAtUnixMs: 124,
			},
		]);
		window.__czDeleteFxModulePreset = vi.fn().mockResolvedValue(undefined);

		const saved = await saveEnvelopePreset({
			name: "  Pluck  ",
			envelope: makeEnvelope(),
		});
		const listed = await listEnvelopePresets();
		await deleteEnvelopePreset("env-1");

		expect(window.__czSaveFxModulePreset).toHaveBeenCalledWith({
			name: "Pluck",
			moduleType: "envelope",
			patch: expect.objectContaining({ envelope: expect.any(Object) }),
		});
		expect(saved.id).toBe("env-1");
		expect(saved.patch.envelope.steps).toHaveLength(8);
		expect(listed).toHaveLength(1);
		expect(window.__czListFxModulePresets).toHaveBeenCalledWith("envelope");
		expect(window.__czDeleteFxModulePreset).toHaveBeenCalledWith("env-1");
	});

	it("falls back to IndexedDB and preserves only the normalized shape", async () => {
		const envelope = makeEnvelope();
		envelope.stepCount = 99;
		envelope.sustainStep = 99;
		envelope.steps[7] = { level: 99, rate: 77 };

		const saved = await saveEnvelopePreset({
			name: "  Long Shape  ",
			envelope,
		});
		const listed = await listEnvelopePresets();
		const applied = getEnvelopePresetEnvelope(listed[0]);

		expect(saved.name).toBe("Long Shape");
		expect(applied.steps).toHaveLength(8);
		expect(applied.stepCount).toBe(8);
		expect(applied.sustainStep).toBe(7);
		expect(applied.steps[7].level).toBe(0);

		await deleteEnvelopePreset(saved.id);
		expect(await listEnvelopePresets()).toEqual([]);
	});
});
