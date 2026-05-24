import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PerLineParametersCard from "./PerLineParametersCard";

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: vi.fn(() => ({ value: "L1+L2'" })),
}));

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: ({
		label,
		onChange,
	}: {
		label: string;
		onChange: (value: number) => void;
	}) => (
		<button
			type="button"
			data-testid={`knob-${label}`}
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
				warpAmount={0}
				setWarpAmount={vi.fn()}
				level={0}
				setLevel={vi.fn()}
				octave={0}
				setOctave={vi.fn()}
				detuneOctave={0}
				setDetuneOctave={vi.fn()}
				detuneNote={0}
				setDetuneNote={setDetuneNote}
				fineDetune={0}
				setFineDetune={vi.fn()}
				lineIndex={2}
			/>,
		);
		fireEvent.click(screen.getByTestId("knob-L2 Note"));
		expect(setDetuneNote).toHaveBeenCalledWith(1);
	});
});
