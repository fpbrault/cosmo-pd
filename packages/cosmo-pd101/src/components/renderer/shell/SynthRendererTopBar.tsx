import { memo } from "react";
import { useTranslation } from "react-i18next";
import MasterVolumeControl from "@/components/controls/parameters/MasterVolumeControl";
import LineSelectControl from "@/components/controls/selectors/LineSelectControl";
import ModModeControl from "@/components/controls/selectors/ModModeControl";
import VoiceModeControl from "@/components/controls/selectors/VoiceModeControl";
import CzTabButton from "@/components/primitives/buttons/CzTabButton";
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
	const { t } = useTranslation("synth");
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
						topLabel={t("topBar.main")}
						bottomLabel=""
						color="red"
						width={48}
						tooltip={t("topBar.mainTooltip")}
					/>
					<CzTabButton
						active={mainPanelMode === "fx"}
						onClick={() => {
							setMainPanelMode(getNextDrawerMode(mainPanelMode, "fx"));
						}}
						topLabel={t("topBar.fx")}
						bottomLabel=""
						width={48}
						color="blue"
						tooltip={t("topBar.fxTooltip")}
					/>
					<CzTabButton
						active={mainPanelMode === "mod"}
						onClick={() => {
							setMainPanelMode(getNextDrawerMode(mainPanelMode, "mod"));
						}}
						topLabel={t("topBar.mod")}
						bottomLabel=""
						width={48}
						color="cyan"
						tooltip={t("topBar.modTooltip")}
					/>
					<CzTabButton
						active={mainPanelMode === "display"}
						onClick={() => {
							setMainPanelMode(getNextDrawerMode(mainPanelMode, "display"));
						}}
						topLabel={t("topBar.display")}
						bottomLabel=""
						width={48}
						color="grey"
						tooltip={t("topBar.displayTooltip")}
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
