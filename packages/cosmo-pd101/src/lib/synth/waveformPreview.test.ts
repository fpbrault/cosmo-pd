import { describe, expect, it } from "vitest";
import { getAlgoIconPath, noteToFreq } from "./waveformPreview";

describe("waveformPreview", () => {
	it("returns the fixed CZ monogram path for cz101", () => {
		expect(getAlgoIconPath("cz101")).toBe(
			"M10.8 7.8C8.6 7.8 7.2 9.3 7.2 12C7.2 14.7 8.6 16.2 10.8 16.2M13.6 8H18.2L13.9 12H18.2L13.6 16H18.2",
		);
	});

	it("generates an SVG path for non-CZ algorithms", () => {
		const path = getAlgoIconPath("bend");

		expect(path).toMatch(/^M/);
		expect(path).toContain("L");
		expect(path.length).toBeGreaterThan(20);
	});

	it("converts MIDI note numbers to frequency", () => {
		expect(noteToFreq(69)).toBe(440);
		expect(noteToFreq(81)).toBeCloseTo(880, 6);
	});
});
