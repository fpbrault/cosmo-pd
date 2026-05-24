import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StepEnvelopeStepCard from "./StepEnvelopeStepCard";

vi.mock("@/lib/synth/modTargets", () => ({
	resolveTargetFromMetadata: vi.fn(() => "volume"),
}));

vi.mock("@/components/controls/ControlKnob", () => ({
	default: ({
		label,
		onChange,
	}: {
		label: string;
		onChange: (value: number) => void;
	}) => (
		<button
			type="button"
			data-testid={`step-knob-${label}`}
			onClick={() => onChange(5)}
		>
			{label}
		</button>
	),
}));

describe("StepEnvelopeStepCard", () => {
	it("wires level/rate/sustain/end interactions", () => {
		const onLevelChange = vi.fn();
		const onRateChange = vi.fn();
		const onSetSustain = vi.fn();
		const onSetEnd = vi.fn();
		render(
			<StepEnvelopeStepCard
				step={{ level: 10, rate: 20 }}
				stepIndex={0}
				activeStepCount={2}
				sustainStep={0}
				levelKnobColor="#fff"
				lineIndex={1}
				envKind="dco"
				onLevelChange={onLevelChange}
				onRateChange={onRateChange}
				onSetSustain={onSetSustain}
				onSetEnd={onSetEnd}
			/>,
		);
		fireEvent.click(screen.getByTestId("step-knob-Lvl"));
		fireEvent.click(screen.getByTestId("step-knob-Rate"));
		fireEvent.click(screen.getByRole("button", { name: "SUS" }));
		fireEvent.click(screen.getByRole("button", { name: "END" }));
		expect(onLevelChange).toHaveBeenCalledWith(5);
		expect(onRateChange).toHaveBeenCalledWith(5);
		expect(onSetSustain).toHaveBeenCalled();
		expect(onSetEnd).toHaveBeenCalled();
	});
});
