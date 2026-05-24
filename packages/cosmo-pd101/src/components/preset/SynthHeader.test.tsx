import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

describe("SynthHeader", () => {
	it("renders active preset name and handles brand info click", () => {
		const onBrandInfoClick = vi.fn();
		const onStepPreset = vi.fn();
		render(
			<SynthHeader
				allEntries={[
					{
						id: "1",
						label: "Init",
						type: "builtin",
						source: "cosmo-factory",
						sourceLabel: "Cosmo Library",
						author: "Purr Audio",
						starred: false,
						favorite: false,
						tags: [],
					},
				]}
				activeEntryId="1"
				activePresetName="Init"
				onBrandInfoClick={onBrandInfoClick}
				onLoadLocal={vi.fn()}
				onLoadLibrary={vi.fn()}
				onLoadBuiltin={vi.fn()}
				onStepPreset={onStepPreset}
				onSavePreset={vi.fn()}
				onDeletePreset={vi.fn()}
				onRenamePreset={vi.fn()}
				onSetPresetAuthor={vi.fn()}
				onSetPresetFavorite={vi.fn()}
				onSetPresetTags={vi.fn()}
				onExportPreset={vi.fn()}
				onExportCurrentState={vi.fn()}
				onImportPreset={vi.fn()}
				onInitPreset={vi.fn()}
			/>,
		);

		expect(screen.getByText("COSMO")).toBeInTheDocument();
		fireEvent.click(screen.getByLabelText("Open synthesizer lab information"));
		expect(onBrandInfoClick).toHaveBeenCalled();
		fireEvent.click(screen.getByTestId("preset-nav"));
		expect(onStepPreset).toHaveBeenCalledWith(1);
	});
});
