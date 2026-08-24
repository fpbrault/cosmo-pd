import { describe, expect, it } from "vitest";
import {
	calculateLogFrequencyBands,
	resampleFrequencyBins,
	resampleWaveformWindow,
} from "./audioSpectrum";

describe("performance audio spectrum", () => {
	it("returns bounded logarithmic bands for time-domain audio", () => {
		const samples = Float32Array.from({ length: 1024 }, (_, index) =>
			Math.sin((2 * Math.PI * 440 * index) / 44_100),
		);
		const bands = calculateLogFrequencyBands(samples, 44_100, 64);
		expect(bands).toHaveLength(64);
		expect(Math.max(...bands)).toBeGreaterThan(0.25);
		expect(Math.max(...bands)).toBeLessThanOrEqual(1);
	});

	it("resamples analyser bins to the requested performance budget", () => {
		const bins = new Uint8Array(512);
		bins.fill(128);
		expect(resampleFrequencyBins(bins, 48_000, 48)).toHaveLength(48);
	});

	it("resamples a bounded time-domain window for scope history", () => {
		const samples = Float32Array.from([-1, -0.5, 0, 0.5, 1, 0]);
		expect(Array.from(resampleWaveformWindow(samples, 1, 4, 3))).toEqual([
			-0.5, 0, 1,
		]);
		expect(
			Array.from(
				resampleWaveformWindow(Uint8Array.from([0, 128, 255]), 0, 3, 3),
			),
		).toEqual([-1, 0, 0.9921875]);
	});
});
