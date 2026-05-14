import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useOptionalModMatrix } from "@/context/ModMatrixContext";
import {
	EMPTY_RUNTIME_MOD_SOURCES,
	EMPTY_RUNTIME_VOICE_STATES,
	type RuntimeModSources,
	type RuntimeVoiceDebugState,
} from "@/features/synth/hooks/useAudioEngine";
import { useSynthStore } from "@/features/synth/synthStore";
import type { UseSynthStateResult } from "@/features/synth/useSynthState";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import {
	type ModTarget,
	resolveModDestination,
} from "@/lib/synth/modDestination";
import {
	type ModTargetContext,
	type ModTargetKey,
	resolveTargetFromMetadata,
} from "@/lib/synth/modTargets";

const SYNTH_PARAM_SETTERS = {
	lineSelect: "setLineSelect",
	modMode: "setModMode",
	line1BaseWaveformA: "setLine1BaseWaveformA",
	line1BaseWaveformB: "setLine1BaseWaveformB",
	line2BaseWaveformA: "setLine2BaseWaveformA",
	line2BaseWaveformB: "setLine2BaseWaveformB",
	warpAAmount: "setWarpAAmount",
	warpBAmount: "setWarpBAmount",
	warpAAlgo: "setWarpAAlgo",
	warpBAlgo: "setWarpBAlgo",
	algo2A: "setAlgo2A",
	algo2B: "setAlgo2B",
	algoBlendA: "setAlgoBlendA",
	algoBlendB: "setAlgoBlendB",
	line1Level: "setLine1Level",
	line2Level: "setLine2Level",
	lineOctave: "setLineOctave",
	line2DetuneOctave: "setLine2DetuneOctave",
	line2DetuneNote: "setLine2DetuneNote",
	line2DetuneFine: "setLine2DetuneFine",
	line1DcoEnv: "setLine1DcoEnv",
	line1DcwEnv: "setLine1DcwEnv",
	line1DcaEnv: "setLine1DcaEnv",
	line1AlgoControlsA: "setLine1AlgoControlsA",
	line1AlgoControlsB: "setLine1AlgoControlsB",
	line2DcoEnv: "setLine2DcoEnv",
	line2DcwEnv: "setLine2DcwEnv",
	line2DcaEnv: "setLine2DcaEnv",
	line2AlgoControlsA: "setLine2AlgoControlsA",
	line2AlgoControlsB: "setLine2AlgoControlsB",
	line1DcwKeyFollow: "setLine1DcwKeyFollow",
	line2DcwKeyFollow: "setLine2DcwKeyFollow",
	volume: "setVolume",
	polyMode: "setPolyMode",
	velocityCurve: "setVelocityCurve",
	pitchBendRange: "setPitchBendRange",
	voiceCount: "setVoiceCount",
	unisonCount: "setUnisonCount",
	unisonDetune: "setUnisonDetune",
	unisonSpread: "setUnisonSpread",
	windowType: "setWindowType",
	portamentoEnabled: "setPortamentoEnabled",
	portamentoMode: "setPortamentoMode",
	portamentoRate: "setPortamentoRate",
	portamentoTime: "setPortamentoTime",
	lfoWaveform: "setLfoWaveform",
	lfoRate: "setLfoRate",
	lfoDepth: "setLfoDepth",
	lfoSymmetry: "setLfoSymmetry",
	lfoRetrigger: "setLfoRetrigger",
	lfoOffset: "setLfoOffset",
	lfo2Waveform: "setLfo2Waveform",
	lfo2Rate: "setLfo2Rate",
	lfo2Depth: "setLfo2Depth",
	lfo2Symmetry: "setLfo2Symmetry",
	lfo2Retrigger: "setLfo2Retrigger",
	lfo2Offset: "setLfo2Offset",
	randomRate: "setRandomRate",
	modEnvAttack: "setModEnvAttack",
	modEnvDecay: "setModEnvDecay",
	modEnvSustain: "setModEnvSustain",
	modEnvRelease: "setModEnvRelease",
} as const;

export type SynthParamKey = keyof typeof SYNTH_PARAM_SETTERS;

