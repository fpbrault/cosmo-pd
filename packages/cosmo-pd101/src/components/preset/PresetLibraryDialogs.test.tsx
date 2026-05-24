import { fireEvent, render, screen } from "@testing-library/react";
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
		fireEvent.click(screen.getByText("Cancel"));
		expect(onCancelSaveAs).toHaveBeenCalled();
	});
});
