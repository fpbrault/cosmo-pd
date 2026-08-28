import AlgorithmMark from "@/components/controls/algo/AlgorithmMark";
import { PD_ALGOS } from "@/lib/synth/algoUiCatalog";
import type { Algo } from "@/lib/synth/bindings/synth";

export default function LineAlgorithmCard({
	lineIndex,
	algoA,
	algoB,
	selectedLine,
	selectedAlgo,
	onSelect,
	compact = false,
	inactive = false,
}: {
	lineIndex: 1 | 2;
	algoA: Algo;
	algoB: Algo | null;
	selectedLine?: 1 | 2;
	selectedAlgo?: "a" | "b";
	onSelect?: (line: 1 | 2, algo: "a" | "b") => void;
	compact?: boolean;
	inactive?: boolean;
}) {
	const choices = [
		{ algo: algoA, inactive: false, slot: "a" },
		{ algo: algoB, inactive: algoB === null, slot: "b" },
	] as const;
	const colorClass = lineIndex === 1 ? "text-[#7f9de4]" : "text-[#c45c5c]";

	return (
		<fieldset
			aria-label={`Line ${lineIndex} algorithms${inactive ? " (inactive)" : ""}`}
			className={`m-0 grid w-full min-w-0 grid-cols-2 gap-1 self-center border-0 p-0 ${compact ? "h-[4.35rem]" : "h-[4.7rem]"} ${inactive ? "opacity-55 saturate-50" : ""}`}
		>
			{choices.map(({ algo, inactive: algoInactive, slot }) => {
				const definition = algo
					? PD_ALGOS.find((entry) => entry.value === algo)
					: null;
				if (algo && !definition) return null;
				const selected = selectedLine === lineIndex && selectedAlgo === slot;
				const content = (
					<>
						<span className="flex h-4 w-full shrink-0 items-center bg-cz-inset px-1 font-bold font-mono text-[0.38rem] text-cz-cream/75 uppercase tracking-[0.08em]">
							{lineIndex}
							{slot.toUpperCase()}
						</span>
						<span className="flex min-h-0 flex-1 items-center justify-center text-cz-gold">
							{algo ? (
								<span className={compact ? "scale-[0.62]" : "scale-[0.72]"}>
									<AlgorithmMark value={algo} size="compact" />
								</span>
							) : (
								<span className="font-mono text-xl">—</span>
							)}
						</span>
						<span
							className={`flex h-[1.15rem] w-full shrink-0 items-center justify-center truncate border-cz-border border-t bg-cz-inset px-1 font-bold font-mono text-[0.38rem] uppercase tracking-[0.07em] ${colorClass}`}
						>
							{definition?.label ?? "None"}
						</span>
					</>
				);
				const itemClass = `flex min-w-0 flex-col items-center overflow-hidden border border-cz-border bg-cz-surface ${selected ? `shadow-[inset_0_0_0_1px_currentColor] ${colorClass}` : ""} ${algoInactive && !inactive ? "opacity-40 grayscale" : ""}`;
				return onSelect ? (
					<button
						key={slot}
						type="button"
						aria-label={`Edit line ${lineIndex} algorithm ${slot.toUpperCase()}`}
						aria-pressed={selected}
						disabled={inactive}
						onClick={() => onSelect(lineIndex, slot)}
						className={`${itemClass} focus:outline-none focus:ring-1 focus:ring-current focus:ring-inset`}
					>
						{content}
					</button>
				) : (
					<span key={slot} className={itemClass}>
						{content}
					</span>
				);
			})}
		</fieldset>
	);
}
