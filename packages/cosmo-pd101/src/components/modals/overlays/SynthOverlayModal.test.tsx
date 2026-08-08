import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SynthOverlayModal } from "./SynthOverlayModal";

describe("SynthOverlayModal", () => {
	it("renders when open and closes on backdrop/escape", () => {
		const onClose = vi.fn();
		render(
			<SynthOverlayModal
				open
				onClose={onClose}
				title="Title"
				ariaLabel="overlay"
				widthClassName="w-10"
			>
				<div>content</div>
			</SynthOverlayModal>,
		);
		expect(screen.getByRole("dialog", { name: "overlay" })).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "Close overlay" }));
		fireEvent.keyDown(window, { key: "Escape" });
		expect(onClose).toHaveBeenCalledTimes(2);
	});

	it("returns null when closed", () => {
		render(
			<SynthOverlayModal
				open={false}
				onClose={vi.fn()}
				title="Title"
				ariaLabel="overlay"
				widthClassName="w-10"
			>
				<div>content</div>
			</SynthOverlayModal>,
		);
		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
