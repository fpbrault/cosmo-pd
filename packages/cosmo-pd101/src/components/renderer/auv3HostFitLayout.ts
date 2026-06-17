export const AUV3_RENDERER_MIN_WIDTH = 640;
export const AUV3_RENDERER_MIN_HEIGHT = 480;
export const AUV3_RENDERER_NATURAL_HEIGHT = 912;
export const AUV3_FALLBACK_ASPECT_RATIO = 4 / 3;

export type Auv3HostFitLayout = {
	aspectRatio: number;
	naturalWidth: number;
	naturalHeight: number;
	scale: number;
	scaledWidth: number;
	scaledHeight: number;
	offsetX: number;
	offsetY: number;
};

type ComputeAuv3HostFitLayoutOptions = {
	hostWidth: number;
	hostHeight: number;
	deviceLandscapeAspectRatio: number;
	minWidth?: number;
	minHeight?: number;
	naturalHeight?: number;
	maxScale?: number;
};

function safePositive(value: number, fallback: number) {
	return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function computeAuv3HostFitLayout({
	hostWidth,
	hostHeight,
	deviceLandscapeAspectRatio,
	minWidth = AUV3_RENDERER_MIN_WIDTH,
	minHeight = AUV3_RENDERER_MIN_HEIGHT,
	naturalHeight = AUV3_RENDERER_NATURAL_HEIGHT,
	maxScale = Number.POSITIVE_INFINITY,
}: ComputeAuv3HostFitLayoutOptions): Auv3HostFitLayout | null {
	const safeHostWidth = safePositive(hostWidth, 0);
	const safeHostHeight = safePositive(hostHeight, 0);
	if (safeHostWidth <= 0 || safeHostHeight <= 0) {
		return null;
	}

	const aspectRatio = safePositive(
		deviceLandscapeAspectRatio,
		AUV3_FALLBACK_ASPECT_RATIO,
	);
	const frameHeight = Math.max(
		minHeight,
		safePositive(naturalHeight, minHeight),
	);
	const frameWidth = Math.max(minWidth, frameHeight * aspectRatio);
	const resolvedMaxScale = maxScale > 0 ? maxScale : 1;
	const scale = Math.min(
		safeHostWidth / frameWidth,
		safeHostHeight / frameHeight,
		resolvedMaxScale,
	);
	const scaledWidth = frameWidth * scale;
	const scaledHeight = frameHeight * scale;

	return {
		aspectRatio,
		naturalWidth: frameWidth,
		naturalHeight: frameHeight,
		scale,
		scaledWidth,
		scaledHeight,
		offsetX: Math.max((safeHostWidth - scaledWidth) / 2, 0),
		offsetY: Math.max((safeHostHeight - scaledHeight) / 2, 0),
	};
}
