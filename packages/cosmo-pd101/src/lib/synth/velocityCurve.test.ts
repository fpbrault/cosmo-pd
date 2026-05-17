import { describe, expect, it } from "vitest";
import { applyVelocityCurve } from "./velocityCurve";

describe("velocityCurve", () => {
	it("returns velocity as-is when curve is near zero", () => {
		expect(applyVelocityCurve(0.5, 0)).toBe(0.5);
		expect(applyVelocityCurve(0.5, 0.0005)).toBe(0.5);
		expect(applyVelocityCurve(0.5, -0.0005)).toBe(0.5);
	});

	it("applies convex curve when curve > 0", () => {
		const v = 0.5;
		const curve = 1;
		const result = applyVelocityCurve(v, curve);
		expect(result).toBeGreaterThan(v);
	});

	it("applies concave curve when curve < 0", () => {
		const v = 0.5;
		const curve = -1;
		const result = applyVelocityCurve(v, curve);
		expect(result).toBeLessThan(v);
	});

	it("clamps velocity between 0 and 1", () => {
		expect(applyVelocityCurve(-1, 1)).toBe(0);
		expect(applyVelocityCurve(2, 1)).toBe(1);
	});
});
