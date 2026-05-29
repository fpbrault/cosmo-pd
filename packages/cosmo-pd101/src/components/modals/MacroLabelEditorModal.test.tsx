import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MacroLabelEditorPopover } from "./MacroLabelEditorPopover";

const setMacroLabel = vi.fn();
const state = {
	macroLabels: ["A", "B", "C", "D"] as [string, string, string, string],
	setMacroLabel,
};

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn((selector: (s: typeof state) => unknown) =>
		selector(state),
	),
}));

describe("MacroLabelEditorPopover", () => {
	it("renders 4 macro inputs and updates label", () => {
		const ref = { current: document.createElement("button") };
		render(<MacroLabelEditorPopover open triggerRef={ref} onClose={vi.fn()} />);
		const input = screen.getByDisplayValue("A");
		fireEvent.change(input, { target: { value: "Alpha" } });
		expect(setMacroLabel).toHaveBeenCalledWith(0, "Alpha");
		expect(screen.getByDisplayValue("D")).toBeInTheDocument();
	});
});
