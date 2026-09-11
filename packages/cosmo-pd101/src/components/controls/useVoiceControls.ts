import { useSynthParam } from "@/features/synth/SynthParamController";

export function useVoiceModeControlModel() {
	const { value: polyMode, setValue: setPolyMode } = useSynthParam("polyMode");
	const { value: portamentoEnabled, setValue: setPortamentoEnabled } =
		useSynthParam("portamentoEnabled");
	return {
		polyMode,
		portamentoEnabled,
		toggleMono: () => setPolyMode(polyMode === "mono" ? "poly8" : "mono"),
		togglePortamento: () => setPortamentoEnabled(!portamentoEnabled),
	};
}

export function usePortamentoControlModel() {
	const { value: mode, setValue: setMode } = useSynthParam("portamentoMode");
	const { value: rate, setValue: setRate } = useSynthParam("portamentoRate");
	const { value: time, setValue: setTime } = useSynthParam("portamentoTime");
	const isRateMode = mode === "rate";
	return {
		mode,
		setMode,
		rate,
		setRate,
		time,
		setTime,
		isRateMode,
		toggleMode: () => setMode(isRateMode ? "time" : "rate"),
		activeParamKey: isRateMode
			? ("portamentoRate" as const)
			: ("portamentoTime" as const),
		activeValue: isRateMode ? rate : time,
		setActiveValue: isRateMode ? setRate : setTime,
	};
}
