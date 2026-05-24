import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SynthSidebar from "./SynthSidebar";

vi.mock("@/components/panels/analysis/ScopeDisplay", () => ({
	ScopeMiniDisplay: () => <div data-testid="scope-mini-display" />,
}));
vi.mock("@/components/panels/midi/MidiLearnPanel", () => ({
	default: () => <div data-testid="midi-learn-panel" />,
}));
vi.mock("@/components/panels/macro/MacroKnobsPanel", () => ({
	default: ({ onOpenLabelEditor }: { onOpenLabelEditor: () => void }) => (
		<button type="button" data-testid="macro-panel" onClick={onOpenLabelEditor}>
			macro
		</button>
	),
}));
vi.mock("./SynthSidebarButtons", () => ({
	default: ({
		onOpenGlobal,
		onOpenMidiLearn,
	}: {
		onOpenGlobal: () => void;
		onOpenMidiLearn: () => void;
	}) => (
		<div>
			<button type="button" data-testid="open-global" onClick={onOpenGlobal}>
				global
			</button>
			<button type="button" data-testid="open-midi" onClick={onOpenMidiLearn}>
				midi
			</button>
		</div>
	),
}));

describe("SynthSidebar", () => {
	it("renders core panels and triggers callbacks", () => {
		const onOpenGlobal = vi.fn();
		const onOpenMidiLearn = vi.fn();
		const onOpenMacroLabels = vi.fn();
		render(
			<SynthSidebar
				effectivePitchHz={440}
				analyserNodeRef={{ current: null }}
				audioCtxRef={{ current: null }}
				waveDrawerOpen={false}
				libraryModeOpen={false}
				globalOpen={false}
				onOpenGlobal={onOpenGlobal}
				midiLearnOpen={true}
				onOpenMidiLearn={onOpenMidiLearn}
				onOpenMacroLabels={onOpenMacroLabels}
			/>,
		);
		expect(screen.getByTestId("scope-mini-display")).toBeInTheDocument();
		expect(screen.getByTestId("midi-learn-panel")).toBeInTheDocument();
		fireEvent.click(screen.getByTestId("open-global"));
		fireEvent.click(screen.getByTestId("open-midi"));
		fireEvent.click(screen.getByTestId("macro-panel"));
		expect(onOpenGlobal).toHaveBeenCalled();
		expect(onOpenMidiLearn).toHaveBeenCalled();
		expect(onOpenMacroLabels).toHaveBeenCalled();
	});
});
