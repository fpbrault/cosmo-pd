import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFxSlotContext } from "./FxSlotContext";
import FxSlotFrame from "./FxSlotFrame";

const setFxSlotType = vi.fn();

vi.mock("@dnd-kit/sortable", () => ({
	defaultAnimateLayoutChanges: vi.fn(() => true),
	useSortable: vi.fn(() => ({
		attributes: {},
		listeners: {},
		setNodeRef: vi.fn(),
		transform: null,
		transition: undefined,
		isDragging: false,
	})),
}));

vi.mock("@dnd-kit/utilities", () => ({
	CSS: {
		Transform: {
			toString: () => undefined,
		},
	},
}));

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn((selector) =>
		selector({
			fxSlots: [
				{ type: "delay", params: { enabled: true } },
				{ type: "empty", params: {} },
				{ type: "empty", params: {} },
				{ type: "empty", params: {} },
				{ type: "empty", params: {} },
				{ type: "empty", params: {} },
			],
			setFxSlotType,
		}),
	),
}));

vi.mock("../modules/core/FxSlotModuleRenderer", () => ({
	default: () => {
		const slotContext = useFxSlotContext();
		return (
			<div data-testid="fx-slot-module-renderer">
				{slotContext?.typeSelector}
			</div>
		);
	},
}));

describe("FxSlotFrame", () => {
	it("shows a visible effect-type pill and keeps the selector working", () => {
		render(<FxSlotFrame slot={0} />);

		fireEvent.click(
			screen.getByRole("button", { name: "Change effect type (Delay)" }),
		);

		expect(
			screen.getByRole("dialog", { name: "Select effect type" }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Delay" })).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Chorus" }));

		expect(setFxSlotType).toHaveBeenCalledWith(0, "chorus");
	});
});
