import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModMatrixAmountCell from "./ModMatrixAmountCell";

describe("ModMatrixAmountCell", () => {
	it("uses continuous opacity for route depth", () => {
		const { container } = render(
			<ModMatrixAmountCell
				route={{
					source: "lfo1",
					destination: "volume",
					amount: 0.35,
					enabled: true,
				}}
				cell={{ amount: 0.35, enabled: true }}
				source="lfo1"
				destination="volume"
				selected={false}
				ariaLabel="LFO 1 to Volume modulation cell"
				clearHint="Double-click to clear"
				onActivate={vi.fn()}
				onChange={vi.fn()}
				onClear={vi.fn()}
			/>,
		);

		expect(container.querySelector(".mod-matrix-route-fill")).toHaveStyle({
			opacity: "0.2005",
		});
	});
});
