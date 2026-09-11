import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
	useLineSelectControlModel,
	useModModeControlModel,
} from "@/components/controls/useLineRoutingControls";
import CzButton from "@/components/primitives/CzButton";
import type { LineSelect } from "@/lib/synth/bindings/synth";
import { getEnumTooltip } from "@/lib/synth/paramMeta";
import CzLed from "./CzLed";
import SimpleSectionHeader from "./SimpleSectionHeader";

const DISPLAY_OPTIONS: readonly LineSelect[] = ["L1", "L2", "L1+L2'", "L1+L1'"];

function formatLineSelect(value: LineSelect) {
	return value.replaceAll("L", "").replaceAll("'", "′");
}

export default memo(function PerformanceRoutingSection({
	embedded = false,
}: {
	embedded?: boolean;
}) {
	const { t } = useTranslation("synth");
	const { value: lineSelect, setValue: setLineSelect } =
		useLineSelectControlModel();
	const {
		value: modMode,
		isDisabled,
		toggle,
	} = useModModeControlModel(lineSelect);
	const currentIndex = DISPLAY_OPTIONS.indexOf(lineSelect);
	const nextLineSelect =
		DISPLAY_OPTIONS[(currentIndex + 1) % DISPLAY_OPTIONS.length];

	return (
		<section
			className={`${embedded ? "flex min-w-0 shrink-0 flex-col overflow-hidden" : "flex min-w-0 flex-col overflow-hidden border border-cz-border bg-cz-surface/80"} ${embedded ? "w-[9rem]" : "w-[9rem] grow"}`}
			data-testid="simple-line-select-section"
		>
			{!embedded ? (
				<SimpleSectionHeader className="text-[0.5rem]">
					{t("simpleMode.lineSelect")}
				</SimpleSectionHeader>
			) : null}
			<div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-1 p-1">
				<div className="flex min-h-0 flex-col items-center justify-center gap-1">
					<div className="z-10 grid w-full grid-cols-4 gap-0.5 px-1">
						{DISPLAY_OPTIONS.map((option) => (
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
						{(["ring", "noise"] as const).map((mode) => (
							<CzButton
								key={mode}
								ariaLabel={`${t("simpleMode.modulation")}: ${t(`simpleMode.${mode}`)}`}
								ariaPressed={modMode === mode}
								active={modMode === mode}
								disabled={isDisabled(mode)}
								onClick={() => toggle(mode)}
								tooltip={getEnumTooltip("modMode", mode)}
								className="w-full gap-0"
							>
								{t(`simpleMode.${mode}`)}
							</CzButton>
						))}
					</div>
					<span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-cz-surface px-1 font-mono text-[0.38rem] text-cz-cream/75 uppercase tracking-[0.1em]">
						{t("simpleMode.modulation")}
					</span>
				</div>
			</div>
		</section>
	);
});
