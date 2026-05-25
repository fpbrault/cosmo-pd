import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SynthParamSlider from "./SynthParamSlider";

const { mockUseSynthParamControl } = vi.hoisted(() => ({
	mockUseSynthParamControl: vi.fn(),
}));

vi.mock("@/components/controls/modulation/ModulatableControl", () => ({
	default: ({ children }: { children: ReactNode }) => (
		<div data-testid="modulatable-wrapper">{children}</div>
	),
}));

vi.mock("@/components/layout/HoverInfo", () => ({
	useHoverInfoHandlers: () => ({}),
}));

vi.mock("./synthParamControlShared", async () => {
	const actual = await vi.importActual<
		typeof import("./synthParamControlShared")
	>("./synthParamControlShared");
	return {
		...actual,
		useSynthParamControl: (options: unknown) =>
			mockUseSynthParamControl(options),
	};
});

describe("SynthParamSlider", () => {
	beforeEach(() => {
		mockUseSynthParamControl.mockReset();
		mockUseSynthParamControl.mockReturnValue({
			syncConfig: null,
			syncMode: false,
			syncTooltip: "",
			boundTooltip: "",
			valueFormatter: (value: number) => `${value.toFixed(1)}`,
			midiLearn: {
				onClick: vi.fn(),
				onContextMenu: vi.fn(),
				interactionLocked: false,
				midiLearnState: null,
			},
			displayedValue: 0,
			controlMin: -12,
			controlMax: 12,
			controlStep: 0.1,
			controlDefaultValue: 0,
			controlBipolar: true,
			controlCurve: "linear",
			modDestinationResolved: undefined,
			handleControlChange: vi.fn(),
			setSyncMode: vi.fn(),
		});
	});

	it("renders vertical slider semantics", () => {
		render(
			<SynthParamSlider
				paramKey="volume"
				orientation="vertical"
				label="80"
				showTicks
			/>,
		);

		expect(screen.getByRole("slider", { name: "80" })).toBeInTheDocument();
	});

	it("snaps to center when center detent is enabled", () => {
		const handleControlChange = vi.fn();
		mockUseSynthParamControl.mockReturnValue({
			syncConfig: null,
			syncMode: false,
			syncTooltip: "",
			boundTooltip: "",
			valueFormatter: (value: number) => `${value.toFixed(1)}`,
			midiLearn: {
				onClick: vi.fn(),
				onContextMenu: vi.fn(),
				interactionLocked: false,
				midiLearnState: null,
			},
			handleControlChange,
			displayedValue: 2,
			controlMin: -12,
			controlMax: 12,
			controlStep: 0.1,
			controlDefaultValue: 0,
			controlBipolar: true,
			controlCurve: "linear",
			modDestinationResolved: undefined,
			setSyncMode: vi.fn(),
		});

		render(
			<SynthParamSlider
				paramKey="volume"
				orientation="vertical"
				label="80"
				centerDetent
				centerDetentThreshold={0.5}
			/>,
		);

		const slider = screen.getByRole("slider", { name: "80" });
		fireEvent.keyDown(slider, { key: "ArrowDown" });
		expect(handleControlChange).toHaveBeenCalled();
	});

	it("uses fine adjust with shift key", () => {
		const handleControlChange = vi.fn();
		mockUseSynthParamControl.mockReturnValue({
			syncConfig: null,
			syncMode: false,
			syncTooltip: "",
			boundTooltip: "",
			valueFormatter: (value: number) => `${value.toFixed(1)}`,
			midiLearn: {
				onClick: vi.fn(),
				onContextMenu: vi.fn(),
				interactionLocked: false,
				midiLearnState: null,
			},
			handleControlChange,
			displayedValue: 0,
			controlMin: -12,
			controlMax: 12,
			controlStep: 1,
			controlDefaultValue: 0,
			controlBipolar: true,
			controlCurve: "linear",
			modDestinationResolved: undefined,
			setSyncMode: vi.fn(),
		});

		render(
			<SynthParamSlider paramKey="volume" orientation="vertical" label="80" />,
		);

		fireEvent.keyDown(screen.getByRole("slider", { name: "80" }), {
			key: "ArrowUp",
			shiftKey: true,
		});
		expect(handleControlChange).toHaveBeenCalledWith(0);
	});

	it("wraps in modulation wrapper when destination exists", () => {
		mockUseSynthParamControl.mockReturnValue({
			syncConfig: null,
			syncMode: false,
			syncTooltip: "",
			boundTooltip: "",
			valueFormatter: (value: number) => `${value.toFixed(1)}`,
			midiLearn: {
				onClick: vi.fn(),
				onContextMenu: vi.fn(),
				interactionLocked: false,
				midiLearnState: null,
			},
			displayedValue: 0,
			controlMin: -12,
			controlMax: 12,
			controlStep: 0.1,
			controlDefaultValue: 0,
			controlBipolar: true,
			controlCurve: "linear",
			modDestinationResolved: "eqGain80",
			handleControlChange: vi.fn(),
			setSyncMode: vi.fn(),
		});
		render(<SynthParamSlider paramKey="volume" orientation="vertical" />);
		expect(screen.getByTestId("modulatable-wrapper")).toBeInTheDocument();
	});
});
