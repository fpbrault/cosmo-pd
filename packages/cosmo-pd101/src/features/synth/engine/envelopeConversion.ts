export type EnvelopeKind = "dco" | "dcw" | "dca";

function clampRounded(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, Math.round(value)));
}

export function rawRateToHuman(kind: EnvelopeKind, raw: number): number {
	const b = clampRounded(raw, 0, 127);
	switch (kind) {
		case "dco":
			if (b === 0) return 0;
			if (b === 127) return 99;
			return Math.floor((b * 99) / 127) + 1;
		case "dcw":
			if (b <= 8) return 0;
			if (b >= 127) return 99;
			return Math.floor(((b - 8) * 99) / 119) + 1;
		case "dca":
			if (b === 0) return 0;
			if (b >= 119) return 99;
			return Math.floor((b * 99) / 119) + 1;
	}
}

export function rawLevelToHuman(kind: EnvelopeKind, raw: number): number {
	const b = clampRounded(raw, 0, 127);
	switch (kind) {
		case "dco":
			return b > 63 ? b - 4 : b;
		case "dcw":
			if (b === 0) return 0;
			if (b === 127) return 99;
			return Math.floor((b * 99) / 127) + 1;
		case "dca":
			return b === 0 ? 0 : Math.max(0, b - 28);
	}
}
