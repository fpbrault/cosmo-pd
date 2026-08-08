import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PhaseLinesSection from "./PhaseLinesSection";

const setPhaseLinePanelTab = vi.fn();
vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn(
		(
			selector: (s: {
				phaseLinePanelTab: "line2-algos";
				setPhaseLinePanelTab: typeof setPhaseLinePanelTab;
			}) => unknown,
		) =>
			selector({
				phaseLinePanelTab: "line2-algos",
				setPhaseLinePanelTab,
			}),
	),
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: vi.fn((key: string) => {
		if (key === "lineSelect") return { value: "L1", setValue: vi.fn() };
		return { value: 0, setValue: vi.fn() };
	}),
}));

vi.mock("./ActivePhaseLinePanel", () => ({
	ActivePhaseLinePanel: ({
		lineIndex,
		section,
	}: {
		lineIndex: 1 | 2;
		section: "algos" | "envelopes";
	}) => (
		<div data-testid="active-phase-line-panel">
			Line {lineIndex} {section}
		</div>
	),
}));

vi.mock("@/components/primitives/buttons/CzTabButton", () => ({
	default: ({
		bottomLabel,
		onClick,
	}: {
		bottomLabel: string;
		onClick: () => void;
	}) => (
		<button type="button" onClick={onClick}>
			{bottomLabel}
		</button>
	),
}));

describe("PhaseLinesSection", () => {
	it("shows inactive line overlay and tab click updates store", () => {
		render(<PhaseLinesSection />);
		expect(
			screen.getByText(/Line 2 is currently inactive in L1 mode/i),
		).toBeInTheDocument();
		fireEvent.click(screen.getAllByRole("button", { name: "ENV" })[0]);
		expect(setPhaseLinePanelTab).toHaveBeenCalled();
	});
});
