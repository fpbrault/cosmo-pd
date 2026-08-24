export type VisualizationCanvasTarget = {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	width: number;
	height: number;
	pixelWidth: number;
	pixelHeight: number;
	scaleX: number;
	scaleY: number;
};

export function calculateCanvasBackingSize({
	clientWidth,
	clientHeight,
	visibleWidth,
	visibleHeight,
	devicePixelRatio,
	maxPixelRatio,
}: {
	clientWidth: number;
	clientHeight: number;
	visibleWidth: number;
	visibleHeight: number;
	devicePixelRatio: number;
	maxPixelRatio: number;
}): { width: number; height: number } {
	const ratio = Math.max(1, Math.min(devicePixelRatio, maxPixelRatio));
	const renderedWidth = visibleWidth > 0 ? visibleWidth : clientWidth;
	const renderedHeight = visibleHeight > 0 ? visibleHeight : clientHeight;
	return {
		width: Math.max(1, Math.round(Math.max(1, renderedWidth) * ratio)),
		height: Math.max(1, Math.round(Math.max(1, renderedHeight) * ratio)),
	};
}

export function prepareVisualizationCanvas(
	canvas: HTMLCanvasElement,
	maxPixelRatio: number,
): VisualizationCanvasTarget | null {
	const context = canvas.getContext("2d");
	if (!context) return null;

	const width = Math.max(1, Math.floor(canvas.clientWidth));
	const height = Math.max(1, Math.floor(canvas.clientHeight));
	const bounds = canvas.getBoundingClientRect();
	const backingSize = calculateCanvasBackingSize({
		clientWidth: width,
		clientHeight: height,
		visibleWidth: bounds.width,
		visibleHeight: bounds.height,
		devicePixelRatio: window.devicePixelRatio || 1,
		maxPixelRatio,
	});

	if (
		canvas.width !== backingSize.width ||
		canvas.height !== backingSize.height
	) {
		canvas.width = backingSize.width;
		canvas.height = backingSize.height;
	}

	const scaleX = backingSize.width / width;
	const scaleY = backingSize.height / height;
	context.setTransform(scaleX, 0, 0, scaleY, 0, 0);

	return {
		canvas,
		context,
		width,
		height,
		pixelWidth: backingSize.width,
		pixelHeight: backingSize.height,
		scaleX,
		scaleY,
	};
}
