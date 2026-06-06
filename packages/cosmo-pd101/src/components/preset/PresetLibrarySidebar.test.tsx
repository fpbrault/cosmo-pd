import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PresetLibrarySidebar from "./PresetLibrarySidebar";

describe("PresetLibrarySidebar", () => {
	it("renders selected local entry actions and triggers callbacks", async () => {
		const onRenameValueChange = vi.fn();
		const onCommitRename = vi.fn();
		const onCommitAuthor = vi.fn();
		const onSelectedTagsChange = vi.fn();
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
				onSelectedTagsChange={onSelectedTagsChange}
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

		const tagSelect = screen.getByLabelText("Preset tags");
		fireEvent.keyDown(tagSelect, { key: "ArrowDown" });
		await userEvent.click(screen.getByRole("option", { name: "pad" }));
		expect(onSelectedTagsChange).toHaveBeenCalledWith(["bass", "pad"]);

		fireEvent.click(screen.getByText("Save"));
		expect(onSave).toHaveBeenCalled();
		fireEvent.click(screen.getByText("Save As"));
		expect(onOpenSaveAs).toHaveBeenCalled();
		fireEvent.click(screen.getByText("Import"));
		expect(onImportClick).toHaveBeenCalled();
		fireEvent.click(screen.getByText("Init Preset"));
		expect(onInitPreset).toHaveBeenCalled();
	});

	it("renders current state actions before selected preset details", () => {
		render(
			<PresetLibrarySidebar
				activeLocalEntryLabel="Mine"
				selectedLocalEntryLabel="Mine"
				selectedLocalEntryAuthor=""
				renameValue="Mine"
				onRenameValueChange={vi.fn()}
				onCommitRename={vi.fn()}
				authorValue=""
				onAuthorValueChange={vi.fn()}
				onCommitAuthor={vi.fn()}
				selectedLocalTags={["bass"]}
				onSelectedTagsChange={vi.fn()}
				onExportSelectedPreset={vi.fn()}
				onDeleteSelectedPreset={vi.fn()}
				saveName=""
				onSaveNameChange={vi.fn()}
				onSave={vi.fn()}
				onOpenSaveAs={vi.fn()}
				onExportCurrentState={vi.fn()}
				onImportClick={vi.fn()}
				onInitPreset={vi.fn()}
				importError={null}
			/>,
		);

		const headings = screen.getAllByRole("heading", { level: 3 });
		expect(headings[0]).toHaveTextContent("Current State");
		expect(headings[1]).toHaveTextContent("Selected Preset");
	});
});
