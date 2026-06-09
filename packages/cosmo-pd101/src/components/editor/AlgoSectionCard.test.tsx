import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AlgoSectionCard from "./AlgoSectionCard";
import type { AlgoSlotViewModel } from "./phaseLineTypes";

vi.mock("@/components/controls/algo/AlgoIconGrid", () => ({
	default: ({ onChange }: { onChange: (value: string) => void }) => (
		<button
			type="button"
			data-testid="algo-grid"
			onClick={() => onChange("saw")}
		>
			grid
		</button>
	),
}));
vi.mock("@/components/controls/algo/AlgoControlsGroup", () => ({
	default: () => <div data-testid="algo-controls-group" />,
}));

describe("AlgoSectionCard", () => {
	it("renders and wires algorithm change", () => {
		const onChange = vi.fn();
		const slot: AlgoSlotViewModel = {
			slotId: "a",
			value: "cosine" as never,
			onChange,
			disabled: false,
			controls: [],
			controlBindings: {},
			algoParamSlotIndex: {},
			getControlValue: vi.fn(),
			setControlValue: vi.fn(),
			getActiveSelectOption: vi.fn(),
			applyOptionAssignments: vi.fn(),
		};

		render(<AlgoSectionCard slot={slot} lineIndex={1} />);
		fireEvent.click(screen.getByTestId("algo-grid"));
		expect(onChange).toHaveBeenCalledWith("saw");
		expect(screen.getByTestId("algo-controls-group")).toBeInTheDocument();
	});
});
