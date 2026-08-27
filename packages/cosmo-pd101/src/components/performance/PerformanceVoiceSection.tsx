import { memo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import {
	usePortamentoControlModel,
	useVoiceModeControlModel,
} from "@/components/controls/useVoiceControls";
import CzButton from "@/components/primitives/CzButton";
import Popover from "@/components/primitives/Popover";
import CzLed from "./CzLed";
import PerformanceDetuneSection from "./PerformanceDetuneSection";

export default memo(function PerformanceVoiceSection({
	embedded = false,
}: {
	embedded?: boolean;
}) {
	const { t } = useTranslation("synth");
	const { polyMode, portamentoEnabled, toggleMono, togglePortamento } =
		useVoiceModeControlModel();
	const {
		mode,
		isRateMode,
		toggleMode,
		activeParamKey,
		activeValue,
		setActiveValue,
	} = usePortamentoControlModel();
	const [timeOpen, setTimeOpen] = useState(false);
	const timeButtonRef = useRef<HTMLButtonElement>(null);

	return (
		<section
			className={`${embedded ? "flex min-w-0 shrink-0 flex-col overflow-hidden" : "flex min-w-0 flex-col overflow-hidden border border-cz-border bg-cz-surface/80"} ${embedded ? "w-[8.5rem]" : "w-[7rem] grow"}`}
			data-testid="simple-voice-section"
		>
			{!embedded ? (
				<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.5rem]">
					{t("simpleMode.voice")}
				</h2>
			) : null}
			<div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-0.5 p-1">
				<div className="grid grid-cols-2 items-center gap-1">
					<PerformanceDetuneSection embedded />
					<CzButton
						ariaLabel={`${t("simpleMode.voice")}: ${t("voiceMode.mono")}`}
						ariaPressed={polyMode === "mono"}
						active={polyMode === "mono"}
						onClick={toggleMono}
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
						<CzButton
							ariaLabel={`${t("simpleMode.portamento")}: ${portamentoEnabled ? "On" : "Off"}`}
							ariaPressed={Boolean(portamentoEnabled)}
							active={Boolean(portamentoEnabled)}
							onClick={togglePortamento}
							tooltip={t("voiceMode.portamentoTooltip")}
							className="w-full"
						>
							{t("simpleMode.onOff")}
						</CzButton>
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
								{(["time", "rate"] as const).map((value) => (
									<span
										key={value}
										className="flex flex-col items-center gap-1"
									>
										<CzLed active={mode === value} />
										{t(`simpleMode.${value}`)}
									</span>
								))}
							</div>
							<CzButton
								ariaLabel={`${t("simpleMode.portamentoTime")}: ${isRateMode ? t("simpleMode.rate") : t("simpleMode.time")}`}
								led={false}
								onClick={toggleMode}
								className="gap-0"
							>
								{t("simpleMode.select")}
							</CzButton>
						</div>
						<SynthParamKnob
							paramKey={activeParamKey}
							value={activeValue}
							onChange={setActiveValue}
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
