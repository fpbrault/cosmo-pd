import type { ModDestination } from "@/lib/synth/bindings/synth";
import {
	isRegisteredModDestination,
	type ModTargetContext,
	type ModTargetKey,
	resolveTargetFromMetadata,
} from "@/lib/synth/modTargets";

type LineScopedModTarget =
	| "dcwBase"
	| "dcaBase"
	| "algoBlend"
	| "detune"
	| "octave";

export type AlgoControlSlotTarget =
	| "algoControl1"
	| "algoControl2"
	| "algoControl3"
	| "algoControl4"
	| "algoControl5"
	| "algoControl6"
	| "algoControl7"
	| "algoControl8";

export type ModTarget =
	| ModDestination
	| LineScopedModTarget
	| AlgoControlSlotTarget
	| ModTargetKey;

export function algoControlTargetFromSlot(
	slot: number,
): AlgoControlSlotTarget | undefined {
	if (!Number.isInteger(slot) || slot < 1 || slot > 8) {
		return undefined;
	}
	return `algoControl${slot}` as AlgoControlSlotTarget;
}

const LEGACY_ALGO_SLOT_KEY = /^line[12]AlgoParam[1-8]$/;

/** Normalizes persisted pre-AlgoControl modulation destination keys. */
export function normalizeAlgoSlotKey(key: string): string {
	return LEGACY_ALGO_SLOT_KEY.test(key)
		? key.replace("AlgoParam", "AlgoControl")
		: key;
}

export function resolveModDestination(
	target: ModTarget | undefined,
	options?: { lineIndex?: 1 | 2 } & ModTargetContext,
): ModDestination | undefined {
	if (!target) {
		return undefined;
	}

	if (isRegisteredModDestination(target as ModDestination)) {
		return target as ModDestination;
	}

	const metadataDestination = resolveTargetFromMetadata(
		target as ModTargetKey,
		options,
	);
	if (metadataDestination) {
		return metadataDestination;
	}

	const linePrefix = options?.lineIndex === 2 ? "line2" : "line1";

	switch (target) {
		case "dcwBase":
			return `${linePrefix}DcwBase` as ModDestination;
		case "dcaBase":
			return `${linePrefix}DcaBase` as ModDestination;
		case "algoBlend":
			return `${linePrefix}AlgoBlend` as ModDestination;
		case "detune":
			return `${linePrefix}Detune` as ModDestination;
		case "octave":
			return `${linePrefix}Octave` as ModDestination;
		case "algoControl1":
			return `${linePrefix}AlgoControl1` as ModDestination;
		case "algoControl2":
			return `${linePrefix}AlgoControl2` as ModDestination;
		case "algoControl3":
			return `${linePrefix}AlgoControl3` as ModDestination;
		case "algoControl4":
			return `${linePrefix}AlgoControl4` as ModDestination;
		case "algoControl5":
			return `${linePrefix}AlgoControl5` as ModDestination;
		case "algoControl6":
			return `${linePrefix}AlgoControl6` as ModDestination;
		case "algoControl7":
			return `${linePrefix}AlgoControl7` as ModDestination;
		case "algoControl8":
			return `${linePrefix}AlgoControl8` as ModDestination;
		default:
			return undefined;
	}
}
