import { useCallback, useEffect, useRef, useState } from "react";
import type { ModSource, SynthParams } from "@/lib/synth/bindings/synth";
import { DEFAULT_PRESET } from "@/lib/synth/presetStorage";

export type RuntimeModSources = Record<ModSource, number>;

export type RuntimeVoiceEnvState = {
	value: number;
	step: number;
	releasing: boolean;
	stepPos: number;
	prevLevel: number;
};

export type RuntimeVoiceLineState = {
	dco: RuntimeVoiceEnvState;
	dcw: RuntimeVoiceEnvState;
	dca: RuntimeVoiceEnvState;
};

export type RuntimeVoiceDebugState = {
	index: number;
	active: boolean;
	isReleasing: boolean;
	sustained: boolean;
	note: number | null;
	envNote: number;
	velocity: number;
	line1: RuntimeVoiceLineState;
	line2: RuntimeVoiceLineState;
};

export type WorkletPerformanceMetrics = {
	enabled: boolean;
	blockCount: number;
	lastMs: number;
	avgMs: number;
	maxMs: number;
	blockBudgetMs: number;
	lastRtPercent: number;
	avgRtPercent: number;
	maxRtPercent: number;
	blockSamples: number;
	sampleRate: number;
	activeVoices: number;
};

const RUNTIME_MOD_SOURCE_KEYS = {
	lfo1: true,
	lfo2: true,
	random: true,
	modEnv: true,
	velocity: true,
	modWheel: true,
	aftertouch: true,
} satisfies Record<ModSource, true>;

const ALL_RUNTIME_MOD_SOURCE_KEYS = Object.keys(
	RUNTIME_MOD_SOURCE_KEYS,
) as ModSource[];

function buildRuntimeModSources(
	readValue: (key: ModSource) => number,
): RuntimeModSources {
	return ALL_RUNTIME_MOD_SOURCE_KEYS.reduce((acc, key) => {
		acc[key] = readValue(key);
		return acc;
	}, {} as RuntimeModSources);
}

export const EMPTY_RUNTIME_MOD_SOURCES: RuntimeModSources =
	buildRuntimeModSources(() => 0);

export const EMPTY_RUNTIME_VOICE_STATES: RuntimeVoiceDebugState[] = [];

export type UseAudioSynthParams = {
	synthWasmUrl: string;
	synthBindingsUrl: string;
	pdVisualizerWorkletUrl: string;
};

export type AudioContextState = "suspended" | "running" | "closed";

export type AudioEngineRefs = {
	audioCtxRef: React.MutableRefObject<AudioContext | null>;
	gainNodeRef: React.MutableRefObject<GainNode | null>;
	analyserNodeRef: React.MutableRefObject<AnalyserNode | null>;
	workletNodeRef: React.MutableRefObject<AudioWorkletNode | null>;
	paramsRef: React.MutableRefObject<SynthParams>;
	/** Reactive audio context state — null until the context is created. */
	audioContextState: AudioContextState | null;
	/** Call from a button click handler to resume a suspended context. */
	resumeAudio: () => void;
};

function createInitialSynthParams(): SynthParams {
	return {
		...(JSON.parse(JSON.stringify(DEFAULT_PRESET.params)) as SynthParams),
		frequency: 220,
		volume: 0.4,
	};
}

