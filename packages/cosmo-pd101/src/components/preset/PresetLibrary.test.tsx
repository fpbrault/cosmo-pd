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
	starred: false,
};

const entries: PresetEntry[] = [
	{
		id: "builtin-factory-bass",
		label: "Factory Bass",
		type: "builtin",
		source: "cosmo-factory",
		sourceLabel: "Cosmo Library",
		author: "Purr Audio",
		starred: true,
		favorite: false,
		tags: [],
	},
	{
		id: "local-keys",
		label: "Local Keys",
		type: "local",
		source: "user",
		sourceLabel: "User",
		author: "",
		starred: false,
		favorite: false,
		tags: ["warm"],
	},
	{
		id: "library-1",
		label: libraryPreset.name,
		type: "library",
		source: "cz-factory",
		sourceLabel: "Temple Of CZ",
		author: "Casio",
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
		onLoadBuiltin: vi.fn(),
		onLoadLocal: vi.fn(),
		onLoadLibrary: vi.fn(),
		onSavePreset: vi.fn(),
		onDeletePreset: vi.fn(),
		onRenamePreset: vi.fn(),
		onSetPresetAuthor: vi.fn(),
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

	it("routes preset selection to the matching callbacks", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Factory Bass" }));
		fireEvent.click(screen.getByRole("button", { name: "Local Keys" }));
		fireEvent.click(screen.getByRole("button", { name: "Archive Pad" }));

		expect(props.onLoadBuiltin).toHaveBeenCalledWith("Factory Bass");
		expect(props.onLoadLocal).toHaveBeenCalledWith("local-keys");
		expect(props.onLoadLibrary).toHaveBeenCalledWith(libraryPreset);
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

		fireEvent.click(
			screen.getByRole("button", { name: "Create Default Preset" }),
		);
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

		fireEvent.change(screen.getByPlaceholderText("Add tag"), {
			target: { value: "bass" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Add" }));
		expect(props.onSetPresetTags).toHaveBeenCalledWith("local-keys", [
			"warm",
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

		expect(props.onLoadLocal.mock.calls.length).toBeGreaterThan(0);
		expect(props.onLoadLocal).toHaveBeenLastCalledWith("local-keys");
	});

	it("handles Arrow navigation from window-level keydown", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.keyDown(window, { key: "ArrowDown" });

		expect(props.onLoadBuiltin).toHaveBeenCalledTimes(1);
		expect(props.onLoadBuiltin).toHaveBeenNthCalledWith(1, "Factory Bass");
	});

	it("does not navigate when typing in a text input", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		const searchInput = screen.getByPlaceholderText("Search presets");
		searchInput.focus();
		fireEvent.keyDown(searchInput, { key: "ArrowDown" });

		expect(props.onLoadLibrary).not.toHaveBeenCalled();
		expect(props.onLoadBuiltin).not.toHaveBeenCalled();
		expect(props.onLoadLocal).not.toHaveBeenCalled();
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
		activeRow.focus();
		fireEvent.keyDown(activeRow, { key: " " });
		fireEvent.keyUp(activeRow, { key: " " });

		expect(props.onLoadLocal).not.toHaveBeenCalled();

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
