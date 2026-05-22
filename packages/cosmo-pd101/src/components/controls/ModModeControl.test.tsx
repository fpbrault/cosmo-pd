import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ModModeControl from "./ModModeControl";

const useSynthParamMock = vi.fn();

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: (...args: unknown[]) => useSynthParamMock(...args),
}));

describe("ModModeControl", () => {
	beforeEach(() => {
		useSynthParamMock.mockReset();
	});

	it("renders modulation mode buttons", () => {
		useSynthParamMock.mockImplementation((key: string) =>
			key === "lineSelect"
				? { value: "L1+L2'" }
				: { value: "normal", setValue: vi.fn() },
		);
		render(<ModModeControl />);

		expect(screen.getByText("Modulation")).toBeInTheDocument();
		expect(screen.getAllByRole("button")).toHaveLength(3);
	});

	it("calls setValue when selecting a mode", () => {
		const setValue = vi.fn();
		useSynthParamMock.mockImplementation((key: string) =>
			key === "lineSelect"
				? { value: "L1+L2'" }
				: { value: "normal", setValue },
		);
		render(<ModModeControl />);

		fireEvent.click(screen.getAllByRole("button")[2]);
		expect(setValue).toHaveBeenCalledWith("noise");
	});

	it("marks active mode button", () => {
		useSynthParamMock.mockImplementation((key: string) =>
			key === "lineSelect"
				? { value: "L1+L2'" }
				: { value: "ring", setValue: vi.fn() },
		);
		render(<ModModeControl />);

		expect(screen.getAllByRole("button")[1].className).toContain(
			"text-cz-cream",
		);
		expect(screen.getAllByRole("button")[0].className).toContain(
			"text-cz-cream-dim",
		);
	});

	it("disables ring and noise for single-line selection", () => {
		useSynthParamMock.mockImplementation((key: string) =>
			key === "lineSelect"
				? { value: "L1" }
				: { value: "normal", setValue: vi.fn() },
		);
		render(<ModModeControl />);

		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).not.toBeDisabled();
		expect(buttons[1]).toBeDisabled();
		expect(buttons[2]).toBeDisabled();
	});

	it("keeps ring and noise enabled for dual-line selection", () => {
		useSynthParamMock.mockImplementation((key: string) =>
			key === "lineSelect"
				? { value: "L1+L1'" }
				: { value: "normal", setValue: vi.fn() },
		);
		render(<ModModeControl />);

		const buttons = screen.getAllByRole("button");
		expect(buttons[1]).not.toBeDisabled();
		expect(buttons[2]).not.toBeDisabled();
	});
});
