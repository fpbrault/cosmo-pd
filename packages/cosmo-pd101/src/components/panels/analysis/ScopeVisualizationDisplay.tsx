import { VisualizationDisplay } from "@/features/visualization/VisualizationDisplay";

export function ScopeVisualizationDisplay({
	variant,
}: {
	variant: "mini" | "drawer";
}) {
	return <VisualizationDisplay surface={variant} />;
}
