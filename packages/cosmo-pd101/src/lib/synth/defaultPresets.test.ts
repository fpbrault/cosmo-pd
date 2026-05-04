import { describe, expect, it } from "vitest";
import { DEFAULT_SYNTH_PRESETS } from "@/lib/synth/defaultPresets";

describe("DEFAULT_SYNTH_PRESETS", () => {
	it("stores presets with modern modulation/effects fields", () => {
		for (const preset of Object.values(DEFAULT_SYNTH_PRESETS)) {
			expect(typeof preset.name).toBe("string");
			expect(typeof preset.favorite).toBe("boolean");
			expect(typeof preset.category).toBe("string");
			expect(Array.isArray(preset.tags)).toBe(true);

			const params = preset.data.params as Record<string, unknown>;

			expect(params).not.toHaveProperty("intPmEnabled");
			expect(params).not.toHaveProperty("vibrato");
			expect(params).not.toHaveProperty("chorus");
			expect(params).not.toHaveProperty("delay");
			expect(params).not.toHaveProperty("reverb");
			expect(params).toHaveProperty("random");
			expect(params).toHaveProperty("modEnv");
			expect(params).toHaveProperty("fxSlots");
			expect(Array.isArray(params.fxSlots)).toBe(true);
			expect((params.fxSlots as unknown[]).length).toBe(6);
		}
	});
});
