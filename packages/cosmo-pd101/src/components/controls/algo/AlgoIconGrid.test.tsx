import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AlgoIconGrid from "./AlgoIconGrid";

vi.mock("@/lib/synth/algoRef", () => ({
	isAlgoRefEqual: (a: unknown, b: unknown) => a === b,
}));

vi.mock("@/lib/synth/pdAlgorithms", () => ({
	PD_ALGOS: [
		{ key: "algo-1", label: "Algo 1", value: "cz101", icon: "M1 1L10 10" },
		{ key: "algo-2", label: "Algo 2", value: "bend", icon: "M2 2L11 11" },
	],
	getPdAlgoBehaviorDescription: () => "mock behavior",
}));

describe("AlgoIconGrid", () => {
	it("renders algorithm buttons and dispatches selection", () => {
		const onChange = vi.fn();
		render(<AlgoIconGrid value="cz101" onChange={onChange} />);

		const second = screen.getByRole("button", { name: "Algo 2" });
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
});
