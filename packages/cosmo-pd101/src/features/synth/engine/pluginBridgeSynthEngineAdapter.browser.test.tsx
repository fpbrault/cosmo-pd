import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FxControlV1, FxDefinitionV1 } from "@/lib/synth/bindings/synth";
import { FX_DEFINITIONS_V1 } from "@/lib/synth/bindings/synth";
import { useSynthStore } from "../synthStore";
import { usePluginBridgeSynthEngine } from "./pluginBridgeSynthEngineAdapter";

const FX_DEFINITIONS = (FX_DEFINITIONS_V1 as FxDefinitionV1[]).filter(
	(definition) => definition.slotType !== "empty",
);

function normalizeTestParamKey(slotType: string, controlId: string) {
	if (slotType === "phaseMod") {
		if (controlId === "intPmAmount") {
			return "amount";
		}
		if (controlId === "intPmRatio") {
			return "ratio";
		}
	}
	return controlId;
}

function makeControlPatch(slotType: string, control: FxControlV1) {
	const key = normalizeTestParamKey(slotType, control.id);

	if (key === "tapeMode") {
		return { [key]: 1 };
	}
	if (key === "timeMode" || key === "rateMode") {
		return { [key]: "sync" };
	}
	if (key === "syncDivision") {
		return { [key]: "eighthTriplet" };
	}
	if (control.kind === "toggle") {
		return { [key]: !control.defaultF32 };
	}
	if (control.options.length > 0) {
		const alternate =
			control.options.find(
				(option) => option.value !== control.options[0]?.value,
			) ?? control.options[0];
		return { [key]: alternate?.value ?? 0 };
	}
	if (typeof control.min === "number" && typeof control.max === "number") {
		return { [key]: control.min + (control.max - control.min) * 0.61 };
	}
	return { [key]: (control.defaultF32 ?? 0) + 1 };
}

describe("usePluginBridgeSynthEngine (browser FX smoke)", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
		window.__czOnParams = undefined;
		window.__czGetParams = undefined;
		window.__czSetParams = undefined;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		window.__czOnParams = undefined;
		window.__czGetParams = undefined;
		window.__czSetParams = undefined;
	});

	it("handles every FX control patch without setParams parse errors", async () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const outboundJsons: string[] = [];
		window.__czGetParams = undefined;
		window.__czSetParams = (json: string) => {
			outboundJsons.push(json);
		};

		renderHook(() => usePluginBridgeSynthEngine());

		for (const definition of FX_DEFINITIONS) {
			for (const control of definition.controls) {
				act(() => {
					const store = useSynthStore.getState();
					store.setFxSlotType(0, "empty");
					store.setFxSlotType(0, definition.slotType);
				});

				const beforeCount = outboundJsons.length;
				act(() => {
					useSynthStore
						.getState()
						.setFxSlotParams(0, makeControlPatch(definition.slotType, control));
				});

				await waitFor(() => {
					expect(outboundJsons.length).toBeGreaterThan(0);
				});
				expect(outboundJsons.length).toBeGreaterThanOrEqual(beforeCount);

				const payload = JSON.parse(outboundJsons.at(-1) ?? "{}") as {
					fxSlots?: Array<{ type: string; params: Record<string, unknown> }>;
				};
				const slot = payload.fxSlots?.[0];
				expect(slot?.type).toBe(definition.slotType);

				if (definition.slotType === "delay" && control.id === "tapeMode") {
					expect(slot?.params.tapeMode).toBe(true);
					expect(typeof slot?.params.tapeMode).toBe("boolean");
				}
			}
		}

		expect(
			consoleError.mock.calls.some((call) =>
				call.some(
					(entry) =>
						typeof entry === "string" &&
						entry.includes("setParams parse error"),
				),
			),
		).toBe(false);
	});
});
