import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { StepEnvelopeEditor } from "./StepEnvelopeEditor";

vi.mock("@/components/controls/ControlKnob", () => ({
	default: ({ label, disabled }: { label?: string; disabled?: boolean }) => (
		<button type="button" disabled={disabled}>
			{label}
		</button>
	),
}));

const createEnv = (overrides: Partial<StepEnvData> = {}): StepEnvData => ({
	steps: Array.from({ length: 8 }, (_, index) => ({
		level: Math.max(0, 99 - index * 10),
		rate: 40 + index,
	})),
	sustainStep: 1,
	stepCount: 4,
	loop: false,
	...overrides,
});

describe("StepEnvelopeEditor", () => {
	beforeEach(() => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
	});

	it("renders all 8 step panels and removes the old dropdown/footer UI", () => {
		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv()}
				onChange={vi.fn()}
			/>,
		);

		expect(screen.getAllByRole("group", { name: /Step / })).toHaveLength(8);
		expect(screen.queryAllByRole("combobox")).toHaveLength(0);
		expect(screen.queryByText(/Release:/i)).not.toBeInTheDocument();
		// SUS cannot be set beyond END
		expect(
			within(screen.getByRole("group", { name: "Step 8" })).getByRole(
				"button",
				{ name: "SUS" },
			),
		).toBeDisabled();
	});

	it("sets sustain from the SUS button on an active step", () => {
		const onChange = vi.fn();

		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv()}
				onChange={onChange}
			/>,
		);

		fireEvent.click(
			within(screen.getByRole("group", { name: "Step 3" })).getByRole(
				"button",
				{ name: "SUS" },
			),
		);

		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({
				sustainStep: 2,
				stepCount: 4,
			}),
		);
	});

	it("sets END on a later step and extends the active envelope range", () => {
		const onChange = vi.fn();

		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv()}
				onChange={onChange}
			/>,
		);

		fireEvent.click(
			within(screen.getByRole("group", { name: "Step 6" })).getByRole(
				"button",
				{ name: "END" },
			),
		);

		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({
				stepCount: 6,
				sustainStep: 1,
			}),
		);
	});

	it("clamps sustain when END moves earlier than the current sustain step", () => {
		const onChange = vi.fn();

		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv({ stepCount: 6, sustainStep: 4 })}
				onChange={onChange}
			/>,
		);

		fireEvent.click(
			within(screen.getByRole("group", { name: "Step 3" })).getByRole(
				"button",
				{ name: "END" },
			),
		);

		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({
				stepCount: 3,
				sustainStep: 2,
			}),
		);
	});
});
