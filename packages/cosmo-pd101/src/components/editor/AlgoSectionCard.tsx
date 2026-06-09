import { memo } from "react";
import AlgoControlsGroup from "@/components/controls/algo/AlgoControlsGroup";
import AlgoIconGrid from "@/components/controls/algo/AlgoIconGrid";
import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import Card from "@/components/primitives/Card";
import type { AlgoSlotViewModel } from "./phaseLineTypes";

type AlgoSectionCardProps = {
	slot: AlgoSlotViewModel;
	lineIndex: LineIndex;
	color?: string;
};

function AlgoSectionCard({ slot, lineIndex, color }: AlgoSectionCardProps) {
	return (
		<Card
			variant="subtle"
			className={`flex min-h-0 grow flex-col gap-4 py-6 ${slot.disabled ? "opacity-45" : ""}`}
		>
			<div className="flex justify-center">
				<AlgoIconGrid
					value={slot.value}
					onChange={slot.onChange}
					disabled={slot.disabled}
					color={color}
				/>
			</div>

			<AlgoControlsGroup
				slot={{
					algo: slot.value,
					controls: slot.controls,
					controlBindings: slot.controlBindings,
					lineIndex,
					algoParamSlotIndex: slot.algoParamSlotIndex,
					getAlgoControlValue: slot.getControlValue,
					setAlgoControlValue: slot.setControlValue,
					getActiveSelectOption: slot.getActiveSelectOption,
					applyOptionAssignments: slot.applyOptionAssignments,
				}}
				disabled={slot.disabled}
				sectionId={slot.slotId}
				color={color}
			/>
		</Card>
	);
}

export default memo(AlgoSectionCard);
