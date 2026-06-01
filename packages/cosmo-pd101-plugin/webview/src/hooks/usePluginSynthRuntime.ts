import type { SynthRuntime } from "@cosmo/cosmo-pd101";
import {
	type MidiBinding,
	useMidiLearnBindings,
	useMidiLearnStore,
	useNoteHandling,
	useSynthStore,
} from "@cosmo/cosmo-pd101";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UsePluginSynthRuntimeParams = {
	eventSink: (type: string, payload: Record<string, unknown>) => void;
};

function hasBridgeApi(name: string): boolean {
	return (
		typeof (window as Record<string, unknown>)[`__cz${name}`] === "function"
	);
}

function loadInitialMidiMappings(): void {
	if (!hasBridgeApi("GetMidiMappings")) return;
	void (window as { __czGetMidiMappings: () => Promise<unknown> })
		.__czGetMidiMappings()
		.then((result: unknown) => {
			if (!Array.isArray(result) || result.length === 0) {
				return;
			}

			const bindings: Partial<Record<string, MidiBinding>> = {};
			for (const mapping of result as Array<{
				paramKey: string;
				channel: number;
				cc: number;
			}>) {
				bindings[mapping.paramKey] = {
					paramKey: mapping.paramKey,
					channel: mapping.channel,
					cc: mapping.cc,
				};
			}

			useMidiLearnStore.setState({ bindings });
		});
}

function subscribeMidiMappings(): () => void {
	const setMidi = (
		window as { __czSetMidiMappings: (mappings: string) => void }
	).__czSetMidiMappings;
	const pushMappings = (bindings: Partial<Record<string, MidiBinding>>) => {
		const mappings = Object.values(bindings)
			.filter((binding): binding is MidiBinding => Boolean(binding))
			.map((binding) => ({
				paramKey: binding.paramKey,
				channel: binding.channel,
				cc: binding.cc,
			}));
		setMidi(JSON.stringify(mappings));
	};

	pushMappings(useMidiLearnStore.getState().bindings);

	return useMidiLearnStore.subscribe((state) => {
		pushMappings(state.bindings);
	});
}

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

	useMidiLearnBindings({ applyBindings: false });

	useEffect(() => {
		let cleanup: (() => void) | undefined;

		const setup = () => {
			loadInitialMidiMappings();
			if (hasBridgeApi("SetMidiMappings")) {
				cleanup = subscribeMidiMappings();
			}
		};

		if (!hasBridgeApi("GetMidiMappings") && !hasBridgeApi("SetMidiMappings")) {
			const intervalId = window.setInterval(() => {
				if (
					hasBridgeApi("GetMidiMappings") ||
					hasBridgeApi("SetMidiMappings")
				) {
					window.clearInterval(intervalId);
					setup();
				}
			}, 100);
			return () => {
				window.clearInterval(intervalId);
				cleanup?.();
			};
		}

		setup();
		return () => {
			cleanup?.();
		};
	}, []);

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
