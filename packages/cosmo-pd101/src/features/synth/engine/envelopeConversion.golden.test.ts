import { describe, expect, it } from "vitest";

import { rawLevelToHuman, rawRateToHuman } from "./envelopeConversion";

type Ek = "dco" | "dcw" | "dca";

describe("envelope conversion golden values (Rust parity)", () => {
	describe("rawRateToHuman", () => {
		it.each<[Ek, number, number]>([
			// DCO: b==0→0, b==127→99, else floor(b*99/127)+1
			["dco", 0, 0],
			["dco", 1, 1],
			["dco", 63, 50],
			["dco", 64, 50],
			["dco", 99, 78],
			["dco", 127, 99],

			// DCW: b<=8→0, b>=127→99, else floor((b-8)*99/119)+1
			["dcw", 0, 0],
			["dcw", 1, 0],
			["dcw", 8, 0],
			["dcw", 9, 1],
			["dcw", 63, 46],
			["dcw", 64, 47],
			["dcw", 99, 76],
			["dcw", 119, 93],
			["dcw", 127, 99],

			// DCA: b==0→0, b>=119→99, else floor(b*99/119)+1
			["dca", 0, 0],
			["dca", 1, 1],
			["dca", 63, 53],
			["dca", 64, 54],
			["dca", 99, 83],
			["dca", 119, 99],
			["dca", 127, 99],
		])("kind=%s raw=%i → %i", (kind, raw, expected) => {
			expect(rawRateToHuman(kind, raw)).toBe(expected);
		});
	});

	describe("rawLevelToHuman", () => {
		it.each<[Ek, number, number]>([
			// DCO: b>63 → b-4, else b
			["dco", 0, 0],
			["dco", 63, 63],
			["dco", 64, 60],
			["dco", 96, 92],
			["dco", 127, 123],

			// DCW: b==0→0, b==127→99, else floor(b*99/127)+1
			["dcw", 0, 0],
			["dcw", 1, 1],
			["dcw", 63, 50],
			["dcw", 64, 50],
			["dcw", 99, 78],
			["dcw", 119, 93],
			["dcw", 127, 99],

			// DCA: b==0→0, else max(0, b-28)
			["dca", 0, 0],
			["dca", 28, 0],
			["dca", 29, 1],
			["dca", 63, 35],
			["dca", 64, 36],
			["dca", 99, 71],
			["dca", 127, 99],
		])("kind=%s raw=%i → %i", (kind, raw, expected) => {
			expect(rawLevelToHuman(kind, raw)).toBe(expected);
		});
	});
});
