import { memo } from "react";
import LineSelectControl from "@/components/controls/LineSelectControl";
import MasterVolumeControl from "@/components/controls/MasterVolumeControl";
import ModModeControl from "@/components/controls/ModModeControl";
import VoiceModeControl from "@/components/controls/VoiceModeControl";
import CzTabButton from "@/components/primitives/CzTabButton";
import type { MainPanelMode } from "@/features/synth/synthUiStore";

type SynthRendererTopBarProps = {
	mainPanelMode: MainPanelMode;
	setMainPanelMode: (mode: MainPanelMode) => void;
};

function getNextDrawerMode(
	currentMode: MainPanelMode,
	targetMode: Exclude<MainPanelMode, "phase">,
): MainPanelMode {
	return currentMode === targetMode ? "phase" : targetMode;
}

export default memo(function SynthRendererTopBar({
	mainPanelMode,
	setMainPanelMode,
}: SynthRendererTopBarProps) {
	return (
		<div className="relative flex shrink-0 overflow-hidden rounded-md border border-cz-border bg-cz-body px-3 shadow-inner">
			<div className="flex shrink-0 items-end">
				<MasterVolumeControl />
				<div className="divider divider-horizontal py-2"></div>
				<div className="flex items-center gap-2 self-center">
					<CzTabButton
						active={mainPanelMode === "phase"}
						onClick={() => {
							setMainPanelMode("phase");
						}}
						topLabel="Main"
						bottomLabel=""
						color="red"
						width={48}
						tooltip="Show phase editor controls."
					/>
					<CzTabButton
						active={mainPanelMode === "fx"}
						onClick={() => {
							setMainPanelMode(getNextDrawerMode(mainPanelMode, "fx"));
						}}
						topLabel="FX"
						bottomLabel=""
						width={48}
						color="blue"
						tooltip="Toggle FX console drawer."
					/>
					<CzTabButton
						active={mainPanelMode === "mod"}
						onClick={() => {
							setMainPanelMode(getNextDrawerMode(mainPanelMode, "mod"));
						}}
						topLabel="MOD"
						bottomLabel=""
						width={48}
						color="cyan"
						tooltip="Toggle modulation console drawer."
					/>
					<CzTabButton
						active={mainPanelMode === "display"}
						onClick={() => {
							setMainPanelMode(getNextDrawerMode(mainPanelMode, "display"));
						}}
						topLabel="DISPLAY"
						bottomLabel=""
						width={48}
						color="grey"
						tooltip="Toggle full-size scope drawer."
					/>
				</div>
			</div>

			<div className="ml-auto flex shrink-0 items-end gap-1">
				<div className="divider divider-horizontal mx-0 px-0 py-2"></div>
				<VoiceModeControl />
				<div className="divider divider-horizontal mx-0 px-0 py-2"></div>
				<LineSelectControl />
				<div className="divider divider-horizontal mx-0 px-0 py-2"></div>
				<ModModeControl />
			</div>
		</div>
	);
});
