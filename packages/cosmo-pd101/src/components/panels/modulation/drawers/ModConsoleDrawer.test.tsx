import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModConsoleDrawer from "./ModConsoleDrawer";

vi.mock("../lfo/LFOModule", () => ({
	default: ({ id }: { id: number }) => <div data-testid={`lfo-${id}`} />,
}));
vi.mock("../random/RandomModule", () => ({
	default: () => <div data-testid="random-module" />,
}));
vi.mock("../envelope/ModEnveloppeModule", () => ({
	default: () => <div data-testid="mod-env-module" />,
}));
vi.mock("../matrix/ModMatrixPanel", () => ({
	default: () => <div data-testid="mod-matrix-panel" />,
}));

describe("ModConsoleDrawer", () => {
	it("renders modulation modules and matrix", () => {
		render(<ModConsoleDrawer />);
		expect(screen.getByTestId("lfo-1")).toBeInTheDocument();
		expect(screen.getByTestId("lfo-2")).toBeInTheDocument();
		expect(screen.getByTestId("random-module")).toBeInTheDocument();
		expect(screen.getByTestId("mod-env-module")).toBeInTheDocument();
		expect(screen.getByTestId("mod-matrix-panel")).toBeInTheDocument();
	});
});
