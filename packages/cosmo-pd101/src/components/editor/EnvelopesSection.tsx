import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import Card from "@/components/primitives/Card";
import type { EnvTab } from "@/features/synth/synthUiStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { EnvelopeKeyFollowControl } from "./EnvelopeKeyFollowControl";
import type { PhaseLineEnvelopeModel } from "./phaseLineTypes";
import StepEnvelopeEditor, {
	type StepEnvelopeVoiceMarker,
} from "./StepEnvelopeEditor";
import { StepEnvelopePreview } from "./StepEnvelopePreview";

export type EnvMapEntry = {
	title: string;
	env: StepEnvData;
	setEnv: (env: StepEnvData) => void;
	envColor: string;
};

interface EnvelopesSectionProps {
	envMap: Record<EnvTab, EnvMapEntry>;
	voiceMarkers: StepEnvelopeVoiceMarker[];
	lineIndex: LineIndex;
	lineColor: string;
	dcwKeyFollow: number;
	onDcwKeyFollowChange: (value: number) => void;
	dcaKeyFollow: number;
	onDcaKeyFollowChange: (value: number) => void;
}

export function EnvelopesSection({
	envMap,
	voiceMarkers,
	lineIndex,
	lineColor,
	dcwKeyFollow,
	onDcwKeyFollowChange,
	dcaKeyFollow,
	onDcaKeyFollowChange,
}: EnvelopesSectionProps) {
	const activeEnvTab = useSynthUiStore((s) => s.activeEnvTab);
	const setActiveEnvTab = useSynthUiStore((s) => s.setActiveEnvTab);
	const activeEnv = envMap[activeEnvTab];
	const envelopes: PhaseLineEnvelopeModel = {
		envs: envMap,
		dcwKeyFollow,
		setDcwKeyFollow: onDcwKeyFollowChange,
		dcaKeyFollow,
		setDcaKeyFollow: onDcaKeyFollowChange,
	};

	return (
		<Card
			variant="ghost"
			className="flex h-full min-h-0 min-w-0 flex-1 flex-col px-2 pt-3"
			padding="none"
		>
			<div className="mb-3 grid w-full grid-cols-3 gap-2">
				{(["dco", "dcw", "dca"] as EnvTab[]).map((tab) => (
					<StepEnvelopePreview
						key={tab}
						title={tab.toUpperCase()}
						env={envMap[tab].env}
						color={envMap[tab].envColor}
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
