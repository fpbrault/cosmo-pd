import { useState } from "react";
import {
	type FxSlotModuleConfig,
	getSlotParams,
} from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { resolvePresetPatchParams } from "./utils";

export function useFxModuleController(
	config: FxSlotModuleConfig,
	slot: number,
) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const rawSlot = useSynthStore((state) => state.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((state) => state.setFxSlotParams);

	const rawParams = getSlotParams(rawSlot);
	const enabled = Boolean(rawParams.enabled);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = config.presets.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		const patchParams = resolvePresetPatchParams(
			config,
			preset.patch as Record<string, unknown>,
		);
		if (!patchParams) {
			return;
		}

		setFxSlotParams(slot, patchParams);
		requestApplyModulePreset({
			module: config.moduleKey,
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return {
		selectedPreset,
		setFxSlotParams,
		params: rawParams,
		enabled,
		handlePresetChange,
	};
}
