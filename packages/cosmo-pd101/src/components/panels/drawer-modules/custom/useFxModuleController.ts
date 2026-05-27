import { useCallback, useEffect, useMemo, useState } from "react";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import type { StoredFxModulePreset } from "@/lib/synth/fxModulePresetStorage";
import {
	deleteFxModulePreset,
	listFxModulePresets,
	saveFxModulePreset,
} from "@/lib/synth/fxModulePresetStorage";
import { getPresetModuleKey, resolvePresetPatchParams } from "./utils";

export type PresetOption = {
	id: string;
	label: string;
	isBuiltin: boolean;
};

export function useFxModuleController(
	config: FxSlotModuleConfig,
	slot: number,
) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const [userPresets, setUserPresets] = useState<StoredFxModulePreset[]>([]);
	const rawSlot = useSynthStore((state) => state.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((state) => state.setFxSlotParams);

	const rawParams =
		(rawSlot as { params: Record<string, unknown> })?.params ?? {};
	const enabled = Boolean(rawParams.enabled);

	const builtinPresetIds = useMemo(
		() => new Set(config.presets.map((p) => p.id)),
		[config.presets],
	);

	const presetOptions = useMemo((): PresetOption[] => {
		const builtins = config.presets.map((p) => ({
			id: p.id,
			label: p.label,
			isBuiltin: true,
		}));
		const users = userPresets.map((p) => ({
			id: p.id,
			label: p.name,
			isBuiltin: false,
		}));
		return [...builtins, ...users];
	}, [config.presets, userPresets]);

	useEffect(() => {
		listFxModulePresets(config.type).then(setUserPresets);
	}, [config.type]);

	const handlePresetChange = useCallback(
		(presetId: string) => {
			setSelectedPreset(presetId);

			const userPreset = userPresets.find((p) => p.id === presetId);
			if (userPreset) {
				const patchParams = resolvePresetPatchParams(
					config,
					userPreset.patch as Record<string, unknown>,
				);
				if (patchParams) {
					setFxSlotParams(slot, patchParams);
				}
				return;
			}

			const builtinPreset = config.presets.find(
				(entry) => entry.id === presetId,
			);
			if (!builtinPreset) {
				return;
			}

			const patchParams = builtinPreset.params;
			if (!patchParams) {
				return;
			}

			setFxSlotParams(slot, patchParams);
			requestApplyModulePreset({
				module: getPresetModuleKey(config.moduleKey),
				preset: builtinPreset.id,
				patch: patchParams,
			});
		},
		[config, slot, userPresets, setFxSlotParams],
	);

	const handleSavePreset = useCallback(
		async (name: string) => {
			const moduleKey = getPresetModuleKey(config.moduleKey);
			const patch = { [moduleKey]: { ...rawParams } };
			const saved = await saveFxModulePreset({
				name,
				moduleType: config.type,
				patch,
			});
			setUserPresets((prev) => [...prev, saved]);
			setSelectedPreset(saved.id);
		},
		[config.moduleKey, config.type, rawParams],
	);

	const handleDeletePreset = useCallback(async (presetId: string) => {
		await deleteFxModulePreset(presetId);
		setUserPresets((prev) => prev.filter((p) => p.id !== presetId));
	}, []);

	return {
		selectedPreset,
		presetOptions,
		setFxSlotParams,
		params: rawParams,
		enabled,
		builtinPresetIds,
		handlePresetChange,
		handleSavePreset,
		handleDeletePreset,
	};
}
