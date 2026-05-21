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
		expect(screen.getAllByText("LFO 1").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Mod Wheel").length).toBeGreaterThan(0);
		expect(screen.getByText("+50%")).toBeInTheDocument();
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
		fireEvent.click(
			screen.getByRole("button", { name: "Remove Mod Wheel route" }),
		);
		expect(onRemoveRoute).toHaveBeenCalledWith(1);

		// Adjust amount on first route using the route depth slider
		fireEvent.change(screen.getByRole("slider", { name: "LFO 1 depth" }), {
			target: { value: "0.1" },
		});
		expect(onAmountChange).toHaveBeenCalledTimes(1);
		expect(onAmountChange).toHaveBeenCalledWith(0, 0.1);

		// Close via header × button
		fireEvent.click(
			screen.getByRole("button", { name: "Close modulation panel" }),
		);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("dispatches add source action from source cards", () => {
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

		fireEvent.click(screen.getByRole("button", { name: "Velocity Add" }));
		expect(onAddRoute).toHaveBeenCalledWith("velocity");
	});
});
