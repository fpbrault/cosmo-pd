import { useCallback, useEffect, useMemo, useState } from "react";
import type { PresetOption } from "@/components/primitives/PresetPopover";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { normalizeEnvelope } from "@/lib/synth/envelopeData";
import {
	deleteEnvelopePreset,
	getEnvelopePresetEnvelope,
	listEnvelopePresets,
	type StoredEnvelopePreset,
	saveEnvelopePreset,
} from "@/lib/synth/envelopePresetStorage";
import { BUILTIN_ENVELOPE_PRESETS } from "@/lib/synth/envelopePresets";

type UseEnvelopePresetControllerOptions = {
	envelope: StepEnvData;
	onApply: (envelope: StepEnvData) => void;
};

export type EnvelopePresetOption = PresetOption & {
	envelope: StepEnvData;
};

export function useEnvelopePresetController({
	envelope,
	onApply,
}: UseEnvelopePresetControllerOptions) {
	const [userPresets, setUserPresets] = useState<StoredEnvelopePreset[]>([]);

	useEffect(() => {
		let cancelled = false;
		void listEnvelopePresets()
			.then((presets) => {
				if (!cancelled) setUserPresets(presets);
			})
			.catch(() => {
				if (!cancelled) setUserPresets([]);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const presetOptions = useMemo<EnvelopePresetOption[]>(
		() => [
			...BUILTIN_ENVELOPE_PRESETS.map((preset) => ({
				id: preset.id,
				label: preset.label,
				envelope: preset.envelope,
			})),
			...userPresets.map((preset) => ({
				id: preset.id,
				label: preset.name,
				envelope: getEnvelopePresetEnvelope(preset),
			})),
		],
		[userPresets],
	);

	const builtinPresetIds = useMemo(
		() => new Set(BUILTIN_ENVELOPE_PRESETS.map((preset) => preset.id)),
		[],
	);
	const selectedPreset = useMemo(() => {
		const normalizedEnvelope = JSON.stringify(normalizeEnvelope(envelope));
		const builtin = BUILTIN_ENVELOPE_PRESETS.find(
			(preset) =>
				JSON.stringify(normalizeEnvelope(preset.envelope)) ===
				normalizedEnvelope,
		);
		if (builtin) return builtin.id;

		return (
			userPresets.find(
				(preset) =>
					JSON.stringify(
						normalizeEnvelope(getEnvelopePresetEnvelope(preset)),
					) === normalizedEnvelope,
			)?.id ?? ""
		);
	}, [envelope, userPresets]);

	const handlePresetChange = useCallback(
		(presetId: string) => {
			const preset = userPresets.find((candidate) => candidate.id === presetId);
			if (preset) {
				onApply(getEnvelopePresetEnvelope(preset));
				return;
			}

			const builtinPreset = BUILTIN_ENVELOPE_PRESETS.find(
				(candidate) => candidate.id === presetId,
			);
			if (builtinPreset) {
				onApply({
					...builtinPreset.envelope,
					steps: builtinPreset.envelope.steps.map((step) => ({ ...step })),
				});
			}
		},
		[onApply, userPresets],
	);

	const handleSavePreset = useCallback(
		async (name: string) => {
			const saved = await saveEnvelopePreset({ name, envelope });
			setUserPresets((previous) => [...previous, saved]);
		},
		[envelope],
	);

	const handleDeletePreset = useCallback(async (presetId: string) => {
		await deleteEnvelopePreset(presetId);
		setUserPresets((previous) =>
			previous.filter((preset) => preset.id !== presetId),
		);
	}, []);

	return {
		selectedPreset,
		presetOptions,
		builtinPresetIds,
		handlePresetChange,
		handleSavePreset,
		handleDeletePreset,
	};
}
