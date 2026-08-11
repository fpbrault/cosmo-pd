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
					params: {
						...sanitizedParams.line1.engine.params,
						algoControlsA:
							sanitizedParams.line1.engine.params.algoControlsA ?? [],
						algoControlsB:
							sanitizedParams.line1.engine.params.algoControlsB ?? [],
					},
				},
			},
			line2: {
				...sanitizedParams.line2,
				engine: {
					...sanitizedParams.line2.engine,
					params: {
						...sanitizedParams.line2.engine.params,
						algoControlsA:
							sanitizedParams.line2.engine.params.algoControlsA ?? [],
						algoControlsB:
							sanitizedParams.line2.engine.params.algoControlsB ?? [],
					},
				},
			},
			modMatrix: {
				routes: sanitizedParams.modMatrix?.routes ?? [],
			},
		},
	};
}
