import { useSynthParam } from "@/features/synth/SynthParamController";
import type { LineSelect, ModMode } from "@/lib/synth/bindings/synth";

export const LINE_SELECT_OPTIONS: readonly LineSelect[] = [
	"L1",
	"L2",
	"L1+L1'",
	"L1+L2'",
];
export const MOD_MODE_OPTIONS: readonly ModMode[] = ["normal", "ring", "noise"];

export function isDualLineSelect(value: LineSelect): boolean {
	return value === "L1+L1'" || value === "L1+L2'";
}

export function isModModeDisabled(
	mode: ModMode,
	lineSelect: LineSelect,
): boolean {
	return mode !== "normal" && !isDualLineSelect(lineSelect);
}

export function useLineSelectControlModel() {
	const { value, setValue } = useSynthParam("lineSelect");
	return { value, setValue, dualLineMode: isDualLineSelect(value) };
}

export function useModModeControlModel(lineSelect: LineSelect) {
	const { value, setValue } = useSynthParam("modMode");
	const isDisabled = (mode: ModMode) => isModModeDisabled(mode, lineSelect);
	const toggle = (mode: Exclude<ModMode, "normal">) => {
		if (isDisabled(mode)) return;
		setValue(value === mode ? "normal" : mode);
	};
	return { value, setValue, isDisabled, toggle };
}
