import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PerformanceEnvelopePanel from "./PerformanceEnvelopePanel";

const usePhaseLineModel = vi.hoisted(() => vi.fn());
const uiStore = vi.hoisted(() => {
	let simpleEditedLine: 1 | 2 = 1;
	const listeners = new Set<() => void>();
	return {
		get simpleEditedLine() {
			return simpleEditedLine;
		},
		setSimpleEditedLine(line: 1 | 2) {
			simpleEditedLine = line;
			for (const listener of listeners) listener();
		},
		subscribe(listener: () => void) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
	};
});

vi.mock("@/components/editor/usePhaseLineModel", () => ({
	usePhaseLineModel,
}));

vi.mock("@/features/synth/synthUiStore", async () => {
	const { useSyncExternalStore } = await import("react");
	return {
		useSynthUiStore: (
			selector: (state: { simpleEditedLine: 1 | 2 }) => unknown,
		) =>
			useSyncExternalStore(
				uiStore.subscribe,
				() => selector({ simpleEditedLine: uiStore.simpleEditedLine }),
				() => selector({ simpleEditedLine: uiStore.simpleEditedLine }),
			),
	};
});

vi.mock("./CompactLineEditToggle", () => ({
	default: () => (
		<button
			type="button"
			onClick={() => {
				uiStore.setSimpleEditedLine(2);
			}}
		>
			Edit line 2
		</button>
	),
}));

vi.mock("./CompactEnvelopePreset", () => ({
	default: ({
		envKind,
		editorOpen,
		onEditorToggle,
		onPresetOpen,
	}: {
		envKind: "dco" | "dcw" | "dca";
		editorOpen: boolean;
		onEditorToggle: () => void;
		onPresetOpen: () => void;
	}) => (
		<div>
			<button type="button" onClick={onEditorToggle}>
				Open {envKind.toUpperCase()} editor
			</button>
			<button type="button" onClick={onPresetOpen}>
				Open {envKind.toUpperCase()} presets
			</button>
			{editorOpen ? (
				<div role="dialog" aria-label={`${envKind.toUpperCase()} editor`} />
			) : null}
		</div>
	),
}));

const envelope = {
	steps: Array.from({ length: 8 }, () => ({ level: 0, rate: 50 })),
	sustainStep: 0,
	stepCount: 1,
	loop: false,
};

function createLine(lineIndex: 1 | 2) {
	return {
		meta: { isAudible: true, color: lineIndex === 1 ? "#9cb937" : "#60a5fa" },
		envelopes: {
			envs: {
				dco: { env: envelope, setEnv: vi.fn(), envColor: "#9cb937" },
				dcw: { env: envelope, setEnv: vi.fn(), envColor: "#60a5fa" },
				dca: { env: envelope, setEnv: vi.fn(), envColor: "#f97316" },
			},
		},
	};
}

describe("PerformanceEnvelopePanel", () => {
	beforeEach(() => {
		uiStore.setSimpleEditedLine(1);
		usePhaseLineModel.mockImplementation((lineIndex: 1 | 2) =>
			createLine(lineIndex),
		);
	});

	it("closes the active editor for another editor, a preset list, or a line change", () => {
		render(<PerformanceEnvelopePanel />);

		fireEvent.click(screen.getByRole("button", { name: "Open DCO editor" }));
		expect(screen.getByRole("dialog", { name: "DCO editor" })).toBeVisible();

		fireEvent.click(screen.getByRole("button", { name: "Open DCW editor" }));
		expect(screen.queryByRole("dialog", { name: "DCO editor" })).toBeNull();
		expect(screen.getByRole("dialog", { name: "DCW editor" })).toBeVisible();

		fireEvent.click(screen.getByRole("button", { name: "Open DCO presets" }));
		expect(screen.queryByRole("dialog")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Open DCW editor" }));
		expect(screen.getByRole("dialog", { name: "DCW editor" })).toBeVisible();
		fireEvent.click(screen.getByRole("button", { name: "Open DCW editor" }));
		expect(screen.queryByRole("dialog")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Open DCA editor" }));
		fireEvent.click(screen.getByRole("button", { name: "Edit line 2" }));
		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
