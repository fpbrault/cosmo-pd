import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSettings } from "react-icons/md";
import ControlKnob from "@/components/controls/ControlKnob";
import { MacroLabelEditorPopover } from "@/components/modals/MacroLabelEditorPopover";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import { useSynthStore } from "@/features/synth/synthStore";
import { getParamTooltip } from "@/lib/synth/paramMeta";

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

export default memo(function MacroKnobsPanel() {
	const { t } = useTranslation("synth");
	const [labelEditorOpen, setLabelEditorOpen] = useState(false);
	const settingsBtnRef = useRef<HTMLButtonElement | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [knobSize, setKnobSize] = useState(80);
	const [isTall, setIsTall] = useState(true);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const update = () => {
			const h = el.clientHeight;
			const heightOk = h >= 150;
			setIsTall(heightOk);
			setKnobSize(heightOk ? 80 : 60);
		};

		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return (
		<div className="h-full min-h-0 w-full rounded-xl border border-transparent bg-cz-surface">
			<div className="flex h-full flex-col overflow-hidden">
				<div className="flex items-center justify-between border-cz-border/60 border-b px-2 py-1">
					<div className="flex items-center gap-1.5">
						<span className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.16em]">
							{t("macro.title")}
						</span>
					</div>
					<div className="flex items-center gap-0.5">
						<button
							ref={settingsBtnRef}
							type="button"
							className="btn btn-ghost btn-xs h-6 min-h-0 w-6 p-0 text-cz-cream/90"
							onClick={() => setLabelEditorOpen((prev) => !prev)}
							aria-label={t("macro.editAria")}
						>
							<MdSettings className="h-3.5 w-3.5" />
						</button>
						<MacroLabelEditorPopover
							open={labelEditorOpen}
							triggerRef={settingsBtnRef}
							onClose={() => setLabelEditorOpen(false)}
						/>
					</div>
				</div>
				<div
					ref={containerRef}
					className={`grid min-h-0 flex-1 ${isTall ? "grid-cols-2" : "grid-cols-4"} justify-items-center px-2 py-1.5`}
				>
					{[0, 1, 2, 3].map((idx) => (
						<MacroKnob key={idx} macroIndex={idx} size={knobSize} />
					))}
				</div>
			</div>
		</div>
	);
});

type MacroKnobProps = {
	macroIndex: number;
	size: number;
};

export const MacroKnob = memo(function MacroKnob({
	macroIndex,
	size,
}: MacroKnobProps) {
	const { t } = useTranslation("synth");
	const value = useMacroValue(macroIndex);
	const setter = useMacroSetter(macroIndex);
	const label = useMacroLabel(macroIndex);
	const midiLearn = useMidiLearnTarget({
		targetKey: `macro${macroIndex + 1}`,
	});
	const tooltip = t("tooltips.macro.assignment", {
		label,
		description:
			getParamTooltip(`macro${macroIndex + 1}`) ??
			t("tooltips.macro.fallbackDescription"),
	});

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
		<div className="relative flex flex-col items-center gap-0.5 self-center">
			<ControlKnob
				value={value}
				onChange={handleChange}
				min={0}
				max={1}
				label={label}
				tooltip={tooltip}
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
				size={size}
				valueFormatter={(v) => (v * 100).toFixed(0)}
				valueVisibility="hover"
				onClick={midiLearn.onClick}
				onContextMenu={midiLearn.onContextMenu}
				interactionLocked={midiLearn.interactionLocked}
				midiLearnState={midiLearn.midiLearnState}
			/>
		</div>
	);
});
