import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BaseWaveSelector } from "./BaseWaveSelector";

vi.mock("./BaseWaveformIcon", () => ({
	BaseWaveformIcon: () => <div data-testid="wave-icon" />,
}));

describe("BaseWaveSelector", () => {
	it("changes waveform when enabled", () => {
		const onChange = vi.fn();
		render(
			<BaseWaveSelector
				title="Wave"
				value="sine"
				onChange={onChange}
				disabled={false}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /saw/i }));
		expect(onChange).toHaveBeenCalledWith("saw");
	});
});
