import { useEffect, useMemo, useState } from "react";
import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import type { RuntimeVoiceDebugState } from "@/features/synth/hooks/useAudioEngine";
import { useOptionalSynthController } from "@/features/synth/SynthParamController";
import type { EnvTab } from "@/features/synth/synthUiStore";
import { getEnvelopeVoiceProgress } from "./perLineWarpUtils";
import type {
	PhaseLineEnvelopeEntry,
	PhaseLineSection,
} from "./phaseLineTypes";
import type { StepEnvelopeVoiceMarker } from "./StepEnvelopeEditor";

export function usePhaseLineEnvelopeMarkers({
	lineIndex,
	section,
	activeEnvTab,
	activeEnv,
}: {
	lineIndex: LineIndex;
	section: PhaseLineSection;
	activeEnvTab: EnvTab;
	activeEnv: PhaseLineEnvelopeEntry;
}): StepEnvelopeVoiceMarker[] {
	const synthController = useOptionalSynthController();
	const [liveVoiceStates, setLiveVoiceStates] = useState<
		ReadonlyArray<RuntimeVoiceDebugState>
	>([]);

	useEffect(() => {
		if (section !== "envelopes") {
			setLiveVoiceStates([]);
			return;
		}

		const onRuntimeVoiceStates = (event: Event) => {
			const detail = (
				event as CustomEvent<RuntimeVoiceDebugState[] | undefined>
			).detail;
			if (detail) {
				setLiveVoiceStates(detail);
			}
		};

		window.addEventListener("cz-runtime-voice-states", onRuntimeVoiceStates);
		setLiveVoiceStates(synthController?.getLiveVoiceStates() ?? []);
		const unregister = synthController?.registerLiveVoiceStatesConsumer();

		return () => {
			window.removeEventListener(
				"cz-runtime-voice-states",
				onRuntimeVoiceStates,
			);
			unregister?.();
		};
	}, [section, synthController]);

	return useMemo<StepEnvelopeVoiceMarker[]>(() => {
		if (section !== "envelopes") {
			return [];
		}

		return liveVoiceStates
			.filter((voice) => voice.active)
			.map((voice) => {
				const lineState = lineIndex === 1 ? voice.line1 : voice.line2;
				const envState = lineState[activeEnvTab];
				return {
					id: voice.index,
					step: envState.step,
					progress: getEnvelopeVoiceProgress(
						activeEnv.env,
						envState.step,
						envState.value,
					),
					releasing: envState.releasing || voice.isReleasing,
					color: voice.isReleasing ? "#f59e0b" : "#f8fafc",
				};
			});
	}, [section, activeEnvTab, activeEnv, lineIndex, liveVoiceStates]);
}
