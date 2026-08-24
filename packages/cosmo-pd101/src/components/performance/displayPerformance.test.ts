import { describe, expect, it } from "vitest";
import {
	AdaptivePerformanceQuality,
	getInitialPerformanceTier,
	getPerformanceDisplayProfile,
} from "./displayPerformance";

describe("display performance quality", () => {
	it("defines progressively cheaper profiles", () => {
		const high = getPerformanceDisplayProfile("high");
		const balanced = getPerformanceDisplayProfile("balanced");
		const low = getPerformanceDisplayProfile("low");

		expect(high).toMatchObject({
			bandCount: 64,
			waveformPointCount: 160,
			rowCount: 40,
			maxPixelRatio: 2,
			glowBlur: 8,
		});
		expect(balanced).toMatchObject({
			bandCount: 48,
			waveformPointCount: 160,
			rowCount: 24,
			maxPixelRatio: 1.5,
			glowBlur: 4,
		});
		expect(low).toMatchObject({
			bandCount: 32,
			waveformPointCount: 160,
			rowCount: 16,
			maxPixelRatio: 1,
			glowBlur: 0,
		});
	});

	it("starts balanced on coarse or high-density displays", () => {
		expect(
			getInitialPerformanceTier(undefined, {
				coarsePointer: true,
				devicePixelRatio: 1,
			}),
		).toBe("balanced");
		expect(
			getInitialPerformanceTier(undefined, {
				coarsePointer: false,
				devicePixelRatio: 3,
			}),
		).toBe("balanced");
		expect(
			getInitialPerformanceTier(undefined, {
				coarsePointer: false,
				devicePixelRatio: 1,
			}),
		).toBe("high");
	});

	it("downshifts after two poor windows and respects the cooldown", () => {
		const quality = new AdaptivePerformanceQuality("high");

		expect(quality.observe({ now: 0, drawMs: 20, frameGapMs: 50 })).toBeNull();
		expect(
			quality.observe({ now: 2_000, drawMs: 20, frameGapMs: 50 }),
		).toBeNull();
		expect(quality.observe({ now: 4_000, drawMs: 20, frameGapMs: 50 })).toBe(
			"balanced",
		);
		expect(
			quality.observe({ now: 6_000, drawMs: 20, frameGapMs: 50 }),
		).toBeNull();
		expect(quality.currentTier).toBe("balanced");
		expect(quality.observe({ now: 9_000, drawMs: 20, frameGapMs: 50 })).toBe(
			"low",
		);
	});

	it("recovers one tier after four stable windows", () => {
		const quality = new AdaptivePerformanceQuality("low", "balanced");

		expect(quality.observe({ now: 0, drawMs: 4, frameGapMs: 16 })).toBeNull();
		expect(
			quality.observe({ now: 2_000, drawMs: 4, frameGapMs: 16 }),
		).toBeNull();
		expect(
			quality.observe({ now: 4_000, drawMs: 4, frameGapMs: 16 }),
		).toBeNull();
		expect(
			quality.observe({ now: 6_000, drawMs: 4, frameGapMs: 16 }),
		).toBeNull();
		expect(quality.observe({ now: 8_000, drawMs: 4, frameGapMs: 16 })).toBe(
			"balanced",
		);
		expect(
			quality.observe({ now: 10_000, drawMs: 4, frameGapMs: 16 }),
		).toBeNull();
		expect(quality.currentTier).toBe("balanced");
	});
});
