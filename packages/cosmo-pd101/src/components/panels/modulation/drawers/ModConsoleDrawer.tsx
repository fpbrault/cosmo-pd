import ModEnveloppeModule from "../envelope/ModEnveloppeModule";
import LfoModule from "../lfo/LFOModule";
import ModMatrixPanel from "../matrix/ModMatrixPanel";
import RandomModule from "../random/RandomModule";

export default function ModConsoleDrawer() {
	return (
		<div className="flex h-full min-h-0 gap-3">
			{/* Left: 2×3 module grid filling full height — row 1: Vibrato + Phase Mod, row 2: LFO 1 + LFO 2, row 3: Random + Mod Env */}
			<div className="grid min-h-0 min-w-0 flex-2 grid-cols-2 grid-rows-2 gap-2">
				<LfoModule id={1} color="#27588f" />
				<LfoModule id={2} color="#d7ac3d" />
				<RandomModule />
				<ModEnveloppeModule />
			</div>

			{/* Right: Mod Matrix panel */}
			<div className="min-h-0 min-w-0 flex-1">
				<ModMatrixPanel />
			</div>
		</div>
	);
}
