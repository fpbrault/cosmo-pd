import { ScopeControls } from "@/components/panels/analysis/ScopeControls";
import { SynthOverlayModal } from "./SynthOverlayModal";

export function ScopeModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	return (
		<SynthOverlayModal
			open={open}
			onClose={onClose}
			title="Scope"
			ariaLabel="Scope visualization settings"
			widthClassName="w-[min(22rem,94%)]"
		>
			<div className="rounded-sm border border-cz-border bg-cz-panel/70 p-3 shadow-inner">
				<div className="mb-3 flex items-center gap-2">
					<span className="h-1.5 w-1.5 rounded-full bg-cz-light-blue/90 shadow-[0_0_5px_rgba(120,180,255,0.45)]" />
					<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.2em]">
						Visualization
					</p>
				</div>
				<ScopeControls />
			</div>
		</SynthOverlayModal>
	);
}
