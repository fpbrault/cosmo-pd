import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModConsoleDrawer from "./ModConsoleDrawer";

vi.mock("../drawer-modules/LFOModule", () => ({
	default: ({ id }: { id: number }) => <div data-testid={`lfo-${id}`} />,
}));
vi.mock("../drawer-modules/RandomModule", () => ({
	default: () => <div data-testid="random-module" />,
}));
vi.mock("../drawer-modules/ModEnveloppeModule", () => ({
	default: () => <div data-testid="mod-env-module" />,
}));
vi.mock("../modulation-matrix/ModMatrixPanel", () => ({
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
