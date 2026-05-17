import { describe, expect, it } from "vitest";
import {
	algoParamTargetFromSlot,
	type ModTarget,
	resolveModDestination,
} from "./modDestination";

describe("modDestination", () => {
	describe("algoParamTargetFromSlot", () => {
		it("returns correct slot target for valid slots", () => {
			expect(algoParamTargetFromSlot(1)).toBe("algoParam1");
			expect(algoParamTargetFromSlot(8)).toBe("algoParam8");
		});

		it("returns undefined for invalid slots", () => {
			expect(algoParamTargetFromSlot(0)).toBeUndefined();
			expect(algoParamTargetFromSlot(9)).toBeUndefined();
			expect(algoParamTargetFromSlot(1.5)).toBeUndefined();
			expect(algoParamTargetFromSlot(NaN)).toBeUndefined();
		});
	});

	describe("resolveModDestination", () => {
		it("returns undefined for undefined target", () => {
			expect(resolveModDestination(undefined)).toBeUndefined();
		});

		it("returns target if it is already a registered mod destination", () => {
			const target = "line1DcwBase" as ModTarget;
			expect(resolveModDestination(target)).toBe(target);
		});

		it("resolves line-scoped targets for line 1", () => {
			expect(resolveModDestination("dcwBase", { lineIndex: 1 })).toBe(
				"line1DcwBase",
			);
			expect(resolveModDestination("dcaBase", { lineIndex: 1 })).toBe(
				"line1DcaBase",
			);
			expect(resolveModDestination("algoBlend", { lineIndex: 1 })).toBe(
				"line1AlgoBlend",
			);
			expect(resolveModDestination("detune", { lineIndex: 1 })).toBe(
				"line1Detune",
			);
			expect(resolveModDestination("octave", { lineIndex: 1 })).toBe(
				"line1Octave",
			);
		});

		it("resolves line-scoped targets for line 2", () => {
			expect(resolveModDestination("dcwBase", { lineIndex: 2 })).toBe(
				"line2DcwBase",
			);
			expect(resolveModDestination("dcaBase", { lineIndex: 2 })).toBe(
				"line2DcaBase",
			);
			expect(resolveModDestination("algoBlend", { lineIndex: 2 })).toBe(
				"line2AlgoBlend",
			);
			expect(resolveModDestination("detune", { lineIndex: 2 })).toBe(
				"line2Detune",
			);
			expect(resolveModDestination("octave", { lineIndex: 2 })).toBe(
				"line2Octave",
			);
		});

		it("resolves algo param slots for line 1", () => {
			expect(resolveModDestination("algoParam1", { lineIndex: 1 })).toBe(
				"line1AlgoParam1",
			);
			expect(resolveModDestination("algoParam8", { lineIndex: 1 })).toBe(
				"line1AlgoParam8",
			);
		});

		it("resolves algo param slots for line 2", () => {
			expect(resolveModDestination("algoParam1", { lineIndex: 2 })).toBe(
				"line2AlgoParam1",
			);
			expect(resolveModDestination("algoParam8", { lineIndex: 2 })).toBe(
				"line2AlgoParam8",
			);
		});

		it("returns undefined for unknown targets", () => {
			expect(
				resolveModDestination("unknown" as unknown as ModTarget),
			).toBeUndefined();
		});
	});
});
