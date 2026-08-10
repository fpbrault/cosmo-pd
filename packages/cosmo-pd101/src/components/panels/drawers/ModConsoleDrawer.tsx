import LfoModule from "../drawer-modules/LFOModule";
import ModEnveloppeModule from "../drawer-modules/ModEnveloppeModule";
import RandomModule from "../drawer-modules/RandomModule";
import ModMatrixPanel from "../modulation-matrix/ModMatrixPanel";

export default function ModConsoleDrawer() {
	return (
		<div className="flex h-full min-h-0 gap-3">
			{/* Matrix-led workspace: the routing surface stays readable while source modules remain close at hand. */}
			<div className="order-1 min-h-0 min-w-0 flex-[1.65]">
				<ModMatrixPanel />
			</div>

			<div className="order-2 grid min-h-0 min-w-0 flex-1 grid-cols-2 grid-rows-2 gap-2">
				<LfoModule id={1} color="#27588f" />
				<LfoModule id={2} color="#d7ac3d" />
				<RandomModule />
				<ModEnveloppeModule />
			</div>
		</div>
	);
}
