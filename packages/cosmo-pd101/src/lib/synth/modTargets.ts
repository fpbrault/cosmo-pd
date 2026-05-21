import type { ModDestination } from "@/lib/synth/bindings/synth";
import { FX_DEFINITIONS_V1 } from "@/lib/synth/bindings/synth";

type ModTargetGroup =
	| "Global"
	| "Line 1"
	| "Line 2"
	| "Envelopes"
	| "FX"
	| "Modulation";

export type EnvKind = "dco" | "dcw" | "dca";

export type ModTargetContext = {
	lineIndex?: 1 | 2;
	lfoIndex?: 1 | 2;
	envKind?: EnvKind;
	stepIndex?: number;
};

export type ModTargetKey =
	| "line.algoBlend"
	| "env.stepLevel"
	| "env.stepRate"
	| "phaser.rate"
	| "phaser.depth"
	| "phaser.feedback"
	| "phaser.mix"
	| "lfo.rate"
	| "lfo.depth"
	| "lfo.symmetry"
	| "lfo.offset"
	| "random.rate";

type ModTargetMeta = {
	id: ModDestination;
	label: string;
	group: ModTargetGroup;
	uiAvailable?: boolean;
	lineIndex?: 1 | 2;
	envKind?: EnvKind;
	stepIndex?: number;
	field?: "level" | "rate";
};

const CORE_TARGETS: ModTargetMeta[] = [
	{ id: "volume", label: "Volume", group: "Global" },
	{ id: "pitch", label: "Pitch", group: "Global" },
	{ id: "line1DcwBase", label: "L1 DCW", group: "Line 1" },
	{ id: "line1DcaBase", label: "L1 DCA", group: "Line 1" },
	{ id: "line1AlgoBlend", label: "L1 Algo Blend", group: "Line 1" },
	{ id: "line2DetuneNote", label: "L2 Detune Note", group: "Line 1" },
	{ id: "line1Octave", label: "L1 Octave", group: "Line 1" },
	{ id: "line1AlgoParam1", label: "L1 Param 1", group: "Line 1" },
	{ id: "line1AlgoParam2", label: "L1 Param 2", group: "Line 1" },
	{ id: "line1AlgoParam3", label: "L1 Param 3", group: "Line 1" },
	{ id: "line1AlgoParam4", label: "L1 Param 4", group: "Line 1" },
	{ id: "line1AlgoParam5", label: "L1 Param 5", group: "Line 1" },
	{ id: "line1AlgoParam6", label: "L1 Param 6", group: "Line 1" },
	{ id: "line1AlgoParam7", label: "L1 Param 7", group: "Line 1" },
	{ id: "line1AlgoParam8", label: "L1 Param 8", group: "Line 1" },
	{ id: "line2DcwBase", label: "L2 DCW", group: "Line 2" },
	{ id: "line2DcaBase", label: "L2 DCA", group: "Line 2" },
	{ id: "line2AlgoBlend", label: "L2 Algo Blend", group: "Line 2" },
	{ id: "line2DetuneFine", label: "L2 Detune Fine", group: "Line 2" },
	{ id: "line2DetuneOctave", label: "L2 Detune Octave", group: "Line 2" },
	{ id: "line2AlgoParam1", label: "L2 Param 1", group: "Line 2" },
	{ id: "line2AlgoParam2", label: "L2 Param 2", group: "Line 2" },
	{ id: "line2AlgoParam3", label: "L2 Param 3", group: "Line 2" },
	{ id: "line2AlgoParam4", label: "L2 Param 4", group: "Line 2" },
	{ id: "line2AlgoParam5", label: "L2 Param 5", group: "Line 2" },
	{ id: "line2AlgoParam6", label: "L2 Param 6", group: "Line 2" },
	{ id: "line2AlgoParam7", label: "L2 Param 7", group: "Line 2" },
	{ id: "line2AlgoParam8", label: "L2 Param 8", group: "Line 2" },
	{ id: "lfo1Rate", label: "LFO 1 Rate", group: "Modulation" },
	{ id: "lfo1Depth", label: "LFO 1 Depth", group: "Modulation" },
	{ id: "lfo1Symmetry", label: "LFO 1 Symmetry", group: "Modulation" },
	{ id: "lfo1Offset", label: "LFO 1 Offset", group: "Modulation" },
	{ id: "lfo2Rate", label: "LFO 2 Rate", group: "Modulation" },
	{ id: "lfo2Depth", label: "LFO 2 Depth", group: "Modulation" },
	{ id: "lfo2Symmetry", label: "LFO 2 Symmetry", group: "Modulation" },
	{ id: "lfo2Offset", label: "LFO 2 Offset", group: "Modulation" },
	{ id: "randomRate", label: "Random Rate", group: "Modulation" },
];

const ENV_KINDS: Array<{ key: EnvKind; label: string }> = [
	{ key: "dco", label: "DCO" },
	{ key: "dcw", label: "DCW" },
	{ key: "dca", label: "DCA" },
];

