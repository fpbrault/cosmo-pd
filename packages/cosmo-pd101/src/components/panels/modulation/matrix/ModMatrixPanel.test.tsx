import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ModMatrixPanel from "./ModMatrixPanel";

const useModMatrixMock = vi.fn();

vi.mock("motion/react", () => ({
	AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
	motion: {
		div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
			<div {...props}>{children}</div>
		),
	},
}));

vi.mock("@/context/ModMatrixContext", () => ({
	useModMatrix: () => useModMatrixMock(),
}));

vi.mock("@/components/controls/modulation/ModRouteRow", () => ({
	default: () => <div data-testid="mod-route-row" />,
	MOD_SOURCE_META: {
		lfo1: {
			label: "LFO 1",
			shortLabel: "LFO1",
			colorClass: "text-blue-400",
			bgClass: "bg-blue-400/20",
		},
		lfo2: {
			label: "LFO 2",
			shortLabel: "LFO2",
			colorClass: "text-cyan-400",
			bgClass: "bg-cyan-400/20",
		},
		random: {
			label: "Random",
			shortLabel: "RND",
			colorClass: "text-orange-400",
			bgClass: "bg-orange-400/20",
		},
		modEnv: {
			label: "Mod Env",
			shortLabel: "ENV",
			colorClass: "text-emerald-400",
			bgClass: "bg-emerald-400/20",
		},
		velocity: {
			label: "Velocity",
			shortLabel: "VEL",
			colorClass: "text-yellow-400",
			bgClass: "bg-yellow-400/20",
		},
		modWheel: {
			label: "Mod Wheel",
			shortLabel: "MW",
			colorClass: "text-purple-400",
			bgClass: "bg-purple-400/20",
		},
		aftertouch: {
			label: "Aftertouch",
			shortLabel: "AT",
			colorClass: "text-pink-400",
			bgClass: "bg-pink-400/20",
		},
	},
}));

vi.mock("@/components/controls/modulation/ModRouteEditorPanel", () => ({
	default: ({
		title,
		confirmLabel,
	}: {
		title: string;
		confirmLabel: string;
	}) => (
		<div data-testid="mod-route-editor">
			<span data-testid="editor-title">{title}</span>
			<span data-testid="editor-confirm">{confirmLabel}</span>
		</div>
	),
}));

describe("ModMatrixPanel", () => {
	beforeEach(() => {
		useModMatrixMock.mockReset();
		useModMatrixMock.mockReturnValue({
			modMatrix: { routes: [] },
			setModMatrix: vi.fn(),
		});
	});

	it("shows empty state when no routes", () => {
		render(<ModMatrixPanel />);
		expect(screen.getByText("No routes")).toBeInTheDocument();
	});

	it("opens add route editor when Add Route is clicked", () => {
		render(<ModMatrixPanel />);

		fireEvent.click(screen.getByRole("button", { name: "Add Route" }));

		expect(screen.getByTestId("mod-route-editor")).toBeInTheDocument();
		expect(screen.getByTestId("editor-title")).toHaveTextContent("Add Route");
	});

	it("does not emit duplicate key warnings when routes load after mount", () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const setModMatrix = vi.fn();
		useModMatrixMock.mockReturnValue({
			modMatrix: { routes: [] },
			setModMatrix,
		});

		const { rerender } = render(<ModMatrixPanel />);

		useModMatrixMock.mockReturnValue({
			modMatrix: {
				routes: [
					{
						source: "lfo1",
						destination: "volume",
						amount: 0,
						enabled: true,
					},
					{
						source: "lfo2",
						destination: "volume",
						amount: 0,
						enabled: true,
					},
				],
			},
			setModMatrix,
		});
		rerender(<ModMatrixPanel />);

		expect(
			consoleErrorSpy.mock.calls.some(([message]) =>
				String(message).includes('unique "key" prop'),
			),
		).toBe(false);
		expect(
			consoleErrorSpy.mock.calls.some(([message]) =>
				String(message).includes("Encountered two children with the same key"),
			),
		).toBe(false);

		consoleErrorSpy.mockRestore();
	});
});
