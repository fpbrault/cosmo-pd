import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PresetVoiceSettingsPanel from "./PresetVoiceSettingsPanel";

const useSynthParamMock = vi.fn();

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: (key: string) => useSynthParamMock(key),
}));

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: ({
		label,
		onChange,
		paramKey,
	}: {
		label?: string;
		onChange?: (value: number) => void;
		paramKey: string;
	}) => (
		<button
			type="button"
			data-testid={`knob-${paramKey}`}
			onClick={() => onChange?.(0.75)}
		>
			{label}
		</button>
	),
}));

describe("PresetVoiceSettingsPanel", () => {
	const setters = new Map<string, ReturnType<typeof vi.fn>>();
	const values = new Map<string, unknown>();

	beforeEach(() => {
		setters.clear();
		values.clear();
		values.set("velocityCurve", 0.2);
		values.set("pitchBendRange", 7);
		values.set("portamentoMode", "rate");
		values.set("portamentoRate", 50);
		values.set("portamentoTime", 0.5);
		useSynthParamMock.mockImplementation((key: string) => {
			const setValue = vi.fn();
			setters.set(key, setValue);
			return { value: values.get(key), setValue };
		});
	});

	it("renders preset-owned voice controls with their synth param keys", () => {
		render(<PresetVoiceSettingsPanel />);

		expect(screen.getByText("Preset Voice")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Rate" })).toBeInTheDocument();
		expect(screen.getByTestId("knob-portamentoRate")).toHaveTextContent(
			"Porta",
		);
		expect(screen.getByTestId("knob-pitchBendRange")).toHaveTextContent("Bend");
		expect(screen.getByTestId("knob-velocityCurve")).toHaveTextContent("Vel");
		expect(
			screen.getByLabelText("Velocity curve preview. Curve value: 0.20"),
		).toBeInTheDocument();
	});

	it("switches portamento mode and renders the active amount control", () => {
		render(<PresetVoiceSettingsPanel />);

		fireEvent.click(screen.getByRole("button", { name: "Rate" }));
		expect(setters.get("portamentoMode")).toHaveBeenCalledWith("time");
		fireEvent.click(screen.getByTestId("knob-portamentoRate"));
		expect(setters.get("portamentoRate")).toHaveBeenCalledWith(0.75);

		values.set("portamentoMode", "time");
		render(<PresetVoiceSettingsPanel />);

		expect(screen.getByRole("button", { name: "Time" })).toBeInTheDocument();
		expect(screen.getByTestId("knob-portamentoTime")).toHaveTextContent(
			"Porta",
		);
	});
});
