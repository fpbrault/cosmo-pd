import type {
	FxControlV1,
	FxDefinitionV1,
	FxSlotConfig,
	FxSlotType,
	LfoRateMode,
	LfoSyncDivision,
	SynthParams,
} from "@/lib/synth/bindings/synth";
import { FX_DEFINITIONS_V1 } from "@/lib/synth/bindings/synth";

type NonEmptyFxSlot = Exclude<FxSlotConfig, { type: "empty" }>;
type NonEmptyFxSlotType = Exclude<FxSlotType, "empty">;
type FxParamsRecord = Record<string, unknown>;

const FX_DEFINITION_BY_TYPE = new Map(
	(FX_DEFINITIONS_V1 as FxDefinitionV1[]).map((definition) => [
		definition.slotType,
		definition,
	]),
);

const VALID_LFO_RATE_MODES = new Set<LfoRateMode>(["hz", "sync"]);
const VALID_LFO_SYNC_DIVISIONS = new Set<LfoSyncDivision>([
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
]);

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function coerceBoolean(value: unknown, fallback: boolean): boolean {
	if (typeof value === "boolean") {
		return value;
	}
	if (typeof value === "number") {
		return value !== 0;
	}
	if (typeof value === "string") {
		if (value === "true") {
			return true;
		}
		if (value === "false") {
			return false;
		}
	}
	return fallback;
}

function normalizeFxParamKey(
	type: NonEmptyFxSlotType,
	controlId: string,
): string {
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

function buildDefaultControlValue(
	type: NonEmptyFxSlotType,
	control: FxControlV1,
): string | number | boolean {
	const key = normalizeFxParamKey(type, control.id);

	if (key === "timeMode" || key === "rateMode") {
		return "hz";
	}
	if (key === "syncDivision") {
		return "quarter";
	}
	if (key === "pmPre" || control.kind === "toggle") {
		return coerceBoolean(control.defaultF32, false);
	}
	if (control.options.length > 0) {
		return control.options[0]?.value ?? control.defaultF32 ?? 0;
	}
	return control.defaultF32 ?? 0;
}

function sanitizeControlValue(
	type: NonEmptyFxSlotType,
	control: FxControlV1,
	value: unknown,
	fallback: unknown,
): string | number | boolean {
	const key = normalizeFxParamKey(type, control.id);

	if (key === "timeMode" || key === "rateMode") {
		return VALID_LFO_RATE_MODES.has(value as LfoRateMode)
			? (value as LfoRateMode)
			: ((fallback as LfoRateMode | undefined) ?? "hz");
	}
	if (key === "syncDivision") {
		return VALID_LFO_SYNC_DIVISIONS.has(value as LfoSyncDivision)
			? (value as LfoSyncDivision)
			: ((fallback as LfoSyncDivision | undefined) ?? "quarter");
	}
	if (key === "pmPre" || control.kind === "toggle") {
		return coerceBoolean(value, Boolean(fallback));
	}
	if (control.options.length > 0) {
		return control.options.some((option) => option.value === value)
			? (value as number)
			: ((fallback as number | undefined) ?? control.options[0]?.value ?? 0);
	}
	return isFiniteNumber(value)
		? value
		: ((fallback as number | undefined) ?? control.defaultF32 ?? 0);
}

export function createDefaultFxSlotConfig(type: FxSlotType): FxSlotConfig {
	if (type === "empty") {
		return { type: "empty" };
	}

	const definition = FX_DEFINITION_BY_TYPE.get(type);
	if (!definition) {
		return { type: "empty" };
	}

	const params = definition.controls.reduce<FxParamsRecord>(
		(accumulator, control) => {
			const key = normalizeFxParamKey(type, control.id);
			accumulator[key] = buildDefaultControlValue(type, control);
			return accumulator;
		},
		{ enabled: true },
	);

	return { type, params } as FxSlotConfig;
}

function migrateDelayParams(
	type: string,
	params: FxParamsRecord,
): FxParamsRecord {
	if (type !== "delay") {
		return params;
	}
	const result: FxParamsRecord = { ...params };
	if ("tapeMode" in result && !("mode" in result)) {
		result.mode = result.tapeMode ? 1 : 0;
	}
	delete result.tapeMode;
	if ("warmth" in result && !("extra" in result)) {
		result.extra = result.warmth;
	}
	delete result.warmth;
	return result;
}

export function sanitizeFxSlotConfig(slot: FxSlotConfig): FxSlotConfig {
	if (slot.type === "empty") {
		return slot;
	}

	const defaults = createDefaultFxSlotConfig(slot.type) as NonEmptyFxSlot;
	const definition = FX_DEFINITION_BY_TYPE.get(slot.type);
	if (!definition) {
		return defaults;
	}

	const rawParams = migrateDelayParams(
		slot.type,
		slot.params as FxParamsRecord,
	);
	const defaultParams = defaults.params as FxParamsRecord;
	const sanitizedParams = definition.controls.reduce<FxParamsRecord>(
		(accumulator, control) => {
			const key = normalizeFxParamKey(slot.type, control.id);
			const rawValue = rawParams[key] ?? rawParams[control.id];
			accumulator[key] = sanitizeControlValue(
				slot.type,
				control,
				rawValue,
				defaultParams[key],
			);
			return accumulator;
		},
		{
			enabled: coerceBoolean(rawParams.enabled, Boolean(defaultParams.enabled)),
		},
	);

	return {
		type: slot.type,
		params: sanitizedParams,
	} as FxSlotConfig;
}

export function sanitizeFxSlots(
	fxSlots: SynthParams["fxSlots"],
): SynthParams["fxSlots"] {
	if (!fxSlots) {
		return fxSlots;
	}
	return fxSlots.map((slot) =>
		sanitizeFxSlotConfig(slot),
	) as SynthParams["fxSlots"];
}

export function sanitizeSynthParamsForEngine(params: SynthParams): SynthParams {
	return {
		...params,
		fxSlots: sanitizeFxSlots(params.fxSlots),
	};
}
