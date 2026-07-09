import { memo } from "react";
import PhaseLinesSection from "@/components/editor/PhaseLinesSection";
import type { MainPanelMode } from "@/features/synth/synthUiStore";
import SynthRendererDrawer from "./SynthRendererDrawer";
import SynthRendererTopBar from "./SynthRendererTopBar";

type SynthRendererMainPanelProps = {
	mainPanelMode: MainPanelMode;
	setMainPanelMode: (mode: MainPanelMode) => void;
};

export default memo(function SynthRendererMainPanel({
	mainPanelMode,
	setMainPanelMode,
}: SynthRendererMainPanelProps) {
	return (
		<main
			data-auv3-passive-surface
			className="@container/phase flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl [container-type:size]"
		>
			<SynthRendererTopBar
				mainPanelMode={mainPanelMode}
				setMainPanelMode={setMainPanelMode}
			/>
			<div
				data-auv3-passive-surface
				className="relative min-h-0 min-w-0 flex-1 overflow-hidden"
			>
				<PhaseLinesSection className="main-panel-fill absolute inset-0" />
				<SynthRendererDrawer />
			</div>
		</main>
	);
});
