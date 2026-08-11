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
		]);
		expect(SYNTHESIS_ENGINE_UI_DEFINITIONS.pd).toEqual({
			name: "PD / Warp",
			primaryPageLabel: "WAVE FORM",
			secondaryPageLabel: "ENV",
		});
		expect(DEFAULT_SYNTH_PARAMS_V1.line1.engine.type).toBe("pd");
		expect(DEFAULT_SYNTH_PARAMS_V1.line2.engine.type).toBe("pd");
	});

	it("keeps registry methods unique", () => {
		const methods = SYNTHESIS_ENGINE_DEFINITIONS_V1.map(
			(entry) => entry.method,
		);
		expect(new Set(methods).size).toBe(methods.length);
	});
});
