import { describe, expect, it } from "vitest";
import { ALGO_UI_CATALOG_V1 } from "@/lib/synth/bindings/synth";
import {
	getPdAlgoBehaviorDescription,
	getPdAlgoDef,
	PD_ALGOS,
} from "@/lib/synth/pdAlgorithms";

describe("pdAlgorithms", () => {
	it("provides a finite SVG icon path for every visible algorithm", () => {
		for (const algo of PD_ALGOS) {
			expect(algo.icon).not.toContain("NaN");
			expect(algo.icon).not.toContain("Infinity");
			expect(algo.icon.startsWith("M")).toBe(true);
		}
	});

	it("stays aligned with visible algo UI catalog entries", () => {
		const visibleIds = ALGO_UI_CATALOG_V1.filter((entry) => entry.visible)
			.map((entry) => entry.id)
			.sort();
		const pdIds = PD_ALGOS.map((entry) => entry.value).sort();

		expect(pdIds).toEqual(visibleIds);
	});

	it("exposes behavior descriptions and defs for new experimental algos", () => {
		for (const id of ["terrain", "stutter", "cheby"] as const) {
			expect(getPdAlgoDef(id)).toBeDefined();
			expect(getPdAlgoBehaviorDescription(id)).not.toHaveLength(0);
		}
	});
});
