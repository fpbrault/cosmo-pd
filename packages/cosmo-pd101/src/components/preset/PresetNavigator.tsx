import Button from "@/components/controls/Button";
import type { PresetEntry } from "@/features/synth/types/presetEntry";

type PresetNavigatorProps = {
	allEntries: PresetEntry[];
	activePresetName: string;
	activePresetSource: string;
	onStepPreset: (direction: -1 | 1) => void;
	isLibraryModeOpen?: boolean;
	onLibraryModeChange?: (open: boolean) => void;
};

export default function PresetNavigator({
	allEntries,
	activePresetName,
	activePresetSource,
	onStepPreset,
	isLibraryModeOpen = false,
	onLibraryModeChange,
}: PresetNavigatorProps) {
	const toggleLibrary = () => onLibraryModeChange?.(!isLibraryModeOpen);

	return (
		<div className="relative w-full max-w-3xl">
			<div className="flex items-center gap-1">
				<Button
					type="button"
					className="cz-btn-arrow"
					onClick={() => onStepPreset(-1)}
					disabled={allEntries.length === 0}
					aria-label="Previous preset"
				>
					<svg
						viewBox="0 -960 960 960"
						className="w-10 h-10 fill-cz-cream"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path d="M640-197 200-477l440-280v560Zm-60-280Zm0 171v-342L311-477l269 171Z" />
					</svg>
				</Button>

				<div className="flex flex-1 items-stretch overflow-hidden rounded-xl border border-cz-border bg-cz-inset">
					<button
						type="button"
						className={`relative isolate flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border px-4 py-2 text-center transition ${
							isLibraryModeOpen
								? "border-[#8a959a] bg-[linear-gradient(180deg,#c8d2d5_0%,#bec9cc_52%,#b3bdc1_100%)] text-[#607178] shadow-[inset_0_0_0_1px_rgba(92,107,114,0.48),inset_0_1px_0_rgba(236,241,243,0.26)]"
								: "border-[#818d93] bg-[linear-gradient(180deg,#c2cdd0_0%,#b8c3c7_52%,#aeb8bc_100%)] text-[#5d6d74] shadow-[inset_0_0_0_1px_rgba(84,99,107,0.45),inset_0_1px_0_rgba(226,232,235,0.22)] hover:border-[#95a2a7] hover:bg-[linear-gradient(180deg,#ccd6d9_0%,#c2cdd1_52%,#b8c2c6_100%)]"
						}`}
						onClick={toggleLibrary}
						aria-expanded={isLibraryModeOpen}
						aria-label={`Preset ${activePresetName}. ${isLibraryModeOpen ? "Close library" : "Open library"}`}
					>
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_180%_at_50%_0%,rgba(235,241,244,0.2)_0%,rgba(210,220,225,0.08)_44%,rgba(0,0,0,0)_78%)]"
						/>
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 opacity-26 bg-[linear-gradient(to_bottom,rgba(94,111,118,0.11)_0px,rgba(94,111,118,0.11)_1px,transparent_1px,transparent_3px)]"
						/>
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 opacity-28 bg-[linear-gradient(to_right,rgba(234,240,244,0.08)_1px,transparent_1px)] bg-size-[6px_100%]"
						/>
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-px rounded-md border border-[#6b7c83]/42"
						/>

						<span className="relative truncate text-[1.05rem] leading-[1.05] font-['IBM_Plex_Mono','SFMono-Regular','Consolas','Liberation_Mono','Menlo',monospace] font-semibold uppercase tracking-[0.08em] text-[#54666e] [text-shadow:0_1px_0_rgba(235,242,245,0.24)]">
							{activePresetName}
						</span>
						<span className="relative mt-1 truncate text-[0.58rem] leading-none font-['IBM_Plex_Mono','SFMono-Regular','Consolas','Liberation_Mono','Menlo',monospace] uppercase tracking-[0.28em] text-[#6d7c82]">
							{activePresetSource}
						</span>
					</button>
				</div>

				<Button
					type="button"
					className="cz-btn-arrow"
					onClick={() => onStepPreset(1)}
					disabled={allEntries.length === 0}
					aria-label="Next preset"
				>
					<svg
						viewBox="0 -960 960 960"
						className="w-10 h-10 fill-cz-cream rotate-180"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path d="M640-197 200-477l440-280v560Zm-60-280Zm0 171v-342L311-477l269 171Z" />
					</svg>
				</Button>
			</div>
		</div>
	);
}
