import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FxConsoleDrawer from "./FxConsoleDrawer";

const reorderFxSlots = vi.fn();

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn(
		(selector: (state: { reorderFxSlots: typeof reorderFxSlots }) => unknown) =>
			selector({ reorderFxSlots }),
	),
}));

vi.mock("../slot/FxSlotFrame", () => ({
	default: ({ slot }: { slot: number }) => (
		<div data-testid={`fx-slot-${slot}`} />
	),
}));

describe("FxConsoleDrawer", () => {
	it("renders all 6 slot frames", () => {
		const { getByTestId } = render(<FxConsoleDrawer />);
		for (let slot = 0; slot < 6; slot++) {
			expect(getByTestId(`fx-slot-${slot}`)).toBeInTheDocument();
		}
	});
});
