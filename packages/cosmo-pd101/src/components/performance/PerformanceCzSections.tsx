import {
	Children,
	Fragment,
	memo,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import CzButton from "@/components/primitives/CzButton";
import Popover from "@/components/primitives/Popover";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type { LineSelect, ModMode } from "@/lib/synth/bindings/synth";
import { getEnumTooltip } from "@/lib/synth/paramMeta";

const LINE_SELECT_OPTIONS: LineSelect[] = ["L1", "L2", "L1+L2'", "L1+L1'"];

function formatLineSelect(value: LineSelect) {
	return value.replaceAll("L", "").replaceAll("'", "′");
}

function CzLed({ active }: { active: boolean }) {
	return (
		<span
			aria-hidden="true"
			className={`cz-led ${active ? "on" : ""} size-1.5 shrink-0`}
		/>
	);
}

const SECTION_CLASS =
	"flex min-w-0 flex-col overflow-hidden border border-cz-border bg-cz-surface/80";
const EMBEDDED_SECTION_CLASS = "flex min-w-0 shrink-0 flex-col overflow-hidden";

export function PerformanceVoiceRack({ children }: { children: ReactNode }) {
	let hasPreviousSection = false;
	const sections = (
		<>
			<span aria-hidden="true" className="min-w-0" />
			{Children.map(children, (section) => {
				const showDivider = hasPreviousSection;
				hasPreviousSection = true;
				return (
					<Fragment>
						{showDivider && (
							<span
								aria-hidden="true"
								className="my-1 w-px justify-self-center bg-cz-border/80"
							/>
						)}
						{section}
					</Fragment>
				);
			})}
			<span aria-hidden="true" className="min-w-0" />
		</>
	);

	return (
		<section
			className="flex min-w-0 flex-1 flex-col overflow-hidden bg-cz-surface/80"
			data-testid="simple-voice-rack"
		>
			<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.5rem]">
				VOICE
			</h2>
			<div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_12.5rem_minmax(0,2fr)_12.5rem_minmax(0,2fr)_9rem_minmax(0,2fr)_8.5rem_minmax(0,1fr)]">
				{sections}
			</div>
		</section>
	);
}

export const PerformanceRoutingSection = memo(
	function PerformanceRoutingSection({
		embedded = false,
	}: {
		embedded?: boolean;
	}) {
		const { t } = useTranslation("synth");
		const { value: lineSelect, setValue: setLineSelect } =
			useSynthParam("lineSelect");
		const { value: modMode, setValue: setModMode } = useSynthParam("modMode");
		const currentIndex = LINE_SELECT_OPTIONS.indexOf(lineSelect as LineSelect);
		const nextLineSelect =
			LINE_SELECT_OPTIONS[(currentIndex + 1) % LINE_SELECT_OPTIONS.length];
		const dualLineMode = isDualLineSelect(lineSelect as LineSelect);

		return (
			<section
				className={`${embedded ? EMBEDDED_SECTION_CLASS : SECTION_CLASS} ${embedded ? "w-[9rem]" : "w-[9rem] grow"}`}
				data-testid="simple-line-select-section"
			>
				{!embedded && (
					<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.5rem]">
						{t("simpleMode.lineSelect")}
					</h2>
				)}
				<div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-1 p-1">
					<div className="flex min-h-0 flex-col items-center justify-center gap-1">
						<div className="z-10 grid w-full grid-cols-4 gap-0.5 px-1">
							{LINE_SELECT_OPTIONS.map((option) => (
								<div
									key={option}
									className="flex flex-col items-center gap-0.5 whitespace-nowrap font-mono text-[0.4rem] text-cz-cream uppercase tracking-[-0.02em]"
								>
									<CzLed active={lineSelect === option} />
									<span>{formatLineSelect(option)}</span>
								</div>
							))}
						</div>
						<div className="z-10 flex justify-end pr-2">
							<CzButton
								ariaLabel={`${t("simpleMode.lineSelect")}: ${formatLineSelect(lineSelect)}`}
								active={false}
								led={false}
								onClick={() => setLineSelect(nextLineSelect)}
								tooltip={`${t("simpleMode.lineSelect")}: ${formatLineSelect(lineSelect)}`}
								className="min-w-[3rem] gap-0"
							>
								{t("simpleMode.lineSelect")}
							</CzButton>
						</div>
					</div>
					<div
						className="relative mx-1 border-cz-cream/55 border-x border-b px-1 pt-1 pb-2"
						data-testid="simple-modulation-section"
					>
						<div className="grid grid-cols-2 items-end gap-2 px-1">
							<CzButton
								ariaLabel={`${t("simpleMode.modulation")}: ${t("simpleMode.ring")}`}
								ariaPressed={modMode === "ring"}
								active={modMode === "ring"}
								disabled={!dualLineMode}
								onClick={() =>
									setModMode(modMode === "ring" ? "normal" : "ring")
								}
								tooltip={getEnumTooltip("modMode", "ring")}
								className="w-full gap-0"
							>
								{t("simpleMode.ring")}
							</CzButton>
							<CzButton
								ariaLabel={`${t("simpleMode.modulation")}: ${t("simpleMode.noise")}`}
								ariaPressed={modMode === "noise"}
								active={modMode === "noise"}
								disabled={!dualLineMode}
								onClick={() =>
									setModMode(modMode === "noise" ? "normal" : "noise")
								}
								tooltip={getEnumTooltip("modMode", "noise")}
								className="w-full gap-0"
							>
								{t("simpleMode.noise")}
							</CzButton>
						</div>
						<span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-cz-surface px-1 font-mono text-[0.38rem] text-cz-cream/75 uppercase tracking-[0.1em]">
							{t("simpleMode.modulation")}
						</span>
					</div>
				</div>
			</section>
		);
	},
);

