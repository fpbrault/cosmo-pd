import { AnimatePresence, motion } from "motion/react";
import { memo } from "react";
import { ScopeMiniDisplay } from "@/components/panels/analysis/ScopeDisplay";
import MacroKnobsPanel from "@/components/panels/macro/MacroKnobsPanel";
import MidiLearnPanel from "@/components/panels/midi/MidiLearnPanel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import SynthSidebarButtons from "./SynthSidebarButtons";

const MIDI_LEARN_PANEL_TRANSITION = {
	type: "spring",
	stiffness: 260,
	damping: 28,
	mass: 0.95,
} as const;

type SynthSidebarProps = {
	libraryModeOpen: boolean;
};

export default memo(function SynthSidebar({
	libraryModeOpen,
}: SynthSidebarProps) {
	const midiLearnOpen = useSynthUiStore((s) => s.midiLearnOpen);
	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const waveDrawerOpen = mainPanelMode === "display";

	return (
		<aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.15rem] border border-cz-border/80 bg-cz-inset px-0 pb-2 shadow-lg">
			<div className="min-w-full">
				<div className="relative h-60 overflow-hidden">
					<div className="absolute inset-0 p-3">
						<ScopeMiniDisplay expanded={waveDrawerOpen} />
					</div>
					<AnimatePresence initial={false}>
						{midiLearnOpen ? (
							<motion.div
								key="midi-learn-overlay"
								initial={{ y: "-108%" }}
								animate={{ y: 0 }}
								exit={{ y: "-108%" }}
								transition={MIDI_LEARN_PANEL_TRANSITION}
								className="absolute inset-0 z-10 h-full border-cz-light-blue/20 bg-cz-panel/96 shadow-xl backdrop-blur-sm"
							>
								<div className="h-full">
									<MidiLearnPanel />
								</div>
							</motion.div>
						) : null}
					</AnimatePresence>
				</div>
			</div>
			<SynthSidebarButtons />
			{!libraryModeOpen ? (
				<div className="mt-2 min-h-0 flex-1 px-2 pb-1">
					<MacroKnobsPanel />
				</div>
			) : (
				<div className="min-h-0 flex-1" />
			)}
		</aside>
	);
});
