import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import Card from "@/components/primitives/Card";
import { isAdsrEnv, isStepEnv } from "@/features/synth/synthStore";
import type { EnvTab } from "@/features/synth/synthUiStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { EnvType } from "@/lib/synth/bindings/synth";
import { AdsrEnvelopeEditor } from "./AdsrEnvelopeEditor";
import { AdsrEnvelopePreview } from "./AdsrEnvelopePreview";
import type { AdsrVoiceMarker } from "./adsrEnvelopeGeometry";
import {
	StepEnvelopeEditor,
	StepEnvelopePreview,
	type StepEnvelopeVoiceMarker,
} from "./StepEnvelopeEditor";

export type EnvMapEntry = {
	title: string;
	env: EnvType;
	setEnv: (env: EnvType) => void;
	envColor: string;
	onToggleType: () => void;
};

interface EnvelopesSectionProps {
	envMap: Record<EnvTab, EnvMapEntry>;
	voiceMarkers: StepEnvelopeVoiceMarker[];
	adsrVoiceMarkers: AdsrVoiceMarker[];
	lineIndex: LineIndex;
	lineColor: string;
}

function EnvPreviewTab({
	entry,
	tab,
	active,
	onClick,
}: {
	entry: EnvMapEntry;
	tab: EnvTab;
	active: boolean;
	onClick: () => void;
}) {
	if (isStepEnv(entry.env)) {
		return (
			<StepEnvelopePreview
				title={tab.toUpperCase()}
				env={entry.env}
				color={entry.envColor}
				active={active}
				onClick={onClick}
			/>
		);
	}
	return (
		<AdsrEnvelopePreview
			title={tab.toUpperCase()}
			env={entry.env}
			color={entry.envColor}
			active={active}
			onClick={onClick}
		/>
	);
}

export function EnvelopesSection({
	envMap,
	voiceMarkers,
	adsrVoiceMarkers,
	lineIndex,
	lineColor,
}: EnvelopesSectionProps) {
	const activeEnvTab = useSynthUiStore((s) => s.activeEnvTab);
	const setActiveEnvTab = useSynthUiStore((s) => s.setActiveEnvTab);
	const activeEnv = envMap[activeEnvTab];

	return (
		<Card
			variant="subtle"
			className="h-fit min-h-0 min-w-0 flex-1 p-2"
			padding="none"
		>
			<div className="mb-3 grid w-full grid-cols-3 gap-2">
				{(["dco", "dcw", "dca"] as EnvTab[]).map((tab) => (
					<EnvPreviewTab
						key={tab}
						entry={envMap[tab]}
						tab={tab}
						active={activeEnvTab === tab}
						onClick={() => setActiveEnvTab(tab)}
					/>
				))}
			</div>
			<div className="mb-2 flex items-center justify-between">
				<span className="font-semibold text-sm">{activeEnv.title}</span>
				<button
					type="button"
					className={`btn btn-ghost btn-xs ${isStepEnv(activeEnv.env) ? "text-cz-gold" : "text-cz-synth-blue"}`}
					onClick={activeEnv.onToggleType}
				>
					{isStepEnv(activeEnv.env) ? "ADSR" : "STEP"}
				</button>
			</div>
			{isStepEnv(activeEnv.env) ? (
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
			) : isAdsrEnv(activeEnv.env) ? (
				<AdsrEnvelopeEditor
					title={activeEnv.title}
					env={activeEnv.env}
					onChange={activeEnv.setEnv}
					color={activeEnv.envColor}
					levelKnobColor={lineColor}
					voiceMarkers={adsrVoiceMarkers}
				/>
			) : null}
		</Card>
	);
}
