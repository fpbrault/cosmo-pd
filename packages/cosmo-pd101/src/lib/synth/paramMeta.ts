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

/** Canonical tooltips for `filterType` enum values. */
export const FILTER_TYPE_TOOLTIPS = buildEnumTooltipMap("filterType");

/** Canonical tooltips for `portamentoMode` enum values. */
export const PORTAMENTO_MODE_TOOLTIPS = buildEnumTooltipMap("portamentoMode");
