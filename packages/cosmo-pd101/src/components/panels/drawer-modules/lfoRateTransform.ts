const LFO_RATE_MAX_HZ = 200;
const LFO_RATE_EXPONENT = 5.643856189774724; // 50% travel ~= 4Hz

function normToLfoRate(norm: number): number {
	return LFO_RATE_MAX_HZ * Math.max(0, Math.min(1, norm)) ** LFO_RATE_EXPONENT;
}

function lfoRateToNorm(hz: number): number {
	if (hz <= 0) {
		return 0;
	}
	return Math.max(
		0,
		Math.min(1, (hz / LFO_RATE_MAX_HZ) ** (1 / LFO_RATE_EXPONENT)),
	);
}

function formatCompactValue(value: number): string {
	if (!Number.isFinite(value) || value <= 0) {
		return "0";
	}
	if (value >= 100) {
		return value.toFixed(0);
	}
	if (value >= 10) {
		return value.toFixed(1);
	}
	if (value >= 1) {
		return value.toFixed(2);
	}
	return value.toFixed(3);
}

export const LFO_RATE_TRANSFORM = {
	toControlValue: lfoRateToNorm,
	fromControlValue: normToLfoRate,
	min: 0,
	max: 1,
	defaultValue: lfoRateToNorm(2),
	valueFormatter: (_controlValue: number, engineValue: number) =>
		`${formatCompactValue(engineValue)}Hz`,
} as const;
