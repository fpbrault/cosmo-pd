import type {
	ButtonGroupControlDef,
	FxSlotModuleConfig,
	KnobControlDef,
} from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import type { SynthParamKey } from "@/features/synth/SynthParamController";
import { i18n } from "@/i18n";
import {
	FX_DEFINITIONS_V1,
	type FxSlotType,
	type ModDestination,
} from "@/lib/synth/bindings/synth";
import { PARAM_META } from "@/lib/synth/paramMeta";

function humanizeIdentifier(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/^./, (char) => char.toUpperCase());
}

export function asNumber(value: unknown, fallback: number): number {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}
	if (typeof value === "boolean") {
		return value ? 1 : 0;
	}
	return fallback;
}

export function getKnobControl(
	config: FxSlotModuleConfig,
	param: string,
): KnobControlDef | undefined {
	return config.controls.find(
		(ctrl): ctrl is KnobControlDef =>
			ctrl.kind === "knob" && ctrl.param === param,
	);
}

export function getButtonGroupControl(
	config: FxSlotModuleConfig,
	param: string,
): ButtonGroupControlDef | undefined {
	return config.controls.find(
		(ctrl): ctrl is ButtonGroupControlDef =>
			ctrl.kind === "buttonGroup" && ctrl.param === param,
	);
}

export function getTooltip(key: string): string | undefined {
	const i18nTooltip = i18n.t(`params.${key}.tooltip`, { defaultValue: "" });
	if (i18nTooltip) {
		return i18nTooltip;
	}

	const metaTooltip = PARAM_META[key as SynthParamKey]?.tooltip;
	if (metaTooltip && metaTooltip !== key) {
		return metaTooltip;
	}

	return humanizeIdentifier(key);
}

export function getFxControlLabel(
	type: FxSlotType,
	controlId: string,
	paramKey?: string,
): string {
	const fxLabel = i18n.t(`fx.controls.${type}.${controlId}.label`, {
		defaultValue: "",
	});

	if (fxLabel) {
		return fxLabel;
	}

	if (paramKey) {
		const paramLabel = i18n.t(`params.${paramKey}.label`, { defaultValue: "" });
		if (paramLabel) {
			return paramLabel;
		}
	}

	return humanizeIdentifier(controlId);
}

export function getFxControlOptionLabel(
	type: FxSlotType,
	controlId: string,
	optionValue: number | string,
): string {
	const optionKey = String(optionValue);
	const optionLabel = i18n.t(
		`fx.controls.${type}.${controlId}.options.${optionKey}`,
		{ defaultValue: "" },
	);
	if (optionLabel) {
		return optionLabel;
	}
	return optionKey.toUpperCase();
}

export function getFxControlTooltip(
	type: FxSlotType,
	controlId: string,
	paramKey?: string,
): string {
	if (paramKey) {
		const paramTooltip = getTooltip(paramKey);
		if (paramTooltip) {
			return paramTooltip;
		}
	}

	const fxTooltip = i18n.t(`fx.controls.${type}.${controlId}.tooltip`, {
		defaultValue: "",
	});
	if (fxTooltip) {
		return fxTooltip;
	}

	return getFxControlLabel(type, controlId, paramKey);
}

export function resolvePresetPatchParams(
	config: FxSlotModuleConfig,
	presetPatch: Record<string, unknown>,
): Record<string, unknown> | null {
	const patchParams = presetPatch[config.moduleKey];
	if (!patchParams || typeof patchParams !== "object") {
		return null;
	}
	return patchParams as Record<string, unknown>;
}

export function getModDestinationByParam(
	type: FxSlotModuleConfig["type"],
): Record<string, ModDestination> {
	const def = FX_DEFINITIONS_V1.find((entry) => entry.slotType === type);
	const map: Record<string, ModDestination> = {};

	if (!def) {
		return map;
	}

	for (const ctrl of def.controls) {
		if (ctrl.modDestinationKey) {
			map[ctrl.id] = ctrl.modDestinationKey as ModDestination;
		}
	}

	return map;
}
