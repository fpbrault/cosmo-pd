import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CompactRoutingControls from "./CompactRoutingControls";

const synthParams = vi.hoisted(() => ({
	lineSelect: { value: "L1+L2'", setValue: vi.fn() },
	modMode: { value: "ring", setValue: vi.fn() },
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: (key: keyof typeof synthParams) => synthParams[key],
}));

describe("CompactRoutingControls", () => {
	beforeEach(() => {
		synthParams.lineSelect.value = "L1+L2'";
		synthParams.modMode.value = "ring";
		synthParams.lineSelect.setValue.mockReset();
		synthParams.modMode.setValue.mockReset();
	});

	it("selects routing values from compact popovers", () => {
		render(<CompactRoutingControls />);

		fireEvent.click(screen.getByRole("button", { name: /line select:/i }));
		fireEvent.click(screen.getByRole("button", { name: "L1" }));
		expect(synthParams.lineSelect.setValue).toHaveBeenCalledWith("L1");

		fireEvent.click(screen.getByRole("button", { name: /line mod:/i }));
		fireEvent.click(screen.getByRole("button", { name: "Noise" }));
		expect(synthParams.modMode.setValue).toHaveBeenCalledWith("noise");
	});

	it("disables dual-line modulation for a single line", () => {
		synthParams.lineSelect.value = "L1";
		synthParams.modMode.value = "normal";
		render(<CompactRoutingControls />);

		fireEvent.click(screen.getByRole("button", { name: /line mod:/i }));
		expect(screen.getByRole("button", { name: "Ring" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Noise" })).toBeDisabled();
	});
});
