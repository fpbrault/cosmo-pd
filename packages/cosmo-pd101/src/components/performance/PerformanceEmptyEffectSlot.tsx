import type { MutableRefObject } from "react";
import { MdPowerSettingsNew, MdSettings } from "react-icons/md";
import FxTypeSelectorPopover from "@/components/panels/FxTypeSelectorPopover";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import PerformanceEffectSlotShell from "./PerformanceEffectSlotShell";

type PerformanceEmptyEffectSlotProps = {
	slot: number;
	open: boolean;
	triggerRef: MutableRefObject<HTMLButtonElement | null>;
	onOpen: () => void;
	onClose: () => void;
	onSelect: (type: FxSlotType) => void;
};

export default function PerformanceEmptyEffectSlot({
	slot,
	open,
	triggerRef,
	onOpen,
	onClose,
	onSelect,
}: PerformanceEmptyEffectSlotProps) {
	return (
		<PerformanceEffectSlotShell className="gap-1">
			<MdPowerSettingsNew
				aria-hidden="true"
				className="absolute top-2 left-2 size-4 text-cz-cream/25"
			/>
			<MdSettings
				aria-hidden="true"
				className="absolute top-2 right-2 size-4 text-cz-cream/25"
			/>
			<button
				ref={(element) => {
					triggerRef.current = element;
				}}
				type="button"
				aria-label={`Add effect in slot ${slot + 1}`}
				className="btn btn-ghost btn-sm size-[4rem] min-h-0 rounded-full border-2 border-cz-cream/20 border-dashed text-cz-cream/55 text-xl hover:border-cz-light-blue/70 hover:text-cz-light-blue"
				onClick={onOpen}
			>
				+
			</button>
			<span className="font-mono text-[0.55rem] text-cz-cream/55 uppercase tracking-[0.12em]">
				Slot {slot + 1}
			</span>
			<FxTypeSelectorPopover
				open={open}
				triggerRef={triggerRef}
				currentType="empty"
				showRemove={false}
				onSelect={onSelect}
				onClose={onClose}
			/>
		</PerformanceEffectSlotShell>
	);
}
