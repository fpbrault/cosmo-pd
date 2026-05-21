import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import SynthSidebarButtons from "./SynthSidebarButtons";

const setMainPanelMode = vi.fn();
const setFxSlotType = vi.fn();
const setFxSlotEnabled = vi.fn();
const setCzDacEnabled = vi.fn();
const setModMode = vi.fn();
const clearPendingDestination = vi.fn();
const setLearnMode = vi.fn();

let modModeValue = false;
let czDacEnabledValue = false;
let fxSlotsValue = Array.from({ length: 6 }, () => ({
	type: "empty",
	params: { enabled: false },
}));

vi.mock("@/components/primitives/CzTabButton", () => ({
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
	useSynthUiStore: vi.fn(() => ({
		setMainPanelMode,
	})),
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
		vi.mocked(useSynthUiStore).mockImplementation((selector) =>
			selector({
				setMainPanelMode,
			} as never),
		);
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
		const onOpenGlobal = vi.fn();
		const onOpenMidiLearn = vi.fn();
		render(
			<SynthSidebarButtons
				globalOpen={false}
				onOpenGlobal={onOpenGlobal}
				midiLearnOpen={false}
				onOpenMidiLearn={onOpenMidiLearn}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Global" }));
		expect(onOpenGlobal).toHaveBeenCalledTimes(1);
	});

	it("opens midi learn modal when MIDI Learn is clicked", () => {
		const onOpenMidiLearn = vi.fn();
		render(
			<SynthSidebarButtons
				globalOpen={false}
				onOpenGlobal={vi.fn()}
				midiLearnOpen={false}
				onOpenMidiLearn={onOpenMidiLearn}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "MIDI Learn" }));
		expect(onOpenMidiLearn).toHaveBeenCalledTimes(1);
	});

	it("toggles modulation targeting mode", () => {
		render(
			<SynthSidebarButtons
				globalOpen={false}
				onOpenGlobal={vi.fn()}
				midiLearnOpen={false}
				onOpenMidiLearn={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "MOD+" }));
		expect(setModMode).toHaveBeenCalledWith(true);
		expect(clearPendingDestination).toHaveBeenCalledTimes(1);
		expect(setLearnMode).toHaveBeenCalledWith(false);
	});

	it("toggles the CZ DAC when Vintage is clicked", () => {
		const onOpenGlobal = vi.fn();
		const onOpenMidiLearn = vi.fn();
		render(
			<SynthSidebarButtons
				globalOpen={false}
				onOpenGlobal={onOpenGlobal}
				midiLearnOpen={false}
				onOpenMidiLearn={onOpenMidiLearn}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Vint age" }));
		expect(onOpenGlobal).not.toHaveBeenCalled();
		expect(onOpenMidiLearn).not.toHaveBeenCalled();
		expect(setModMode).not.toHaveBeenCalled();
		expect(setCzDacEnabled).toHaveBeenCalledWith(true);
		expect(setFxSlotEnabled).not.toHaveBeenCalled();
		expect(setFxSlotType).not.toHaveBeenCalled();
	});

	it("toggles enabled fx slots and initializes default empty slots", () => {
		fxSlotsValue[0] = { type: "chorus", params: { enabled: true } };
		render(
			<SynthSidebarButtons
				globalOpen={false}
				onOpenGlobal={vi.fn()}
				midiLearnOpen={false}
				onOpenMidiLearn={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "FX1 Chrs" }));
		fireEvent.click(screen.getByRole("button", { name: "FX4 —" }));
		fireEvent.click(screen.getByRole("button", { name: "FX5 —" }));
		expect(setFxSlotEnabled).toHaveBeenCalledWith(0, false);
		expect(setFxSlotType).toHaveBeenCalledWith(3, "vibrato");
		expect(setFxSlotType).toHaveBeenCalledWith(4, "phaseMod");
	});

	it("opens the fx drawer on fx long press", () => {
		render(
			<SynthSidebarButtons
				globalOpen={false}
				onOpenGlobal={vi.fn()}
				midiLearnOpen={false}
				onOpenMidiLearn={vi.fn()}
			/>,
		);
		fireEvent.contextMenu(screen.getByRole("button", { name: "FX1 —" }));
		expect(setMainPanelMode).toHaveBeenCalledWith("fx");
	});
});
