import { describe, expect, it } from "vitest";
import type { Algo, WindowType } from "@/lib/synth/bindings/synth";
import {
	pdBend,
	pdCheby,
	pdClip,
	pdCz101,
	pdFold,
	pdMirror,
	pdPinch,
	pdRipple,
	pdSkew,
	pdStutter,
	pdSync,
	pdTerrain,
	pdTwist,
} from "./pdAlgorithms";
import { computeWaveform } from "./waveformPreview";

describe("pdAlgorithms", () => {
	describe("pdBend", () => {
		it("returns phase when amount is 0", () => {
			expect(pdBend(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdBend(p, a)).not.toBe(p);
		});
	});

	describe("pdSync", () => {
		it("returns phase when amount is 0", () => {
			expect(pdSync(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdSync(p, a)).not.toBe(p);
		});
	});

	describe("pdPinch", () => {
		it("returns phase when amount is 0", () => {
			expect(pdPinch(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdPinch(p, a)).not.toBe(p);
		});
	});

	describe("pdFold", () => {
		it("applies a baseline fold even when amount is 0", () => {
			const p = 0.25;
			const a = 0;
			const res = pdFold(p, a);
			expect(res).not.toBe(p);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdFold(p, a)).not.toBe(p);
		});
	});

	describe("pdSkew", () => {
		it("returns phase when amount is 0", () => {
			expect(pdSkew(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdSkew(p, a)).not.toBe(p);
		});
	});

	describe("pdTwist", () => {
		it("returns phase when amount is 0", () => {
			expect(pdTwist(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdTwist(p, a)).not.toBe(p);
		});
	});

	describe("pdClip", () => {
		it("returns a value between 0 and 1", () => {
			const res = pdClip(0.5, 0.5);
			expect(res).toBeGreaterThanOrEqual(0);
			expect(res).toBeLessThanOrEqual(1);
		});
	});

	describe("pdRipple", () => {
		it("returns phase when amount is 0", () => {
			expect(pdRipple(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdRipple(p, a)).not.toBe(p);
		});
	});

	describe("pdMirror", () => {
		it("returns phase when amount is 0", () => {
			expect(pdMirror(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdMirror(p, a)).not.toBe(p);
		});
	});

	describe("pdTerrain", () => {
		it("returns phase when amount is 0", () => {
			expect(pdTerrain(0.1, 0)).toBe(0.1);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.1;
			const a = 0.5;
			expect(pdTerrain(p, a)).not.toBe(p);
		});
	});

	describe("pdStutter", () => {
		it("returns phase when amount is 0", () => {
			expect(pdStutter(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdStutter(p, a)).not.toBe(p);
		});
	});

	describe("pdCheby", () => {
		it("returns phase when amount is 0", () => {
			expect(pdCheby(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdCheby(p, a)).not.toBe(p);
		});
	});

	describe("pdCz101", () => {
		it("returns phase when amount is 0", () => {
			expect(pdCz101(0.5, 0)).toBe(0.5);
		});

		it("warps phase when amount is non-zero", () => {
			const p = 0.25;
			const a = 0.5;
			expect(pdCz101(p, a)).not.toBe(p);
		});
	});

	describe("computeWaveform", () => {
		it("computes waveform data", () => {
			const params = {
				warpAAmount: 0.5,
				warpBAmount: 0.5,
				warpAAlgo: "bend" as Algo,
				warpBAlgo: "sync" as Algo,
				algo2A: null,
				algo2B: null,
				algoBlendA: 0.5,
				algoBlendB: 0.5,
				intPmAmount: 0.1,
				intPmRatio: 1,
				extPmAmount: 0.1,
				pmPre: true,
				windowType: "off" as WindowType,
				line1Level: 1,
				line2Level: 1,
			};
			const result = computeWaveform(params);
			expect(result.out1).toBeInstanceOf(Float32Array);
			expect(result.out2).toBeInstanceOf(Float32Array);
			expect(result.phase).toBeInstanceOf(Float32Array);
		});

		it("computes waveform with secondary algorithms and pmPre false", () => {
			const params = {
				warpAAmount: 0.5,
				warpBAmount: 0.5,
				warpAAlgo: "bend" as Algo,
				warpBAlgo: "sync" as Algo,
				algo2A: "pinch" as Algo,
				algo2B: "fold" as Algo,
				algoBlendA: 0.3,
				algoBlendB: 0.7,
				intPmAmount: 0.2,
				intPmRatio: 2,
				extPmAmount: 0.1,
				pmPre: false,
				windowType: "saw" as WindowType,
				line1Level: 0.8,
				line2Level: 0.6,
			};
			const result = computeWaveform(params);
			expect(result.out1).toBeInstanceOf(Float32Array);
			expect(result.out2).toBeInstanceOf(Float32Array);
			expect(result.phase).toBeInstanceOf(Float32Array);
		});
	});
});
