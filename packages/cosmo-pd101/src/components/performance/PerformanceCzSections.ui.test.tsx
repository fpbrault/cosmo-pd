import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PerformanceDetuneSection from "./PerformanceDetuneSection";
import PerformanceRoutingSection from "./PerformanceRoutingSection";
import PerformanceVoiceSection from "./PerformanceVoiceSection";

const synthParams = vi.hoisted(() => ({
	lineSelect: { value: "L1+L2'", setValue: vi.fn() },
	modMode: { value: "normal", setValue: vi.fn() },
	polyMode: { value: "poly8", setValue: vi.fn() },
	portamentoEnabled: { value: false, setValue: vi.fn() },
	portamentoMode: { value: "time", setValue: vi.fn() },
	portamentoRate: { value: 1, setValue: vi.fn() },
	portamentoTime: { value: 0.5, setValue: vi.fn() },
	line2DetuneOctave: { value: 0, setValue: vi.fn() },
	line2DetuneNote: { value: 0, setValue: vi.fn() },
	line2DetuneFine: { value: 0, setValue: vi.fn() },
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: (key: keyof typeof synthParams) => synthParams[key],
}));

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: ({ label }: { label?: string }) => (
		<input type="range" aria-label={label} />
	),
}));

describe("Simple CZ hardware controls", () => {
	beforeEach(() => {
		synthParams.lineSelect.value = "L1+L2'";
		synthParams.modMode.value = "normal";
		synthParams.portamentoMode.value = "time";
		for (const param of Object.values(synthParams)) param.setValue.mockReset();
	});

	it("cycles line select in CZ panel order", () => {
		render(<PerformanceRoutingSection embedded />);
		fireEvent.click(screen.getByRole("button", { name: "Line Select: 1+2′" }));
		expect(synthParams.lineSelect.setValue).toHaveBeenCalledWith("L1+L1'");
	});

	it("disables Detune for single-line modes", () => {
		synthParams.lineSelect.value = "L1";
		render(<PerformanceDetuneSection embedded />);
		expect(screen.getByRole("button", { name: "Detune" })).toBeDisabled();
	});

	it("opens Detune as three horizontal knob controls", () => {
		render(<PerformanceDetuneSection embedded />);
		fireEvent.click(screen.getByRole("button", { name: "Detune" }));
		const dialog = screen.getByRole("dialog", { name: "Detune" });
		expect(within(dialog).getByRole("slider", { name: "Oct" })).toBeVisible();
		expect(within(dialog).getByRole("slider", { name: "Note" })).toBeVisible();
		expect(within(dialog).getByRole("slider", { name: "Fine" })).toBeVisible();
	});

	it("uses one CZ selector and a knob in the portamento popover", () => {
		render(<PerformanceVoiceSection embedded />);
		fireEvent.click(screen.getByRole("button", { name: "Portamento time" }));
		const dialog = screen.getByRole("dialog", { name: "Portamento time" });
		fireEvent.click(
			within(dialog).getByRole("button", { name: "Portamento time: Time" }),
		);
		expect(synthParams.portamentoMode.setValue).toHaveBeenCalledWith("rate");
		expect(within(dialog).getByRole("slider", { name: "Time" })).toBeVisible();
	});
});
