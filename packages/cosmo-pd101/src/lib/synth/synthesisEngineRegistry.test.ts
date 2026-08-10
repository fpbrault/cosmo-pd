import { describe, expect, it } from "vitest";
import {
	DEFAULT_SYNTH_PARAMS_V1,
	SYNTHESIS_ENGINE_DEFINITIONS_V1,
} from "./bindings/synth";

describe("synthesis engine registry", () => {
	it("exposes the stable PD method and matches generated defaults", () => {
		expect(SYNTHESIS_ENGINE_DEFINITIONS_V1).toEqual([
			expect.objectContaining({
				id: "pd",
				method: "pd",
				primaryPageLabel: "WAVE FORM",
				secondaryPageLabel: "ENV",
			}),
		]);
		expect(DEFAULT_SYNTH_PARAMS_V1.line1.synthesisMethod).toBe("pd");
		expect(DEFAULT_SYNTH_PARAMS_V1.line2.synthesisMethod).toBe("pd");
	});

	it("keeps registry ids and methods unique", () => {
		const ids = SYNTHESIS_ENGINE_DEFINITIONS_V1.map((entry) => entry.id);
		const methods = SYNTHESIS_ENGINE_DEFINITIONS_V1.map(
			(entry) => entry.method,
		);
		expect(new Set(ids).size).toBe(ids.length);
		expect(new Set(methods).size).toBe(methods.length);
	});
});
