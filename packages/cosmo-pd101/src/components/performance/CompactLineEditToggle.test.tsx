import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import CompactLineEditToggle from "./CompactLineEditToggle";

describe("CompactLineEditToggle", () => {
	beforeEach(() => {
		useSynthUiStore.setState({ simpleEditedLine: 1 });
	});

	it("shares the edited line through the Simple UI store", () => {
		render(<CompactLineEditToggle line1Editable={true} line2Editable={true} />);

		fireEvent.click(screen.getByRole("button", { name: "Edit line 2" }));
		expect(useSynthUiStore.getState().simpleEditedLine).toBe(2);
	});

	it("disables inactive lines and selects the remaining active line", async () => {
		render(
			<CompactLineEditToggle line1Editable={false} line2Editable={true} />,
		);

		expect(screen.getByRole("button", { name: "Edit line 1" })).toBeDisabled();
		await waitFor(() => {
			expect(useSynthUiStore.getState().simpleEditedLine).toBe(2);
		});
	});
});
