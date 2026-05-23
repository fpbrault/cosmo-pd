import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RandomModule from "./RandomModule";

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: vi.fn(() => ({
		value: 0.5,
		setValue: vi.fn(),
	})),
}));

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: () => <div>Rate</div>,
}));

describe("RandomModule", () => {
	it("renders a disabled presets footer", () => {
		render(<RandomModule />);

		expect(
			screen.getByLabelText("Random Presets presets unavailable"),
		).toBeDisabled();
	});
});
