import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSynthStore } from "@/features/synth/synthStore";
import { ActivePhaseLinePanel } from "./ActivePhaseLinePanel";

vi.mock("./usePhaseLineModel", () => ({
	usePhaseLineModel: (lineIndex: 1 | 2) => ({
		meta: {
			label: `Line ${lineIndex}`,
			color: "#fff",
			lineIndex,
			isAudible: true,
			inactiveModeLabel: "L1+L2'",
		},
		algo: {},
		parameters: {},
		envelopes: {},
	}),
}));

vi.mock("./PhaseLineAlgoPanel", () => ({
	PhaseLineAlgoPanel: ({ lineIndex }: { lineIndex: 1 | 2 }) => (
		<div data-testid="algo-panel">Algo {lineIndex}</div>
	),
}));

vi.mock("./PhaseLineEnvelopePanel", () => ({
	PhaseLineEnvelopePanel: ({ lineIndex }: { lineIndex: 1 | 2 }) => (
		<div data-testid="envelope-panel">Envelope {lineIndex}</div>
	),
}));

vi.mock("./KarpunkLinePanel", () => ({
	KarpunkLinePanel: ({ lineIndex }: { lineIndex: 1 | 2 }) => (
		<div data-testid="karpunk-panel">Karpunk {lineIndex}</div>
	),
}));

describe("ActivePhaseLinePanel", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
	});

	it("routes to the algo panel", () => {
		render(<ActivePhaseLinePanel lineIndex={1} section="algos" />);
		expect(screen.getByTestId("algo-panel")).toHaveTextContent("Algo 1");
	});

	it("routes to the envelope panel", () => {
		render(<ActivePhaseLinePanel lineIndex={2} section="envelopes" />);
		expect(screen.getByTestId("envelope-panel")).toHaveTextContent(
			"Envelope 2",
		);
	});

	it("routes each selected line to the Karpunk panel", () => {
		useSynthStore.getState().setLine2SynthesisMethod("karpunk");
		render(<ActivePhaseLinePanel lineIndex={2} section="algos" />);
		expect(screen.getByTestId("karpunk-panel")).toHaveTextContent("Karpunk 2");
	});
});
