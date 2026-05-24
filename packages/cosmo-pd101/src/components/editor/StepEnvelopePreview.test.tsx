import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StepEnvelopePreview } from "./StepEnvelopePreview";

const drawEnvPreview = vi.fn();
vi.mock("./stepEnvelopeGeometry", () => ({
	drawEnvPreview: (...args: unknown[]) => drawEnvPreview(...args),
	normalizeEnvelope: (env: unknown) => env,
}));

describe("StepEnvelopePreview", () => {
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
});
