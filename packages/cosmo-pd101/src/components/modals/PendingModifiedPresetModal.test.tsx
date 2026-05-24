import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PendingModifiedPresetModal } from "./PendingModifiedPresetModal";

describe("PendingModifiedPresetModal", () => {
	it("renders changes and supports save/discard/cancel", () => {
		const onSave = vi.fn();
		const onDiscard = vi.fn();
		const onCancel = vi.fn();
		render(
			<PendingModifiedPresetModal
				pendingPresetChange={{
					activePresetName: "Init",
					activeLocalName: null,
					suggestedName: "Init 2",
					changes: [{ path: "volume", previous: "0.5", next: "0.7" }],
				}}
				onSave={onSave}
				onDiscard={onDiscard}
				onCancel={onCancel}
			/>,
		);
		expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
		fireEvent.click(
			screen.getByRole("button", { name: "Save modified preset" }),
		);
		fireEvent.click(screen.getByRole("button", { name: "Discard" }));
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		expect(onSave).toHaveBeenCalled();
		expect(onDiscard).toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalled();
	});
});
