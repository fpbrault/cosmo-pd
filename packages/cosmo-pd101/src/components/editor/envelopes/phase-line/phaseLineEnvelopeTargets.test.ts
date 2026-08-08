import { describe, expect, it, vi } from "vitest";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { createPhaseLineEnvelopeTargets } from "./phaseLineEnvelopeTargets";

const makeEnv = (value: number): StepEnvData => ({
	steps: Array.from({ length: 8 }, () => ({ level: value, rate: value })),
	sustainStep: 0,
	stepCount: 1,
	loop: false,
});

describe("createPhaseLineEnvelopeTargets", () => {
	it("maps all six line/envelope setters in stable target order", () => {
		const targets = createPhaseLineEnvelopeTargets({
			line1: {
				dco: { env: makeEnv(1), setEnv: vi.fn() },
				dcw: { env: makeEnv(2), setEnv: vi.fn() },
				dca: { env: makeEnv(3), setEnv: vi.fn() },
			},
			line2: {
				dco: { env: makeEnv(4), setEnv: vi.fn() },
				dcw: { env: makeEnv(5), setEnv: vi.fn() },
				dca: { env: makeEnv(6), setEnv: vi.fn() },
			},
		});

		expect(targets.map((target) => target.id)).toEqual([
			"line1-dco",
			"line1-dcw",
			"line1-dca",
			"line2-dco",
			"line2-dcw",
			"line2-dca",
		]);
		expect(targets.map((target) => target.env.steps[0].level)).toEqual([
			1, 2, 3, 4, 5, 6,
		]);
	});
});
