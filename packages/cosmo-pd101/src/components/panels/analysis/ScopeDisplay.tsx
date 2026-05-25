import { ScopeControls } from "./ScopeControls";
import { ScopeVisualizationDisplay } from "./ScopeVisualizationDisplay";

export function ScopeMiniDisplay({ expanded = false }: { expanded?: boolean }) {
	if (expanded) {
		return (
			<div className="flex w-full flex-col">
				<div className="flex h-43 w-full items-center justify-center rounded border border-cz-border bg-cz-lcd-bg px-4 text-center font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]">
					Wave drawer is showing the full scope view
				</div>
				<ScopeControls />
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col">
			<ScopeVisualizationDisplay variant="mini" />
			<ScopeControls />
		</div>
	);
}

export function ScopeDrawerDisplay() {
	return (
		<div className="h-full min-h-0 p-3">
			<ScopeVisualizationDisplay variant="drawer" />
		</div>
	);
}
