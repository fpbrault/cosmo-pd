import { memo } from "react";
import LineSelectControl from "@/components/controls/LineSelectControl";
import MasterVolumeControl from "@/components/controls/MasterVolumeControl";
import ModModeControl from "@/components/controls/ModModeControl";
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
		<div className="relative shrink-0 rounded-md border border-cz-border bg-cz-body px-3 shadow-inner">
			<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
				<div className="flex items-center">
					<MasterVolumeControl />
					<div className="divider divider-horizontal py-2"></div>
					<div className="flex items-end gap-2">
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

				<div className="flex items-end">
					<LineSelectControl />
					<div className="divider divider-horizontal py-2"></div>
					<ModModeControl />
				</div>
			</div>
		</div>
	);
});
