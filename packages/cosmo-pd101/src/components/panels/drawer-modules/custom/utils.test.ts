import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";

const { mockT, mockParamMeta, mockFxDefinitions } = vi.hoisted(() => {
	const mockT = vi.fn();
	const mockParamMeta: Record<string, { tooltip: string }> = {};
	const mockFxDefinitions: {
		slotType: string;
		controls: { id: string; modDestinationKey: string | null }[];
	}[] = [];
	return { mockT, mockParamMeta, mockFxDefinitions };
});

vi.mock("@/i18n", () => ({ i18n: { t: mockT } }));
vi.mock("@/lib/synth/paramMeta", () => ({ PARAM_META: mockParamMeta }));
vi.mock("@/lib/synth/bindings/synth", () => ({
	FX_DEFINITIONS_V1: mockFxDefinitions,
}));

const {
	asNumber,
	getKnobControl,
	getButtonGroupControl,
	resolveEnabled,
	getTooltip,
	getFxControlLabel,
	getFxControlOptionLabel,
	getFxControlTooltip,
	resolvePresetPatchParams,
	getModDestinationByParam,
} = await import("./utils");

beforeEach(() => {
	mockT.mockReturnValue("");
	mockT.mockClear();
	delete mockParamMeta.rate;
	delete mockParamMeta.delay;
	mockFxDefinitions.length = 0;
});

describe("asNumber", () => {
	it("returns finite numbers as-is", () => {
		expect(asNumber(42, 0)).toBe(42);
		expect(asNumber(0, 0)).toBe(0);
		expect(asNumber(-3.14, 0)).toBe(-3.14);
	});

	it("maps true to 1 and false to 0", () => {
		expect(asNumber(true, 99)).toBe(1);
		expect(asNumber(false, 99)).toBe(0);
	});

	it("returns fallback for null, undefined, strings", () => {
		expect(asNumber(null, 10)).toBe(10);
		expect(asNumber(undefined, 10)).toBe(10);
		expect(asNumber("text", 10)).toBe(10);
	});

	it("returns fallback for Infinity and -Infinity", () => {
		expect(asNumber(Infinity, 99)).toBe(99);
		expect(asNumber(-Infinity, 99)).toBe(99);
	});

	it("returns fallback for NaN", () => {
		expect(asNumber(NaN, 99)).toBe(99);
	});
});

describe("getKnobControl", () => {
	const config = {
		controls: [
			{ kind: "knob", param: "rate" },
			{ kind: "knob", param: "depth" },
			{ kind: "buttonGroup", param: "mode" },
		],
	} as FxSlotModuleConfig;

	it("finds knob by param", () => {
		expect(getKnobControl(config, "rate")).toEqual(
			expect.objectContaining({ kind: "knob", param: "rate" }),
		);
	});

	it("returns undefined when not found", () => {
		expect(getKnobControl(config, "nonexistent")).toBeUndefined();
	});

	it("ignores non-knob controls", () => {
		expect(getKnobControl(config, "mode")).toBeUndefined();
	});
});

describe("getButtonGroupControl", () => {
	const config = {
		controls: [
			{ kind: "knob", param: "rate" },
			{ kind: "buttonGroup", param: "mode" },
		],
	} as FxSlotModuleConfig;

	it("finds buttonGroup by param", () => {
		expect(getButtonGroupControl(config, "mode")).toEqual(
			expect.objectContaining({ kind: "buttonGroup", param: "mode" }),
		);
	});

	it("returns undefined when not found", () => {
		expect(getButtonGroupControl(config, "nonexistent")).toBeUndefined();
	});

	it("ignores non-buttonGroup controls", () => {
		expect(getButtonGroupControl(config, "rate")).toBeUndefined();
	});
});

describe("resolveEnabled", () => {
	it("returns true when params.enabled is truthy", () => {
		expect(resolveEnabled({ enabled: true })).toBe(true);
		expect(resolveEnabled({ enabled: 1 })).toBe(true);
	});

	it("returns false when params.enabled is falsy", () => {
		expect(resolveEnabled({ enabled: false })).toBe(false);
		expect(resolveEnabled({ enabled: 0 })).toBe(false);
	});

	it("returns false when enabled is missing", () => {
		expect(resolveEnabled({})).toBe(false);
	});
});