export const PerformanceVoiceSection = memo(function PerformanceVoiceSection({
	embedded = false,
}: {
	embedded?: boolean;
}) {
	const { t } = useTranslation("synth");
	const { value: polyMode, setValue: setPolyMode } = useSynthParam("polyMode");
	const { value: portamentoEnabled, setValue: setPortamentoEnabled } =
		useSynthParam("portamentoEnabled");
	const { value: portamentoMode, setValue: setPortamentoMode } =
		useSynthParam("portamentoMode");
	const { value: portamentoRate, setValue: setPortamentoRate } =
		useSynthParam("portamentoRate");
	const { value: portamentoTime, setValue: setPortamentoTime } =
		useSynthParam("portamentoTime");
	const [timeOpen, setTimeOpen] = useState(false);
	const timeButtonRef = useRef<HTMLButtonElement>(null);
	const isRateMode = portamentoMode === "rate";

	return (
		<section
			className={`${embedded ? EMBEDDED_SECTION_CLASS : SECTION_CLASS} ${embedded ? "w-[8.5rem]" : "w-[7rem] grow"}`}
			data-testid="simple-voice-section"
		>
			{!embedded && (
				<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.5rem]">
					{t("simpleMode.voice")}
				</h2>
			)}
			<div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-0.5 p-1">
				<div className="grid grid-cols-2 items-center gap-1">
					<PerformanceDetuneSection embedded />
					<CzButton
						ariaLabel={`${t("simpleMode.voice")}: ${t("voiceMode.mono")}`}
						ariaPressed={polyMode === "mono"}
						active={polyMode === "mono"}
						onClick={() => setPolyMode(polyMode === "mono" ? "poly8" : "mono")}
						tooltip={t("voiceMode.tooltip")}
					>
						{t("voiceMode.mono")}
					</CzButton>
				</div>

				<div className="border-cz-border/70 border-t pt-1">
					<div className="mb-0.5 text-center font-mono text-[0.42rem] text-cz-gold uppercase tracking-[0.12em]">
						{t("simpleMode.portamento")}
					</div>
					<div className="grid min-h-[2.85rem] grid-cols-2 items-end gap-1 px-0.5">
						<div className="z-10 flex-1">
							<CzButton
								ariaExpanded={timeOpen}
								ariaLabel={t("simpleMode.portamentoTime")}
								ref={timeButtonRef}
								active={isRateMode}
								onClick={() => setTimeOpen((open) => !open)}
								tooltip={t("simpleMode.portamentoTime")}
								className="w-full"
							>
								{t("simpleMode.time")}
							</CzButton>
						</div>
						<div className="z-10 flex-1">
							<CzButton
								ariaLabel={`${t("simpleMode.portamento")}: ${portamentoEnabled ? "On" : "Off"}`}
								ariaPressed={Boolean(portamentoEnabled)}
								active={Boolean(portamentoEnabled)}
								onClick={() => setPortamentoEnabled(!portamentoEnabled)}
								tooltip={t("voiceMode.portamentoTooltip")}
								className="w-full"
							>
								{t("simpleMode.onOff")}
							</CzButton>
						</div>
					</div>
				</div>
			</div>

			<Popover
				open={timeOpen}
				onClose={() => setTimeOpen(false)}
				triggerRef={timeButtonRef}
				placement="top"
				ariaLabel={t("simpleMode.portamentoTime")}
			>
				<div className="flex w-52 flex-col gap-2 p-2">
					<div className="font-mono text-[0.58rem] text-cz-cream uppercase tracking-[0.16em]">
						{t("simpleMode.portamentoTime")}
					</div>
					<div className="flex items-center justify-around gap-4">
						<div className="flex flex-col items-center gap-1">
							<div className="grid grid-cols-2 gap-3 font-mono text-[0.45rem] text-cz-cream uppercase">
								{(["time", "rate"] as const).map((mode) => (
									<span key={mode} className="flex flex-col items-center gap-1">
										<CzLed active={portamentoMode === mode} />
										{t(`simpleMode.${mode}`)}
									</span>
								))}
							</div>
							<CzButton
								ariaLabel={`${t("simpleMode.portamentoTime")}: ${isRateMode ? t("simpleMode.rate") : t("simpleMode.time")}`}
								led={false}
								onClick={() => setPortamentoMode(isRateMode ? "time" : "rate")}
								className="gap-0"
							>
								{t("simpleMode.select")}
							</CzButton>
						</div>
						<SynthParamKnob
							paramKey={isRateMode ? "portamentoRate" : "portamentoTime"}
							value={isRateMode ? portamentoRate : portamentoTime}
							onChange={isRateMode ? setPortamentoRate : setPortamentoTime}
							label={isRateMode ? t("simpleMode.rate") : t("simpleMode.time")}
							min={isRateMode ? 0.01 : 0}
							max={isRateMode ? 100 : 10}
							step={0.01}
							size={52}
							color="#7f9de4"
							valueFormatter={(value) =>
								isRateMode ? `${value.toFixed(2)}×` : `${value.toFixed(2)} S`
							}
						/>
					</div>
				</div>
			</Popover>
		</section>
	);
});

