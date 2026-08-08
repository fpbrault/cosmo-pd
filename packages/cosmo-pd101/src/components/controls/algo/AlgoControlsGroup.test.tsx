import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import AlgoControlsGroup from "./AlgoControlsGroup";

vi.mock("@/components/primitives/containers/Card", () => ({
	default: ({ children }: { children: ReactNode }) => (
		<div data-testid="card">{children}</div>
	),
}));

vi.mock("./AlgoControlItem", () => ({
	default: ({ control }: { control: { id: string } }) => (
		<div data-testid={`item-${control.id}`} />
	),
}));

vi.mock("@/lib/synth/i18nAlgo", () => ({
	useAlgoUiText: (key: string) =>
		(
			({ noControlsForThisAlgo: "No controls for this algo" }) as Record<
				string,
				string
			>
		)[key] ?? key,
}));

const sharedSlot = {
	algo: "saw" as const,
	controls: [],
	controlBindings: {},
	lineIndex: 1 as const,
	algoControlSlotIndex: {},
	getAlgoControlValue: () => 0,
	setAlgoControlValue: () => {},
	getActiveSelectOption: () => null,
	applyOptionAssignments: () => {},
};

describe("AlgoControlsGroup", () => {
	it("renders empty-state message when no controls", () => {
		render(<AlgoControlsGroup slot={sharedSlot} />);
		expect(screen.getByText("No controls for this algo")).toBeInTheDocument();
	});

	it("renders the default grid for non-CZ algos", () => {
		render(
			<AlgoControlsGroup
				slot={{
					...sharedSlot,
					controls: [
						{ id: "a", label: "A", algo: "saw" },
						{ id: "b", label: "B", algo: "saw" },
					],
				}}
			/>,
		);

		expect(screen.getByTestId("item-a")).toBeInTheDocument();
		expect(screen.getByTestId("item-b")).toBeInTheDocument();
		expect(
			screen.getByTestId("algo-controls-default-grid"),
		).toBeInTheDocument();
		expect(screen.queryByTestId("algo-controls-cz-layout")).toBeNull();
	});

	it("renders the CZ structured layout when the active algo is CZ", () => {
		render(
			<AlgoControlsGroup
				slot={{
					...sharedSlot,
					algo: "cz101",
					controls: [
						{ id: "preset", label: "Preset", algo: "cz101" },
						{ id: "waveform1", label: "Waveform 1", algo: "cz101" },
						{ id: "depth", label: "Depth", algo: "cz101" },
					],
				}}
			/>,
		);

		expect(screen.getByTestId("algo-controls-cz-layout")).toBeInTheDocument();
		expect(
			screen.getByTestId("algo-controls-cz-waveforms"),
		).toBeInTheDocument();
		expect(
			screen.getByTestId("algo-controls-cz-remaining"),
		).toBeInTheDocument();
		expect(screen.queryByTestId("algo-controls-default-grid")).toBeNull();
	});

	it("renders partial CZ controls without requiring a full CZ set", () => {
		render(
			<AlgoControlsGroup
				slot={{
					...sharedSlot,
					algo: "cz101",
					controls: [
						{ id: "waveform1", label: "Waveform 1", algo: "cz101" },
						{ id: "depth", label: "Depth", algo: "cz101" },
					],
				}}
			/>,
		);

		expect(screen.getByTestId("item-waveform1")).toBeInTheDocument();
		expect(screen.getByTestId("item-depth")).toBeInTheDocument();
		expect(screen.getByTestId("algo-controls-cz-layout")).toBeInTheDocument();
	});
});