type LiveModSources = Readonly<RuntimeModSources>;
type LiveVoiceStates = ReadonlyArray<RuntimeVoiceDebugState>;

type SynthParamController = {
	getParam: <K extends SynthParamKey>(key: K) => UseSynthStateResult[K];
	setParam: <K extends SynthParamKey>(
		key: K,
		value: UseSynthStateResult[K],
	) => void;
	resolveDestination: (
		target: ModTarget | undefined,
		options?: { lineIndex?: 1 | 2 },
	) => ModDestination | undefined;
	resolveDestinationFromKey: (
		key: ModTargetKey,
		context?: ModTargetContext,
	) => ModDestination | undefined;
	getRouteCount: (destination: ModDestination | undefined) => number;
	hasActiveRoutes: (destination: ModDestination | undefined) => boolean;
	hasActiveRoutesForKey: (
		key: ModTargetKey,
		context?: ModTargetContext,
	) => boolean;
	getLiveSources: () => LiveModSources;
	getLiveVoiceStates: () => LiveVoiceStates;
	getModulatedValue: (params: {
		destination: ModDestination | undefined;
		baseValue: number;
	}) => number | undefined;
};

const SynthParamControllerContext = createContext<SynthParamController | null>(
	null,
);

type SynthParamControllerProviderProps = {
	children: ReactNode;
};

