import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RandomModule from "./RandomModule";

const mocks = vi.hoisted(() => ({
	useOptionalSynthController: vi.fn(),
	useSynthParam: vi.fn(),
	registerLiveModSourcesConsumer: vi.fn(() => vi.fn()),
	getLiveSources: vi.fn(() => ({
		random: 0,
	})),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: { title?: string }) => {
			if (key === "modulePreset.unavailableAria") {
				return `${options?.title ?? ""} presets unavailable`;
			}
			return (
				{
					"randomModule.title": "Random",
					"randomModule.displayTitle": "Random sample-and-hold preview",
					"randomModule.rate": "Rate",
					"modulePreset.presets": "Presets",
				}[key] ?? key
			);
		},
	}),
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	useOptionalSynthController: mocks.useOptionalSynthController,
	useSynthParam: mocks.useSynthParam,
}));

vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: () => <div>Rate</div>,
}));

describe("RandomModule", () => {
	beforeEach(() => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 1),
		);
		vi.stubGlobal("cancelAnimationFrame", vi.fn());
		mocks.useSynthParam.mockReturnValue({
			value: 0.5,
			setValue: vi.fn(),
		});
		mocks.getLiveSources.mockReturnValue({
			random: 0,
		});
		mocks.useOptionalSynthController.mockReturnValue({
			registerLiveModSourcesConsumer: mocks.registerLiveModSourcesConsumer,
			getLiveSources: mocks.getLiveSources,
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it("renders a disabled presets footer", () => {
		render(<RandomModule />);

		expect(
			screen.getByLabelText("Random Presets presets unavailable"),
		).toBeDisabled();
	});

	it("renders the random sample-and-hold display", () => {
		render(<RandomModule />);

		expect(
			screen.getByText("Random sample-and-hold preview"),
		).toBeInTheDocument();
		expect(screen.getByTestId("random-display")).toHaveAttribute(
			"data-live",
			"false",
		);
	});

	it("updates the display from runtime random telemetry", () => {
		render(<RandomModule />);

		act(() => {
			window.dispatchEvent(
				new CustomEvent("cz-runtime-mod-sources", {
					detail: {
						random: 0.42,
					},
				}),
			);
		});

		expect(screen.getByTestId("random-display")).toHaveAttribute(
			"data-current-value",
			"0.4200",
		);
		expect(screen.getByTestId("random-display")).toHaveAttribute(
			"data-live",
			"true",
		);
	});
});
