import { describe, expect, it } from "vitest";
import {
	getAuv3ScopePollIntervalMs,
	hasMeaningfulScopeHzChange,
	normalizeScopeHz,
} from "./scopePerformance";

describe("scopePerformance", () => {
	it("uses a slower scope cadence on iOS AUv3", () => {
		expect(getAuv3ScopePollIntervalMs("ios")).toBe(100);
		expect(getAuv3ScopePollIntervalMs("macos")).toBe(50);
		expect(getAuv3ScopePollIntervalMs(undefined)).toBe(50);
	});

	it("normalizes invalid scope frequencies", () => {
		expect(normalizeScopeHz(Number.NaN)).toBe(220);
		expect(normalizeScopeHz(0)).toBe(220);
		expect(normalizeScopeHz(440)).toBe(440);
	});

	it("ignores insignificant frequency jitter", () => {
		expect(hasMeaningfulScopeHzChange(220, 220.49)).toBe(false);
		expect(hasMeaningfulScopeHzChange(220, 220.5)).toBe(true);
	});
});
