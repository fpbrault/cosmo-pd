import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AlgoControlItem from "./AlgoControlItem";

vi.mock("./AlgoControlSelect", () => ({
	default: () => <div data-testid="select-control" />,
}));

vi.mock("./AlgoControlDropdown", () => ({
	default: () => <div data-testid="dropdown-control" />,
}));

vi.mock("./AlgoControlNumber", () => ({
	default: () => <div data-testid="number-control" />,
}));

vi.mock("./AlgoControlToggle", () => ({
	default: () => <div data-testid="toggle-control" />,
}));

const baseProps = {
	binding: {},
	lineIndex: 1 as const,
	algoParamSlotIndex: {},
	getAlgoControlValue: () => 0,
	setAlgoControlValue: () => {},
	getActiveSelectOption: () => null,
	applyOptionAssignments: () => {},
};

describe("AlgoControlItem", () => {
	it("renders select control for select kind", () => {
		render(
			<AlgoControlItem
				{...baseProps}
				control={{ id: "x", label: "X", kind: "select", algo: "cz101" }}
			/>,
		);
		expect(screen.getByTestId("select-control")).toBeInTheDocument();
	});

	it("renders dropdown control for dropdown presentation", () => {
		render(
			<AlgoControlItem
				{...baseProps}
				control={{
					id: "x",
					label: "X",
					kind: "select",
					controlType: "dropdown",
					algo: "cz101",
				}}
			/>,
		);
		expect(screen.getByTestId("dropdown-control")).toBeInTheDocument();
	});

	it("renders number control by default", () => {
		render(
			<AlgoControlItem
				{...baseProps}
				control={{ id: "x", label: "X", algo: "cz101" }}
			/>,
		);
		expect(screen.getByTestId("number-control")).toBeInTheDocument();
	});

	it("renders toggle control for toggle kind", () => {
		render(
			<AlgoControlItem
				{...baseProps}
				control={{ id: "x", label: "X", kind: "toggle", algo: "cz101" }}
			/>,
		);
		expect(screen.getByTestId("toggle-control")).toBeInTheDocument();
	});
});
