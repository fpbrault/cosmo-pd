import { describe, expect, it } from "vitest";
import {
	getLine2EffectiveOctave,
	setLine2EffectiveOctave,
} from "./PerformanceLineSection";

describe("Simple line octave mapping", () => {
	it("derives the effective Line 2 octave from base and detune", () => {
		expect(getLine2EffectiveOctave(1, -2)).toBe(-1);
		expect(getLine2EffectiveOctave(-1, 3)).toBe(2);
	});

	it("maps an effective Line 2 octave back to the bounded relative offset", () => {
		expect(setLine2EffectiveOctave(2, 1)).toBe(1);
		expect(setLine2EffectiveOctave(8, 0)).toBe(3);
		expect(setLine2EffectiveOctave(-8, 0)).toBe(-3);
	});
});
