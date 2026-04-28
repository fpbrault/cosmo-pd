import { useCallback, useEffect, useRef, useState } from "react";
import type { PolyMode } from "@/features/synth/useSynthState";
import type {
	Algo,
	AlgoControlValueV1,
	CzWaveform,
	StepEnvData,
	WindowType,
} from "@/lib/synth/bindings/synth";

export type RuntimeModSources = {
	lfo1: number;
	lfo2: number;
	random: number;
	modEnv: number;
	velocity: number;
	modWheel: number;
	aftertouch: number;
};

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

export const EMPTY_RUNTIME_MOD_SOURCES: RuntimeModSources = {
	lfo1: 0,
	lfo2: 0,
	random: 0,
	modEnv: 0,
	velocity: 0,
	modWheel: 0,
	aftertouch: 0,
};

export const EMPTY_RUNTIME_VOICE_STATES: RuntimeVoiceDebugState[] = [];

export type UseAudioEngineParams = {
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
	paramsRef: React.MutableRefObject<EngineParams>;
	/** Reactive audio context state — null until the context is created. */
	audioContextState: AudioContextState | null;
	/** Call from a button click handler to resume a suspended context. */
	resumeAudio: () => void;
};

export type EngineParams = {
	lineSelect: string;
	modMode: string;
	octave: number;
	line1: LineParams;
	line2: LineParams;
	intPmAmount: number;
	intPmRatio: number;
	extPmAmount: number;
	pmPre: boolean;
	frequency: number;
	volume: number;
	polyMode: PolyMode;
	legato: boolean;
	chorus: { enabled: boolean; rate: number; depth: number; mix: number };
	delay: { enabled: boolean; time: number; feedback: number; mix: number };
	reverb: {
		enabled: boolean;
		mix: number;
		space: number;
		predelay: number;
		brightness: number;
		highCut: number;
		distance: number;
		character: number;
	};
	vibrato: {
		enabled: boolean;
		waveform: number;
		rate: number;
		depth: number;
		delay: number;
	};
	portamento: { enabled: boolean; mode: string; rate: number; time: number };
	lfo: {
		enabled: boolean;
		waveform: string;
		rate: number;
		depth: number;
		offset: number;
	};
	filter: {
		enabled: boolean;
		type: string;
		cutoff: number;
		resonance: number;
		envAmount: number;
	};
	pitchBendRange: number;
	modWheelVibratoDepth: number;
	modMatrix: {
		routes: {
			source: string;
			destination: string;
			amount: number;
			enabled: boolean;
		}[];
	};
};

export type LineParams = {
	algo: Algo;
	algo2: Algo | null;
	algoBlend: number;
	window: string;
	cz: {
		slotAWaveform: CzWaveform;
		slotBWaveform: CzWaveform;
		window: WindowType;
	};
	dcaBase: number;
	dcwBase: number;
	modulation: number;
	detuneCents: number;
	octave: number;
	dcoEnv: StepEnvData;
	dcwEnv: StepEnvData;
	dcaEnv: StepEnvData;
	keyFollow: number;
	algoControls?: AlgoControlValueV1[];
};

type ResumableAudioContext = Pick<AudioContext, "state" | "resume">;

const USER_GESTURE_EVENTS = [
	"pointerdown",
	"mousedown",
	"touchstart",
	"keydown",
] as const;

function isAutoplayBlockError(error: unknown): boolean {
	if (!(error instanceof Error)) {
		return false;
	}
	const name = error.name.toLowerCase();
	const message = error.message.toLowerCase();
	return (
		name.includes("notallowed") ||
		message.includes("not allowed") ||
		message.includes("user gesture")
	);
}

/**
 * Attempts to resume a suspended AudioContext. If resume() resolves but the
 * context is still suspended (browsers silently ignore the call under autoplay
 * restrictions), or if resume() throws an autoplay-related error, gesture
 * listeners are attached so the engine recovers on first user interaction.
 *
 * Returns the cleanup function for the gesture listeners, or null if the
 * context was already running or resumed immediately.
 */
export async function resumeOrDefer(
	ctx: ResumableAudioContext,
): Promise<(() => void) | null> {
	if (ctx.state !== "suspended") return null;

	try {
		await ctx.resume();
	} catch (err) {
		if (!isAutoplayBlockError(err)) throw err;
		// Explicit autoplay rejection — fall through to attach gesture listeners.
	}

	// Browsers commonly resolve resume() without error but leave the context
	// suspended when autoplay is blocked. Check state regardless of whether an
	// error was thrown.
	if ((ctx.state as string) !== "running") {
		return attachResumeOnUserGesture(ctx);
	}

	return null;
}

