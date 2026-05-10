import { describe, expect, it } from "vitest";
import type { AlgoControlValueV1 } from "@/lib/synth/bindings/synth";
import { ALGO_UI_CATALOG_V1 } from "@/lib/synth/bindings/synth";
import {
	computeWaveform,
	getPdAlgoBehaviorDescription,
	getPdAlgoDef,
	PD_ALGOS,
} from "@/lib/synth/pdAlgorithms";

const baseParams = {
	warpAAmount: 1,
	warpBAmount: 0,
	warpAAlgo: "cz101" as const,
	warpBAlgo: "cz101" as const,
	algo2A: null,
	algo2B: null,
	algoBlendA: 0,
	algoBlendB: 0,
	intPmAmount: 0,
	intPmRatio: 1,
	extPmAmount: 0,
	pmPre: true,
	windowType: "off" as const,
	line1Level: 1,
	line2Level: 0,
	line1BaseWaveformA: "sine" as const,
	line1BaseWaveformB: "sine" as const,
	line2BaseWaveformA: "sine" as const,
	line2BaseWaveformB: "sine" as const,
	sampleCount: 256,
};

function czControls(
	waveform1: number,
	waveform2: number,
): AlgoControlValueV1[] {
	return [
		{ id: "waveform1", value: waveform1 },
		{ id: "waveform2", value: waveform2 },
		{ id: "windowFunction", value: 0 },
	];
}

function maxDelta(
	left: Float32Array,
	right: Float32Array,
	start: number,
	end: number,
): number {
	let max = 0;
	for (let index = start; index < end; index++) {
		max = Math.max(max, Math.abs(left[index] - right[index]));
	}
	return max;
}

describe("pdAlgorithms", () => {
	it("provides a finite SVG icon path for every visible algorithm", () => {
		for (const algo of PD_ALGOS) {
			expect(algo.icon).not.toContain("NaN");
			expect(algo.icon).not.toContain("Infinity");
			expect(algo.icon.startsWith("M")).toBe(true);
		}
	});

	it("stays aligned with visible algo UI catalog entries", () => {
		const visibleIds = ALGO_UI_CATALOG_V1.filter((entry) => entry.visible)
			.map((entry) => entry.id)
			.sort();
		const pdIds = PD_ALGOS.map((entry) => entry.value).sort();

		expect(pdIds).toEqual(visibleIds);
	});

	it("exposes behavior descriptions and defs for new experimental algos", () => {
		for (const id of ["terrain", "stutter", "cheby"] as const) {
			expect(getPdAlgoDef(id)).toBeDefined();
			expect(getPdAlgoBehaviorDescription(id)).not.toHaveLength(0);
		}
	});
});

describe("computeWaveform", () => {
	it("uses CZ101 waveform 2 in the second preview cycle", () => {
		const sawSaw = computeWaveform({
			...baseParams,
			line1AlgoControlsA: czControls(0, 0),
		});
		const squareSquare = computeWaveform({
			...baseParams,
			line1AlgoControlsA: czControls(1, 1),
		});
		const sawSquare = computeWaveform({
			...baseParams,
			line1AlgoControlsA: czControls(0, 1),
		});

		expect(sawSquare.out1[32]).toBeCloseTo(sawSaw.out1[64], 6);
		expect(sawSquare.out1[160]).toBeCloseTo(squareSquare.out1[64], 6);
		expect(sawSquare.out1[160]).not.toBeCloseTo(sawSaw.out1[64], 3);
	});

	it("keeps a single preview cycle when CZ101 waveform slots match", () => {
		const sawSaw = computeWaveform({
			...baseParams,
			line1AlgoControlsA: czControls(0, 0),
		});
		const sawSquare = computeWaveform({
			...baseParams,
			line1AlgoControlsA: czControls(0, 1),
		});

		expect(sawSaw.phase[160]).toBeCloseTo(160 / 256, 6);
		expect(sawSquare.phase[160]).toBeCloseTo(64 / 256, 6);
	});

	it("applies the base waveform after CZ101 phase distortion", () => {
		const sineBase = computeWaveform({
			...baseParams,
			line1BaseWaveformA: "sine",
			line1AlgoControlsA: czControls(0, 0),
		});
		const squareBase = computeWaveform({
			...baseParams,
			line1BaseWaveformA: "square",
			line1AlgoControlsA: czControls(0, 0),
		});

		expect(squareBase.out1[32]).not.toBeCloseTo(sineBase.out1[32], 3);
	});

	it("blends both CZ101 algo slots with their own waveform pairs", () => {
		const blendedSameSecondWave = computeWaveform({
			...baseParams,
			algo2A: "cz101",
			algoBlendA: 0.5,
			line1AlgoControlsA: czControls(0, 0),
			line1AlgoControlsB: czControls(1, 0),
		});
		const blendedDifferentSecondWave = computeWaveform({
			...baseParams,
			algo2A: "cz101",
			algoBlendA: 0.5,
			line1AlgoControlsA: czControls(0, 2),
			line1AlgoControlsB: czControls(1, 3),
		});

		expect(
			maxDelta(
				blendedDifferentSecondWave.out1,
				blendedSameSecondWave.out1,
				0,
				128,
			),
		).toBeLessThan(0.000001);
		expect(
			maxDelta(
				blendedDifferentSecondWave.out1,
				blendedSameSecondWave.out1,
				128,
				256,
			),
		).toBeGreaterThan(0.01);
	});
});
