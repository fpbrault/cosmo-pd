import { useEffect, useRef } from "react";
import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import Card from "@/components/primitives/Card";
import type { EnvTab } from "@/features/synth/synthUiStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { EnvelopeKeyFollowControl } from "./EnvelopeKeyFollowControl";
import { EnvelopePresetControls } from "./EnvelopePresetControls";
import type { PhaseLineEnvelopeModel } from "./phaseLineTypes";
import StepEnvelopeEditor from "./StepEnvelopeEditor";
import { StepEnvelopePreview } from "./StepEnvelopePreview";
import { usePhaseLineEnvelopeMarkers } from "./usePhaseLineEnvelopeMarkers";

type PhaseLineEnvelopePanelProps = {
	envelopes: PhaseLineEnvelopeModel;
	lineIndex: LineIndex;
	lineColor: string;
};

const ENV_TABS: EnvTab[] = ["dco", "dcw", "dca"];

export function PhaseLineEnvelopePanel({
	envelopes,
	lineIndex,
	lineColor,
}: PhaseLineEnvelopePanelProps) {
	const renderPerformanceRef = useRef({ count: 0, startedAt: 0 });
	useEffect(() => {
		if (!import.meta.env.DEV) {
			return;
		}
		const now = performance.now();
		if (renderPerformanceRef.current.startedAt === 0) {
			renderPerformanceRef.current.startedAt = now;
		}
		renderPerformanceRef.current.count++;
		const elapsedMs = now - renderPerformanceRef.current.startedAt;
		if (elapsedMs >= 5000) {
			console.debug("[scope-perf] PhaseLineEnvelopePanel renders", {
				rendersPerSecond:
					(renderPerformanceRef.current.count * 1000) / elapsedMs,
			});
			renderPerformanceRef.current = { count: 0, startedAt: now };
		}
	});
	const activeEnvTab = useSynthUiStore((s) => s.activeEnvTab);
	const setActiveEnvTab = useSynthUiStore((s) => s.setActiveEnvTab);
	const activeEnv = envelopes.envs[activeEnvTab];
	const voiceMarkers = usePhaseLineEnvelopeMarkers({
		lineIndex,
		section: "envelopes",
		activeEnvTab,
		activeEnv,
	});

	return (
		<Card
			variant="ghost"
			className="flex h-full min-h-0 min-w-0 flex-1 flex-col px-2 pt-3"
			padding="none"
		>
			<div className="mb-3 grid w-full grid-cols-3 gap-2">
				{ENV_TABS.map((tab) => (
					<StepEnvelopePreview
						key={tab}
						title={tab.toUpperCase()}
						env={envelopes.envs[tab].env}
						color={envelopes.envs[tab].envColor}
						active={activeEnvTab === tab}
						onClick={() => setActiveEnvTab(tab)}
					/>
				))}
			</div>
			<StepEnvelopeEditor
				title={activeEnv.title}
				env={activeEnv.env}
				onChange={activeEnv.setEnv}
				color={activeEnv.envColor}
				levelKnobColor={lineColor}
				lineIndex={lineIndex}
				envKind={activeEnvTab}
				voiceMarkers={voiceMarkers}
				headerActions={
					<EnvelopePresetControls
						envKind={activeEnvTab}
						lineIndex={lineIndex}
						envelopes={envelopes}
					/>
				}
				headerRightActions={
					<EnvelopeKeyFollowControl
						envKind={activeEnvTab}
						lineIndex={lineIndex}
						envelopes={envelopes}
					/>
				}
			/>
		</Card>
	);
}
