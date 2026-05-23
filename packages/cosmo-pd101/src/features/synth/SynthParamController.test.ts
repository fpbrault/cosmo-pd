import { describe, expect, it } from "vitest";
import { visualModulationScale } from "./SynthParamController";

describe("visualModulationScale", () => {
	it("uses the full control span whenever min and max are known", () => {
		expect(
			visualModulationScale({
				destination: "line2DetuneNote",
				min: -11,
				max: 11,
			}),
		).toBe(22);
		expect(
			visualModulationScale({
				destination: "line2DetuneFine",
				min: -60,
				max: 60,
			}),
		).toBe(120);
		expect(
			visualModulationScale({
				destination: "line1Octave",
				min: -2,
				max: 2,
			}),
		).toBe(4);
	});

	it("keeps env-step scaling at raw envelope units when no range is provided", () => {
		expect(
			visualModulationScale({ destination: "line1DcaEnvStep1Level" }),
		).toBe(127);
		expect(visualModulationScale({ destination: "line2DcoEnvStep8Rate" })).toBe(
			127,
		);
	});

	it("falls back to unit scale for regular normalized destinations", () => {
		expect(visualModulationScale({ destination: "volume" })).toBe(1);
		expect(visualModulationScale({ destination: "delayMix" })).toBe(1);
	});
});
