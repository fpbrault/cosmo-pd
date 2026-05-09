import { useQuery } from "@tanstack/react-query";
import { SharedPhaseDistortionVisualizer } from "@/components/PhaseDistortionVisualizer";
import { fetchPresetData } from "@/lib/presets/presetManager";

export default function FullscreenSynthRendererPage() {
	const { data } = useQuery({
		queryKey: ["presets"],
		queryFn: () =>
			fetchPresetData(0, -1, [], "", [], "inclusive", false, false, 0),
		staleTime: 1000 * 60 * 5,
	});

	return (
		<div className="h-full w-full overflow-hidden">
			<SharedPhaseDistortionVisualizer
				libraryPresets={data?.presets ?? []}
				frameStyle={{ height: "100%" }}
			/>
		</div>
	);
}
