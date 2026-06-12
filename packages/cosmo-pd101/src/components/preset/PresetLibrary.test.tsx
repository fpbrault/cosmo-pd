import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import PresetLibrary from "./PresetLibrary";

const libraryPreset: LibraryPreset = {
	id: "library-1",
	name: "Archive Pad",
	source: "cz-factory",
	author: "Casio",
	description: "A soft archival pad.",
	starred: false,
	bankId: "cz-factory",
	bankName: "Temple Of CZ",
};

const entries: PresetEntry[] = [
	{
		id: "builtin-factory-bass",
		label: "Factory Bass",
		type: "library",
		source: "cosmo-factory",
		sourceLabel: "Cosmo Factory Library",
		bankId: "cosmo-factory",
		bankName: "Cosmo Factory Library",
		author: "Purr Audio",
		description: "A bold factory bass.",
		starred: true,
		favorite: false,
		tags: [],
		preset: {
			id: "builtin-factory-bass",
			name: "Factory Bass",
			source: "cosmo-factory",
			author: "Purr Audio",
			description: "A bold factory bass.",
			starred: true,
			bankId: "cosmo-factory",
			bankName: "Cosmo Factory Library",
		},
	},
	{
		id: "local-keys",
		label: "Local Keys",
		type: "local",
		source: "user",
		sourceLabel: "User",
		bankId: null,
		bankName: null,
		author: "",
		description: "My custom keys.",
		starred: false,
		favorite: false,
		tags: ["pad"],
	},
	{
		id: "library-1",
		label: libraryPreset.name,
		type: "library",
		source: "cz-factory",
		sourceLabel: "Temple Of CZ",
		bankId: "cz-factory",
		bankName: "Temple Of CZ",
		author: "Casio",
		description: "A soft archival pad.",
		starred: false,
		favorite: false,
		tags: [],
		preset: libraryPreset,
	},
];

function createProps() {
	return {
		allEntries: entries,
		activeEntryId: "local-keys",
		activePresetName: "Local Keys",
		onActivatePreset: vi.fn(),
		onSavePreset: vi.fn(),
		onDeletePreset: vi.fn(),
		onRenamePreset: vi.fn(),
		onSetPresetAuthor: vi.fn(),
		onSetPresetDescription: vi.fn(),
		onSetPresetFavorite: vi.fn(),
		onSetPresetTags: vi.fn(),
		onExportPreset: vi.fn(),
		onExportCurrentState: vi.fn(),
		onImportPreset: vi.fn(),
		onInitPreset: vi.fn(),
		onSavePendingPresetChange: vi.fn(),
		onDiscardPendingPresetChange: vi.fn(),
		onCancelPendingPresetChange: vi.fn(),
		onClose: vi.fn(),
	};
}

