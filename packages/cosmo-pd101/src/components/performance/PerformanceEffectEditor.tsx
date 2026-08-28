import type { RefObject } from "react";
import { MdClose, MdDeleteOutline } from "react-icons/md";
import FxSlotModuleRenderer from "@/components/panels/drawer-modules/FxSlotModuleRenderer";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import Popover from "@/components/primitives/Popover";

type PerformanceEffectEditorProps = {
	open: boolean;
	triggerRef: RefObject<HTMLButtonElement | null>;
	effectLabel: string;
	moduleConfig: FxSlotModuleConfig | undefined;
	slot: number;
	onClose: () => void;
	onRemove: () => void;
};

export default function PerformanceEffectEditor({
	open,
	triggerRef,
	effectLabel,
	moduleConfig,
	slot,
	onClose,
	onRemove,
}: PerformanceEffectEditorProps) {
	return (
		<Popover
			open={open}
			onClose={onClose}
			triggerRef={triggerRef}
			closeOnOutsidePress={false}
			modal={false}
			placement="top"
			ariaLabel={`Edit ${effectLabel}`}
		>
			<div className="flex h-[18rem] w-[min(18rem,calc(100vw-2rem))] flex-col gap-2 p-2">
				<div className="flex shrink-0 items-center justify-between border-cz-border border-b pb-1">
					<span className="font-bold font-mono text-[0.55rem] text-cz-cream uppercase tracking-[0.14em]">
						{effectLabel}
					</span>
					<button
						type="button"
						aria-label={`Close ${effectLabel} editor`}
						onClick={onClose}
						className="btn btn-ghost btn-xs size-6 min-h-0 rounded-sm p-0 text-cz-cream/65 hover:text-cz-cream"
					>
						<MdClose className="size-4" />
					</button>
				</div>
				<div className="min-h-0 flex-1">
					{moduleConfig ? (
						<FxSlotModuleRenderer config={moduleConfig} slot={slot} />
					) : null}
				</div>
				<button
					type="button"
					aria-label={`Remove ${effectLabel}`}
					onClick={onRemove}
					className="btn btn-sm min-h-0 self-end border-red-500/35 bg-red-950/35 text-red-300 hover:bg-red-900/55"
				>
					<MdDeleteOutline className="size-4" />
					Remove effect
				</button>
			</div>
		</Popover>
	);
}
