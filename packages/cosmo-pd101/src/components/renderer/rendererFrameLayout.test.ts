import { describe, expect, it } from "vitest";
import {
	computeRendererFrameLayout,
	computeSidebarMinWidthRem,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_MAX_ASPECT_RATIO,
	SYNTH_RENDERER_MIN_ASPECT_RATIO,
} from "./rendererFrameLayout";

describe("computeSidebarMinWidthRem", () => {
	it("returns the narrow width at 4:3", () => {
		expect(computeSidebarMinWidthRem(SYNTH_RENDERER_MIN_ASPECT_RATIO)).toBe(18);
	});

	it("returns the wide width at 3:2", () => {
		expect(computeSidebarMinWidthRem(SYNTH_RENDERER_MAX_ASPECT_RATIO)).toBe(21);
	});

	it("interpolates the midpoint", () => {
		const midpoint =
			(SYNTH_RENDERER_MIN_ASPECT_RATIO + SYNTH_RENDERER_MAX_ASPECT_RATIO) / 2;
		expect(computeSidebarMinWidthRem(midpoint)).toBeCloseTo(19.5, 5);
	});

	it("clamps outside the supported aspect range", () => {
		expect(computeSidebarMinWidthRem(1)).toBe(18);
		expect(computeSidebarMinWidthRem(2)).toBe(21);
	});
});

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
		expect(layout?.sidebarMinWidthRem).toBe(21);
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
