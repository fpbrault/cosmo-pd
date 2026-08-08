export const DRAWER_SLIDE_TRANSITION = {
	type: "spring",
	stiffness: 220,
	damping: 30,
	mass: 1,
} as const;

export const LIBRARY_SLIDE_TRANSITION = {
	type: "spring",
	stiffness: 520,
	damping: 60,
	mass: 1,
} as const;

export type DrawerPanel = "fx" | "mod" | "display";

export const DRAWER_PANEL_ORDER: Record<DrawerPanel, number> = {
	fx: 0,
	mod: 1,
	display: 2,
};

export const DRAWER_PANELS: DrawerPanel[] = ["fx", "mod", "display"];

export function isDrawerPanel(mode: string): mode is DrawerPanel {
	return DRAWER_PANELS.includes(mode as DrawerPanel);
}

export function getDrawerOffset(
	panel: DrawerPanel,
	activePanel: DrawerPanel,
	direction: 1 | -1,
): "0%" | "100%" | "-100%" {
	if (panel === activePanel) {
		return "0%";
	}

	const panelOrder = DRAWER_PANEL_ORDER[panel];
	const activeOrder = DRAWER_PANEL_ORDER[activePanel];
	if (panelOrder > activeOrder) {
		return direction === 1 ? "100%" : "-100%";
	}

	return direction === 1 ? "-100%" : "100%";
}
