import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CollapsedSectionSummary from "./CollapsedSectionSummary";

describe("CollapsedSectionSummary", () => {
	it("preserves its semantic selector and expands from its accessible button", () => {
		const onExpand = vi.fn();
		render(
			<CollapsedSectionSummary
				title="Envelope +"
				ariaLabel="Expand Envelope section"
				testId="simple-envelope-summary"
				onExpand={onExpand}
			>
				<span>Envelope preview</span>
			</CollapsedSectionSummary>,
		);

		expect(screen.getByTestId("simple-envelope-summary")).toContainElement(
			screen.getByText("Envelope preview"),
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Expand Envelope section" }),
		);
		expect(onExpand).toHaveBeenCalledOnce();
	});
});
