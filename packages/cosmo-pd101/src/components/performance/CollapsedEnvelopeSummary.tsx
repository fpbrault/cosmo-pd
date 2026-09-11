import { memo } from "react";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import CollapsedSectionSummary from "./CollapsedSectionSummary";
import EnvelopeCanvas from "./EnvelopeCanvas";
import { PERFORMANCE_ENVELOPE_KINDS } from "./performanceEnvelopeConstants";

export default memo(function CollapsedEnvelopeSummary({
	onExpand,
}: {
	onExpand: () => void;
}) {
	const selectedLine = useSynthUiStore((state) => state.simpleEditedLine);
	const line1 = usePhaseLineModel(1);
	const line2 = usePhaseLineModel(2);
	const line = selectedLine === 1 ? line1 : line2;
	return (
		<CollapsedSectionSummary
			title="Envelope +"
			ariaLabel="Expand Envelope section"
			testId="simple-envelope-summary"
			onExpand={onExpand}
			className="border-cz-border border-l"
			headerClassName="text-[0.4rem] tracking-[0.04em]"
		>
			<div
				className="pointer-events-none my-auto flex w-full flex-col gap-2 px-2"
				aria-hidden="true"
			>
				{PERFORMANCE_ENVELOPE_KINDS.map((envKind) => {
					const entry = line.envelopes.envs[envKind];
					return (
						<EnvelopeCanvas
							key={envKind}
							envelope={entry.env}
							color={entry.envColor}
							large={false}
							className="h-8 bg-black/35"
						/>
					);
				})}
			</div>
		</CollapsedSectionSummary>
	);
});