const FIELD_SUFFIX: Record<"level" | "rate", string> = {
	level: "Level",
	rate: "Rate",
};

function toEnvDestination(
	lineIndex: 1 | 2,
	envKind: EnvKind,
	stepIndex: number,
	field: "level" | "rate",
): ModDestination {
	const envPrefix =
		envKind === "dco" ? "Dco" : envKind === "dcw" ? "Dcw" : "Dca";
	return `line${lineIndex}${envPrefix}EnvStep${stepIndex}${FIELD_SUFFIX[field]}` as ModDestination;
}

const ENVELOPE_TARGETS: ModTargetMeta[] = [1, 2].flatMap((lineIndex) =>
	ENV_KINDS.flatMap((envKind) =>
		Array.from({ length: 8 }, (_, idx) => {
			const stepIndex = idx + 1;
			return [
				{
					id: toEnvDestination(
						lineIndex as 1 | 2,
						envKind.key,
						stepIndex,
						"level",
					),
					label: `L${lineIndex} ${envKind.label} Step ${stepIndex} Level`,
					group: "Envelopes" as const,
					lineIndex: lineIndex as 1 | 2,
					envKind: envKind.key,
					stepIndex,
					field: "level" as const,
				},
				{
					id: toEnvDestination(
						lineIndex as 1 | 2,
						envKind.key,
						stepIndex,
						"rate",
					),
					label: `L${lineIndex} ${envKind.label} Step ${stepIndex} Rate`,
					group: "Envelopes" as const,
					lineIndex: lineIndex as 1 | 2,
					envKind: envKind.key,
					stepIndex,
					field: "rate" as const,
				},
			];
		}).flat(),
	),
);

const FX_TARGETS: ModTargetMeta[] = FX_DEFINITIONS_V1.flatMap((def) =>
	def.controls
		.filter((ctrl) => ctrl.modDestinationKey != null)
		.map((ctrl) => ({
			id: ctrl.modDestinationKey as ModDestination,
			label: `${def.name} ${ctrl.label}`,
			group: "FX" as ModTargetGroup,
		})),
);

const MOD_TARGET_REGISTRY: ModTargetMeta[] = [
	...CORE_TARGETS,
	...FX_TARGETS,
	...ENVELOPE_TARGETS,
];

const DESTINATION_META = new Map<ModDestination, ModTargetMeta>(
	MOD_TARGET_REGISTRY.map((entry) => [entry.id, entry]),
);

export function isRegisteredModDestination(
	destination: ModDestination,
): boolean {
	return DESTINATION_META.has(destination);
}

export function getModDestinationLabel(destination: ModDestination): string {
	return DESTINATION_META.get(destination)?.label ?? destination;
}

export function getModDestinationGroups(): {
	label: string;
	destinations: { value: ModDestination; label: string }[];
}[] {
	const buckets = new Map<string, { value: ModDestination; label: string }[]>();

	for (const entry of MOD_TARGET_REGISTRY) {
		if (entry.uiAvailable === false) {
			continue;
		}
		const group = buckets.get(entry.group) ?? [];
		group.push({ value: entry.id, label: entry.label });
		buckets.set(entry.group, group);
	}

	return Array.from(buckets.entries()).map(([label, destinations]) => ({
		label,
		destinations,
	}));
}

export function resolveTargetFromMetadata(
	key: ModTargetKey,
	context: ModTargetContext = {},
): ModDestination | undefined {
	switch (key) {
		case "line.algoBlend":
			return context.lineIndex === 2 ? "line2AlgoBlend" : "line1AlgoBlend";
		case "env.stepLevel": {
			const lineIndex = context.lineIndex ?? 1;
			const envKind = context.envKind;
			const stepIndex = context.stepIndex;
			if (!envKind || !stepIndex || stepIndex < 1 || stepIndex > 8) {
				return undefined;
			}
			return toEnvDestination(lineIndex, envKind, stepIndex, "level");
		}
		case "env.stepRate": {
			const lineIndex = context.lineIndex ?? 1;
			const envKind = context.envKind;
			const stepIndex = context.stepIndex;
			if (!envKind || !stepIndex || stepIndex < 1 || stepIndex > 8) {
				return undefined;
			}
			return toEnvDestination(lineIndex, envKind, stepIndex, "rate");
		}
		case "phaser.rate":
			return "phaserRate";
		case "phaser.depth":
			return "phaserDepth";
		case "phaser.feedback":
			return "phaserFeedback";
		case "phaser.mix":
			return "phaserMix";
		case "lfo.rate":
			return context.lfoIndex === 2 ? "lfo2Rate" : "lfo1Rate";
		case "lfo.depth":
			return context.lfoIndex === 2 ? "lfo2Depth" : "lfo1Depth";
		case "lfo.symmetry":
			return context.lfoIndex === 2 ? "lfo2Symmetry" : "lfo1Symmetry";
		case "lfo.offset":
			return context.lfoIndex === 2 ? "lfo2Offset" : "lfo1Offset";
		case "random.rate":
			return "randomRate";
		default:
			return undefined;
	}
}
