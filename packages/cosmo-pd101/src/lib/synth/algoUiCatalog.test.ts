import { afterEach, describe, expect, it, vi } from "vitest";
import { i18n } from "@/i18n";
import { ALGO_UI_CATALOG_V1 } from "@/lib/synth/bindings/synth";
import {
	algoUsesBaseWaveform,
	getPdAlgoBehaviorDescription,
	PD_ALGOS,
} from "./algoUiCatalog";

describe("algoUiCatalog", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("exposes the visible algorithm catalog with stable keys and icons", () => {
		const visibleIds = ALGO_UI_CATALOG_V1.filter((entry) => entry.visible).map(
			(entry) => entry.id,
		);

		expect(PD_ALGOS.map((entry) => entry.value)).toEqual(visibleIds);
		for (const entry of PD_ALGOS) {
			expect(entry.key).toBe(entry.value);
			expect(entry.icon.length).toBeGreaterThan(0);
		}
	});

	it("reports whether an algorithm uses the base waveform", () => {
		expect(algoUsesBaseWaveform("bend")).toBe(true);
	});

	it("falls back when no translated behavior text exists", () => {
		vi.spyOn(i18n, "t").mockReturnValue("");

		expect(getPdAlgoBehaviorDescription("bend")).toBe(
			"Phase-distortion algorithm with a distinct harmonic shaping profile.",
		);
	});
});
