import type {
	ButtonGroupControlDef,
	FxSlotModuleConfig,
	KnobControlDef,
} from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import { getEngineParamUiMeta } from "@/lib/synth/paramMeta";

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

export function resolveEnabled(params: Record<string, unknown>): boolean {
	return Boolean(params.enabled);
}

export function getTooltip(key: string): string | undefined {
	return getEngineParamUiMeta(key)?.tooltip;
}

export function resolvePresetPatchParams(
	config: FxSlotModuleConfig,
	presetPatch: Record<string, unknown>,
): Record<string, unknown> | null {
	const patchParams = presetPatch[config.patchKey];
	if (!patchParams || typeof patchParams !== "object") {
		return null;
	}
	return patchParams as Record<string, unknown>;
}
