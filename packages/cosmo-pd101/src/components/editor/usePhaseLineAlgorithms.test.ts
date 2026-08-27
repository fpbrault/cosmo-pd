import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AlgoControlRuntime } from "@/components/controls/algo/algoControlTypes";
import type { PhaseLineAlgoModel } from "./phaseLineTypes";
import {
	assignAlgoControlSlots,
	usePhaseLineAlgorithms,
} from "./usePhaseLineAlgorithms";

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

	it("keeps a disabled B selector interactive and initializes a replacement", () => {
		const model = {
			algoA: "bend",
			setAlgoA: vi.fn(),
			algoB: null,
			setAlgoB: vi.fn(),
			blend: 0.5,
			setBlend: vi.fn(),
			baseWaveformA: "sine",
			setBaseWaveformA: vi.fn(),
			baseWaveformB: "sine",
			setBaseWaveformB: vi.fn(),
			controlsA: [],
			setControlsA: vi.fn(),
			updateControlA: vi.fn(),
			controlsB: [],
			setControlsB: vi.fn(),
			updateControlB: vi.fn(),
		} as unknown as PhaseLineAlgoModel;
		const { result } = renderHook(() => usePhaseLineAlgorithms(model));

		expect(result.current.slotB).toMatchObject({
			value: null,
			allowNone: true,
			controlsDisabled: true,
			controls: [],
		});
		result.current.slotB.onChange("bend");
		expect(model.setAlgoB).toHaveBeenCalledWith("bend");
		expect(model.setControlsB).toHaveBeenCalled();
	});
});
