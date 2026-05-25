import { AnimatePresence, motion } from "motion/react";
import { memo, type RefObject } from "react";
import { ScopeMiniDisplay } from "@/components/panels/analysis/ScopeDisplay";
import MacroKnobsPanel from "@/components/panels/macro/MacroKnobsPanel";
import MidiLearnPanel from "@/components/panels/midi/MidiLearnPanel";
import { joinClasses } from "@/components/primitives/Card";
import SynthSidebarButtons from "./SynthSidebarButtons";

const MIDI_LEARN_PANEL_TRANSITION = {
	type: "spring",
	stiffness: 260,
	damping: 28,
	mass: 0.95,
} as const;

type SynthSidebarProps = {
	effectivePitchHz: number;
	analyserNodeRef: RefObject<AnalyserNode | null>;
	audioCtxRef: RefObject<AudioContext | null>;
	sidebarMinWidthRem?: number;
	fillAvailableHeight?: boolean;
	subscribeScopeFrames?: (
		onFrame: (frame: {
			samples: Float32Array;
			sampleRate: number;
			hz: number;
		}) => void,
	) => () => void;
	waveDrawerOpen: boolean;
	libraryModeOpen: boolean;
	globalOpen: boolean;
	onOpenGlobal: () => void;
	midiLearnOpen: boolean;
	onOpenMidiLearn: () => void;
	onOpenMacroLabels: () => void;
};

export default memo(function SynthSidebar({
	effectivePitchHz,
	analyserNodeRef,
	audioCtxRef,
	sidebarMinWidthRem = 18,
	fillAvailableHeight = true,
	subscribeScopeFrames,
	waveDrawerOpen,
	libraryModeOpen,
	globalOpen,
	onOpenGlobal,
	midiLearnOpen,
	onOpenMidiLearn,
	onOpenMacroLabels,
}: SynthSidebarProps) {
	const containerClassName = joinClasses(
		"flex min-h-0 flex-col overflow-hidden rounded-[1.15rem] border border-cz-border/80 bg-cz-inset px-0 pb-2 shadow-lg",
		fillAvailableHeight ? "self-stretch" : "self-start",
	);
	const macroPanelClassName = joinClasses(
		"mt-2 min-h-0 px-2 pb-1",
		fillAvailableHeight ? "flex-1" : "flex-none",
	);

	return (
		<aside
			className={containerClassName}
			style={{ minWidth: `${sidebarMinWidthRem}rem` }}
		>
			<div className="min-w-full">
				<div className="relative h-60 overflow-hidden">
					<div className="absolute inset-0 p-3">
						<ScopeMiniDisplay
							analyserNodeRef={analyserNodeRef}
							audioCtxRef={audioCtxRef}
							effectivePitchHz={effectivePitchHz}
							subscribeScopeFrames={subscribeScopeFrames}
							expanded={waveDrawerOpen}
						/>
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
			<SynthSidebarButtons
				globalOpen={globalOpen}
				onOpenGlobal={onOpenGlobal}
				midiLearnOpen={midiLearnOpen}
				onOpenMidiLearn={onOpenMidiLearn}
			/>
			{!libraryModeOpen ? (
				<div className={macroPanelClassName}>
					<MacroKnobsPanel onOpenLabelEditor={onOpenMacroLabels} />
				</div>
			) : (
				<div className="min-h-0 flex-1" />
			)}
		</aside>
	);
});
