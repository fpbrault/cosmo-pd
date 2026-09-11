import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AlgoSectionCard from "./AlgoSectionCard";
import type { AlgoSlotViewModel } from "./phaseLineTypes";

vi.mock("@/components/controls/algo/AlgoIconGrid", () => ({
	default: ({
		onChange,
		disabled,
		allowNone,
	}: {
		onChange: (value: string) => void;
		disabled?: boolean;
		allowNone?: boolean;
	}) => (
		<button
			type="button"
			data-testid="algo-grid"
			data-disabled={String(Boolean(disabled))}
			data-allow-none={String(Boolean(allowNone))}
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
			allowNone: false,
			controlsDisabled: false,
			controls: [],
			controlBindings: {},
			algoControlSlotIndex: {},
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

	it("keeps the Advanced B selector enabled while B is None", () => {
		const slot: AlgoSlotViewModel = {
			slotId: "b",
			value: null,
			onChange: vi.fn(),
			allowNone: true,
			controlsDisabled: true,
			controls: [],
			controlBindings: {},
			algoControlSlotIndex: {},
			getControlValue: vi.fn(),
			setControlValue: vi.fn(),
			getActiveSelectOption: vi.fn(),
			applyOptionAssignments: vi.fn(),
		};

		render(<AlgoSectionCard slot={slot} lineIndex={1} />);
		expect(screen.getByTestId("algo-grid")).toHaveAttribute(
			"data-disabled",
			"false",
		);
		expect(screen.getByTestId("algo-grid")).toHaveAttribute(
			"data-allow-none",
			"true",
		);
	});
});
