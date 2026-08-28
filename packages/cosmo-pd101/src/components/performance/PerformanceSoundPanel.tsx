import { memo } from "react";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import PerformanceLineSection from "./PerformanceLineSection";
import PerformanceRoutingSection from "./PerformanceRoutingSection";
import PerformanceVoiceRack from "./PerformanceVoiceRack";
import PerformanceVoiceSection from "./PerformanceVoiceSection";

export default memo(function PerformanceSoundPanel() {
	const line1 = usePhaseLineModel(1);
	const line2 = usePhaseLineModel(2);
	const setEditedAlgo = useSynthUiStore(
		(state) => state.setSimpleEditedAlgoForLine,
	);

	return (
		<div
			className="flex min-h-0 min-w-0 flex-1 gap-1"
			data-testid="simple-sound-panel"
		>
			<PerformanceVoiceRack>
				<PerformanceLineSection
					line={line1}
					expanded
					onActivate={(algo) => setEditedAlgo(1, algo)}
					embedded
				/>
				<PerformanceLineSection
					line={line2}
					expanded
					onActivate={(algo) => setEditedAlgo(2, algo)}
					embedded
				/>
				<PerformanceRoutingSection embedded />
				<PerformanceVoiceSection embedded />
			</PerformanceVoiceRack>
		</div>
	);
});
