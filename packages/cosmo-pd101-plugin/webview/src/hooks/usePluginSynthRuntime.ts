import type { PerformanceMetrics, SynthRuntime } from "@cosmo/cosmo-pd101";
import {
	useNoteHandling,
	useSynthStore,
	useSynthUiStore,
} from "@cosmo/cosmo-pd101";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	hasMeaningfulScopeHzChange,
	normalizeScopeHz,
} from "../lib/scopePerformance";

const SCOPE_HZ_STATE_UPDATE_INTERVAL_MS = 100;

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
	const scopeHzStateUpdatedAtRef = useRef(Number.NEGATIVE_INFINITY);
	const scopeFrameSubscribersRef = useRef(new Set<ScopeFrameSubscriber>());
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const performanceEnabledRef = useRef(false);
	const performanceMetricsRef = useRef<PerformanceMetrics | null>(null);
	const [performanceEnabled, setPerformanceEnabled] = useState(false);
	const [, setPerformanceMetricsVersion] = useState(0);

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
				const now = performance.now();
				if (
					now - scopeHzStateUpdatedAtRef.current >=
					SCOPE_HZ_STATE_UPDATE_INTERVAL_MS
				) {
					scopeHzStateUpdatedAtRef.current = now;
					setScopeActiveHz(nextHz);
				}
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

	const setPerformanceMonitorEnabled = useCallback((enabled: boolean) => {
		performanceEnabledRef.current = enabled;
		setPerformanceEnabled(enabled);
		if (!enabled) performanceMetricsRef.current = null;
		window.__czSetPerformanceMonitorEnabled?.(enabled);
	}, []);

	useEffect(() => {
		if (!performanceEnabled || !window.__czGetPerformanceMetrics) {
			return;
		}
		let active = true;
		const poll = () => {
			void window.__czGetPerformanceMetrics?.().then((metrics) => {
				if (!active) return;
				performanceMetricsRef.current = {
					enabled: metrics.enabled,
					blockCount: metrics.blockCount ?? 0,
					lastMs: metrics.lastMs ?? 0,
					avgMs: metrics.avgMs ?? 0,
					maxMs: metrics.maxMs ?? 0,
					blockBudgetMs: metrics.blockBudgetMs ?? 0,
					lastRtPercent: metrics.lastRtPercent ?? 0,
					avgRtPercent: metrics.avgRtPercent ?? 0,
					maxRtPercent: metrics.maxRtPercent ?? 0,
					blockSamples: metrics.blockSamples ?? 0,
					sampleRate: metrics.sampleRate ?? 0,
					activeVoices: metrics.activeVoices ?? 0,
					overBudgetBlocks: metrics.overBudgetBlocks ?? 0,
				};
				setPerformanceMetricsVersion((version) => version + 1);
			});
		};
		poll();
		const intervalId = window.setInterval(poll, 500);
		return () => {
			active = false;
			window.clearInterval(intervalId);
		};
	}, [performanceEnabled]);

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
			performanceMonitor: {
				source: "plugin",
				setEnabled: setPerformanceMonitorEnabled,
				getSnapshot: () => performanceMetricsRef.current,
			},
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
			setPerformanceMonitorEnabled,
		],
	);
}
