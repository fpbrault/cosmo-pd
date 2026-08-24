import { memo } from "react";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import CompactEnvelopePreset from "./CompactEnvelopePreset";
import CompactLineEditToggle from "./CompactLineEditToggle";

const ENVELOPE_KINDS = ["dco", "dcw", "dca"] as const;

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
				{ENVELOPE_KINDS.map((envKind) => {
					const entry = line.envelopes.envs[envKind];
					return (
						<CompactEnvelopePreset
							key={envKind}
							envKind={envKind}
							envelope={entry.env}
							color={entry.envColor}
							onApply={entry.setEnv}
							large
						/>
					);
				})}
			</div>
		</div>
	);
});

export const CollapsedEnvelopeSummary = memo(function CollapsedEnvelopeSummary({
	onExpand,
}: {
	onExpand: () => void;
}) {
	const line = useSynthUiStore((state) => state.simpleEditedLine);

	return (
		<button
			type="button"
			onClick={onExpand}
			aria-label="Expand Envelope section"
			className="group flex h-full w-[7rem] shrink-0 flex-col items-center border-cz-border border-l bg-cz-surface/80 p-0 text-cz-cream transition-colors hover:bg-cz-inset focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
			data-testid="simple-envelope-summary"
		>
			<span className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center px-0 py-0 text-[0.4rem] tracking-[0.04em] transition-[filter] group-hover:brightness-125">
				Envelope +
			</span>
			<span
				className={`my-auto font-mono text-[0.55rem] uppercase ${line === 1 ? "text-[#7f9de4]" : "text-[#c45c5c]"}`}
			>
				Line {line}
			</span>
			<div className="mb-2 flex gap-1" aria-hidden="true">
				<span className="size-2.5 rounded-sm bg-[#9cb937]" />
				<span className="size-2.5 rounded-sm bg-[#60a5fa]" />
				<span className="size-2.5 rounded-sm bg-[#f97316]" />
			</div>
		</button>
	);
});
