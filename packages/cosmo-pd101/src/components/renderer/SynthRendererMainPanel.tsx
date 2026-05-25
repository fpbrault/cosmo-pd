import { memo } from "react";
import type { EnvOverrideHandlers } from "@/components/editor/PhaseLinesSection";
import PhaseLinesSection from "@/components/editor/PhaseLinesSection";
import type { MainPanelMode } from "@/features/synth/synthUiStore";
import type { DrawerPanel } from "./drawerHelpers";
import SynthRendererDrawer from "./SynthRendererDrawer";
import SynthRendererTopBar from "./SynthRendererTopBar";

type SynthRendererMainPanelProps = {
	mainPanelMode: MainPanelMode;
	setMainPanelMode: (mode: MainPanelMode) => void;
	envOverrideHandlers: EnvOverrideHandlers;
	drawerOpen: boolean;
	activeDrawerPanel: DrawerPanel;
	drawerSlideDirection: 1 | -1;
};

export default memo(function SynthRendererMainPanel({
	mainPanelMode,
	setMainPanelMode,
	envOverrideHandlers,
	drawerOpen,
	activeDrawerPanel,
	drawerSlideDirection,
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
				<PhaseLinesSection
					className="main-panel-fill min-h-0"
					envOverrideHandlers={envOverrideHandlers}
				/>
				<SynthRendererDrawer
					drawerOpen={drawerOpen}
					activeDrawerPanel={activeDrawerPanel}
					drawerSlideDirection={drawerSlideDirection}
				/>
			</div>
		</main>
	);
});
