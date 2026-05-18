import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import AsidePanelSwitcher from "./AsidePanelSwitcher";
import { HoverInfoProvider, HoverInfoTrigger } from "./HoverInfo";
import MiniKeyboardOverlay from "./MiniKeyboardOverlay";
import SynthInfoBar from "./SynthInfoBar";
import SynthPanelContainer from "./SynthPanelContainer";

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
		fxSlots: {},
		setFxSlotType: vi.fn(),
		setFxSlotEnabled: vi.fn(),
	})),
}));

describe("Layout Components Smoke Tests", () => {
	describe("AsidePanelSwitcher", () => {
		it("renders without crashing", () => {
			const MockPanel = () => <div>Panel</div>;
			MockPanel.panelId = "global";
			MockPanel.panelTab = { topLabel: "Global", bottomLabel: "Global" };

			render(
				<AsidePanelSwitcher activeTab="global" onTabChange={vi.fn()}>
					<MockPanel />
				</AsidePanelSwitcher>,
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
