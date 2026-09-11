import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AlgoIconGrid from "./AlgoIconGrid";

vi.mock("@/lib/synth/algoRef", () => ({
	isAlgoRefEqual: (a: unknown, b: unknown) => a === b,
}));

vi.mock("@/lib/synth/algoUiCatalog", () => ({
	PD_ALGOS: [
		{ key: "algo-1", label: "Algo 1", value: "cz101", icon: "M1 1L10 10" },
		{ key: "algo-2", label: "Algo 2", value: "bend", icon: "M2 2L11 11" },
	],
	getPdAlgoBehaviorDescription: () => "behavior",
}));

describe("AlgoIconGrid", () => {
	it("renders algorithm buttons and dispatches selection", () => {
		const onChange = vi.fn();
		render(<AlgoIconGrid value="cz101" onChange={onChange} />);

		const second = screen.getByRole("button", { name: "Algo 2" });
		expect(second).toHaveClass("size-16");
		expect(second).toHaveAttribute("data-hover-info", "Algorithm 2: behavior");
		fireEvent.click(second);
		expect(onChange).toHaveBeenCalledWith("bend");
	});

	it("disables interaction when disabled", () => {
		const onChange = vi.fn();
		render(<AlgoIconGrid value="cz101" onChange={onChange} disabled />);

		const first = screen.getByRole("button", { name: "Algo 1" });
		expect(first).toBeDisabled();
		fireEvent.click(first);
		expect(onChange).not.toHaveBeenCalled();
	});

	it("selects None from either presentation", () => {
		const onChange = vi.fn();
		render(
			<AlgoIconGrid
				value="cz101"
				onChange={onChange}
				allowNone
				variant="compact"
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Algorithm 1: Algo 1. Click to change.",
			}),
		);
		fireEvent.click(screen.getByRole("button", { name: "None" }));
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it("navigates from None using its actual final option index", () => {
		const previousChange = vi.fn();
		const { unmount } = render(
			<AlgoIconGrid
				value={null}
				onChange={previousChange}
				allowNone
				variant="compact"
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Previous algorithm" }));
		expect(previousChange).toHaveBeenCalledWith("bend");
		unmount();

		const nextChange = vi.fn();
		render(
			<AlgoIconGrid
				value={null}
				onChange={nextChange}
				allowNone
				variant="compact"
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Next algorithm" }));
		expect(nextChange).toHaveBeenCalledWith("cz101");
	});
});
