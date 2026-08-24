import { ScopeControls } from "./ScopeControls";
import { ScopeVisualizationDisplay } from "./ScopeVisualizationDisplay";

export function ScopeMiniDisplay() {
	return (
		<div className="flex h-full min-h-0 w-full flex-col">
			<div className="min-h-0 flex-1">
				<ScopeVisualizationDisplay variant="mini" />
			</div>
			<ScopeControls />
		</div>
	);
}
