export const SYNTH_RENDERER_DESIGN_HEIGHT = 912;
export const SYNTH_RENDERER_DESIGN_WIDTH = 1368;
export const SYNTH_RENDERER_MIN_ASPECT_RATIO = 4 / 3;
export const SYNTH_RENDERER_MAX_ASPECT_RATIO = 3 / 2;

type ComputeRendererFrameLayoutOptions = {
	availableWidth: number;
	availableHeight: number;
	targetAspectRatio?: number;
	outerPadding?: number;
	maxScale?: number;
};

export type RendererFrameLayout = {
	frameWidth: number;
	frameHeight: number;
	frameScale: number;
	effectiveAspectRatio: number;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

export function computeRendererFrameLayout({
	availableWidth,
	availableHeight,
	targetAspectRatio,
	outerPadding = 0,
	maxScale,
}: ComputeRendererFrameLayoutOptions): RendererFrameLayout | null {
	const paddedWidth = Math.max(availableWidth - outerPadding * 2, 0);
	const paddedHeight = Math.max(availableHeight - outerPadding * 2, 0);

	if (paddedWidth <= 0 || paddedHeight <= 0) {
		return null;
	}

	const measuredAspectRatio = paddedWidth / paddedHeight;
	const effectiveAspectRatio =
		targetAspectRatio ??
		clamp(
			measuredAspectRatio,
			SYNTH_RENDERER_MIN_ASPECT_RATIO,
			SYNTH_RENDERER_MAX_ASPECT_RATIO,
		);
	const frameHeight = SYNTH_RENDERER_DESIGN_HEIGHT;
	const frameWidth = frameHeight * effectiveAspectRatio;
	const uncappedScale = Math.min(
		paddedWidth / frameWidth,
		paddedHeight / frameHeight,
	);
	const frameScale =
		maxScale == null ? uncappedScale : Math.min(uncappedScale, maxScale);

	return {
		frameWidth,
		frameHeight,
		frameScale,
		effectiveAspectRatio,
	};
}
