import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EnvelopeKeyFollowControl } from "./EnvelopeKeyFollowControl";

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: ({
		label,
		onChange,
	}: {
		label: string;
		onChange: (value: number) => void;
	}) => (
		<button type="button" onClick={() => onChange(5)}>
			{label}
		</button>
	),
}));

vi.mock("@/components/controls/SynthParamSlider", () => ({
	default: ({
		label,
		onChange,
	}: {
		label: string;
		onChange: (value: number) => void;
	}) => (
		<button type="button" onClick={() => onChange(4)}>
			{label}
		</button>
	),
}));

const createEnvelopes = () => ({
	envs: {
		dco: {
			title: "DCO",
			env: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			setEnv: vi.fn(),
			envColor: "#fff",
		},
		dcw: {
			title: "DCW",
			env: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			setEnv: vi.fn(),
			envColor: "#fff",
		},
		dca: {
			title: "DCA",
			env: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			setEnv: vi.fn(),
			envColor: "#fff",
		},
	},
	dcwKeyFollow: 0,
	setDcwKeyFollow: vi.fn(),
	dcaKeyFollow: 0,
	setDcaKeyFollow: vi.fn(),
});

describe("EnvelopeKeyFollowControl", () => {
	it("routes DCW key follow changes", () => {
		const envelopes = createEnvelopes();
		render(
			<EnvelopeKeyFollowControl
				envKind="dcw"
				lineIndex={1}
				envelopes={envelopes}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Key Follow" }));
		expect(envelopes.setDcwKeyFollow).toHaveBeenCalledWith(4);
	});

	it("routes DCA key follow changes", () => {
		const envelopes = createEnvelopes();
		render(
			<EnvelopeKeyFollowControl
				envKind="dca"
				lineIndex={2}
				envelopes={envelopes}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Key Follow" }));
		expect(envelopes.setDcaKeyFollow).toHaveBeenCalledWith(4);
	});

	it("renders no control for DCO", () => {
		render(
			<EnvelopeKeyFollowControl
				envKind="dco"
				lineIndex={1}
				envelopes={createEnvelopes()}
			/>,
		);

		expect(screen.queryByText("Key Follow")).not.toBeInTheDocument();
	});
});
