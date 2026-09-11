import { useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import AlgoControlsGroup from "@/components/controls/algo/AlgoControlsGroup";
import AlgoIconGrid from "@/components/controls/algo/AlgoIconGrid";
import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import type { AlgoSlotViewModel } from "@/components/editor/phaseLineTypes";
import Popover from "@/components/primitives/Popover";

export default function PerformanceAlgorithmCard({
	lineIndex,
	slot,
	color,
	onActivate,
	disabled,
}: {
	lineIndex: LineIndex;
	slot: AlgoSlotViewModel;
	color: string;
	onActivate: () => void;
	disabled: boolean;
}) {
	const [controlsOpen, setControlsOpen] = useState(false);
	const controlsTriggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (disabled || slot.controlsDisabled) setControlsOpen(false);
	}, [disabled, slot.controlsDisabled]);

	return (
		<div
			className="relative aspect-square w-full"
			data-testid={`simple-algorithm-slot-${slot.slotId}`}
		>
			<span className="pointer-events-none absolute top-1 left-1 z-10 font-bold font-mono text-[0.5rem] text-cz-cream/75 uppercase">
				{lineIndex}
				{slot.slotId}
			</span>
			<AlgoIconGrid
				value={slot.value}
				disabled={disabled}
				allowNone={slot.allowNone}
				variant="compact"
				color={color}
				onChange={(value) => {
					onActivate();
					slot.onChange(value);
				}}
				ariaLabel={`Edit line ${lineIndex} algorithm ${slot.slotId.toUpperCase()}`}
				popoverAriaLabel={`Edit line ${lineIndex} algorithm ${slot.slotId.toUpperCase()}`}
				onOpen={onActivate}
				className="size-full"
			/>
			<button
				ref={controlsTriggerRef}
				type="button"
				disabled={disabled || slot.controlsDisabled}
				aria-label={`Edit line ${lineIndex} algorithm ${slot.slotId.toUpperCase()} controls`}
				aria-haspopup="dialog"
				aria-expanded={controlsOpen}
				onClick={(event) => {
					event.stopPropagation();
					onActivate();
					setControlsOpen((open) => !open);
				}}
				className="absolute top-0.5 right-0.5 z-10 flex size-4 items-center justify-center rounded-sm bg-cz-inset/80 text-cz-cream/70 hover:text-cz-cream focus:outline-none focus:ring-1 focus:ring-cz-light-blue disabled:cursor-not-allowed disabled:opacity-35"
			>
				<MdSettings className="size-3" aria-hidden="true" />
			</button>
			<Popover
				open={controlsOpen}
				onClose={() => setControlsOpen(false)}
				triggerRef={controlsTriggerRef}
				placement="top"
				ariaLabel={`Edit line ${lineIndex} algorithm ${slot.slotId.toUpperCase()} controls`}
			>
				<div className="flex min-w-[22rem] flex-col gap-2 p-2">
					<div className="font-mono text-[0.58rem] text-cz-cream uppercase tracking-[0.16em]">
						Line {lineIndex} · Algo {slot.slotId.toUpperCase()} controls
					</div>
					<AlgoControlsGroup
						slot={{
							algo: slot.value,
							controls: slot.controls,
							controlBindings: slot.controlBindings,
							lineIndex,
							algoControlSlotIndex: slot.algoControlSlotIndex,
							getAlgoControlValue: slot.getControlValue,
							setAlgoControlValue: slot.setControlValue,
							getActiveSelectOption: slot.getActiveSelectOption,
							applyOptionAssignments: slot.applyOptionAssignments,
						}}
						disabled={slot.controlsDisabled}
						variant="compact"
						controlSize={64}
						color={color}
					/>
				</div>
			</Popover>
		</div>
	);
}
