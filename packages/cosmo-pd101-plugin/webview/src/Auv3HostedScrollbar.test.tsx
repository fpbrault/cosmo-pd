import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import Auv3HostedScrollbar from "./Auv3HostedScrollbar";

describe("Auv3HostedScrollbar", () => {
	it("renders a hosted scrollbar for overflowing content", async () => {
		const viewport = document.createElement("div");
		Object.defineProperties(viewport, {
			clientHeight: { configurable: true, value: 400 },
			scrollHeight: { configurable: true, value: 800 },
			scrollTop: { configurable: true, value: 100, writable: true },
		});
		const viewportRef = createRef<HTMLDivElement>();
		viewportRef.current = viewport;

		render(<Auv3HostedScrollbar viewportRef={viewportRef} />);

		await waitFor(() => {
			expect(screen.getByRole("scrollbar")).toHaveAttribute(
				"aria-valuemax",
				"400",
			);
		});
		expect(screen.getByRole("scrollbar")).toHaveAttribute(
			"aria-valuenow",
			"100",
		);
		expect(screen.getByRole("scrollbar")).toHaveStyle({
			height: "50%",
			top: "12.5%",
		});
		expect(screen.getByRole("scrollbar")).toHaveClass("min-h-12");
		expect(screen.getByRole("scrollbar").parentElement).toHaveClass("w-full");
	});

	it("stays hidden when the viewport does not overflow", () => {
		const viewport = document.createElement("div");
		Object.defineProperties(viewport, {
			clientHeight: { configurable: true, value: 400 },
			scrollHeight: { configurable: true, value: 400 },
			scrollTop: { configurable: true, value: 0, writable: true },
		});
		const viewportRef = createRef<HTMLDivElement>();
		viewportRef.current = viewport;

		render(<Auv3HostedScrollbar viewportRef={viewportRef} />);

		expect(screen.queryByRole("scrollbar")).not.toBeInTheDocument();
	});
});
