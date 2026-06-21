import { describe, expect, it } from "vitest";
import { ENGINE_PARAM_UI_META_V1 } from "@/lib/synth/bindings/synth";
import {
	ENGINE_PARAM_UI_META_BY_KEY,
	getEngineParamDefault,
	getEngineParamUiMeta,
	isNativeMidiMappingParamKey,
	requireEngineParamDefault,
} from "./paramMeta";

describe("paramMeta", () => {
	it("getEngineParamDefault returns default for existing params", () => {
		const meta = ENGINE_PARAM_UI_META_V1.find(
			(m) => typeof m.paramDefault === "number",
		);
		if (meta) {
			expect(getEngineParamDefault(meta.key)).toBe(meta.paramDefault);
		} else {
			// Fallback if no param has a numeric default in the provided mock/data
			expect(getEngineParamDefault("nonexistent")).toBeUndefined();
		}
	});

	it("getEngineParamDefault returns undefined for nonexistent params", () => {
		expect(getEngineParamDefault("nonexistent")).toBeUndefined();
	});

	it("requireEngineParamDefault returns default for existing params", () => {
		const meta = ENGINE_PARAM_UI_META_V1.find(
			(m) => typeof m.paramDefault === "number",
		);
		if (meta) {
			expect(requireEngineParamDefault(meta.key)).toBe(meta.paramDefault);
		}
	});

	it("requireEngineParamDefault throws for nonexistent params", () => {
		expect(() => requireEngineParamDefault("nonexistent")).toThrow(
			"Missing engine numeric default for parameter: nonexistent",
		);
	});

	it("getEngineParamUiMeta returns metadata for existing params", () => {
		const meta = ENGINE_PARAM_UI_META_V1[0];
		expect(getEngineParamUiMeta(meta.key)).toBeDefined();
		expect(getEngineParamUiMeta(meta.key)?.key).toBe(meta.key);
	});

	it("getEngineParamUiMeta returns undefined for nonexistent params", () => {
		expect(getEngineParamUiMeta("nonexistent")).toBeUndefined();
	});

	it("ENGINE_PARAM_UI_META_BY_KEY contains all metadata from ENGINE_PARAM_UI_META_V1", () => {
		expect(Object.keys(ENGINE_PARAM_UI_META_BY_KEY).length).toBe(
			ENGINE_PARAM_UI_META_V1.length,
		);
	});

	it("recognizes exactly the sixteen canonical algo-control MIDI keys", () => {
		for (const line of [1, 2]) {
			for (let slot = 1; slot <= 8; slot++) {
				expect(
					isNativeMidiMappingParamKey(`line${line}AlgoControl${slot}`),
				).toBe(true);
			}
		}
		for (const invalid of [
			"line0AlgoControl1",
			"line1AlgoControl0",
			"line1AlgoControl9",
			"line1AlgoParam1",
		]) {
			expect(isNativeMidiMappingParamKey(invalid)).toBe(false);
		}
	});
});
