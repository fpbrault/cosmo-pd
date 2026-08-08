import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModuleFrame from "./ModuleFrame";

describe("ModuleFrame", () => {
	it("renders preset footer and disabled power button when no onToggleEnabled", () => {
		render(
			<ModuleFrame
				title="Delay"
				color="#fbbf24"
				enabled
				presetValue=""
				presetOptions={[{ id: "wide", label: "Wide" }]}
				onPresetChange={vi.fn()}
			>
				<div>content</div>
			</ModuleFrame>,
		);

		expect(
			screen.getByRole("button", { name: /disable delay/i }),
		).toBeDisabled();
		expect(screen.getByLabelText("Delay Presets presets")).toBeInTheDocument();
	});

	it("calls onToggleEnabled when power button is clicked", () => {
		const onToggle = vi.fn();
		render(
			<ModuleFrame
				title="EQ"
				color="#fbbf24"
				enabled
				onToggleEnabled={onToggle}
			>
				<div>content</div>
			</ModuleFrame>,
		);

		screen.getByRole("button", { name: /disable eq/i }).click();
		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it("shows enable label when module is disabled", () => {
		render(
			<ModuleFrame
				title="Delay"
				color="#fbbf24"
				enabled={false}
				onToggleEnabled={vi.fn()}
			>
				<div>content</div>
			</ModuleFrame>,
		);

		expect(
			screen.getByRole("button", { name: /enable delay/i }),
		).toBeInTheDocument();
	});

	it("renders a disabled preset footer when presets are unavailable", () => {
		const { container } = render(
			<ModuleFrame
				title="Random"
				color="#c2571a"
				enabled
				presetValue=""
				presetOptions={[]}
				onPresetChange={vi.fn()}
				presetDisabled
			>
				<div>content</div>
			</ModuleFrame>,
		);

		const footer = container.querySelector("[data-footer]");
		expect(footer).not.toBeNull();
		expect(
			within(footer as HTMLElement).getByRole("button", {
				name: "Random Presets presets unavailable",
			}),
		).toBeDisabled();
	});

	it("renders the header action slot", () => {
		render(
			<ModuleFrame
				title="Bitcrusher"
				color="#f87171"
				enabled
				headerAction={<button type="button">Bitcrusher</button>}
			>
				<div>content</div>
			</ModuleFrame>,
		);

		expect(
			screen.getByRole("button", { name: "Bitcrusher" }),
		).toBeInTheDocument();
	});
});
