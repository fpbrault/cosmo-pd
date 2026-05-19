import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { HoverInfoProvider, HoverInfoTrigger } from "./HoverInfo";
import MiniKeyboardOverlay from "./MiniKeyboardOverlay";
import SynthInfoBar from "./SynthInfoBar";
import SynthPanelContainer from "./SynthPanelContainer";
import SynthSidebarButtons from "./SynthSidebarButtons";

vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn(() => ({
		setMainPanelMode: vi.fn(),
	})),
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: vi.fn(() => ({
		value: "poly8",
		setValue: vi.fn(),
	})),
}));

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn(() => ({
		fxSlots: Array.from({ length: 6 }, () => ({
			type: "empty",
			params: { enabled: false },
		})),
		setFxSlotType: vi.fn(),
		setFxSlotEnabled: vi.fn(),
	})),
}));

describe("Layout Components Smoke Tests", () => {
	describe("SynthSidebarButtons", () => {
		it("renders without crashing", () => {
			render(
				<SynthSidebarButtons
					globalOpen={false}
					onOpenGlobal={vi.fn()}
					midiLearnOpen={false}
					onOpenMidiLearn={vi.fn()}
				/>,
			);
		});
	});

	describe("HoverInfo", () => {
		it("renders without crashing", () => {
			render(
				<HoverInfoProvider>
					<HoverInfoTrigger message="Test info">
						{() => <div>Triggered</div>}
					</HoverInfoTrigger>
				</HoverInfoProvider>,
			);
		});
	});

	describe("MiniKeyboardOverlay", () => {
		it("renders without crashing", () => {
			render(
				<MiniKeyboardOverlay
					activeNotes={[]}
					visible={true}
					onNoteOn={vi.fn()}
					onNoteOff={vi.fn()}
				/>,
			);
		});
	});

	describe("SynthInfoBar", () => {
		it("renders without crashing", () => {
			render(
				<SynthInfoBar
					infoText="Test Info"
					showKeyboardToggle={true}
					keyboardVisible={false}
					onKeyboardToggle={vi.fn()}
				/>,
			);
		});
	});

	describe("SynthPanelContainer", () => {
		it("renders without crashing", () => {
			render(
				<SynthPanelContainer
					enabled={true}
					showEnableToggle={true}
					onToggleEnabled={vi.fn()}
				>
					<div>Content</div>
				</SynthPanelContainer>,
			);
		});
	});
});
