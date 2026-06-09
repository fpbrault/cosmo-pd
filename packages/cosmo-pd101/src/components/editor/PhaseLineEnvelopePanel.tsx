import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import Card from "@/components/primitives/Card";
import type { EnvTab } from "@/features/synth/synthUiStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { EnvelopeKeyFollowControl } from "./EnvelopeKeyFollowControl";
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
			className="h-fit min-h-0 min-w-0 flex-1 px-2 pt-3"
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
			<div className="mb-2 flex justify-end">
				<EnvelopeKeyFollowControl
					envKind={activeEnvTab}
					lineIndex={lineIndex}
					envelopes={envelopes}
				/>
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
			/>
		</Card>
	);
}
