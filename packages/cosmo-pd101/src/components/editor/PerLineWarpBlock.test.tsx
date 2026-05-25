import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BaseWaveform } from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import type { LineIndex } from "../controls/algo/algoControlTypes";
import PerLineWarpBlock from "./PerLineWarpBlock";

vi.mock("@/components/controls/algo/AlgoControlsGroup", () => ({
	default: ({
		onChange,
	}: {
		onChange?: (id: string, value: number) => void;
	}) => (
		<button
			type="button"
			data-testid="mock-control"
			onClick={() => onChange?.("test", 50)}
		>
			Control
		</button>
	),
}));

vi.mock("@/components/controls/algo/AlgoIconGrid", () => ({
	default: ({ onChange }: { onChange?: (value: PdAlgo) => void }) => (
		<select
			data-testid="algo-select"
			onChange={(e) => onChange?.(Number(e.target.value) as unknown as PdAlgo)}
		>
			<option value={0}>Algo 0</option>
			<option value={1}>Algo 1</option>
		</select>
	),
}));

vi.mock("./BaseWaveSelector", () => ({
	BaseWaveSelector: ({
		onChange,
		disabled,
	}: {
		onChange?: (v: string) => void;
		disabled?: boolean;
	}) => (
		<select
			data-testid="wave-select"
			disabled={disabled}
			onChange={(e) => onChange?.(e.target.value)}
		>
			<option value="saw">Saw</option>
			<option value="square">Square</option>
		</select>
	),
}));

vi.mock("./SingleCycleDisplay", () => ({
	SynthSingleCycleDisplay: () => <div data-testid="cycle-display" />,
}));

vi.mock("./PerLineParametersCard", () => ({
	default: ({ setWarpAmount }: { setWarpAmount?: (v: number) => void }) => (
		<button
			type="button"
			data-testid="per-line-params"
			onClick={() => setWarpAmount?.(0.5)}
		>
			PerLineParams
		</button>
	),
}));

vi.mock("@/components/primitives/Card", () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card">{children}</div>
	),
}));

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: ({
		label,
		onChange,
	}: {
		label?: string;
		onChange?: (v: number) => void;
	}) => (
		<button type="button" aria-label={label} onClick={() => onChange?.(0.3)}>
			{label}
		</button>
	),
}));
vi.mock("@/components/controls/SynthParamSlider", () => ({
	default: ({
		label,
		onChange,
	}: {
		label?: string;
		onChange?: (v: number) => void;
	}) => {
		const resolvedLabel = label?.trim() ? label : "BlendSlider";
		return (
			<button
				type="button"
				aria-label={resolvedLabel}
				onClick={() => onChange?.(0.3)}
			>
				{resolvedLabel}
			</button>
		);
	},
}));

vi.mock("./EnvelopesSection", () => ({
	EnvelopesSection: () => <div data-testid="envelopes-section" />,
}));

vi.mock("./AlgoSectionCard", () => ({
	default: ({
		onChange,
		disabled,
	}: {
		onChange?: (v: PdAlgo) => void;
		disabled?: boolean;
	}) => (
		<button
			type="button"
			data-testid="algo-card"
			disabled={disabled}
			onClick={() => onChange?.(1 as unknown as PdAlgo)}
		>
			AlgoCard
		</button>
	),
}));

