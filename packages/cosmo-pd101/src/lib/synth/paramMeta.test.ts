import { describe, expect, it } from "vitest";
import { ENGINE_PARAM_UI_META_V1 } from "@/lib/synth/bindings/synth";
import {
	ENGINE_PARAM_UI_META_BY_KEY,
	getEngineParamDefault,
	getEngineParamUiMeta,
	getEnumTooltip,
	getParamTooltip,
	isNativeMidiMappingParamKey,
	requireEngineParamDefault,
} from "./paramMeta";

describe("paramMeta", () => {
	it("resolves translated parameter tooltips at call time", () => {
		expect(getParamTooltip("portamentoRate")).toBe(
			"Sets glide speed when portamento mode is Rate.",
		);
		expect(getParamTooltip("pitchBendRange")).toBe(
			"Sets maximum pitch bend range in semitones.",
		);
		expect(getParamTooltip("velocityCurve")).toBe(
			"Shapes how keyboard velocity maps to output level.",
		);
		expect(getParamTooltip("line1Level")).toBe(
			"Sets base output level for line 1.",
		);
		expect(getParamTooltip("line2Level")).toBe(
			"Sets base output level for line 2.",
		);
		expect(getParamTooltip("warpBAmount")).toBe(
			"Sets amount of phase distortion applied to line 2.",
		);
	});

	it("resolves descriptive enum-value tooltips at call time", () => {
		expect(getEnumTooltip("lineSelect", "L1")).toBe(
			"Play oscillator line 1 only.",
		);
		expect(getEnumTooltip("lineSelect", "L2")).toBe(
			"Play oscillator line 2 only.",
		);
	});

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
