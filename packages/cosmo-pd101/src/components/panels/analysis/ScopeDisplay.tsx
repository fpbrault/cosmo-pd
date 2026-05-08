import { ScopeControls } from "./ScopeControls";
import type {
	ScopeMiniDisplayProps,
	ScopeMiniDisplayWithStateProps,
} from "./ScopeDisplay.types";
import { ScopeVisualizationDisplay } from "./ScopeVisualizationDisplay";

export type { ScopeMiniDisplayProps } from "./ScopeDisplay.types";

export function ScopeMiniDisplay({
	expanded = false,
	...scopeProps
}: ScopeMiniDisplayWithStateProps) {
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
			<ScopeVisualizationDisplay {...scopeProps} variant="mini" />
			<ScopeControls />
		</div>
	);
}

export function ScopeDrawerDisplay(props: ScopeMiniDisplayProps) {
	return (
		<div className="h-full min-h-0 p-3">
			<ScopeVisualizationDisplay {...props} variant="drawer" />
		</div>
	);
}
