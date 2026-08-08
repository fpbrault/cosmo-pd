import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import type { EnvTab } from "@/features/synth/synthUiStore";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import type { PhaseLineEnvelopeTarget } from "../../phase-lines/phaseLineTypes";

type EnvelopeTargetValue = {
	env: StepEnvData;
	setEnv: (env: StepEnvData) => void;
};

type EnvelopeTargetLine = Record<EnvTab, EnvelopeTargetValue>;

function createTarget(
	lineIndex: LineIndex,
	envKind: EnvTab,
	target: EnvelopeTargetValue,
): PhaseLineEnvelopeTarget {
	return {
		id: `line${lineIndex}-${envKind}`,
		lineIndex,
		envKind,
		label: `Line ${lineIndex} ${envKind.toUpperCase()}`,
		env: target.env,
		setEnv: target.setEnv,
	};
}

export function createPhaseLineEnvelopeTargets(input: {
	line1: EnvelopeTargetLine;
	line2: EnvelopeTargetLine;
}): PhaseLineEnvelopeTarget[] {
	return ([1, 2] as const).flatMap((lineIndex) => {
		const line = lineIndex === 1 ? input.line1 : input.line2;
		return (["dco", "dcw", "dca"] as const).map((envKind) =>
			createTarget(lineIndex, envKind, line[envKind]),
		);
	});
}
