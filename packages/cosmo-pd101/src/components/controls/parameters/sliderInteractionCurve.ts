export type SliderCurveMode = "linear" | "fine" | "ultrafine";

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function resolveCurveStrength(mode: SliderCurveMode): number {
	switch (mode) {
		case "ultrafine":
			return 0.15;
		case "fine":
			return 0.35;
		default:
			return 1;
	}
}

export function mapPointerDeltaWithCurve({
	startValue,
	deltaPx,
	trackPx,
	curveMode,
	min,
	max,
}: {
	startValue: number;
	deltaPx: number;
	trackPx: number;
	curveMode: SliderCurveMode;
	min: number;
	max: number;
}): number {
	const safeTrackPx = Math.max(trackPx, 1);
	const range = max - min;
	const strength = resolveCurveStrength(curveMode);
	return clamp(
		startValue + (deltaPx / safeTrackPx) * range * strength,
		min,
		max,
	);
}

/**
 * Pointer/touch helper: instead of snapping immediately to the absolute track
 * position, blend toward it based on curve mode to allow finer control.
 */
export function mapPointerValueWithCurve({
	absoluteValue,
	currentValue,
	curveMode,
	min,
	max,
}: {
	absoluteValue: number;
	currentValue: number;
	curveMode: SliderCurveMode;
	min: number;
	max: number;
}): number {
	const strength = resolveCurveStrength(curveMode);
	if (strength >= 1) {
		return clamp(absoluteValue, min, max);
	}

	return clamp(
		currentValue + (absoluteValue - currentValue) * strength,
		min,
		max,
	);
}
