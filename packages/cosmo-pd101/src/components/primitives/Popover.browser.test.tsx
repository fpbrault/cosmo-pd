import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode, useRef, useState } from "react";
import { describe, expect, it } from "vitest";
import Popover from "./Popover";

function PopoverHarness({
	children,
	modal = true,
	role = "dialog",
	ariaLabel = "Test popover",
}: {
	children?: ReactNode;
	modal?: boolean;
	role?: "dialog" | "listbox";
	ariaLabel?: string;
}) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	return (
		<div>
			<button type="button" ref={triggerRef} onClick={() => setOpen(true)}>
				Open
			</button>
			<Popover
				open={open}
				onClose={() => setOpen(false)}
				triggerRef={triggerRef}
				role={role}
				ariaLabel={ariaLabel}
				modal={modal}
			>
				{children ?? (
					<>
						<button type="button">First</button>
						<button type="button">Second</button>
						<button type="button">Third</button>
					</>
				)}
			</Popover>
		</div>
	);
}

describe("Popover", () => {
	it("renders when open and hidden when closed", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness />);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Open" }));

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByRole("dialog")).toHaveAttribute(
			"aria-label",
			"Test popover",
		);
	});

	it("closes on Escape key", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness />);

		await user.click(screen.getByRole("button", { name: "Open" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();

		await user.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("closes on outside click", async () => {
		const user = userEvent.setup();
		render(
			<div>
				<PopoverHarness />
				<div data-testid="outside">Outside</div>
			</div>,
		);

		await user.click(screen.getByRole("button", { name: "Open" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();

		await user.click(screen.getByTestId("outside"));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("does not close on click inside the popover", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness />);

		await user.click(screen.getByRole("button", { name: "Open" }));

		await user.click(screen.getByRole("button", { name: "First" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("renders with listbox role when specified", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness role="listbox" ariaLabel="List" />);

		await user.click(screen.getByRole("button", { name: "Open" }));
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("sets aria-modal when modal is true", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness modal />);

		await user.click(screen.getByRole("button", { name: "Open" }));
		expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
	});

	it("does not set aria-modal when modal is false", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness modal={false} />);

		await user.click(screen.getByRole("button", { name: "Open" }));
		expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-modal");
	});

	it("traps focus and cycles within the popover", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness />);

		// Get trigger before popover opens (FloatingFocusManager aria-hides it when modal)
		const trigger = screen.getByRole("button", { name: "Open" });
		await user.click(trigger);

		expect(screen.getByRole("dialog")).toBeInTheDocument();

		// FloatingFocusManager may use async scheduling for initial focus
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "First" })).toHaveFocus(),
		);

		await user.tab();
		expect(document.activeElement).not.toBe(trigger);

		await user.tab();
		expect(document.activeElement).not.toBe(trigger);

		await user.tab();
		expect(document.activeElement).not.toBe(trigger);
	});

	it("traps focus on Shift+Tab backward", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness />);

		const trigger = screen.getByRole("button", { name: "Open" });
		await user.click(trigger);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "First" })).toHaveFocus(),
		);

		await user.tab({ shift: true });
		expect(document.activeElement).not.toBe(trigger);
	});

	it("returns focus to trigger on close", async () => {
		const user = userEvent.setup();
		render(<PopoverHarness />);

		const trigger = screen.getByRole("button", { name: "Open" });
		trigger.focus();

		await user.click(trigger);
		expect(screen.getByRole("dialog")).toBeInTheDocument();

		// Close via Escape
		await user.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		// Focus should return to trigger
		expect(trigger).toHaveFocus();
	});
});
