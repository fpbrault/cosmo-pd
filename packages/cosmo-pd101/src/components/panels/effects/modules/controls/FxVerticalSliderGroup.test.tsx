import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FxVerticalSliderGroup from "./FxVerticalSliderGroup";

describe("FxVerticalSliderGroup", () => {
	it("renders all slider children", () => {
		render(
			<FxVerticalSliderGroup>
				<div data-testid="slider-a" />
				<div data-testid="slider-b" />
				<div data-testid="slider-c" />
			</FxVerticalSliderGroup>,
		);

		expect(screen.getByTestId("slider-a")).toBeInTheDocument();
		expect(screen.getByTestId("slider-b")).toBeInTheDocument();
		expect(screen.getByTestId("slider-c")).toBeInTheDocument();
	});

	it("renders one separator ladder per slider gap", () => {
		const { container } = render(
			<FxVerticalSliderGroup>
				<div />
				<div />
				<div />
				<div />
			</FxVerticalSliderGroup>,
		);

		// 4 sliders => 3 separator groups
		const separators = container.querySelectorAll("[aria-hidden='true']");
		expect(separators).toHaveLength(3);
	});
});
