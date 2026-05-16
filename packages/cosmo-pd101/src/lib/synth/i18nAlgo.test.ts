import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getAlgoControlOptionLabel,
	getEngineReadoutFormat,
	useAlgoBehavior,
	useAlgoControl,
	useAlgoControlOptionLabel,
	useAlgoName,
	useAlgoUiText,
	useCzPresetLabel,
	useEnumValueTooltip,
	useParamTooltip,
} from "./i18nAlgo";

const { mockT } = vi.hoisted(() => {
	return {
		mockT: vi.fn((key) => key),
	};
});

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: mockT,
	}),
}));

vi.mock("@/i18n", () => ({
	i18n: {
		t: mockT,
	},
}));

describe("i18nAlgo", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockT.mockImplementation((key) => key);
	});

	it("useAlgoName returns translated name or fallback", () => {
		const { result: res1 } = renderHook(() => useAlgoName("saw"));
		expect(res1.current).toBe("algos.saw.name");

		mockT.mockReturnValueOnce("Translated Algo");
		const { result: res2 } = renderHook(() => useAlgoName("saw"));
		expect(res2.current).toBe("Translated Algo");
	});

	it("useAlgoBehavior returns translated behavior or default", () => {
		const { result: res1 } = renderHook(() => useAlgoBehavior("saw"));
		expect(res1.current).toBe("algos.saw.behavior");

		mockT.mockReturnValueOnce("");
		const { result: res2 } = renderHook(() => useAlgoBehavior("saw"));
		expect(res2.current).toBe(
			"Phase-distortion algorithm with a distinct harmonic shaping profile.",
		);
	});

	it("useAlgoControl returns translated label and description", () => {
		const { result } = renderHook(() => useAlgoControl("saw", "ctrl1"));
		expect(result.current).toEqual({
			label: "algos.saw.controls.ctrl1.label",
			description: "algos.saw.controls.ctrl1.description",
		});
	});

	it("useAlgoControlOptionLabel returns translated option label", () => {
		const { result } = renderHook(() =>
			useAlgoControlOptionLabel("saw", "ctrl1", "opt1"),
		);
		expect(result.current).toBe("algos.saw.controls.ctrl1.options.opt1");
	});

	it("getAlgoControlOptionLabel returns translated option label using global i18n", () => {
		const result = getAlgoControlOptionLabel("saw", "ctrl1", "opt1");
		expect(result).toBe("algos.saw.controls.ctrl1.options.opt1");
		expect(mockT).toHaveBeenCalled();
	});

	it("useParamTooltip returns translated tooltip or undefined", () => {
		const { result: res1 } = renderHook(() => useParamTooltip("param1"));
		expect(res1.current).toBe("params.param1.tooltip");

		mockT.mockReturnValueOnce("");
		const { result: res2 } = renderHook(() => useParamTooltip("param1"));
		expect(res2.current).toBeUndefined();
	});

	it("useEnumValueTooltip returns translated tooltip or engine fallback", () => {
		const { result: res1 } = renderHook(() =>
			useEnumValueTooltip("param1", "val1"),
		);
		expect(res1.current).toBe("enumTooltips.param1.val1");

		mockT.mockReturnValueOnce("");
		const { result: res2 } = renderHook(() =>
			useEnumValueTooltip("nonexistent", "val1"),
		);
		expect(res2.current).toBeUndefined();
	});

	it("useCzPresetLabel returns translated label, catalog label, or ID", () => {
		const { result: res1 } = renderHook(() => useCzPresetLabel("preset1"));
		expect(res1.current).toBe("czPresets.preset1");

		mockT.mockReturnValueOnce("");
		const { result: res2 } = renderHook(() => useCzPresetLabel("nonexistent"));
		expect(res2.current).toBe("nonexistent");
	});

	it("useAlgoUiText returns translated text or key", () => {
		const { result: res1 } = renderHook(() => useAlgoUiText("key1"));
		expect(res1.current).toBe("algoUi.key1");

		mockT.mockReturnValueOnce("");
		const { result: res2 } = renderHook(() => useAlgoUiText("key1"));
		expect(res2.current).toBe("key1");
	});

	it("getEngineReadoutFormat returns readout format from metadata", () => {
		const result = getEngineReadoutFormat("volume");
		expect(typeof result).toBe("object");
	});
});
