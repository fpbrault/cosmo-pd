import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GlobalVoicePanel from "./GlobalVoicePanel";

const useSynthParamMock = vi.fn();

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: (key: string) => useSynthParamMock(key),
}));

describe("GlobalVoicePanel", () => {
	const setters = new Map<string, ReturnType<typeof vi.fn>>();
	const values = new Map<string, unknown>();

	beforeEach(() => {
		setters.clear();
		values.clear();
		values.set("tempoBpm", 120);
		useSynthParamMock.mockImplementation((key: string) => {
			const setValue = vi.fn();
			setters.set(key, setValue);
			return { value: values.get(key), setValue };
		});
	});

	it("renders transport and voice allocation settings", () => {
		render(<GlobalVoicePanel />);

		expect(
			screen.getByText("Transport", { selector: "legend" }),
		).toBeInTheDocument();
		expect(
			screen.getByText("Voice Allocation", { selector: "legend" }),
		).toBeInTheDocument();
		expect(screen.getByRole("spinbutton")).toHaveValue(120);
		expect(
			screen.getByRole("combobox", { name: "Voice limit: 8" }),
		).toBeInTheDocument();
	});

	it("does not render preset-specific voice controls", () => {
		render(<GlobalVoicePanel />);

		expect(screen.queryByText("Portamento")).not.toBeInTheDocument();
		expect(screen.queryByText("Pitch Bend")).not.toBeInTheDocument();
		expect(screen.queryByText("Expression")).not.toBeInTheDocument();
		expect(screen.queryByText("Vel Curve")).not.toBeInTheDocument();
		expect(setters.has("portamentoMode")).toBe(false);
		expect(setters.has("portamentoRate")).toBe(false);
		expect(setters.has("portamentoTime")).toBe(false);
		expect(setters.has("pitchBendRange")).toBe(false);
		expect(setters.has("velocityCurve")).toBe(false);
	});
});
