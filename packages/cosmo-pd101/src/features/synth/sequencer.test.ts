import { describe, expect, it } from "vitest";
import {
	DEFAULT_SEQUENCER_PARAMS,
	normalizeSequencerParams,
} from "./sequencer";

describe("normalizeSequencerParams", () => {
	it("fills missing legacy preset fields with safe defaults", () => {
		const normalized = normalizeSequencerParams(undefined);

		expect(normalized).toMatchObject({
			enabled: false,
			mode: "arpeggiator",
			rate: "eighth",
			patternLength: 8,
		});
		expect(normalized.steps).toHaveLength(16);
		expect(normalized.steps?.every((step) => step.enabled)).toBe(true);
	});

	it("clamps values without mutating the input pattern", () => {
		const input = {
			...DEFAULT_SEQUENCER_PARAMS,
			patternLength: 99,
			swing: 2,
			steps: DEFAULT_SEQUENCER_PARAMS.steps?.map((step, index) =>
				index === 0
					? { ...step, pitch: -99, velocity: 2, probability: -1 }
					: step,
			) as typeof DEFAULT_SEQUENCER_PARAMS.steps,
		};

		const normalized = normalizeSequencerParams(input);

		expect(normalized.patternLength).toBe(16);
		expect(normalized.swing).toBe(0.5);
		expect(normalized.steps?.[0]).toMatchObject({
			pitch: -24,
			velocity: 1,
			probability: 0,
		});
		expect(input.patternLength).toBe(99);
	});
});
