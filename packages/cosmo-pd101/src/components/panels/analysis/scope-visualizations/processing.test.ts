import { describe, expect, it } from "vitest";
import { calculateScopeActivity } from "./processing";

describe("calculateScopeActivity", () => {
	it("reports stronger activity for louder, moving samples", () => {
		const quiet = calculateScopeActivity(
			new Float32Array([0, 0.01, 0, -0.01]),
			1,
		);
		const loud = calculateScopeActivity(
			new Float32Array([0, 0.8, -0.8, 0.8]),
			1,
		);

		expect(loud.energy).toBeGreaterThan(quiet.energy);
		expect(loud.motion).toBeGreaterThan(quiet.motion);
		expect(loud.activity).toBeGreaterThan(quiet.activity);
	});
});
