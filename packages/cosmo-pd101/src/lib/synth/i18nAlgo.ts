import { useTranslation } from "react-i18next";
import { i18n } from "@/i18n";
import type { Algo } from "@/lib/synth/bindings/synth";
import {
	ALGO_UI_CATALOG_V1,
	CZ_PRESETS,
	ENGINE_PARAM_UI_META_V1,
	type EngineParamReadoutFormatV1,
} from "@/lib/synth/bindings/synth";
import { getEngineParamUiMeta } from "@/lib/synth/paramMeta";

// ── Algorithm name ──────────────────────────────────────────────────────────

export function useAlgoName(algo: Algo): string {
	const { t } = useTranslation("synth");
	const catalogEntry = ALGO_UI_CATALOG_V1.find((e) => e.id === algo);
	const fallback = catalogEntry?.label ?? algo;
	const translated = t(`algos.${algo}.name`, { defaultValue: "" });
	return translated || fallback;
}

// ── Algorithm behavior / description ────────────────────────────────────────

export function useAlgoBehavior(algo: Algo): string {
	const { t } = useTranslation("synth");
	const translated = t(`algos.${algo}.behavior`, { defaultValue: "" });
	return (
		translated ||
		"Phase-distortion algorithm with a distinct harmonic shaping profile."
	);
}

// ── Algorithm control label / description ───────────────────────────────────

export interface AlgoControlTranslated {
	label: string;
	description: string;
}

/**
 * Returns translated label + description for one algorithm control.
 * Uses i18n only (no engine fallback).
 */
export function useAlgoControl(
	algo: Algo,
	controlId: string,
): AlgoControlTranslated {
	const { t } = useTranslation("synth");
	const label = t(`algos.${algo}.controls.${controlId}.label`, {
		defaultValue: controlId,
	});
	const description = t(`algos.${algo}.controls.${controlId}.description`, {
		defaultValue: "",
	});

	return { label, description };
}

/**
 * Label for a select/dropdown option inside an algorithm control.
 * Hook version — use at the top level of a component.
 */
export function useAlgoControlOptionLabel(
	algo: Algo,
	controlId: string,
	optionValue: string,
): string {
	const { t } = useTranslation("synth");
	return t(`algos.${algo}.controls.${controlId}.options.${optionValue}`, {
		defaultValue: optionValue,
	});
}

/**
 * Non-hook version — safe to call inside loops, maps, or callbacks.
 * Uses the global i18n instance directly.
 */
export function getAlgoControlOptionLabel(
	algo: Algo,
	controlId: string,
	optionValue: string,
): string {
	return i18n.t(`algos.${algo}.controls.${controlId}.options.${optionValue}`, {
		defaultValue: optionValue,
	});
}

// ── Parameter tooltip ───────────────────────────────────────────────────────

/**
 * Returns translated tooltip for a synth parameter.
 * Falls back to engine metadata tooltip when no i18n key exists.
 */
export function useParamTooltip(paramKey: string): string | undefined {
	const { t } = useTranslation("synth");
	const i18nTooltip = t(`params.${paramKey}.tooltip`, { defaultValue: "" });
	return i18nTooltip || undefined;
}

// ── Enum value tooltip (lineSelect, modMode, filterType, portamentoMode) ────

/**
 * Returns translated tooltip for an enum-like parameter value.
 */
export function useEnumValueTooltip(
	paramKey: string,
	value: string,
): string | undefined {
	const { t } = useTranslation("synth");
	const i18nTooltip = t(`enumTooltips.${paramKey}.${value}`, {
		defaultValue: "",
	});
	if (i18nTooltip) return i18nTooltip;

	// Fallback: engine enum tooltips
	const engineMeta = ENGINE_PARAM_UI_META_V1.find((m) => m.key === paramKey);
	if (engineMeta?.readoutFormat.kind === "enumMap") {
		const match = engineMeta.readoutFormat.values.find(
			(v: { value: string }) => v.value === value,
		);
		return match?.label;
	}
	return undefined;
}

// ── CZ preset label ─────────────────────────────────────────────────────────

export function useCzPresetLabel(presetId: string): string {
	const { t } = useTranslation("synth");
	return (
		(t(`czPresets.${presetId}`, { defaultValue: "" }) ||
			CZ_PRESETS.find((p) => p.id === presetId)?.label) ??
		presetId
	);
}

// ── LCD readout helpers ─────────────────────────────────────────────────────

/**
 * Returns a human-readable label for a synth parameter, preferring i18n.
 * No longer depends on engineMeta.readoutLabel — fully i18n-driven.
 */
export function useLcdControlLabel(key: string): string {
	const { t } = useTranslation("synth");
	return t(`lcdControls.${key}`, { defaultValue: key });
}

export function useAlgoUiText(key: string): string {
	const { t } = useTranslation("synth");
	const translated = t(`algoUi.${key}`, { defaultValue: "" });
	return translated || key;
}

/**
 * Returns the readout format metadata (still from engine bindings —
 * formatting logic depends on it, not on translatable strings).
 */
export function getEngineReadoutFormat(
	key: string,
): EngineParamReadoutFormatV1 | undefined {
	const meta = getEngineParamUiMeta(key);
	return meta?.readoutFormat;
}
