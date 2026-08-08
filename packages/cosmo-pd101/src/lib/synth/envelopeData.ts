import type { StepEnvData } from "@/lib/synth/bindings/synth";

const ENVELOPE_STEP_COUNT = 8;
const DEFAULT_STEP = { level: 0, rate: 50 };

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

function normalizeStepCount(stepCount: number) {
	return clamp(Math.round(stepCount), 1, ENVELOPE_STEP_COUNT);
}

function getPaddedSteps(steps: StepEnvData["steps"]) {
	return Array.from({ length: ENVELOPE_STEP_COUNT }, (_, index) => {
		const step = steps[index];
		return step ? { ...step } : { ...DEFAULT_STEP };
	});
}

export function normalizeEnvelope(env: StepEnvData): StepEnvData {
	const stepCount = normalizeStepCount(env.stepCount);
	const steps = getPaddedSteps(env.steps);
	const endStepIndex = stepCount - 1;
	steps[endStepIndex] = { ...steps[endStepIndex], level: 0 };

	return {
		...env,
		steps,
		stepCount,
		sustainStep: clamp(Math.round(env.sustainStep), 0, stepCount - 1),
	};
}
