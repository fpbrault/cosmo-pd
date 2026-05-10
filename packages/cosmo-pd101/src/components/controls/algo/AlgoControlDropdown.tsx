import { memo } from "react";
import Button from "@/components/controls/Button";
import { HoverInfoTrigger, useHoverInfo } from "@/components/layout/HoverInfo";
import {
	getAlgoControlOptionLabel,
	useAlgoControl,
} from "@/lib/synth/i18nAlgo";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
} from "./algoControlTypes";

function WaveformOptionIcon({
	value,
	isWindowFunction = false,
}: {
	value: string;
	isWindowFunction?: boolean;
}) {
	const stroke = "currentColor";
	const common = {
		fill: "none",
		stroke,
		strokeWidth: 1.8,
		strokeLinejoin: "round" as const,
		strokeLinecap: "round" as const,
	};

	switch (value) {
		case "czSaw":
			return <polyline points="6,18 26,5 26,18" {...common} />;
		case "czSquare":
			return <polyline points="6,18 6,6 16,6 16,18 28,18" {...common} />;
		case "czPulse":
			return <polyline points="6,18 11,5 16,18 28,18" {...common} />;
		case "czDoubleSine":
			return <path d="M6,18 L9,5 L12,18 Q20,7 28,18" {...common} />;
		case "czSawPulse":
			return (
				<polyline points="6,18 6,12 9,8 13,6 18,6 18,18 28,18" {...common} />
			);
		case "czReso1":
		case "czResonant1":
			return (
				<path
					d="M6,18 Q8,3.2 10,18 Q12,4.8 14,18 Q16,7.2 18,18 Q20,10 22,18 Q23.5,12.8 25,18 Q26,15 27,18 L28,18"
					{...common}
				/>
			);
		case "czReso2":
		case "czResonant2":
			return (
				<path
					d="M6,18 Q7.5,13 9,18 Q10.5,8.8 12,18 Q13.5,3.4 15,18 Q16.5,6.2 18,18 Q19.5,10.2 21,18 Q22.5,14.2 24,18 Q25.5,16.2 27,18 L28,18"
					{...common}
				/>
			);
		case "czReso3":
		case "czResonant3":
			return (
				<path
					d="M6,18 Q8,3.2 10,18 Q12,3.4 14,18 Q16,4.4 18,18 Q20,8.8 22,18 Q23.5,13.2 25,18 Q26.2,15.6 27.2,18 L28,18"
					{...common}
				/>
			);
		case "saw":
			return isWindowFunction ? (
				<polyline points="5,5 5,20 29,5" {...common} />
			) : (
				<polyline points="5,5 5,18 7,20 25,7 30,7" {...common} />
			);
		case "square":
			return <polyline points="5,5 5,18 15,17 18,15 18,6 30,8" {...common} />;
		case "pulse":
		case "pulse2":
			return isWindowFunction ? (
				<polyline points="5,5 5,20 14,5 29,5" {...common} />
			) : (
				<polyline
					points="4,8 16,8 16,11 17,11 17,20 17,11 18,11 18,8 30,8"
					{...common}
				/>
			);
		case "null":
			return <line x1="4" y1="11" x2="30" y2="11" {...common} />;
		case "off":
			return null;
		case "sinePulse":
			return (
				<polyline
					points="5,7 7,8 9,11 11,14 13,17 15,18 17,16 19,13 21,10 23,8 25,7 27,8 29,10"
					{...common}
				/>
			);
		case "sawPulse":
			return (
				<polyline
					points="5,9 7,10 9,13 11,16 13,18 15,19 17,16 18,8 30,9"
					{...common}
				/>
			);
		case "multiSine":
			return (
				<polyline
					points="5,15 6,8 7,16 8,9 9,17 10,8 11,16 12,9 13,17 14,8 15,16 16,9 17,17 18,8 19,16 20,9 21,17 22,8 23,16 24,9 25,17 26,8 27,16 28,9 29,17"
					{...common}
				/>
			);
		case "triangle":
			return <polyline points="5,6 17,20 29,6" {...common} />;
		case "trapezoid":
			return <polyline points="5,5 5,19 16,19 29,5" {...common} />;
		case "doubleSaw":
			return <polyline points="5,5 17,20 17,5 29,20 29,5" {...common} />;
		default:
			return (
				<polyline
					points="4,13 8,10 12,14 16,9 20,13 24,10 28,14 30,12"
					{...common}
				/>
			);
	}
}

