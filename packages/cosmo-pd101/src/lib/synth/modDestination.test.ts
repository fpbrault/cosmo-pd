import { describe, expect, it } from "vitest";
import {
	algoControlTargetFromSlot,
	type ModTarget,
	normalizeAlgoSlotKey,
	resolveModDestination,
} from "./modDestination";

describe("modDestination", () => {
	describe("algoControlTargetFromSlot", () => {
		it("returns correct slot target for valid slots", () => {
			expect(algoControlTargetFromSlot(1)).toBe("algoControl1");
			expect(algoControlTargetFromSlot(8)).toBe("algoControl8");
		});

		it("returns undefined for invalid slots", () => {
			expect(algoControlTargetFromSlot(0)).toBeUndefined();
			expect(algoControlTargetFromSlot(9)).toBeUndefined();
			expect(algoControlTargetFromSlot(1.5)).toBeUndefined();
			expect(algoControlTargetFromSlot(NaN)).toBeUndefined();
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

		it("resolves algo control slots for line 1", () => {
			expect(resolveModDestination("algoControl1", { lineIndex: 1 })).toBe(
				"line1AlgoControl1",
			);
			expect(resolveModDestination("algoControl8", { lineIndex: 1 })).toBe(
				"line1AlgoControl8",
			);
		});

		it("resolves algo control slots for line 2", () => {
			expect(resolveModDestination("algoControl1", { lineIndex: 2 })).toBe(
				"line2AlgoControl1",
			);
			expect(resolveModDestination("algoControl8", { lineIndex: 2 })).toBe(
				"line2AlgoControl8",
			);
		});

		it("returns undefined for unknown targets", () => {
			expect(
				resolveModDestination("unknown" as unknown as ModTarget),
			).toBeUndefined();
		});
	});

	describe("normalizeAlgoSlotKey", () => {
		it("migrates legacy algo-param keys and leaves canonical keys unchanged", () => {
			expect(normalizeAlgoSlotKey("line1AlgoParam1")).toBe("line1AlgoControl1");
			expect(normalizeAlgoSlotKey("line2AlgoParam8")).toBe("line2AlgoControl8");
			expect(normalizeAlgoSlotKey("line1AlgoControl1")).toBe(
				"line1AlgoControl1",
			);
		});
	});
});
