import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ModRoute } from "@/lib/synth/bindings/synth";
import ModulationMenu from "./ModulationMenu";

const routes: ModRoute[] = [
	{ source: "lfo1", destination: "volume", amount: 0.5, enabled: true },
	{ source: "modWheel", destination: "volume", amount: -0.2, enabled: false },
];

describe("ModulationMenu", () => {
	it("renders routes with labels and values", () => {
		render(
			<ModulationMenu
				title="Volume"
				routes={[...routes]}
				onToggleEnabled={vi.fn()}
				onRemoveRoute={vi.fn()}
				onAmountChange={vi.fn()}
				onAddRoute={vi.fn()}
				onClose={vi.fn()}
			/>,
		);

		expect(screen.getByText("Volume")).toBeInTheDocument();
		// Source badges use short labels (LFO1, MW)
		expect(screen.getByText("LFO1")).toBeInTheDocument();
		expect(screen.getByText("MW")).toBeInTheDocument();
	});

	it("dispatches route actions", () => {
		const onToggleEnabled = vi.fn();
		const onRemoveRoute = vi.fn();
		const onAmountChange = vi.fn();
		const onClose = vi.fn();
		render(
			<ModulationMenu
				title="Volume"
				routes={[...routes]}
				onToggleEnabled={onToggleEnabled}
				onRemoveRoute={onRemoveRoute}
				onAmountChange={onAmountChange}
				onAddRoute={vi.fn()}
				onClose={onClose}
			/>,
		);

		// Toggle enabled on first route (checkbox toggle control)
		fireEvent.click(
			screen.getAllByRole("checkbox", {
				name: /Enable route|Disable route/i,
			})[0],
		);
		expect(onToggleEnabled).toHaveBeenCalledWith(0);

		// Remove second route (index 1 among remove buttons)
		fireEvent.click(screen.getAllByRole("button", { name: "Remove route" })[1]);
		expect(onRemoveRoute).toHaveBeenCalledWith(1);

		// Adjust amount on first route using keyboard interaction on knob spinbutton
		fireEvent.keyDown(screen.getAllByRole("spinbutton")[0], {
			key: "ArrowDown",
		});
		expect(onAmountChange).toHaveBeenCalledTimes(1);
		expect(onAmountChange).toHaveBeenCalledWith(0, expect.any(Number));
		expect(onAmountChange.mock.calls[0]?.[1]).toBeLessThan(0.5);

		// Close via header × button
		fireEvent.click(
			screen.getByRole("button", { name: "Close modulation panel" }),
		);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("dispatches add source action via source picker popover", () => {
		const onAddRoute = vi.fn();
		render(
			<ModulationMenu
				title="Volume"
				routes={[]}
				onToggleEnabled={vi.fn()}
				onRemoveRoute={vi.fn()}
				onAmountChange={vi.fn()}
				onAddRoute={onAddRoute}
				onClose={vi.fn()}
			/>,
		);

		// Open the source picker popover
		fireEvent.click(screen.getByRole("button", { name: "Pick Source" }));

		// Select "Velocity" from the popover grid
		fireEvent.click(screen.getByRole("button", { name: "Velocity" }));

		// Click Add button (shows "Add Velocity" since velocity was selected)
		fireEvent.click(screen.getByRole("button", { name: "Add Velocity" }));
		expect(onAddRoute).toHaveBeenCalledWith("velocity");
	});
});
