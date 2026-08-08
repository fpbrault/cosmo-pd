import type { LfoSyncDivision } from "@/lib/synth/bindings/synth";

export const DEFAULT_SYNC_DIVISIONS: readonly {
	value: LfoSyncDivision;
	label: string;
	cyclesPerBeat: number;
}[] = [
	{ value: "whole", label: "1/1", cyclesPerBeat: 0.25 },
	{ value: "half", label: "1/2", cyclesPerBeat: 0.5 },
	{ value: "dottedQuarter", label: "1/4.", cyclesPerBeat: 2 / 3 },
	{ value: "quarter", label: "1/4", cyclesPerBeat: 1 },
	{ value: "dottedEighth", label: "1/8.", cyclesPerBeat: 4 / 3 },
	{ value: "quarterTriplet", label: "1/4T", cyclesPerBeat: 1.5 },
	{ value: "eighth", label: "1/8", cyclesPerBeat: 2 },
	{ value: "eighthTriplet", label: "1/8T", cyclesPerBeat: 3 },
	{ value: "sixteenth", label: "1/16", cyclesPerBeat: 4 },
	{ value: "thirtySecond", label: "1/32", cyclesPerBeat: 8 },
];

export function getSyncDivisionIndex(value: LfoSyncDivision): number {
	return Math.max(
		0,
		DEFAULT_SYNC_DIVISIONS.findIndex((entry) => entry.value === value),
	);
}

export function getSyncCyclesPerBeat(value: LfoSyncDivision): number {
	return (
		DEFAULT_SYNC_DIVISIONS.find((entry) => entry.value === value)
			?.cyclesPerBeat ?? 1
	);
}
