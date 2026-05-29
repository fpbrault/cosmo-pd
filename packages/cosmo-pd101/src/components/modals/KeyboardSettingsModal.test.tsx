import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KeyboardSettingsPopover } from "./KeyboardSettingsPopover";

const state = {
	keyboardOctaves: 2,
	keyboardRange: 0,
	keyboardInputMode: "velocity" as const,
	setKeyboardOctaves: vi.fn(),
	setKeyboardRange: vi.fn(),
	setKeyboardInputMode: vi.fn(),
};

vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn((selector: (s: typeof state) => unknown) =>
		selector(state),
	),
}));

describe("KeyboardSettingsPopover", () => {
	it("updates range/octaves/input mode", () => {
		const ref = { current: document.createElement("button") };
		render(<KeyboardSettingsPopover open triggerRef={ref} onClose={vi.fn()} />);
		fireEvent.click(screen.getByRole("button", { name: "+2" }));
		fireEvent.click(screen.getByRole("button", { name: "5" }));
		fireEvent.click(screen.getByRole("button", { name: "Aftertouch" }));
		expect(state.setKeyboardRange).toHaveBeenCalledWith(2);
		expect(state.setKeyboardOctaves).toHaveBeenCalledWith(5);
		expect(state.setKeyboardInputMode).toHaveBeenCalledWith("aftertouch");
	});
});
