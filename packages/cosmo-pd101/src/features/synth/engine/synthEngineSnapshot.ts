import type {
	LineEngineParams,
	SynthParams,
	SynthPresetV1,
} from "@/lib/synth/bindings/synth";
import { sanitizeSynthParamsForEngine } from "@/lib/synth/fxSlotSanitizer";

export type SynthEngineSnapshot = {
	params: SynthParams;
};

/** PD's optional algo control arrays need a `[]` default before the engine
 * accepts them; other engines have no equivalent legacy-optional fields. */
function withDefaultAlgoControls(engine: LineEngineParams): LineEngineParams {
	if (engine.type !== "pd") return engine;
	return {
		...engine,
		params: {
			...engine.params,
			algoControlsA: engine.params.algoControlsA ?? [],
			algoControlsB: engine.params.algoControlsB ?? [],
		},
	};
}

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
				engine: withDefaultAlgoControls(sanitizedParams.line1.engine),
			},
			line2: {
				...sanitizedParams.line2,
				engine: withDefaultAlgoControls(sanitizedParams.line2.engine),
			},
			modMatrix: {
				routes: sanitizedParams.modMatrix?.routes ?? [],
			},
		},
	};
}
