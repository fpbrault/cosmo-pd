import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MidiLearnPanel from "./MidiLearnPanel";

const state = {
	learnMode: false,
	bindings: [{ paramKey: "macro1", channel: 0, cc: 7 }],
	setLearnMode: vi.fn(),
	removeBinding: vi.fn(),
	addBinding: vi.fn(),
	resetPendingLearnParam: vi.fn(),
};

vi.mock("@/features/synth/midiLearnStore", () => ({
	useMidiLearnStore: vi.fn((selector: (s: typeof state) => unknown) =>
		selector(state),
	),
	subscribeMidiLearnState: vi.fn(() => vi.fn()),
}));

vi.mock("@/features/synth/midiLearnRegistry", () => ({
	getMidiLearnTargetLabel: vi.fn(() => "Macro 1"),
}));

vi.mock("@/components/layout/shell/SynthPanelContainer", () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

describe("MidiLearnPanel", () => {
	it("auto-enables learn mode on mount and supports binding deletion", () => {
		render(<MidiLearnPanel />);
		expect(state.setLearnMode).toHaveBeenCalledWith(true);

		fireEvent.click(screen.getByLabelText("Remove MIDI binding for macro1"));
		expect(state.removeBinding).toHaveBeenCalledWith({
			paramKey: "macro1",
			channel: 0,
			cc: 7,
		});
	});

	it("renders multiple bindings for the same target as separate rows", () => {
		state.bindings = [
			{ paramKey: "macro1", channel: 0, cc: 7 },
			{ paramKey: "macro1", channel: 0, cc: 8 },
		];

		render(<MidiLearnPanel />);

		expect(screen.getByText("7")).toBeInTheDocument();
		expect(screen.getByText("8")).toBeInTheDocument();

		state.bindings = [{ paramKey: "macro1", channel: 0, cc: 7 }];
	});
});
