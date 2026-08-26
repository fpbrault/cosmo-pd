import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import VoiceModeControl from "./VoiceModeControl";

const synthParams = vi.hoisted(() => ({
	polyMode: { value: "poly8", setValue: vi.fn() },
	portamentoEnabled: { value: false, setValue: vi.fn() },
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: (key: keyof typeof synthParams) => synthParams[key],
}));

describe("VoiceModeControl", () => {
	beforeEach(() => {
		synthParams.polyMode.value = "poly8";
		synthParams.polyMode.setValue.mockReset();
	});

	it("keeps the Advanced mode button labelled Mono and uses its LED state", () => {
		render(<VoiceModeControl />);
		const mono = screen.getByRole("button", { name: "Mono" });
		expect(mono).toHaveAttribute("aria-pressed", "false");
		expect(screen.queryByRole("button", { name: "Poly 8" })).toBeNull();

		fireEvent.click(mono);
		expect(synthParams.polyMode.setValue).toHaveBeenCalledWith("mono");
	});
});
