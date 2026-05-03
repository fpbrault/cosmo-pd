import { useWavetablePreview } from "@/components/panels/drawers/useWavetablePreview";
import { WavetableWaterfall } from "@/components/panels/drawers/WavetableWaterfall";

export default function WavetableWaterfallDrawer() {
	const wavetablePreview = useWavetablePreview();

	return (
		<div className="h-full min-h-0 p-2">
			<WavetableWaterfall waveHistory={wavetablePreview} />
		</div>
	);
}
