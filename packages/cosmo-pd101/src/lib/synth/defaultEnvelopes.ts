import type { StepEnvData } from "@/lib/synth/bindings/synth";

export const DEFAULT_DCA_ENV: StepEnvData = {
	steps: [
		{ level: 99, rate: 75 },
		{ level: 79, rate: 80 },
		{ level: 79, rate: 75 },
		{ level: 0, rate: 40 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
	],
	sustainStep: 2,
	stepCount: 4,
	loop: false,
};

export const DEFAULT_DCW_ENV: StepEnvData = {
	steps: [
		{ level: 99, rate: 75 },
		{ level: 99, rate: 80 },
		{ level: 99, rate: 75 },
		{ level: 0, rate: 40 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
	],
	sustainStep: 2,
	stepCount: 4,
	loop: false,
};

export const DEFAULT_DCO_ENV: StepEnvData = {
	steps: [
		{ level: 0, rate: 50 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
	],
	sustainStep: 1,
	stepCount: 2,
	loop: false,
};
