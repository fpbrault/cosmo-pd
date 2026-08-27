import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import { useLineSelectControlModel } from "@/components/controls/useLineRoutingControls";
import CzButton from "@/components/primitives/CzButton";
import Popover from "@/components/primitives/Popover";
import { useSynthParam } from "@/features/synth/SynthParamController";

export default memo(function PerformanceDetuneSection({
	embedded = false,
}: {
	embedded?: boolean;
}) {
	const { t } = useTranslation("synth");
	const { value: octave, setValue: setOctave } =
		useSynthParam("line2DetuneOctave");
	const { value: note, setValue: setNote } = useSynthParam("line2DetuneNote");
	const { value: fine, setValue: setFine } = useSynthParam("line2DetuneFine");
	const { dualLineMode } = useLineSelectControlModel();
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const disabled = !dualLineMode;
	const color = "#c45c5c";

	useEffect(() => {
		if (disabled) setOpen(false);
	}, [disabled]);

	return (
		<section
			className={
				embedded
					? "flex min-w-0 flex-col"
					: "flex w-[4.75rem] min-w-0 grow flex-col overflow-hidden border border-cz-border bg-cz-surface/80"
			}
			data-testid="simple-detune-section"
		>
			{!embedded ? (
				<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.5rem]">
					{t("simpleMode.detune")}
				</h2>
			) : null}
			<div className="flex min-h-0 flex-1 items-start justify-center">
				<CzButton
					ref={triggerRef}
					ariaExpanded={open}
					ariaLabel={t("simpleMode.detune")}
					disabled={disabled}
					led={false}
					onClick={() => setOpen((current) => !current)}
					tooltip={t("simpleMode.detune")}
					className="gap-0"
				>
					{t("simpleMode.detune")}
				</CzButton>
			</div>
			<Popover
				open={open}
				onClose={() => setOpen(false)}
				triggerRef={triggerRef}
				placement="top"
				ariaLabel={t("simpleMode.detune")}
			>
				<div className="flex w-64 flex-col gap-2 p-2">
					<div className="font-mono text-[0.58rem] text-cz-cream uppercase tracking-[0.16em]">
						{t("simpleMode.detune")}
					</div>
					<div className="grid grid-cols-3 items-center justify-items-center gap-3">
						<SynthParamKnob
							paramKey="line2DetuneOctave"
							label={t("simpleMode.octave")}
							value={octave}
							onChange={(value) => setOctave(Math.round(value))}
							min={-3}
							max={3}
							step={1}
							bipolar
							size={52}
							color={color}
							tooltip={t("params.line2DetuneOctave.tooltip")}
							valueFormatter={(value) =>
								`${value >= 0 ? "+" : ""}${Math.round(value)} OCT`
							}
						/>
						<SynthParamKnob
							paramKey="line2DetuneNote"
							label={t("simpleMode.note")}
							value={note}
							onChange={(value) => setNote(Math.round(value))}
							min={-11}
							max={11}
							step={1}
							bipolar
							size={52}
							color={color}
							tooltip={t("params.line2DetuneNote.tooltip")}
							valueFormatter={(value) =>
								`${value >= 0 ? "+" : ""}${Math.round(value)} ST`
							}
						/>
						<SynthParamKnob
							paramKey="line2DetuneFine"
							label={t("simpleMode.fine")}
							value={fine}
							onChange={(value) => setFine(Math.round(value))}
							min={-60}
							max={60}
							step={1}
							bipolar
							size={52}
							color={color}
							tooltip={t("params.line2DetuneFine.tooltip")}
							valueFormatter={(value) =>
								`${value >= 0 ? "+" : ""}${Math.round(value)}`
							}
						/>
					</div>
				</div>
			</Popover>
		</section>
	);
});