describe("getTooltip", () => {
	it("returns i18n tooltip when available", () => {
		mockT.mockReturnValueOnce("I18n tooltip");
		expect(getTooltip("rate")).toBe("I18n tooltip");
	});

	it("returns PARAM_META tooltip when i18n empty and tooltip differs from key", () => {
		mockParamMeta.rate = { tooltip: "Rate tooltip" };
		expect(getTooltip("rate")).toBe("Rate tooltip");
	});

	it("falls through when PARAM_META tooltip equals the key", () => {
		mockParamMeta.rate = { tooltip: "rate" };
		expect(getTooltip("rate")).toBe("Rate");
	});

	it("falls through when PARAM_META has no entry", () => {
		expect(getTooltip("someParam")).toBe("Some Param");
	});
});

describe("getFxControlLabel", () => {
	it("returns i18n fx label when available", () => {
		mockT.mockReturnValueOnce("FX Label");
		expect(getFxControlLabel("delay", "time", "rate")).toBe("FX Label");
	});

	it("falls back to param label when fx label empty and paramKey provided", () => {
		mockT.mockReturnValueOnce("");
		mockT.mockReturnValueOnce("Param Label");
		expect(getFxControlLabel("delay", "time", "rate")).toBe("Param Label");
	});

	it("falls back to humanizeIdentifier when fx label and param label empty with paramKey", () => {
		mockT.mockReturnValue("");
		expect(getFxControlLabel("delay", "tapeMode", "some")).toBe("Tape Mode");
	});

	it("falls back to humanizeIdentifier when no paramKey", () => {
		mockT.mockReturnValue("");
		expect(getFxControlLabel("delay", "tapeMode")).toBe("Tape Mode");
	});
});

describe("getFxControlOptionLabel", () => {
	it("returns i18n option label when available", () => {
		mockT.mockReturnValueOnce("Option 1");
		expect(getFxControlOptionLabel("delay", "tapeMode", 1)).toBe("Option 1");
	});

	it("returns uppercase fallback when i18n empty", () => {
		mockT.mockReturnValue("");
		expect(getFxControlOptionLabel("delay", "tapeMode", "digital")).toBe(
			"DIGITAL",
		);
	});

	it("returns numeric value string uppercased", () => {
		mockT.mockReturnValue("");
		expect(getFxControlOptionLabel("delay", "tapeMode", 0)).toBe("0");
	});
});

describe("getFxControlTooltip", () => {
	it("returns param tooltip when paramKey is provided", () => {
		expect(getFxControlTooltip("delay", "time", "rate")).toBe("Rate");
	});

	it("returns fx tooltip when no paramKey", () => {
		mockT.mockReturnValueOnce("Time fx tooltip");
		expect(getFxControlTooltip("delay", "time")).toBe("Time fx tooltip");
	});

	it("returns fx label when no tooltip sources resolve", () => {
		mockT.mockReturnValue("");
		expect(getFxControlTooltip("delay", "time")).toBe("Time");
	});
});

describe("resolvePresetPatchParams", () => {
	const config = { patchKey: "delay" } as FxSlotModuleConfig;

	it("returns patch params when key exists in presetPatch", () => {
		const patch = { delay: { time: 0.5, feedback: 0.3 } };
		expect(resolvePresetPatchParams(config, patch)).toEqual({
			time: 0.5,
			feedback: 0.3,
		});
	});

	it("returns null when key not in presetPatch", () => {
		expect(resolvePresetPatchParams(config, {})).toBeNull();
	});

	it("returns null when patch value is not an object", () => {
		expect(resolvePresetPatchParams(config, { delay: "string" })).toBeNull();
	});

	it("returns null when patch value is null", () => {
		expect(resolvePresetPatchParams(config, { delay: null })).toBeNull();
	});
});

describe("getModDestinationByParam", () => {
	it("builds map from matching definition controls with modDestinationKey", () => {
		mockFxDefinitions.push({
			slotType: "delay",
			controls: [
				{ id: "time", modDestinationKey: "delayTime" },
				{ id: "feedback", modDestinationKey: "delayFeedback" },
				{ id: "tapeMode", modDestinationKey: null },
			],
		});
		expect(getModDestinationByParam("delay")).toEqual({
			time: "delayTime",
			feedback: "delayFeedback",
		});
	});

	it("returns empty map when type not found", () => {
		expect(getModDestinationByParam("chorus")).toEqual({});
	});
});