describe("PresetLibrary", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("routes preset selection through one activation callback", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Factory Bass" }));
		fireEvent.click(screen.getByRole("button", { name: "Local Keys" }));
		fireEvent.click(screen.getByRole("button", { name: "Archive Pad" }));

		expect(props.onActivatePreset).toHaveBeenNthCalledWith(1, {
			entryId: "builtin-factory-bass",
		});
		expect(props.onActivatePreset).toHaveBeenNthCalledWith(2, {
			entryId: "local-keys",
		});
		expect(props.onActivatePreset).toHaveBeenNthCalledWith(3, {
			entryId: "library-1",
		});
	});

	it("does not republish unchanged navigation entry ids on rerender", () => {
		const props = {
			...createProps(),
			onNavigationEntriesChange: vi.fn(),
		};
		const { rerender } = render(<PresetLibrary {...props} />);

		expect(props.onNavigationEntriesChange).toHaveBeenCalledTimes(1);
		expect(props.onNavigationEntriesChange).toHaveBeenLastCalledWith([
			"builtin-factory-bass",
			"library-1",
			"local-keys",
		]);

		rerender(<PresetLibrary {...props} />);

		expect(props.onNavigationEntriesChange).toHaveBeenCalledTimes(1);
	});

	it("matches preset descriptions in search", () => {
		render(<PresetLibrary {...createProps()} />);

		fireEvent.change(screen.getByPlaceholderText("Search presets"), {
			target: { value: "bold factory" },
		});

		expect(
			screen.getByRole("button", { name: "Factory Bass" }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Archive Pad" }),
		).not.toBeInTheDocument();
	});

	it("saves, exports, imports, initializes, renames, edits tags, and deletes from library controls", async () => {
		const props = createProps();
		class MockFileReader {
			public onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

			readAsText() {
				this.onload?.({
					target: { result: '{"schemaVersion":1}' },
				} as ProgressEvent<FileReader>);
			}
		}
		vi.stubGlobal("FileReader", MockFileReader);

		const { container } = render(<PresetLibrary {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Save" }));
		expect(props.onSavePreset).toHaveBeenCalledWith("Local Keys");

		fireEvent.click(screen.getByRole("button", { name: "Save As" }));
		const saveAsInput = screen.getByPlaceholderText("New preset name");
		fireEvent.change(saveAsInput, { target: { value: "  New Patch  " } });
		fireEvent.click(screen.getByRole("button", { name: "Confirm save as" }));
		expect(props.onSavePreset).toHaveBeenCalledWith("New Patch");

		fireEvent.click(screen.getByRole("button", { name: "Init Preset" }));
		expect(props.onInitPreset).toHaveBeenCalled();

		const fileInput = container.querySelector('input[type="file"]');
		if (!(fileInput instanceof HTMLInputElement)) {
			throw new Error("expected hidden file input");
		}
		fireEvent.change(fileInput, {
			target: {
				files: [new File(["{}"], "imported-patch.json")],
			},
		});
		await waitFor(() => {
			expect(props.onImportPreset).toHaveBeenCalledWith(
				'{"schemaVersion":1}',
				"imported-patch",
			);
		});

		const renameInput = screen.getByPlaceholderText("Preset name");
		fireEvent.change(renameInput, {
			target: { value: "  Renamed Keys  " },
		});
		fireEvent.blur(renameInput);
		expect(props.onRenamePreset).toHaveBeenCalledWith(
			"local-keys",
			"Renamed Keys",
		);
		const authorInput = screen.getByPlaceholderText("Preset author");
		fireEvent.change(authorInput, { target: { value: "Jane Doe" } });
		fireEvent.blur(authorInput);
		expect(props.onSetPresetAuthor).toHaveBeenCalledWith(
			"local-keys",
			"Jane Doe",
		);
		const descriptionInput = screen.getByPlaceholderText(
			"Describe this preset",
		);
		fireEvent.change(descriptionInput, {
			target: { value: "  Warm layered keys  " },
		});
		fireEvent.blur(descriptionInput);
		expect(props.onSetPresetDescription).toHaveBeenCalledWith(
			"local-keys",
			"Warm layered keys",
		);

		fireEvent.keyDown(screen.getByLabelText("Preset tags"), {
			key: "ArrowDown",
		});
		fireEvent.click(screen.getByRole("option", { name: "bass" }));
		expect(props.onSetPresetTags).toHaveBeenCalledWith("local-keys", [
			"pad",
			"bass",
		]);

		fireEvent.click(screen.getByRole("button", { name: "Delete" }));
		expect(props.onDeletePreset).toHaveBeenCalledWith("local-keys");
	});

	it("supports keyboard navigation in the list", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		const list = screen.getByRole("listbox", { name: "Preset library" });
		fireEvent.keyDown(list, { key: "ArrowDown" });
		fireEvent.keyDown(list, { key: "End" });
		fireEvent.keyDown(list, { key: "Enter" });

		expect(props.onActivatePreset.mock.calls.length).toBeGreaterThan(0);
		expect(props.onActivatePreset).toHaveBeenLastCalledWith({
			entryId: "local-keys",
		});
	});

	it("handles Arrow navigation from window-level keydown", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.keyDown(window, { key: "ArrowDown" });

		expect(props.onActivatePreset).toHaveBeenCalledTimes(1);
		expect(props.onActivatePreset).toHaveBeenNthCalledWith(1, {
			entryId: "builtin-factory-bass",
		});
	});

	it("does not navigate when typing in a text input", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		const searchInput = screen.getByPlaceholderText("Search presets");
		searchInput.focus();
		fireEvent.keyDown(searchInput, { key: "ArrowDown" });

		expect(props.onActivatePreset).not.toHaveBeenCalled();
	});

	it("does not trigger focused row action on space in plugin mode", () => {
		const props = createProps();
		const previousSetParams = (
			window as Window & { __czSetParams?: (json: string) => void }
		).__czSetParams;
		(
			window as Window & { __czSetParams?: (json: string) => void }
		).__czSetParams = () => {};

		render(<PresetLibrary {...props} />);
		const activeRow = screen.getByRole("button", { name: "Local Keys" });
		const list = screen.getByRole("listbox", { name: "Preset library" });
		activeRow.focus();
		fireEvent.keyDown(activeRow, { key: " " });
		fireEvent.keyUp(activeRow, { key: " " });

		expect(props.onActivatePreset).not.toHaveBeenCalled();
		expect(list).toHaveFocus();

		(
			window as Window & { __czSetParams?: (json: string) => void }
		).__czSetParams = previousSetParams;
	});

	it("closes the save-as modal when it receives a native cancel event", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Save As" }));
		const saveAsDialog = screen.getByText("Save preset as").closest("dialog");
		if (!(saveAsDialog instanceof HTMLDialogElement)) {
			throw new Error("expected save-as dialog");
		}
		fireEvent(
			saveAsDialog,
			new Event("cancel", { bubbles: false, cancelable: true }),
		);
		expect(saveAsDialog.open).toBe(false);
	});

	it("can filter the list down to user presets only", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "User Only" }));

		expect(
			screen.queryByRole("button", { name: "Factory Bass" }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Archive Pad" }),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Local Keys" }),
		).toBeInTheDocument();
	});

	it("toggles and clears author filters with radio", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(
			screen.getByRole("radio", { name: "Purr Audio", hidden: true }),
		);

		expect(
			screen.getByRole("button", { name: "Factory Bass" }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Local Keys" }),
		).not.toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", { name: "Clear author filters" }),
		);

		expect(
			screen.getByRole("button", { name: "Local Keys" }),
		).toBeInTheDocument();
	});

	it("toggles and clears bank filters with radio", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(
			screen.getByRole("radio", { name: "Temple Of CZ", hidden: true }),
		);

		expect(
			screen.queryByRole("button", { name: "Factory Bass" }),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Archive Pad" }),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Clear bank filters" }));

		expect(
			screen.getByRole("button", { name: "Factory Bass" }),
		).toBeInTheDocument();
	});

	it("toggles and clears tag filters with checkboxes", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(
			screen.getAllByRole("checkbox", { name: "pad", hidden: true })[0],
		);

		expect(
			screen.queryByRole("button", { name: "Factory Bass" }),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Local Keys" }),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Clear tag filters" }));

		expect(
			screen.getByRole("button", { name: "Factory Bass" }),
		).toBeInTheDocument();
	});

	it("disables bank options that would yield zero results with active filters", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(
			screen.getByRole("radio", { name: "Purr Audio", hidden: true }),
		);

		const disabledBank = screen.getByRole("radio", {
			name: "Temple Of CZ",
			hidden: true,
		});
		expect(disabledBank).toBeDisabled();
	});

	it("closes back to the synth view", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Return" }));

		expect(props.onClose).toHaveBeenCalled();
	});

	it("disables overwrite save when active preset is not local", () => {
		const props = createProps();
		render(
			<PresetLibrary
				{...props}
				activeEntryId="builtin-factory-bass"
				activePresetName="Factory Bass"
			/>,
		);

		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Save As" })).toBeEnabled();
	});

	it("filters presets when typing in the search box", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		expect(
			screen.getByRole("button", { name: "Factory Bass" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Local Keys" }),
		).toBeInTheDocument();

		fireEvent.change(screen.getByPlaceholderText("Search presets"), {
			target: { value: "keys" },
		});

		expect(
			screen.queryByRole("button", { name: "Factory Bass" }),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Local Keys" }),
		).toBeInTheDocument();
	});

	it("clears the preset search input", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.change(screen.getByPlaceholderText("Search presets"), {
			target: { value: "keys" },
		});
		fireEvent.click(
			screen.getByRole("button", { name: "Clear preset search" }),
		);

		expect(
			screen.getByRole("button", { name: "Factory Bass" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Local Keys" }),
		).toBeInTheDocument();
	});

	it("toggles favorite on a local preset", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "Favorite Local Keys" }),
		);

		expect(props.onSetPresetFavorite).toHaveBeenCalledWith("local-keys", true);
	});

	it("shows empty state when no presets are available", () => {
		const props = createProps();
		render(<PresetLibrary {...props} allEntries={[]} />);

		expect(screen.getByText("No presets available.")).toBeInTheDocument();
	});

	it("shows factory-only recovery controls for a degraded database", () => {
		const props = createProps();
		const confirm = vi.fn().mockReturnValue(true);
		const repairLibrary = vi.fn();
		vi.stubGlobal("confirm", confirm);
		render(
			<PresetLibrary
				{...props}
				libraryStatus={{
					state: "degraded",
					message: "missing bank_id column",
				}}
				onRetryLibrary={vi.fn()}
				onRepairLibrary={repairLibrary}
				onRebuildLibrary={vi.fn()}
			/>,
		);

		expect(
			screen.getByText("Preset library database unavailable"),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Factory Bass" })).toBeEnabled();

		fireEvent.click(screen.getByRole("button", { name: "Repair Database" }));
		expect(confirm).toHaveBeenCalled();
		expect(repairLibrary).toHaveBeenCalled();

		fireEvent.click(
			screen.getByRole("button", { name: "Favorite Local Keys" }),
		);
		expect(props.onSetPresetFavorite).not.toHaveBeenCalled();
	});

	it("shows loading state separately from an empty library", () => {
		render(
			<PresetLibrary
				{...createProps()}
				allEntries={[]}
				libraryStatus={{ state: "loading" }}
			/>,
		);

		expect(screen.getByText("Loading presets...")).toBeInTheDocument();
		expect(screen.queryByText("No presets available.")).not.toBeInTheDocument();
	});

	it("shows error on invalid JSON import", () => {
		const props = createProps();
		props.onImportPreset = vi.fn(() => {
			throw new Error("invalid");
		});
		class ErrorFileReader {
			public onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

			readAsText() {
				this.onload?.({
					target: { result: "not-json" },
				} as ProgressEvent<FileReader>);
			}
		}
		vi.stubGlobal("FileReader", ErrorFileReader);

		const { container } = render(<PresetLibrary {...props} />);

		const fileInput = container.querySelector('input[type="file"]');
		if (!(fileInput instanceof HTMLInputElement)) {
			throw new Error("expected hidden file input");
		}
		fireEvent.change(fileInput, {
			target: {
				files: [new File(["not-json"], "bad.json")],
			},
		});

		expect(screen.getByText("Invalid preset file.")).toBeInTheDocument();
	});
});
