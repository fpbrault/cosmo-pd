import { fireEvent, render, screen, within } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GlobalVoicePanel from "./GlobalVoicePanel";

const useSynthParamMock = vi.fn();

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: (key: string) => useSynthParamMock(key),
}));

const { MockSynthParamKnob } = vi.hoisted(() => {
	const MockSynthParamKnob = ({
		label,
		paramKey,
	}: {
		label?: string;
		paramKey?: string;
	}) => <div data-testid={`knob-${paramKey ?? label}`}>{label}</div>;
	return { MockSynthParamKnob };
});

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: MockSynthParamKnob,
}));

vi.mock("@/components/controls/Button", () => ({
	default: ({
		children,
		onClick,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
	}) => (
		<button type="button" onClick={onClick}>
			{children}
		</button>
	),
}));

describe("GlobalVoicePanel", () => {
	const setters = new Map<string, ReturnType<typeof vi.fn>>();
	const values = new Map<string, unknown>();

	beforeEach(() => {
		setters.clear();
		values.clear();
		values.set("polyMode", "poly8");
		values.set("velocityCurve", 0);
		values.set("pitchBendRange", 2);
		values.set("portamentoEnabled", false);
		values.set("portamentoMode", "rate");
		values.set("portamentoRate", 50);
		values.set("portamentoTime", 0.5);
		useSynthParamMock.mockImplementation((key: string) => {
			const setValue = vi.fn();
			setters.set(key, setValue);
			return { value: values.get(key), setValue };
		});
	});

	it("groups portamento and bend range controls", () => {
		render(<GlobalVoicePanel />);
		const portamentoSection = screen.getByText("Portamento").parentElement;

		expect(screen.getByText("Portamento")).toBeInTheDocument();
		expect(portamentoSection).not.toBeNull();
		// The portamento mode toggle shows "● Rate" when in rate mode
		expect(
			within(portamentoSection as HTMLElement).getByRole("button", {
				name: "● Rate",
			}),
		).toBeInTheDocument();
		expect(screen.getByTestId("knob-portamentoRate")).toBeInTheDocument();
		expect(screen.getByTestId("knob-pitchBendRange")).toBeInTheDocument();
	});

	it("does not render master volume or mod wheel vibrato controls", () => {
		render(<GlobalVoicePanel />);

		expect(screen.queryByText("Volume")).not.toBeInTheDocument();
		expect(screen.queryByText("Mod→Vib")).not.toBeInTheDocument();
	});

	it("updates portamento controls", () => {
		render(<GlobalVoicePanel />);
		const portamentoSection = screen.getByText("Portamento").parentElement;

		expect(portamentoSection).not.toBeNull();
		// Click the mode toggle (currently showing "● Rate") to switch to time
		fireEvent.click(
			within(portamentoSection as HTMLElement).getByRole("button", {
				name: "● Rate",
			}),
		);

		expect(setters.get("portamentoMode")).toHaveBeenCalledWith("time");
	});
});
