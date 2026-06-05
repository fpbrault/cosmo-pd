import { i18n } from "@/i18n";
import { algoRefKey, resolveAlgoRef } from "@/lib/synth/algoRef";
import type { CzWaveform } from "@/lib/synth/bindings/synth";
import { ALGO_UI_CATALOG_V1 } from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import { getAlgoIconPath } from "@/lib/synth/waveformPreview";

type PdAlgoDef = {
	value: PdAlgo;
	label: string;
	waveform: CzWaveform;
	algo: string;
	key: string;
	icon: string;
};

const NON_BASE_WAVE_ALGOS = new Set<PdAlgo>(["karpunk"]);

export const PD_ALGOS: PdAlgoDef[] = [
	...ALGO_UI_CATALOG_V1.filter((entry) => entry.visible).map((entry) => {
		const resolved = resolveAlgoRef(entry.id);
		return {
			value: entry.id,
			label: entry.label,
			waveform: resolved.waveform,
			algo: resolved.warpAlgo,
			key: algoRefKey(entry.id),
			icon: getAlgoIconPath(entry.id),
		};
	}),
];

export function algoUsesBaseWaveform(algo: PdAlgo): boolean {
	return !NON_BASE_WAVE_ALGOS.has(algo);
}

export function getPdAlgoBehaviorDescription(algo: PdAlgo): string {
	const translated = i18n.t(`algos.${algo}.behavior`, { defaultValue: "" });
	return (
		translated ||
		"Phase-distortion algorithm with a distinct harmonic shaping profile."
	);
}
