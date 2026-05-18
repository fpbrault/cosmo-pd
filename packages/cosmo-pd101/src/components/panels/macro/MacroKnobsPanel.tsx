import { memo, useCallback } from "react";
import { ControlKnob } from "@/components/controls/ControlKnob";
import { useSynthStore } from "@/features/synth/synthStore";

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

function useMacroLabel(index: number): string {
	return useSynthStore((s) => s.macroLabels[index]);
}

type MacroKnobsPanelProps = {
	onOpenLabelEditor?: () => void;
};

export default memo(function MacroKnobsPanel({
	onOpenLabelEditor,
}: MacroKnobsPanelProps) {
	return (
		<div className="h-full min-h-0 w-full">
			<div className="h-full overflow-hidden rounded-lg border border-cz-border/70 bg-cz-surface/95 shadow-lg backdrop-blur-sm">
				<div className="flex items-center justify-between border-cz-border/60 border-b px-2 py-1">
					<div className="flex items-center gap-1.5">
						<span className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.16em]">
							Macro Controls
						</span>
					</div>
					{onOpenLabelEditor ? (
						<div className="flex items-center gap-0.5">
							<button
								type="button"
								className="btn btn-ghost btn-xs h-6 min-h-0 w-6 p-0 text-cz-cream/90"
								onClick={onOpenLabelEditor}
								aria-label="Edit macro labels"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="h-3.5 w-3.5"
									aria-hidden="true"
									focusable="false"
								>
									<path
										fillRule="evenodd"
										d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					) : null}
				</div>
				<div className="grid grid-cols-2 gap-1.5 px-2 py-1.5">
					{[0, 1, 2, 3].map((idx) => (
						<MacroKnob key={idx} macroIndex={idx} />
					))}
				</div>
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
	const label = useMacroLabel(macroIndex);

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
				color={
					macroIndex === 0
						? "var(--color-cz-tab-red)"
						: macroIndex === 1
							? "var(--color-cz-tab-red)"
							: macroIndex === 2
								? "var(--color-cz-tab-blue)"
								: "var(--color-cz-tab-blue)"
				}
				size={80}
				valueFormatter={(v) => (v * 100).toFixed(0)}
				valueVisibility="hover"
			/>
		</div>
	);
});