export const PerformanceDetuneSection = memo(function PerformanceDetuneSection({
	embedded = false,
}: {
	embedded?: boolean;
}) {
	const { t } = useTranslation("synth");
	const { value: octave, setValue: setOctave } =
		useSynthParam("line2DetuneOctave");
	const { value: note, setValue: setNote } = useSynthParam("line2DetuneNote");
	const { value: fine, setValue: setFine } = useSynthParam("line2DetuneFine");
	const { value: lineSelect } = useSynthParam("lineSelect");
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const disabled = !isDualLineSelect(lineSelect as LineSelect);
	const color = "#c45c5c";

	useEffect(() => {
		if (disabled) setOpen(false);
	}, [disabled]);

	return (
		<section
			className={
				embedded ? "flex min-w-0 flex-col" : `${SECTION_CLASS} w-[4.75rem] grow`
			}
			data-testid="simple-detune-section"
		>
			{!embedded && (
				<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.5rem]">
					{t("simpleMode.detune")}
				</h2>
			)}
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

export function isDualLineSelect(value: LineSelect) {
	return value === "L1+L1'" || value === "L1+L2'";
}

export function isModModeDisabled(value: ModMode, lineSelect: LineSelect) {
	return value !== "normal" && !isDualLineSelect(lineSelect);
}
