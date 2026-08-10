import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSynthStore } from "@/features/synth/synthStore";
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

vi.mock("@/components/primitives/CzTabButton", () => ({
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
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
	});

	it("shows inactive line overlay and tab click updates store", () => {
		render(<PhaseLinesSection />);
		expect(
			screen.getByText(/Line 2 is currently inactive in L1 mode/i),
		).toBeInTheDocument();
		fireEvent.click(screen.getAllByRole("button", { name: "ENV" })[0]);
		expect(setPhaseLinePanelTab).toHaveBeenCalled();
	});

	it("selects synthesis independently for each line", () => {
		render(<PhaseLinesSection />);
		const selectors = screen.getAllByRole("combobox", {
			name: "Synthesis method",
		});
		fireEvent.change(selectors[0], { target: { value: "karpunk" } });
		expect(useSynthStore.getState().line1SynthesisMethod).toBe("karpunk");
		expect(useSynthStore.getState().line2SynthesisMethod).toBe("pd");
		expect(screen.getByRole("button", { name: "STRING" })).toBeInTheDocument();
	});
});
