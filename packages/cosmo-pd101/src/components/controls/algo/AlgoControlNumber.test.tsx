import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMidiLearnTargetRegistration } from "@/features/synth/midiLearnRegistry";
import AlgoControlNumber from "./AlgoControlNumber";

const knobSpy = vi.fn();
const algoControlTargetFromSlotMock = vi.fn();

vi.mock("@/lib/synth/modDestination", () => ({
	algoControlTargetFromSlot: (...args: unknown[]) =>
		algoControlTargetFromSlotMock(...args),
}));

vi.mock("@/lib/synth/i18nAlgo", () => ({
	useAlgoControl: (_algo: string, controlId: string) => ({
		label: controlId.charAt(0).toUpperCase() + controlId.slice(1),
		description: "",
	}),
}));

vi.mock("../parameters/ControlKnob", () => ({
	default: (props: Record<string, unknown>) => {
		knobSpy(props);
		return <div data-testid="mock-knob">{String(props.label)}</div>;
	},
}));

describe("AlgoControlNumber", () => {
	beforeEach(() => {
		knobSpy.mockClear();
		algoControlTargetFromSlotMock.mockReset();
	});

	it("renders knob with resolved value and forwards number changes to binding", () => {
		const setNumber = vi.fn();
		algoControlTargetFromSlotMock.mockReturnValue("algoControl2");

		render(
			<AlgoControlNumber
				control={{
					id: "depth",
					label: "Depth",
					min: 0,
					max: 2,
					default: 0.5,
					algo: "cz101",
				}}
				binding={{ getNumber: () => 1.25, setNumber }}
				lineIndex={1}
				algoControlSlotIndex={{ depth: 2 }}
				getAlgoControlValue={vi.fn()}
				setAlgoControlValue={vi.fn()}
			/>,
		);

		expect(screen.getByTestId("mock-knob")).toHaveTextContent("Depth");
		const props = knobSpy.mock.calls[0][0] as {
			value: number;
			onChange: (value: number) => void;
			modulatable: string;
		};
		expect(props.value).toBe(1.25);
		expect(props.modulatable).toBe("algoControl2");
		props.onChange(0.77);
		expect(setNumber).toHaveBeenCalledWith(0.77);
	});

	it("falls back to state getter and setAlgoControlValue", () => {
		const setAlgoControlValue = vi.fn();
		render(
			<AlgoControlNumber
				control={{
					id: "res",
					label: "Res",
					min: 0,
					max: 1,
					default: 0.4,
					algo: "cz101",
				}}
				lineIndex={2}
				algoControlSlotIndex={{}}
				getAlgoControlValue={() => 0.61}
				setAlgoControlValue={setAlgoControlValue}
			/>,
		);

		const props = knobSpy.mock.calls[knobSpy.mock.calls.length - 1]?.[0] as {
			onChange: (value: number) => void;
			valueFormatter: (value: number) => string;
		};
		expect(props.valueFormatter(0.61)).toBe("61%");
		props.onChange(0.2);
		expect(setAlgoControlValue).toHaveBeenCalledWith("res", 0.2);
	});

	it("registers generic slot-based MIDI learn target key (not algo-specific)", () => {
		algoControlTargetFromSlotMock.mockReturnValue("algoControl2");
		render(
			<AlgoControlNumber
				control={{
					id: "depth",
					label: "Depth",
					min: 0,
					max: 2,
					default: 0.5,
					algo: "cz101",
				}}
				lineIndex={1}
				algoControlSlotIndex={{ depth: 2 }}
				getAlgoControlValue={vi.fn()}
				setAlgoControlValue={vi.fn()}
			/>,
		);

		const registration = getMidiLearnTargetRegistration("line1AlgoControl2");
		expect(registration).toBeDefined();
		expect(registration?.label).toBe("Line 1 Algo Control 2");

		const algoSpecific = getMidiLearnTargetRegistration(
			"line1AlgoAControldepth",
		);
		expect(algoSpecific).toBeUndefined();
	});

	it("does not register MIDI target when slot index is absent", () => {
		algoControlTargetFromSlotMock.mockReturnValue(undefined);
		render(
			<AlgoControlNumber
				control={{
					id: "depth",
					label: "Depth",
					min: 0,
					max: 2,
					default: 0.5,
					algo: "cz101",
				}}
				lineIndex={2}
				algoControlSlotIndex={{}}
				getAlgoControlValue={vi.fn()}
				setAlgoControlValue={vi.fn()}
			/>,
		);

		const reg = getMidiLearnTargetRegistration("line2AlgoControl1");
		expect(reg).toBeUndefined();
	});

	it("does not register MIDI target for slots > 8", () => {
		algoControlTargetFromSlotMock.mockReturnValue(undefined);
		render(
			<AlgoControlNumber
				control={{
					id: "overflow",
					label: "Overflow",
					min: 0,
					max: 1,
					algo: "cz101",
				}}
				lineIndex={1}
				algoControlSlotIndex={{ overflow: 9 }}
				getAlgoControlValue={vi.fn()}
				setAlgoControlValue={vi.fn()}
			/>,
		);

		const reg = getMidiLearnTargetRegistration("line1AlgoControl9");
		expect(reg).toBeUndefined();
	});

	it("uses curated units for phase and detune controls", () => {
		render(
			<>
				<AlgoControlNumber
					control={{
						id: "twistPhase",
						label: "Phase",
						algo: "cz101",
						min: 0,
						max: 1,
						default: 0,
						readoutFormat: { kind: "degrees" },
					}}
					lineIndex={1}
					algoControlSlotIndex={{}}
					getAlgoControlValue={() => 0.25}
					setAlgoControlValue={vi.fn()}
				/>
				<AlgoControlNumber
					control={{
						id: "fineDetune",
						label: "Fine",
						algo: "cz101",
						min: -50,
						max: 50,
						default: 0,
						readoutFormat: { kind: "integer" },
					}}
					lineIndex={1}
					algoControlSlotIndex={{}}
					getAlgoControlValue={() => 12}
					setAlgoControlValue={vi.fn()}
				/>
			</>,
		);

		const phaseProps = knobSpy.mock.calls[0][0] as {
			valueFormatter: (value: number) => string;
		};
		const detuneProps = knobSpy.mock.calls[1][0] as {
			valueFormatter: (value: number) => string;
		};

		expect(phaseProps.valueFormatter(0.25)).toBe("90°");
		expect(detuneProps.valueFormatter(12)).toBe("+12");
	});
});
