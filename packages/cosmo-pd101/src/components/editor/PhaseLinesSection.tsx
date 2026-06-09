import { useEffect } from "react";
import Card, { joinClasses } from "@/components/primitives/Card";
import CzTabButton from "@/components/primitives/CzTabButton";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type { PhaseLinePanelTab } from "@/features/synth/synthUiStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { ActivePhaseLinePanel } from "./ActivePhaseLinePanel";

export type PhaseLinesSectionProps = {
	onActiveTabChange?: (v: "line1" | "line2") => void;
	className?: string;
};

export default function PhaseLinesSection({
	onActiveTabChange,
	className,
}: PhaseLinesSectionProps) {
	const activeTab = useSynthUiStore((s) => s.phaseLinePanelTab);
	const setActiveTab = useSynthUiStore((s) => s.setPhaseLinePanelTab);
	const { value: lineSelect } = useSynthParam("lineSelect");

	const activeLine: "line1" | "line2" = activeTab.startsWith("line1")
		? "line1"
		: "line2";
	const activeSection: "algos" | "envelopes" = activeTab.endsWith("algos")
		? "algos"
		: "envelopes";
	const activeLineIndex = activeLine === "line1" ? 1 : 2;
	const activeLineLabel = activeLine === "line1" ? "Line 1" : "Line 2";

	const isLineAudible = (line: "line1" | "line2"): boolean => {
		if (lineSelect === "L1+L2'") return true;
		if (lineSelect === "L1" || lineSelect === "L1+L1'") return line === "line1";
		if (lineSelect === "L2") return line === "line2";
		return true;
	};
	const activeLineIsAudible = isLineAudible(activeLine);
	const inaudibleLineSelectLabel = lineSelect as string;

	useEffect(() => {
		onActiveTabChange?.(activeLine);
	}, [activeLine, onActiveTabChange]);

	const panelClassName = joinClasses("h-full min-h-0 flex flex-col", className);
	const leftTabGroups: Array<{
		label: "L1" | "L2";
		color: "red" | "blue";
		tabs: Array<{
			id: PhaseLinePanelTab;
			bottomLabel: string;
		}>;
	}> = [
		{
			label: "L1",
			color: "blue",
			tabs: [
				{ id: "line1-algos", bottomLabel: "WAVE FORM" },
				{ id: "line1-envelopes", bottomLabel: "ENV" },
			],
		},
		{
			label: "L2",
			color: "red",
			tabs: [
				{ id: "line2-algos", bottomLabel: "WAVE FORM" },
				{ id: "line2-envelopes", bottomLabel: "ENV" },
			],
		},
	];

	return (
		<Card variant="panel-slanted" padding="none" className={panelClassName}>
			<div className="cz-collapse-header cz-section-slanted-title shrink-0 justify-center py-0">
				Phase Lines
			</div>
			<div className="flex min-h-0 min-w-0 flex-1 overflow-hidden bg-cz-panel p-2">
				<div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-2">
					<div className="flex w-16 shrink-0 flex-col justify-evenly gap-5 self-stretch">
						{leftTabGroups.map((group) => {
							return (
								<div
									key={group.label}
									className="flex h-full flex-col justify-center gap-4 rounded-lg bg-cz-inset/80 p-1.5 py-3 pb-10"
								>
									<div className="text-center font-bold text-[0.6rem] text-cz-cream tracking-[0.12em]">
										{group.label}
									</div>
									{group.tabs.map((tab) => (
										<CzTabButton
											key={tab.id}
											active={activeTab === tab.id}
											onClick={() => setActiveTab(tab.id)}
											topLabel=""
											bottomLabel={tab.bottomLabel}
											color={group.color}
											showLed
										/>
									))}
								</div>
							);
						})}
					</div>

					<div className="relative min-h-0 min-w-0 flex-1">
						{!activeLineIsAudible && (
							<div className="absolute inset-0 z-30 flex items-center justify-center rounded bg-black/70 backdrop-blur-[5px]">
								<div className="px-3 text-center font-semibold text-cz-cream/80 text-xs tracking-wide">
									{activeLineLabel} is currently inactive in{" "}
									{inaudibleLineSelectLabel} mode
								</div>
							</div>
						)}
						<ActivePhaseLinePanel
							key={activeLineLabel}
							lineIndex={activeLineIndex}
							section={activeSection}
						/>
					</div>
				</div>
			</div>
		</Card>
	);
}
