import { useTranslation } from "react-i18next";
import { HoverInfoTrigger } from "@/components/layout/HoverInfo";
import Card from "@/components/primitives/Card";
import type { BaseWaveform } from "@/lib/synth/bindings/synth";
import { BaseWaveformIcon } from "./BaseWaveformIcon";

const BASE_WAVE_OPTIONS: ReadonlyArray<{ value: BaseWaveform }> = [
	{ value: "cosine" },
	{ value: "sine" },
	{ value: "triangle" },
	{ value: "saw" },
	{ value: "square" },
];

interface BaseWaveSelectorProps {
	title: string;
	value: BaseWaveform;
	onChange: (v: BaseWaveform) => void;
	disabled?: boolean;
	color?: string;
}

export function BaseWaveSelector({
	title,
	value,
	onChange,
	disabled = false,
	color,
}: BaseWaveSelectorProps) {
	const { t } = useTranslation("synth");
	return (
		<Card
			variant="subtle"
			className="flex @min-[900px]:min-h-48 flex-col justify-center pb-2 [@container_phase_(max-height:620px)]:min-h-0 [@container_phase_(max-height:620px)]:pb-0.5"
		>
			<div
				className="text-center text-3xs uppercase tracking-[0.24em]"
				style={color ? { color } : undefined}
			>
				{title}
			</div>
			<div className="flex flex-wrap justify-center gap-1 [@container_phase_(max-height:620px)]:gap-0">
				{BASE_WAVE_OPTIONS.map((option) => {
					const tooltip = t(`tooltips.baseWave.${option.value}`);
					const label = t(`editor.baseWaveLabels.${option.value}`);
					return (
						<HoverInfoTrigger key={option.value} message={tooltip}>
							{(hoverHandlers) => (
								<button
									type="button"
									onClick={() => {
										if (!disabled) onChange(option.value);
									}}
									disabled={disabled}
									title={tooltip}
									data-hover-info={tooltip}
									{...hoverHandlers}
									className={`flex select-none flex-col items-center gap-0.5 rounded py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 [@container_phase_(max-height:620px)]:py-0.5 [@container_phase_(max-height:500px)]:[&_svg]:h-4 [@container_phase_(max-height:500px)]:[&_svg]:w-7 ${
										disabled
											? "cursor-not-allowed opacity-40"
											: "cursor-pointer"
									} ${
										value === option.value
											? "text-primary-content"
											: "border border-cz-border text-cz-cream/70 hover:border-cz-cream/40 hover:text-cz-cream"
									}`}
									style={
										value === option.value && color
											? { backgroundColor: color }
											: undefined
									}
								>
									<BaseWaveformIcon
										waveform={option.value}
										size={32}
										className={
											value === option.value
												? "text-primary-content"
												: "text-cz-cream/70 group-hover:text-cz-cream"
										}
									/>
									<span className="font-bold text-xs leading-none tracking-wide">
										{label}
									</span>
								</button>
							)}
						</HoverInfoTrigger>
					);
				})}
			</div>
		</Card>
	);
}
