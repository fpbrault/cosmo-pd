import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import PerformanceControlsPanel from "./PerformanceControlsPanel";

vi.mock("@/components/panels/macro/MacroKnobsPanel", () => ({
	MacroKnob: ({ macroIndex }: { macroIndex: number }) => (
		<div>Macro {macroIndex + 1}</div>
	),
}));

vi.mock("./PerformanceSoundPanel", () => ({
	default: () => <div data-testid="mock-sound-panel">Sound controls</div>,
	CollapsedSoundSummary: ({ onExpand }: { onExpand: () => void }) => (
		<button type="button" onClick={onExpand} aria-label="Expand Sound section">
			Sound summary
		</button>
	),
}));

vi.mock("./PerformanceEnvelopePanel", () => ({
	default: () => <div data-testid="mock-envelope-panel">Envelope controls</div>,
	CollapsedEnvelopeSummary: ({ onExpand }: { onExpand: () => void }) => (
		<button
			type="button"
			onClick={onExpand}
			aria-label="Expand Envelope section"
		>
			Envelope summary
		</button>
	),
}));

describe("PerformanceControlsPanel", () => {
	beforeEach(() => {
		useSynthUiStore.setState({ simpleExpandedSection: "sound" });
	});

	it("shows exactly one expanded section and switches via the full-height summary", () => {
		render(<PerformanceControlsPanel />);
		const sectionRack = screen.getByTestId("simple-section-rack");

		expect(screen.getByTestId("mock-sound-panel")).toBeVisible();
		expect(sectionRack).toHaveClass("grid-cols-[minmax(0,1fr)_8.5rem_8.5rem]");
		expect(
			screen.getByRole("button", { name: "Expand Envelope section" }),
		).toBeVisible();
		expect(screen.getByTestId("simple-effects-summary")).toHaveClass("h-full");
		expect(screen.queryByTestId("simple-effects-panel")).toBeNull();

		fireEvent.click(
			screen.getByRole("button", { name: "Expand Envelope section" }),
		);
		expect(screen.getByTestId("mock-envelope-panel")).toBeVisible();
		expect(screen.queryByTestId("mock-sound-panel")).toBeNull();
		expect(useSynthUiStore.getState().simpleExpandedSection).toBe("envelope");
		expect(sectionRack).toHaveClass("grid-cols-[8.5rem_minmax(0,1fr)_8.5rem]");

		fireEvent.click(
			screen.getByRole("button", { name: "Expand Effects section" }),
		);
		expect(screen.getByTestId("simple-effects-panel")).toBeVisible();
		expect(screen.queryByTestId("mock-sound-panel")).toBeNull();
		expect(useSynthUiStore.getState().simpleExpandedSection).toBe("effects");
		expect(sectionRack).toHaveClass("grid-cols-[8.5rem_8.5rem_minmax(0,1fr)]");

		fireEvent.click(
			screen.getByRole("button", { name: "Expand Sound section" }),
		);
		expect(screen.getByTestId("mock-sound-panel")).toBeVisible();
	});
});
