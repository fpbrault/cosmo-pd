import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SynthSidebar from "./SynthSidebar";

vi.mock("@/components/panels/analysis/ScopeDisplay", () => ({
	ScopeMiniDisplay: () => <div data-testid="scope-mini-display" />,
}));
vi.mock("@/components/panels/midi/MidiLearnPanel", () => ({
	default: () => <div data-testid="midi-learn-panel" />,
}));
vi.mock("@/components/panels/voice/PresetVoiceSettingsPanel", () => ({
	default: () => <div data-testid="preset-voice-settings-panel" />,
}));
vi.mock("./SynthSidebarButtons", () => ({
	default: () => <div data-testid="sidebar-buttons" />,
}));

let mockedMidiLearnOpen = false;

vi.mock("@/features/synth/synthUiStore", () => {
	return {
		useSynthUiStore: vi.fn(
			(selector: (state: Record<string, unknown>) => unknown) =>
				selector({
					midiLearnOpen: mockedMidiLearnOpen,
					mainPanelMode: "phase",
				}),
		),
	};
});

describe("SynthSidebar", () => {
	it("renders voice settings in the shared side panel slot by default", () => {
		mockedMidiLearnOpen = false;
		render(<SynthSidebar />);
		expect(screen.getByTestId("scope-mini-display")).toBeInTheDocument();
		expect(screen.getByTestId("sidebar-buttons")).toBeInTheDocument();
		expect(
			screen.getByTestId("preset-voice-settings-panel"),
		).toBeInTheDocument();
		expect(screen.queryByTestId("midi-learn-panel")).not.toBeInTheDocument();
	});

	it("replaces voice settings with midi learn in the same side panel slot", () => {
		mockedMidiLearnOpen = true;
		render(<SynthSidebar />);
		expect(screen.getByTestId("midi-learn-panel")).toBeInTheDocument();
		expect(
			screen.queryByTestId("preset-voice-settings-panel"),
		).not.toBeInTheDocument();
	});
});
