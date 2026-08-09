import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PresetPopover, { type PresetPopoverProps } from "./PresetPopover";

const options = [
	{ id: "slow", label: "Slow" },
	{ id: "bright", label: "Bright" },
];

function renderPopover(overrides: Partial<PresetPopoverProps> = {}) {
	return render(
		<PresetPopover
			title="LFO"
			value="slow"
			options={options}
			onChange={vi.fn()}
			{...overrides}
		/>,
	);
}

describe("PresetPopover", () => {
	it("exposes the trigger and current option through the listbox ARIA state", async () => {
		const user = userEvent.setup();
		renderPopover({ value: "bright" });

		const trigger = screen.getByRole("button", { name: "LFO presets" });
		expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
		expect(trigger).toHaveAttribute("aria-expanded", "false");

		await user.click(trigger);

		const listbox = screen.getByRole("listbox", { name: "LFO presets" });
		expect(trigger).toHaveAttribute("aria-expanded", "true");
		expect(listbox).toHaveAttribute("aria-activedescendant", "preset-opt-1");
		expect(screen.getByRole("option", { name: "Bright" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByRole("option", { name: "Slow" })).toHaveAttribute(
			"aria-selected",
			"false",
		);
	});

	it("selects a preset with listbox keyboard navigation and closes", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderPopover({ onChange });

		const trigger = screen.getByRole("button", { name: "LFO presets" });
		await user.click(trigger);
		const listbox = screen.getByRole("listbox", { name: "LFO presets" });
		listbox.focus();

		await user.keyboard("{End}{Enter}");

		expect(onChange).toHaveBeenCalledWith("bright");
		expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(
			screen.queryByRole("listbox", { name: "LFO presets" }),
		).not.toBeInTheDocument();
	});

	it("labels the save dialog and reports the trimmed saved name", async () => {
		const user = userEvent.setup();
		const onSavePreset = vi.fn();
		renderPopover({ onSavePreset });

		await user.click(screen.getByRole("button", { name: "LFO presets" }));
		await user.click(screen.getByRole("button", { name: "+ Save" }));

		const dialog = screen.getByRole("dialog", { name: "Save FX Preset As" });
		expect(dialog).toHaveAttribute("aria-labelledby");
		await user.type(
			screen.getByPlaceholderText("Preset name"),
			"  New Patch  ",
		);
		await user.click(screen.getByRole("button", { name: "Save" }));

		expect(onSavePreset).toHaveBeenCalledWith("New Patch");
	});

	it("only offers deletion for the selected user preset", async () => {
		const user = userEvent.setup();
		const onDeletePreset = vi.fn();
		renderPopover({
			value: "user-preset",
			onDeletePreset,
			builtinPresetIds: new Set(["slow", "bright"]),
		});

		await user.click(screen.getByRole("button", { name: "LFO presets" }));
		expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Delete" }));
		expect(onDeletePreset).toHaveBeenCalledWith("user-preset");
		expect(
			screen.queryByRole("dialog", { name: "LFO presets" }),
		).not.toBeInTheDocument();
	});

	it("announces unavailable presets as a disabled control", () => {
		renderPopover({ disabled: true });

		const trigger = screen.getByRole("button", {
			name: "LFO presets unavailable",
		});
		expect(trigger).toBeDisabled();
	});
});
