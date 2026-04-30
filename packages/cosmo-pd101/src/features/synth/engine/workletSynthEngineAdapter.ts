import type { SynthEngineAdapter } from "@/features/synth/engine/synthEngineAdapter";
import type { SynthEngineSnapshot } from "@/features/synth/engine/synthEngineSnapshot";
import { resolveAlgoRef } from "@/lib/synth/algoRef";
import type { SynthParams } from "@/lib/synth/bindings/synth";

const DEFAULT_CZ_PARAMS = {
	slotAWaveform: "saw",
	slotBWaveform: "saw",
} as const;

type CreateWorkletSynthEngineAdapterParams = {
	workletNodeRef: React.MutableRefObject<AudioWorkletNode | null>;
	paramsRef: React.MutableRefObject<SynthParams>;
};

export function createWorkletSynthEngineAdapter({
	workletNodeRef,
	paramsRef,
}: CreateWorkletSynthEngineAdapterParams): SynthEngineAdapter {
	return {
		sync(snapshot: SynthEngineSnapshot) {
			const baseParams = snapshot.params;
			const algoA = baseParams.line1.algo;
			const algoB = baseParams.line2.algo;
			const resolvedAlgoA = resolveAlgoRef(algoA);
			const resolvedAlgoB = resolveAlgoRef(algoB);
			const line1Window = resolvedAlgoA.windowType ?? baseParams.line1.window;
			const line2Window = resolvedAlgoB.windowType ?? baseParams.line2.window;

			const params: SynthParams = {
				...baseParams,
				line1: {
					...baseParams.line1,
					algo: algoA,
					algo2: baseParams.line1.algo2 ?? null,
					window: line1Window,
					cz: {
						slotAWaveform:
							baseParams.line1.cz?.slotAWaveform ??
							DEFAULT_CZ_PARAMS.slotAWaveform,
						slotBWaveform:
							baseParams.line1.cz?.slotBWaveform ??
							DEFAULT_CZ_PARAMS.slotBWaveform,
						window: baseParams.line1.cz?.window ?? line1Window,
					},
				},
				line2: {
					...baseParams.line2,
					algo: algoB,
					algo2: baseParams.line2.algo2 ?? null,
					window: line2Window,
					cz: {
						slotAWaveform:
							baseParams.line2.cz?.slotAWaveform ??
							DEFAULT_CZ_PARAMS.slotAWaveform,
						slotBWaveform:
							baseParams.line2.cz?.slotBWaveform ??
							DEFAULT_CZ_PARAMS.slotBWaveform,
						window: baseParams.line2.cz?.window ?? line2Window,
					},
				},
				modMatrix: { routes: baseParams.modMatrix?.routes ?? [] },
			};
			paramsRef.current = params;
			if (!workletNodeRef.current) return;
			workletNodeRef.current.port.postMessage({
				type: "setParams",
				params,
			});
		},
	};
}
