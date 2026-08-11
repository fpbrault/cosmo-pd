import { describe, expect, it } from "vitest";
import {
	DEFAULT_SYNTH_PARAMS_V1,
	SYNTHESIS_ENGINE_DEFINITIONS_V1,
} from "./bindings/synth";
import { SYNTHESIS_ENGINE_UI_DEFINITIONS } from "./synthesisEngineRegistry";

describe("synthesis engine registry", () => {
	it("exposes the stable PD method and matches generated defaults", () => {
		expect(SYNTHESIS_ENGINE_DEFINITIONS_V1).toEqual([
			expect.objectContaining({
				method: "pd",
			}),
			expect.objectContaining({
				method: "vz",
			}),
		]);
		expect(SYNTHESIS_ENGINE_UI_DEFINITIONS.pd).toEqual({
			name: "PD / Warp",
			primaryPageLabel: "WAVE FORM",
			secondaryPageLabel: "ENV",
		});
		expect(DEFAULT_SYNTH_PARAMS_V1.line1.engine.type).toBe("pd");
		expect(DEFAULT_SYNTH_PARAMS_V1.line2.engine.type).toBe("pd");
	});

	it("exposes the VZ method with a four-oscillator, no-tail capability set", () => {
		expect(SYNTHESIS_ENGINE_UI_DEFINITIONS.vz).toEqual({
			name: "VZ / iPD",
			primaryPageLabel: "MODULES",
			secondaryPageLabel: "ENV",
		});
		const vz = SYNTHESIS_ENGINE_DEFINITIONS_V1.find(
			(entry) => entry.method === "vz",
		);
		expect(vz?.capabilities).toEqual({
			oscillatorCount: 4,
			envelopeCount: 3,
			hasVoiceFilter: false,
			hasInternalTail: false,
		});
		expect(vz?.envelopeTargets.map((target) => target.role)).toEqual([
			"pitch",
			"warp",
			"amplitude",
		]);
	});

	it("covers every SynthesisMethod in the UI registry", () => {
		const definedMethods = SYNTHESIS_ENGINE_DEFINITIONS_V1.map(
			(entry) => entry.method,
		);
		for (const method of definedMethods) {
			expect(SYNTHESIS_ENGINE_UI_DEFINITIONS[method]).toBeDefined();
		}
	});

	it("keeps registry methods unique", () => {
		const methods = SYNTHESIS_ENGINE_DEFINITIONS_V1.map(
			(entry) => entry.method,
		);
		expect(new Set(methods).size).toBe(methods.length);
	});
});
