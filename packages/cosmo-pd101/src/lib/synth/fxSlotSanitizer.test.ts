import { beforeEach, describe, expect, it } from "vitest";
import { useSynthStore } from "@/features/synth/synthStore";
import type {
	FxControlV1,
	FxDefinitionV1,
	FxSlotConfig,
	FxSlotType,
} from "@/lib/synth/bindings/synth";
import { FX_DEFINITIONS_V1 } from "@/lib/synth/bindings/synth";
import { sanitizeSynthParamsForEngine } from "./fxSlotSanitizer";

const FX_DEFINITIONS = (FX_DEFINITIONS_V1 as FxDefinitionV1[]).filter(
	(definition) => definition.slotType !== "empty",
);

function normalizeTestParamKey(type: FxSlotType, controlId: string) {
	if (type === "phaseMod") {
		if (controlId === "intPmAmount") {
			return "amount";
		}
		if (controlId === "intPmRatio") {
			return "ratio";
		}
	}
	return controlId;
}

function makeControlPatch(type: FxSlotType, control: FxControlV1) {
	const key = normalizeTestParamKey(type, control.id);

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
		const midpoint = control.min + (control.max - control.min) * 0.63;
		return { [key]: midpoint };
	}
	return { [key]: (control.defaultF32 ?? 0) + 1 };
}

function expectTypedControlValue(
	slot: FxSlotConfig,
	control: FxControlV1,
): void {
	if (slot.type === "empty") {
		throw new Error("Expected a non-empty FX slot");
	}

	const params = slot.params as Record<string, unknown>;
	const key = normalizeTestParamKey(slot.type, control.id);
	const value = params[key];

	if (key === "timeMode" || key === "rateMode") {
		expect(typeof value).toBe("string");
		expect(["hz", "sync"]).toContain(value);
		return;
	}
	if (key === "syncDivision") {
		expect(typeof value).toBe("string");
		expect([
			"whole",
			"half",
			"quarter",
			"eighth",
			"sixteenth",
			"thirtySecond",
			"dottedQuarter",
			"dottedEighth",
			"quarterTriplet",
			"eighthTriplet",
		]).toContain(value);
		return;
	}
	if (key === "pmPre" || control.kind === "toggle") {
		expect(typeof value).toBe("boolean");
		return;
	}
	expect(typeof value).toBe("number");
	expect(Number.isFinite(value)).toBe(true);
}

describe("fxSlotSanitizer", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
	});

	it.each(
		FX_DEFINITIONS,
	)("serializes manual defaults for %s with engine-safe types", (definition) => {
		useSynthStore.getState().setFxSlotType(0, definition.slotType);
		const params = useSynthStore.getState().gatherState().params;
		const sanitized = sanitizeSynthParamsForEngine(params);
		const slot = sanitized.fxSlots?.[0];

		expect(slot?.type).toBe(definition.slotType);
		expect(() => JSON.parse(JSON.stringify(sanitized))).not.toThrow();
		if (!slot || slot.type === "empty") {
			throw new Error(`Expected populated slot for ${definition.slotType}`);
		}
		expect(typeof (slot.params as Record<string, unknown>).enabled).toBe(
			"boolean",
		);
		for (const control of definition.controls) {
			expectTypedControlValue(slot, control);
		}
	});

	it.each(
		FX_DEFINITIONS.flatMap((definition) =>
			definition.controls.map((control) => ({
				slotType: definition.slotType,
				control,
			})),
		),
	)("sanitizes %s.%s after a manual control patch", ({ slotType, control }) => {
		const store = useSynthStore.getState();
		store.setFxSlotType(0, slotType);
		store.setFxSlotParams(0, makeControlPatch(slotType, control));

		const params = useSynthStore.getState().gatherState().params;
		const sanitized = sanitizeSynthParamsForEngine(params);
		const slot = sanitized.fxSlots?.[0];

		expect(slot?.type).toBe(slotType);
		expect(() => JSON.parse(JSON.stringify(sanitized))).not.toThrow();
		if (!slot || slot.type === "empty") {
			throw new Error(`Expected populated slot for ${slotType}`);
		}

		expectTypedControlValue(slot, control);
	});
});
