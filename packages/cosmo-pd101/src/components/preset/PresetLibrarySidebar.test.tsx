import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PresetLibrarySidebar from "./PresetLibrarySidebar";

describe("PresetLibrarySidebar", () => {
	it("renders selected local entry actions and triggers callbacks", () => {
		const onRenameValueChange = vi.fn();
		const onCommitRename = vi.fn();
		const onCommitAuthor = vi.fn();
		const onAddTag = vi.fn();
		const onRemoveTag = vi.fn();
		const onSave = vi.fn();
		const onOpenSaveAs = vi.fn();
		const onImportClick = vi.fn();
		const onInitPreset = vi.fn();

		render(
			<PresetLibrarySidebar
				activeLocalEntryLabel="Mine"
				selectedLocalEntryLabel="Mine"
				selectedLocalEntryAuthor=""
				renameValue="Mine"
				onRenameValueChange={onRenameValueChange}
				onCommitRename={onCommitRename}
				authorValue=""
				onAuthorValueChange={vi.fn()}
				onCommitAuthor={onCommitAuthor}
				selectedLocalTags={["bass"]}
				tagDraft="pad"
				tagSuggestions={["pad"]}
				onTagDraftChange={vi.fn()}
				onAddTag={onAddTag}
				onRemoveTag={onRemoveTag}
				onExportSelectedPreset={vi.fn()}
				onDeleteSelectedPreset={vi.fn()}
				saveName=""
				onSaveNameChange={vi.fn()}
				onSave={onSave}
				onOpenSaveAs={onOpenSaveAs}
				onExportCurrentState={vi.fn()}
				onImportClick={onImportClick}
				onInitPreset={onInitPreset}
				importError={null}
			/>,
		);

		fireEvent.change(screen.getByPlaceholderText("Preset name"), {
			target: { value: "New Name" },
		});
		expect(onRenameValueChange).toHaveBeenCalled();
		fireEvent.blur(screen.getByPlaceholderText("Preset name"));
		expect(onCommitRename).toHaveBeenCalled();
		fireEvent.keyDown(screen.getByPlaceholderText("Preset author"), {
			key: "Enter",
		});
		expect(onCommitAuthor).toHaveBeenCalled();
		fireEvent.click(screen.getByText("Add"));
		expect(onAddTag).toHaveBeenCalled();
		fireEvent.click(screen.getByText("bass"));
		expect(onRemoveTag).toHaveBeenCalledWith("bass");
		fireEvent.click(screen.getByText("Save"));
		expect(onSave).toHaveBeenCalled();
		fireEvent.click(screen.getByText("Save As"));
		expect(onOpenSaveAs).toHaveBeenCalled();
		fireEvent.click(screen.getByText("Import"));
		expect(onImportClick).toHaveBeenCalled();
		fireEvent.click(screen.getByText("Create Default Preset"));
		expect(onInitPreset).toHaveBeenCalled();
	});
});
