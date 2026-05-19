import { memo } from "react";
import AlgoControlDropdown from "./AlgoControlDropdown";
import AlgoControlNumber from "./AlgoControlNumber";
import AlgoControlSelect from "./AlgoControlSelect";
import AlgoControlToggle from "./AlgoControlToggle";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
	LineIndex,
} from "./algoControlTypes";

interface AlgoControlItemProps {
	control: AlgoControlRuntime;
	disabled?: boolean;
	sectionId?: "a" | "b";
	binding?: AlgoControlBinding;
	lineIndex: LineIndex;
	algoParamSlotIndex: Record<string, number>;
	getAlgoControlValue: (id: string, fallback: number) => number;
	setAlgoControlValue: (id: string, value: number) => void;
	getActiveSelectOption: (
		control: AlgoControlRuntime,
	) => AlgoControlOptionRuntime | null;
	applyOptionAssignments: (option: AlgoControlOptionRuntime) => void;
	color?: string;
}

function AlgoControlItemInner({
	control,
	disabled = false,
	sectionId = "a",
	binding,
	lineIndex,
	algoParamSlotIndex,
	getAlgoControlValue,
	setAlgoControlValue,
	getActiveSelectOption,
	applyOptionAssignments,
	color,
}: AlgoControlItemProps) {
	const controlKind = control.kind ?? "number";

	if (controlKind === "select") {
		if (control.controlType === "dropdown") {
			return (
				<AlgoControlDropdown
					control={control}
					disabled={disabled}
					binding={binding}
					getActiveSelectOption={getActiveSelectOption}
					applyOptionAssignments={applyOptionAssignments}
				/>
			);
		}

		return (
			<AlgoControlSelect
				control={control}
				disabled={disabled}
				binding={binding}
				getActiveSelectOption={getActiveSelectOption}
				applyOptionAssignments={applyOptionAssignments}
			/>
		);
	}

	if (controlKind === "number") {
		return (
			<AlgoControlNumber
				control={control}
				disabled={disabled}
				sectionId={sectionId}
				binding={binding}
				lineIndex={lineIndex}
				algoParamSlotIndex={algoParamSlotIndex}
				getAlgoControlValue={getAlgoControlValue}
				setAlgoControlValue={setAlgoControlValue}
				color={color}
			/>
		);
	}

	return (
		<AlgoControlToggle
			control={control}
			binding={binding}
			disabled={disabled}
		/>
	);
}

const AlgoControlItem = memo(AlgoControlItemInner);

export default AlgoControlItem;
