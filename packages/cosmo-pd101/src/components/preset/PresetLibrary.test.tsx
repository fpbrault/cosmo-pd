import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import PresetLibrary from "./PresetLibrary";

const libraryPreset: LibraryPreset = {
	id: "library-1",
	name: "Archive Pad",
};

const entries: PresetEntry[] = [
	{
		id: "builtin:factory-bass",
		label: "Factory Bass",
		type: "builtin",
		sourceLabel: "Built-in",
		starred: true,
		favorite: false,
		category: "",
		tags: [],
	},
	{
		id: "local:local-keys",
		label: "Local Keys",
		type: "local",
		sourceLabel: "User",
		starred: false,
		favorite: false,
		category: "keys",
		tags: ["warm"],
	},
	{
		id: "library:archive-pad",
		label: libraryPreset.name,
		type: "library",
		sourceLabel: "CZ library",
		starred: false,
		favorite: false,
		category: "",
		tags: [],
		preset: libraryPreset,
	},
];

function createProps() {
	return {
		allEntries: entries,
		showLibraryPresets: true,
		onToggleLibraryPresets: vi.fn(),
		activeEntryId: "local:local-keys",
		activePresetName: "Local Keys",
		onLoadBuiltin: vi.fn(),
		onLoadLocal: vi.fn(),
		onLoadLibrary: vi.fn(),
		onSavePreset: vi.fn(),
		onDeletePreset: vi.fn(),
		onRenamePreset: vi.fn(),
		onSetPresetFavorite: vi.fn(),
		onSetPresetCategory: vi.fn(),
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
		expect(props.onLoadLocal).toHaveBeenCalledWith("Local Keys");
		expect(props.onLoadLibrary).toHaveBeenCalledWith(libraryPreset);
	});

	it("saves, exports, imports, initializes, renames, and deletes from full-screen controls", async () => {
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

		const saveInput = screen.getByPlaceholderText("Export file name");
		fireEvent.change(saveInput, { target: { value: "  Snapshot  " } });
		fireEvent.click(
			screen.getByRole("button", { name: "Export current state" }),
		);
		expect(props.onExportCurrentState).toHaveBeenCalledWith("Snapshot");

		fireEvent.click(screen.getByRole("button", { name: "Init" }));
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

		fireEvent.click(screen.getByRole("button", { name: "Rename Local Keys" }));
		fireEvent.change(screen.getByDisplayValue("Local Keys"), {
			target: { value: "  Renamed Keys  " },
		});
		fireEvent.click(screen.getByRole("button", { name: "Confirm rename" }));
		expect(props.onRenamePreset).toHaveBeenCalledWith(
			"Local Keys",
			"Renamed Keys",
		);

		fireEvent.click(screen.getByRole("button", { name: "Delete Local Keys" }));
		fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));
		expect(props.onDeletePreset).toHaveBeenCalledWith("Local Keys");
	});

	it("supports keyboard navigation in the list", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		const list = screen.getByRole("listbox", { name: "Preset library" });
		fireEvent.keyDown(list, { key: "ArrowDown" });
		fireEvent.keyDown(list, { key: "End" });
		fireEvent.keyDown(list, { key: "Enter" });

		expect(props.onLoadLocal.mock.calls.length).toBeGreaterThan(0);
		expect(props.onLoadLocal).toHaveBeenLastCalledWith("Local Keys");
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
		const previousBeamer = (
			window as Window & { __BEAMER__?: { emit?: () => void } }
		).__BEAMER__;
		(window as Window & { __BEAMER__?: { emit?: () => void } }).__BEAMER__ = {
			emit: () => {},
		};

		render(<PresetLibrary {...props} />);
		const activeRow = screen.getByRole("button", { name: "Local Keys" });
		activeRow.focus();
		fireEvent.keyDown(activeRow, { key: " " });
		fireEvent.keyUp(activeRow, { key: " " });

		expect(props.onLoadLocal).not.toHaveBeenCalled();

		(window as Window & { __BEAMER__?: { emit?: () => void } }).__BEAMER__ =
			previousBeamer;
	});

	it("clears modal state when dialogs receive a native cancel event", () => {
		const props = createProps();
		render(<PresetLibrary {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Rename Local Keys" }));
		const renameDialog = screen.getByText("Rename preset").closest("dialog");
		if (!(renameDialog instanceof HTMLDialogElement)) {
			throw new Error("expected rename dialog");
		}
		fireEvent(
			renameDialog,
			new Event("cancel", { bubbles: false, cancelable: true }),
		);
		expect(renameDialog.open).toBe(false);

		fireEvent.click(screen.getByRole("button", { name: "Delete Local Keys" }));
		const deleteDialog = screen.getByText("Delete preset?").closest("dialog");
		if (!(deleteDialog instanceof HTMLDialogElement)) {
			throw new Error("expected delete dialog");
		}
		fireEvent(
			deleteDialog,
			new Event("cancel", { bubbles: false, cancelable: true }),
		);
		expect(deleteDialog.open).toBe(false);
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
				activeEntryId="builtin:factory-bass"
				activePresetName="Factory Bass"
			/>,
		);

		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Save As" })).toBeEnabled();
	});
});
