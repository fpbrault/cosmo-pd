import { describe, expect, it } from "vitest";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import {
	clamp,
	formatAlgoBlendReadout,
	getEnvelopeVoiceProgress,
} from "./perLineWarpUtils";

describe("clamp", () => {
	it("returns value within range", () => {
		expect(clamp(5, 0, 10)).toBe(5);
	});

	it("clamps below minimum", () => {
		expect(clamp(-5, 0, 10)).toBe(0);
	});

	it("clamps above maximum", () => {
		expect(clamp(15, 0, 10)).toBe(10);
	});

	it("handles edge values exactly", () => {
		expect(clamp(0, 0, 10)).toBe(0);
		expect(clamp(10, 0, 10)).toBe(10);
	});
});

describe("formatAlgoBlendReadout", () => {
	it("returns 100% A for blend 0", () => {
		expect(formatAlgoBlendReadout(0)).toBe("A 100% | B 0%");
	});

	it("returns 100% B for blend 1", () => {
		expect(formatAlgoBlendReadout(1)).toBe("A 0% | B 100%");
	});

	it("returns equal split for blend 0.5", () => {
		expect(formatAlgoBlendReadout(0.5)).toBe("A 50% | B 50%");
	});

	it("clamps negative blend", () => {
		expect(formatAlgoBlendReadout(-0.5)).toBe("A 100% | B 0%");
	});

	it("clamps blend above 1", () => {
		expect(formatAlgoBlendReadout(1.5)).toBe("A 0% | B 100%");
	});

	it("rounds fractional blend to nearest percent", () => {
		const result = formatAlgoBlendReadout(0.333);
		expect(result).toBe("A 67% | B 33%");
	});
});

describe("getEnvelopeVoiceProgress", () => {
	const makeEnv = (overrides: Partial<StepEnvData> = {}): StepEnvData => ({
		steps: [
			{ level: 0, rate: 50 },
			{ level: 99, rate: 50 },
			{ level: 50, rate: 50 },
		],
		stepCount: 3,
		sustainStep: 0,
		loop: false,
		...overrides,
	});

	it("returns 1 when value is at or above targetLevel", () => {
		const env = makeEnv({ stepCount: 3 });
		const progress = getEnvelopeVoiceProgress(env, 1, 99);
		expect(progress).toBe(1);
	});

	it("returns 0 when value equals previousLevel", () => {
		const env = makeEnv({ stepCount: 3 });
		const progress = getEnvelopeVoiceProgress(env, 1, 0);
		expect(progress).toBe(0);
	});

	it("returns undefined when current step is missing (empty steps)", () => {
		const env = makeEnv({
			steps: [],
			stepCount: 0,
		});
		const progress = getEnvelopeVoiceProgress(env, 0, 0);
		expect(progress).toBeUndefined();
	});

	it("returns undefined when distance between levels is zero", () => {
		const env = makeEnv();
		const progress = getEnvelopeVoiceProgress(env, 0, 0);
		expect(progress).toBeUndefined();
	});

	it("returns 0 when end step has target 0 and value matches previousLevel", () => {
		const env = makeEnv({ stepCount: 3 });
		const result = getEnvelopeVoiceProgress(env, 2, 25);
		expect(result).toBe(0);
	});

	it("negative step clamped to 0, distance zero returns undefined", () => {
		const env = makeEnv();
		const progress = getEnvelopeVoiceProgress(env, -1, 0);
		expect(progress).toBeUndefined();
	});

	it("step > max clamped to last step (end step)", () => {
		const env = makeEnv({ stepCount: 3 });
		const progress = getEnvelopeVoiceProgress(env, 999, 25);
		expect(progress).toBe(0);
	});

	it("clamps negative progress to 0", () => {
		const env = makeEnv({ stepCount: 3 });
		const progress = getEnvelopeVoiceProgress(env, 1, -50);
		expect(progress).toBe(0);
	});

	it("clamps progress above 1 to 1", () => {
		const env = makeEnv({ stepCount: 3 });
		const progress = getEnvelopeVoiceProgress(env, 1, 150);
		expect(progress).toBe(1);
	});
});
