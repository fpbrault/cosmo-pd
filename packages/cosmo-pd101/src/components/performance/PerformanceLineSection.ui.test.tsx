import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PhaseLineModel } from "@/components/editor/phaseLineTypes";
import PerformanceLineSection from "./PerformanceLineSection";

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: ({ label, disabled }: { label?: string; disabled?: boolean }) => (
		<input type="range" aria-label={label} disabled={disabled} />
	),
}));

function createLine({
	isAudible = true,
	algoB = "pinch",
}: {
	isAudible?: boolean;
	algoB?: PhaseLineModel["algo"]["algoB"];
} = {}) {
	return {
		meta: {
			label: "Line 1",
			color: "#7f9de4",
			lineIndex: 1,
			isAudible,
			inactiveModeLabel: isAudible ? "L1" : "L2",
		},
		algo: {
			algoA: "cz101",
			setAlgoA: vi.fn(),
			algoB,
			setAlgoB: vi.fn(),
			blend: 0.65,
			setBlend: vi.fn(),
			baseWaveformA: "cosine",
			setBaseWaveformA: vi.fn(),
			baseWaveformB: "cosine",
			setBaseWaveformB: vi.fn(),
			controlsA: [],
			setControlsA: vi.fn(),
			updateControlA: vi.fn(),
			controlsB: [],
			setControlsB: vi.fn(),
			updateControlB: vi.fn(),
		},
		parameters: {
			warpAmount: 0,
			setWarpAmount: vi.fn(),
			level: 1,
			setLevel: vi.fn(),
			octave: 0,
			setOctave: vi.fn(),
			lineSelect: isAudible ? "L1" : "L2",
			detuneDisabled: true,
			detuneLabelPrefix: "L2",
		},
	} as unknown as PhaseLineModel;
}

describe("Simple line algorithm availability", () => {
	it("disables both algorithm cards and blend for an inactive line", () => {
		render(
			<PerformanceLineSection
				line={createLine({ isAudible: false })}
				expanded
				onActivate={vi.fn()}
				embedded
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Edit line 1 algorithm A" }),
		).toBeDisabled();
		expect(
			screen.getByRole("button", { name: "Edit line 1 algorithm B" }),
		).toBeDisabled();
		expect(screen.getByRole("slider", { name: "Blend" })).toBeDisabled();
	});

	it("offers None for algorithm B and locks blend while it is selected", () => {
		const line = createLine({ algoB: null });
		render(
			<PerformanceLineSection
				line={line}
				expanded
				onActivate={vi.fn()}
				embedded
			/>,
		);

		const algoB = screen.getByRole("button", {
			name: "Edit line 1 algorithm B",
		});
		expect(algoB).toBeEnabled();
		expect(screen.queryByRole("slider", { name: "Blend" })).toBeNull();
		fireEvent.click(algoB);
		expect(screen.getByRole("button", { name: "None" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		fireEvent.click(screen.getByRole("button", { name: "Pinch" }));
		expect(line.algo.setAlgoB).toHaveBeenCalledWith("pinch");
	});

	it("clears algorithm B without changing the prepared blend value", () => {
		const line = createLine();
		render(
			<PerformanceLineSection
				line={line}
				expanded
				onActivate={vi.fn()}
				embedded
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Edit line 1 algorithm B" }),
		);
		fireEvent.click(screen.getByRole("button", { name: "None" }));
		expect(line.algo.setAlgoB).toHaveBeenCalledWith(null);
		expect(line.algo.setBlend).not.toHaveBeenCalled();
	});

	it("opens the algorithm picker from the algorithm name", () => {
		render(
			<PerformanceLineSection
				line={createLine()}
				expanded
				onActivate={vi.fn()}
				embedded
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Edit line 1 algorithm A name: Classic",
			}),
		);
		expect(
			screen.getByRole("dialog", {
				name: "Edit line 1 algorithm A",
			}),
		).toBeVisible();
	});

	it("places Blend directly after Oct when algorithm B is selected", () => {
		render(
			<PerformanceLineSection
				line={createLine()}
				expanded
				onActivate={vi.fn()}
				embedded
			/>,
		);

		expect(
			screen
				.getAllByRole("slider")
				.map((control) => control.getAttribute("aria-label")),
		).toEqual(["Volume", "DCW", "Oct", "Blend"]);
	});
});