export function useAudioEngine({
	synthWasmUrl,
	synthBindingsUrl,
	pdVisualizerWorkletUrl,
}: UseAudioSynthParams): AudioEngineRefs {
	const audioCtxRef = useRef<AudioContext | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const workletNodeRef = useRef<AudioWorkletNode | null>(null);
	const telemetryPollRef = useRef<number | null>(null);
	const audioInitRef = useRef(false);
	const [audioContextState, setAudioContextState] =
		useState<AudioContextState | null>(null);

	const paramsRef = useRef<SynthParams>(createInitialSynthParams());

	useEffect(() => {
		if (audioInitRef.current) return;
		audioInitRef.current = true;
		let disposed = false;

		const normalizeRuntimeModSources = (
			value: unknown,
		): RuntimeModSources | null => {
			if (!value || typeof value !== "object") {
				return null;
			}

			const detail = value as Partial<Record<keyof RuntimeModSources, unknown>>;
			const read = (key: keyof RuntimeModSources) => {
				const next = detail[key];
				return typeof next === "number" && Number.isFinite(next) ? next : 0;
			};

			return buildRuntimeModSources(read);
		};

		const normalizeRuntimeVoiceStates = (
			value: unknown,
		): RuntimeVoiceDebugState[] | null => {
			if (!Array.isArray(value)) {
				return null;
			}

			const readNumber = (source: unknown, fallback = 0) =>
				typeof source === "number" && Number.isFinite(source)
					? source
					: fallback;
			const readEnv = (source: unknown): RuntimeVoiceEnvState => {
				const detail =
					source && typeof source === "object"
						? (source as Record<string, unknown>)
						: {};
				return {
					value: readNumber(detail.value),
					step: readNumber(detail.step),
					releasing: detail.releasing === true,
					stepPos: readNumber(detail.stepPos),
					prevLevel: readNumber(detail.prevLevel),
				};
			};

			return value.map((entry, index) => {
				const detail =
					entry && typeof entry === "object"
						? (entry as Record<string, unknown>)
						: {};
				const line1 =
					detail.line1 && typeof detail.line1 === "object"
						? (detail.line1 as Record<string, unknown>)
						: {};
				const line2 =
					detail.line2 && typeof detail.line2 === "object"
						? (detail.line2 as Record<string, unknown>)
						: {};

				return {
					index: readNumber(detail.index, index),
					active: detail.active === true,
					isReleasing: detail.isReleasing === true,
					sustained: detail.sustained === true,
					note: typeof detail.note === "number" ? detail.note : null,
					envNote: readNumber(detail.envNote, 60),
					velocity: readNumber(detail.velocity, 0),
					line1: {
						dco: readEnv(line1.dco),
						dcw: readEnv(line1.dcw),
						dca: readEnv(line1.dca),
					},
					line2: {
						dco: readEnv(line2.dco),
						dcw: readEnv(line2.dcw),
						dca: readEnv(line2.dca),
					},
				};
			});
		};

		const requestRuntimeTelemetry = () => {
			const workletNode = workletNodeRef.current;
			if (!workletNode) {
				return;
			}
			workletNode.port.postMessage({ type: "requestRuntimeTelemetry" });
		};

		const startTelemetryPolling = () => {
			if (telemetryPollRef.current !== null) {
				return;
			}
			telemetryPollRef.current = window.setInterval(() => {
				requestRuntimeTelemetry();
			}, 33);
			requestRuntimeTelemetry();
		};

		const stopTelemetryPolling = () => {
			if (telemetryPollRef.current === null) {
				return;
			}
			window.clearInterval(telemetryPollRef.current);
			telemetryPollRef.current = null;
		};

		const init = async () => {
			try {
				const ctx = new AudioContext();
				if (disposed) {
					ctx.close();
					return;
				}

				// Assign immediately so resumeAudio() can call ctx.resume() within
				// the user's gesture call stack, even while the worklet is loading.
				audioCtxRef.current = ctx;
				ctx.addEventListener("statechange", () => {
					if (!disposed) setAudioContextState(ctx.state as AudioContextState);
				});
				// Do NOT eagerly call resumeOrDefer here — the AudioStartOverlay is the
				// intended user-gesture mechanism. Attaching global gesture listeners at
				// init time causes them to fire on Playwright's synthetic events, resuming
				// the context before the overlay can render.

				const [wasmResponse, bindingsResponse] = await Promise.all([
					fetch(synthWasmUrl),
					fetch(synthBindingsUrl),
				]);

				if (!wasmResponse.ok) {
					throw new Error(
						`Failed to fetch WASM (${wasmResponse.status}): ${synthWasmUrl}`,
					);
				}
				if (!bindingsResponse.ok) {
					throw new Error(
						`Failed to fetch WASM bindings (${bindingsResponse.status}): ${synthBindingsUrl}`,
					);
				}

				const [wasmBytes, bindingsJs] = await Promise.all([
					wasmResponse.arrayBuffer(),
					bindingsResponse.text(),
				]);

				await ctx.audioWorklet.addModule(pdVisualizerWorkletUrl);

				// Async init can outlive this effect (React Strict Mode mount/unmount,
				// route changes, etc.). If the context was closed/disposed in the
				// meantime, skip node construction to avoid InvalidStateError.
				if (disposed || audioCtxRef.current !== ctx || ctx.state === "closed") {
					await ctx.close().catch(() => {
						// Ignore close failures during stale-init cleanup.
					});
					return;
				}

				const workletNode = new AudioWorkletNode(ctx, "cosmo-processor");
				if (disposed) {
					workletNode.disconnect();
					ctx.close();
					return;
				}

				workletNode.port.onmessage = (e) => {
					if (e.data?.type === "ready") {
						workletNodeRef.current = workletNode;
						startTelemetryPolling();
						workletNode.port.postMessage({
							type: "setParams",
							params: paramsRef.current,
						});
					} else if (e.data?.type === "runtimeTelemetry") {
						const modSources = e.data.modSources
							? normalizeRuntimeModSources(JSON.parse(e.data.modSources))
							: null;
						if (modSources) {
							window.dispatchEvent(
								new CustomEvent<RuntimeModSources>("cz-runtime-mod-sources", {
									detail: modSources,
								}),
							);
						}
						const voices = e.data.voiceStates
							? normalizeRuntimeVoiceStates(JSON.parse(e.data.voiceStates))
							: null;
						if (voices) {
							window.dispatchEvent(
								new CustomEvent<RuntimeVoiceDebugState[]>(
									"cz-runtime-voice-states",
									{ detail: voices },
								),
							);
						}
						window.dispatchEvent(
							new CustomEvent<WorkletPerformanceMetrics>(
								"cz-performance-metrics",
								{ detail: e.data.metrics },
							),
						);
					} else if (e.data?.type === "runtimeModSources") {
						const sources = normalizeRuntimeModSources(e.data.sources);
						if (sources) {
							window.dispatchEvent(
								new CustomEvent<RuntimeModSources>("cz-runtime-mod-sources", {
									detail: sources,
								}),
							);
						}
					} else if (e.data?.type === "runtimeVoiceStates") {
						const voices = normalizeRuntimeVoiceStates(e.data.voices);
						if (voices) {
							window.dispatchEvent(
								new CustomEvent<RuntimeVoiceDebugState[]>(
									"cz-runtime-voice-states",
									{ detail: voices },
								),
							);
						}
					} else if (e.data?.type === "performanceMetrics") {
						window.dispatchEvent(
							new CustomEvent<WorkletPerformanceMetrics>(
								"cz-performance-metrics",
								{ detail: e.data.metrics },
							),
						);
					} else if (e.data?.type === "error") {
						console.error("[CZ Synth WASM] Worklet error:", e.data.message);
					}
				};

				workletNode.port.postMessage({ type: "init", wasmBytes, bindingsJs }, [
					wasmBytes,
				]);

				const gainNode = ctx.createGain();
				gainNode.gain.value = 1;
				const analyserNode = new AnalyserNode(ctx, { fftSize: 2048 });

				workletNode.connect(gainNode);
				gainNode.connect(analyserNode);
				analyserNode.connect(ctx.destination);

				gainNodeRef.current = gainNode;
				analyserNodeRef.current = analyserNode;
			} catch (err) {
				// init() can fail after we already created/assigned AudioContext.
				// Close and clear references immediately so we do not leak contexts.
				await audioCtxRef.current?.close().catch(() => {
					// Ignore close failures while handling init failure.
				});
				audioCtxRef.current = null;
				setAudioContextState(null);
				console.error("[PD Visualizer] Audio init failed:", err);
				audioInitRef.current = false;
			}
		};

		init();

		return () => {
			disposed = true;
			stopTelemetryPolling();
			audioInitRef.current = false;
			workletNodeRef.current?.disconnect();
			workletNodeRef.current = null;
			gainNodeRef.current?.disconnect();
			gainNodeRef.current = null;
			analyserNodeRef.current?.disconnect();
			analyserNodeRef.current = null;
			audioCtxRef.current?.close();
			audioCtxRef.current = null;
		};
	}, [synthWasmUrl, synthBindingsUrl, pdVisualizerWorkletUrl]);

	const resumeAudio = useCallback(() => {
		const ctx = audioCtxRef.current;
		if (!ctx) return;
		if (ctx.state === "running") {
			// Context already running (e.g. headless test env without autoplay policy).
			// Sync React state so the overlay closes.
			setAudioContextState("running");
			return;
		}
		if (ctx.state !== "suspended") return;
		void ctx.resume().catch(() => {
			// Ignore resume failures (e.g. autoplay still blocked).
		});
	}, []);

	return {
		audioCtxRef,
		gainNodeRef,
		analyserNodeRef,
		workletNodeRef,
		paramsRef,
		audioContextState,
		resumeAudio,
	};
}
