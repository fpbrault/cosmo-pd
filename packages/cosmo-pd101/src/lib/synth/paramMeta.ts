import type { SynthParamKey } from "@/features/synth/SynthParamController";
import { i18n } from "@/i18n";
import {
	ENGINE_MIDI_PARAM_RANGES_V1,
	ENGINE_PARAM_RANGES_V1,
	ENGINE_PARAM_UI_META_V1,
	type EngineParamRangeV1,
	type EngineParamUiMetaV1,
} from "@/lib/synth/bindings/synth";

export type EngineParamUiMetaWithRangeV1 = EngineParamUiMetaV1 & {
	min?: number;
	max?: number;
};

const ENGINE_PARAM_RANGES_BY_KEY = new Map<string, EngineParamRangeV1>(
	ENGINE_PARAM_RANGES_V1.map((range) => [range.key, range] as const),
);

export const ENGINE_MIDI_PARAM_RANGES_BY_KEY = new Map<
	string,
	EngineParamRangeV1
>(ENGINE_MIDI_PARAM_RANGES_V1.map((range) => [range.key, range] as const));

const ALGO_CONTROL_SLOT_KEY = /^line[12]AlgoControl[1-8]$/;

export function isNativeMidiMappingParamKey(key: string): boolean {
	return (
		ENGINE_MIDI_PARAM_RANGES_BY_KEY.has(key) || ALGO_CONTROL_SLOT_KEY.test(key)
	);
}

export const ENGINE_PARAM_UI_META_BY_KEY: Partial<
	Record<SynthParamKey, EngineParamUiMetaWithRangeV1>
> = ENGINE_PARAM_UI_META_V1.reduce(
	(acc, meta) => {
		const range = ENGINE_PARAM_RANGES_BY_KEY.get(meta.key);
		acc[meta.key as SynthParamKey] = {
			...meta,
			...(range ? { min: range.min, max: range.max } : {}),
		};
		return acc;
	},
	{} as Partial<Record<SynthParamKey, EngineParamUiMetaWithRangeV1>>,
);

/** Resolves translated tooltip text at use time, after i18n has initialized. */
export function getParamTooltip(key: string): string | undefined {
	const tooltip = i18n.t(`params.${key}.tooltip`, { defaultValue: "" });
	return tooltip && tooltip !== key ? tooltip : undefined;
}

const ENGINE_PARAM_DEFAULTS_BY_KEY = new Map<string, number>(
	ENGINE_PARAM_UI_META_V1.flatMap((meta) =>
		typeof meta.paramDefault === "number"
			? [[meta.key, meta.paramDefault] as const]
			: [],
	),
);

/** Returns engine-owned numeric default for a param key, if defined. */
export function getEngineParamDefault(key: string): number | undefined {
	return ENGINE_PARAM_DEFAULTS_BY_KEY.get(key);
}

/**
 * Returns engine-owned numeric default for a param key, throwing if missing.
 * Use this where numeric params must be source-of-truth from the engine.
 */
export function requireEngineParamDefault(key: string): number {
	const value = getEngineParamDefault(key);
	if (typeof value === "number") {
		return value;
	}
	throw new Error(`Missing engine numeric default for parameter: ${key}`);
}

/** Resolves translated enum-value tooltip text at use time. */
export function getEnumTooltip(key: string, value: string): string | undefined {
	const tooltip = i18n.t(`enumTooltips.${key}.${value}`, {
		defaultValue: "",
	});
	if (tooltip && tooltip !== value) {
		return tooltip;
	}

	const engineMeta = ENGINE_PARAM_UI_META_V1.find((meta) => meta.key === key);
	if (engineMeta?.readoutFormat.kind === "enumMap") {
		return engineMeta.readoutFormat.values.find(
			(entry) => entry.value === value,
		)?.label;
	}

	return undefined;
}

export function getEngineParamUiMeta(
	key: string,
): EngineParamUiMetaWithRangeV1 | undefined {
	return ENGINE_PARAM_UI_META_BY_KEY[key as SynthParamKey];
}
