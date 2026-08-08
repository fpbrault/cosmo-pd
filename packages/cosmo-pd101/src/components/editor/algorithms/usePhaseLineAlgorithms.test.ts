import { describe, expect, it } from "vitest";
import type { AlgoControlRuntime } from "@/components/controls/algo/algoControlTypes";
import { assignAlgoControlSlots } from "./usePhaseLineAlgorithms";

function controls(
	entries: Array<[string, AlgoControlRuntime["kind"]?]>,
): AlgoControlRuntime[] {
	return entries.map(([id, kind]) => ({ id, algo: "bend", kind }));
}

describe("assignAlgoControlSlots", () => {
	it("assigns Algo A numeric controls before Algo B and skips other kinds", () => {
		const result = assignAlgoControlSlots(
			controls([
				["a1", "number"],
				["select", "select"],
				["a2", undefined],
			]),
			controls([
				["toggle", "toggle"],
				["b1", "number"],
			]),
		);

		expect(result).toEqual({
			slotIndexA: { a1: 1, a2: 2 },
			slotIndexB: { b1: 3 },
		});
	});

	it("assigns at most eight slots across both algos", () => {
		const result = assignAlgoControlSlots(
			controls(Array.from({ length: 6 }, (_, index) => [`a${index + 1}`])),
			controls(Array.from({ length: 4 }, (_, index) => [`b${index + 1}`])),
		);

		expect(Object.values(result.slotIndexA)).toEqual([1, 2, 3, 4, 5, 6]);
		expect(result.slotIndexB).toEqual({ b1: 7, b2: 8 });
	});
});
