import { useWavetablePreview } from "@/components/panels/drawers/useWavetablePreview";
import { WavetableWaterfall } from "@/components/panels/drawers/WavetableWaterfall";

export default function WavetableWaterfallDrawer() {
	const wavetablePreview = useWavetablePreview();

	return (
		<div className="h-full min-h-0 p-2">
			<div className="h-full min-h-0">
				<WavetableWaterfall
					line1WaveHistory={wavetablePreview.line1History}
					line2WaveHistory={wavetablePreview.line2History}
				/>
			</div>
		</div>
	);
}
