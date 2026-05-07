import { memo } from "react";
import AlgoControlsGroup from "@/components/controls/algo/AlgoControlsGroup";
import AlgoIconGrid from "@/components/controls/algo/AlgoIconGrid";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
	LineIndex,
} from "@/components/controls/algo/algoControlTypes";
import Card from "@/components/primitives/Card";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";

type AlgoSectionCardProps = {
	value: PdAlgo;
	onChange: (value: PdAlgo) => void;
	disabled?: boolean;
	controls: AlgoControlRuntime[];
	controlBindings: Record<string, AlgoControlBinding>;
	lineIndex: LineIndex;
	algoParamSlotIndex: Record<string, number>;
	getAlgoControlValue: (id: string, fallback: number) => number;
	setAlgoControlValue: (id: string, value: number) => void;
	getActiveSelectOption: (
		control: AlgoControlRuntime,
	) => AlgoControlOptionRuntime | null;
	applyOptionAssignments: (option: AlgoControlOptionRuntime) => void;
	color?: string;
};

function AlgoSectionCard({
	value,
	onChange,
	disabled = false,
	controls,
	controlBindings,
	lineIndex,
	algoParamSlotIndex,
	getAlgoControlValue,
	setAlgoControlValue,
	getActiveSelectOption,
	applyOptionAssignments,
	color,
}: AlgoSectionCardProps) {
	return (
		<Card
			variant="subtle"
			className={`min-h-0 flex flex-col ${disabled ? "opacity-45" : ""}`}
		>
			<div className="flex justify-center">
				<AlgoIconGrid
					value={value}
					onChange={onChange}
					disabled={disabled}
					color={color}
				/>
			</div>
			<div className="mt-2 border-t border-cz-border/70 pt-4">
				<AlgoControlsGroup
					embedded
					disabled={disabled}
					controls={controls}
					controlBindings={controlBindings}
					lineIndex={lineIndex}
					algoParamSlotIndex={algoParamSlotIndex}
					getAlgoControlValue={getAlgoControlValue}
					setAlgoControlValue={setAlgoControlValue}
					getActiveSelectOption={getActiveSelectOption}
					applyOptionAssignments={applyOptionAssignments}
					color={color}
				/>
			</div>
		</Card>
	);
}

export default memo(AlgoSectionCard);
