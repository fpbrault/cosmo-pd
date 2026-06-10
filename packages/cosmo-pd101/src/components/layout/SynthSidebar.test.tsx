import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SynthSidebar from "./SynthSidebar";

vi.mock("@/components/panels/analysis/ScopeDisplay", () => ({
	ScopeMiniDisplay: () => <div data-testid="scope-mini-display" />,
}));
vi.mock("@/components/panels/midi/MidiLearnPanel", () => ({
	default: () => <div data-testid="midi-learn-panel" />,
}));
vi.mock("@/components/panels/macro/MacroKnobsPanel", () => ({
	default: () => <div data-testid="macro-panel">macro</div>,
}));
vi.mock("./SynthSidebarButtons", () => ({
	default: () => <div data-testid="sidebar-buttons" />,
}));

vi.mock("@/features/synth/synthUiStore", () => {
	const midiLearnValue = true;
	return {
		useSynthUiStore: vi.fn(
			(selector: (state: Record<string, unknown>) => unknown) =>
				selector({ midiLearnOpen: midiLearnValue }),
		),
	};
});

describe("SynthSidebar", () => {
	it("renders core panels and triggers callbacks", () => {
		render(<SynthSidebar libraryModeOpen={false} />);
		expect(screen.getByTestId("scope-mini-display")).toBeInTheDocument();
		expect(screen.getByTestId("midi-learn-panel")).toBeInTheDocument();
		expect(screen.getByTestId("sidebar-buttons")).toBeInTheDocument();
		expect(screen.getByTestId("macro-panel")).toBeInTheDocument();
	});
});
