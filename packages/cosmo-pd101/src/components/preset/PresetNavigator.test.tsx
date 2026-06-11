import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import PresetNavigator from "./PresetNavigator";

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
});
