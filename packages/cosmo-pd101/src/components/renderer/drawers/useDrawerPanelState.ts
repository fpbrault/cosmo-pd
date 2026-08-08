import { useEffect, useState } from "react";
import type { MainPanelMode } from "@/features/synth/synthUiStore";
import type { DrawerPanel } from "./drawerHelpers";
import { DRAWER_PANEL_ORDER, isDrawerPanel } from "./drawerHelpers";

type DrawerPanelState = {
	drawerOpen: boolean;
	waveDrawerOpen: boolean;
	activeDrawerPanel: DrawerPanel;
	drawerSlideDirection: 1 | -1;
};

export function useDrawerPanelState(
	mainPanelMode: MainPanelMode,
): DrawerPanelState {
	const drawerOpen = isDrawerPanel(mainPanelMode);
	const waveDrawerOpen = mainPanelMode === "display";
	const [activeDrawerPanel, setActiveDrawerPanel] = useState<DrawerPanel>(
		isDrawerPanel(mainPanelMode) ? mainPanelMode : "fx",
	);
	const [drawerSlideDirection, setDrawerSlideDirection] = useState<1 | -1>(1);

	useEffect(() => {
		if (!isDrawerPanel(mainPanelMode) || mainPanelMode === activeDrawerPanel) {
			return;
		}

		setDrawerSlideDirection(
			DRAWER_PANEL_ORDER[mainPanelMode] > DRAWER_PANEL_ORDER[activeDrawerPanel]
				? 1
				: -1,
		);
		setActiveDrawerPanel(mainPanelMode);
	}, [mainPanelMode, activeDrawerPanel]);

	return {
		drawerOpen,
		waveDrawerOpen,
		activeDrawerPanel,
		drawerSlideDirection,
	};
}
