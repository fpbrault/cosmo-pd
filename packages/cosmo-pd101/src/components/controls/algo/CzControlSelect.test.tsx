import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import CzControlSelect from "./CzControlSelect";

vi.mock("@/components/controls/Button", () => ({
	default: ({
		children,
		...props
	}: {
		children?: ReactNode;
		[key: string]: unknown;
	}) => (
		<button type="button" {...props}>
			{children}
		</button>
	),
}));

vi.mock("@/components/layout/HoverInfo", () => ({
	HoverInfoTrigger: ({
		children,
	}: {
		children: (props: Record<string, unknown>) => unknown;
	}) => children({}),
}));

vi.mock("@/lib/synth/i18nAlgo", () => ({
	useAlgoControl: () => ({ label: "Waveform", description: "" }),
	getAlgoControlOptionLabel: (
		_algo: string,
		_controlId: string,
		value: string,
	) => value,
}));

describe("CzControlSelect", () => {
	it("uses four-column options grid for stacked waveform controls", () => {
		render(
			<CzControlSelect
				control={{
					id: "waveform1",
					kind: "select",
					algo: "cz101",
					options: [
						{ value: "czSaw", label: "Saw", set: [] },
						{ value: "czSquare", label: "Square", set: [] },
					],
				}}
				getActiveSelectOption={() => null}
				applyOptionAssignments={() => {}}
			/>,
		);

		const options = screen.getByTestId("cz-control-options-waveform1");
		expect(options.className).toContain("@min-[200px]:grid-cols-4");
	});
});
