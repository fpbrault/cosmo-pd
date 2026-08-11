import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import type { EnvTab } from "@/features/synth/synthUiStore";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import type { PhaseLineEnvelopeTarget } from "./phaseLineTypes";

type EnvelopeTargetValue = {
	env: StepEnvData;
	setEnv: (env: StepEnvData) => void;
};

type EnvelopeTargetLine = Record<EnvTab, EnvelopeTargetValue>;

/** Visible label per envelope slot, e.g. PD's DCO/DCW/DCA vs VZ's PITCH/WARP/AMP.
 * The stored `envKind` ids (dco/dcw/dca) stay fixed regardless -- they key
 * the same three engine-neutral envelope slots for every engine. */
export const PD_ENVELOPE_ROLE_LABELS: Record<EnvTab, string> = {
	dco: "DCO",
	dcw: "DCW",
	dca: "DCA",
};

export const VZ_ENVELOPE_ROLE_LABELS: Record<EnvTab, string> = {
	dco: "PITCH",
	dcw: "WARP",
	dca: "AMP",
};

function createTarget(
	lineIndex: LineIndex,
	envKind: EnvTab,
	target: EnvelopeTargetValue,
	roleLabels: Record<EnvTab, string>,
): PhaseLineEnvelopeTarget {
	return {
		id: `line${lineIndex}-${envKind}`,
		lineIndex,
		envKind,
		label: `Line ${lineIndex} ${roleLabels[envKind]}`,
		env: target.env,
		setEnv: target.setEnv,
	};
}

export function createPhaseLineEnvelopeTargets(input: {
	line1: EnvelopeTargetLine;
	line2: EnvelopeTargetLine;
	line1RoleLabels?: Record<EnvTab, string>;
	line2RoleLabels?: Record<EnvTab, string>;
}): PhaseLineEnvelopeTarget[] {
	return ([1, 2] as const).flatMap((lineIndex) => {
		const line = lineIndex === 1 ? input.line1 : input.line2;
		const roleLabels =
			(lineIndex === 1 ? input.line1RoleLabels : input.line2RoleLabels) ??
			PD_ENVELOPE_ROLE_LABELS;
		return (["dco", "dcw", "dca"] as const).map((envKind) =>
			createTarget(lineIndex, envKind, line[envKind], roleLabels),
		);
	});
}
