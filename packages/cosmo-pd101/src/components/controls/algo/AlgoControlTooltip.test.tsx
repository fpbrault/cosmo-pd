import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AlgoControlTooltip from "./AlgoControlTooltip";

vi.mock("@/lib/synth/i18nAlgo", () => ({
	useAlgoUiText: (key: string) =>
		(
			({ showControlDescription: "Show control description" }) as Record<
				string,
				string
			>
		)[key] ?? key,
}));

vi.mock("../../layout/HoverInfo", () => ({
	useHoverInfoHandlers: () => ({
		onMouseEnter: vi.fn(),
		onMouseLeave: vi.fn(),
	}),
}));

describe("AlgoControlTooltip", () => {
	it("renders nothing without description", () => {
		const { container } = render(
			<AlgoControlTooltip description={undefined} />,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders tooltip trigger when description exists", () => {
		render(<AlgoControlTooltip description="Fine tune harmonic spread" />);
		const button = screen.getByRole("button", {
			name: "Show control description",
		});
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute(
			"data-hover-info",
			"Fine tune harmonic spread",
		);
	});
});
