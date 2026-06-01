import { useMemo } from "react";
import { usePerformanceMetrics } from "../../../src/components/renderer/hooks/usePerformanceMetrics";
import { useAudioEngine } from "../../../src/features/synth/hooks/useAudioEngine";
import { useMidiLearnBindings } from "../../../src/features/synth/hooks/useMidiLearnBindings";
import { useNoteHandling } from "../../../src/features/synth/hooks/useNoteHandling";
import { useSynthParamsToWorklet } from "../../../src/features/synth/hooks/useSynthParamsToWorklet";
import type { SynthRuntime } from "../../../src/features/synth/runtime/synthRuntime";
import { useSynthStore } from "../../../src/features/synth/synthStore";
import {
	cosmoWorkletUrl,
	synthBindingsUrl,
	synthWasmUrl,
} from "../../../src/lib/synth/cosmoWorkletUrl";
import { noteToFreq } from "../../../src/lib/synth/pdAlgorithms";

export function useWebSynthRuntime(): SynthRuntime {
	const gatherState = useSynthStore((s) => s.gatherState);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);

	const {
		audioCtxRef,
		analyserNodeRef,
		workletNodeRef,
		paramsRef,
		audioContextState,
		resumeAudio,
	} = useAudioEngine({
		synthWasmUrl,
		synthBindingsUrl,
		cosmoWorkletUrl,
	});

	const { setEnabled: setPerformanceMonitorEnabled, metricsRef } =
		usePerformanceMetrics(workletNodeRef);

	const noteHandling = useNoteHandling({
		workletNodeRef,
		velocityCurve,
		midiInputEnabled: true,
	});

	const heldNote =
		noteHandling.activeNotes.length > 0
			? noteHandling.activeNotes[noteHandling.activeNotes.length - 1]
			: null;
	const effectivePitchHz = heldNote != null ? noteToFreq(heldNote) : 220;

	useSynthParamsToWorklet({
		workletNodeRef,
		paramsRef,
		effectivePitchHz,
		gatherState,
	});

	useMidiLearnBindings({ applyBindings: true });

	return useMemo(
		() => ({
			activeNotes: noteHandling.activeNotes,
			sendNoteOn: noteHandling.sendNoteOn,
			sendNoteOff: noteHandling.sendNoteOff,
			sendPolyAftertouch: noteHandling.sendPolyAftertouch,
			panic: noteHandling.panic,
			audioContextState,
			resumeAudio,
			effectivePitchHz,
			analyserNodeRef,
			audioCtxRef,
			benchmark: {
				mode: "web",
				setPerformanceMonitorEnabled: (enabled: boolean) => {
					setPerformanceMonitorEnabled(enabled);
					if (enabled) {
						workletNodeRef.current?.port.postMessage({
							type: "setPerformanceMonitorEnabled",
							enabled: true,
						});
					}
				},
				getPerformanceMetrics: () => metricsRef.current,
				ensureReady: async () => {
					resumeAudio();
					const deadline = performance.now() + 5000;
					while (
						performance.now() < deadline &&
						audioCtxRef.current?.state !== "running"
					) {
						await new Promise((resolve) => window.setTimeout(resolve, 50));
					}
					if (audioCtxRef.current?.state !== "running") {
						throw new Error("Audio context failed to enter running state");
					}
				},
			},
		}),
		[
			noteHandling.activeNotes,
			noteHandling.sendNoteOn,
			noteHandling.sendNoteOff,
			noteHandling.sendPolyAftertouch,
			noteHandling.panic,
			audioContextState,
			resumeAudio,
			effectivePitchHz,
			analyserNodeRef,
			audioCtxRef,
			setPerformanceMonitorEnabled,
			metricsRef,
			workletNodeRef,
		],
	);
}
