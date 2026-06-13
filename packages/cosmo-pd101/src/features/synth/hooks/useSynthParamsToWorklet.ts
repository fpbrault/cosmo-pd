import { useEffect, useMemo, useRef } from "react";
import { subscribeApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { SynthEngineController } from "@/features/synth/engine/synthEngineAdapter";
import { createSynthEngineSnapshot } from "@/features/synth/engine/synthEngineSnapshot";
import { createWorkletSynthEngineAdapter } from "@/features/synth/engine/workletSynthEngineAdapter";
import { useSynthStore } from "@/features/synth/synthStore";
import type { SynthParams, SynthPresetV1 } from "@/lib/synth/bindings/synth";

type UseSynthParamsToWorkletParams = {
	workletNodeRef: React.MutableRefObject<AudioWorkletNode | null>;
	paramsRef: React.MutableRefObject<SynthParams>;
	effectivePitchHz: number;
	gatherState: () => SynthPresetV1;
	voiceLimit?: number;
};

export function useSynthParamsToWorklet({
	workletNodeRef,
	paramsRef,
	effectivePitchHz,
	gatherState,
	voiceLimit,
}: UseSynthParamsToWorkletParams) {
	const adapter = useMemo(
		() => createWorkletSynthEngineAdapter({ workletNodeRef, paramsRef }),
		[workletNodeRef, paramsRef],
	);

	// Lifecycle: connect / dispose
	useEffect(() => {
		const controller = new SynthEngineController(adapter);
		controller.connect();
		return () => controller.dispose();
	}, [adapter]);

	// Outbound sync: subscribe to Zustand so every state change syncs to
	// the worklet. Also re-run when effectivePitchHz changes.
	useEffect(() => {
		const sync = () => {
			const snapshot = createSynthEngineSnapshot({
				gatherState,
				effectivePitchHz,
			});
			adapter.sync(snapshot);
		};
		sync();
		return useSynthStore.subscribe(sync);
	}, [adapter, gatherState, effectivePitchHz]);

	const voiceLimitRef = useRef<number | undefined>();

	useEffect(() => {
		if (voiceLimit === voiceLimitRef.current) return;
		voiceLimitRef.current = voiceLimit;
		if (!workletNodeRef.current || voiceLimit === undefined) return;
		workletNodeRef.current.port.postMessage({
			type: "setVoiceLimit",
			limit: voiceLimit,
		});
	}, [voiceLimit, workletNodeRef]);

	useEffect(() => {
		return subscribeApplyModulePreset((request) => {
			if (!workletNodeRef.current) {
				return;
			}
			workletNodeRef.current.port.postMessage({
				type: "applyModulePreset",
				module: request.module,
				preset: request.preset,
				patch: request.patch,
			});
		});
	}, [workletNodeRef]);
}
