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
			className="mx-auto flex min-h-0 flex-none flex-col overflow-hidden rounded-md"
			style={{
				aspectRatio: "4/3",
				maxWidth: "100%",
				width: "auto",
			}}
		>
			<SynthRendererTopBar
				mainPanelMode={mainPanelMode}
				setMainPanelMode={setMainPanelMode}
			/>
			<div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
				<PhaseLinesSection className="main-panel-fill min-h-0" />
				<SynthRendererDrawer />
			</div>
		</main>
	);
});
