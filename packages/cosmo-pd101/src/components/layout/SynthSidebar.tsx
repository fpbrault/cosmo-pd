import { AnimatePresence, motion } from "motion/react";
import { memo } from "react";
import { ScopeMiniDisplay } from "@/components/panels/analysis/ScopeDisplay";

import MidiLearnPanel from "@/components/panels/midi/MidiLearnPanel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import SynthSidebarButtons from "./SynthSidebarButtons";

const MIDI_LEARN_PANEL_TRANSITION = {
	type: "spring",
	stiffness: 260,
	damping: 28,
	mass: 0.95,
} as const;

export default memo(function SynthSidebar() {
	const midiLearnOpen = useSynthUiStore((s) => s.midiLearnOpen);
	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const waveDrawerOpen = mainPanelMode === "display";

	return (
		<aside className="flex h-full min-h-0 flex-col overflow-hidden">
			<div className="min-w-full">
				<div className="relative h-60 overflow-hidden">
					<div className="absolute inset-0 p-3">
						<ScopeMiniDisplay expanded={waveDrawerOpen} />
					</div>
				</div>
			</div>
			<SynthSidebarButtons />
			<AnimatePresence initial={false}>
				{midiLearnOpen ? (
					<motion.div
						key="midi-learn-panel"
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={MIDI_LEARN_PANEL_TRANSITION}
						className="flex min-h-0 flex-1 flex-col overflow-hidden"
					>
						<MidiLearnPanel />
					</motion.div>
				) : null}
			</AnimatePresence>
		</aside>
	);
});
