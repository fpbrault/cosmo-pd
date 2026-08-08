import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SynthSidebarButtons from "./SynthSidebarButtons";

const setMainPanelMode = vi.fn();
const setGlobalPanelOpenMock = vi.fn();
const setMidiLearnOpenMock = vi.fn();
const setFxSlotType = vi.fn();
const setFxSlotEnabled = vi.fn();
const setCzDacEnabled = vi.fn();
const setModMode = vi.fn();
const clearPendingDestination = vi.fn();
const setLearnMode = vi.fn();

let mockedGlobalPanelOpen = false;
let mockedMidiLearnOpen = false;
let modModeValue = false;
let czDacEnabledValue = false;
let fxSlotsValue = Array.from({ length: 6 }, () => ({
	type: "empty",
	params: { enabled: false },
}));

vi.mock("@/components/primitives/buttons/CzTabButton", () => ({
	default: ({
		topLabel,
		bottomLabel,
		onClick,
		onLongPress,
	}: {
		topLabel: string;
		bottomLabel?: string;
		onClick?: () => void;
		onLongPress?: () => void;
	}) => (
		<button
			type="button"
			onClick={onClick}
			onContextMenu={(event) => {
				event.preventDefault();
				onLongPress?.();
			}}
		>
			{topLabel} {bottomLabel ?? ""}
		</button>
	),
}));

vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn(
		(selector: (state: Record<string, unknown>) => unknown) =>
			selector({
				globalPanelOpen: mockedGlobalPanelOpen,
				setGlobalPanelOpen: setGlobalPanelOpenMock,
				midiLearnOpen: mockedMidiLearnOpen,
				setMidiLearnOpen: setMidiLearnOpenMock,
				setMainPanelMode,
			}),
	),
}));

vi.mock("@/features/synth/modulationTargetStore", () => ({
	useModulationTargetStore: vi.fn(
		(selector: (state: Record<string, unknown>) => unknown) =>
			selector({
				modMode: modModeValue,
				setModMode,
				clearPendingDestination,
			}),
	),
}));

vi.mock("@/features/synth/midiLearnStore", () => ({
	useMidiLearnStore: {
		getState: () => ({
			setLearnMode,
		}),
	},
}));

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn(
		(selector: (state: Record<string, unknown>) => unknown) =>
			selector({
				fxSlots: fxSlotsValue,
				czDacEnabled: czDacEnabledValue,
				setFxSlotType,
				setFxSlotEnabled,
				setCzDacEnabled,
			}),
	),
}));

describe("SynthSidebarButtons", () => {
	beforeEach(() => {
		mockedGlobalPanelOpen = false;
		mockedMidiLearnOpen = false;
		setGlobalPanelOpenMock.mockReset();
		setMidiLearnOpenMock.mockReset();
		setMainPanelMode.mockReset();
		setFxSlotType.mockReset();
		setFxSlotEnabled.mockReset();
		setCzDacEnabled.mockReset();
		setModMode.mockReset();
		clearPendingDestination.mockReset();
		setLearnMode.mockReset();
		modModeValue = false;
		czDacEnabledValue = false;
		fxSlotsValue = Array.from({ length: 6 }, () => ({
			type: "empty",
			params: { enabled: false },
		}));
	});

	it("opens global settings when Global is clicked", () => {
		render(<SynthSidebarButtons />);
		fireEvent.click(screen.getByRole("button", { name: "Global" }));
		expect(setGlobalPanelOpenMock).toHaveBeenCalledWith(true);
	});

	it("opens midi learn modal when MIDI Learn is clicked", () => {
		render(<SynthSidebarButtons />);
		fireEvent.click(screen.getByRole("button", { name: "MIDI Learn" }));
		expect(setMidiLearnOpenMock).toHaveBeenCalledWith(true);
	});

	it("toggles modulation targeting mode", () => {
		render(<SynthSidebarButtons />);
		fireEvent.click(screen.getByRole("button", { name: "MOD+" }));
		expect(setModMode).toHaveBeenCalledWith(true);
		expect(clearPendingDestination).toHaveBeenCalledTimes(1);
		expect(setLearnMode).toHaveBeenCalledWith(false);
	});

	it("toggles the CZ DAC when Vintage is clicked", () => {
		render(<SynthSidebarButtons />);
		fireEvent.click(screen.getByRole("button", { name: "Vint age" }));
		expect(setGlobalPanelOpenMock).not.toHaveBeenCalled();
		expect(setMidiLearnOpenMock).not.toHaveBeenCalled();
		expect(setModMode).not.toHaveBeenCalled();
		expect(setCzDacEnabled).toHaveBeenCalledWith(true);
		expect(setFxSlotEnabled).not.toHaveBeenCalled();
		expect(setFxSlotType).not.toHaveBeenCalled();
	});

	it("toggles enabled fx slots and initializes default empty slots", () => {
		fxSlotsValue[0] = { type: "chorus", params: { enabled: true } };
		render(<SynthSidebarButtons />);
		fireEvent.click(screen.getByRole("button", { name: "FX1 Chrs" }));
		fireEvent.click(screen.getByRole("button", { name: "FX4 —" }));
		fireEvent.click(screen.getByRole("button", { name: "FX5 —" }));
		expect(setFxSlotEnabled).toHaveBeenCalledWith(0, false);
		expect(setFxSlotType).toHaveBeenCalledWith(3, "vibrato");
		expect(setFxSlotType).toHaveBeenCalledWith(4, "phaseMod");
	});

	it("opens the fx drawer on fx long press", () => {
		render(<SynthSidebarButtons />);
		fireEvent.contextMenu(screen.getByRole("button", { name: "FX1 —" }));
		expect(setMainPanelMode).toHaveBeenCalledWith("fx");
	});
});
