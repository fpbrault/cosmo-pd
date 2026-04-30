import type { SynthParamKey } from "@/features/synth/SynthParamController";
import {
	ENGINE_ENUM_VALUE_TOOLTIPS_V1,
	ENGINE_PARAM_UI_META_V1,
	type EngineParamUiMetaV1,
} from "@/lib/synth/bindings/synth";

export type ParamMeta = {
	tooltip: string;
};

export const ENGINE_PARAM_UI_META_BY_KEY: Partial<
	Record<SynthParamKey, EngineParamUiMetaV1>
> = ENGINE_PARAM_UI_META_V1.reduce(
	(acc, meta) => {
		acc[meta.key as SynthParamKey] = meta;
		return acc;
	},
	{} as Partial<Record<SynthParamKey, EngineParamUiMetaV1>>,
);

/** Canonical tooltip text for engine parameters, owned by the engine metadata export. */
export const PARAM_META: Partial<Record<SynthParamKey, ParamMeta>> =
	ENGINE_PARAM_UI_META_V1.reduce(
		(acc, meta) => {
			acc[meta.key as SynthParamKey] = { tooltip: meta.tooltip };
			return acc;
		},
		{} as Partial<Record<SynthParamKey, ParamMeta>>,
	);

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

function buildEnumTooltipMap(key: string): Partial<Record<string, string>> {
	return ENGINE_ENUM_VALUE_TOOLTIPS_V1.filter(
		(entry) => entry.key === key,
	).reduce(
		(acc, entry) => {
			acc[entry.value] = entry.tooltip;
			return acc;
		},
		{} as Partial<Record<string, string>>,
	);
}

export function getEngineParamUiMeta(
	key: string,
): EngineParamUiMetaV1 | undefined {
	return ENGINE_PARAM_UI_META_BY_KEY[key as SynthParamKey];
}

/** Canonical tooltips for `lineSelect` enum values. */
export const LINE_SELECT_TOOLTIPS = buildEnumTooltipMap("lineSelect");

/** Canonical tooltips for `modMode` enum values. */
export const MOD_MODE_TOOLTIPS = buildEnumTooltipMap("modMode");

/** Canonical tooltips for `portamentoMode` enum values. */
export const PORTAMENTO_MODE_TOOLTIPS = buildEnumTooltipMap("portamentoMode");
