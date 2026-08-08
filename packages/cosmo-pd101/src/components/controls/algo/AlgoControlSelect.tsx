import { memo } from "react";
import CzButton from "@/components/primitives/buttons/CzButton";
import {
	getAlgoControlOptionLabel,
	useAlgoControl,
} from "@/lib/synth/i18nAlgo";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
} from "./algoControlTypes";

interface AlgoControlSelectProps {
	control: AlgoControlRuntime;
	disabled?: boolean;
	binding?: AlgoControlBinding;
	getActiveSelectOption: (
		control: AlgoControlRuntime,
	) => AlgoControlOptionRuntime | null;
	applyOptionAssignments: (option: AlgoControlOptionRuntime) => void;
}

function AlgoControlSelectInner({
	control,
	disabled = false,
	binding,
	getActiveSelectOption,
	applyOptionAssignments,
}: AlgoControlSelectProps) {
	const translated = useAlgoControl(control.algo, control.id);
	const label = translated.label || control.label || control.id;
	const description = translated.description || control.description || "";
	const options = control.options ?? [];
	const activeOption = getActiveSelectOption(control);

	return (
		<div className="space-y-1.5">
			<div className="grid grid-cols-4 gap-1.5">
				{options.map((option, index) => {
					const optionLabel = getAlgoControlOptionLabel(
						control.algo,
						control.id,
						option.value,
					);
					const buttonTooltip = description
						? `${label} ${optionLabel}: ${description}`
						: `${label} ${optionLabel}`;

					return (
						<CzButton
							key={option.value}
							active={activeOption?.value === option.value}
							disabled={disabled}
							led={false}
							tooltip={buttonTooltip}
							onClick={() => {
								if (disabled) {
									return;
								}
								if (option.set.length > 0) {
									applyOptionAssignments(option);
									return;
								}
								binding?.setNumber?.(index);
							}}
							className="[&_button]:w-full"
						>
							{optionLabel}
						</CzButton>
					);
				})}
			</div>
		</div>
	);
}

const AlgoControlSelect = memo(AlgoControlSelectInner);

export default AlgoControlSelect;