export function SynthParamControllerProvider({
	children,
}: SynthParamControllerProviderProps) {
	const maybeModMatrix = useOptionalModMatrix();
	const modRoutes = maybeModMatrix?.modMatrix.routes ?? [];
	const [liveSources, setLiveSources] = useState<LiveModSources>(
		EMPTY_RUNTIME_MOD_SOURCES,
	);
	const [liveVoiceStates, setLiveVoiceStates] = useState<LiveVoiceStates>(
		EMPTY_RUNTIME_VOICE_STATES,
	);
	const liveSourcesRef = useRef<LiveModSources>(EMPTY_RUNTIME_MOD_SOURCES);
	const liveVoiceStatesRef = useRef<LiveVoiceStates>(
		EMPTY_RUNTIME_VOICE_STATES,
	);

	useEffect(() => {
		liveSourcesRef.current = liveSources;
	}, [liveSources]);

	useEffect(() => {
		liveVoiceStatesRef.current = liveVoiceStates;
	}, [liveVoiceStates]);

	const getParam = useCallback(
		<K extends SynthParamKey>(key: K): UseSynthStateResult[K] => {
			return useSynthStore.getState()[key] as UseSynthStateResult[K];
		},
		[],
	);

	const setParam = useCallback(
		<K extends SynthParamKey>(key: K, value: UseSynthStateResult[K]) => {
			const setterName = SYNTH_PARAM_SETTERS[key];
			const setter = useSynthStore.getState()[setterName] as (
				next: UseSynthStateResult[K],
			) => void;
			setter(value);
		},
		[],
	);

	useEffect(() => {
		const onRuntimeModSources = (event: Event) => {
			const detail = (event as CustomEvent<RuntimeModSources | undefined>)
				.detail;
			if (!detail) {
				return;
			}

			setLiveSources({
				lfo1: Number.isFinite(detail.lfo1) ? detail.lfo1 : 0,
				lfo2: Number.isFinite(detail.lfo2) ? detail.lfo2 : 0,
				random: Number.isFinite(detail.random) ? detail.random : 0,
				modEnv: Number.isFinite(detail.modEnv) ? detail.modEnv : 0,
				velocity: Number.isFinite(detail.velocity) ? detail.velocity : 0,
				modWheel: Number.isFinite(detail.modWheel) ? detail.modWheel : 0,
				aftertouch: Number.isFinite(detail.aftertouch) ? detail.aftertouch : 0,
			});
		};

		window.addEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		return () => {
			window.removeEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		};
	}, []);

	useEffect(() => {
		const onRuntimeVoiceStates = (event: Event) => {
			const detail = (
				event as CustomEvent<RuntimeVoiceDebugState[] | undefined>
			).detail;
			if (!detail) {
				return;
			}

			setLiveVoiceStates(detail);
		};

		window.addEventListener("cz-runtime-voice-states", onRuntimeVoiceStates);
		return () => {
			window.removeEventListener(
				"cz-runtime-voice-states",
				onRuntimeVoiceStates,
			);
		};
	}, []);

	const resolveDestination = useCallback(
		(target: ModTarget | undefined, options?: { lineIndex?: 1 | 2 }) =>
			resolveModDestination(target, options),
		[],
	);

	const resolveDestinationFromKey = useCallback(
		(key: ModTargetKey, context?: ModTargetContext) =>
			resolveTargetFromMetadata(key, context),
		[],
	);

	const getRouteCount = useCallback(
		(destination: ModDestination | undefined) => {
			if (!destination) {
				return 0;
			}
			return modRoutes.filter(
				(route) => route.enabled && route.destination === destination,
			).length;
		},
		[modRoutes],
	);

	const hasActiveRoutes = useCallback(
		(destination: ModDestination | undefined) => getRouteCount(destination) > 0,
		[getRouteCount],
	);

	const hasActiveRoutesForKey = useCallback(
		(key: ModTargetKey, context?: ModTargetContext) => {
			const destination = resolveDestinationFromKey(key, context);
			return getRouteCount(destination) > 0;
		},
		[getRouteCount, resolveDestinationFromKey],
	);

	const getModulatedValue = useCallback(
		({
			destination,
			baseValue,
		}: {
			destination: ModDestination | undefined;
			baseValue: number;
		}): number | undefined => {
			if (!destination) {
				return undefined;
			}

			const activeRoutes = modRoutes.filter(
				(route) => route.enabled && route.destination === destination,
			);
			if (activeRoutes.length === 0) {
				return undefined;
			}

			const runtimeSources = liveSourcesRef.current;
			let liveModDelta = 0;
			for (const route of activeRoutes) {
				const sourceValue = runtimeSources[route.source] ?? 0;
				liveModDelta += route.amount * sourceValue;
			}

			const clampedLiveModDelta = Math.max(-2, Math.min(2, liveModDelta));
			const visualModScale = destination.includes("EnvStep") ? 127 : 1;
			return baseValue + clampedLiveModDelta * visualModScale;
		},
		[modRoutes],
	);

	const getLiveSources = useCallback(() => liveSourcesRef.current, []);
	const getLiveVoiceStates = useCallback(() => liveVoiceStatesRef.current, []);

	const controller = useMemo(
		() => ({
			getParam,
			setParam,
			resolveDestination,
			resolveDestinationFromKey,
			getRouteCount,
			hasActiveRoutes,
			hasActiveRoutesForKey,
			getLiveSources,
			getLiveVoiceStates,
			getModulatedValue,
		}),
		[
			getParam,
			setParam,
			resolveDestination,
			resolveDestinationFromKey,
			getRouteCount,
			hasActiveRoutes,
			hasActiveRoutesForKey,
			getLiveSources,
			getLiveVoiceStates,
			getModulatedValue,
		],
	);

	return (
		<SynthParamControllerContext.Provider value={controller}>
			{children}
		</SynthParamControllerContext.Provider>
	);
}

export function useSynthParam<K extends SynthParamKey>(
	key: K,
): {
	value: UseSynthStateResult[K];
	setValue: (value: UseSynthStateResult[K]) => void;
} {
	// Selective subscription — only re-renders when `key` changes in the store.
	const value = useSynthStore((s) => s[key] as UseSynthStateResult[K]);
	const controller = useContext(SynthParamControllerContext);
	if (!controller) {
		throw new Error(
			"useSynthParam must be used within SynthParamControllerProvider",
		);
	}
	const setValue = useCallback(
		(v: UseSynthStateResult[K]) => controller.setParam(key, v),
		[controller.setParam, key],
	);

	return {
		value,
		setValue,
	};
}

export function useOptionalSynthParam<K extends SynthParamKey>(
	key: K,
): UseSynthStateResult[K] | undefined {
	// Selective subscription even in the optional variant.
	return useSynthStore((s) => s[key] as UseSynthStateResult[K]);
}

export function useOptionalSynthController() {
	return useContext(SynthParamControllerContext);
}
