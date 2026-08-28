import { useSynthStore } from "@/features/synth/synthStore";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import CollapsedSectionSummary from "./CollapsedSectionSummary";

const FX_SLOT_IDS = ["fx-1", "fx-2", "fx-3", "fx-4", "fx-5", "fx-6"];
const COLORS: Record<FxSlotType, string> = {
	empty: "bg-[#3b3b3b]",
	chorus: "bg-[#818cf8]",
	delay: "bg-[#fbbf24]",
	phaseMod: "bg-[#f43f5e]",
	vibrato: "bg-[#f472b6]",
	phaser: "bg-[#a78bfa]",
	reverb: "bg-[#f97316]",
	compressor: "bg-[#fb923c]",
	eq8Band: "bg-[#34d399]",
	grainDelay: "bg-[#a78bfa]",
	bitcrusher: "bg-[#f87171]",
	shimmerVerb: "bg-[#60a5fa]",
	distortion: "bg-[#f59e0b]",
	loFi: "bg-[#38bdf8]",
	ringMod: "bg-[#e879f9]",
	wavefolder: "bg-[#c084fc]",
	junoChorus: "bg-[#22d3ee]",
	tremolo: "bg-[#4ade80]",
	multimodeFilter: "bg-[#fca5a5]",
	flanger: "bg-[#67e8f9]",
};

export default function CollapsedEffectsSummary({
	onExpand,
}: {
	onExpand: () => void;
}) {
	const slots = useSynthStore((state) => state.fxSlots);
	const activeCount = slots.filter(
		(slot) => slot.type !== "empty" && slot.params.enabled !== false,
	).length;
	return (
		<CollapsedSectionSummary
			title="FX +"
			ariaLabel="Expand Effects section"
			testId="simple-effects-summary"
			onExpand={onExpand}
			className="border-cz-border border-l"
			headerClassName="text-[0.5rem] tracking-[0.12em]"
		>
			<div className="pointer-events-none my-auto grid grid-cols-3 gap-1">
				{slots.map((slot, index) => {
					const enabled =
						slot.type !== "empty" && slot.params.enabled !== false;
					return (
						<span
							key={FX_SLOT_IDS[index]}
							title={`Effect slot ${index + 1}: ${slot.type}${enabled ? " enabled" : " inactive"}`}
							className={`size-3 rounded-sm border border-cz-border ${COLORS[slot.type]} ${enabled ? "opacity-100" : "opacity-25"}`}
						/>
					);
				})}
			</div>
			<span className="font-mono text-[0.48rem] uppercase tracking-[0.12em]">
				{activeCount} on
			</span>
		</CollapsedSectionSummary>
	);
}
