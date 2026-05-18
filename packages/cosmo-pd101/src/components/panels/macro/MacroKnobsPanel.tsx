import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ControlKnob } from "@/components/controls/ControlKnob";
import { useSynthStore } from "@/features/synth/synthStore";
import MacroAssignEditor from "./MacroAssignEditor";

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
	const [editorIndex, setEditorIndex] = useState<number | null>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (editorIndex === null) return;
		const handleClick = (e: MouseEvent) => {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setEditorIndex(null);
			}
		};
		const timer = setTimeout(() => {
			document.addEventListener("mousedown", handleClick);
		}, 0);
		return () => {
			clearTimeout(timer);
			document.removeEventListener("mousedown", handleClick);
		};
	}, [editorIndex]);

	return (
		<div ref={panelRef} className="absolute bottom-[10rem] left-2 z-30">
			<div className="flex items-center gap-1.5 rounded-lg border border-cz-border/60 bg-cz-surface/95 px-2 py-1 shadow-lg backdrop-blur-sm">
				{[0, 1, 2, 3].map((idx) => (
					<MacroKnob
						key={idx}
						macroIndex={idx}
						editorOpen={editorIndex === idx}
						onOpenEditor={() =>
							setEditorIndex(editorIndex === idx ? null : idx)
						}
					/>
				))}
			</div>
			{editorIndex !== null && (
				<MacroAssignEditor
					macroIndex={editorIndex}
					onClose={() => setEditorIndex(null)}
				/>
			)}
		</div>
	);
});

type MacroKnobProps = {
	macroIndex: number;
	editorOpen: boolean;
	onOpenEditor: () => void;
};

const MacroKnob = memo(function MacroKnob({
	macroIndex,
	editorOpen,
	onOpenEditor,
}: MacroKnobProps) {
	const value = useMacroValue(macroIndex);
	const setter = useMacroSetter(macroIndex);
	const label = MACRO_LABELS[macroIndex];

	const assignmentCount = useSynthStore(
		(s) =>
			s.macroAssignments.filter((a) => a.enabled && a.macroIndex === macroIndex)
				.length,
	);

	const handleChange = useCallback((v: number) => setter(v), [setter]);

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
			<button
				type="button"
				onClick={onOpenEditor}
				className={`font-mono text-5xs uppercase tracking-[0.12em] transition-colors ${
					editorOpen
						? "text-cz-light-blue"
						: "text-cz-light-blue/70 hover:text-cz-light-blue"
				}`}
			>
				{assignmentCount > 0 ? `${assignmentCount} asgn` : "─"}
			</button>
		</div>
	);
});
