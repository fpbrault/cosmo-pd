import { memo } from "react";
import { HoverInfoTrigger } from "@/components/layout/shell/HoverInfo";
import Button from "@/components/primitives/buttons/Button";
import {
	getAlgoControlOptionLabel,
	useAlgoControl,
} from "@/lib/synth/i18nAlgo";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
} from "./algoControlTypes";

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
	const translated = useAlgoControl(control.algo, control.id);
	const label = translated.label || control.label || control.id;
	const description = translated.description || control.description || "";
	const options = control.options ?? [];
	const activeOption = getActiveSelectOption(control);

	return (
		<div className="space-y-1.5">
			<div className="flex items-end text-3xs text-cz-cream/85 uppercase leading-tight tracking-[0.2em]">
				{label}
			</div>
			<div className="grid grid-cols-2 gap-0">
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

										if (option.set.length > 0) {
											applyOptionAssignments(option);
											return;
										}

										binding?.setNumber?.(
											options.findIndex((o) => o.value === option.value),
										);
									}}
									className={[
										"h-6 min-w-0 border-cz-light-blue border-t-0 border-r border-b border-l bg-cz-surface px-1 text-3xs text-cz-gold uppercase tracking-[0.16em] transition-colors focus:outline-none",
										activeOption?.value === option.value
											? "border-cz-light-blue bg-cz-inset text-white shadow-sm"
											: "border-cz-border hover:border-cz-light-blue hover:text-white",
									].join(" ")}
								>
									<span className="truncate">{optionLabel}</span>
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
