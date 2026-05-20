import { useCallback, useMemo } from "react";
import type { EnvOverrideHandlers } from "@/components/editor/PhaseLinesSection";
import type { StepEnvData } from "@/lib/synth/bindings/synth";

type UseEnvOverrideHandlersOptions = {
	setLine1DcoEnv: (next: StepEnvData) => void;
	setLine1DcwEnv: (next: StepEnvData) => void;
	setLine1DcaEnv: (next: StepEnvData) => void;
	setLine2DcoEnv: (next: StepEnvData) => void;
	setLine2DcwEnv: (next: StepEnvData) => void;
	setLine2DcaEnv: (next: StepEnvData) => void;
};

export function useEnvOverrideHandlers({
	setLine1DcoEnv,
	setLine1DcwEnv,
	setLine1DcaEnv,
	setLine2DcoEnv,
	setLine2DcwEnv,
	setLine2DcaEnv,
}: UseEnvOverrideHandlersOptions): EnvOverrideHandlers {
	const onEnvChange = useCallback(
		(lineIndex: 1 | 2, envType: "dco" | "dcw" | "dca", next: StepEnvData) => {
			if (lineIndex === 1) {
				if (envType === "dco") {
					setLine1DcoEnv(next);
					return;
				}
				if (envType === "dcw") {
					setLine1DcwEnv(next);
					return;
				}
				setLine1DcaEnv(next);
				return;
			}

			if (envType === "dco") {
				setLine2DcoEnv(next);
				return;
			}
			if (envType === "dcw") {
				setLine2DcwEnv(next);
				return;
			}
			setLine2DcaEnv(next);
		},
		[
			setLine1DcoEnv,
			setLine1DcwEnv,
			setLine1DcaEnv,
			setLine2DcoEnv,
			setLine2DcwEnv,
			setLine2DcaEnv,
		],
	);

	return useMemo(
		() => ({
			onEnvChange,
		}),
		[onEnvChange],
	);
}
