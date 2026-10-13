import type { RefObject } from "react";
import { ScopeControls } from "@/components/panels/analysis/ScopeControls";
import Popover from "@/components/primitives/Popover";

export function ScopePopover({
	open,
	triggerRef,
	onClose,
}: {
	open: boolean;
	triggerRef: RefObject<Element | null>;
	onClose: () => void;
}) {
	return (
		<Popover
			open={open}
			onClose={onClose}
			triggerRef={triggerRef}
			role="dialog"
			ariaLabel="Scope visualization settings"
			placement="right-start"
			modal={false}
		>
			<div className="w-44 bg-cz-body/95 p-3">
				<div className="mb-2 flex items-center gap-2">
					<span className="h-1.5 w-1.5 rounded-full bg-cz-light-blue/90 shadow-[0_0_5px_rgba(120,180,255,0.45)]" />
					<p className="font-mono text-3xs text-cz-cream uppercase tracking-[0.2em]">
						Scope
					</p>
					<span className="h-px flex-1 bg-cz-border/70" />
				</div>
				<div className="rounded-sm border border-cz-border/80 bg-cz-panel/70 px-2 py-2.5 shadow-inner">
					<ScopeControls />
				</div>
			</div>
		</Popover>
	);
}
