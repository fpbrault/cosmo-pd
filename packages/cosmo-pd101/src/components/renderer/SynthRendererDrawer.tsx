import { motion } from "motion/react";
import { memo } from "react";
import { ScopeDrawerDisplay } from "@/components/panels/analysis/ScopeDisplay";
import FxConsoleDrawer from "@/components/panels/drawers/FxConsoleDrawer";
import ModConsoleDrawer from "@/components/panels/drawers/ModConsoleDrawer";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { DrawerPanel } from "./drawerHelpers";
import {
	DRAWER_PANELS,
	DRAWER_SLIDE_TRANSITION,
	getDrawerOffset,
} from "./drawerHelpers";
import { useDrawerPanelState } from "./useDrawerPanelState";

const DRAWER_CONTENT: Record<DrawerPanel, React.ReactNode> = {
	fx: <FxConsoleDrawer />,
	mod: <ModConsoleDrawer />,
	display: <ScopeDrawerDisplay />,
};

export default memo(function SynthRendererDrawer() {
	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const { drawerOpen, activeDrawerPanel, drawerSlideDirection } =
		useDrawerPanelState(mainPanelMode);
	return (
		<motion.div
			aria-hidden={!drawerOpen}
			initial={false}
			animate={{ y: drawerOpen ? 0 : "-100%" }}
			transition={DRAWER_SLIDE_TRANSITION}
			style={{ transformOrigin: "top center" }}
			className={`absolute inset-0 isolate z-40 origin-top overflow-hidden will-change-transform ${
				drawerOpen ? "pointer-events-auto" : "pointer-events-none"
			}`}
		>
			<div className="relative flex h-full min-h-0 flex-col rounded-lg border border-cz-border bg-cz-body">
				<div className="pointer-events-none absolute inset-0 rounded-lg bg-white/5" />
				<div className="pointer-events-none absolute inset-x-0 top-0 h-14 rounded-t-lg opacity-60" />
				<div className="relative min-h-0 flex-1 overflow-hidden">
					{DRAWER_PANELS.map((panel) => {
						const isActivePanel = activeDrawerPanel === panel;
						return (
							<motion.div
								key={panel}
								aria-hidden={!isActivePanel}
								initial={false}
								animate={{
									y: getDrawerOffset(
										panel,
										activeDrawerPanel,
										drawerSlideDirection,
									),
								}}
								transition={DRAWER_SLIDE_TRANSITION}
								className={`absolute inset-0 will-change-transform ${
									isActivePanel ? "pointer-events-auto" : "pointer-events-none"
								}`}
							>
								{drawerOpen && isActivePanel ? DRAWER_CONTENT[panel] : null}
							</motion.div>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
});
