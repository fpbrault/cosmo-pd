export const AUV3_VERTICAL_SCROLL_SLOP_PX = 8;

export function isAuv3HostedRuntime(): boolean {
	if (typeof window === "undefined") return false;
	const hostWindow = window as Window & {
		__czHostPlatform?: "ios" | "macos";
		__czAuv3FitMode?: "fit-bounds" | "fit-width";
	};
	return (
		hostWindow.__czHostPlatform === "ios" &&
		hostWindow.__czAuv3FitMode === "fit-width"
	);
}

export function hasGestureExceededSlop(
	deltaX: number,
	deltaY: number,
): boolean {
	return Math.hypot(deltaX, deltaY) >= AUV3_VERTICAL_SCROLL_SLOP_PX;
}

export function isMostlyVerticalGesture(
	deltaX: number,
	deltaY: number,
): boolean {
	return Math.abs(deltaY) > Math.abs(deltaX);
}
