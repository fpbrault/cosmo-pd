import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import PresetNavigator, { type PresetNavigatorProps } from "./PresetNavigator";

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
		bankId: "cosmo-factory",
		bankName: "Cosmo Factory Library",
		author: "Purr Audio",
		description: "",
		starred: true,
		favorite: false,
		tags: ["Bass"],
	},
	{
		id: "local-keys",
		label: "Local Keys",
		type: "local",
		source: "user",
		sourceLabel: "User",
		author: "You",
		description: "",
		starred: false,
		favorite: true,
		tags: ["Keys"],
	},
];

function createProps(
	overrides: Partial<PresetNavigatorProps> = {},
): PresetNavigatorProps {
	return {
		presetCount: entries.length,
		entries,
		activeEntry: entries[0] ?? null,
		activePresetName: "Factory Bass",
		activePresetNameBase: "Factory Bass",
		isPresetDirty: false,
		persistenceDisabled: false,
		onStepPreset: vi.fn(),
		onActivatePreset: vi.fn().mockResolvedValue(undefined),
		onNavigationEntriesChange: vi.fn(),
		onSetPresetFavorite: vi.fn().mockResolvedValue(undefined),
		onSavePreset: vi.fn().mockResolvedValue(undefined),
		onSavePresetAs: vi.fn().mockResolvedValue(undefined),
		onLibraryModeChange: vi.fn(),
		...overrides,
	};
}

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

	it("renders the approved control order and preset metadata", () => {
		render(<PresetNavigator {...createProps()} />);

		const visibleButtons = screen.getAllByRole("button");
		expect(
			visibleButtons.map((button) => button.getAttribute("aria-label")),
		).toEqual([
			"Open library",
			"Previous preset",
			"Favorite Factory Bass",
			"Choose preset. Current preset: Factory Bass",
			"Next preset",
			"Save preset as",
		]);
		expect(
			screen.getByText("Cosmo Factory Library · Purr Audio"),
		).toBeVisible();
		expect(screen.getByRole("img", { name: "Featured preset" })).toBeVisible();
	});

	it("uses only the dedicated library button for the full library", () => {
		const props = createProps();
		const { rerender } = render(<PresetNavigator {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Open library" }));
		expect(props.onLibraryModeChange).toHaveBeenCalledWith(true);

		rerender(<PresetNavigator {...props} isLibraryModeOpen={true} />);
		fireEvent.click(screen.getByRole("button", { name: "Close library" }));
		expect(props.onLibraryModeChange).toHaveBeenLastCalledWith(false);
	});

	it("toggles the active preset favorite inside the screen", async () => {
		const props = createProps();
		render(<PresetNavigator {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "Favorite Factory Bass" }),
		);

		await waitFor(() =>
			expect(props.onSetPresetFavorite).toHaveBeenCalledWith(
				"builtin-factory-bass",
				true,
			),
		);
	});

	it("searches and loads a preset from quick select", async () => {
		const props = createProps();
		render(<PresetNavigator {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Choose preset. Current preset: Factory Bass",
			}),
		);
		expect(
			screen.getByRole("dialog", { name: "Quick preset select" }),
		).toBeVisible();

		fireEvent.change(screen.getByPlaceholderText("Search presets"), {
			target: { value: "keys" },
		});
		expect(screen.queryByRole("option", { name: /Factory Bass/ })).toBeNull();

		fireEvent.click(screen.getByRole("option", { name: /Local Keys/ }));
		await waitFor(() =>
			expect(props.onActivatePreset).toHaveBeenCalledWith("local-keys"),
		);
		expect(props.onNavigationEntriesChange).toHaveBeenCalledWith([
			"local-keys",
		]);
		await waitFor(() =>
			expect(
				screen.queryByRole("dialog", { name: "Quick preset select" }),
			).toBeNull(),
		);
	});

	it("saves a dirty user preset directly", async () => {
		const props = createProps({
			activeEntry: entries[1] ?? null,
			activePresetName: "Local Keys *",
			activePresetNameBase: "Local Keys",
			isPresetDirty: true,
		});
		render(<PresetNavigator {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Save preset" }));
		await waitFor(() =>
			expect(props.onSavePreset).toHaveBeenCalledWith("Local Keys"),
		);
	});

	it("opens Save As for a factory preset", async () => {
		const props = createProps();
		render(<PresetNavigator {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Save preset as" }));
		fireEvent.change(screen.getByPlaceholderText("New preset name"), {
			target: { value: "Factory Bass Copy" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Confirm save as" }));

		await waitFor(() =>
			expect(props.onSavePresetAs).toHaveBeenCalledWith("Factory Bass Copy"),
		);
	});

	it("disables save for a clean user preset", () => {
		render(
			<PresetNavigator
				{...createProps({
					activeEntry: entries[1] ?? null,
					activePresetName: "Local Keys",
					activePresetNameBase: "Local Keys",
				})}
			/>,
		);

		expect(screen.getByRole("button", { name: "Save preset" })).toBeDisabled();
	});

	it("keeps previous and next preset stepping", () => {
		const props = createProps();
		render(<PresetNavigator {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Previous preset" }));
		fireEvent.click(screen.getByRole("button", { name: "Next preset" }));

		expect(props.onStepPreset).toHaveBeenNthCalledWith(1, -1);
		expect(props.onStepPreset).toHaveBeenNthCalledWith(2, 1);
	});

	it("keeps MIDI learn overlays on the arrow buttons", () => {
		mockUseMidiLearnTarget.mockReturnValue({
			learnMode: true,
			midiLearnState: "available",
			interactionLocked: true,
			onClick: vi.fn(),
			onContextMenu: vi.fn(),
		});

		const { container } = render(<PresetNavigator {...createProps()} />);
		const overlays = container.querySelectorAll(
			".pointer-events-none.absolute.inset-0.z-10",
		);
		expect(overlays).toHaveLength(2);
	});

	it("arms MIDI learn instead of stepping when learn mode is active", () => {
		const onClick = vi.fn();
		mockUseMidiLearnTarget.mockReturnValue({
			learnMode: true,
			midiLearnState: "available",
			interactionLocked: true,
			onClick,
			onContextMenu: vi.fn(),
		});
		const props = createProps();
		render(<PresetNavigator {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Previous preset" }));
		expect(onClick).toHaveBeenCalled();
		expect(props.onStepPreset).not.toHaveBeenCalled();
	});
});
