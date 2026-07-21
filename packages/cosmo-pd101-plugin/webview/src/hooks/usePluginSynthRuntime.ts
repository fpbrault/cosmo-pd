import type { SynthRuntime } from "@cosmo/cosmo-pd101";
import {
	useNoteHandling,
	useSynthStore,
	useSynthUiStore,
} from "@cosmo/cosmo-pd101";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	hasMeaningfulScopeHzChange,
	normalizeScopeHz,
} from "../lib/scopePerformance";

type UsePluginSynthRuntimeParams = {
	eventSink: (type: string, payload: Record<string, unknown>) => void;
};

type ScopeFrameSubscriber = Parameters<
	NonNullable<SynthRuntime["subscribeScopeFrames"]>
>[0];

export function usePluginSynthRuntime({
	eventSink,
}: UsePluginSynthRuntimeParams): SynthRuntime {
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const [scopeActiveHz, setScopeActiveHz] = useState(220);
	const scopeActiveHzRef = useRef(220);
	const scopeFrameSubscribersRef = useRef(new Set<ScopeFrameSubscriber>());
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);

	const noteHandling = useNoteHandling({
		eventSink,
		velocityCurve,
		pcKeyboardBaseNote: 36 + keyboardRange * 12,
		midiInputEnabled: false,
	});

	const dispatchScopeFrame = useCallback<NonNullable<Window["__czOnScope"]>>(
		(samples, sampleRate, hz) => {
			const nextHz = normalizeScopeHz(hz);
			if (hasMeaningfulScopeHzChange(scopeActiveHzRef.current, nextHz)) {
				scopeActiveHzRef.current = nextHz;
				setScopeActiveHz(nextHz);
			}
			const frame = {
				samples:
					samples instanceof Float32Array
						? samples
						: Float32Array.from(samples),
				sampleRate,
				hz: nextHz,
			};
			for (const subscriber of scopeFrameSubscribersRef.current) {
				subscriber(frame);
			}
		},
		[],
	);

	const subscribeScopeFrames = useCallback<
		NonNullable<SynthRuntime["subscribeScopeFrames"]>
	>(
		(onFrame) => {
			const subscribers = scopeFrameSubscribersRef.current;
			subscribers.add(onFrame);
			if (subscribers.size === 1) {
				window.__czOnScope = dispatchScopeFrame;
			}
			return () => {
				subscribers.delete(onFrame);
				if (
					subscribers.size === 0 &&
					window.__czOnScope === dispatchScopeFrame
				) {
					window.__czOnScope = undefined;
				}
			};
		},
		[dispatchScopeFrame],
	);

	return useMemo(
		() => ({
			activeNotes: noteHandling.activeNotes,
			pitchBend: noteHandling.pitchBend,
			modWheel: noteHandling.modWheel,
			sendNoteOn: noteHandling.sendNoteOn,
			sendNoteOff: noteHandling.sendNoteOff,
			sendPitchBend: noteHandling.sendPitchBend,
			sendModWheel: noteHandling.sendModWheel,
			sendPolyAftertouch: noteHandling.sendPolyAftertouch,
			panic: noteHandling.panic,
			audioContextState: "running",
			resumeAudio: () => {},
			effectivePitchHz: scopeActiveHz,
			scopePerformanceMode:
				window.__czHostPlatform === "ios" ? "constrained" : "standard",
			analyserNodeRef,
			audioCtxRef,
			subscribeScopeFrames,
		}),
		[
			noteHandling.activeNotes,
			noteHandling.pitchBend,
			noteHandling.modWheel,
			noteHandling.sendNoteOn,
			noteHandling.sendNoteOff,
			noteHandling.sendPitchBend,
			noteHandling.sendModWheel,
			noteHandling.sendPolyAftertouch,
			noteHandling.panic,
			scopeActiveHz,
			subscribeScopeFrames,
		],
	);
}
