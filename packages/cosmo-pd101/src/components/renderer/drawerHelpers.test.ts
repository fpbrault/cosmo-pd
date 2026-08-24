import { describe, expect, it } from "vitest";
import { getDrawerOffset, isDrawerPanel } from "./drawerHelpers";

describe("drawerHelpers", () => {
	it("validates drawer panels", () => {
		expect(isDrawerPanel("fx")).toBe(true);
		expect(isDrawerPanel("mod")).toBe(true);
		expect(isDrawerPanel("display")).toBe(false);
		expect(isDrawerPanel("phase")).toBe(false);
	});

	it("computes drawer offsets for direction changes", () => {
		expect(getDrawerOffset("fx", "fx", 1)).toBe("0%");
		expect(getDrawerOffset("mod", "fx", 1)).toBe("100%");
		expect(getDrawerOffset("fx", "mod", -1)).toBe("100%");
		expect(getDrawerOffset("mod", "mod", 1)).toBe("0%");
	});
});
