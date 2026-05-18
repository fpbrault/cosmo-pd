import { memo, useCallback } from "react";
import { ControlKnob } from "@/components/controls/ControlKnob";
import { useSynthStore } from "@/features/synth/synthStore";

const MACRO_LABELS = ["MACRO 1", "MACRO 2", "MACRO 3", "MACRO 4"];

function useMacroValue(index: number): number {
	return useSynthStore((s) => {
		if (index === 0) return s.macro1;
		if (index === 1) return s.macro2;
		if (index === 2) return s.macro3;
		return s.macro4;
	});
}

function useMacroSetter(index: number): (v: number) => void {
	return useSynthStore((s) => {
		if (index === 0) return s.setMacro1;
		if (index === 1) return s.setMacro2;
		if (index === 2) return s.setMacro3;
		return s.setMacro4;
	});
}

export default memo(function MacroKnobsPanel() {
	return (
		<div className="absolute bottom-[10rem] left-2 z-30">
			<div className="flex items-center gap-1.5 rounded-lg border border-cz-border/60 bg-cz-surface/95 px-2 py-1 shadow-lg backdrop-blur-sm">
				{[0, 1, 2, 3].map((idx) => (
					<MacroKnob key={idx} macroIndex={idx} />
				))}
			</div>
		</div>
	);
});

type MacroKnobProps = {
	macroIndex: number;
};

const MacroKnob = memo(function MacroKnob({ macroIndex }: MacroKnobProps) {
	const value = useMacroValue(macroIndex);
	const setter = useMacroSetter(macroIndex);
	const label = MACRO_LABELS[macroIndex];

	const handleChange = useCallback(
		(v: number) => {
			setter(v);
			window.dispatchEvent(
				new CustomEvent("cz-macro-value", {
					detail: { index: macroIndex, value: v },
				}),
			);
		},
		[setter, macroIndex],
	);

	return (
		<div className="relative flex flex-col items-center gap-0.5">
			<ControlKnob
				value={value}
				onChange={handleChange}
				min={0}
				max={1}
				label={label}
				variant="accent"
				size={52}
				valueFormatter={(v) => (v * 100).toFixed(0)}
				valueVisibility="hover"
			/>
		</div>
	);
});
