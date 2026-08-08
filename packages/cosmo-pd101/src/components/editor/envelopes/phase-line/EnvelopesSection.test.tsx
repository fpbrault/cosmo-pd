import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EnvelopesSection } from "./EnvelopesSection";

const setActiveEnvTab = vi.fn();
vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn(
		(
			selector: (s: {
				activeEnvTab: "dco";
				setActiveEnvTab: typeof setActiveEnvTab;
			}) => unknown,
		) => selector({ activeEnvTab: "dco", setActiveEnvTab }),
	),
}));
vi.mock("../step/StepEnvelopePreview", () => ({
	StepEnvelopePreview: ({
		title,
		onClick,
	}: {
		title: string;
		onClick: () => void;
	}) => (
		<button type="button" onClick={onClick}>
			{title}
		</button>
	),
}));
vi.mock("../step/StepEnvelopeEditor", () => ({
	default: ({ title }: { title: string }) => (
		<div data-testid="step-env-editor">{title}</div>
	),
}));
vi.mock("./EnvelopeKeyFollowControl", () => ({
	EnvelopeKeyFollowControl: () => <div data-testid="key-follow-control" />,
}));

const env = { steps: [], sustainStep: 0, stepCount: 0, loop: false };

describe("EnvelopesSection", () => {
	it("renders previews and switches tabs", () => {
		render(
			<EnvelopesSection
				envMap={{
					dco: { title: "DCO", env, setEnv: vi.fn(), envColor: "#fff" },
					dcw: { title: "DCW", env, setEnv: vi.fn(), envColor: "#fff" },
					dca: { title: "DCA", env, setEnv: vi.fn(), envColor: "#fff" },
				}}
				voiceMarkers={[]}
				lineIndex={1}
				lineColor="#fff"
				dcwKeyFollow={0}
				onDcwKeyFollowChange={vi.fn()}
				dcaKeyFollow={0}
				onDcaKeyFollowChange={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "DCW" }));
		expect(setActiveEnvTab).toHaveBeenCalledWith("dcw");
		expect(screen.getByTestId("step-env-editor")).toBeInTheDocument();
	});
});
