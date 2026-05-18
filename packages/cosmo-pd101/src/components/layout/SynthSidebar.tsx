import { memo, type RefObject } from "react";
import { ScopeMiniDisplay } from "@/components/panels/analysis/ScopeDisplay";
import MacroKnobsPanel from "@/components/panels/macro/MacroKnobsPanel";
import SynthSidebarButtons from "./SynthSidebarButtons";

type SynthSidebarProps = {
	effectivePitchHz: number;
	analyserNodeRef: RefObject<AnalyserNode | null>;
	audioCtxRef: RefObject<AudioContext | null>;
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
	onOpenMacroLabels: () => void;
};

export default memo(function SynthSidebar({
	effectivePitchHz,
	analyserNodeRef,
	audioCtxRef,
	subscribeScopeFrames,
	waveDrawerOpen,
	libraryModeOpen,
	globalOpen,
	onOpenGlobal,
	onOpenMacroLabels,
}: SynthSidebarProps) {
	return (
		<aside className="flex min-h-0 min-w-72 flex-col overflow-hidden rounded-[1.15rem] border border-cz-border/80 bg-cz-inset px-0 pb-2 shadow-lg">
			<div className="mx-auto mt-4 px-4">
				<ScopeMiniDisplay
					analyserNodeRef={analyserNodeRef}
					audioCtxRef={audioCtxRef}
					effectivePitchHz={effectivePitchHz}
					subscribeScopeFrames={subscribeScopeFrames}
					expanded={waveDrawerOpen}
				/>
			</div>
			<SynthSidebarButtons
				globalOpen={globalOpen}
				onOpenGlobal={onOpenGlobal}
			/>
			{!libraryModeOpen ? (
				<div className="mt-2 min-h-0 flex-1 px-2 pb-1">
					<MacroKnobsPanel onOpenLabelEditor={onOpenMacroLabels} />
				</div>
			) : (
				<div className="min-h-0 flex-1" />
			)}
		</aside>
	);
});
