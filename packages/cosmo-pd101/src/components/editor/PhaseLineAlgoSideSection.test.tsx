import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import type {
	AlgoControlValueV1,
	BaseWaveform,
} from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import { PhaseLineAlgoSideSection } from "./PhaseLineAlgoSideSection";
import type { AlgoSlotViewModel } from "./phaseLineTypes";

vi.mock("./AlgoSectionCard", () => ({
	default: ({
		slot,
		lineIndex,
		color,
	}: {
		slot: AlgoSlotViewModel;
		lineIndex: LineIndex;
		color?: string;
	}) => (
		<div
			data-testid="algo-section-card"
			data-slot-id={slot.slotId}
			data-line-index={lineIndex}
			data-color={color ?? ""}
		/>
	),
}));

vi.mock("./BaseWaveSelector", () => ({
	BaseWaveSelector: ({
		title,
		value,
		onChange,
		disabled,
	}: {
		title: string;
		value: BaseWaveform;
		onChange: (value: BaseWaveform) => void;
		disabled?: boolean;
	}) => (
		<button
			type="button"
			aria-label={title}
			disabled={disabled}
			onClick={() => onChange("triangle")}
		>
			{value}
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
		controlsB: [] as AlgoControlValueV1[],
		setControlsB: vi.fn(),
		...overrides,
	};
}

function createSlot(slotId: "a" | "b"): AlgoSlotViewModel {
	return {
		slotId,
		value: "saw",
		onChange: vi.fn(),
		disabled: false,
		controls: [],
		controlBindings: {},
		algoParamSlotIndex: {},
		getControlValue: vi.fn((_, fallback: number) => fallback),
		setControlValue: vi.fn(),
		getActiveSelectOption: vi.fn(() => null),
		applyOptionAssignments: vi.fn(),
	};
}

describe("PhaseLineAlgoSideSection", () => {
	it("renders section A with correct heading and forwards props", () => {
		const algo = createAlgo();
		render(
			<PhaseLineAlgoSideSection
				section="A"
				algo={algo}
				slot={createSlot("a")}
				baseWaveEnabled
				lineIndex={1}
				color="#123"
			/>,
		);

		expect(screen.getByText("Algo A")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Base Wave A" }),
		).toHaveTextContent("saw");
		expect(screen.getByTestId("algo-section-card")).toHaveAttribute(
			"data-slot-id",
			"a",
		);
		expect(screen.getByTestId("algo-section-card")).toHaveAttribute(
			"data-line-index",
			"1",
		);
	});

	it("wires section A base wave changes to setBaseWaveformA", () => {
		const algo = createAlgo();
		render(
			<PhaseLineAlgoSideSection
				section="A"
				algo={algo}
				slot={createSlot("a")}
				baseWaveEnabled
				lineIndex={1}
				color="#123"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Base Wave A" }));
		expect(algo.setBaseWaveformA).toHaveBeenCalledWith("triangle");
		expect(algo.setBaseWaveformB).not.toHaveBeenCalled();
	});

	it("wires section B and respects base-wave disabled state", () => {
		const algo = createAlgo();
		render(
			<PhaseLineAlgoSideSection
				section="B"
				algo={algo}
				slot={createSlot("b")}
				baseWaveEnabled={false}
				lineIndex={2}
				color="#abc"
			/>,
		);

		const baseWaveB = screen.getByRole("button", { name: "Base Wave B" });
		expect(baseWaveB).toBeDisabled();
		expect(baseWaveB).toHaveTextContent("square");
		expect(screen.getByTestId("algo-section-card")).toHaveAttribute(
			"data-slot-id",
			"b",
		);
	});
});
