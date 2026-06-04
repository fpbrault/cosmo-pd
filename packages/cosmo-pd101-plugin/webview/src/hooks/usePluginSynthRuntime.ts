import type { SynthRuntime } from "@cosmo/cosmo-pd101";
import { useNoteHandling, useSynthStore } from "@cosmo/cosmo-pd101";
import { useCallback, useMemo, useRef, useState } from "react";

type UsePluginSynthRuntimeParams = {
	eventSink: (type: string, payload: Record<string, unknown>) => void;
};

export function usePluginSynthRuntime({
	eventSink,
}: UsePluginSynthRuntimeParams): SynthRuntime {
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const [scopeActiveHz, setScopeActiveHz] = useState(220);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);

	const noteHandling = useNoteHandling({
		eventSink,
		velocityCurve,
		midiInputEnabled: false,
	});

	const subscribeScopeFrames = useCallback<
		SynthRuntime["subscribeScopeFrames"]
	>((onFrame) => {
		window.__czOnScope = (samples, sampleRate, hz) => {
			setScopeActiveHz(Number.isFinite(hz) && hz > 0 ? hz : 220);
			onFrame({
				samples:
					samples instanceof Float32Array
						? samples
						: Float32Array.from(samples),
				sampleRate,
				hz,
			});
		};
		return () => {
			window.__czOnScope = undefined;
		};
	}, []);

	return useMemo(
		() => ({
			activeNotes: noteHandling.activeNotes,
			sendNoteOn: noteHandling.sendNoteOn,
			sendNoteOff: noteHandling.sendNoteOff,
			sendPolyAftertouch: noteHandling.sendPolyAftertouch,
			panic: noteHandling.panic,
			audioContextState: "running",
			resumeAudio: () => {},
			effectivePitchHz: scopeActiveHz,
			analyserNodeRef,
			audioCtxRef,
			subscribeScopeFrames,
		}),
		[
			noteHandling.activeNotes,
			noteHandling.sendNoteOn,
			noteHandling.sendNoteOff,
			noteHandling.sendPolyAftertouch,
			noteHandling.panic,
			scopeActiveHz,
			subscribeScopeFrames,
		],
	);
}
