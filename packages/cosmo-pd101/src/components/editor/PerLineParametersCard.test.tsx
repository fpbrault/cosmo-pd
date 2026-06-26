import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PerLineParametersCard from "./PerLineParametersCard";

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: ({
		label,
		onChange,
		modDestination,
	}: {
		label: string;
		onChange: (value: number) => void;
		modDestination?: string;
	}) => (
		<button
			type="button"
			data-testid={`knob-${label}`}
			data-mod-destination={modDestination}
			onClick={() => onChange(1)}
		>
			{label}
		</button>
	),
}));

describe("PerLineParametersCard", () => {
	it("renders detune controls and dispatches changes", () => {
		const setDetuneNote = vi.fn();
		render(
			<PerLineParametersCard
				parameters={{
					warpAmount: 0,
					setWarpAmount: vi.fn(),
					level: 0,
					setLevel: vi.fn(),
					octave: 0,
					setOctave: vi.fn(),
					lineSelect: "L1+L2'",
					detuneDisabled: false,
					detuneLabelPrefix: "L2",
					detuneOctave: 0,
					setDetuneOctave: vi.fn(),
					detuneNote: 0,
					setDetuneNote,
					fineDetune: 0,
					setFineDetune: vi.fn(),
				}}
				lineIndex={2}
			/>,
		);
		fireEvent.click(screen.getByTestId("knob-L2 Note"));
		expect(setDetuneNote).toHaveBeenCalledWith(1);
		expect(screen.getByTestId("knob-Oct")).toHaveAttribute(
			"data-mod-destination",
			"line1Octave",
		);
		expect(screen.getByTestId("knob-L2 Oct")).toHaveAttribute(
			"data-mod-destination",
			"line2DetuneOctave",
		);
	});
});
