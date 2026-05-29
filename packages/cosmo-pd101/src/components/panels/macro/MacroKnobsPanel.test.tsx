import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MacroKnobsPanel from "./MacroKnobsPanel";

const setMacro1 = vi.fn();
const setMacro2 = vi.fn();
const setMacro3 = vi.fn();
const setMacro4 = vi.fn();

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn(
		(
			selector: (state: {
				macro1: number;
				macro2: number;
				macro3: number;
				macro4: number;
				setMacro1: typeof setMacro1;
				setMacro2: typeof setMacro2;
				setMacro3: typeof setMacro3;
				setMacro4: typeof setMacro4;
				macroLabels: [string, string, string, string];
				setMacroLabel: (index: number, label: string) => void;
			}) => unknown,
		) =>
			selector({
				macro1: 0.1,
				macro2: 0.2,
				macro3: 0.3,
				macro4: 0.4,
				setMacro1,
				setMacro2,
				setMacro3,
				setMacro4,
				macroLabels: ["M1", "M2", "M3", "M4"] as [string, string, string, string],
				setMacroLabel: vi.fn(),
			}),
	),
}));

vi.mock("@/components/primitives/Popover", () => ({
	default: ({
		open,
		children,
	}: {
		open: boolean;
		children: React.ReactNode;
	}) => (open ? <div data-testid="macro-label-popover">{children}</div> : null),
}));

vi.mock("@/features/synth/hooks/useMidiLearnTarget", () => ({
	useMidiLearnTarget: vi.fn(() => ({
		onClick: vi.fn(),
		onContextMenu: vi.fn(),
		interactionLocked: false,
		midiLearnState: null,
	})),
}));

vi.mock("@/components/controls/ControlKnob", () => ({
	default: ({
		label,
		onChange,
	}: {
		label: string;
		onChange: (value: number) => void;
	}) => (
		<button
			type="button"
			data-testid={`macro-knob-${label}`}
			onClick={() => onChange(0.75)}
		>
			{label}
		</button>
	),
}));

describe("MacroKnobsPanel", () => {
	it("renders macro knobs and settings button", () => {
		render(<MacroKnobsPanel />);
		expect(screen.getByTestId("macro-knob-M1")).toBeInTheDocument();
		expect(screen.queryByTestId("macro-label-popover")).not.toBeInTheDocument();
		fireEvent.click(screen.getByLabelText("Edit macro labels"));
		expect(screen.getByTestId("macro-label-popover")).toBeInTheDocument();
		fireEvent.click(screen.getByTestId("macro-knob-M1"));
		expect(setMacro1).toHaveBeenCalledWith(0.75);
	});
});
