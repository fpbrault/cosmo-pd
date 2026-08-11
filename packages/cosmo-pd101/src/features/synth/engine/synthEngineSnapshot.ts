import type { SynthParams, SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { sanitizeSynthParamsForEngine } from "@/lib/synth/fxSlotSanitizer";

export type SynthEngineSnapshot = {
	params: SynthParams;
};

type CreateSynthEngineSnapshotParams = {
	gatherState: () => SynthPresetV1;
	effectivePitchHz: number;
};

export function createSynthEngineSnapshot({
	gatherState,
	effectivePitchHz,
}: CreateSynthEngineSnapshotParams): SynthEngineSnapshot {
	const { params } = gatherState();
	const sanitizedParams = sanitizeSynthParamsForEngine(params);

	return {
		params: {
			...sanitizedParams,
			frequency: effectivePitchHz,
			fxSlots: sanitizedParams.fxSlots,
			line1: {
				...sanitizedParams.line1,
				engine: {
					...sanitizedParams.line1.engine,
					algoControlsA: sanitizedParams.line1.engine.algoControlsA ?? [],
					algoControlsB: sanitizedParams.line1.engine.algoControlsB ?? [],
				},
			},
			line2: {
				...sanitizedParams.line2,
				engine: {
					...sanitizedParams.line2.engine,
					algoControlsA: sanitizedParams.line2.engine.algoControlsA ?? [],
					algoControlsB: sanitizedParams.line2.engine.algoControlsB ?? [],
				},
			},
			modMatrix: {
				routes: sanitizedParams.modMatrix?.routes ?? [],
			},
		},
	};
}
