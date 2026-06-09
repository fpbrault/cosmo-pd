import { useEffect, useMemo, useState } from "react";
import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
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
	const [voiceMarkerTick, setVoiceMarkerTick] = useState(0);

	useEffect(() => {
		if (section !== "envelopes") return;
		const id = setInterval(() => setVoiceMarkerTick((t) => t + 1), 16);
		return () => clearInterval(id);
	}, [section]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Keeps live voice markers refreshing while envelope tab is visible>
	return useMemo<StepEnvelopeVoiceMarker[]>(() => {
		if (section !== "envelopes") {
			return [];
		}

		const liveVoiceStates = synthController?.getLiveVoiceStates() ?? [];
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
	}, [
		section,
		activeEnvTab,
		activeEnv,
		lineIndex,
		synthController,
		voiceMarkerTick,
	]);
}