interface AlgoControlDropdownProps {
	control: AlgoControlRuntime;
	disabled?: boolean;
	binding?: AlgoControlBinding;
	getActiveSelectOption: (
		control: AlgoControlRuntime,
	) => AlgoControlOptionRuntime | null;
	applyOptionAssignments: (option: AlgoControlOptionRuntime) => void;
}

function AlgoControlDropdownInner({
	control,
	disabled = false,
	binding,
	getActiveSelectOption,
	applyOptionAssignments,
}: AlgoControlDropdownProps) {
	const { setControlReadout } = useHoverInfo();
	const { label, description } = useAlgoControl(control.algo, control.id);
	const options = control.options ?? [];
	const activeOption = getActiveSelectOption(control);
	const useSingleLineLayout =
		control.id === "preset" || control.id === "windowFunction";
	const isPresetControl = control.id === "preset";

	return (
		<div className="space-y-1.5">
			<div className="flex items-end text-3xs text-cz-cream/85 uppercase leading-tight tracking-[0.2em]">
				{label}
			</div>
			<div
				className={
					useSingleLineLayout
						? "flex w-full min-w-0 gap-0"
						: "grid grid-cols-2 gap-0"
				}
			>
				{options.map((option) => {
					const optionLabel = getAlgoControlOptionLabel(
						control.algo,
						control.id,
						option.value,
					);
					const buttonTooltip = description
						? `${label} ${optionLabel}: ${description}`
						: `${label} ${optionLabel}`;

					return (
						<HoverInfoTrigger key={option.value} message={buttonTooltip}>
							{(hoverHandlers) => (
								<Button
									title={optionLabel}
									aria-label={optionLabel}
									disabled={disabled}
									data-hover-info={buttonTooltip}
									{...hoverHandlers}
									onClick={() => {
										if (disabled) {
											return;
										}

										setControlReadout({
											label,
											value: optionLabel,
										});

										if (option.set.length > 0) {
											applyOptionAssignments(option);
											return;
										}

										binding?.setNumber?.(
											options.findIndex((o) => o.value === option.value),
										);
									}}
									className={[
										"relative flex items-center justify-center border-cz-light-blue border-t-0 border-r border-b border-l text-cz-gold transition-colors focus:outline-none",
										activeOption?.value === option.value
											? "border-cz-light-blue bg-cz-inset text-white shadow-sm"
											: "border-cz-border bg-cz-surface hover:border-cz-light-blue hover:text-white",
										useSingleLineLayout
											? `${isPresetControl ? "h-10" : "h-6"} min-w-0 flex-1 overflow-hidden px-0`
											: "h-6 min-w-0 px-0",
									].join(" ")}
								>
									{isPresetControl ? (
										<span className="pointer-events-none absolute top-0.5 left-1/2 z-10 -translate-x-1/2 text-[0.45rem] text-current/85 leading-none">
											{options.findIndex((o) => o.value === option.value) + 1}
										</span>
									) : null}
									<svg
										viewBox="0 0 34 22"
										className={
											isPresetControl
												? "mt-3.5 h-5 w-full max-w-9"
												: "h-4 w-full max-w-9"
										}
										aria-hidden="true"
									>
										<WaveformOptionIcon
											value={option.value}
											isWindowFunction={control.id === "windowFunction"}
										/>
									</svg>
								</Button>
							)}
						</HoverInfoTrigger>
					);
				})}
			</div>
		</div>
	);
}

const AlgoControlDropdown = memo(AlgoControlDropdownInner);

export default AlgoControlDropdown;
