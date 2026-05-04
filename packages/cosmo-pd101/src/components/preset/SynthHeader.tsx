import type { ReactNode } from "react";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import PresetNavigator from "./PresetNavigator";

export type SynthHeaderProps = {
	allEntries: PresetEntry[];
	showLibraryPresets: boolean;
	onToggleLibraryPresets: () => void;
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
	onLoadLocal: (name: string) => void;
	onLoadLibrary: (preset: LibraryPreset) => void;
	onLoadBuiltin: (name: string) => void;
	onStepPreset: (direction: -1 | 1) => void;
	onSavePreset: (name: string) => void;
	onDeletePreset: (name: string) => void;
	onRenamePreset: (oldName: string, newName: string) => void;
	onSetPresetFavorite: (name: string, favorite: boolean) => void;
	onSetPresetCategory: (name: string, category: string) => void;
	onSetPresetTags: (name: string, tags: string[]) => void;
	onExportPreset: (name: string) => void;
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
	const activePresetSource = activeEntry?.sourceLabel ?? "Current State";

	return (
		<header className="shrink-0 flex gap-3 border-b-4 border-cz-border bg-cz-body px-8 py-2 shadow-inner flex-row items-center justify-between">
			{/* Hardware nameplate logo */}
			<div className="flex items-center gap-4 shrink-0">
				<div className="flex flex-col items-start leading-none select-none">
					<div className="flex items-baseline gap-2">
						<span
							className="text-[2.1rem] font-black uppercase leading-none text-cz-cream"
							style={{ fontFamily: "'Michroma', sans-serif" }}
						>
							COSMO
						</span>
						<span className="text-[2.1rem] font-black uppercase leading-none font-['Arial_Narrow','Arial',sans-serif] tracking-[-0.02em] [-webkit-text-stroke:1.5px_var(--color-cz-gold)] text-transparent">
							PD-101
						</span>
					</div>
					<span className="mt-0.75 block h-0.75 w-full bg-cz-gold rounded-full" />
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
				className="group flex flex-col justify-center border-l border-cz-border pl-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cz-light-blue/70"
				aria-label="Open synthesizer lab information"
				onClick={onBrandInfoClick}
			>
				<span className="text-4xs font-mono uppercase tracking-[0.3em] text-cz-light-blue transition-colors group-hover:text-cz-cream group-focus-visible:text-cz-cream">
					Phase Distortion
				</span>
				<span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-cz-cream transition-colors group-hover:text-cz-gold group-focus-visible:text-cz-gold">
					Synthesizer Lab
				</span>
			</button>

			{trailingContent}
		</header>
	);
}
