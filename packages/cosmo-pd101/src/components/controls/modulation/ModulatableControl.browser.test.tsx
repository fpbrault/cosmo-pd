import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
import { useModulationTargetStore } from "@/features/synth/modulationTargetStore";
import type { ModMatrix } from "@/lib/synth/bindings/synth";
import ControlKnob from "../ControlKnob";

function ModulationHarness() {
	const [modMatrix, setModMatrix] = useState<ModMatrix>({ routes: [] });
	const [value, setValue] = useState(0.5);

	return (
		<ModMatrixProvider modMatrix={modMatrix} setModMatrix={setModMatrix}>
			<ControlKnob
				label="Volume"
				value={value}
				onChange={setValue}
				min={0}
				max={1}
				modDestination="volume"
			/>
		</ModMatrixProvider>
	);
}

describe("ModulatableControl browser integration", () => {
	it("adds and removes routes through the modulation menu", async () => {
		useModulationTargetStore.getState().setModMode(true);
		useModulationTargetStore.getState().clearPendingDestination();
		render(<ModulationHarness />);

		const knob = screen.getByRole("spinbutton", {
			name: /volume/i,
		});

		fireEvent.pointerDown(knob);

		const dialog = screen.getByRole("dialog", {
			name: /modulation for volume/i,
		});

		fireEvent.click(
			within(dialog).getByRole("button", { name: /lfo 1\s*add/i }),
		);
		expect(within(dialog).getByText("1 Route")).toBeInTheDocument();

		fireEvent.click(
			within(dialog).getByRole("button", { name: "Remove LFO 1 route" }),
		);
		await waitFor(() => {
			expect(within(dialog).getByText("0 Routes")).toBeInTheDocument();
		});

		useModulationTargetStore.getState().setModMode(false);
		useModulationTargetStore.getState().clearPendingDestination();
	});
});
