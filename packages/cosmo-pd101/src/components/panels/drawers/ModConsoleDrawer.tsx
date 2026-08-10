import LfoModule from "../drawer-modules/LFOModule";
import ModEnveloppeModule from "../drawer-modules/ModEnveloppeModule";
import RandomModule from "../drawer-modules/RandomModule";
import ModMatrixPanel from "../modulation-matrix/ModMatrixPanel";

export default function ModConsoleDrawer() {
	return (
		<div className="grid h-full min-h-0 min-w-0 touch-pan-x grid-cols-[minmax(18rem,2fr)_minmax(12rem,1fr)] gap-3 overflow-x-auto">
			<div className="order-1 grid min-h-0 min-w-[18rem] grid-cols-2 grid-rows-2 gap-2">
				<LfoModule id={1} color="#27588f" />
				<LfoModule id={2} color="#d7ac3d" />
				<RandomModule />
				<ModEnveloppeModule />
			</div>

			<div className="order-2 min-h-0 min-w-[12rem]">
				<ModMatrixPanel />
			</div>
		</div>
	);
}