export function attachResumeOnUserGesture(
	ctx: ResumableAudioContext,
): () => void {
	let active = true;

	const cleanup = () => {
		if (!active) return;
		active = false;
		for (const eventName of USER_GESTURE_EVENTS) {
			window.removeEventListener(eventName, tryResume, true);
		}
	};

	const tryResume = () => {
		if (!active) return;
		void ctx
			.resume()
			.then(() => {
				if (ctx.state === "running") {
					cleanup();
				}
			})
			.catch(() => {
				// Keep listeners attached until a later gesture succeeds.
			});
	};

	for (const eventName of USER_GESTURE_EVENTS) {
		window.addEventListener(eventName, tryResume, true);
	}

	return cleanup;
}

const DEFAULT_LINE_PARAMS: LineParams = {
	algo: "cz101",
	algo2: null,
	algoBlend: 0,
	window: "off",
	cz: {
		slotAWaveform: "saw",
		slotBWaveform: "saw",
		window: "off",
	},
	dcaBase: 1.0,
	dcwBase: 0,
	modulation: 0,
	detuneCents: 0,
	octave: 0,
	dcoEnv: {
		steps: Array(8).fill({ level: 0, rate: 0 }),
		sustainStep: 1,
		stepCount: 2,
		loop: false,
	},
	dcwEnv: {
		steps: Array(8).fill({ level: 0, rate: 0 }),
		sustainStep: 2,
		stepCount: 4,
		loop: false,
	},
	dcaEnv: {
		steps: Array(8).fill({ level: 0, rate: 0 }),
		sustainStep: 2,
		stepCount: 4,
		loop: false,
	},
	keyFollow: 0,
	algoControls: [],
};

export function useAudioEngine({
	synthWasmUrl,
	synthBindingsUrl,
	pdVisualizerWorkletUrl,
}: UseAudioEngineParams): AudioEngineRefs {
	const audioCtxRef = useRef<AudioContext | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const workletNodeRef = useRef<AudioWorkletNode | null>(null);
	const audioInitRef = useRef(false);
	const [audioContextState, setAudioContextState] = useState<AudioContextState | null>(null);

	const paramsRef = useRef<EngineParams>({
		lineSelect: "L1+L2",
		modMode: "single",
		octave: 0,
		line1: { ...DEFAULT_LINE_PARAMS },
		line2: { ...DEFAULT_LINE_PARAMS },
		intPmAmount: 0,
		intPmRatio: 1,
		extPmAmount: 0,
		pmPre: true,
		frequency: 220,
		volume: 0.4,
		polyMode: "poly8",
		legato: false,
		chorus: { enabled: false, rate: 0.8, depth: 0.003, mix: 0 },
		delay: { enabled: false, time: 0.3, feedback: 0.35, mix: 0 },
		reverb: {
			enabled: false,
			mix: 0,
			space: 0.5,
			predelay: 0,
			brightness: 0.7,
			highCut: 0,
			distance: 0.3,
			character: 0.3,
		},
		vibrato: { enabled: false, waveform: 0, rate: 0, depth: 0, delay: 0 },
		portamento: { enabled: false, mode: "rate", rate: 0, time: 0 },
		lfo: {
			enabled: false,
			waveform: "sine",
			rate: 0,
			depth: 0,
			offset: 0,
		},
		filter: {
			enabled: false,
			type: "lp",
			cutoff: 20000,
			resonance: 0,
			envAmount: 0,
		},
		pitchBendRange: 2,
		modWheelVibratoDepth: 0,
		modMatrix: { routes: [] },
	});

	useEffect(() => {
		if (audioInitRef.current) return;
		audioInitRef.current = true;
		let disposed = false;
		let removeGestureResumeListener: (() => void) | null = null;

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

			return {
				lfo1: read("lfo1"),
				lfo2: read("lfo2"),
				random: read("random"),
				modEnv: read("modEnv"),
				velocity: read("velocity"),
				modWheel: read("modWheel"),
				aftertouch: read("aftertouch"),
			};
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
				setAudioContextState(ctx.state as AudioContextState);
				removeGestureResumeListener = await resumeOrDefer(ctx);

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

				const workletNode = new AudioWorkletNode(ctx, "cosmo-processor");
				if (disposed) {
					workletNode.disconnect();
					ctx.close();
					return;
				}

				workletNode.port.onmessage = (e) => {
					if (e.data?.type === "ready") {
						workletNodeRef.current = workletNode;
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
				console.error("[PD Visualizer] Audio init failed:", err);
				audioInitRef.current = false;
			}
		};

		init();

		return () => {
			disposed = true;
			audioInitRef.current = false;
			removeGestureResumeListener?.();
			removeGestureResumeListener = null;
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
		if (!ctx || ctx.state !== "suspended") return;
		void ctx.resume();
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
