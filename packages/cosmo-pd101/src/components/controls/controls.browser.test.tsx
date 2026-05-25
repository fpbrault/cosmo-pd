import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ControlKnob from "./ControlKnob";
import LineSelectControl from "./LineSelectControl";
import ModModeControl from "./ModModeControl";

const useSynthParamMock = vi.fn();
const useOptionalSynthControllerMock = vi.fn();

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: (...args: unknown[]) => useSynthParamMock(...args),
	useOptionalSynthController: () => useOptionalSynthControllerMock(),
}));

vi.mock("@/components/controls/modulation/ModulatableControl", () => ({
	default: ({ children }: { children: ReactNode }) => (
		<div data-testid="modulatable-wrapper">{children}</div>
	),
}));

describe("core controls (browser)", () => {
	beforeEach(() => {
		useSynthParamMock.mockReset();
		useOptionalSynthControllerMock.mockReset();
		useOptionalSynthControllerMock.mockReturnValue(null);
	});

	it("renders and updates LineSelectControl", () => {
		const setValue = vi.fn();
		useSynthParamMock.mockReturnValue({ value: "L1", setValue });
		render(<LineSelectControl />);

		expect(screen.getAllByRole("button")).toHaveLength(4);
		fireEvent.click(screen.getAllByRole("button")[2]);
		expect(setValue).toHaveBeenCalledWith("L1+L1'");
	});

	it("renders and updates ModModeControl", () => {
		const setValue = vi.fn();
		useSynthParamMock.mockImplementation((key: string) =>
			key === "lineSelect"
				? { value: "L1+L2'" }
				: { value: "normal", setValue },
		);
		render(<ModModeControl />);

		fireEvent.click(screen.getAllByRole("button")[1]);
		expect(setValue).toHaveBeenCalledWith("ring");
	});

	it("supports ControlKnob value editing", async () => {
		const onChange = vi.fn();
		render(
			<ControlKnob
				value={0.25}
				onChange={onChange}
				label="Cutoff"
				min={0}
				max={1}
				valueVisibility="always"
			/>,
		);

		const button = await screen.findByRole("button", { name: "Cutoff value" });
		fireEvent.doubleClick(button);
		const input = screen.getByRole("textbox", { name: "Cutoff value" });
		fireEvent.change(input, { target: { value: "0.75" } });
		fireEvent.keyDown(input, { key: "Enter" });
		expect(onChange).toHaveBeenCalledWith(0.75);
	});

	it("parses percent-formatted manual input using displayed units", async () => {
		const onChange = vi.fn();
		render(
			<ControlKnob
				value={0.4}
				onChange={onChange}
				label="Mix"
				min={0}
				max={1}
				valueVisibility="always"
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>,
		);

		const button = await screen.findByRole("button", { name: "Mix value" });
		fireEvent.doubleClick(button);
		const input = screen.getByRole("textbox", { name: "Mix value" });
		fireEvent.change(input, { target: { value: "40" } });
		fireEvent.keyDown(input, { key: "Enter" });
		expect(onChange).toHaveBeenCalledWith(0.4);
	});
});
