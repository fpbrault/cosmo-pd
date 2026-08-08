import { describe, expect, it } from "vitest";
import { BUILTIN_ENVELOPE_PRESETS } from "./envelopePresets";

describe("builtin envelope presets", () => {
	it("provides normalized shape-only factory presets for the supplied shapes", () => {
		expect(BUILTIN_ENVELOPE_PRESETS.map((preset) => preset.label)).toEqual([
			"Pluck",
			"Flat",
			"Alternator",
			"Short Swell",
			"Pluck and Rise",
			"Classic Decay",
			"Sustain then Decay",
			"Pulse Loop",
			"Long Swell",
		]);

		for (const preset of BUILTIN_ENVELOPE_PRESETS) {
			expect(preset.envelope.steps).toHaveLength(8);
			expect(preset.envelope.stepCount).toBeGreaterThanOrEqual(1);
			expect(preset.envelope.stepCount).toBeLessThanOrEqual(8);
			expect(preset.envelope.sustainStep).toBeLessThan(
				preset.envelope.stepCount,
			);
			expect(preset.envelope.steps[preset.envelope.stepCount - 1]?.level).toBe(
				0,
			);
		}
	});
});
