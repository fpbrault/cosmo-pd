import { describe, expect, it } from "vitest";
import {
	getAuv3ScopePollIntervalMs,
	hasMeaningfulScopeHzChange,
	normalizeScopeHz,
} from "./scopePerformance";

describe("scopePerformance", () => {
	it("normalizes invalid scope frequencies", () => {
		expect(normalizeScopeHz(Number.NaN)).toBe(220);
		expect(normalizeScopeHz(0)).toBe(220);
		expect(normalizeScopeHz(440)).toBe(440);
	});

	it("ignores insignificant frequency jitter", () => {
		expect(hasMeaningfulScopeHzChange(220, 220.49)).toBe(false);
		expect(hasMeaningfulScopeHzChange(220, 220.5)).toBe(true);
	});

	it("uses a constrained iOS AUv3 scope poll interval", () => {
		expect(getAuv3ScopePollIntervalMs("ios")).toBe(33);
		expect(getAuv3ScopePollIntervalMs("macos")).toBe(16);
	});
});
