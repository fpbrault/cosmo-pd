import type { SynthRuntime } from "@cosmo/cosmo-pd101";
import { useNoteHandling, useSynthStore } from "@cosmo/cosmo-pd101";
import { useCallback, useMemo, useRef, useState } from "react";

type UsePluginSynthRuntimeParams = {
	eventSink: (type: string, payload: Record<string, unknown>) => void;
};

function normalizeBenchmarkMetrics(value: unknown) {
	if (!value || typeof value !== "object") {
		return null;
	}

	const candidate = value as Record<string, unknown>;
	const readNumber = (key: string) => {
		const next = candidate[key];
		return typeof next === "number" && Number.isFinite(next) ? next : 0;
	};

	return {
		enabled: candidate.enabled === true,
		blockCount: readNumber("blockCount"),
		lastMs: readNumber("lastMs"),
		avgMs: readNumber("avgMs"),
		maxMs: readNumber("maxMs"),
		blockBudgetMs: readNumber("blockBudgetMs"),
		lastRtPercent: readNumber("lastRtPercent"),
		avgRtPercent: readNumber("avgRtPercent"),
		maxRtPercent: readNumber("maxRtPercent"),
		blockSamples: readNumber("blockSamples"),
		sampleRate: readNumber("sampleRate"),
		activeVoices: readNumber("activeVoices"),
		uiQueueDepth: readNumber("uiQueueDepth"),
		paramsApplyCount: readNumber("paramsApplyCount"),
	};
}

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
			benchmark: {
				mode: "plugin",
				setPerformanceMonitorEnabled: async (enabled: boolean) => {
					await window.__czSetPerformanceMonitorEnabled?.(enabled);
				},
				getPerformanceMetrics: async () => {
					const value = await window.__czGetPerformanceMetrics?.();
					return normalizeBenchmarkMetrics(value);
				},
				ensureReady: async () => {
					if (
						!window.__czGetPerformanceMetrics ||
						!window.__czSetPerformanceMonitorEnabled
					) {
						throw new Error("Plugin benchmark bridge is unavailable");
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
			scopeActiveHz,
			subscribeScopeFrames,
		],
	);
}
