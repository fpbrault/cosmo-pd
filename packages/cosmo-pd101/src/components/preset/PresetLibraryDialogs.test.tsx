import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PresetLibraryDialogs from "./PresetLibraryDialogs";

describe("PresetLibraryDialogs", () => {
	it("handles save-as dialog interactions", () => {
		const onSaveAsNameChange = vi.fn();
		const onCommitSaveAs = vi.fn();
		const onCancelSaveAs = vi.fn();
		render(
			<PresetLibraryDialogs
				saveAsOpen
				saveAsName="Init"
				onSaveAsNameChange={onSaveAsNameChange}
				onCommitSaveAs={onCommitSaveAs}
				onCancelSaveAs={onCancelSaveAs}
				recoveryConfirmation={null}
				onConfirmRecovery={vi.fn()}
				onCancelRecovery={vi.fn()}
			/>,
		);
		fireEvent.change(screen.getByPlaceholderText("New preset name"), {
			target: { value: "Lead 1" },
		});
		expect(onSaveAsNameChange).toHaveBeenCalled();
		fireEvent.keyDown(screen.getByPlaceholderText("New preset name"), {
			key: "Enter",
		});
		expect(onCommitSaveAs).toHaveBeenCalled();
		const saveAsDialog = screen
			.getByPlaceholderText("New preset name")
			.closest("dialog");
		if (!(saveAsDialog instanceof HTMLDialogElement)) {
			throw new Error("expected save as dialog");
		}
		fireEvent.click(within(saveAsDialog).getByText("Cancel"));
		expect(onCancelSaveAs).toHaveBeenCalled();
	});
});
