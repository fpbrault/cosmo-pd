import { describe, expect, it } from "vitest";
import {
	computeRendererFrameLayout,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_MAX_ASPECT_RATIO,
} from "./rendererFrameLayout";

describe("computeRendererFrameLayout", () => {
	it("uses the fixed target aspect ratio when provided", () => {
		const layout = computeRendererFrameLayout({
			availableWidth: 1600,
			availableHeight: 1200,
			targetAspectRatio: SYNTH_RENDERER_MAX_ASPECT_RATIO,
		});

		expect(layout).not.toBeNull();
		expect(layout?.effectiveAspectRatio).toBe(SYNTH_RENDERER_MAX_ASPECT_RATIO);
		expect(layout?.frameWidth).toBe(
			SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MAX_ASPECT_RATIO,
		);
	});

	it("clamps measured aspect ratio when no fixed target is provided", () => {
		const layout = computeRendererFrameLayout({
			availableWidth: 2000,
			availableHeight: 900,
		});

		expect(layout?.effectiveAspectRatio).toBe(SYNTH_RENDERER_MAX_ASPECT_RATIO);
	});

	it("applies outer padding before fitting", () => {
		const layout = computeRendererFrameLayout({
			availableWidth: 1600,
			availableHeight: 1200,
			targetAspectRatio: SYNTH_RENDERER_MAX_ASPECT_RATIO,
			outerPadding: 30,
		});

		const expectedFrameWidth =
			SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MAX_ASPECT_RATIO;
		const expectedScale = Math.min(
			(1600 - 60) / expectedFrameWidth,
			1140 / 912,
		);

		expect(layout?.frameScale).toBeCloseTo(expectedScale, 5);
	});

	it("caps scale when requested", () => {
		const layout = computeRendererFrameLayout({
			availableWidth: 3000,
			availableHeight: 3000,
			targetAspectRatio: SYNTH_RENDERER_MAX_ASPECT_RATIO,
			maxScale: 0.85,
		});

		expect(layout?.frameScale).toBe(0.85);
	});
});
