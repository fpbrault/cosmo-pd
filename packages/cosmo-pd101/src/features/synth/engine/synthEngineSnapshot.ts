import type { SynthParams, SynthPresetV1 } from "@/lib/synth/bindings/synth";

export type SynthEngineSnapshot = {
	params: SynthParams;
};

type CreateSynthEngineSnapshotParams = {
	gatherState: () => SynthPresetV1;
	effectivePitchHz: number;
};

/**
 * Normalize fxSlots before sending to the worklet.
 * phaseMod control IDs (intPmAmount, intPmRatio) differ from Rust field names
 * (amount, ratio) because makeDefaultFxSlotConfig uses control IDs as keys.
 */
function normalizeFxSlots(
	fxSlots: SynthParams["fxSlots"],
): SynthParams["fxSlots"] {
	if (!fxSlots) return fxSlots;
	return fxSlots.map((slot) => {
		if (slot.type !== "phaseMod") return slot;
		const p = slot.params as Record<string, unknown>;
		return {
			type: "phaseMod" as const,
			params: {
				enabled: Boolean(p.enabled),
				amount: ((p.amount ?? p.intPmAmount) as number | undefined) ?? 0,
				ratio: ((p.ratio ?? p.intPmRatio) as number | undefined) ?? 2.0,
				pmPre: p.pmPre == null ? true : Boolean(p.pmPre),
			},
		};
	}) as SynthParams["fxSlots"];
}

export function createSynthEngineSnapshot({
	gatherState,
	effectivePitchHz,
}: CreateSynthEngineSnapshotParams): SynthEngineSnapshot {
	const { params } = gatherState();

	return {
		params: {
			...params,
			frequency: effectivePitchHz,
			fxSlots: normalizeFxSlots(params.fxSlots),
			line1: {
				...params.line1,
				algoControlsA: params.line1.algoControlsA ?? [],
				algoControlsB: params.line1.algoControlsB ?? [],
			},
			line2: {
				...params.line2,
				algoControlsA: params.line2.algoControlsA ?? [],
				algoControlsB: params.line2.algoControlsB ?? [],
			},
			modMatrix: {
				routes: params.modMatrix?.routes ?? [],
			},
		},
	};
}
