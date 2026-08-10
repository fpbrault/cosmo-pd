import type {
	LfoSyncDivision,
	SequencerDirection,
	SequencerHoldMode,
	SequencerMode,
	SequencerParams,
	SequencerStep,
} from "@/lib/synth/bindings/synth";

export const SEQUENCER_STEP_COUNT = 16;

export const SEQUENCER_RATES: LfoSyncDivision[] = [
	"whole",
	"half",
	"quarter",
	"eighth",
	"sixteenth",
	"thirtySecond",
	"dottedQuarter",
	"dottedEighth",
	"quarterTriplet",
	"eighthTriplet",
];

export const ARPEGGIATOR_DIRECTIONS: SequencerDirection[] = [
	"up",
	"down",
	"upDown",
	"random",
	"asPlayed",
];

export const STEP_DIRECTIONS: SequencerDirection[] = [
	"forward",
	"reverse",
	"pingPong",
	"random",
];

export const SEQUENCER_MODES: SequencerMode[] = ["arpeggiator", "step"];

export const SEQUENCER_HOLD_MODES: SequencerHoldMode[] = ["hold", "latch"];

export const DEFAULT_SEQUENCER_STEP: SequencerStep = {
	enabled: true,
	pitch: 0,
	velocity: 1,
	gate: 1,
	probability: 1,
};

export const DEFAULT_SEQUENCER_PARAMS: SequencerParams = {
	enabled: false,
	mode: "arpeggiator",
	rate: "eighth",
	direction: "up",
	octaveRange: 1,
	repeat: 1,
	gate: 0.75,
	swing: 0,
	holdMode: "hold",
	patternLength: 8,
	resetOnTransport: true,
	steps: Array.from({ length: SEQUENCER_STEP_COUNT }, () => ({
		...DEFAULT_SEQUENCER_STEP,
	})) as NonNullable<SequencerParams["steps"]>,
};

function clampInteger(
	value: unknown,
	min: number,
	max: number,
	fallback: number,
) {
	return typeof value === "number" && Number.isFinite(value)
		? Math.max(min, Math.min(max, Math.round(value)))
		: fallback;
}

function clampUnit(value: unknown, fallback: number) {
	return typeof value === "number" && Number.isFinite(value)
		? Math.max(0, Math.min(1, value))
		: fallback;
}

export function normalizeSequencerParams(
	value: SequencerParams | null | undefined,
): SequencerParams {
	const source = value ?? {};
	const rate = source.rate ?? "eighth";
	const steps = Array.from({ length: SEQUENCER_STEP_COUNT }, (_, index) => {
		const step = source.steps?.[index] ?? DEFAULT_SEQUENCER_STEP;
		return {
			enabled: step.enabled !== false,
			pitch: clampInteger(step.pitch, -24, 24, 0),
			velocity: clampUnit(step.velocity, 1),
			gate: clampUnit(step.gate, 1),
			probability: clampUnit(step.probability, 1),
		};
	}) as NonNullable<SequencerParams["steps"]>;

	return {
		...DEFAULT_SEQUENCER_PARAMS,
		...source,
		enabled: source.enabled === true,
		mode: source.mode === "step" ? "step" : "arpeggiator",
		rate: SEQUENCER_RATES.includes(rate) ? rate : "eighth",
		direction: typeof source.direction === "string" ? source.direction : "up",
		octaveRange: clampInteger(source.octaveRange, 1, 4, 1),
		repeat: clampInteger(source.repeat, 1, 4, 1),
		gate: clampUnit(source.gate, 0.75),
		swing:
			typeof source.swing === "number"
				? Math.max(0, Math.min(0.5, source.swing))
				: 0,
		holdMode: source.holdMode === "latch" ? "latch" : "hold",
		patternLength: clampInteger(
			source.patternLength,
			1,
			SEQUENCER_STEP_COUNT,
			8,
		),
		resetOnTransport: source.resetOnTransport !== false,
		steps,
	};
}
