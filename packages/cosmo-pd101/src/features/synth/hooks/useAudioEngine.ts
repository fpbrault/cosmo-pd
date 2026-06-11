import { useCallback, useEffect, useRef, useState } from "react";
import type { ModSource, SynthParams } from "@/lib/synth/bindings/synth";
import { DEFAULT_PRESET } from "@/lib/synth/presetStorage";

export type RuntimeModSources = Record<ModSource, number> & {
	pitchBend: number;
};

export type RuntimeVoiceEnvState = {
	value: number;
	step: number;
	releasing: boolean;
	stepPos: number;
	prevLevel: number;
};

type RuntimeVoiceLineState = {
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

type WorkletPerformanceMetrics = {
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
	macro1: true,
	macro2: true,
	macro3: true,
	macro4: true,
} satisfies Record<ModSource, true>;

const ALL_RUNTIME_MOD_SOURCE_KEYS = Object.keys(
	RUNTIME_MOD_SOURCE_KEYS,
) as ModSource[];

function buildRuntimeModSources(
	readValue: (key: ModSource) => number,
	pitchBend = 0,
): RuntimeModSources {
	const sources = ALL_RUNTIME_MOD_SOURCE_KEYS.reduce((acc, key) => {
		acc[key] = readValue(key);
		return acc;
	}, {} as RuntimeModSources);
	sources.pitchBend = pitchBend;
	return sources;
}

export const EMPTY_RUNTIME_MOD_SOURCES: RuntimeModSources =
	buildRuntimeModSources(() => 0);

export const EMPTY_RUNTIME_VOICE_STATES: RuntimeVoiceDebugState[] = [];

export type UseAudioSynthParams = {
	synthWasmUrl: string;
	synthBindingsUrl: string;
	cosmoWorkletUrl: string;
};

type AudioContextState = "suspended" | "running" | "closed";

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
	return JSON.parse(JSON.stringify(DEFAULT_PRESET.params)) as SynthParams;
}

export function useAudioEngine({
	synthWasmUrl,
	synthBindingsUrl,
	cosmoWorkletUrl,
}: UseAudioSynthParams): AudioEngineRefs {
	const audioCtxRef = useRef<AudioContext | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const workletNodeRef = useRef<AudioWorkletNode | null>(null);
	const telemetryPollRef = useRef<number | null>(null);
	const audioInitRef = useRef(false);
	const disposedRef = useRef(false);
	const [audioContextState, setAudioContextState] =
		useState<AudioContextState | null>(null);

	const paramsRef = useRef<SynthParams>(createInitialSynthParams());

	const normalizeRuntimeModSources = useCallback(
		(value: unknown): RuntimeModSources | null => {
			if (!value || typeof value !== "object") {
				return null;
			}

			const detail = value as Partial<Record<keyof RuntimeModSources, unknown>>;
			const read = (key: keyof RuntimeModSources) => {
				const next = detail[key];
				return typeof next === "number" && Number.isFinite(next) ? next : 0;
			};

			const pitchBend = detail.pitchBend;
			return buildRuntimeModSources(
				read,
				typeof pitchBend === "number" && Number.isFinite(pitchBend)
					? Math.max(-1, Math.min(1, pitchBend))
					: 0,
			);
		},
		[],
	);

	const normalizeRuntimeVoiceStates = useCallback(
		(value: unknown): RuntimeVoiceDebugState[] | null => {
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
		},
		[],
	);

	const requestRuntimeTelemetry = useCallback(() => {
		const workletNode = workletNodeRef.current;
		if (!workletNode) {
			return;
		}
		workletNode.port.postMessage({ type: "requestRuntimeTelemetry" });
	}, []);

	const startTelemetryPolling = useCallback(() => {
		if (telemetryPollRef.current !== null) {
			return;
		}
		telemetryPollRef.current = window.setInterval(() => {
			requestRuntimeTelemetry();
		}, 33);
		requestRuntimeTelemetry();
	}, [requestRuntimeTelemetry]);

	const stopTelemetryPolling = useCallback(() => {
		if (telemetryPollRef.current === null) {
			return;
		}
		window.clearInterval(telemetryPollRef.current);
		telemetryPollRef.current = null;
	}, []);

	const initAudio = useCallback(async () => {
		if (audioInitRef.current) return;
		audioInitRef.current = true;

		try {
			const ctx = new AudioContext();
			if (disposedRef.current) {
				await ctx.close().catch(() => {
					// Ignore close failures during stale-init cleanup.
				});
				return;
			}

			audioCtxRef.current = ctx;
			ctx.addEventListener("statechange", () => {
				if (!disposedRef.current) {
					setAudioContextState(ctx.state as AudioContextState);
				}
			});
			setAudioContextState(ctx.state as AudioContextState);

			if (ctx.state === "suspended") {
				await ctx.resume();
			}
			if (!disposedRef.current) {
				setAudioContextState(ctx.state as AudioContextState);
			}

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

			await ctx.audioWorklet.addModule(cosmoWorkletUrl);

			// Async init can outlive this effect (React Strict Mode mount/unmount,
			// route changes, etc.). If the context was closed/disposed in the
			// meantime, skip node construction to avoid InvalidStateError.
			if (
				disposedRef.current ||
				audioCtxRef.current !== ctx ||
				ctx.state === "closed"
			) {
				await ctx.close().catch(() => {
					// Ignore close failures during stale-init cleanup.
				});
				return;
			}

			const workletNode = new AudioWorkletNode(ctx, "cosmo-processor");
			if (disposedRef.current) {
				workletNode.disconnect();
				await ctx.close().catch(() => {
					// Ignore close failures during stale-init cleanup.
				});
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
			// initAudio() can fail after we already created/assigned AudioContext.
			// Close and clear references so the Start Audio button is a real retry.
			await audioCtxRef.current?.close().catch(() => {
				// Ignore close failures while handling init failure.
			});
			audioCtxRef.current = null;
			setAudioContextState(null);
			console.error("[Cosmo Engine] Audio init failed:", err);
			audioInitRef.current = false;
		}
	}, [
		cosmoWorkletUrl,
		normalizeRuntimeModSources,
		normalizeRuntimeVoiceStates,
		startTelemetryPolling,
		synthBindingsUrl,
		synthWasmUrl,
	]);

	useEffect(() => {
		disposedRef.current = false;
		return () => {
			disposedRef.current = true;
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
	}, [stopTelemetryPolling]);

	const resumeAudio = useCallback(() => {
		const ctx = audioCtxRef.current;
		if (!ctx) {
			void initAudio();
			return;
		}
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
	}, [initAudio]);

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
