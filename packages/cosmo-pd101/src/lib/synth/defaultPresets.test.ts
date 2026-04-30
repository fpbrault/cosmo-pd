import { describe, expect, it } from "vitest";
import { DEFAULT_SYNTH_PRESETS } from "@/lib/synth/defaultPresets";

describe("DEFAULT_SYNTH_PRESETS", () => {
	it("stores presets with modern modulation/effects fields", () => {
		for (const preset of Object.values(DEFAULT_SYNTH_PRESETS)) {
			const params = preset.params as Record<string, unknown>;

			expect(params).not.toHaveProperty("intPmEnabled");
			expect(params).not.toHaveProperty("vibrato");
			expect(params).toHaveProperty("chorus");
			expect(params).toHaveProperty("delay");
			expect(params).toHaveProperty("reverb");
			expect(params).toHaveProperty("random");
			expect(params).toHaveProperty("modEnv");
			expect(params).toHaveProperty("fxSlots");
			expect(Array.isArray(params.fxSlots)).toBe(true);
			expect((params.fxSlots as unknown[]).length).toBe(6);
		}
	});
});
