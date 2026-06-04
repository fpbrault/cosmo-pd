import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	EMPTY_RUNTIME_VOICE_STATES,
	type RuntimeVoiceDebugState,
} from "@/features/synth/hooks/useAudioEngine";
import { useOptionalSynthController } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import type {
	WaterfallPreviewData,
	WaterfallVoiceProgressState,
} from "./types";
import {
	buildWaterfallPreviewData,
	buildWaterfallPreviewHistories,
} from "./waterfallPreview";

export function useWavetableWaterfallPreview(
	enabled: boolean,
): WaterfallPreviewData | null {
	const synthController = useOptionalSynthController();
	const waterfallState = useSynthStore(
		useShallow((state) =>
			enabled
				? {
						warpAAmount: state.warpAAmount,
						warpBAmount: state.warpBAmount,
						warpAAlgo: state.warpAAlgo,
						warpBAlgo: state.warpBAlgo,
						algo2A: state.algo2A,
						algo2B: state.algo2B,
						algoBlendA: state.algoBlendA,
						algoBlendB: state.algoBlendB,
						windowType: state.windowType,
						line1Level: state.line1Level,
						line2Level: state.line2Level,
						line1DcwEnv: state.line1DcwEnv,
						line2DcwEnv: state.line2DcwEnv,
						line1DcaEnv: state.line1DcaEnv,
						line2DcaEnv: state.line2DcaEnv,
						line1BaseWaveformA: state.line1BaseWaveformA,
						line1BaseWaveformB: state.line1BaseWaveformB,
						line2BaseWaveformA: state.line2BaseWaveformA,
						line2BaseWaveformB: state.line2BaseWaveformB,
						line1AlgoControlsA: state.line1AlgoControlsA,
						line1AlgoControlsB: state.line1AlgoControlsB,
						line2AlgoControlsA: state.line2AlgoControlsA,
						line2AlgoControlsB: state.line2AlgoControlsB,
						phaseModSlot: state.fxSlots[4],
					}
				: null,
		),
	);
	const [liveVoiceStates, setLiveVoiceStates] = useState<
		RuntimeVoiceDebugState[]
	>(
		() =>
			synthController?.getLiveVoiceStates().slice() ??
			EMPTY_RUNTIME_VOICE_STATES,
	);
	const line1ProgressRef = useRef<Map<number, WaterfallVoiceProgressState>>(
		new Map(),
	);
	const line2ProgressRef = useRef<Map<number, WaterfallVoiceProgressState>>(
		new Map(),
	);

	useEffect(() => {
		if (!enabled) {
			setLiveVoiceStates(EMPTY_RUNTIME_VOICE_STATES);
			line1ProgressRef.current = new Map();
			line2ProgressRef.current = new Map();
			return;
		}

		const unregisterLiveVoiceStates =
			synthController?.registerLiveVoiceStatesConsumer();

		const onVoiceStates = (event: Event) => {
			const detail = (event as CustomEvent<RuntimeVoiceDebugState[]>).detail;
			setLiveVoiceStates(
				Array.isArray(detail) ? detail : EMPTY_RUNTIME_VOICE_STATES,
			);
		};

		window.addEventListener("cz-runtime-voice-states", onVoiceStates);
		return () => {
			unregisterLiveVoiceStates?.();
			window.removeEventListener("cz-runtime-voice-states", onVoiceStates);
		};
	}, [enabled, synthController]);

	const histories = useMemo(() => {
		if (!enabled || !waterfallState) {
			return null;
		}

		const phaseModParams =
			waterfallState.phaseModSlot?.type === "phaseMod"
				? waterfallState.phaseModSlot.params
				: null;
		const phaseModEnabled = phaseModParams?.enabled ?? false;

		return buildWaterfallPreviewHistories({
			warpAAmount: waterfallState.warpAAmount,
			warpBAmount: waterfallState.warpBAmount,
			warpAAlgo: waterfallState.warpAAlgo,
			warpBAlgo: waterfallState.warpBAlgo,
			algo2A: waterfallState.algo2A,
			algo2B: waterfallState.algo2B,
			algoBlendA: waterfallState.algoBlendA,
			algoBlendB: waterfallState.algoBlendB,
			windowType: waterfallState.windowType,
			line1Level: waterfallState.line1Level,
			line2Level: waterfallState.line2Level,
			line1DcwEnv: waterfallState.line1DcwEnv,
			line2DcwEnv: waterfallState.line2DcwEnv,
			line1DcaEnv: waterfallState.line1DcaEnv,
			line2DcaEnv: waterfallState.line2DcaEnv,
			line1BaseWaveformA: waterfallState.line1BaseWaveformA,
			line1BaseWaveformB: waterfallState.line1BaseWaveformB,
			line2BaseWaveformA: waterfallState.line2BaseWaveformA,
			line2BaseWaveformB: waterfallState.line2BaseWaveformB,
			line1AlgoControlsA: waterfallState.line1AlgoControlsA,
			line1AlgoControlsB: waterfallState.line1AlgoControlsB,
			line2AlgoControlsA: waterfallState.line2AlgoControlsA,
			line2AlgoControlsB: waterfallState.line2AlgoControlsB,
			intPmAmount: phaseModEnabled ? (phaseModParams?.amount ?? 0) : 0,
			intPmRatio: phaseModParams?.ratio ?? 1,
			pmPre: phaseModParams?.pmPre ?? true,
		});
	}, [enabled, waterfallState]);

	const preview = useMemo(() => {
		if (!enabled || !waterfallState || !histories) {
			return null;
		}

		const result = buildWaterfallPreviewData({
			histories,
			voices: liveVoiceStates,
			line1DcwEnv: waterfallState.line1DcwEnv,
			line1Level: waterfallState.line1Level,
			line2DcwEnv: waterfallState.line2DcwEnv,
			line2Level: waterfallState.line2Level,
			line1ProgressByVoice: line1ProgressRef.current,
			line2ProgressByVoice: line2ProgressRef.current,
		});

		line1ProgressRef.current = result.nextLine1ProgressByVoice;
		line2ProgressRef.current = result.nextLine2ProgressByVoice;
		return result.preview;
	}, [enabled, histories, liveVoiceStates, waterfallState]);

	return useDeferredValue(preview);
}
