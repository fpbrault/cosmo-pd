import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StepEnvelopePreview } from "./StepEnvelopePreview";

const drawEnvPreview = vi.fn();
const disconnect = vi.fn();
let resizeCallback: ResizeObserverCallback | undefined;

vi.mock("./stepEnvelopeGeometry", () => ({
	drawEnvPreview: (...args: unknown[]) => drawEnvPreview(...args),
	normalizeEnvelope: (env: unknown) => env,
}));

describe("StepEnvelopePreview", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
		resizeCallback = undefined;
	});

	it("draws preview and handles click", () => {
		const onClick = vi.fn();
		render(
			<StepEnvelopePreview
				env={{ steps: [], sustainStep: 0, stepCount: 0, loop: false }}
				color="#fff"
				title="DCO"
				onClick={onClick}
			/>,
		);
		expect(drawEnvPreview).toHaveBeenCalled();
		fireEvent.click(screen.getByRole("button", { name: "Show DCO envelope" }));
		expect(onClick).toHaveBeenCalled();
	});

	it("redraws when the hidden preview becomes visible", () => {
		vi.stubGlobal(
			"ResizeObserver",
			class {
				constructor(callback: ResizeObserverCallback) {
					resizeCallback = callback;
				}
				observe() {}
				disconnect() {
					disconnect();
				}
			},
		);

		const { unmount } = render(
			<StepEnvelopePreview
				env={{ steps: [], sustainStep: 0, stepCount: 0, loop: false }}
				color="#fff"
				title="DCO"
				onClick={vi.fn()}
			/>,
		);
		drawEnvPreview.mockClear();

		resizeCallback?.([], {} as ResizeObserver);

		expect(drawEnvPreview).toHaveBeenCalledOnce();
		unmount();
		expect(disconnect).toHaveBeenCalledOnce();
	});
});
