import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import Card from "@/components/primitives/Card";
import type { EnvTab } from "@/features/synth/synthUiStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import {
	StepEnvelopeEditor,
	StepEnvelopePreview,
	type StepEnvelopeVoiceMarker,
} from "./StepEnvelopeEditor";

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
}

export function EnvelopesSection({
	envMap,
	voiceMarkers,
	lineIndex,
}: EnvelopesSectionProps) {
	const activeEnvTab = useSynthUiStore((s) => s.activeEnvTab);
	const setActiveEnvTab = useSynthUiStore((s) => s.setActiveEnvTab);
	const activeEnv = envMap[activeEnvTab];

	return (
		<Card
			variant="subtle"
			className="p-2 min-w-0 h-full flex-1 min-h-0"
			padding="none"
		>
			<div className="mb-3 grid grid-cols-3 gap-2 w-full">
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
			<StepEnvelopeEditor
				title={activeEnv.title}
				env={activeEnv.env}
				onChange={activeEnv.setEnv}
				color={activeEnv.envColor}
				lineIndex={lineIndex}
				envKind={activeEnvTab}
				voiceMarkers={voiceMarkers}
				compact
			/>
		</Card>
	);
}
