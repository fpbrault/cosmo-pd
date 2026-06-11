import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PresetLibrarySidebar from "./PresetLibrarySidebar";

describe("PresetLibrarySidebar", () => {
	it("renders selected local entry actions and triggers callbacks", async () => {
		const onRenameValueChange = vi.fn();
		const onCommitRename = vi.fn();
		const onCommitAuthor = vi.fn();
		const onCommitDescription = vi.fn();
		const onSelectedTagsChange = vi.fn();
		const onSave = vi.fn();
		const onOpenSaveAs = vi.fn();
		const onImportClick = vi.fn();
		const onInitPreset = vi.fn();

		render(
			<PresetLibrarySidebar
				activeLocalEntryLabel="Mine"
				selectedEntry={{
					id: "mine",
					label: "Mine",
					type: "local",
					source: "user",
					sourceLabel: "User",
					author: "",
					description: "My preset",
					starred: false,
					favorite: false,
					tags: ["bass"],
				}}
				renameValue="Mine"
				onRenameValueChange={onRenameValueChange}
				onCommitRename={onCommitRename}
				authorValue=""
				onAuthorValueChange={vi.fn()}
				onCommitAuthor={onCommitAuthor}
				descriptionValue="My preset"
				onDescriptionValueChange={vi.fn()}
				onCommitDescription={onCommitDescription}
				selectedTags={["bass"]}
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
		fireEvent.keyDown(screen.getByPlaceholderText("Describe this preset"), {
			key: "Enter",
			ctrlKey: true,
		});
		expect(onCommitDescription).toHaveBeenCalled();

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

	it("renders library preset metadata as read-only", () => {
		render(
			<PresetLibrarySidebar
				activeLocalEntryLabel={null}
				selectedEntry={{
					id: "factory",
					label: "Factory Pad",
					type: "library",
					source: "cosmo-factory",
					sourceLabel: "Cosmo Factory Library",
					author: "Purr Audio",
					description: "Slow, spacious, and warm.",
					starred: false,
					favorite: false,
					tags: ["pad"],
				}}
				renameValue=""
				onRenameValueChange={vi.fn()}
				onCommitRename={vi.fn()}
				authorValue=""
				onAuthorValueChange={vi.fn()}
				onCommitAuthor={vi.fn()}
				descriptionValue=""
				onDescriptionValueChange={vi.fn()}
				onCommitDescription={vi.fn()}
				selectedTags={["pad"]}
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

		expect(screen.getByText("Slow, spacious, and warm.")).toBeInTheDocument();
		expect(
			screen.queryByPlaceholderText("Describe this preset"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Delete" }),
		).not.toBeInTheDocument();
	});

	it("renders current state actions before selected preset details", () => {
		render(
			<PresetLibrarySidebar
				activeLocalEntryLabel="Mine"
				selectedEntry={{
					id: "mine",
					label: "Mine",
					type: "local",
					source: "user",
					sourceLabel: "User",
					author: "",
					description: "",
					starred: false,
					favorite: false,
					tags: ["bass"],
				}}
				renameValue="Mine"
				onRenameValueChange={vi.fn()}
				onCommitRename={vi.fn()}
				authorValue=""
				onAuthorValueChange={vi.fn()}
				onCommitAuthor={vi.fn()}
				descriptionValue=""
				onDescriptionValueChange={vi.fn()}
				onCommitDescription={vi.fn()}
				selectedTags={["bass"]}
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