function createProps() {
	return {
		label: "Line 1",
		color: "#ff0000",
		algo: "saw" as PdAlgo,
		setAlgo: vi.fn(),
		algo2: null as PdAlgo | null,
		setAlgo2: vi.fn(),
		algoBlend: 0,
		setAlgoBlend: vi.fn(),
		warpAmount: 0.5,
		setWarpAmount: vi.fn(),
		level: 100,
		setLevel: vi.fn(),
		octave: 3,
		setOctave: vi.fn(),
		dcoEnv: {
			steps: Array.from({ length: 8 }, (_, i) => ({
				level: Math.max(0, 99 - i * 10),
				rate: 50,
			})),
			sustainStep: 1,
			stepCount: 4,
			loop: false,
		},
		setDcoEnv: vi.fn(),
		dcwEnv: {
			steps: Array.from({ length: 8 }, (_, i) => ({
				level: Math.max(0, 99 - i * 10),
				rate: 50,
			})),
			sustainStep: 1,
			stepCount: 4,
			loop: false,
		},
		setDcwEnv: vi.fn(),
		dcaEnv: {
			steps: Array.from({ length: 8 }, (_, i) => ({
				level: Math.max(0, 99 - i * 10),
				rate: 50,
			})),
			sustainStep: 1,
			stepCount: 4,
			loop: false,
		},
		setDcaEnv: vi.fn(),
		dcwKeyFollow: 0,
		setDcwKeyFollow: vi.fn(),
		dcaKeyFollow: 0,
		setDcaKeyFollow: vi.fn(),
		baseWaveformA: "saw" as BaseWaveform,
		setBaseWaveformA: vi.fn(),
		baseWaveformB: "square" as BaseWaveform,
		setBaseWaveformB: vi.fn(),
		algoControlsA: [],
		setAlgoControlsA: vi.fn(),
		algoControlsB: [],
		setAlgoControlsB: vi.fn(),
		lineIndex: 1 as LineIndex,
		activeSection: "algos" as const,
	};
}

describe("PerLineWarpBlock", () => {
	it("renders algo A section when activeSection is algos", () => {
		const props = createProps();
		render(<PerLineWarpBlock {...props} />);

		expect(screen.getByText("Algo A")).toBeInTheDocument();
		expect(screen.getByText("Algo B")).toBeInTheDocument();
	});

	it("renders envelopes section when activeSection is envelopes", () => {
		const props = createProps();
		render(<PerLineWarpBlock {...props} activeSection="envelopes" />);

		expect(screen.getByTestId("envelopes-section")).toBeInTheDocument();
		expect(screen.queryByText("Algo A")).not.toBeInTheDocument();
	});

	it("renders single cycle display card in algos view", () => {
		const props = createProps();
		render(<PerLineWarpBlock {...props} />);

		expect(screen.getByText("Single Cycle")).toBeInTheDocument();
	});

	it("renders PerLineParameters card in algos view", () => {
		const props = createProps();
		render(<PerLineWarpBlock {...props} />);

		expect(screen.getByTestId("per-line-params")).toBeInTheDocument();
	});

	it("renders blend slider in algos view", () => {
		const props = createProps();
		render(<PerLineWarpBlock {...props} />);

		expect(
			screen.getByRole("button", { name: "BlendSlider" }),
		).toBeInTheDocument();
		expect(screen.getByText("Blend")).toBeInTheDocument();
	});

	it("has Algo B card disabled when blend is 0", () => {
		const props = createProps();
		render(<PerLineWarpBlock {...props} algoBlend={0} />);

		const algoBCards = screen.getAllByTestId("algo-card");
		expect(algoBCards[1]).toBeDisabled();
	});

	it("has Algo B card enabled when blend > 0", () => {
		const props = createProps();
		render(
			<PerLineWarpBlock
				{...props}
				algoBlend={0.5}
				algo2={1 as unknown as PdAlgo}
			/>,
		);

		const algoBCards = screen.getAllByTestId("algo-card");
		expect(algoBCards[1]).not.toBeDisabled();
	});

	it("passes warp amount change callback through PerLineParametersCard", () => {
		const props = createProps();
		render(<PerLineWarpBlock {...props} />);

		fireEvent.click(screen.getByTestId("per-line-params"));

		expect(props.setWarpAmount).toHaveBeenCalledWith(0.5);
	});

	it("passes blend change through slider", () => {
		const props = createProps();
		render(<PerLineWarpBlock {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "BlendSlider" }));

		expect(props.setAlgoBlend).toHaveBeenCalledWith(0.3);
	});
});
