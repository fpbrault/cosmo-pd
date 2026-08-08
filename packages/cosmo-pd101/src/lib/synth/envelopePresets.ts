import type { EnvStep, StepEnvData } from "@/lib/synth/bindings/synth";

export type BuiltinEnvelopePreset = {
	id: string;
	label: string;
	envelope: StepEnvData;
};

function createEnvelope(
	activeSteps: EnvStep[],
	sustainStep: number,
	loop = false,
): StepEnvData {
	return {
		steps: [
			...activeSteps,
			...Array.from({ length: 8 - activeSteps.length }, () => ({
				level: 0,
				rate: 50,
			})),
		],
		sustainStep,
		stepCount: activeSteps.length,
		loop,
	};
}

/** Small factory catalog for common shapes shown in the envelope editor. */
export const BUILTIN_ENVELOPE_PRESETS: BuiltinEnvelopePreset[] = [
	{
		id: "pluck",
		label: "Pluck",
		envelope: createEnvelope(
			[
				{ level: 99, rate: 72 },
				{ level: 0, rate: 42 },
			],
			0,
		),
	},
	{
		id: "flat",
		label: "Flat",
		envelope: createEnvelope([{ level: 0, rate: 80 }], 0),
	},
	{
		id: "alternator",
		label: "Alternator",
		envelope: createEnvelope(
			[
				{ level: 58, rate: 62 },
				{ level: 0, rate: 45 },
				{ level: 74, rate: 55 },
				{ level: 0, rate: 45 },
				{ level: 68, rate: 55 },
				{ level: 0, rate: 45 },
				{ level: 88, rate: 50 },
				{ level: 0, rate: 45 },
			],
			0,
		),
	},
	{
		id: "shortSwell",
		label: "Short Swell",
		envelope: createEnvelope(
			[
				{ level: 99, rate: 55 },
				{ level: 0, rate: 55 },
			],
			0,
		),
	},
	{
		id: "pluckAndRise",
		label: "Pluck and Rise",
		envelope: createEnvelope(
			[
				{ level: 82, rate: 82 },
				{ level: 25, rate: 45 },
				{ level: 66, rate: 35 },
				{ level: 0, rate: 25 },
			],
			2,
		),
	},
	{
		id: "classicDecay",
		label: "Classic Decay",
		envelope: createEnvelope(
			[
				{ level: 99, rate: 70 },
				{ level: 99, rate: 70 },
				{ level: 0, rate: 30 },
			],
			2,
		),
	},
	{
		id: "sustainThenDecay",
		label: "Sustain then Decay",
		envelope: createEnvelope(
			[
				{ level: 90, rate: 90 },
				{ level: 95, rate: 55 },
				{ level: 65, rate: 35 },
				{ level: 0, rate: 20 },
			],
			2,
		),
	},
	{
		id: "pulseLoop",
		label: "Pulse Loop",
		envelope: createEnvelope(
			[
				{ level: 99, rate: 58 },
				{ level: 28, rate: 58 },
				{ level: 86, rate: 58 },
				{ level: 24, rate: 58 },
				{ level: 88, rate: 58 },
				{ level: 22, rate: 58 },
				{ level: 78, rate: 58 },
				{ level: 0, rate: 58 },
			],
			0,
			true,
		),
	},
	{
		id: "longSwell",
		label: "Long Swell",
		envelope: createEnvelope(
			[
				{ level: 99, rate: 25 },
				{ level: 0, rate: 75 },
			],
			0,
		),
	},
];
