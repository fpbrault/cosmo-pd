import ControlKnob from "@/components/controls/ControlKnob";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import type { EnvKind } from "@/lib/synth/modTargets";
import { resolveTargetFromMetadata } from "@/lib/synth/modTargets";

type StepEnvelopeStepCardProps = {
	step: StepEnvData["steps"][number];
	stepIndex: number;
	activeStepCount: number;
	sustainStep: number;
	levelKnobColor: string;
	lineIndex: 1 | 2;
	envKind: EnvKind;
	onLevelChange: (value: number) => void;
	onRateChange: (value: number) => void;
	onSetSustain: () => void;
	onSetEnd: () => void;
};

export default function StepEnvelopeStepCard({
	step,
	stepIndex,
	activeStepCount,
	sustainStep,
	levelKnobColor,
	lineIndex,
	envKind,
	onLevelChange,
	onRateChange,
	onSetSustain,
	onSetEnd,
}: StepEnvelopeStepCardProps) {
	const isActiveStep = stepIndex < activeStepCount;
	const isEndStep = stepIndex === activeStepCount - 1;
	const isSustainStep = stepIndex === sustainStep;

	return (
		<fieldset
			aria-label={`Step ${stepIndex + 1}`}
			className={`flex flex-col rounded-xl border px-1 py-2 transition-colors ${
				!isActiveStep
					? "border-base-300/30 bg-base-300/10"
					: "border-base-300/60 bg-base-300/20"
			}`}
		>
			<div className="mb-1 flex items-center justify-start px-1">
				<div className="text-4xs text-base-content/45 uppercase tracking-[0.2em]">
					{stepIndex + 1}
				</div>
			</div>
			<div
				className={`flex flex-col items-center justify-center gap-2 ${!isActiveStep ? "opacity-40" : ""}`}
			>
				<ControlKnob
					value={step.level ?? 0}
					onChange={onLevelChange}
					disabled={!isActiveStep || isEndStep}
					size={64}
					min={0}
					max={99}
					label="Lvl"
					tooltip={`Sets envelope level for step ${stepIndex + 1}.`}
					valueFormatter={(v) => `${Math.round(v)}`}
					color={!isActiveStep || isEndStep ? "#6b7280" : levelKnobColor}
					modDestination={resolveTargetFromMetadata("env.stepLevel", {
						lineIndex,
						envKind,
						stepIndex: stepIndex + 1,
					})}
				/>
				<ControlKnob
					value={step.rate ?? 0}
					onChange={onRateChange}
					disabled={!isActiveStep}
					min={0}
					max={99}
					label="Rate"
					tooltip={`Sets envelope transition speed for step ${stepIndex + 1}.`}
					valueFormatter={(v) => `${Math.round(v)}`}
					color={!isActiveStep ? "#6b7280" : "#a3a3a3"}
					size={64}
					modDestination={resolveTargetFromMetadata("env.stepRate", {
						lineIndex,
						envKind,
						stepIndex: stepIndex + 1,
					})}
				/>
			</div>
			<div className="mt-1 flex w-full flex-col gap-1 pt-1">
				<button
					type="button"
					onClick={onSetSustain}
					disabled={!isActiveStep}
					aria-pressed={isSustainStep}
					className={`rounded border px-1 py-1 font-semibold text-[0.55rem] uppercase tracking-[0.18em] transition-colors ${
						isSustainStep
							? "border-warning/60 bg-warning/15 text-warning"
							: "border-base-300/60 bg-base-100/40 text-base-content/70"
					} disabled:cursor-not-allowed disabled:opacity-40`}
				>
					SUS
				</button>
				<button
					type="button"
					onClick={onSetEnd}
					aria-pressed={isEndStep}
					className={`rounded border px-1 py-1 font-semibold text-[0.55rem] uppercase tracking-[0.18em] transition-colors ${
						isEndStep
							? "border-cz-gold/60 bg-cz-gold/15 text-cz-gold"
							: "border-base-300/60 bg-base-100/40 text-base-content/70"
					}`}
				>
					END
				</button>
			</div>
		</fieldset>
	);
}
