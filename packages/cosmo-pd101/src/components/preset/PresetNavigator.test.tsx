import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import PresetNavigator from "./PresetNavigator";

const { mockUseMidiLearnTarget } = vi.hoisted(() => ({
	mockUseMidiLearnTarget: vi.fn(),
}));

vi.mock("@/features/synth/hooks/useMidiLearnTarget", () => ({
	useMidiLearnTarget: (options: unknown) => mockUseMidiLearnTarget(options),
}));

const entries: PresetEntry[] = [
	{
		id: "builtin-factory-bass",
		label: "Factory Bass",
		type: "library",
		source: "cosmo-factory",
		sourceLabel: "Cosmo Factory Library",
		author: "Purr Audio",
		description: "",
		starred: true,
		favorite: false,
		tags: [],
	},
];

describe("PresetNavigator", () => {
	beforeEach(() => {
		mockUseMidiLearnTarget.mockReset();
		mockUseMidiLearnTarget.mockReturnValue({
			learnMode: false,
			midiLearnState: null,
			interactionLocked: false,
			onClick: vi.fn(),
			onContextMenu: vi.fn(),
		});
	});

	it("opens the full-screen library from the preset display", () => {
		const onLibraryModeChange = vi.fn();

		const { rerender } = render(
			<PresetNavigator
				presetCount={entries.length}
				activePresetName="Current State"
				activePresetSource="Current State"
				onStepPreset={vi.fn()}
				onLibraryModeChange={onLibraryModeChange}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Preset Current State. Open library",
			}),
		);

		expect(onLibraryModeChange).toHaveBeenCalledWith(true);
		expect(screen.queryByText("Preset List")).not.toBeInTheDocument();

		rerender(
			<PresetNavigator
				presetCount={entries.length}
				activePresetName="Current State"
				activePresetSource="Current State"
				onStepPreset={vi.fn()}
				isLibraryModeOpen={true}
				onLibraryModeChange={onLibraryModeChange}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Preset Current State. Close library",
			}),
		);
		expect(onLibraryModeChange).toHaveBeenLastCalledWith(false);
	});

	it("keeps previous and next preset stepping", () => {
		const onStepPreset = vi.fn();

		render(
			<PresetNavigator
				presetCount={entries.length}
				activePresetName="Current State"
				activePresetSource="Current State"
				onStepPreset={onStepPreset}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Previous preset" }));
		fireEvent.click(screen.getByRole("button", { name: "Next preset" }));

		expect(onStepPreset).toHaveBeenNthCalledWith(1, -1);
		expect(onStepPreset).toHaveBeenNthCalledWith(2, 1);
	});

	it("shows MIDI learn overlays on preset buttons when learnMode is active", () => {
		mockUseMidiLearnTarget.mockReturnValue({
			learnMode: true,
			midiLearnState: "available",
			interactionLocked: true,
			onClick: vi.fn(),
			onContextMenu: vi.fn(),
		});

		const { container } = render(
			<PresetNavigator
				presetCount={entries.length}
				activePresetName="Current State"
				activePresetSource="Current State"
				onStepPreset={vi.fn()}
			/>,
		);

		const overlays = container.querySelectorAll(
			".pointer-events-none.absolute.inset-0.z-10",
		);
		expect(overlays.length).toBeGreaterThanOrEqual(2);
	});

	it("shows mapped state on preset buttons when mapping exists", () => {
		mockUseMidiLearnTarget.mockReturnValue({
			learnMode: true,
			midiLearnState: "mapped",
			interactionLocked: true,
			onClick: vi.fn(),
			onContextMenu: vi.fn(),
		});

		const { container } = render(
			<PresetNavigator
				presetCount={entries.length}
				activePresetName="Current State"
				activePresetSource="Current State"
				onStepPreset={vi.fn()}
			/>,
		);

		const overlays = container.querySelectorAll(
			".pointer-events-none.absolute.inset-0.z-10",
		);
		expect(overlays.length).toBeGreaterThanOrEqual(2);
	});

	it("does not render MIDI learn overlays when learnMode is off", () => {
		mockUseMidiLearnTarget.mockReturnValue({
			learnMode: false,
			midiLearnState: null,
			interactionLocked: false,
			onClick: vi.fn(),
			onContextMenu: vi.fn(),
		});

		const { container } = render(
			<PresetNavigator
				presetCount={entries.length}
				activePresetName="Current State"
				activePresetSource="Current State"
				onStepPreset={vi.fn()}
			/>,
		);

		const overlays = container.querySelectorAll(
			".pointer-events-none.absolute.inset-0.z-10",
		);
		expect(overlays.length).toBe(0);
	});

	it("previous preset button click arms MIDI learn in learn mode", () => {
		const onClick = vi.fn();
		mockUseMidiLearnTarget.mockReturnValue({
			learnMode: true,
			midiLearnState: "available",
			interactionLocked: true,
			onClick,
			onContextMenu: vi.fn(),
		});

		const onStepPreset = vi.fn();

		render(
			<PresetNavigator
				presetCount={entries.length}
				activePresetName="Current State"
				activePresetSource="Current State"
				onStepPreset={onStepPreset}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Previous preset" }));
		expect(onClick).toHaveBeenCalled();
		expect(onStepPreset).not.toHaveBeenCalled();
	});
});
