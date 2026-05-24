import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlobalVoiceModal } from "./GlobalVoiceModal";

vi.mock("@/components/panels/voice/GlobalVoicePanel", () => ({
	default: () => <div data-testid="global-voice-panel-content" />,
}));

describe("GlobalVoiceModal", () => {
	it("renders global voice panel when open", () => {
		render(<GlobalVoiceModal open onClose={vi.fn()} />);
		expect(
			screen.getByRole("dialog", { name: "Global settings" }),
		).toBeInTheDocument();
		expect(
			screen.getByTestId("global-voice-panel-content"),
		).toBeInTheDocument();
	});
});
