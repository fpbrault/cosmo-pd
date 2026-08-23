import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { usePresetManager } from "@/context/PresetManagerContext";
import PresetNavigator from "./PresetNavigator";

export type SynthHeaderProps = {
	onBrandInfoClick?: () => void;
	onStepPreset: (direction: -1 | 1) => void;
	isLibraryModeOpen: boolean;
	onLibraryModeChange: (open: boolean) => void;
	trailingContent?: ReactNode;
};

export default function SynthHeader({
	onBrandInfoClick,
	onStepPreset,
	isLibraryModeOpen = false,
	onLibraryModeChange,
	trailingContent,
}: SynthHeaderProps) {
	const { t } = useTranslation("synth");
	const {
		allPresetEntries,
		libraryStatus,
		navigationEntryIds,
		activePresetId,
		activePresetNameBase,
		activePresetName,
		isPresetDirty,
		activatePreset,
		setNavigationEntryIds,
		setPresetFavorite,
		savePreset,
		savePresetAs,
	} = usePresetManager();
	const activeEntry =
		allPresetEntries.find((entry) => entry.id === activePresetId) ?? null;

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
							{t("synthHeader.brandCosmo")}
						</span>
						<span className="font-['Arial_Narrow','Arial',sans-serif] font-black text-[2.1rem] text-transparent uppercase leading-none tracking-[-0.02em] [-webkit-text-stroke:1.5px_var(--color-cz-gold)]">
							{t("synthHeader.brandPd")}
						</span>
					</div>
					<span className="mt-0.75 block h-0.75 w-full rounded-full bg-cz-gold" />
				</div>
			</div>

			<PresetNavigator
				presetCount={navigationEntryIds.length}
				entries={allPresetEntries}
				activeEntry={activeEntry}
				activePresetName={activePresetName}
				activePresetNameBase={activePresetNameBase}
				isPresetDirty={isPresetDirty}
				persistenceDisabled={libraryStatus.state !== "ready"}
				onStepPreset={onStepPreset}
				onActivatePreset={(entryId) => activatePreset({ entryId })}
				onNavigationEntriesChange={setNavigationEntryIds}
				onSetPresetFavorite={setPresetFavorite}
				onSavePreset={savePreset}
				onSavePresetAs={savePresetAs}
				isLibraryModeOpen={isLibraryModeOpen}
				onLibraryModeChange={onLibraryModeChange}
			/>

			<button
				type="button"
				className="group flex flex-col justify-center border-cz-border border-l pl-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cz-light-blue/70"
				aria-label={t("synthHeader.openInfoAria")}
				onClick={onBrandInfoClick}
			>
				<span className="font-mono text-4xs text-cz-light-blue uppercase tracking-[0.3em] transition-colors group-hover:text-cz-cream group-focus-visible:text-cz-cream">
					{t("synthHeader.phaseDistortion")}
				</span>
				<span className="font-mono font-semibold text-cz-cream text-xs uppercase tracking-[0.18em] transition-colors group-hover:text-cz-gold group-focus-visible:text-cz-gold">
					{t("synthHeader.synthesizerLab")}
				</span>
			</button>

			{trailingContent}
		</header>
	);
}
