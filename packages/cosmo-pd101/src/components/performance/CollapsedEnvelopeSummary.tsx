import { memo } from "react";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { EnvelopeCanvas } from "./CompactEnvelopePreset";
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
		<button
			type="button"
			onClick={onExpand}
			aria-label="Expand Envelope section"
			className="group flex h-full w-full min-w-0 flex-col items-center border-cz-border border-l bg-cz-surface/80 p-0 text-cz-cream transition-colors hover:bg-cz-inset focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
			data-testid="simple-envelope-summary"
		>
			<span className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center px-0 py-0 text-[0.4rem] tracking-[0.04em] transition-[filter] group-hover:brightness-125">
				Envelope +
			</span>
			<div
				className="my-auto flex w-full flex-col gap-2 px-2"
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
		</button>
	);
});
