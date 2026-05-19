import type { ReactNode } from "react";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import type { PresetTagOptions } from "@/lib/synth/presetTags";
import PresetNavigator from "./PresetNavigator";

export type SynthHeaderProps = {
	allEntries: PresetEntry[];
	activeEntryId: string | null;
	activePresetName: string;
	onBrandInfoClick?: () => void;
	pendingPresetChange?: {
		activePresetName: string;
		activeLocalName: string | null;
		suggestedName: string;
		changes: Array<{
			path: string;
			previous: string;
			next: string;
		}>;
	} | null;
	onLoadLocal: (id: string) => void;
	onLoadLibrary: (preset: LibraryPreset) => void;
	onLoadBuiltin: (name: string) => void;
	onStepPreset: (direction: -1 | 1) => void;
	onSavePreset: (name: string) => void;
	onDeletePreset: (id: string) => void;
	onRenamePreset: (id: string, newName: string) => void;
	onSetPresetAuthor: (id: string, author: string) => void;
	onSetPresetFavorite: (id: string, favorite: boolean) => void;
	onSetPresetTags: (id: string, tags: PresetTagOptions[]) => void;
	onExportPreset: (id: string) => void;
	onExportCurrentState: (name: string) => void;
	onImportPreset: (json: string, filename: string) => void;
	onInitPreset: () => void;
	onSavePendingPresetChange?: (name?: string) => void;
	onDiscardPendingPresetChange?: () => void;
	onCancelPendingPresetChange?: () => void;
	isLibraryModeOpen?: boolean;
	onLibraryModeChange?: (open: boolean) => void;
	trailingContent?: ReactNode;
};

export default function SynthHeader({
	allEntries,
	activeEntryId,
	activePresetName,
	onBrandInfoClick,
	onStepPreset,
	isLibraryModeOpen = false,
	onLibraryModeChange,
	trailingContent,
}: SynthHeaderProps) {
	const activeEntry = allEntries.find((entry) => entry.id === activeEntryId);
	const activePresetSource =
		activeEntry?.author.trim() ||
		(activeEntry ? "Unknown Author" : "Current State");

	return (
		<header className="flex shrink-0 flex-row items-center justify-between gap-3 border-cz-border border-b-4 bg-cz-body px-8 py-2 shadow-inner">
			{/* Hardware nameplate logo */}
			<div className="flex shrink-0 items-center gap-4">
				<div className="flex select-none flex-col items-start leading-none">
					<div className="flex items-baseline gap-2">
						<span
							className="font-black text-[2.1rem] text-cz-cream uppercase leading-none"
							style={{ fontFamily: "'Michroma', sans-serif" }}
						>
							COSMO
						</span>
						<span className="font-['Arial_Narrow','Arial',sans-serif] font-black text-[2.1rem] text-transparent uppercase leading-none tracking-[-0.02em] [-webkit-text-stroke:1.5px_var(--color-cz-gold)]">
							PD-101
						</span>
					</div>
					<span className="mt-0.75 block h-0.75 w-full rounded-full bg-cz-gold" />
				</div>
			</div>

			<PresetNavigator
				allEntries={allEntries}
				activePresetName={activePresetName}
				activePresetSource={activePresetSource}
				onStepPreset={onStepPreset}
				isLibraryModeOpen={isLibraryModeOpen}
				onLibraryModeChange={onLibraryModeChange}
			/>

			<button
				type="button"
				className="group flex flex-col justify-center border-cz-border border-l pl-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cz-light-blue/70"
				aria-label="Open synthesizer lab information"
				onClick={onBrandInfoClick}
			>
				<span className="font-mono text-4xs text-cz-light-blue uppercase tracking-[0.3em] transition-colors group-hover:text-cz-cream group-focus-visible:text-cz-cream">
					Phase Distortion
				</span>
				<span className="font-mono font-semibold text-cz-cream text-xs uppercase tracking-[0.18em] transition-colors group-hover:text-cz-gold group-focus-visible:text-cz-gold">
					Synthesizer Lab
				</span>
			</button>

			{trailingContent}
		</header>
	);
}
