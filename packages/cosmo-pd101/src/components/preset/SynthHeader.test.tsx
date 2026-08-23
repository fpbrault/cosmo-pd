import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PresetManagerProvider } from "@/context/PresetManagerContext";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import SynthHeader from "./SynthHeader";

vi.mock("./PresetNavigator", () => ({
	default: ({
		onStepPreset,
	}: {
		onStepPreset: (direction: -1 | 1) => void;
	}) => (
		<button
			type="button"
			data-testid="preset-nav"
			onClick={() => onStepPreset(1)}
		>
			nav
		</button>
	),
}));

function renderWithProvider(element: React.ReactElement) {
	const entries: PresetEntry[] = [
		{
			id: "1",
			label: "Init",
			type: "library",
			source: "cosmo-factory",
			sourceLabel: "Cosmo Factory Library",
			author: "Purr Audio",
			description: "",
			starred: false,
			favorite: false,
			tags: [],
		},
	];

	return render(
		<PresetManagerProvider
			value={{
				allPresetEntries: entries,
				libraryStatus: { state: "ready" },
				navigationEntryIds: entries.map((entry) => entry.id),
				activePresetId: "1",
				activePresetNameBase: "Init",
				activePresetName: "Init",
				isPresetDirty: false,
				syncExternalSelection: vi.fn(),
				activatePreset: vi.fn(),
				setNavigationEntryIds: vi.fn(),
				stepPreset: vi.fn(),
				savePreset: vi.fn(),
				savePresetAs: vi.fn(),
				deletePreset: vi.fn(),
				renamePreset: vi.fn(),
				setPresetAuthor: vi.fn(),
				setPresetDescription: vi.fn(),
				setPresetFavorite: vi.fn(),
				setPresetTags: vi.fn(),
				initPreset: vi.fn(),
				exportPreset: vi.fn(),
				importPreset: vi.fn(),
				importPresetFiles: vi.fn(),
				exportCurrentState: vi.fn(),
				recomputeDirtyState: vi.fn(),
				reloadLibrary: vi.fn(),
				retryLibrary: vi.fn(),
				repairLibrary: vi.fn(),
				rebuildLibrary: vi.fn(),
			}}
		>
			{element}
		</PresetManagerProvider>,
	);
}

describe("SynthHeader", () => {
	it("renders active preset name and handles brand info click", () => {
		const onBrandInfoClick = vi.fn();
		const onStepPreset = vi.fn();
		renderWithProvider(
			<SynthHeader
				onBrandInfoClick={onBrandInfoClick}
				onStepPreset={onStepPreset}
				isLibraryModeOpen={false}
				onLibraryModeChange={vi.fn()}
			/>,
		);

		expect(screen.getByText("COSMO")).toBeInTheDocument();
		fireEvent.click(screen.getByLabelText("Open synthesizer lab information"));
		expect(onBrandInfoClick).toHaveBeenCalled();
		fireEvent.click(screen.getByTestId("preset-nav"));
		expect(onStepPreset).toHaveBeenCalledWith(1);
	});
});
