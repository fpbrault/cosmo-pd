import { describe, expect, it } from "vitest";
import {
	isDualLineSelect,
	isModModeDisabled,
} from "../controls/useLineRoutingControls";

describe("Simple CZ routing controls", () => {
	it("recognizes only the two dual-line modes", () => {
		expect(isDualLineSelect("L1+L1'")).toBe(true);
		expect(isDualLineSelect("L1+L2'")).toBe(true);
		expect(isDualLineSelect("L1")).toBe(false);
		expect(isDualLineSelect("L2")).toBe(false);
	});

	it("gates ring and noise outside dual-line modes", () => {
		expect(isModModeDisabled("ring", "L1")).toBe(true);
		expect(isModModeDisabled("noise", "L2")).toBe(true);
		expect(isModModeDisabled("ring", "L1+L2'")).toBe(false);
		expect(isModModeDisabled("normal", "L1")).toBe(false);
	});
});
