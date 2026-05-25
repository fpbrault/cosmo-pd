import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SynthParamSlider from "./SynthParamSlider";

const { mockUseSynthParamControl, mockHandleControlChange } = vi.hoisted(
	() => ({
		mockUseSynthParamControl: vi.fn(),
		mockHandleControlChange: vi.fn(),
	}),
);

vi.mock("@/components/layout/HoverInfo", () => ({
	useHoverInfoHandlers: () => ({}),
}));

vi.mock("./synthParamControlShared", async () => {
	const actual = await vi.importActual<
		typeof import("./synthParamControlShared")
	>("./synthParamControlShared");
	return {
		...actual,
		useSynthParamControl: () => mockUseSynthParamControl(),
	};
});

describe("SynthParamSlider (browser)", () => {
	beforeEach(() => {
		mockHandleControlChange.mockReset();
		mockUseSynthParamControl.mockReset();
		mockUseSynthParamControl.mockReturnValue({
			syncConfig: null,
			syncMode: false,
			syncTooltip: "",
			boundTooltip: "",
			valueFormatter: (value: number) => `${value.toFixed(2)}`,
			midiLearn: {
				onClick: vi.fn(),
				onContextMenu: vi.fn(),
				interactionLocked: false,
				midiLearnState: null,
			},
			displayedValue: 0.5,
			controlMin: 0,
			controlMax: 1,
			controlStep: 0.1,
			controlDefaultValue: 0.5,
			controlBipolar: false,
			controlCurve: "linear",
			modDestinationResolved: undefined,
			handleControlChange: mockHandleControlChange,
			setSyncMode: vi.fn(),
		});
	});

	it("supports keyboard interaction for horizontal slider", () => {
		render(
			<SynthParamSlider
				paramKey="algoBlendA"
				orientation="horizontal"
				label="Morph"
			/>,
		);

		const slider = screen.getByRole("slider", { name: "Morph" });
		fireEvent.keyDown(slider, { key: "ArrowRight" });
		expect(mockHandleControlChange).toHaveBeenCalled();
	});

	it("supports wheel interaction for vertical slider", () => {
		render(
			<SynthParamSlider paramKey="volume" orientation="vertical" label="80" />,
		);

		const slider = screen.getByRole("slider", { name: "80" });
		fireEvent.wheel(slider, { deltaY: -100 });
		expect(mockHandleControlChange).toHaveBeenCalled();
	});
});
