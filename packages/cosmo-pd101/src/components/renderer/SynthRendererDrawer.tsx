import { motion } from "motion/react";
import { memo, type RefObject } from "react";
import { ScopeDrawerDisplay } from "@/components/panels/analysis/ScopeDisplay";
import FxConsoleDrawer from "@/components/panels/drawers/FxConsoleDrawer";
import ModConsoleDrawer from "@/components/panels/drawers/ModConsoleDrawer";
import type { DrawerPanel } from "./drawerHelpers";
import {
	DRAWER_PANELS,
	DRAWER_SLIDE_TRANSITION,
	getDrawerOffset,
} from "./drawerHelpers";

type SynthRendererDrawerProps = {
	drawerOpen: boolean;
	activeDrawerPanel: DrawerPanel;
	drawerSlideDirection: 1 | -1;
	analyserNodeRef: RefObject<AnalyserNode | null>;
	audioCtxRef: RefObject<AudioContext | null>;
	effectivePitchHz: number;
	subscribeScopeFrames?: (
		onFrame: (frame: {
			samples: Float32Array;
			sampleRate: number;
			hz: number;
		}) => void,
	) => () => void;
};

function renderDrawerPanel(
	panel: DrawerPanel,
	props: Omit<
		SynthRendererDrawerProps,
		"activeDrawerPanel" | "drawerOpen" | "drawerSlideDirection"
	>,
) {
	if (panel === "fx") {
		return <FxConsoleDrawer />;
	}
	if (panel === "mod") {
		return <ModConsoleDrawer />;
	}

	return (
		<ScopeDrawerDisplay
			analyserNodeRef={props.analyserNodeRef}
			audioCtxRef={props.audioCtxRef}
			effectivePitchHz={props.effectivePitchHz}
			subscribeScopeFrames={props.subscribeScopeFrames}
		/>
	);
}

export default memo(function SynthRendererDrawer({
	drawerOpen,
	activeDrawerPanel,
	drawerSlideDirection,
	analyserNodeRef,
	audioCtxRef,
	effectivePitchHz,
	subscribeScopeFrames,
}: SynthRendererDrawerProps) {
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
			<div className="relative flex h-full max-h-130 min-h-0 flex-col rounded-lg border border-cz-border bg-cz-body">
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
								{drawerOpen && isActivePanel
									? renderDrawerPanel(panel, {
											analyserNodeRef,
											audioCtxRef,
											effectivePitchHz,
											subscribeScopeFrames,
										})
									: null}
							</motion.div>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
});
