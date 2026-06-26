import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
	AlgoControlValueV1,
	BaseWaveform,
} from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import { PhaseLineAlgoPanel } from "./PhaseLineAlgoPanel";
import type { AlgoSlotViewModel } from "./phaseLineTypes";

vi.mock("./AlgoSectionCard", () => ({
	default: ({ slot }: { slot: AlgoSlotViewModel }) => (
		<button
			type="button"
			data-testid={`algo-${slot.slotId}`}
			disabled={slot.disabled}
			onClick={() => slot.onChange("resonant" as never)}
		>
			Algo {slot.slotId}
		</button>
	),
}));

vi.mock("./BaseWaveSelector", () => ({
	BaseWaveSelector: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("./SingleCycleDisplay", () => ({
	SynthSingleCycleDisplay: () => <div data-testid="cycle-display" />,
}));

vi.mock("./PerLineParametersCard", () => ({
	default: () => <div data-testid="per-line-params" />,
}));

vi.mock("@/components/controls/SynthParamSlider", () => ({
	default: ({
		onChange,
		modDestination,
	}: {
		onChange: (value: number) => void;
		modDestination?: string;
	}) => (
		<button
			type="button"
			aria-label="BlendSlider"
			data-mod-destination={modDestination}
			onClick={() => onChange(0.3)}
		>
			BlendSlider
		</button>
	),
}));

function createAlgo(overrides = {}) {
	return {
		algoA: "saw" as PdAlgo,
		setAlgoA: vi.fn(),
		algoB: null as PdAlgo | null,
		setAlgoB: vi.fn(),
		blend: 0,
		setBlend: vi.fn(),
		baseWaveformA: "saw" as BaseWaveform,
		setBaseWaveformA: vi.fn(),
		baseWaveformB: "square" as BaseWaveform,
		setBaseWaveformB: vi.fn(),
		controlsA: [] as AlgoControlValueV1[],
		setControlsA: vi.fn(),
		updateControlA: vi.fn(),
		controlsB: [] as AlgoControlValueV1[],
		setControlsB: vi.fn(),
		updateControlB: vi.fn(),
		...overrides,
	};
}

const parameters = {
	warpAmount: 0,
	setWarpAmount: vi.fn(),
	level: 0,
	setLevel: vi.fn(),
	octave: 0,
	setOctave: vi.fn(),
	lineSelect: "L1+L2'",
	detuneDisabled: false,
	detuneLabelPrefix: "L2" as const,
};

describe("PhaseLineAlgoPanel", () => {
	it("renders algo sections, parameters, single cycle, and blend", () => {
		const algo = createAlgo();
		render(
			<PhaseLineAlgoPanel
				algo={algo}
				parameters={parameters}
				lineIndex={1}
				color="#fff"
			/>,
		);

		expect(screen.getByText("Algo A")).toBeInTheDocument();
		expect(screen.getByText("Algo B")).toBeInTheDocument();
		expect(screen.getByTestId("cycle-display")).toBeInTheDocument();
		expect(screen.getByTestId("per-line-params")).toBeInTheDocument();
		const blendSlider = screen.getByRole("button", { name: "BlendSlider" });
		expect(blendSlider).toHaveAttribute(
			"data-mod-destination",
			"line1AlgoBlend",
		);
		fireEvent.click(blendSlider);
		expect(algo.setBlend).toHaveBeenCalledWith(0.3);
	});

	it("wires line 2 blend slider to line2 modulation destination", () => {
		render(
			<PhaseLineAlgoPanel
				algo={createAlgo()}
				parameters={parameters}
				lineIndex={2}
				color="#fff"
			/>,
		);

		expect(screen.getByRole("button", { name: "BlendSlider" })).toHaveAttribute(
			"data-mod-destination",
			"line2AlgoBlend",
		);
	});

	it("disables algo B when blend is zero", () => {
		render(
			<PhaseLineAlgoPanel
				algo={createAlgo()}
				parameters={parameters}
				lineIndex={1}
				color="#fff"
			/>,
		);

		expect(screen.getByTestId("algo-b")).toBeDisabled();
	});

	it("enables algo B when blend is nonzero", () => {
		render(
			<PhaseLineAlgoPanel
				algo={createAlgo({ algoB: "saw" as PdAlgo, blend: 0.5 })}
				parameters={parameters}
				lineIndex={1}
				color="#fff"
			/>,
		);

		expect(screen.getByTestId("algo-b")).not.toBeDisabled();
	});
});
