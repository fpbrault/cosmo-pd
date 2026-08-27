import { memo } from "react";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import CompactEnvelopePreset from "./CompactEnvelopePreset";
import CompactLineEditToggle from "./CompactLineEditToggle";
import { PERFORMANCE_ENVELOPE_KINDS } from "./performanceEnvelopeConstants";

export default memo(function PerformanceEnvelopePanel() {
	const selectedLine = useSynthUiStore((state) => state.simpleEditedLine);
	const line1 = usePhaseLineModel(1);
	const line2 = usePhaseLineModel(2);
	const line = selectedLine === 1 ? line1 : line2;

	return (
		<div
			className="flex min-h-0 flex-1 items-center gap-3 p-2"
			data-testid="simple-envelope-panel"
		>
			<div className="flex w-[5rem] shrink-0 justify-center border-cz-border border-r pr-2">
				<CompactLineEditToggle
					line1Editable={line1.meta.isAudible}
					line2Editable={line2.meta.isAudible}
				/>
			</div>
			<div className="flex min-w-0 flex-1 items-center justify-center gap-3">
				{PERFORMANCE_ENVELOPE_KINDS.map((envKind) => {
					const entry = line.envelopes.envs[envKind];
					return (
						<CompactEnvelopePreset
							key={envKind}
							envKind={envKind}
							envelope={entry.env}
							color={entry.envColor}
							onApply={entry.setEnv}
							lineIndex={selectedLine}
							lineColor={line.meta.color}
							envelopes={line.envelopes}
							large
						/>
					);
				})}
			</div>
		</div>
	);
});
