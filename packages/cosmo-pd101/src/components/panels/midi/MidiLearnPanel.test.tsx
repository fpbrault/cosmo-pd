import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MidiLearnPanel from "./MidiLearnPanel";

const state = {
	learnMode: false,
	bindings: {
		macro1: { paramKey: "macro1", channel: 0, cc: 7 },
	},
	setLearnMode: vi.fn(),
	clearLastCapturedCc: vi.fn(),
	removeBinding: vi.fn(),
	updateBinding: vi.fn(),
	resetPendingLearnParam: vi.fn(),
};

vi.mock("@/features/synth/midiLearnStore", () => ({
	useMidiLearnStore: vi.fn((selector: (s: typeof state) => unknown) =>
		selector(state),
	),
}));

vi.mock("@/features/synth/midiLearnRegistry", () => ({
	getMidiLearnTargetLabel: vi.fn(() => "Macro 1"),
}));

vi.mock("@/components/layout/SynthPanelContainer", () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

describe("MidiLearnPanel", () => {
	it("toggles learn mode and supports binding deletion", () => {
		render(<MidiLearnPanel />);
		fireEvent.click(screen.getByRole("button", { name: "Midi Learn: OFF" }));
		expect(state.setLearnMode).toHaveBeenCalledWith(true);

		fireEvent.click(screen.getByLabelText("Remove MIDI binding for macro1"));
		expect(state.removeBinding).toHaveBeenCalledWith("macro1");
	});
});
