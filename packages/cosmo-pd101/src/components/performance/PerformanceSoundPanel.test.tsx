import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LineAlgorithmCard from "./LineAlgorithmCard";

describe("LineAlgorithmCard", () => {
	it("combines the active A and B algorithms into one horizontal line card", () => {
		const onSelect = vi.fn();
		render(
			<LineAlgorithmCard
				lineIndex={1}
				algoA="cz101"
				algoB="pinch"
				selectedLine={1}
				selectedAlgo="a"
				onSelect={onSelect}
			/>,
		);

		const group = screen.getByRole("group", { name: "Line 1 algorithms" });
		const algoA = screen.getByRole("button", {
			name: "Edit line 1 algorithm A",
		});
		const algoB = screen.getByRole("button", {
			name: "Edit line 1 algorithm B",
		});

		expect(group).toContainElement(algoA);
		expect(group).toContainElement(algoB);
		expect(algoA).toHaveAttribute("aria-pressed", "true");
		expect(algoB).toHaveAttribute("aria-pressed", "false");
		fireEvent.click(algoB);
		expect(onSelect).toHaveBeenCalledWith(1, "b");
	});

	it("keeps algorithm B active when it is available", () => {
		const onSelect = vi.fn();
		render(
			<LineAlgorithmCard
				lineIndex={2}
				algoA="cz101"
				algoB="pinch"
				onSelect={onSelect}
			/>,
		);

		expect(
			screen.getByRole("group", { name: "Line 2 algorithms" }),
		).toHaveClass("w-full", "grid-cols-2", "self-center");
		expect(screen.getByText("2A")).toBeVisible();
		expect(screen.getByText("2B")).toBeVisible();
		const algoB = screen.getByRole("button", {
			name: "Edit line 2 algorithm B",
		});
		expect(algoB).toBeEnabled();
		fireEvent.click(algoB);
		expect(onSelect).toHaveBeenCalledWith(2, "b");
	});

	it("keeps an inactive line visible but disables its algorithms", () => {
		const onSelect = vi.fn();
		render(
			<LineAlgorithmCard
				lineIndex={2}
				algoA="cz101"
				algoB="pinch"
				inactive
				onSelect={onSelect}
			/>,
		);

		expect(
			screen.getByRole("group", { name: "Line 2 algorithms (inactive)" }),
		).toHaveClass("opacity-55", "saturate-50");
		const algoA = screen.getByRole("button", {
			name: "Edit line 2 algorithm A",
		});
		const algoB = screen.getByRole("button", {
			name: "Edit line 2 algorithm B",
		});
		expect(algoA).toBeDisabled();
		expect(algoB).toBeDisabled();
		fireEvent.click(algoA);
		expect(onSelect).not.toHaveBeenCalled();
	});
});
