import type { SynthEngineAdapter } from "@/features/synth/engine/synthEngineAdapter";
import type { SynthEngineSnapshot } from "@/features/synth/engine/synthEngineSnapshot";
import { resolveAlgoRef } from "@/lib/synth/algoRef";
import type { LineEngineParams, SynthParams } from "@/lib/synth/bindings/synth";

type CreateWorkletSynthEngineAdapterParams = {
	workletNodeRef: React.MutableRefObject<AudioWorkletNode | null>;
	paramsRef: React.MutableRefObject<SynthParams>;
};

/** Resolve PD's algo-ref shorthand (e.g. a CZ preset's combined algo+window)
 * into concrete `algo`/`algo2`/`window` fields. No-op for other engines. */
function resolvePdAlgoRef(engine: LineEngineParams): LineEngineParams {
	if (engine.type !== "pd") return engine;
	const resolved = resolveAlgoRef(engine.params.algo);
	return {
		...engine,
		params: {
			...engine.params,
			algo2: engine.params.algo2 ?? null,
			window: resolved.windowType ?? engine.params.window,
		},
	};
}

export function createWorkletSynthEngineAdapter({
	workletNodeRef,
	paramsRef,
}: CreateWorkletSynthEngineAdapterParams): SynthEngineAdapter {
	let lastSentParamsJson: string | null = null;

	return {
		sync(snapshot: SynthEngineSnapshot) {
			const baseParams = snapshot.params;

			const params: SynthParams = {
				...baseParams,
				line1: {
					...baseParams.line1,
					engine: resolvePdAlgoRef(baseParams.line1.engine),
				},
				line2: {
					...baseParams.line2,
					engine: resolvePdAlgoRef(baseParams.line2.engine),
				},
				modMatrix: { routes: baseParams.modMatrix?.routes ?? [] },
			};
			const paramsJson = JSON.stringify(params);
			if (paramsJson === lastSentParamsJson) {
				paramsRef.current = params;
				return;
			}
			lastSentParamsJson = paramsJson;
			paramsRef.current = params;
			if (!workletNodeRef.current) return;
			workletNodeRef.current.port.postMessage({
				type: "setParams",
				params,
			});
		},
	};
}
