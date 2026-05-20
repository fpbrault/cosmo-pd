import type { StepEnvData } from "@/lib/synth/bindings/synth";

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

export function formatAlgoBlendReadout(value: number) {
	const blendB = Math.round(clamp(value, 0, 1) * 100);
	const blendA = 100 - blendB;
	return `A ${blendA}% | B ${blendB}%`;
}

export function getEnvelopeVoiceProgress(
	env: StepEnvData,
	step: number,
	value: number,
) {
	const stepIndex = clamp(Math.round(step), 0, Math.max(0, env.stepCount - 1));
	const currentStep = env.steps[stepIndex];
	if (!currentStep) {
		return undefined;
	}

	const isEndStep = stepIndex === env.stepCount - 1;
	const targetLevel = isEndStep ? 0 : (currentStep.level ?? 0) / 99;
	const previousStep = stepIndex > 0 ? env.steps[stepIndex - 1] : null;
	const previousLevel = previousStep ? (previousStep.level ?? 0) / 99 : 0;
	const distance = targetLevel - previousLevel;
	if (Math.abs(distance) < 0.0001) {
		return undefined;
	}

	return clamp((value - previousLevel) / distance, 0, 1);
}
